# DOODLE Commerce v1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Launch full e-commerce on `doodle.in/shop` (or `wearedoodle.in/shop` fallback) transactable end-to-end via Razorpay + COD by 2026-06-09 (Day 20). Spec: `docs/superpowers/specs/2026-05-20-doodle-commerce-design.md`.

**Architecture:** Adopt Medusa.js v2 as a headless commerce engine deployed to Railway, backed by Neon Postgres + Upstash Redis. Keep the existing Next.js 16 marketing storefront on Vercel and layer `/shop`, `/cart`, `/checkout`, `/account`, `/order` routes that call Medusa via `@medusajs/js-sdk`. Razorpay Standard Checkout for prepaid (UPI/cards/wallets/netbanking); a custom Medusa payment provider for COD. Shiprocket plugin for fulfillment + AWB tracking. Resend + React Email for transactional emails.

**Tech Stack:** Next.js 16 + React 19 + Tailwind v4 (storefront, existing) · Medusa v2 (backend, NEW) · Neon Postgres · Upstash Redis · Drizzle (marketing/waitlist only) · Razorpay Standard Checkout · Shiprocket · Resend + React Email · Cloudinary · Sentry · PostHog · Vercel + Railway

---

## File Structure

### Storefront repo: `Documents/doodle/` (existing)

New files (commerce layer):

| Path | Responsibility |
|---|---|
| `src/lib/medusa/client.ts` | Medusa SDK singleton — read by Server Components + Server Actions |
| `src/lib/medusa/cart.ts` | Cart helpers (get-or-create, line-item ops) — server-only |
| `src/lib/medusa/types.ts` | Hand-synced narrow type re-exports from Medusa SDK |
| `src/app/shop/page.tsx` | Catalog index (Server Component) |
| `src/app/shop/[handle]/page.tsx` | PDP (Server Component) |
| `src/app/cart/page.tsx` | Cart page (Server Component) |
| `src/app/checkout/page.tsx` | Single-page checkout (Server Component) |
| `src/app/account/page.tsx` | Customer dashboard (Server Component) |
| `src/app/account/login/page.tsx` | Sign-in form |
| `src/app/account/orders/[id]/page.tsx` | Order detail page (logged-in) |
| `src/app/order/[id]/confirmed/page.tsx` | Post-checkout confirmation (Server Component) |
| `src/app/actions/checkout.ts` | Server Actions: `addToCart`, `updateLine`, `removeLine`, `setAddress`, `setShipping`, `setPayment`, `placeOrder` |
| `src/components/shop/ProductCard.tsx` | Catalog grid card |
| `src/components/shop/PDPGallery.tsx` | Product image gallery (client, gallery interactions) |
| `src/components/shop/VariantPicker.tsx` | Colour + size selector (client) |
| `src/components/shop/CartLine.tsx` | Single cart line item with qty controls (client) |
| `src/components/shop/CartButton.tsx` | Nav cart-icon + line-count badge (client; reads cookie) |
| `src/components/shop/CheckoutContact.tsx` | Step 1 — contact (client) |
| `src/components/shop/CheckoutShipping.tsx` | Step 2 — address + pincode + serviceability (client) |
| `src/components/shop/CheckoutPayment.tsx` | Step 3 — Razorpay/COD selection + submit (client) |
| `src/components/shop/RazorpayCheckout.tsx` | Razorpay Checkout.js loader + open modal (client) |

Modified files:

| Path | Change |
|---|---|
| `src/components/sections/Nav.tsx` | Add Shop link + `<CartButton />`; flip CTA from "Join waitlist" to "Shop the drop" |
| `package.json` | Add `@medusajs/js-sdk` |
| `vercel.json` | Already pinned `sin1` — no change |

Unchanged (must NOT touch): `src/app/page.tsx`, `src/app/drop/`, all `src/components/sections/*.tsx` (except Nav), `src/components/motion/`, `src/components/ui/`, `src/app/actions/waitlist.ts`, `src/app/globals.css`, Drizzle config.

### Backend repo: `Documents/doodle-backend/` (NEW sibling)

| Path | Responsibility |
|---|---|
| `medusa-config.ts` | Modules + plugin wiring (Razorpay, Shiprocket, Resend, Cloudinary) |
| `.env`, `.env.template` | DATABASE_URL, REDIS_URL, JWT_SECRET, COOKIE_SECRET, RAZORPAY_*, SHIPROCKET_*, RESEND_API_KEY, CLOUDINARY_*, SENTRY_DSN |
| `src/api/webhooks/razorpay/route.ts` | Razorpay webhook handler (signature verify + idempotent state) |
| `src/api/webhooks/shiprocket/route.ts` | Shiprocket fulfillment webhook |
| `src/api/admin/dashboard-stats/route.ts` | Custom endpoint for First-drop daily roll-up widget |
| `src/modules/payment-cod/` | Custom Medusa payment provider — COD |
| `src/modules/payment-cod/index.ts` | Module export |
| `src/modules/payment-cod/service.ts` | COD provider service implementing `AbstractPaymentProvider` |
| `src/subscribers/order-placed.ts` | Resend → OrderPlaced (prepaid or COD branch) |
| `src/subscribers/order-payment-captured.ts` | Resend → PaymentReceived |
| `src/subscribers/order-shipment-created.ts` | Resend → OrderShipped |
| `src/subscribers/order-fulfillment-delivered.ts` | Resend → OrderDelivered |
| `src/subscribers/customer-created.ts` | Resend → Welcome |
| `src/subscribers/order-return-requested.ts` | Resend → ReturnAcknowledged |
| `src/subscribers/payment-refunded.ts` | Resend → RefundProcessed |
| `src/emails/OrderPlaced.tsx` | React Email template |
| `src/emails/OrderPlacedCOD.tsx` | React Email template |
| `src/emails/PaymentReceived.tsx` | React Email template |
| `src/emails/OrderShipped.tsx` | React Email template |
| `src/emails/OrderDelivered.tsx` | React Email template |
| `src/emails/Welcome.tsx` | React Email template |
| `src/emails/ReturnAcknowledged.tsx` | React Email template |
| `src/emails/RefundProcessed.tsx` | React Email template |
| `src/emails/_brand.tsx` | Shared header/footer/branding components for all templates |
| `src/admin/widgets/order-kit-summary.tsx` | Order detail page — kit composition block |
| `src/admin/widgets/daily-rollup.tsx` | Dashboard home — today's revenue / orders / split |
| `packages/medusa-plugin-razorpay/` | Forked from `@devx-commerce/razorpay`, audited |
| `packages/medusa-plugin-shiprocket/` | Forked from `Hemann55/medusa-fulfillment-shiprocket`, audited |
| `Dockerfile` | For Railway build (if not using Railway template) |
| `package.json` | Medusa v2 deps + plugin workspace links |

---

## Day-by-day overview (links to detailed tasks below)

| Phase | Days | Detail level | Status |
|---|---|---|---|
| **Day 0 — Prep + accounts** | 2026-05-20 | Full detail | Plan |
| **Week 1 — Foundation + catalog** | Days 1–7 (May 21–27) | Full detail | Plan |
| **Week 2 — Checkout + payments + COD + fulfillment** | Days 8–14 (May 28–Jun 3) | Scaffold | Re-expand after Week 1 |
| **Week 3 — Polish + soft launch + production** | Days 15–20 (Jun 4–9) | Scaffold | Re-expand after Week 2 |

---

## DAY 0 — Prep + accounts (2026-05-20)

These tasks have lead time and start BEFORE code. KYC delays kill launches. Several happen in parallel.

### Task 0.1: Buy doodle.in via Vercel Domains (fallback wearedoodle.in)

**Files:** None — external account action.

- [ ] **Step 1:** Open `https://vercel.com/dashboard` (existing Vercel account).
- [ ] **Step 2:** Navigate to Domains → Add Domain → search `doodle.in`.
- [ ] **Step 3:** If available, complete purchase via Vercel Domains (at-cost, ~₹500-1500/yr). DNS auto-configured.
- [ ] **Step 4:** If `doodle.in` is taken, repeat with `wearedoodle.in`.
- [ ] **Step 5:** Once purchased, attach the domain to the Vercel project hosting `Documents/doodle`. Set as production domain.
- [ ] **Step 6:** Record the final domain in `docs/superpowers/specs/2026-05-20-doodle-commerce-design.md` (replace `<domain>.in` placeholders).
- [ ] **Step 7:** Verify the marketing site loads at the new domain in ~5 minutes.

### Task 0.2: Submit Razorpay business account + KYC

**Files:** None — external account action. Critical-path: 3-7 days lead time.

- [ ] **Step 1:** Go to `https://dashboard.razorpay.com/signup` → Business account.
- [ ] **Step 2:** Submit business details (DOODLE / CANVAS), founder PAN, GSTIN (skip if not registered — Razorpay allows non-GST businesses below threshold).
- [ ] **Step 3:** Submit bank account details for settlement.
- [ ] **Step 4:** Upload KYC docs (PAN, business proof, bank statement).
- [ ] **Step 5:** Record submission timestamp + reference ID in `docs/superpowers/build-log.md`.
- [ ] **Step 6:** Generate Razorpay TEST mode API keys (`rzp_test_*`) immediately for development. Save in password manager.

### Task 0.3: Submit Shiprocket account + KYC

**Files:** None — external account action. Lead time 1-3 days.

- [ ] **Step 1:** Go to `https://app.shiprocket.in/register`.
- [ ] **Step 2:** Submit business info + founder details.
- [ ] **Step 3:** Add Bangalore pickup address (use co-founder's premises until permanent location locked — flag `[PENDING-ASH]`).
- [ ] **Step 4:** Verify pickup address (Shiprocket verification call — answer it).
- [ ] **Step 5:** Generate API token in Shiprocket dashboard → Settings → API → Generate Token. Save.
- [ ] **Step 6:** Enable COD on the account. Configure COD remittance bank.

### Task 0.4: Set up Upstash Redis (Singapore region)

**Files:** None — external account action.

- [ ] **Step 1:** Sign up at `https://upstash.com` (free tier).
- [ ] **Step 2:** Create new Redis database. Region: `ap-southeast-1` (Singapore). TLS: enabled.
- [ ] **Step 3:** Copy `REDIS_URL` from dashboard. Save in password manager.

### Task 0.5: Set up Railway account (Hobby ~$5/mo)

**Files:** None.

- [ ] **Step 1:** Sign up at `https://railway.com` if not already.
- [ ] **Step 2:** Add payment method (Hobby plan = $5 credit/mo, billed only over).
- [ ] **Step 3:** Note Railway team ID for later Medusa deploy.

### Task 0.6: Confirm Cloudinary access + folder structure

**Files:** None.

- [ ] **Step 1:** Log into Cloudinary at `https://cloudinary.com/console` (existing account).
- [ ] **Step 2:** Create folders: `doodle/products/tees/`, `doodle/products/patches/`, `doodle/products/kits/`, `doodle/brand/`.
- [ ] **Step 3:** Get API Key, API Secret, Cloud Name from dashboard. Save.

### Task 0.7: Resend domain verification setup

**Files:** Vercel domain DNS (Vercel Domains auto-configures most; Resend records added on top).

- [ ] **Step 1:** In Resend dashboard, add domain — pick `<domain-from-0.1>.in` (e.g., `doodle.in` or `wearedoodle.in`).
- [ ] **Step 2:** Resend will produce SPF (TXT) + DKIM (TXT) + DMARC (TXT) records.
- [ ] **Step 3:** In Vercel Domains dashboard → DNS records, add the 3 records exactly as Resend specifies.
- [ ] **Step 4:** Click "Verify" in Resend. Should turn green within ~5-15 minutes (sometimes up to 1h).
- [ ] **Step 5:** Verify sending: `curl https://api.resend.com/emails -H 'Authorization: Bearer <RESEND_API_KEY>' -H 'Content-Type: application/json' -d '{"from":"hello@<domain>.in","reply_to":"doodlebycanvas@gmail.com","to":"<your-email>","subject":"Resend domain verification test","html":"<p>Working</p>"}'` — verify it arrives and shows `hello@<domain>.in` as sender.

### Task 0.8: Create the doodle-backend git repository

**Files:**
- Create: `C:/Users/Ashutosh Bhavale/Documents/doodle-backend/` (new directory)

- [ ] **Step 1:** Open new terminal in `Documents/`.
- [ ] **Step 2:** Run `npx create-medusa-app@latest doodle-backend --skip-db --no-browser`.
- [ ] **Step 3:** When prompted "What's the name of your backend?" → `doodle-backend`. Storefront install → say No (we already have one).
- [ ] **Step 4:** `cd doodle-backend && git init && git add . && git commit -m "chore: initial Medusa v2 scaffold"`.
- [ ] **Step 5:** Create new GitHub repo `Ashutoshbhav/doodle-backend` (private). `git remote add origin <url>; git push -u origin main`.

### Task 0.9: Capture Day-0 prep summary

**Files:**
- Create: `Documents/doodle/docs/build-log.md`

- [ ] **Step 1:** Write a build log capturing: Razorpay KYC submitted timestamp + ref ID, Shiprocket KYC ditto, Upstash REDIS_URL stored in PW manager, Railway account ready, Cloudinary creds stored, Resend domain verified, doodle-backend repo URL.
- [ ] **Step 2:** Commit to the doodle repo: `git add docs/build-log.md && git commit -m "docs: day-0 prep capture"`.

---

## DAY 1 (Thu 2026-05-21) — Backend bootstrap + storefront SDK wiring

### Task 1.1: Connect Medusa to Neon

**Files:**
- Modify: `doodle-backend/.env`
- Modify: `doodle-backend/medusa-config.ts`

- [ ] **Step 1:** In Neon dashboard, create a new branch off main called `medusa` (so Drizzle's existing `public.waitlist` stays isolated). Copy the pooled `DATABASE_URL`.
- [ ] **Step 2:** Edit `doodle-backend/.env`:

```env
DATABASE_URL=postgres://<from-neon>?sslmode=require
REDIS_URL=rediss://<from-upstash>
JWT_SECRET=<generate with: openssl rand -base64 32>
COOKIE_SECRET=<generate with: openssl rand -base64 32>
STORE_CORS=https://<vercel-preview-url>,http://localhost:3000
ADMIN_CORS=https://<railway-url>
AUTH_CORS=https://<vercel-preview-url>,http://localhost:3000
```

- [ ] **Step 3:** Verify `medusa-config.ts` uses `process.env.DATABASE_URL` (default in scaffold).
- [ ] **Step 4:** Run `npx medusa db:migrate` from `doodle-backend/`. Expected: migrations apply, schema appears in Neon (`product`, `cart`, `order`, etc.).
- [ ] **Step 5:** Run `npx medusa user -e ash@doodle.in -p <strong-password>` to create the first admin.
- [ ] **Step 6:** Run `npm run dev` from `doodle-backend/`. Expected: server boots on `:9000`, admin accessible at `http://localhost:9000/app`.
- [ ] **Step 7:** Log in to admin with the credentials from step 5. Verify dashboard loads.
- [ ] **Step 8:** Commit: `git add . && git commit -m "feat: connect Medusa to Neon + Upstash; create first admin"`.

### Task 1.2: Deploy Medusa to Railway

**Files:**
- Create: `doodle-backend/railway.json` (optional but explicit is good)

- [ ] **Step 1:** Run `railway login` (or use web onboarding).
- [ ] **Step 2:** In Railway dashboard → New Project → Deploy from GitHub → select `Ashutoshbhav/doodle-backend`.
- [ ] **Step 3:** In Railway project Settings → Variables, paste ALL env vars from `doodle-backend/.env` (DATABASE_URL, REDIS_URL, JWT_SECRET, COOKIE_SECRET, ADMIN_CORS, STORE_CORS, AUTH_CORS — use Vercel preview URL placeholders for now).
- [ ] **Step 4:** Set Service Region → `Singapore (asia-southeast1)`.
- [ ] **Step 5:** Settings → Networking → Generate Public Domain. Note the `<project>.up.railway.app` URL.
- [ ] **Step 6:** Trigger first deploy. Wait for green check (~3-5 min).
- [ ] **Step 7:** Visit `https://<railway-url>/app` — admin should load. Log in.
- [ ] **Step 8:** Update Vercel Domains DNS: add CNAME `api` → `<project>.up.railway.app`. Railway → Settings → Add Custom Domain → `api.doodle.in`. Wait for SSL provisioning (~2 min).
- [ ] **Step 9:** Visit `https://api.doodle.in/app` — admin loads over HTTPS.
- [ ] **Step 10:** Update Railway env: replace `<railway-url>` placeholders in CORS vars with `https://doodle.in,https://www.doodle.in` (storefront prod) + `http://localhost:3000` (local dev).
- [ ] **Step 11:** Redeploy via Railway. Commit any railway.json changes.

### Task 1.3: Install Medusa SDK in storefront repo

**Files:**
- Modify: `Documents/doodle/package.json`
- Create: `Documents/doodle/src/lib/medusa/client.ts`
- Modify: `Documents/doodle/src/env.ts`

- [ ] **Step 1:** From `Documents/doodle/`: `npm install @medusajs/js-sdk`.
- [ ] **Step 2:** In Medusa Admin → Settings → Publishable API Keys → Create → name "storefront-prod". Copy the `pk_*` value.
- [ ] **Step 3:** Edit `src/env.ts` — add to client schema:

```ts
NEXT_PUBLIC_MEDUSA_BASE_URL: z.string().url(),
NEXT_PUBLIC_MEDUSA_PUB_KEY: z.string().min(1),
```

- [ ] **Step 4:** Add to local `.env.local`:

```env
NEXT_PUBLIC_MEDUSA_BASE_URL=https://api.doodle.in
NEXT_PUBLIC_MEDUSA_PUB_KEY=pk_<from-step-2>
```

- [ ] **Step 5:** Add the same two vars to Vercel project Environment Variables (Production + Preview).
- [ ] **Step 6:** Create `src/lib/medusa/client.ts`:

```ts
import Medusa from "@medusajs/js-sdk"
import { env } from "@/env"

export const medusa = new Medusa({
  baseUrl: env.NEXT_PUBLIC_MEDUSA_BASE_URL,
  publishableKey: env.NEXT_PUBLIC_MEDUSA_PUB_KEY,
  debug: process.env.NODE_ENV !== "production",
})
```

- [ ] **Step 7:** Verify with a smoke test in any temporary file: `await medusa.store.product.list({ limit: 1 })`. Should return `{ products: [], count: 0 }` (no products yet).
- [ ] **Step 8:** Commit: `git add package.json package-lock.json src/lib/medusa/client.ts src/env.ts && git commit -m "feat(commerce): wire Medusa SDK client"`.

---

## DAY 2 (Fri 2026-05-22) — Region, sales channel, types

### Task 2.1: Configure India region + INR currency

**Files:** None — admin actions only.

- [ ] **Step 1:** Admin → Settings → Regions → Create Region.
- [ ] **Step 2:** Name: "India". Currency: INR. Countries: India only. Payment providers: leave blank for now (wire Razorpay Day 8). Save.
- [ ] **Step 3:** Sales Channels → ensure default "Default Sales Channel" exists. Note the ID for later.

### Task 2.2: Hand-sync narrow Medusa types

**Files:**
- Create: `src/lib/medusa/types.ts`

- [ ] **Step 1:** Create `src/lib/medusa/types.ts`:

```ts
// Hand-synced narrow type re-exports — keeps the storefront type-safe
// without coupling to the full Medusa types package.
// If a property is missing here, add it; don't reach into deep internals.
import type {
  StoreProduct,
  StoreProductVariant,
  StoreCart,
  StoreCartLineItem,
  StoreOrder,
  StoreCustomer,
  StoreRegion,
} from "@medusajs/types"

export type Product = StoreProduct
export type Variant = StoreProductVariant
export type Cart = StoreCart
export type CartLine = StoreCartLineItem
export type Order = StoreOrder
export type Customer = StoreCustomer
export type Region = StoreRegion

export type Money = { amount: number; currency_code: string }

export function formatINR(amount: number | undefined | null): string {
  if (amount == null) return "—"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}
```

- [ ] **Step 2:** Install types peer: `npm install --save-dev @medusajs/types`.
- [ ] **Step 3:** Verify TypeScript: `npx tsc --noEmit`. Expected: exit 0.
- [ ] **Step 4:** Commit: `git add src/lib/medusa/types.ts package.json package-lock.json && git commit -m "feat(commerce): hand-synced Medusa types + INR formatter"`.

### Task 2.3: Cart helpers (server-only)

**Files:**
- Create: `src/lib/medusa/cart.ts`

- [ ] **Step 1:** Create `src/lib/medusa/cart.ts`:

```ts
"server-only"

import { cookies } from "next/headers"
import { medusa } from "./client"
import type { Cart } from "./types"

const CART_COOKIE = "doodle_cart_id"
const CART_TTL_DAYS = 30

export async function getCart(): Promise<Cart | null> {
  const jar = await cookies()
  const id = jar.get(CART_COOKIE)?.value
  if (!id) return null
  try {
    const { cart } = await medusa.store.cart.retrieve(id, {
      fields: "+items.*,+items.variant.*,+items.product.*,+shipping_address.*,+billing_address.*",
    })
    return cart
  } catch {
    // Cart was deleted server-side — clear cookie
    jar.delete(CART_COOKIE)
    return null
  }
}

export async function getOrCreateCart(regionId: string): Promise<Cart> {
  const existing = await getCart()
  if (existing) return existing

  const { cart } = await medusa.store.cart.create({ region_id: regionId })
  const jar = await cookies()
  jar.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * CART_TTL_DAYS,
    path: "/",
  })
  return cart
}

export async function getIndiaRegionId(): Promise<string> {
  const { regions } = await medusa.store.region.list()
  const india = regions.find((r) => r.countries?.some((c) => c.iso_2 === "in"))
  if (!india) throw new Error("India region not configured in Medusa admin")
  return india.id
}
```

- [ ] **Step 2:** Verify TypeScript: `npx tsc --noEmit`. Expected: exit 0.
- [ ] **Step 3:** Commit: `git add src/lib/medusa/cart.ts && git commit -m "feat(commerce): server-only cart helpers"`.

---

## DAY 3 (Sat 2026-05-23) — Catalog page + product seeding

### Task 3.1: Seed the 4 products in Medusa Admin

**Files:** None — admin actions only.

- [ ] **Step 1:** Admin → Products → Create new product **"DOODLE Tee"**.
  - Handle: `tee`
  - Description: "The base. 100% combed cotton, 200-220 GSM. Velcro slots for your patches."
  - Options: `Colour` (values: Bubblegum Pink, Powder Blue) + `Size` (values: S 3-4y, M 4-5y, L 5-6y)
  - Variants: auto-generates 6 (2×3). For each: SKU `TEE-<colour>-<size>`, price ₹999 (enter as `99900` paise), inventory: 100 units each (will adjust when real inventory lands).
  - Sales channel: Default.
  - Status: Draft (publish later).
- [ ] **Step 2:** Create product **"DOODLE Patch"**.
  - Handle: `patch`
  - Options: `Shape` (Star, Square, Circle, Triangle, Pentagon) + `Colour` (3 colours for v1; flag exact 3 with Ash — propose Red, Blue, Yellow)
  - 15 variants. SKU `PATCH-<shape>-<colour>`. Price ₹80 (`8000` paise). Inventory: 100 each.
- [ ] **Step 3:** Create product **"Starter Kit"**.
  - Handle: `starter-kit`
  - Description: "Tee + 3 patches at one price. Pick your colour + size below; patches included are a curated mix."
  - Options: `Colour` (Bubblegum Pink, Powder Blue) + `Size` (S, M, L)
  - 6 variants. SKU `KIT-STARTER-<colour>-<size>`. Price ₹999 (`99900` paise).
  - Inventory model: **Use Medusa's Inventory Kit feature** — link each variant's inventory to consume: 1× the matching tee variant + 3× generic patch (track patches via promotion / manual decrement for v1).
- [ ] **Step 4:** Create product **"Pattern Pack"**.
  - Handle: `pattern-pack`
  - Description: "Five patches in mixed shapes. Top-up your kid's lineup or start somewhere different."
  - Options: `Theme` (single value: "Mixed" for v1).
  - 1 variant. SKU `PACK-PATTERN-MIXED`. Price ₹250.
- [ ] **Step 5:** Upload product photos to Cloudinary, copy URLs, attach to each product (cover + gallery) in admin.

### Task 3.2: `/shop` catalog page (Server Component)

**Files:**
- Create: `src/app/shop/page.tsx`
- Create: `src/components/shop/ProductCard.tsx`

- [ ] **Step 1:** Create `src/components/shop/ProductCard.tsx`:

```tsx
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/medusa/types"
import { formatINR } from "@/lib/medusa/types"

export function ProductCard({ product }: { product: Product }) {
  const thumbnail = product.thumbnail ?? product.images?.[0]?.url
  const cheapest = product.variants?.reduce<number | null>((min, v) => {
    const price = v.calculated_price?.calculated_amount
    if (price == null) return min
    return min == null || price < min ? price : min
  }, null)

  return (
    <Link
      href={`/shop/${product.handle}`}
      className="group block rounded-[1.5rem] bg-doodle-canvas stitch-thick overflow-hidden hover:scale-[1.02] transition-transform"
    >
      <div className="relative aspect-[4/5] bg-doodle-stitch overflow-hidden">
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={product.title ?? ""}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-doodle-ink leading-tight">{product.title}</h3>
        <p className="mt-2 font-mono text-sm text-doodle-ink/70">
          {cheapest != null ? formatINR(cheapest) : ""}
        </p>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2:** Create `src/app/shop/page.tsx`:

```tsx
import { medusa } from "@/lib/medusa/client"
import { ProductCard } from "@/components/shop/ProductCard"
import { Nav } from "@/components/sections/Nav"
import { Footer } from "@/components/sections/Footer"

export const metadata = {
  title: "Shop the drop — DOODLE",
  description: "Modular kids' clothing. Tees, patches, kits.",
}

export default async function ShopPage() {
  const { products } = await medusa.store.product.list({
    limit: 50,
    fields: "*variants.calculated_price,*images",
  })

  return (
    <>
      <Nav />
      <main className="bg-[color:var(--color-surface-blush)] min-h-screen">
        <section className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-doodle-ink/55">
              First drop
            </div>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              Build the kit.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-doodle-ink/70">
              Pick a tee. Pick patches. Or start with a kit — same price, less thinking.
            </p>
          </div>
          <div className="mt-14 grid gap-6 grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3:** Run `npm run dev`. Navigate to `http://localhost:3000/shop`. Verify products render. Expected: 4 product cards (Tee, Patch, Starter Kit, Pattern Pack) with cheapest variant price.
- [ ] **Step 4:** Run `npx tsc --noEmit`. Expected: exit 0.
- [ ] **Step 5:** Commit: `git add src/app/shop src/components/shop/ProductCard.tsx && git commit -m "feat(shop): catalog index"`.

### Task 3.3: Publish products + smoke test in prod

- [ ] **Step 1:** In Medusa Admin, change all 4 products from Draft to Published.
- [ ] **Step 2:** Push to GitHub: `git push`. Wait for Vercel deploy.
- [ ] **Step 3:** Verify `https://<vercel-preview-url>/shop` loads with products.
- [ ] **Step 4:** Verify mobile (375px width via Chrome devtools). Snap a screenshot, store in `docs/build-log.md`.

---

## DAY 4 (Sun 2026-05-24) — PDP + variant picker

### Task 4.1: PDP route

**Files:**
- Create: `src/app/shop/[handle]/page.tsx`
- Create: `src/components/shop/VariantPicker.tsx`

- [ ] **Step 1:** Create `src/components/shop/VariantPicker.tsx`:

```tsx
"use client"

import * as React from "react"
import type { Product, Variant } from "@/lib/medusa/types"
import { formatINR } from "@/lib/medusa/types"
import { PillButton } from "@/components/ui/PillButton"
import { addToCart } from "@/app/actions/checkout"

type Selection = Record<string, string>

export function VariantPicker({ product }: { product: Product }) {
  const options = product.options ?? []
  const [selection, setSelection] = React.useState<Selection>(() =>
    Object.fromEntries(options.map((o) => [o.id, ""]))
  )
  const [busy, setBusy] = React.useState(false)
  const [msg, setMsg] = React.useState<string | null>(null)

  const selected: Variant | undefined = React.useMemo(() => {
    const allChosen = Object.values(selection).every(Boolean)
    if (!allChosen) return undefined
    return product.variants?.find((v) =>
      v.options?.every((o) => selection[o.option_id!] === o.value)
    )
  }, [product.variants, selection])

  const price = selected?.calculated_price?.calculated_amount
  const inStock = selected?.inventory_quantity == null || selected.inventory_quantity > 0

  async function onAdd() {
    if (!selected) return
    setBusy(true)
    setMsg(null)
    const result = await addToCart({ variantId: selected.id, quantity: 1 })
    setBusy(false)
    setMsg(result.ok ? "Added to cart." : result.error ?? "Something went wrong.")
  }

  return (
    <div className="space-y-6">
      {options.map((opt) => (
        <div key={opt.id}>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-doodle-ink/55">
            {opt.title}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {opt.values?.map((val) => {
              const active = selection[opt.id!] === val.value
              return (
                <button
                  key={val.id}
                  type="button"
                  onClick={() =>
                    setSelection((s) => ({ ...s, [opt.id!]: val.value! }))
                  }
                  className={[
                    "px-4 py-2 rounded-full border-2 border-dashed text-sm transition-colors",
                    active
                      ? "bg-doodle-ink text-doodle-canvas border-doodle-ink"
                      : "bg-doodle-canvas text-doodle-ink border-doodle-ink/30 hover:border-doodle-ink",
                  ].join(" ")}
                >
                  {val.value}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div className="pt-2">
        <div className="font-display text-3xl text-doodle-ink">
          {price != null ? formatINR(price) : "—"}
        </div>
        {selected && !inStock && (
          <p className="mt-2 text-sm text-doodle-ink/60">
            Sold out. Want us to text you when it&apos;s back?
          </p>
        )}
      </div>

      <PillButton
        variant="primary"
        size="lg"
        onClick={onAdd}
        disabled={!selected || !inStock || busy}
      >
        {busy ? "Adding…" : "Add to cart"}
      </PillButton>

      {msg && <p className="text-sm text-doodle-ink/70 mt-3">{msg}</p>}
    </div>
  )
}
```

- [ ] **Step 2:** Create `src/app/shop/[handle]/page.tsx`:

```tsx
import { notFound } from "next/navigation"
import Image from "next/image"
import { medusa } from "@/lib/medusa/client"
import { VariantPicker } from "@/components/shop/VariantPicker"
import { Nav } from "@/components/sections/Nav"
import { Footer } from "@/components/sections/Footer"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const { products } = await medusa.store.product.list({ handle, limit: 1 })
  const p = products[0]
  return {
    title: p ? `${p.title} — DOODLE` : "DOODLE",
    description: p?.description?.slice(0, 160),
  }
}

export default async function PDPPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const { products } = await medusa.store.product.list({
    handle,
    limit: 1,
    fields:
      "*variants.calculated_price,*variants.options,*variants.inventory_quantity,*options.values,*images",
  })
  const product = products[0]
  if (!product) notFound()

  const hero = product.images?.[0]?.url ?? product.thumbnail

  return (
    <>
      <Nav />
      <main className="bg-[color:var(--color-surface-blush)] min-h-screen">
        <section className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24 grid gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] rounded-[1.75rem] overflow-hidden stitch-thick bg-doodle-stitch">
            {hero && (
              <Image
                src={hero}
                alt={product.title ?? ""}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>
          <div>
            <h1 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              {product.title}
            </h1>
            {product.description && (
              <p className="mt-4 text-base leading-relaxed text-doodle-ink/70 max-w-md">
                {product.description}
              </p>
            )}
            <div className="mt-10">
              <VariantPicker product={product} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3:** Stub `addToCart` Server Action (will implement properly in Task 5.1):

Create `src/app/actions/checkout.ts`:

```ts
"use server"

import { revalidatePath } from "next/cache"
import { getOrCreateCart, getIndiaRegionId } from "@/lib/medusa/cart"
import { medusa } from "@/lib/medusa/client"

type Result<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string }

export async function addToCart(input: {
  variantId: string
  quantity: number
}): Promise<Result> {
  try {
    const regionId = await getIndiaRegionId()
    const cart = await getOrCreateCart(regionId)
    await medusa.store.cart.createLineItem(cart.id, {
      variant_id: input.variantId,
      quantity: input.quantity,
    })
    revalidatePath("/cart")
    revalidatePath("/", "layout") // cart badge in Nav
    return { ok: true, data: undefined }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error"
    return { ok: false, error: msg }
  }
}
```

- [ ] **Step 4:** Run `npm run dev`. Navigate to `/shop/tee`. Verify the PDP renders, colour + size pickers work, "Add to cart" succeeds without error.
- [ ] **Step 5:** Open browser devtools → Application → Cookies. Verify `doodle_cart_id` cookie is set after first add.
- [ ] **Step 6:** In Medusa Admin → Carts (under Customers section) → verify a new cart with the line item exists.
- [ ] **Step 7:** Run `npx tsc --noEmit`. Expected: exit 0.
- [ ] **Step 8:** Commit: `git add src/app/shop/[handle] src/components/shop/VariantPicker.tsx src/app/actions/checkout.ts && git commit -m "feat(shop): PDP + add-to-cart server action"`.

### Task 4.2 (parallel): Voice rewrite — HowItWorks.tsx

Pre-existing punch-list task (Task #2). Out-of-scope for commerce design, but in-scope for this week per Section 5 of the spec. Reference: parallel work, no commerce code dep.

- [ ] **Step 1:** Open `src/components/sections/HowItWorks.tsx`.
- [ ] **Step 2:** Apply voice principles (specific over generic, parent-knowing, short clauses). Rewrite the 3 step `body` strings.
- [ ] **Step 3:** Commit: `git add src/components/sections/HowItWorks.tsx && git commit -m "content: voice rewrite — HowItWorks"`.

---

## DAY 5 (Mon 2026-05-25) — Cart page + cart drawer

### Task 5.1: Cart page

**Files:**
- Create: `src/app/cart/page.tsx`
- Create: `src/components/shop/CartLine.tsx`
- Modify: `src/app/actions/checkout.ts` (add `updateLine`, `removeLine`)

- [ ] **Step 1:** Extend `src/app/actions/checkout.ts`:

```ts
export async function updateLine(input: {
  lineId: string
  quantity: number
}): Promise<Result> {
  try {
    const cart = await getCart()
    if (!cart) return { ok: false, error: "No cart" }
    await medusa.store.cart.updateLineItem(cart.id, input.lineId, {
      quantity: input.quantity,
    })
    revalidatePath("/cart")
    revalidatePath("/", "layout")
    return { ok: true, data: undefined }
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown" }
  }
}

export async function removeLine(input: { lineId: string }): Promise<Result> {
  try {
    const cart = await getCart()
    if (!cart) return { ok: false, error: "No cart" }
    await medusa.store.cart.deleteLineItem(cart.id, input.lineId)
    revalidatePath("/cart")
    revalidatePath("/", "layout")
    return { ok: true, data: undefined }
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown" }
  }
}
```

Also add import: `import { getCart } from "@/lib/medusa/cart"`.

- [ ] **Step 2:** Create `src/components/shop/CartLine.tsx`:

```tsx
"use client"

import Image from "next/image"
import * as React from "react"
import { useTransition } from "react"
import type { CartLine as CartLineT } from "@/lib/medusa/types"
import { formatINR } from "@/lib/medusa/types"
import { updateLine, removeLine } from "@/app/actions/checkout"

export function CartLine({ line }: { line: CartLineT }) {
  const [pending, startTransition] = useTransition()
  const thumbnail = line.thumbnail ?? line.variant?.product?.thumbnail

  function setQty(q: number) {
    if (q < 1) return
    startTransition(() => {
      void updateLine({ lineId: line.id, quantity: q })
    })
  }
  function remove() {
    startTransition(() => {
      void removeLine({ lineId: line.id })
    })
  }

  return (
    <div className="flex gap-4 py-5 border-b border-dashed border-doodle-ink/15">
      <div className="relative w-20 h-24 shrink-0 rounded-xl overflow-hidden bg-doodle-stitch">
        {thumbnail && (
          <Image src={thumbnail} alt={line.title ?? ""} fill className="object-cover" />
        )}
      </div>
      <div className="flex-1">
        <div className="font-display text-lg text-doodle-ink leading-tight">
          {line.title}
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-doodle-ink/55 mt-1">
          {line.variant?.title}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="inline-flex items-center rounded-full border-2 border-dashed border-doodle-ink/30">
            <button type="button" onClick={() => setQty(line.quantity - 1)} disabled={pending} className="px-3 py-1 text-doodle-ink">−</button>
            <span className="px-2 font-mono text-sm">{line.quantity}</span>
            <button type="button" onClick={() => setQty(line.quantity + 1)} disabled={pending} className="px-3 py-1 text-doodle-ink">+</button>
          </div>
          <button type="button" onClick={remove} disabled={pending} className="text-xs font-mono uppercase tracking-[0.18em] text-doodle-ink/55 hover:text-doodle-ink">
            Remove
          </button>
        </div>
      </div>
      <div className="text-right font-display text-lg text-doodle-ink">
        {formatINR(line.unit_price * line.quantity)}
      </div>
    </div>
  )
}
```

- [ ] **Step 3:** Create `src/app/cart/page.tsx`:

```tsx
import Link from "next/link"
import { Nav } from "@/components/sections/Nav"
import { Footer } from "@/components/sections/Footer"
import { PillButton } from "@/components/ui/PillButton"
import { CartLine } from "@/components/shop/CartLine"
import { getCart } from "@/lib/medusa/cart"
import { formatINR } from "@/lib/medusa/types"

export const dynamic = "force-dynamic"

export default async function CartPage() {
  const cart = await getCart()
  const items = cart?.items ?? []

  return (
    <>
      <Nav />
      <main className="bg-[color:var(--color-surface-blush)] min-h-screen">
        <section className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-24">
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
            Your basket
          </h1>

          {items.length === 0 ? (
            <div className="mt-10 rounded-[1.5rem] bg-doodle-canvas p-10 stitch-thick text-center">
              <p className="text-doodle-ink/70 text-lg">
                Nothing in the basket yet. Pick a tee, pick some patches — they&apos;re all over <Link href="/shop" className="underline">there →</Link>
              </p>
            </div>
          ) : (
            <>
              <div className="mt-10 rounded-[1.5rem] bg-doodle-canvas px-6 py-2 stitch-thick">
                {items.map((line) => (
                  <CartLine key={line.id} line={line} />
                ))}
              </div>

              <div className="mt-8 rounded-[1.5rem] bg-doodle-canvas p-6 stitch-thick">
                <div className="flex justify-between text-doodle-ink/70 text-sm">
                  <span>Subtotal</span>
                  <span>{formatINR(cart?.subtotal ?? 0)}</span>
                </div>
                <div className="flex justify-between text-doodle-ink/70 text-sm mt-2">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-doodle-ink font-display text-xl mt-4 pt-4 border-t border-dashed border-doodle-ink/15">
                  <span>Total</span>
                  <span>{formatINR(cart?.total ?? 0)}</span>
                </div>

                <div className="mt-6 text-center">
                  <Link href="/checkout">
                    <PillButton variant="primary" size="lg">
                      Continue to checkout
                    </PillButton>
                  </Link>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4:** Run `npm run dev`. Add an item from `/shop/tee` → navigate to `/cart` → verify item appears, qty +/- works, remove works, totals reflect changes.
- [ ] **Step 5:** Run `npx tsc --noEmit`. Expected: exit 0.
- [ ] **Step 6:** Commit: `git add src/app/cart src/components/shop/CartLine.tsx src/app/actions/checkout.ts && git commit -m "feat(cart): cart page with qty + remove"`.

### Task 5.2: Cart badge in Nav

**Files:**
- Create: `src/components/shop/CartButton.tsx`
- Modify: `src/components/sections/Nav.tsx`

- [ ] **Step 1:** Create `src/components/shop/CartButton.tsx`:

```tsx
"use client"

import Link from "next/link"
import { ShoppingBagOpen } from "@phosphor-icons/react/dist/ssr"
import { usePathname } from "next/navigation"

export function CartButton({ count }: { count: number }) {
  const pathname = usePathname()
  if (pathname.startsWith("/drop")) return null // /drop is a different funnel
  return (
    <Link
      href="/cart"
      aria-label={`Cart (${count} items)`}
      className="relative grid place-items-center h-11 w-11 rounded-full hover:bg-doodle-ink/5 transition-colors"
    >
      <ShoppingBagOpen weight="duotone" size={22} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-doodle-orange text-doodle-stitch rounded-full h-5 min-w-5 px-1 grid place-items-center text-[10px] font-mono">
          {count}
        </span>
      )}
    </Link>
  )
}
```

- [ ] **Step 2:** Update `src/components/sections/Nav.tsx` — add Shop link + CartButton. Replace existing NAV_LINKS + CTA section:

```tsx
// Inside Nav component, around the existing NAV_LINKS map + waitlist PillButton block.
// Replace NAV_LINKS array:
const NAV_LINKS = [
  { href: "/shop", label: "Shop the drop" },
  { href: "/#how", label: "How it works" },
  { href: "/#wall", label: "Patch library" },
  { href: "/#offline", label: "Find us" },
] as const;

// In the right-hand CTA cluster, replace the existing block with:
<div className="flex items-center gap-2">
  <CartButton count={cartCount} />
  <PillButton variant="primary" size="sm" asChild>
    <Link href="/shop">Shop the drop</Link>
  </PillButton>
</div>
```

- [ ] **Step 3:** Compute `cartCount` server-side: convert `Nav.tsx` top-level into an async Server Component wrapper that fetches the cart line count, OR pass it from `layout.tsx`. Easiest: make a thin server wrapper.

Create `src/components/sections/NavWithCart.tsx`:

```tsx
import { getCart } from "@/lib/medusa/cart"
import { Nav } from "./Nav"

export async function NavWithCart() {
  const cart = await getCart()
  const count = cart?.items?.reduce((n, i) => n + i.quantity, 0) ?? 0
  return <Nav cartCount={count} />
}
```

Update `Nav.tsx` to accept `cartCount` prop and render `<CartButton count={cartCount} />`.

- [ ] **Step 4:** In `src/app/page.tsx`, `src/app/cart/page.tsx`, `src/app/shop/page.tsx`, `src/app/shop/[handle]/page.tsx`, replace `<Nav />` with `<NavWithCart />`. Leave `/drop` using plain `<Nav cartCount={0} />` since `/drop` hides the cart button via path check.
- [ ] **Step 5:** Run `npm run dev`. Add items to cart → count badge updates after navigation. Verify `/drop` doesn't show the cart icon.
- [ ] **Step 6:** Run `npx tsc --noEmit`. Expected: exit 0.
- [ ] **Step 7:** Commit: `git add src/components/shop/CartButton.tsx src/components/sections/Nav.tsx src/components/sections/NavWithCart.tsx src/app/page.tsx src/app/cart src/app/shop && git commit -m "feat(nav): cart button with line count badge"`.

### Task 5.3 (parallel): Voice rewrite — WhyDoodle.tsx + strip fabrications

Punch-list Task #3. Reference: `Documents/doodle/src/components/sections/WhyDoodle.tsx`. Strip the 3 fabricated claims (2T-12 sizing, 4-6cm sleeve extension, workshop "living wages" claim) per the design Section 1 voice principle in the original brand work. Rewrite the 4 accordion item bodies in voice.

- [ ] **Step 1:** Open file, replace the 4 ITEMS bodies with voice-aligned + factually-verifiable copy.
- [ ] **Step 2:** Strip the 3 unverified claims.
- [ ] **Step 3:** Commit: `git add src/components/sections/WhyDoodle.tsx && git commit -m "content: voice rewrite — WhyDoodle + strip fabrications"`.

---

## DAY 6 (Tue 2026-05-26) — Resend integration + first templates

### Task 6.1: Wire Resend notification module in Medusa

**Files:**
- Modify: `doodle-backend/medusa-config.ts`
- Create: `doodle-backend/src/modules/resend/index.ts`
- Create: `doodle-backend/src/modules/resend/service.ts`
- Create: `doodle-backend/.env` (add RESEND_API_KEY)

- [ ] **Step 1:** From `doodle-backend/`: `npm install resend @react-email/components react-email`.
- [ ] **Step 2:** Add to `doodle-backend/.env`:

```env
RESEND_API_KEY=re_<your-key>
RESEND_FROM=hello@doodle.in
RESEND_REPLY_TO=doodlebycanvas@gmail.com
```

(Substitute `wearedoodle.in` if that's the domain bought.)

- [ ] **Step 3:** Follow the official Medusa Resend guide at https://docs.medusajs.com/resources/integrations/guides/resend — create `src/modules/resend/index.ts` + `service.ts` per the doc's NotificationProviderService pattern. Use Resend SDK's `emails.send({ from, replyTo, to, subject, react })`.

- [ ] **Step 4:** Register in `medusa-config.ts`:

```ts
modules: [
  {
    resolve: "@medusajs/medusa/notification",
    options: {
      providers: [
        {
          resolve: "./src/modules/resend",
          id: "resend",
          options: {
            channels: ["email"],
            api_key: process.env.RESEND_API_KEY,
            from: process.env.RESEND_FROM,
            reply_to: process.env.RESEND_REPLY_TO,
          },
        },
      ],
    },
  },
  // ...other modules
]
```

- [ ] **Step 5:** Restart Medusa locally: `npm run dev`. Verify no errors loading the resend module.
- [ ] **Step 6:** Commit: `git add . && git commit -m "feat(notify): wire Resend notification provider"`.

### Task 6.2: First 3 React Email templates (Welcome + OrderPlaced + OrderPlacedCOD)

**Files:**
- Create: `doodle-backend/src/emails/_brand.tsx`
- Create: `doodle-backend/src/emails/Welcome.tsx`
- Create: `doodle-backend/src/emails/OrderPlaced.tsx`
- Create: `doodle-backend/src/emails/OrderPlacedCOD.tsx`
- Create: `doodle-backend/src/subscribers/customer-created.ts`
- Create: `doodle-backend/src/subscribers/order-placed.ts`

- [ ] **Step 1:** Create `src/emails/_brand.tsx` with shared layout (Container, header logo from Cloudinary, footer with DOODLE by CANVAS).
- [ ] **Step 2:** Create `Welcome.tsx`: "Welcome to DOODLE — your account is live. Bookmark <domain>/shop to come back when we go live."
- [ ] **Step 3:** Create `OrderPlaced.tsx`: order ID, line items (kit summary block), total, shipping address, "We'll write when the courier picks up."
- [ ] **Step 4:** Create `OrderPlacedCOD.tsx`: same body, plus "Pay ₹{total} when it lands."
- [ ] **Step 5:** Create subscribers (Medusa event bus → notification dispatch):

```ts
// src/subscribers/customer-created.ts
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import Welcome from "../emails/Welcome"

export default async function customerCreatedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const notify = container.resolve("notification")
  const customers = container.resolve("customer")
  const customer = await customers.retrieveCustomer(event.data.id)
  await notify.createNotifications({
    to: customer.email,
    channel: "email",
    template: "Welcome",
    data: { firstName: customer.first_name ?? "" },
  })
}

export const config: SubscriberConfig = { event: "customer.created" }
```

(Repeat for `order.placed` subscriber, dispatching `OrderPlaced` or `OrderPlacedCOD` based on order's payment provider.)

- [ ] **Step 6:** Test: in Medusa admin, create a test customer → check that the Welcome email arrives at the test email address.
- [ ] **Step 7:** Commit: `git add . && git commit -m "feat(emails): Welcome + OrderPlaced + OrderPlacedCOD templates and subscribers"`.

### Task 6.3 (parallel): Voice rewrite — EarlyVoices.tsx

Punch-list Task #4.

- [ ] **Step 1:** Open `src/components/sections/EarlyVoices.tsx`. Improve the 3 placeholder quotes to voice-aligned but-still-clearly-placeholder prose. Keep the `[placeholder names — will swap with real consented quotes]` footer.
- [ ] **Step 2:** Commit.

---

## DAY 7 (Wed 2026-05-27) — End-of-Week-1 milestone + polish

### Task 7.1: `npm run build` production verification

**Files:** None.

- [ ] **Step 1:** From `Documents/doodle/`: `npm run build`. Expected: exit 0, all routes pre-rendered or marked `ƒ` for dynamic.
- [ ] **Step 2:** From `doodle-backend/`: `npm run build`. Expected: exit 0.
- [ ] **Step 3:** Lighthouse on `https://<vercel-preview-url>/shop` (mobile): Performance ≥ 80, Accessibility ≥ 95, Best Practices ≥ 95.
- [ ] **Step 4:** Note any regressions in `docs/build-log.md`.

### Task 7.2: Voice rewrites — DualCTA + Footer

Punch-list Tasks #5 + #6.

- [ ] **Step 1:** Voice-rewrite `DualCTA.tsx` (Consumer + Stockist card copy).
- [ ] **Step 2:** Voice-rewrite `Footer.tsx` tagline under wordmark.
- [ ] **Step 3:** Commit both: `git commit -m "content: voice rewrite — DualCTA + Footer"`.

### Task 7.3: Week-1 milestone checklist

- [ ] Catalog browseable at `/shop`
- [ ] PDP works at `/shop/[handle]`
- [ ] Cart adds, updates, removes
- [ ] Cart count badge in Nav
- [ ] Medusa admin reachable at `api.doodle.in/app`
- [ ] Resend Welcome + OrderPlaced templates fire
- [ ] Voice rewrites complete (HowItWorks, WhyDoodle, EarlyVoices, DualCTA, Footer)
- [ ] `npm run build` passes both repos
- [ ] Razorpay KYC status check — escalate if not approved by today

---

## WEEK 2 (Days 8-14, May 28 - Jun 3) — Checkout + Razorpay + COD + Shiprocket

**Detail level: scaffold. Re-expand after Week 1 milestone.**

### Task 8.1 (Day 8 Thu 5/28): `/checkout` single-page form scaffold

Single-page checkout with 3 collapsible sections (Contact, Shipping, Payment). Server Component shell + 3 client section components (`CheckoutContact`, `CheckoutShipping`, `CheckoutPayment`). Each section's "Continue" updates the cart via Server Action and reveals the next.

### Task 9.1 (Day 9 Fri 5/29): Audit + fork Razorpay community plugin

Clone `@devx-commerce/razorpay` into `doodle-backend/packages/medusa-plugin-razorpay/`. Audit: HMAC-SHA256 signature verification, payment_session create flow, capture flow, refund flow, webhook handler. Add the plugin path to `medusa-config.ts` payment module providers. Wire `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` envs (test mode keys).

### Task 9.2 (Day 9): Storefront — RazorpayCheckout component

Client component that lazy-loads `https://checkout.razorpay.com/v1/checkout.js`, opens modal with `rzp_order_id`, handles success callback (POSTs `payment_id` + signature to a Server Action that calls Medusa's `complete-cart` flow), handles `payment.failed`.

### Task 10.1 (Day 10 Sat 5/30): Razorpay webhook handler

`src/api/webhooks/razorpay/route.ts` in Medusa backend. Verifies `x-razorpay-signature` HMAC-SHA256 against `RAZORPAY_WEBHOOK_SECRET`. On `payment.captured` → mark order paid (idempotent). On `refund.processed` → mark order refunded.

### Task 11.1 (Day 11 Sun 5/31): Custom COD payment provider

Create `src/modules/payment-cod/` module implementing `AbstractPaymentProvider`. Methods: `createPaymentSession` (just records intent), `capturePayment` (no-op until Shiprocket marks delivered), `refundPayment` (mark refund pending — actual refund via manual UPI), `webhookHandler` (no-op — fulfillment webhook drives state).

### Task 11.2 (Day 11): Audit + fork Shiprocket plugin

Clone `Hemann55/medusa-fulfillment-shiprocket@v0.3.0` into `packages/medusa-plugin-shiprocket/`. Add to `medusa-config.ts` fulfillment providers. Wire `SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD`, `SHIPROCKET_PICKUP_NICKNAME`, `SHIPROCKET_WEBHOOK_TOKEN` envs.

### Task 12.1 (Day 12 Mon 6/1): Shiprocket serviceability check on /checkout

Server Action `checkPincode(pincode)` calls Shiprocket courier serviceability API, returns: serviceable y/n, COD-allowed y/n, estimated delivery days, cheapest shipping rate. Wire into `CheckoutShipping` component — runs on pincode input blur.

### Task 13.1 (Day 13 Tue 6/2): `/order/[id]/confirmed` page + remaining email templates

Create the confirmation page (reads order via SDK using `display_id` or token). Add: PaymentReceived, OrderShipped, OrderDelivered, ReturnAcknowledged, RefundProcessed templates + their subscribers. Test each.

### Task 14.1 (Day 14 Wed 6/3): End-to-end staging test

Place a real test order through the storefront against Razorpay TEST mode. Verify: payment captured → admin shows paid → Shiprocket creates order → AWB assigned → all 8 email templates received in order.

### Task 14.2 (Day 14): Week-2 milestone checklist

- [ ] `/checkout` flow works contact → shipping → payment
- [ ] Razorpay test payment succeeds end-to-end (UPI, card, netbanking, wallet)
- [ ] COD order placed end-to-end
- [ ] Shiprocket order auto-created, AWB visible in admin
- [ ] Pincode serviceability check works
- [ ] All 8 Resend templates render correctly
- [ ] Webhooks verified (Razorpay capture, Shiprocket tracking)
- [ ] Idempotency tested (replay same webhook → no double-state-change)

---

## WEEK 3 (Days 15-20, Jun 4-9) — Polish + soft launch + production

**Detail level: scaffold. Re-expand after Week 2 milestone.**

### Task 15.1 (Day 15 Thu 6/4): `/account` + sign-in/sign-up flow

Routes: `/account`, `/account/login`, `/account/orders/[id]`, `/account/addresses`. Magic-link sign-in via Medusa auth + Resend.

### Task 16.1 (Day 16 Fri 6/5): Mobile + Lighthouse pass

Manual mobile QA at 375 / 768 / 1024 / 1440. Lighthouse: Performance ≥ 80, Accessibility ≥ 95 on /, /shop, /shop/[handle], /cart, /checkout. Fix the worst offenders.

### Task 17.1 (Day 17 Sat 6/6): Two custom admin widgets

`order-kit-summary.tsx` (renders kit composition on Order detail page). `daily-rollup.tsx` (Dashboard home: today's orders, revenue, COD/prepaid split, top-selling patches). Register via Medusa Admin widget API.

### Task 17.2 (Day 17): Error-state copy polish

Verify all error / empty / sold-out / payment-failed / address-invalid / serviceability-failed copy matches Section 5 of the spec's voice table.

### Task 18.1 (Day 18 Sun 6/7): SOFT LAUNCH — ₹1 LIVE transactions

Switch Razorpay to LIVE keys (assuming KYC approved). Each of 5 co-founders places one ₹1 test order using LIVE Razorpay. Verify webhook + Shiprocket + emails. Refund all 5.

### Task 19.1 (Day 19 Mon 6/8): Fix-it day

Triage soft-launch issues. Sentry zero-error pass. Webhook signature verification audit. Env var audit (no test keys in prod, no secrets in storefront client bundle). Security pass.

### Task 20.1 (Day 20 Tue 6/9): PUBLIC LAUNCH

- [ ] Flip Nav primary CTA: home shows "Shop the drop" / /drop keeps waitlist
- [ ] One-time Resend campaign: "DOODLE is live — claim your account" → all waitlist signups (opt-in account creation via magic link)
- [ ] Update /drop LP CTA from "Join the waitlist" to "Shop the drop" (or run both depending on inventory)
- [ ] Announce on Ash's IG / co-founder networks
- [ ] Monitor Sentry + PostHog + Medusa admin in real time for first 4h
- [ ] Define-of-live checklist (spec Section 6) — verify all 10 items GREEN

---

## Self-review (run by author after writing)

### Spec coverage

| Spec section | Plan task(s) | Covered? |
|---|---|---|
| §1 Architecture + topology | Tasks 0.4-0.5 (Upstash, Railway), 1.1-1.2 (Neon, Railway deploy) | ✅ |
| §2 Catalog (4 SKUs, kit, pack) | Task 3.1 (seed) | ✅ |
| §2 Phasing v1 vs v1.1 (configurator) | v1 = a la carte + kits (Tasks 3-4); v1.1 explicitly deferred | ✅ |
| §3 Customer journey pages | Tasks 3.2 (/shop), 4.1 (PDP), 5.1 (/cart), 8.1 (/checkout), 13.1 (/order/confirmed), 15.1 (/account) | ✅ |
| §3 Razorpay Standard Checkout | Tasks 9.1, 9.2, 10.1 | ✅ |
| §3 COD custom provider | Task 11.1 | ✅ |
| §3 Webhook = source of truth | Task 10.1 | ✅ |
| §3 Anonymous cart | Task 2.3 (cart helpers) | ✅ |
| §4 Medusa admin OOTB | No task needed — comes free | ✅ |
| §4 Custom admin widgets | Task 17.1 | ✅ |
| §4 Shiprocket integration | Task 11.2, 12.1 | ✅ |
| §4 Resend templates (8 templates) | Task 6.1, 6.2 (3 templates), 13.1 (remaining 5) | ✅ |
| §4 Sender setup (from + reply-to) | Task 0.7 (domain verify), 6.1 (env config) | ✅ |
| §5 Repo organization (2 repos) | Task 0.8 (backend repo init) | ✅ |
| §5 Voice rewrites in parallel | Tasks 4.2, 5.3, 6.3, 7.2 | ✅ |
| §5 Nav update (Shop the drop) | Task 5.2 | ✅ |
| §5 /drop untouched | CartButton hides on /drop path | ✅ |
| §5 No Auth.js — Medusa auth | Task 15.1 | ✅ |
| §6 Day-0 prep (P1-P9) | Tasks 0.1-0.7 | ✅ |
| §6 Definition of "live" | Task 20.1 references spec §6 checklist | ✅ |
| §6 Public launch | Task 20.1 | ✅ |
| §7 Open Q deferred (Shiprocket pickup) | Task 0.3 step 3 flags `[PENDING-ASH]` | ✅ |
| Pricing ₹999/₹250/₹999/₹80 + free ship >₹999 | Task 3.1 + storefront math respects these | ✅ |

### Placeholder scan

Searched the plan for: "TBD", "TODO", "implement later", "fill in details", "add appropriate error handling" — none found in tasks. Week 2 + Week 3 tasks ARE scaffolded (marked explicitly so) and will be re-expanded after Week 1; this is the intended granularity progression, not a placeholder.

### Type consistency

- `Cart`, `CartLine`, `Product`, `Variant` are imported from `@/lib/medusa/types` throughout
- `addToCart`, `updateLine`, `removeLine` Server Actions all return the same `Result` type
- `getCart()` and `getOrCreateCart()` are the only two cart-acquisition helpers, used consistently

---

## Status

**Spec:** locked at commit `067ad51`.
**Plan:** this file. Day 0 + Week 1 ready for execution. Week 2 + Week 3 re-expand after Week 1 milestone.

**Next:** Execution. See "Execution Handoff" at end of writing-plans skill — Subagent-Driven (recommended) or Inline.
