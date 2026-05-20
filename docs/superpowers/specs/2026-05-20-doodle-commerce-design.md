# DOODLE Commerce — Design Spec

**Date:** 2026-05-20
**Author:** Ash + Claude
**Status:** Design (pre-implementation). Awaiting Ash sign-off before `writing-plans` hand-off.
**Bar:** "As good as Shopify" — full storefront + admin + India-specific integrations breadth.
**Window:** 2-3 weeks to transactable end-to-end (target public launch 2026-06-09, gated on inventory).

---

## 0. Context

DOODLE is a pre-launch DTC kids' clothing brand (modular tees + interchangeable patches) co-founded by Ash. The repo at `Documents/doodle/` is currently a Next.js 16 + React 19 + Tailwind v4 marketing site with a live `/drop` paid-campaign landing page (running Meta Pixel, Neon waitlist capture).

This spec turns that marketing site into a full commerce platform with storefront, PDP, cart, checkout (Razorpay + COD), admin, and India-specific integrations (Shiprocket fulfillment, Resend transactional email). The bar is Shopify-level customer UX + operational admin + integration breadth, achieved by **adopting Medusa.js v2** as a headless commerce engine while keeping the existing Next.js storefront as the customer-facing layer.

The locked foundation stack (Neon + Drizzle + Auth.js + Cloudinary + Resend) is amended here: **Drizzle stays for marketing data (waitlist); Medusa owns commerce data via its own ORM. Auth.js is dropped for the customer side; Medusa's built-in JWT auth is used instead.**

GST is out of scope for v1 — DOODLE is well below the ₹40L threshold.

---

## 1. System architecture + deployment topology

### Two-deploy architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  doodle.in (Vercel — Singapore region)                          │
│  ─────────────────────────────────────────────────────────────  │
│  Next.js 16 storefront                                          │
│    /                  marketing (unchanged)                     │
│    /drop              paid LP (unchanged)                       │
│    /shop              catalog                                   │
│    /shop/[handle]     PDP                                       │
│    /cart              cart                                      │
│    /checkout          checkout                                  │
│    /account           customer area                             │
│    /order/[id]        order confirmation + tracking             │
└──────────────────────────────┬──────────────────────────────────┘
                               │ REST + JWT (HttpOnly cookie)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  api.doodle.in (Railway — Singapore region)                     │
│  ─────────────────────────────────────────────────────────────  │
│  Medusa v2 backend                                              │
│    /admin              admin dashboard (built-in)               │
│    /store/*            customer storefront API                  │
│    /admin/*            admin API                                │
│    /webhooks/razorpay  payment webhook                          │
│    /webhooks/shiprocket fulfillment webhook                     │
│  ─────────────────────────────────────────────────────────────  │
│  Modules: Product · Cart · Order · Customer · Payment           │
│           · Fulfillment · Promotion · Inventory                 │
│  Plugins: Razorpay (forked from devx-commerce/razorpay)         │
│           Shiprocket (forked from Hemann55/medusa-fulfillment-  │
│           shiprocket)                                           │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
       ┌────────────────┐         ┌─────────────────────┐
       │ Neon Postgres  │         │ Upstash Redis       │
       │ (Singapore)    │         │ (free tier; AP)     │
       │ • Medusa data  │         │ • Workflow engine   │
       │ • Existing     │         │ • Cache             │
       │   waitlist     │         │ • Event bus         │
       └────────────────┘         └─────────────────────┘
                ▲
                │
       ┌────────┴────────┐
       │ Cloudinary      │
       │ • Product imgs  │
       │ • Brand assets  │
       └─────────────────┘

       Cross-cutting (already wired): Sentry · PostHog · Resend
```

### Why this topology

- **Region co-location:** Vercel `sin1` ↔ Railway `Singapore` ↔ Neon `ap-southeast-1` ↔ Upstash `ap-south` — all sub-50ms latency to each other and to Indian customers
- **Two domains, one brand root:** `doodle.in` (customers) + `api.doodle.in` (Medusa). Same root domain = no cross-origin cookie headaches
- **Neon Postgres shared:** Drizzle owns `public.waitlist`; Medusa creates its own namespaced schema. Zero collision.
- **Upstash Redis free tier** = 256 MB, 500K commands/day — covers a 200-tee drop easily

### Cost at first-drop scale

| Service | Tier | Monthly |
|---|---|---|
| Vercel (storefront) | Free / Hobby | $0 |
| Railway (Medusa backend) | Hobby ($5 credit) | ~$5-10 |
| Neon Postgres | Free | $0 |
| Upstash Redis | Free | $0 |
| Cloudinary | Free (25 GB) | $0 |
| Resend | Free (3k emails/mo) | $0 |
| Sentry | Free (5k events/mo) | $0 |
| PostHog | Free (1M events/mo) | $0 |
| **Total** | | **~$5-10/mo** |

### Hard architectural decisions

1. **Backend host: Railway** over Render — Railway has the official Medusa v2 deploy template with Postgres + Redis pre-wired
2. **`api.doodle.in` as subdomain** (assumes Ash owns the apex; CNAME to Railway-provided URL)
3. **Neon stays as the single Postgres** — Medusa uses its own schema; Drizzle keeps `waitlist`
4. **No Auth.js for customers** — Medusa's built-in customer auth + JWT is enough

---

## 2. Catalog model + data design

### Product taxonomy (3 buyer modes)

```
DOODLE CATALOG
├── 1. Tees (base product)
│    ├── Colour: Bubblegum Pink #F4A7B9 | Powder Blue #A8D8EA
│    ├── Size:   S (3-4y) | M (4-5y) | L (5-6y)
│    └── = 6 variants total (2 × 3)
│
├── 2. Patches (companion product)
│    ├── First-SKU geometric: Star · Square · Circle · Triangle · Pentagon
│    ├── Colour: 3 of the 6 palette colours for v1 (rest in drop 2)
│    └── = 15 variants for first drop (5 shapes × 3 colours)
│
└── 3. Starter Kits (curated bundles — Medusa native Inventory Kit)
     ├── "Doodle Starter"  = 1 tee + 3 patches @ flat price (~10% saving)
     ├── "Pattern Pack"    = 5 mixed patches only (~20% saving)
     └── "Mini Doodle"     = 1 tee + 1 patch (entry-level)
```

### Phasing — catalog complexity

**v1 (week 1) — sell everything as separate Medusa products + 3 curated Starter Kits**
- Tees = standalone Product (Medusa native)
- Patches = standalone Product, sold individually (Medusa native)
- Starter Kits = Medusa native **Inventory Kit** variants (single product, single price)
- Cart-level rule: "Add a tee + 3 patches manually → auto-apply 15% kit discount" (Medusa Promotion module)
- PDP for a tee shows: "Style it: pick patches separately" with a link to the patch catalog
- **Ships in week 1. No custom Medusa modules required.**

**v1.1 (week 2-3 IF v1 stabilises by end of week 1) — Custom Patch Picker on the tee PDP**
- Custom Medusa Bundle Module (per Medusa Bundled Products recipe)
- Custom endpoint `POST /store/carts/:id/line-item-bundles`
- Storefront PDP gets a "Build your kit" UI — pick patches visually inside the tee PDP, "Add Kit" creates a bundled line item, patches deduct inventory atomically

### Data co-existence with the existing waitlist

```
Neon Postgres (single DB, two schemas — zero collision)
├── public.waitlist            ← Drizzle-owned (existing /drop campaign)
│   └── unchanged, untouched
└── medusa.* (auto-created)    ← Medusa-owned
```

Migration of waitlist signups → Medusa customer accounts is deferred. At commerce launch, we send a one-time "claim your account, shop the drop" email via Resend with a Magic Link → Medusa customer creation. Opt-in not opt-out.

### Pricing structure — LOCKED 2026-05-20

| SKU | Price | Notes |
|---|---|---|
| **Starter Kit** (tee + 3 patches) | **₹999** | Headline product — flat price, all colours/sizes |
| **Pattern Pack** (5 patches only) | **₹250** | Replenishment / add-on; effective ₹50/patch |
| **Tee (standalone)** | **₹999** | Same as kit price — strong kit anchor; buying parts = ₹1,239 vs kit ₹999 |
| **Patch (single)** | **₹80** | Encourages 5-pack at ₹250 (₹50/patch) over single (₹80) |
| Mini Doodle (tee + 1 patch) | `[DROPPED]` — not in Ash's confirmed lineup | Removed from v1 |

**Free shipping threshold: above ₹999** (locked). Buying a Starter Kit or a standalone tee gets free shipping — neat price anchor.

**Pricing math:** Kit ₹999 vs sum-of-parts (tee ₹999 + 3 patches × ₹80 = ₹1,239) = kit saves ₹240 (19%). Pattern Pack ₹250 vs 5 singles × ₹80 = ₹400 = pack saves ₹150 (38%). Both bundles meaningfully cheaper than à la carte — drives kit adoption.

The brand-spec ₹370/tee figure in memory is COGS, not selling price. Selling-side framing puts both Kit and Tee at ₹999 as the headline price point.

### Catalog edge cases

| Scenario | Handling |
|---|---|
| Patch inventory depletes mid-checkout | Medusa Inventory reserves on cart-add; if depleted at checkout, show "no longer available" |
| Customer adds tee but no patches | Valid; tee ships as base with no patches attached (velcro slots remain) |
| Patches without a tee | Valid (replenishment / top-up) |
| Kid outgrows tee mid-life | Patches survive; customer rebuys a new tee size, keeps patches |
| Patch sold separately != patch sold in kit | Same SKU; one inventory item with two purchase paths |

---

## 3. Customer flow + checkout + Razorpay integration

### Customer journey (page-by-page)

```
/  or  /drop  →  /shop  →  /shop/[handle]  →  /cart  →  /checkout  →  /order/[id]/confirmed
                                                              │
                                                              └─► Razorpay modal (UPI / card / wallet)
                                                              └─► OR COD path (custom provider)
```

### Cart state management

| Decision | Choice |
|---|---|
| Anonymous cart support | Yes — always (Medusa cart_id in `doodle_cart_id` cookie, 30-day TTL) |
| Cart sync across devices | Only after account creation; before that, device-local |
| Cart updates | Server-driven via Medusa REST — single source of truth |
| Abandoned-cart tracking | Instrument in v1, send recovery emails in v1.1 |

### Checkout — single page, 3 collapsible sections

1. **Contact** — email + phone (both required for COD verification)
2. **Shipping** — full address + pincode → live Shiprocket serviceability check
3. **Payment** — Razorpay Standard Checkout OR COD

### Razorpay integration architecture (Standard Checkout — chosen for v1)

```
Customer clicks "Place order" on /checkout
        │
        ▼
Storefront → POST /store/carts/:id/complete  ────► Medusa backend
                                                       │
                                                       │ 1. Validate cart (inventory, addresses, shipping)
                                                       │ 2. Reserve inventory atomically
                                                       │ 3. Create Razorpay order via plugin
                                                       ▼
                                                  Razorpay returns rzp_order_id
        │
        ▼
Storefront opens Razorpay Checkout.js modal
Customer pays via UPI/card/wallet/netbanking
        │
        ├──► On success: callback fires razorpay_payment_id + signature
        │       Storefront → Medusa verifies signature (HMAC-SHA256)
        │       Medusa captures payment → moves order to "paid"
        │       Storefront redirects to /order/[id]/confirmed
        │
        └──► Parallel webhook (source of truth)
                Razorpay POST → api.doodle.in/webhooks/razorpay
                Medusa webhookHandler verifies signature → updates order state
                (idempotent — first to mark "paid" wins, second is no-op)
```

**Why both callback AND webhook:** callback is fast (UX) but unreliable; webhook is source of truth. Race-safe via idempotent state transitions.

### COD flow

```
Customer picks COD on /checkout
        │
        ▼
Storefront → POST /store/carts/:id/complete with payment_session_id="cod"
        │
        ▼
Medusa "cod" custom provider (~50 lines):
   • Validates address via Shiprocket serviceability + COD-allowed pincode
   • Marks order "placed" + "awaiting_cod"
   • Reserves inventory
   • Triggers Shiprocket order creation
        │
        ▼  Later, on delivery:
Shiprocket webhook → "shipment.delivered"
Medusa marks order "paid" + "delivered"
```

### Magic Checkout — deferred to v1.1

| | Magic Checkout | Standard Checkout (v1) |
|---|---|---|
| Conversion lift | 12-25% measured ([Razorpay 2026 guide](https://razorpay.com/blog/express-checkout-conversion-guide)) | Baseline |
| RTO reduction | 21-26% | Manual via Shiprocket flags |
| Activation timeline | Days — KYC + Magic plan signup | Hours — standard Razorpay account |
| Plugin support | Likely custom work | Verified via [@devx-commerce/razorpay](https://www.npmjs.com/package/@devx-commerce/razorpay) |

### Checkout error states + edge cases

| Scenario | Handling |
|---|---|
| Inventory depletes between cart-add and checkout | Medusa reserves on cart-add; on `complete`, re-validates; if depleted, 409 → "X is sold out" |
| Razorpay payment authorized but webhook never fires | Cron polls `payment.fetch` for orders stuck in "authorized" > 5 minutes |
| Customer pays, then network drops before callback | Webhook is source of truth → order still moves to paid → confirmation email still fires |
| COD address fails Shiprocket post-checkout | "Needs review" flag in Medusa admin → manual outreach |
| Customer refreshes /checkout mid-payment | Idempotency on `complete` — same cart_id can't create duplicate Razorpay order |
| Duplicate webhook from Razorpay | State transition idempotent; event_id deduped in Medusa cache |
| Refund (full or partial) | Razorpay refund via plugin → webhook → Medusa marks order "refunded" → Resend email |
| Payment-pending > 30 minutes | Cron releases inventory, marks order "cancelled — payment timeout" |

### Section 3 hard calls

1. Standard Checkout for v1; Magic Checkout for v1.1
2. Single-page checkout (3 collapsible sections)
3. COD = Medusa custom provider, not delegated to Shiprocket
4. Webhook is source of truth; callback is UX-only
5. Anonymous cart by default; account post-purchase
6. Live Shiprocket serviceability check on /checkout

---

## 4. Admin surface + integrations

### Medusa Admin v2 — out of the box

Zero-custom-code admin includes: Products, Inventory, Orders (with full status timeline), Customers, Discounts + Promotions, Gift Cards, Fulfillment, Returns + Exchanges, Sales Channels, Regions.

### Admin role model

- **Flat admin role for v1** — every invited admin has full access (Medusa v2 OOTB limitation)
- All 5 co-founders get individual admin accounts (audit trail per user)
- Granular RBAC via [medusa-rbac-public](https://github.com/RSC-Labs/medusa-rbac-public) deferred to v1.2

### Custom admin extensions (v1)

| Widget | Lives on | Job |
|---|---|---|
| Patch kit summary | Order detail page | Renders kit composition as one block instead of N line items |
| First-drop daily roll-up | Dashboard home | Today's orders, revenue, COD vs prepaid split, top-selling patches |

### Integrations wired in v1

| Integration | Plugin | Status |
|---|---|---|
| **Razorpay payments** | [@devx-commerce/razorpay](https://www.npmjs.com/package/@devx-commerce/razorpay) (forked into `packages/medusa-plugin-razorpay/`) | Audit + integrate week 2 |
| **Shiprocket fulfillment** | [Hemann55/medusa-fulfillment-shiprocket v0.3.0](https://github.com/Hemann55/medusa-fulfillment-shiprocket) (forked into `packages/medusa-plugin-shiprocket/`) | Audit + integrate week 2 |
| **Resend transactional email** | Medusa Resend notification module (per [official guide](https://docs.medusajs.com/resources/integrations/guides/resend)) | Wire week 1 |
| **Cloudinary image CDN** | Custom Medusa module + Next/Image | Wire week 1 |
| **Sentry, PostHog** | Already wired in storefront; extend to commerce events | Week 2 |

### Resend transactional templates (v1)

| Event | Template | Subject |
|---|---|---|
| `order.placed` | OrderPlaced.tsx | "We've got your order — DOD-{id}" |
| `order.placed` (COD) | OrderPlacedCOD.tsx | "Order DOD-{id} — pay ₹{total} on delivery" |
| `payment.captured` | PaymentReceived.tsx | "Payment received — DOD-{id}" |
| `order.shipment_created` | OrderShipped.tsx | "DOD-{id} is on the way ({courier} · {awb})" |
| `order.fulfillment_delivered` | OrderDelivered.tsx | "Your DOODLE has landed" |
| `customer.created` | Welcome.tsx | "Welcome to DOODLE — your account is live" |
| `order.return_requested` | ReturnAcknowledged.tsx | "Got your return request for DOD-{id}" |
| `payment.refunded` | RefundProcessed.tsx | "Refund of ₹{amount} is on its way" |

**Sender setup — LOCKED 2026-05-20:**
- **From:** `hello@doodle.in` (or `hello@wearedoodle.in` if `doodle.in` taken). Domain-verified, SPF/DKIM/DMARC configured, high deliverability.
- **Reply-To:** `doodlebycanvas@gmail.com` (Ash's existing Gmail inbox). Customers click Reply → lands in Gmail → Ash reads + replies there. No new inbox infra.

This pattern keeps brand-aligned sender for outbound deliverability while leveraging existing Gmail for inbound support. Configured at the Resend template level.

### Deferred to v1.1

| Integration | Why |
|---|---|
| WhatsApp Cloud API | WA Business API approval takes 1-3 weeks |
| Product reviews ([@lambdacurry/medusa-product-reviews](https://github.com/lambda-curry/medusa-plugin-product-reviews)) | No purchases = no reviews to display |
| Razorpay Magic Checkout | Activation runway + Standard baseline measurement |
| Abandoned-cart email recovery | Data pipeline v1, drip emails v1.1 |
| MSG91 COD OTP | Defer until COD fraud is observed |
| Granular admin RBAC | 5 trusted founders, not needed yet |

### Section 4 hard calls

1. Flat admin role for v1, no RBAC
2. Two custom admin widgets only (resisting over-build)
3. WhatsApp deferred to v1.1
4. Reviews deferred to week 4-6 post-launch
5. Single sender `hello@doodle.in`, all transactional
6. Audit-and-fork community plugins into the repo

---

## 5. Repo integration + storefront

### What stays preserved untouched

Everything below stays as-is. **No commerce code touches these files.**

- `src/app/page.tsx` — marketing homepage
- `src/app/drop/page.tsx` — live paid campaign
- `src/components/sections/*.tsx` (13 files) — all marketing sections
- `src/components/motion/*.tsx` — motion library
- `src/components/ui/PillButton.tsx`, `MarkerHeading.tsx`, `Rough.tsx`, `PatchScrubber.tsx`
- `src/components/ui/WaitlistForm.tsx`, `ConversionScripts.tsx`
- `src/app/globals.css` — brand tokens
- `src/app/actions/waitlist.ts`
- Existing Drizzle schema (`waitlist` table)

### Voice rewrites — continue in parallel

Voice rewrites (HowItWorks, WhyDoodle, EarlyVoices, DualCTA, Footer) **stay on the punch list and finish during week 1 of the commerce build**. Marketing site quality drives traffic to /shop — these ship before commerce goes live, not deferred.

### Repo organization — two separate repos

```
Documents/
├── doodle/                       ← EXISTING repo (storefront + marketing)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (existing routes unchanged)
│   │   │   ├── shop/             ← NEW
│   │   │   ├── cart/             ← NEW
│   │   │   ├── checkout/         ← NEW
│   │   │   ├── account/          ← NEW
│   │   │   └── order/[id]/       ← NEW
│   │   ├── components/shop/      ← NEW (PDP, CartLine, ProductCard, etc.)
│   │   ├── lib/medusa/           ← NEW (SDK client, types)
│   │   └── actions/checkout.ts   ← NEW (server actions for cart ops)
│   └── package.json              ← adds @medusajs/js-sdk
│
└── doodle-backend/               ← NEW sibling repo (Medusa)
    ├── src/
    │   ├── api/, modules/, subscribers/, workflows/, admin/
    ├── medusa-config.ts
    ├── packages/
    │   ├── medusa-plugin-razorpay/    ← forked + audited from devx-commerce
    │   └── medusa-plugin-shiprocket/  ← forked + audited from Hemann55
    └── package.json
```

**Two repos, not a monorepo.** Separate Vercel + Railway deploys, simpler CI. Shared types as hand-synced narrow type definitions (3-4 interfaces) for v1; migrate to Turborepo if pain emerges.

### Storefront → Medusa wiring

```ts
// src/lib/medusa/client.ts
import Medusa from "@medusajs/js-sdk"
export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BASE_URL!,
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUB_KEY!,
})
```

- **Server Components** call `medusa.store.product.list()` server-side — fast, cacheable
- **Server Actions** call SDK from `actions/checkout.ts` — single round-trip, CSRF-safe
- **Client Components** call SDK only when state must update without navigation (cart drawer, Razorpay modal, configurator)

### State management — minimal additions

| State | Where it lives |
|---|---|
| Cart ID | `doodle_cart_id` cookie (HttpOnly) — set by Medusa SDK |
| Cart contents | Re-fetched from Medusa on every cart page render |
| Customer session | `_medusa_jwt` cookie (HttpOnly) |
| Cart line count badge | React Context with cookie-revalidate on mutation |

**No Redux, no Zustand, no SWR.** Server Components + React Context covers everything.

### Nav surface update

```tsx
// src/components/sections/Nav.tsx — updated NAV_LINKS
const NAV_LINKS = [
  { href: "/shop",      label: "Shop the drop" },   // NEW — primary
  { href: "/#how",      label: "How it works" },
  { href: "/#wall",     label: "Patch library" },
  { href: "/#offline",  label: "Find us" },
] as const;
```

A `<CartButton />` (line count + cart icon) appears in the Nav on commerce pages. On `/drop` it stays hidden.

### Voice extends into commerce surfaces

| Surface | Default e-com copy | DOODLE voice |
|---|---|---|
| Empty cart | "Your cart is empty" | "Nothing in the basket yet. Pick a tee, pick some patches — they're all over there →" |
| Out of stock | "This item is out of stock" | "Sold out. Want us to text you when this colour's back?" |
| Order placed (prepaid) | "Thank you for your order" | "Got it. DOD-{id} is now in motion. We'll write again when the courier picks it up." |
| Order placed (COD) | "Order placed — pay on delivery" | "Got it. Pay ₹{total} when it lands. The courier will message you the day they're on the way." |
| Account creation prompt | "Create an account" | "Save your address so next time it's two clicks." |
| Patch sold out | "Item unavailable" | "This shape's between batches. Try the {alt_shape} — same energy." |

### Customer auth

- Medusa's `/store/auth` endpoint + JWT cookie (no Auth.js)
- Sign-in: `/account/login` → email/password OR magic link (Resend)
- Sign-up: first checkout's "Save your details" checkbox creates customer
- Logged-out → logged-in cart merge via Medusa's `cart.transferCustomerCart()`

### Performance budget

| Page | Target LCP | Strategy |
|---|---|---|
| `/` (marketing) | < 1.5s | Already shipped — Server Components, optimized images |
| `/shop` | < 1.8s | Server Components fetch + render; Cloudinary `f_auto,q_auto`; no client SDK on first paint |
| `/shop/[handle]` | < 1.8s | Above-fold image with `priority`; variant picker hydrates after |
| `/cart` | < 1.5s | Server fetch on render; mutations via Server Action with optimistic UI |
| `/checkout` | < 2.0s | Razorpay modal lazy-loaded on payment-step click only |

### Section 5 hard calls

1. Two repos, not monorepo
2. No Auth.js for customers
3. Voice rewrites finish in parallel with commerce build
4. /drop campaign stays fully untouched
5. Waitlist → customer = opt-in via one-time email post-launch
6. Cart line-count badge is the only client-side state worth caching

---

## 6. Sequencing + timeline + risks

### Calendar anchor

| Date | Milestone |
|---|---|
| Wed 2026-05-20 | Design approved, spec locked, prep starts |
| Thu 2026-05-21 | KYCs submitted (Razorpay + Shiprocket), DNS configured, backend scaffolded |
| Wed 2026-05-27 | End of Week 1 — backend + catalog visible, no checkout yet |
| Wed 2026-06-03 | End of Week 2 — full transactable end-to-end on staging |
| Tue 2026-06-09 | End of Week 3 — public launch (gated on physical inventory arrival) |

### Pre-build prep (Day 0 — Ash's offline hands)

| # | Task | Who | ETA | Blocks |
|---|---|---|---|---|
| P1 | Razorpay business account + KYC submit | Ash + co-founder w/ PAN | 3-7 days | Payment integration Day 8 |
| P2 | Shiprocket account + KYC + Bangalore pickup pin | Ash + co-founder | 1-3 days | COD + fulfillment Day 10 |
| P3 | **Buy `doodle.in` via Vercel Domains** (at-cost, auto-DNS, ₹500-1500/yr) — if unavailable, pick fallback (`getdoodle.in` / `wearedoodle.in` / `doodlebycanvas.in`) | Ash | 15 min + 1h propagation | `api.doodle.in`, Resend domain, all transactional emails |
| P4 | DNS records for Resend (SPF/DKIM/DMARC on `doodle.in`) | Ash | 30 min + 1h propagation | All transactional emails |
| P5 | `api.doodle.in` CNAME → Railway | Ash | 15 min | All storefront → backend calls |
| P6 | Cloudinary account + folder structure | Ash | 15 min | Product image upload Day 6 |
| P7 | Upstash Redis account (free, Singapore) | Ash | 5 min | Medusa boot |
| P8 | Railway account + payment method | Ash | 10 min | Medusa deploy Day 3 |
| P9 | Lock patch + kit pricing with co-founders | Ash + 4 co-founders | 1-2 days | Product seeding Day 5 |
| P10 | 200 tees + ~500 patches actually manufactured + landing | Co-founder logistics | External | Public launch Day 20 (Jun 9) |

### Week-by-week build plan

**Week 1 (May 21–27) — Foundation + catalog**

| Day | Storefront | Backend | Voice rewrites |
|---|---|---|---|
| Thu 5/21 | `src/lib/medusa/`, `src/app/shop/` scaffold | `doodle-backend/` repo init from Medusa starter | HowItWorks rewrite |
| Fri 5/22 | Product card component | Deploy to Railway, Neon + Upstash connected | WhyDoodle rewrite + strip fabrications |
| Sat 5/23 | `/shop` catalog page (server component) | Seed first products (6 tee variants) | EarlyVoices rewrite |
| Sun 5/24 | `/shop/[handle]` PDP | Seed patches (15 variants) + 3 starter kits | DualCTA rewrite |
| Mon 5/25 | `/cart` + Add-to-cart server action | Resend integration (Welcome + OrderPlaced templates) | Footer rewrite |
| Tue 5/26 | Cart drawer + nav cart badge | Plugin wiring: Razorpay test, Shiprocket test, Cloudinary | `npm run build` verification (Task #7) |
| Wed 5/27 | **Milestone:** catalog browseable, cart works | **Milestone:** backend live, admin functional | **Voice rewrites complete** |

**Week 2 (May 28–Jun 3) — Checkout + Razorpay + COD**

| Day | Work |
|---|---|
| Thu 5/28 | `/checkout` single-page form |
| Fri 5/29 | Razorpay plugin audited + wired; test-mode session working |
| Sat 5/30 | Razorpay Checkout.js modal; verification endpoint; webhook handler |
| Sun 5/31 | COD custom provider (~50 lines); Shiprocket plugin audited + wired |
| Mon 6/1 | Shiprocket serviceability check on /checkout; shipping rates |
| Tue 6/2 | `/order/[id]/confirmed`; 8 Resend templates wired |
| Wed 6/3 | **Milestone:** full e2e test on staging — browse → cart → checkout → Razorpay test payment → admin order → Shiprocket order → email confirmation |

**Week 3 (Jun 4–9) — Polish + soft launch + production**

| Day | Work |
|---|---|
| Thu 6/4 | `/account` (orders + addresses) + sign-in/sign-up |
| Fri 6/5 | Mobile QA at 375/768/1024/1440; Lighthouse on critical pages |
| Sat 6/6 | Two custom admin widgets; error state copy polish |
| Sun 6/7 | **Soft launch** — friends + family. Internal team places test orders against LIVE Razorpay (₹1 transactions) |
| Mon 6/8 | Fixes from soft launch; performance audit; security pass (env vars, secrets, webhook signature) |
| Tue 6/9 | **Public launch:** flip Nav CTA, announce on waitlist, update /drop LP |

### Critical path

```
P1 (Razorpay KYC, 3-7 days)  ──┐
                                ├─► Week 2 (Razorpay wiring) ──► Week 2 end (e2e test)
P2 (Shiprocket KYC, 1-3 days) ─┘                                       │
                                                                        ▼
P9 (Pricing locked) ──► Week 1 (product seed) ──► Week 2 ──► Week 3 ──► LAUNCH
                                                                        ▲
P10 (Inventory in hand) ────────────────────────────────────────────────┘
```

**P1 (Razorpay KYC) is the critical path on the code side. P10 (physical inventory) is the critical path on the launch side.**

### Risks ranked by impact

| # | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R1 | Razorpay community plugin has undocumented bugs | Payment edge cases fail silently | Medium | Fork + integration tests against Razorpay test mode in Week 2 |
| R2 | Shiprocket pincode serviceability flaky | COD orders to non-serviceable pincodes | Medium | Live check on /checkout BEFORE order placement |
| R3 | Inventory not in hand by Day 20 (Jun 9) | Launch delayed | High (external) | Code done & waiting; soft launch with team in the window |
| R4 | Razorpay KYC stuck > 7 days | Slips Week 2 work | Low-Medium | Submit Day 0; escalate via support if Day 5; fallback = manual UPI QR |
| R5 | Webhook events miss / arrive out of order | Orders stuck in authorized | Medium | Idempotent transitions; cron polls every 2h for stuck orders |
| R6 | Solo build + competing priorities eat 3-week window | Launch slips | Medium-High | Hard-block calendar; v1.1 features pushed further if other work lands |
| R7 | Cold-start latency on Medusa Railway hobby | First request 5-10s after idle | Low at low volume | Monitor; upgrade Railway ($5) if it bites |
| R8 | Cloudinary free-tier bandwidth (25GB) hit fast | Product images stop serving | Low | `f_auto,q_auto`; monitor in Week 3; upgrade to $89 paid if launch warrants |
| R9 | DPDP Act compliance | Legal risk on consent + data export | Low-Medium for v1 scale | Resend opt-in; data-export endpoint v1.1 |
| R10 | No automated tests | First regression silent in prod | Medium | Manual Playwright e2e before each Vercel prod promote; smoke-suite v1.1 |

### Definition of "live"

The launch is **live** when ALL of the following are true:
1. `doodle.in/shop` loads, all products visible
2. A real customer (not Ash) can browse → cart → checkout → pay (real Razorpay live mode) → see confirmation
3. Order appears in Medusa admin within 5 seconds
4. Shiprocket order created automatically, AWB assigned
5. Order confirmation email arrives within 60 seconds
6. COD path tested end-to-end with a real ₹X transaction
7. Refund path tested (manual full refund of one test order)
8. Sentry shows zero unhandled errors over 24h soft-launch window
9. Lighthouse Performance ≥ 80 on `/shop` and PDP on mobile
10. /drop campaign still functional (waitlist + Meta Pixel)

### Explicitly out of scope for v1

| Feature | Target |
|---|---|
| Patch-picker configurator on tee PDP | v1.1 (week 4-5) |
| Razorpay Magic Checkout | v1.1 (week 4-6) |
| WhatsApp delivery notifications | v1.1 (week 5-6) |
| Product reviews | v1.1 (week 5-6) |
| Abandoned-cart email recovery | v1.1 |
| Granular admin RBAC | v1.2 |
| Multi-warehouse fulfillment | v2 |
| Multi-currency / international | v3+ |
| Native mobile app | post-PMF |
| GST invoicing | When turnover requires |
| Loyalty / referral | v2+ |

---

## 7. Open questions — ALL LOCKED 2026-05-20 (except one deferred)

### ✅ Locked
1. **Inventory arrival:** ~2026-05-30 (Day 10) — code is the bottleneck, not stock
2. **Engineering help:** Solo build (Ash + Claude). Risk R6 stands; v1.1 features pushed further if other priorities land.
3. **Pricing (4 SKUs):** Starter Kit ₹999, Pattern Pack ₹250, Standalone Tee ₹999, Standalone Patch ₹80
4. **Catalog scope:** Kits + standalone tees + standalone patches all sold
5. **Domain:** Buy `doodle.in` via Vercel Domains; fallback `wearedoodle.in` if `doodle.in` taken
6. **Free shipping:** above ₹999
7. **Email setup:** From `hello@<domain>.in` (domain-verified for deliverability), Reply-To `doodlebycanvas@gmail.com` (Ash's existing inbox)

### ⏳ Deferred (non-blocking)
- **Bangalore pickup address** for Shiprocket — `[PENDING-ASH]`. Blocks Shiprocket KYC + production fulfillment only; can be entered Day 1-2 of build.

---

## 8. References (for the future-me / co-founder reading this cold)

**Medusa core**
- [Medusa Integrations](https://docs.medusajs.com/resources/integrations)
- [Self-Host Medusa with Neon](https://neon.com/docs/guides/medusajs)
- [Medusa Bundled Products Recipe](https://docs.medusajs.com/resources/recipes/bundled-products)
- [Medusa Payment Module](https://docs.medusajs.com/resources/commerce-modules/payment)
- [Medusa Resend integration guide](https://docs.medusajs.com/resources/integrations/guides/resend)
- [Medusa v2 Railway boilerplate](https://github.com/rpuls/medusajs-2.0-for-railway-boilerplate)

**Razorpay**
- [Razorpay Magic Checkout docs](https://razorpay.com/docs/payments/magic-checkout/)
- [Razorpay Webhooks docs](https://razorpay.com/docs/webhooks/)
- [Razorpay Capture and Refund Settings](https://razorpay.com/docs/payments/optimizer/capture-refund-settings/)
- [Razorpay 2026 Conversion Guide](https://razorpay.com/blog/express-checkout-conversion-guide)

**Plugins to fork**
- [@devx-commerce/razorpay (npm)](https://www.npmjs.com/package/@devx-commerce/razorpay)
- [medusa-plugin-razorpay-v2 (npm)](https://libraries.io/npm/medusa-plugin-razorpay-v2)
- [Hemann55/medusa-fulfillment-shiprocket](https://github.com/Hemann55/medusa-fulfillment-shiprocket)
- [@lambdacurry/medusa-product-reviews (v1.1)](https://github.com/lambda-curry/medusa-plugin-product-reviews)
- [monkeymars/medusa-plugin-whatsapp-cloud-api (v1.1)](https://github.com/monkeymars/medusa-plugin-whatsapp-cloud-api)

**Alternatives considered + rejected**
- Saleor (Python/Django — context switch, smaller India community)
- Vendure (TS-native but Razorpay support thin)
- Shopify Hydrogen + Shopify backend (defeats build-it-ourselves intent + monthly fee)
- Pure custom Next.js + Razorpay direct (ruled out by 2-3 week window)

---

## 9. Sign-off checklist

- [ ] Ash reviews this spec end-to-end
- [ ] Open questions §7 answered or explicitly deferred with `[ACCEPT-RISK]` marker
- [ ] Hand off to `writing-plans` skill for week-by-week, day-by-day implementation plan
