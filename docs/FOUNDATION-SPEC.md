# DOODLE — Foundation Spec

_Single-brand DTC kids' clothing site. Next.js 16 + React 19 + Tailwind v4 + TypeScript on Vercel. Production-grade foundation that grows from waitlist (today) into commerce (Razorpay, products, cart, checkout, orders) on the same codebase._

_Last updated: 2026-05-04. Owner: Ash._

---

## 1. Executive Summary

This spec defines the production foundation for DOODLE on the locked stack: Next.js 16 + React 19 + Tailwind v4 + TypeScript, Neon Postgres with DB-enforced Row-Level Security via `pg_session_jwt`, Drizzle ORM with `drizzle-orm/neon` policy helpers, Auth.js v5 in JWT mode signing RS256 with `jose` and exposing JWKS for Neon to verify, Cloudinary for product imagery, Resend + React Email for transactional mail, Cloudflare Turnstile for waitlist spam protection, Sentry for errors, PostHog for analytics, and `@t3-oss/env-nextjs` for env validation. Per-PR Neon branches via the native Vercel + Neon integration give every preview deploy an isolated database. The spec respects what's shipped (Hero v3, PatchScrubber, brand tokens) and adds, never replaces, those layers.

## 2. Architecture Overview

### 2.1 Block diagram

```
                                     ┌─────────────────────────────┐
                                     │  Cloudflare (Turnstile JS)  │
                                     └──────────────┬──────────────┘
                                                    │ token
┌─────────────┐    HTTPS    ┌──────────────────┐    ▼    ┌────────────────────┐
│  Browser    │────────────▶│ Vercel Edge      │────────▶│ Next.js 16         │
│ (React 19)  │◀────────────│ (CDN + proxy.ts) │◀────────│ App Router (Node)  │
└─────────────┘             └──────────────────┘         └────────┬───────────┘
                                                                  │
                          ┌─────────────────┬─────────────────────┼────────────────────┐
                          ▼                 ▼                     ▼                    ▼
                  ┌──────────────┐  ┌──────────────┐    ┌────────────────┐   ┌────────────────┐
                  │ Cloudinary   │  │ Resend       │    │ Razorpay       │   │ Auth.js v5     │
                  │ (images)     │  │ (email)      │    │ (payments)     │   │ + jose (RSA)   │
                  └──────────────┘  └──────────────┘    └────────────────┘   └───────┬────────┘
                                                                                     │ JWT (RS256)
                                                            ┌────────────────────────┘
                                                            ▼
                                          ┌────────────────────────────────────┐
                                          │ Neon Postgres                      │
                                          │  - owner role  (DATABASE_URL)      │
                                          │  - authenticated (DATABASE_AUTH_URL)│
                                          │  - pg_session_jwt extension        │
                                          │  - RLS policies (Drizzle crudPolicy)│
                                          └────────────────────────────────────┘
                                                            ▲
                                            JWKS verify     │
                                       ┌────────────────────┘
                                       │
                         /.well-known/jwks.json (Next.js route handler)
```

### 2.2 Public visitor flow

`browser → Vercel CDN → proxy.ts (no-op for public routes) → React Server Component → optional read via Drizzle on owner role (cached with 'use cache') → HTML stream`. No JWT, no DB write. ([Next.js proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy))

### 2.3 Authenticated user flow

`browser → POST /api/auth/* → Auth.js v5 issues RS256 JWT signed by jose with our private key → JWT stored in cookie → on every authenticated request, server reads JWT from cookie → Drizzle opens a transaction on the authenticated connection → SET LOCAL request.jwt.claims = '<jwt>' → Postgres pg_session_jwt verifies signature against the JWKS Neon already pulled from /.well-known/jwks.json → RLS policies fire on every SELECT/INSERT/UPDATE/DELETE → only rows where auth.user_id() matches userId are returned`. ([Neon: secure backend RLS with Drizzle](https://neon.com/docs/guides/rls-query-execution), [pg_session_jwt extension](https://neon.com/docs/extensions/pg_session_jwt))

### 2.4 Admin flow

Same Auth.js login. JWT carries a `role: 'admin'` custom claim added in the Auth.js `jwt` callback. `proxy.ts` gates `/admin/*` paths on `role === 'admin'`. RLS policies on admin-only tables (`products`, `productVariants`, `productImages`, `content`, `waitlist`) check the role claim, not just `userId`. ([Auth.js: protecting routes](https://authjs.dev/getting-started/session-management/protecting), [Next.js 16 proxy](https://nextjs.org/docs/app/getting-started/proxy))

## 3. Database Schema (Drizzle TypeScript)

All tables live in `src/db/schema/`. One file per concern; one barrel `src/db/schema/index.ts`.

### 3.1 `src/db/schema/auth.ts` (Auth.js Drizzle adapter shape)

The Drizzle adapter expects this exact shape. ([Auth.js Drizzle adapter](https://authjs.dev/getting-started/adapters/drizzle))

```typescript
import { pgTable, text, timestamp, primaryKey, integer, boolean, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { crudPolicy, authenticatedRole, anonymousRole, authUid } from "drizzle-orm/neon";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("email_verified", { mode: "date", withTimezone: true }),
    image: text("image"),
    role: text("role").notNull().default("user"), // 'user' | 'admin'
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("users_email_idx").on(t.email),
    crudPolicy({
      role: authenticatedRole,
      read: sql`auth.user_id() = ${t.id}`,
      modify: sql`auth.user_id() = ${t.id}`,
    }),
  ],
);

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("accounts_user_id_idx").on(t.userId),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("session_token").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { withTimezone: true, mode: "date" }).notNull(),
  },
  (t) => [index("sessions_user_id_idx").on(t.userId)],
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true, mode: "date" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);
```

> Note: in JWT mode the `sessions` table can be omitted, but we keep it so that switching to database-strategy is a config flip, not a migration. ([Auth.js: Drizzle adapter optional tables](https://authjs.dev/getting-started/adapters/drizzle))

### 3.2 `src/db/schema/waitlist.ts`

```typescript
import { pgTable, text, timestamp, index, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { crudPolicy, anonymousRole, authenticatedRole } from "drizzle-orm/neon";

export const waitlist = pgTable(
  "waitlist",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    name: text("name"),
    source: text("source").notNull().default("hero"), // hero | dual_cta | footer
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  },
  (t) => [
    index("waitlist_email_idx").on(t.email),
    index("waitlist_created_at_idx").on(t.createdAt),
    // Anonymous can INSERT (signup), cannot read.
    crudPolicy({ role: anonymousRole, read: false, modify: sql`true` }),
    // Authenticated regular users: same as anon (no read).
    crudPolicy({ role: authenticatedRole, read: false, modify: false }),
  ],
);
```

> Admin reads bypass RLS via the owner connection in the admin viewer route handler (server-only).

### 3.3 `src/db/schema/products.ts`

```typescript
import { pgTable, text, timestamp, integer, uuid, index, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { crudPolicy, anonymousRole, authenticatedRole } from "drizzle-orm/neon";

export const productStatusEnum = ["draft", "active", "archived"] as const;

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    basePrice: integer("base_price").notNull(), // paise
    status: text("status", { enum: productStatusEnum }).notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("products_slug_idx").on(t.slug),
    index("products_status_idx").on(t.status),
    // Public catalog read of active products only.
    crudPolicy({ role: anonymousRole, read: sql`status = 'active'`, modify: false }),
    crudPolicy({ role: authenticatedRole, read: sql`status = 'active'`, modify: false }),
  ],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    size: text("size").notNull(), // S | M | L
    color: text("color").notNull(),
    sku: text("sku").notNull().unique(),
    price: integer("price").notNull(), // paise
    inventory: integer("inventory").notNull().default(0),
  },
  (t) => [
    index("variants_product_id_idx").on(t.productId),
    index("variants_sku_idx").on(t.sku),
    crudPolicy({ role: anonymousRole, read: true, modify: false }),
    crudPolicy({ role: authenticatedRole, read: true, modify: false }),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    cloudinaryPublicId: text("cloudinary_public_id").notNull(),
    alt: text("alt").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [
    index("images_product_id_idx").on(t.productId),
    crudPolicy({ role: anonymousRole, read: true, modify: false }),
    crudPolicy({ role: authenticatedRole, read: true, modify: false }),
  ],
);
```

### 3.4 `src/db/schema/orders.ts`

```typescript
import { pgTable, text, timestamp, integer, uuid, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { crudPolicy, authenticatedRole, authUid } from "drizzle-orm/neon";
import { users } from "./auth";
import { productVariants } from "./products";

export const orderStatusEnum = ["created", "paid", "fulfilled", "cancelled", "refunded"] as const;

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" })
      .default(sql`(auth.user_id())`),
    line1: text("line1").notNull(),
    line2: text("line2"),
    city: text("city").notNull(),
    state: text("state").notNull(),
    pincode: text("pincode").notNull(),
    country: text("country").notNull().default("IN"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("addresses_user_id_idx").on(t.userId),
    crudPolicy({
      role: authenticatedRole,
      read: authUid(t.userId),
      modify: authUid(t.userId),
    }),
  ],
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" })
      .default(sql`(auth.user_id())`),
    addressId: uuid("address_id").references(() => addresses.id),
    total: integer("total").notNull(), // paise
    status: text("status", { enum: orderStatusEnum }).notNull().default("created"),
    razorpayOrderId: text("razorpay_order_id").unique(),
    razorpayPaymentId: text("razorpay_payment_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("orders_user_id_idx").on(t.userId),
    index("orders_status_idx").on(t.status),
    index("orders_razorpay_order_id_idx").on(t.razorpayOrderId),
    crudPolicy({
      role: authenticatedRole,
      read: authUid(t.userId),
      // Inserts allowed only when row's userId equals JWT user. Updates only by webhooks (owner role).
      modify: sql`auth.user_id() = ${t.userId} AND status = 'created'`,
    }),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").notNull().references(() => productVariants.id),
    quantity: integer("quantity").notNull(),
    priceAtPurchase: integer("price_at_purchase").notNull(), // paise
  },
  (t) => [
    index("order_items_order_id_idx").on(t.orderId),
    crudPolicy({
      role: authenticatedRole,
      read: sql`order_id IN (SELECT id FROM orders WHERE user_id = auth.user_id())`,
      modify: sql`order_id IN (SELECT id FROM orders WHERE user_id = auth.user_id() AND status = 'created')`,
    }),
  ],
);
```

### 3.5 `src/db/schema/content.ts`

```typescript
import { pgTable, text, timestamp, uuid, primaryKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { crudPolicy, anonymousRole, authenticatedRole } from "drizzle-orm/neon";

export const content = pgTable(
  "content",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull(),     // e.g. 'hero.headline.before'
    locale: text("locale").notNull().default("en-IN"),
    value: text("value").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    crudPolicy({ role: anonymousRole, read: true, modify: false }),
    crudPolicy({ role: authenticatedRole, read: true, modify: false }),
  ],
);
```

> Composite unique on `(key, locale)` enforced via migration `CREATE UNIQUE INDEX content_key_locale_uniq ON content(key, locale)`.

### 3.6 Index strategy summary

- All FKs indexed (`accounts.userId`, `addresses.userId`, `orders.userId`, `orderItems.orderId`, `productVariants.productId`, `productImages.productId`).
- Email lookup indexes (`users.email`, `waitlist.email`).
- Status filters indexed (`products.status`, `orders.status`).
- Time-series (`waitlist.createdAt`) indexed for admin dashboards + cohort exports.
- All currency stored as `integer` paise (avoid float drift).

## 4. RLS Policies (Drizzle)

`drizzle-orm/neon` exposes `crudPolicy`, `pgPolicy`, `authenticatedRole`, `anonymousRole`, and `authUid()`. `crudPolicy` generates `select / insert / update / delete` policies in one call. `authUid(col)` is sugar for `auth.user_id() = col` (calls the `pg_session_jwt`-provided `auth.user_id()` SQL function). ([Drizzle RLS](https://orm.drizzle.team/docs/rls), [Neon: simplify RLS with Drizzle](https://neon.com/docs/guides/rls-drizzle))

### 4.1 What each role sees

| Table | `anonymousRole` (anon, public visitor) | `authenticatedRole` (logged-in user) | Owner role (server bypass for migrations + webhooks + admin reads) |
|---|---|---|---|
| `users` | none | own row only | full |
| `accounts` / `sessions` | none | none (Auth.js writes via owner) | full |
| `verification_tokens` | none | none | full |
| `waitlist` | INSERT only | INSERT only | full |
| `products`, `product_variants`, `product_images` | read where `status='active'` | read where `status='active'` | full |
| `addresses` | none | own rows only | full |
| `orders` | none | own rows; modify only while `status='created'` | full |
| `order_items` | none | items of own orders | full |
| `content` | read all | read all | full |

> Inserts on `addresses` and `orders` use ``default(sql`(auth.user_id())`)`` so the `user_id` column is auto-populated from the JWT — defense-in-depth against client-supplied user IDs. ([Neon: declarative RLS with Drizzle crudPolicy](https://neon.com/docs/guides/rls-drizzle))

### 4.2 Custom admin policy (RBAC bolt-on)

For admin-only actions on `products`, `productVariants`, `productImages`, `content`, `waitlist`:

```typescript
import { pgPolicy } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Add to the table definition's policies array:
pgPolicy("admin_full_products", {
  for: "all",
  to: "authenticated",
  using: sql`(auth.session() ->> 'role') = 'admin'`,
  withCheck: sql`(auth.session() ->> 'role') = 'admin'`,
}),
```

`auth.session()` returns the full JWT claims as `jsonb`. We add `role: 'admin'` to the JWT in the Auth.js `jwt` callback, so the policy is purely DB-enforced. ([pg_session_jwt extension API](https://neon.com/docs/extensions/pg_session_jwt))

## 5. Auth Flow

### 5.1 Auth.js v5 config — `src/lib/auth.ts`

Auth.js v5 in JWT session mode. We override `jwt.encode` and `jwt.decode` so that the cookie holds an **RS256-signed JWT verifiable by Neon**, not Auth.js's default JWE.

```typescript
import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { SignJWT, jwtVerify, importPKCS8, importSPKI } from "jose";
import { db } from "@/db";
import { users, accounts, sessions, verificationTokens } from "@/db/schema";
import { env } from "@/env";

const ALG = "RS256";
const ISSUER = env.AUTH_JWT_ISSUER;       // e.g. https://doodle.in
const AUDIENCE = "neon";

const privateKey = await importPKCS8(env.AUTH_JWT_PRIVATE_KEY, ALG);
const publicKey = await importSPKI(env.AUTH_JWT_PUBLIC_KEY, ALG);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  providers: [
    Resend({
      from: env.EMAIL_FROM,
      apiKey: env.RESEND_API_KEY,
      // Custom React Email template wired in §10.
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as { role?: string }).role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      (session.user as { role?: string }).role = (token.role as string) ?? "user";
      return session;
    },
  },
  jwt: {
    async encode({ token }) {
      return await new SignJWT({ ...token, role: token?.role ?? "user" })
        .setProtectedHeader({ alg: ALG, kid: env.AUTH_JWT_KID })
        .setIssuedAt()
        .setIssuer(ISSUER)
        .setAudience(AUDIENCE)
        .setSubject(String(token?.sub ?? ""))
        .setExpirationTime("30d")
        .sign(privateKey);
    },
    async decode({ token }) {
      if (!token) return null;
      const { payload } = await jwtVerify(token, publicKey, {
        issuer: ISSUER,
        audience: AUDIENCE,
      });
      return payload as Record<string, unknown> & { sub?: string };
    },
  },
});
```

[`jose` SignJWT + RS256 reference](https://github.com/panva/jose), [Auth.js core JWT API](https://authjs.dev/reference/core/jwt).

### 5.2 JWKS route — `src/app/.well-known/jwks.json/route.ts`

Neon polls this URL to verify cookie JWTs. Cache it for one hour. ([Neon: register external JWKS provider](https://neon.com/docs/data-api/custom-authentication-providers))

```typescript
import { exportJWK, importSPKI } from "jose";
import { env } from "@/env";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const publicKey = await importSPKI(env.AUTH_JWT_PUBLIC_KEY, "RS256");
  const jwk = await exportJWK(publicKey);
  jwk.kid = env.AUTH_JWT_KID;
  jwk.alg = "RS256";
  jwk.use = "sig";
  return Response.json({ keys: [jwk] }, {
    headers: { "cache-control": "public, max-age=3600, s-maxage=3600" },
  });
}
```

### 5.3 Neon JWKS registration steps

1. Generate a 2048-bit RSA keypair: `openssl genpkey -algorithm RSA -out priv.pem -pkeyopt rsa_keygen_bits:2048` then `openssl rsa -pubout -in priv.pem -out pub.pem`. Store both as `AUTH_JWT_PRIVATE_KEY` / `AUTH_JWT_PUBLIC_KEY` in Vercel env (PEM, multi-line).
2. Pick a stable `kid`, e.g. `doodle-2026-05`.
3. In the Neon Console for your project: _Settings → RLS → Add authentication provider → Other → JWKS URL = `https://doodle.in/.well-known/jwks.json`, JWT Audience = `neon`_. Or via API ([Neon API docs: addProjectJwks](https://api-docs.neon.tech/reference/addprojectjwks)):

```bash
curl -X POST 'https://console.neon.tech/api/v2/projects/'$NEON_PROJECT_ID'/jwks' \
  -H "Authorization: Bearer $NEON_API_KEY" -H "Content-Type: application/json" \
  -d '{ "jwks_url":"https://doodle.in/.well-known/jwks.json",
        "provider_name":"doodle-authjs",
        "jwt_audience":"neon",
        "branch_id":"<main-branch-id>" }'
```

4. Run `CREATE EXTENSION IF NOT EXISTS pg_session_jwt;` once on the main branch (Neon enables it via the Console toggle when you add the provider). ([pg_session_jwt extension](https://neon.com/docs/extensions/pg_session_jwt))

### 5.4 Two connection strings — `src/env.ts` extract

```
DATABASE_URL              # role=neondb_owner, BYPASSRLS, used for migrations + webhooks + admin reads
DATABASE_AUTHENTICATED_URL # role=authenticated, NOLOGIN-via-API, RLS enforced
```

The owner connection bypasses RLS and is **only** imported in:
- `drizzle.config.ts` (migrations)
- `src/app/api/webhooks/razorpay/route.ts` (writes order status from Razorpay events)
- `src/app/(admin)/**/page.tsx` (after a server-side role check)

The authenticated connection is what every Server Component / Server Action uses for user data. ([Neon: secure backend RLS client setup](https://neon.com/docs/guides/rls-query-execution))

### 5.5 Drizzle factory — `src/db/index.ts`

```typescript
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { env } from "@/env";
import * as schema from "./schema";

const ownerPool = new Pool({ connectionString: env.DATABASE_URL });
const authPool = new Pool({ connectionString: env.DATABASE_AUTHENTICATED_URL });

export const db = drizzle(ownerPool, { schema });           // BYPASSRLS — admin/webhooks/migrations
const dbAuthBase = drizzle(authPool, { schema });

/** Run a callback inside a transaction with the user's JWT injected into the session. RLS fires. */
export async function withAuth<T>(cb: (tx: typeof dbAuthBase) => Promise<T>): Promise<T> {
  const session = await auth();
  if (!session) throw new Error("withAuth requires an authenticated session");
  const jwt = session.jwt as string; // exposed via session callback (cookie-stored token)
  return dbAuthBase.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('request.jwt.claims', ${jwt}, true)`);
    return cb(tx as unknown as typeof dbAuthBase);
  });
}
```

> Auth.js v5 doesn't expose the raw cookie JWT on the session object by default; we attach it in the `session` callback by calling `getToken({ raw: true })` from `next-auth/jwt` and stashing on `session.jwt`. ([Auth.js JWT reference](https://authjs.dev/reference/nextjs/jwt))

## 6. Route Topology

```
src/
  app/
    layout.tsx
    page.tsx                              # current marketing home (Hero v3 et al.)
    globals.css
    proxy.ts                              # route protection rules (Next 16)
    .well-known/
      jwks.json/route.ts                  # JWKS endpoint
    api/
      auth/[...nextauth]/route.ts         # Auth.js handler (export from src/lib/auth.ts)
      health/route.ts                     # 200 OK + DB ping
      webhooks/
        razorpay/route.ts                 # signature-verified order status updates
        resend/route.ts                   # delivery / bounce handling
    (public)/
      story/page.tsx
      stockists/page.tsx
      legal/[slug]/page.tsx
    (shop)/
      shop/page.tsx                       # catalog
      shop/[slug]/page.tsx                # product detail
      cart/page.tsx
      checkout/page.tsx
    (account)/
      account/page.tsx                    # dashboard
      account/orders/page.tsx
      account/orders/[id]/page.tsx
      account/addresses/page.tsx
      account/sign-in/page.tsx            # custom Auth.js sign-in screen
    (admin)/
      admin/page.tsx                      # dashboard
      admin/products/page.tsx
      admin/products/[id]/page.tsx        # CMS (form + Cloudinary upload widget)
      admin/waitlist/page.tsx             # CSV export, search
    actions/
      waitlist.ts                         # already exists; rewrite to insert into DB
      cart.ts
      checkout.ts                         # creates Razorpay order
      account.ts                          # address CRUD via withAuth
  components/
    sections/                             # existing — untouched in foundation pass
    ui/                                   # PillButton, MarkerHeading, WaitlistForm, PatchScrubber
    shop/                                 # ProductCard, VariantPicker, AddToCart
    account/                              # OrderRow, AddressForm
    admin/                                # ProductForm, CloudinaryUploadWidget, WaitlistTable
    decoration/                           # Squiggle, MarkerStroke
  db/
    index.ts                              # drizzle factory + withAuth
    schema/
      index.ts
      auth.ts
      waitlist.ts
      products.ts
      orders.ts
      content.ts
  emails/
    WaitlistConfirmation.tsx
    MagicLinkLogin.tsx
    OrderConfirmation.tsx
  lib/
    auth.ts                               # NextAuth() config
    razorpay.ts                           # client + verify helpers
    cloudinary.ts                         # signed upload helpers
    rate-limit.ts                         # in-memory or Upstash later
    utils.ts                              # existing cn()
  env.ts                                  # @t3-oss/env-nextjs schema
drizzle/                                  # generated SQL migrations
drizzle.config.ts
```

### 6.1 `src/app/proxy.ts`

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/checkout/:path*"],
};

export default async function proxy(req: Request) {
  const session = await auth();
  const url = new URL(req.url);

  if (!session?.user) {
    const signIn = new URL("/account/sign-in", url);
    signIn.searchParams.set("from", url.pathname);
    return NextResponse.redirect(signIn);
  }
  if (url.pathname.startsWith("/admin")) {
    const role = (session.user as { role?: string }).role;
    if (role !== "admin") return NextResponse.redirect(new URL("/account", url));
  }
  return NextResponse.next();
}
```

([Next.js 16 proxy.ts reference](https://nextjs.org/docs/app/api-reference/file-conventions/proxy))

## 7. Image Pipeline (Cloudinary)

`next-cloudinary`'s `<CldImage>` is a wrapper around `next/image` and inherits all its optimisations. ([next-cloudinary getting started](https://next.cloudinary.dev/cldimage/basic-usage))

### 7.1 Upload flow (admin)

Admin opens `/admin/products/[id]`. We render the unsigned upload widget from `next-cloudinary` with an upload preset that limits formats to PNG/JPEG/WebP, max 5 MB, and tags the asset with the product slug. Server Action persists the returned `public_id` into `productImages.cloudinaryPublicId`.

```typescript
"use client";
import { CldUploadWidget } from "next-cloudinary";
export function ProductImageUploader({ onUploaded }: { onUploaded: (id: string) => void }) {
  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      options={{ maxFiles: 1, sources: ["local", "url"], folder: "doodle/products" }}
      onSuccess={(r) => {
        const info = r.info as { public_id: string };
        onUploaded(info.public_id);
      }}
    >
      {({ open }) => (
        <button type="button" onClick={() => open()} className="...stitch...">
          Upload product image
        </button>
      )}
    </CldUploadWidget>
  );
}
```

### 7.2 Display flow (public)

```typescript
import { CldImage } from "next-cloudinary";
<CldImage
  src={image.cloudinaryPublicId}
  width={1200}
  height={1500}
  alt={image.alt}
  crop="fill"
  gravity="auto"
  sizes="(min-width: 1024px) 50vw, 100vw"
  priority={i === 0}
/>
```

`CldImage` defaults to `f_auto, q_auto`, so format and quality are negotiated per browser. ([next-cloudinary configuration](https://next.cloudinary.dev/cldimage/configuration))

### 7.3 Transformation presets

| Preset name (folder) | Use | Transform |
|---|---|---|
| `doodle/products` | Source upload | none (original kept) |
| Card thumbnail | Catalog card | `c_fill,g_auto,w_600,h_750,f_auto,q_auto` |
| Hero/PDP | Product detail | `c_fill,g_auto,w_1600,h_2000,f_auto,q_auto` |
| OG image | Social cards | `c_fill,w_1200,h_630,f_auto,q_auto,b_rgb:F5F0E8` |

### 7.4 Migration of existing static images

Current files: `public/product/tee-blue.jpeg`, `public/product/tee-white.jpeg`, `public/brand/wordmark-logo.jpeg`. Run a one-shot script (`scripts/cloudinary-migrate.ts`) using the `cloudinary` Node SDK's `uploader.upload()` to push them under `doodle/products/tee-blue` etc., then update `PatchScrubber.tsx` to swap `<Image src="/product/...">` for `<CldImage src="doodle/products/...">`. Keep the static files as a fallback for one release. ([Cloudinary Next.js integration guide](https://cloudinary.com/guides/front-end-development/integrating-cloudinary-with-next-js))

## 8. Observability

### 8.1 Picks

- **Errors: Sentry**. Free tier = 5,000 errors + 10,000 performance units / month, 30-day retention, indefinite. ([Sentry pricing 2026](https://sentry.io/pricing/)). Mature Next.js SDK, source maps, release tagging, and a focused error UX. We're a single-product site — we don't need an all-in-one yet.
- **Analytics: PostHog**. Free tier = 1M events + 5k session replays + 100k errors / month. ([PostHog vs Sentry 2026](https://posthog.com/blog/posthog-vs-sentry)). We don't dual-purpose PostHog as the error tool because Sentry's stack-trace grouping is sharper, but we still get session replay + funnels for the waitlist-to-checkout journey on the free tier.

We will **not** dual-track errors to both — Sentry is the source of truth. PostHog product events only.

### 8.2 Wire-up — `src/instrumentation.ts`

```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") await import("@/lib/sentry.server");
  if (process.env.NEXT_RUNTIME === "edge")   await import("@/lib/sentry.edge");
}
export const onRequestError = (await import("@sentry/nextjs")).captureRequestError;
```

### 8.3 PostHog — `src/components/Providers.tsx`

```typescript
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { env } from "@/env";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined" || !env.NEXT_PUBLIC_POSTHOG_KEY) return;
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      capture_pageview: "history_change",
      capture_pageleave: true,
      autocapture: true,
    });
  }, []);
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
```

Add a Next.js `rewrites` rule in `next.config.ts` to proxy `/ingest/:path*` to PostHog (defeats ad blockers).

### 8.4 Cost trajectory

| Tier | Sentry | PostHog |
|---|---|---|
| Now (waitlist-only) | well under 5k errors/mo | well under 1M events/mo |
| Launch (1k orders/mo, 10k sessions) | ~2k errors expected | ~250k events |
| Scale (10k orders/mo, 100k sessions) | likely over 5k → upgrade to Team $26/mo | ~2.5M events → upgrade to Scale (~$50/mo) |

Move both to paid only when free-tier alarms fire — neither bills overage on the free plan; events are silently dropped past the cap, so we lose data, not money.

## 9. Env Schema (Zod)

`@t3-oss/env-nextjs` is the standard for Next.js env validation in 2026 with first-class server/client split and runtime safety. ([T3 Env Next.js docs](https://env.t3.gg/docs/nextjs))

### 9.1 `src/env.ts`

```typescript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    DATABASE_URL: z.string().url(),
    DATABASE_AUTHENTICATED_URL: z.string().url(),

    AUTH_SECRET: z.string().min(32),
    AUTH_JWT_PRIVATE_KEY: z.string().min(1),
    AUTH_JWT_PUBLIC_KEY: z.string().min(1),
    AUTH_JWT_ISSUER: z.string().url(),
    AUTH_JWT_KID: z.string().min(1),
    AUTH_URL: z.string().url(),

    RESEND_API_KEY: z.string().startsWith("re_"),
    RESEND_AUDIENCE_ID: z.string().uuid().optional(),
    EMAIL_FROM: z.string().email(),

    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),

    TURNSTILE_SECRET_KEY: z.string().min(1),

    RAZORPAY_KEY_ID: z.string().min(1),
    RAZORPAY_KEY_SECRET: z.string().min(1),
    RAZORPAY_WEBHOOK_SECRET: z.string().min(1),

    SENTRY_DSN: z.string().url().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url(),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
    NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  emptyStringAsUndefined: true,
});
```

## 10. Email Pipeline (Resend + React Email)

Resend's React Email integration is the canonical 2026 setup, and Auth.js v5 has a first-party Resend provider that accepts a custom React template via `sendVerificationRequest`. ([Auth.js Resend provider](https://authjs.dev/getting-started/providers/resend), [React Email + Resend integration](https://react.email/docs/integrations/resend))

### 10.1 `src/emails/WaitlistConfirmation.tsx`

```typescript
import { Html, Head, Body, Container, Heading, Text, Button, Section } from "@react-email/components";

export default function WaitlistConfirmation({ name }: { name?: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#F5F0E8", fontFamily: "Geist, Helvetica, sans-serif", color: "#1A1A1A" }}>
        <Container style={{ maxWidth: 560, padding: 32 }}>
          <Heading as="h1" style={{ fontSize: 28 }}>You're on the DOODLE list{ name ? `, ${name}` : "" }.</Heading>
          <Text>Modular kids' clothing. Patches that swap. One email when the first drop is ready.</Text>
          <Section style={{ marginTop: 24 }}>
            <Button href="https://doodle.in" style={{ background: "#E8650A", color: "#fff", padding: "12px 20px", borderRadius: 999 }}>
              See the waiting room
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

`MagicLinkLogin.tsx` and `OrderConfirmation.tsx` follow the same shape — display font for headings, orange CTA button, cream background.

### 10.2 Resend wrapper — `src/lib/email.ts`

```typescript
import { Resend } from "resend";
import { env } from "@/env";

export const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail<T>(args: {
  to: string; subject: string; react: React.ReactElement; tags?: { name: string; value: string }[];
}) {
  const { data, error } = await resend.emails.send({
    from: env.EMAIL_FROM, to: args.to, subject: args.subject, react: args.react, tags: args.tags,
  });
  if (error) throw new Error(`Resend send failed: ${error.message}`);
  return data;
}
```

### 10.3 Auth.js Resend provider with React template

```typescript
Resend({
  from: env.EMAIL_FROM,
  apiKey: env.RESEND_API_KEY,
  async sendVerificationRequest({ identifier, url }) {
    const { default: MagicLinkLogin } = await import("@/emails/MagicLinkLogin");
    await sendEmail({
      to: identifier,
      subject: "Sign in to DOODLE",
      react: MagicLinkLogin({ url }),
    });
  },
}),
```

## 11. Test Setup

Vitest is the 2026 default for Next.js unit tests; Playwright is the official e2e recommendation. ([Next.js Vitest guide](https://nextjs.org/docs/app/guides/testing/vitest), [Next.js Playwright guide](https://nextjs.org/docs/pages/guides/testing/playwright))

### 11.1 `vitest.config.mts`

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    coverage: { provider: "v8", reporter: ["text", "html"] },
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
```

`vitest.setup.ts` — `import "@testing-library/jest-dom/vitest";`

### 11.2 `playwright.config.ts`

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000", trace: "on-first-retry" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 14"] } },
  ],
  webServer: process.env.CI ? undefined : { command: "npm run dev", port: 3000, reuseExistingServer: true },
});
```

Critical e2e specs (one file each under `e2e/`): `waitlist.spec.ts`, `signin-magic-link.spec.ts` (uses a mail-intercept pattern), `add-to-cart-and-checkout.spec.ts` (uses Razorpay test mode).

### 11.3 CI — `.github/workflows/ci.yml`

```yaml
name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run test
      - run: npx playwright install --with-deps chromium
      - run: npm run e2e
        env:
          PLAYWRIGHT_BASE_URL: ${{ secrets.PREVIEW_URL }}
```

## 12. Vercel + Neon Deploy Strategy

The native Vercel + Neon integration creates a Neon branch per Vercel preview deployment automatically. ([Neon: native Vercel integration per-preview branches](https://neon.com/blog/neon-vercel-native-integration), [Connecting with the Neon-Managed Vercel integration](https://neon.com/docs/guides/neon-managed-vercel-integration))

### 12.1 Branch model

- `main` git branch → `production` Vercel env → Neon `main` DB branch
- any other git branch → `preview` Vercel env → Neon `preview/<git-branch>` DB branch (copy-on-write clone of main, instant)
- Local dev → Neon `vercel-dev` persistent dev branch (also created by integration)

### 12.2 Env var matrix

| Var | Local | Preview | Production | Source |
|---|---|---|---|---|
| `DATABASE_URL` | `vercel-dev` owner conn | per-PR branch owner conn | main owner conn | Neon integration auto-injects |
| `DATABASE_AUTHENTICATED_URL` | same branch authenticated conn | same | same | Neon integration |
| `AUTH_JWT_PRIVATE_KEY` / `_PUBLIC_KEY` / `_KID` | local PEM | shared with prod | prod PEM | Vercel env (manual) |
| `AUTH_JWT_ISSUER` | `http://localhost:3000` | preview URL | `https://doodle.in` | Vercel env per-environment |
| `RESEND_API_KEY`, Cloudinary, Razorpay, Sentry, PostHog | dev keys / sandboxes | dev keys / sandboxes | live keys | Vercel env per-environment |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `${VERCEL_URL}` | `https://doodle.in` | Vercel computed |

### 12.3 Migration runner in build

`package.json`:

```json
"scripts": {
  "build": "drizzle-kit migrate && next build",
  "db:generate": "drizzle-kit generate",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio"
}
```

The Neon integration provisions `DATABASE_URL` (owner) before build runs, so `drizzle-kit migrate` applies migrations to whichever branch corresponds to the current Vercel deployment. Each preview gets its schema applied to its isolated branch. ([Neon: schema migration with Drizzle](https://neon.com/docs/guides/drizzle-migrations))

### 12.4 Rollback

1. Vercel → "Promote previous deployment" (instant, code-only).
2. If the previous deployment expects an older schema, restore the Neon main branch via Neon's "Restore" (point-in-time, branch-level, completes in seconds). ([Neon branching docs](https://neon.com/docs/guides/vercel-overview))
3. Migrations should always be additive (add column, never drop in same release). Drop only after one full release passes without errors.

## 13. Dependencies to ADD

Versions verified against npm + Context7 (May 2026). Pin majors in `package.json`, allow patch upgrades.

| Package | Version | Why |
|---|---|---|
| `drizzle-orm` | `^0.44.x` | ORM with `drizzle-orm/neon` RLS helpers ([Drizzle ORM npm](https://www.npmjs.com/package/drizzle-orm)) |
| `drizzle-kit` | `^0.31.x` | migrations, `generate`/`migrate` (note: `push` had a known RLS bug — use `generate` + `migrate`) ([drizzle-kit issue #4279](https://github.com/drizzle-team/drizzle-orm/issues/4279)) |
| `@neondatabase/serverless` | `^1.x` | WebSocket pool driver for Drizzle ([Neon serverless driver](https://neon.com/docs/serverless/serverless-driver)) |
| `pg` | `^8.x` | type peer for `drizzle-orm/pg-core` |
| `next-auth` | `5.0.0-beta.x` (latest beta) | Auth.js v5; v5 stable not released yet but production-ready ([next-auth on npm](https://www.npmjs.com/package/next-auth)) |
| `@auth/drizzle-adapter` | `^1.x` | Auth.js adapter for Drizzle ([Auth.js Drizzle adapter docs](https://authjs.dev/getting-started/adapters/drizzle)) |
| `jose` | `^5.x` | RS256 JWT signing + JWK export ([jose on npm](https://www.npmjs.com/package/jose)) |
| `next-cloudinary` | `^6.x` | `<CldImage>`, `<CldUploadWidget>` ([next-cloudinary on npm](https://www.npmjs.com/package/next-cloudinary)) |
| `cloudinary` | `^2.x` | server-side SDK for migration script + signed uploads |
| `resend` | already installed | transactional sender |
| `@react-email/components` | already installed | email templates |
| `react-email` | already installed (preview server) | dev-time `react-email dev` |
| `@t3-oss/env-nextjs` | `^0.13.x` | env validation ([@t3-oss/env-nextjs on npm](https://www.npmjs.com/package/@t3-oss/env-nextjs)) |
| `zod` | `^3.x` | env + Server Action input validation |
| `@sentry/nextjs` | `^8.x` (current major) | error tracking ([Sentry pricing](https://sentry.io/pricing/)) |
| `posthog-js` | `^1.x` | client analytics |
| `vitest` | `^2.x` | unit tests |
| `@vitejs/plugin-react` | `^4.x` | Vitest + React |
| `@testing-library/react` | `^16.x` | DOM tests |
| `@testing-library/jest-dom` | `^6.x` | DOM matchers |
| `@testing-library/user-event` | `^14.x` | interaction tests |
| `vite-tsconfig-paths` | `^5.x` | resolves `@/` alias in Vitest |
| `jsdom` | `^25.x` | Vitest environment |
| `@playwright/test` | `^1.x` | e2e |
| `razorpay` | `^2.x` | server SDK (orders + webhook signature verify) |

> Versions marked `^` should be locked at install time and bumped with Renovate or Dependabot. Latest minors are guaranteed semver-safe; majors must be planned (next-auth v5 stable in particular).

## 14. Dependencies to REMOVE

| Package | Reason | Verified |
|---|---|---|
| `roughjs` | imported nowhere in `src/` after audit | grep `roughjs` → 0 hits |
| `rough-notation` | imported nowhere | grep `rough-notation` → 0 hits |
| `perfect-freehand` | imported nowhere | grep `perfect-freehand` → 0 hits |
| `@base-ui/react` | only `button.tsx` consumes it; `button.tsx` itself unused | grep `@base-ui/react` → only `ui/button.tsx` |
| `tw-animate-css` | unused class utilities | grep `tw-animate-css` → 1 import in globals.css, no utility classes referenced |
| `lucide-react` | unused (Phosphor is the in-brief icon library) | grep `from "lucide-react"` → 0 hits |
| `shadcn` (the runtime package, not the CLI) | only `globals.css` references `shadcn/tailwind.css`, can be inlined | replace with manual reset |

Files to delete:

- `src/components/ui/CursorCompanion.tsx` (referenced as unused in `SESSION-STATE.md`)
- `src/components/ui/button.tsx` (unused shadcn primitive)

Removing these saves ~1.4 MB from the dependency tree and removes a known Lucide v1.x breaking-change risk.

## 15. Build Sequence

Each step is a single PR. Steps compose: each is safe to merge to `main` and ship to prod alone.

### Step 1 — Cleanup PR (safe, parallel-able)

- Run `npm uninstall roughjs rough-notation perfect-freehand @base-ui/react tw-animate-css lucide-react shadcn`
- Delete `src/components/ui/CursorCompanion.tsx`, `src/components/ui/button.tsx`
- Drop the two unused `@import` lines from `globals.css` (`tw-animate-css`, `shadcn/tailwind.css`)
- Run `npm run build` to confirm nothing referenced them
- Verify: `npx tsc --noEmit` passes; site renders identically; bundle size dropped

### Step 2 — Env validation + observability skeleton

- Add `@t3-oss/env-nextjs` + `zod`, create `src/env.ts` with current env var keys (Resend only at this point)
- Replace bare `process.env.X` with `env.X` in `actions/waitlist.ts`
- Add `@sentry/nextjs`, run `npx @sentry/wizard@latest -i nextjs`, accept generated `instrumentation.ts`, `next.config.ts` wrapping
- Add `posthog-js` + `Providers.tsx`, mount in `layout.tsx`
- Verify: dev server starts, missing env throws clearly at startup; Sentry/PostHog send a test event

### Step 3 — Database foundation

- Add `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `pg`
- Create `drizzle.config.ts` + `src/db/index.ts` (owner pool only at this stage; `withAuth` stub returns owner db)
- Create `src/db/schema/waitlist.ts` first
- Provision Neon project (Console: free tier, region close to Vercel default), grab `DATABASE_URL`
- Add `DATABASE_URL` to Vercel + `.env.local`; run `drizzle-kit generate` + `drizzle-kit migrate`
- Rewrite `src/app/actions/waitlist.ts` to insert into `waitlist` table (still no Resend, still no Turnstile)
- Build admin viewer at `src/app/(admin)/admin/waitlist/page.tsx` — for now, gate by a single `ADMIN_EMAIL` env check until Auth.js lands
- Verify: signup row visible in Neon Studio; admin viewer lists rows

### Step 4 — Auth.js v5 + JWKS + RLS

- Generate RSA keypair, store `AUTH_JWT_*` envs
- Add `next-auth@beta`, `@auth/drizzle-adapter`, `jose`
- Create `src/lib/auth.ts` with full RS256 encode/decode
- Add Auth.js schema files (`auth.ts`), regenerate + migrate
- Create `src/app/.well-known/jwks.json/route.ts`
- Deploy preview, verify JWKS is reachable, register with Neon Console
- Run `CREATE EXTENSION pg_session_jwt;` on the main branch
- Add `DATABASE_AUTHENTICATED_URL`; complete `withAuth()` in `src/db/index.ts`
- Add `proxy.ts` and `/account/sign-in` page
- Add RLS policies to `users`, `waitlist` (already in §3 schema)
- Verify: sign-in flow works end-to-end; `withAuth(tx => tx.select().from(users))` returns only own row; a manual SQL check via owner connection bypasses RLS

### Step 5 — Email pipeline (Resend + React Email)

- Author `WaitlistConfirmation.tsx`, `MagicLinkLogin.tsx`
- Wire `src/lib/email.ts`, replace TODO in `actions/waitlist.ts` with real send
- Wire Auth.js `Resend({ sendVerificationRequest })` to use `MagicLinkLogin`
- Verify: `react-email dev` previews render correctly; live waitlist signup sends confirmation; magic link signin works

### Step 6 — Turnstile

- Add Cloudflare Turnstile site + secret key
- Render `<Turnstile siteKey={...} />` inside `WaitlistForm`
- Verify token in `actions/waitlist.ts` against `https://challenges.cloudflare.com/turnstile/v0/siteverify` before insert
- Reject with friendly error on failure
- Verify: signup with no JS / no token rejected; bot signup fails

### Step 7 — Test suite

- Add Vitest + Playwright + RTL + jsdom; create configs from §11
- Write tests: `WaitlistForm` happy path + invalid email; `withAuth` returns own row only (integration); `waitlist` Server Action with bad Turnstile token
- Add Playwright spec: `e2e/waitlist.spec.ts`, `e2e/signin-magic-link.spec.ts`
- Add `.github/workflows/ci.yml`
- Verify: CI green on PR

### Step 8 — Cloudinary + product CMS

- Add `next-cloudinary` + `cloudinary`; create unsigned upload preset in Cloudinary Console
- Author `src/db/schema/products.ts` + migrate
- Build `/admin/products` (list + create/edit) using owner connection (admin role)
- Build `/shop` + `/shop/[slug]` reading via authenticated/anon connection so RLS is exercised
- Run one-shot migration script for existing static images
- Verify: admin uploads an image, public catalog renders it via `<CldImage>` with `f_auto, q_auto` confirmed in DevTools

### Step 9 — Cart, checkout, Razorpay (sandbox)

- Author `src/db/schema/orders.ts` (orders, orderItems, addresses); migrate
- Cart state: cookie-backed for guests, DB-backed (`orders` row in `created` status) for logged-in users
- `actions/checkout.ts` creates Razorpay order via server SDK, returns `orderId` to client
- Client opens Razorpay Checkout with the test key
- `app/api/webhooks/razorpay/route.ts` verifies signature with `RAZORPAY_WEBHOOK_SECRET`, updates order status via owner connection
- Send `OrderConfirmation` email on `payment.captured` webhook
- Verify: e2e Playwright places test order; webhook flips `status='paid'`; user sees order in `/account/orders`

### Step 10 — Vercel + Neon preview branches + production cutover

- Install Neon native integration on the Vercel project
- Verify a PR creates a Neon preview branch and runs migrations against it
- Promote to production with prod Razorpay live keys, prod Resend domain, prod Turnstile keys
- Verify: production sign-in, production sample order in live mode (₹1 test SKU then refund)

## 16. Open Questions for Ash

1. **Admin auth provider**: Same Auth.js Resend magic link with a `role: 'admin'` flag flipped manually in DB for the five founders, or a separate Google/GitHub provider gated to specific emails? Recommendation: same Auth.js — five founders with magic link is enough; we just toggle `users.role` in Neon Console.
2. **Razorpay account timing**: Sandbox account exists already (yes/no)? Live KYC takes 1–2 weeks; if not started, kick that off in parallel with Step 5 so it's ready for Step 9.
3. **Email-from address**: The spec assumes `hello@doodle.in`. Domain verified in Resend (DNS records added)? If not, Step 5 blocks until DNS propagates (~24h).
4. **Cloudinary tier**: Free tier (25 GB / 25 GB BW / 25k transforms) is fine for waitlist + first 100 SKUs. Confirm whoever owns the Cloudinary account.
5. **Sentry & PostHog accounts**: Org accounts under DOODLE/CANVAS, or personal? Owner = founder, then add the rest as members.
6. **Admin viewer for waitlist before Auth lands** (Step 3): Should the temporary `ADMIN_EMAIL`-only check use HTTP basic auth, IP allowlist, or just an obscure URL? Recommendation: HTTP basic via Vercel password protection on the preview branch until Auth.js lands.
7. **Locale**: `en-IN` is the only locale in the schema. Hindi-language version on the roadmap, or English-only forever?
8. **Soft-delete vs hard-delete**: Right now schemas have no `deletedAt`. Acceptable for v1? When we ship orders we'll likely want soft-delete for auditability — flag now or later.
9. **Idempotency on Razorpay webhook**: We rely on `razorpayOrderId` unique index. Sufficient, or also dedupe on Razorpay's `event.id`? Recommend the latter — adds a `processed_webhook_events` table.

---

### Sources

- Neon: [Custom authentication providers](https://neon.com/docs/data-api/custom-authentication-providers) · [pg_session_jwt extension](https://neon.com/docs/extensions/pg_session_jwt) · [Simplify RLS with Drizzle](https://neon.com/docs/guides/rls-drizzle) · [Run RLS queries with Drizzle ORM](https://neon.com/docs/guides/rls-query-execution) · [Native Vercel integration](https://neon.com/blog/neon-vercel-native-integration) · [Schema migration with Drizzle](https://neon.com/docs/guides/drizzle-migrations) · [Serverless driver](https://neon.com/docs/serverless/serverless-driver) · [API: addProjectJwks](https://api-docs.neon.tech/reference/addprojectjwks) · [Vercel-managed integration connection](https://neon.com/docs/guides/neon-managed-vercel-integration)
- Drizzle: [RLS docs](https://orm.drizzle.team/docs/rls) · [Drizzle ORM npm](https://www.npmjs.com/package/drizzle-orm) · [drizzle-kit push RLS bug #4279](https://github.com/drizzle-team/drizzle-orm/issues/4279)
- Auth.js v5: [Drizzle adapter](https://authjs.dev/getting-started/adapters/drizzle) · [Resend provider](https://authjs.dev/getting-started/providers/resend) · [Migrating to v5](https://authjs.dev/getting-started/migrating-to-v5) · [JWT API reference](https://authjs.dev/reference/core/jwt) · [Protecting routes](https://authjs.dev/getting-started/session-management/protecting)
- jose: [npm package](https://www.npmjs.com/package/jose) · [GitHub](https://github.com/panva/jose)
- Neon RLS demo: [neondatabase/rls-demo-custom-jwt](https://github.com/neondatabase/rls-demo-custom-jwt)
- Next.js 16: [proxy.ts file conventions](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) · [Vitest guide](https://nextjs.org/docs/app/guides/testing/vitest) · [Playwright guide](https://nextjs.org/docs/pages/guides/testing/playwright)
- next-cloudinary: [Getting started](https://next.cloudinary.dev/cldimage/basic-usage) · [Configuration](https://next.cloudinary.dev/cldimage/configuration) · [npm](https://www.npmjs.com/package/next-cloudinary) · [Cloudinary Next.js integration guide](https://cloudinary.com/guides/front-end-development/integrating-cloudinary-with-next-js)
- T3 Env: [Next.js docs](https://env.t3.gg/docs/nextjs) · [npm](https://www.npmjs.com/package/@t3-oss/env-nextjs)
- Sentry: [Pricing 2026](https://sentry.io/pricing/)
- PostHog: [PostHog vs Sentry comparison](https://posthog.com/blog/posthog-vs-sentry)
- Resend: [Resend + React Email](https://react.email/docs/integrations/resend)
