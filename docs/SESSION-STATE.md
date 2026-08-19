# DOODLE — Session State

_Last updated: 2026-08-19/20 (headless Shopify cutover — see top entry)_

When Ash says **"DOODLE"** in a future session, read this file first, then `docs/BRIEF.md`, then resume.
**"DOODLE" now means this Shopify-backed site by default.** The old self-hosted
Medusa/Railway backend has its own codename, **"MEDUSA"** — say that instead if
you specifically want the legacy system (e.g. to decommission it later). See
the memory `doodle-doc-map` for the full split.

---

## 🚀 HEADLESS SHOPIFY CUTOVER — SHIPPED 2026-08-19/20 (commits `89a7449`..`08efe15`, all on `main`, all live)

**Why this happened:** DOODLE's Medusa backend (self-hosted, Railway) had zero
running instances — Railway's free trial expired, and separately, before that
was even discovered, the backend had *already* been silently down for 49 days
(deployment stuck at a June 30 commit, real root cause documented in the
commit history/PR — a Railway account issue, not a code bug). Rather than pay
to revive a system already being replaced, cut straight over to Shopify.

**Architecture: headless, not full Shopify.** This frontend (Next.js, Vercel,
all the bespoke design work — candy-pastel system, rough.js hand-drawn patch
doodles, the one-screen mobile builder) is UNCHANGED and stays exactly where
it is. Shopify only replaces the backend: catalog, cart, checkout, inventory.
Customers never see `*.myshopify.com` — checkout redirects to Shopify's own
hosted checkout page, which is the entire "checkout" implementation needed
(no custom payment-session code the way Medusa required).

**What's live right now:**
- Shopify store: `3bwadq-q0.myshopify.com`, named "DOODLE" in admin, Basic
  plan at the ₹20/mo promo rate (reverts to ₹1,994/mo ~November 21, 2026).
- Custom app "DOODLE Storefront" (Dev Dashboard, non-embedded) holds the
  Admin API + Storefront API access. Tokens live in `.env.local` (gitignored)
  and on Vercel Production env vars — never committed.
- `NEXT_PUBLIC_COMMERCE_BACKEND=shopify` is set on Vercel Production. This is
  the master switch — `env.ts` still supports `"medusa"` as a value (defaults
  to it if unset) so the old code path isn't deleted, just unused.
- Real catalogue, 9 products, all with real Cloudinary-sourced photos:
  DOODLE Modular Tee (6 colours × 4 sizes, ₹999, real per-variant stock from
  the stock sheet), 5 real patch packs (₹799 each), single patch (₹100,
  stock 880), Starter Kit (4 sizes, ₹999/MRP ₹1499, **stock 0 — real count
  never established, don't invent one**), Pattern Pack "Mix Your Six" (₹600,
  **stock 0**, same caveat).
- Payment: **Cash on Delivery only**, configured as a Shopify manual payment
  method with DOODLE-voiced copy. Real online payment (Razorpay) needs Ash's
  2FA + business KYC on the Shopify/Razorpay side — not started.
- Shipping: Shopify's generic default rates (checkout completes). Real
  Shiprocket courier automation needs Ash to connect his Shiprocket account
  via the Shopify App Store app — not started. The OLD Medusa backend had a
  working custom Shiprocket integration; that's gone with the cutover.
- Verified end-to-end **on the real live site**, not just locally: browse →
  PDP → variant picker → add to cart → cart page → cross-sell → checkout
  redirect to the real Shopify hosted checkout. Zero console errors.

**Code map (new):**
- `src/lib/shopify/client.ts` — `shopifyRequest()`, a *lazily*-constructed
  Storefront API client. This MUST stay lazy — an earlier version called
  `createStorefrontApiClient()` eagerly at module scope, which crashed the
  **entire** Vercel production build (not just Shopify-mode code) the moment
  any file imported it, because Vercel had no Shopify env vars set yet at
  that point. Real incident, three failed prod deploys before the fix
  (commit `78326d1`). If touching this file again: never construct the
  client outside a function call.
- `src/lib/shopify/{cart,products,normalize,types}.ts` — cart CRUD, product
  fetch, and normalizers that convert Shopify's GraphQL shapes into the same
  shape Medusa's SDK types already used (`as unknown as Product/Cart`, same
  loose-typing pattern already established in this codebase). This is *why*
  VariantPicker, ProductCard, ProductGallery, CartLine needed zero changes —
  swap the data layer, reuse 100% of the polished UI.
- `scripts/shopify/import-catalog.mjs` — the catalogue source of truth,
  idempotent (`productSet` keyed by handle, looks up existing id first). Run
  again any time real stock numbers for Starter Kit/Pattern Pack land, or to
  add new products.
- Every Medusa-backend file that's shared across both modes now branches on
  `env.NEXT_PUBLIC_COMMERCE_BACKEND` at the lowest layer it can (e.g.
  `medusa/cart.ts`'s `getCart()`/`getCartLineCount()`, `medusa/suggestions.ts`'s
  `fetchSuggestions()`) so callers never needed to change.
- `/checkout` (the old Medusa multi-step form) redirects straight to
  Shopify's hosted checkout in Shopify mode — it doesn't understand Shopify
  carts and would silently misbehave if reached directly.
- `isCommerceEnabled` (`src/lib/commerce.ts`, gates hero CTA / nav icons /
  PacksShowcase / BuildYourTee) recognizes either backend now — this was a
  landmine found by audit, not by a bug report: if Medusa's env vars are ever
  removed from Vercel (the natural next step of fully retiring MEDUSA), the
  whole site would have silently reverted to waitlist mode despite Shopify
  commerce being genuinely live.

**Known gaps, not urgent (site sells right now without them):**
- `/account` login is still Medusa-only auth. Fails safely (redirects to
  login, doesn't crash) but isn't functional for Shopify-mode customers —
  real Shopify Customer Account API integration is a separate, bigger piece.
- Legal pages still carry placeholder entity/grievance-officer details —
  needs real facts from Ash + a lawyer, not something to fabricate.
- A visual discrepancy Ash flagged in the rough.js hand-drawn doodles
  (comparing this session's dev server against "our own site") — never
  diagnosed, both screenshot tooling (Playwright file paths unlocatable) and
  the Chrome extension (kept failing to connect all session) blocked visual
  comparison. Deferred; needs a screenshot or specific description to resume.
- Shopify's Admin API doesn't have Shiprocket/Razorpay set up — see Payment/
  Shipping above.

**How to resume this thread specifically:** say "DOODLE" — this file plus
the `doodle-*` memories cover it. `.env.local` already has the working
Shopify tokens (never committed, don't need to regenerate). Dev server:
`NEXT_PUBLIC_COMMERCE_BACKEND=shopify npm run dev` to test locally against
the same real Shopify store production uses.

---

## 📌 CURRENT (2026-07-05) — pre-Shopify-cutover state, superseded above. Details live in Claude's memory (`doodle-current-state`)

- Production = waitlist at doodlebycanvas.in (no commerce env vars — deliberate). Preview = commerce test surface. Posture: **"reconcile now, hold the flip"** — flip only on Ash's explicit go.
- Backend live on Railway (`doodle-backend-production-32b1.up.railway.app`): live Razorpay, real images, stock matches the stock sheet. Repo HEAD `ccc88b8`.
- **2026-07-05: frontend catalogue reconciled** (commits `383504a` + `0b94222`): PACKS = real products @ ₹799 (space-squad, sunny-pals, epic-quest, moodicorns, tiny-travellers; keys = Medusa handles), Mix Your Six ₹600 kept, tee colour names = Medusa variant names. Verified against the live store API, India region.
- Next: Ash verifies deployed homepage → Shiprocket wallet (~₹500) + creds on Railway → Ash e2e test on preview → production flip (3 env vars).
- Open flags: embroidered patches priced ₹150 each on PatchWall but no single-embroidered product in backend; epic-quest is a 5-patch composite (needs original 6th); Pattern Pack ₹600/5 vs 6 singles ₹600 value-ladder oddity.

Everything below this line is historical context (accurate as of its own date).

---

## 🚀 LIVE 2026-06-14 — doodlebycanvas.in is serving (Server: Vercel, HTTPS)

**The marketing site is LIVE at https://doodlebycanvas.in** (apex + www, SSL issued).
Domain bought on GoDaddy; after the GoDaddy "Websites+Marketing" builder kept
injecting a hidden AAAA (IPv6→builder) record that hijacked the domain, the fix
was **switching GoDaddy nameservers to Vercel** (`ns1/ns2.vercel-dns.com`). That
removed GoDaddy from DNS entirely. Vercel project = `doodle` (prj_sM8kISoMxqvGxY7d7tYrWJZqtTxu).

**What's LIVE (free: Vercel + Neon):** homepage, waitlist, `/drop`, 5 legal pages
(privacy/terms/refunds/shipping/contact), cookie consent + withdrawal, SEO
(sitemap+JSON-LD+canonical), security headers, Sentry PII-hardened, rate-limit+honeypot.
Storefront commits this session: `f9fbd83` (launch-readiness) + `34514ac` (SEO/consent/checkout).

**Shop/checkout/account render but are INERT** — no backend deployed, no products.

### 💸 COMMERCE DEFERRED (Ash's call, zero-budget) — resume = deploy backend (~$5/mo)
Always-on commerce backend isn't free in 2026 (Railway ~$5/mo; Render-free sleeps
→ drops payment webhooks). Ash chose **defer commerce, keep free site live**.
When ready to sell (accepts ~$5/mo), the unlock is **deploy `doodle-backend` (Medusa v2)**:
1. Host: Railway (built for it) — needs Railway acct + push doodle-backend to GitHub (NOT on GitHub yet; committed locally, HEAD has emails+subscribers+razorpay).
2. Env: Neon DB URL (Ash HAS Neon), JWT/COOKIE secrets, CORS=doodlebycanvas.in, (Redis optional — worker_mode shared works without).
3. Razorpay: already wired (`medusa-plugin-razorpay-v2`, env-gated) — add TEST keys + webhook `{backend}/razorpay/hooks`. See docs/RAZORPAY-WIREUP.md.
4. Shiprocket: DECIDED = `medusa-shiprocket-fulfillment-plugin` (v2). NOT installed yet. ⚠️ Shiprocket has NO sandbox — first test = real shipment + wallet money.
5. Point `api.doodlebycanvas.in` → Railway; migrate DB + create admin + seed products.

### Commerce-flow tasks DEFERRED (backend-dependent, untestable until deployed)
- IDOR fix on `/order/[id]/confirmed` (CONFIRMED real: store GET /orders/:id is unauth in Medusa; latent until backend live) — needs per-order token.
- Email idempotency dedupe (subscribers fire duplicate emails on webhook retries).
- Country-of-origin + GST/shipping breakdown on PDP/cart/checkout (E-Comm Rules); checkout has NO shipping-method step (shipping shows "Calculated", ₹0).
- Overselling guard + cart qty clamp (Medusa inventory config + UI).
- Full deep-audit findings: docs/ (4-dimension audit done 2026-06-14).

### ⚠️ Legal pages: 6 placeholders in `src/content/legal.ts` need Ash + lawyer
entity name, business address, Grievance Officer name+phone, effective date. Draft banner live until reviewed.

---

## 🎨 DESIGN CONFORMANCE PASS — DONE 2026-06-01 (HEAD ca5c25a)

Whole-site `/sauce` pass brought all 21 surfaces into line with the locked
`DESIGN.md` (which only previously lived in the doc + Promise.tsx). Method:
design-supervisor audit → 3 shared primitives → wave-by-wave application →
tsc + `next build` verified (all 8 routes generate clean).

**What shipped (commits 9cf21e0 → ca5c25a):**
- **Wave 1** — shared primitives `src/components/ui/{Eyebrow,Band,StitchCard}.tsx`
  + global `text-wrap: balance/pretty`. StitchCard hard-caps card radius at 16px.
- **Wave 2** — Hero (H1 8rem→6rem ceiling, frame radii 32-38px→16px, eyebrows→primitive)
  + TheRealThing (drifted wash hexes→locked, card radii→16px).
- **Waves 3+5** — 11 marketing sections + 9 commerce files: deleted drifted hex
  maps (HowItWorks `TILE`, CharacterStrip `FILL_HEX`) → `bg-doodle-*` vars;
  ALL card radii ≤16px; section eyebrows → `<Eyebrow>` varied cadence;
  added `active:scale-0.97` press feedback on pills/accordion. Razorpay #E8650A kept.

**Eyebrow-overuse + accent-soup anti-patterns now marked RESOLVED in DESIGN.md.**

**Design work still OPEN (deferred, not blocked-on-me):**
- Wave 4 imagery — CharacterStrip / EarlyVoices / Founders still use placeholder
  smiley-face SVGs + marquee on placeholders. BLOCKED on Ash's real kid photos /
  illustrations. Mechanical radii/hex/eyebrow already fixed; only imagery remains.
- Pre-existing lint debt (NOT from this pass): `global-error.tsx` `<a>`→`<Link>`;
  `Rough.tsx` setState-in-effect; `ConversionScripts.tsx` `<img>`→`<Image>`.

---

## ⚡ COMMERCE BUILD — IN PROGRESS (started 2026-05-20)

**Goal:** Turn the marketing site into full Shopify-equivalent commerce. Adopting **Medusa.js v2** as the headless engine (separate `Documents/doodle-backend/` repo, deploys to Railway) behind the existing Next.js storefront.

**Read these first to resume:**
- `docs/superpowers/specs/2026-05-20-doodle-commerce-design.md` — full architecture + all locked decisions
- `docs/superpowers/plans/2026-05-20-doodle-commerce-v1.md` — day-by-day implementation plan
- `docs/OPERATIONS.md` — Ash's self-serve playbook (post-launch)

**Locked decisions:** Medusa v2 + Neon + Upstash Redis + Railway + Razorpay (Standard Checkout v1) + COD + Shiprocket + Resend + Cloudinary. Two repos (`doodle/` storefront on Vercel, `doodle-backend/` Medusa on Railway). Domain: buy `doodle.in` via Vercel Domains (fallback `wearedoodle.in`). Pricing: Starter Kit ₹999, Pattern Pack ₹250, standalone Tee ₹999, Patch ₹80. Free shipping >₹999. Email: From `hello@<domain>`, Reply-To `doodlebycanvas@gmail.com`. No GST yet. Solo build.

**Built so far (storefront, all TS+ESLint clean, degrades gracefully without backend):**
- `src/lib/medusa/{client,types,cart}.ts` — SDK + server-only cart helpers
- `src/app/actions/checkout.ts` — addToCart/updateLine/removeLine/setContact/setShipping/placeCodOrder/initiateRazorpayPayment/completeRazorpayOrder
- `/shop`, `/shop/[handle]`, `/cart`, `/checkout`, `/order/[id]/confirmed`
- `components/shop/{ProductCard,VariantPicker,CartLine,CartButton,CheckoutForm}.tsx`
- Nav updated (Shop link + cart badge, hides on /drop) + NavWithCart server wrapper
- **`/drop` paid campaign + waitlist UNTOUCHED**

**Built so far (doodle-backend, Medusa 2.13.6, NOT YET DEPLOYED):**
- Forked from rpuls/medusajs-2.0-for-railway-boilerplate
- Custom COD payment provider: `src/modules/payment-cod/` (fully implemented)
- DOODLE email templates: order-placed, order-placed-cod, order-shipped (DOODLE voice, INR, brand colours)
- `.env.template` documents every needed key

**BLOCKED ON: Ash's keys** (see the 10-step checklist — domain, Razorpay TEST keys, Shiprocket, Upstash, Neon URL, Cloudinary, Railway, GitHub repo, JWT/COOKIE secrets, Resend domain DNS).

**When keys land, wire-up sequence (~3-4h):** paste keys → deploy backend to Railway → migrate Neon + create admin → seed 4 products → fork @devx-commerce/razorpay into `packages/` + audit + register → e2e test (COD + Razorpay TEST) → mobile + Lighthouse.

**Still NOT built (need backend live + keys):** Razorpay plugin fork+wire, Shiprocket plugin fork+serviceability check, `/account` auth routes, remaining 5 email templates (PaymentReceived/OrderDelivered/Welcome/ReturnAcknowledged/RefundProcessed), e2e test, MDX migration for self-serve marketing copy (Option B chosen).

**Voice rewrites:** Promise.tsx done. HowItWorks/WhyDoodle/EarlyVoices/DualCTA/Footer still pending (interleave during commerce build per plan).

---

## Identity (locked from the brand docs Ash provided)

- **Brand**: DOODLE (parent: CANVAS — house-of-brands, future)
- **Founders (5)**: Ronit Dadra, Lakshay Vashist, Ashutosh Ananda Bhavale (Ash), Rohit Prasad, Aditya Geda
- **Origin**: Bangalore. Scaler School of Business MBA project (2024–2026). Raising ₹5L seed.
- **Real taglines**:
  - *"Don't Just Dress. Create."* (positioning statement — primary H1)
  - *"Wear Your Imagination."* (deck cover)
  - *"One tee. One bag. Infinite personalities."* (brand story)
- **Brand promise**: "the first clothing that actually listens to your child"
- **Real brand-doc subhead**: *"Kids don't outgrow clothes. They outgrow characters."*
- **Stated visual direction**: "The Souled Store meets a D2C kidswear brand — Indian, confident, character-driven, but elevated." Inspirations: Cluely, Pinterest, Higgsfield.

## Product reality

- **Market entry = T-shirts** (backpacks are testing, deck-vision but not first-run)
- First-run sizes: S (3–4 yrs) / M (4–5 yrs) / L (5–6 yrs)
- Production tee colours: **Bubblegum Pink #F4A7B9** (Pantone 183C) + **Powder Blue #A8D8EA** (Pantone 290C)
- Per-tee: ₹370 inclusive of velcro + tags. MOQ 120 units.
- Patches: 1.5–2", first SKU geometric (Star/Square/Circle/Triangle/Pentagon)
- 100% combed cotton, 200–220 GSM

## Brand-spec palette (exact hexes from deck slide 4)

| Token | Hex |
|---|---|
| Red | `#C8312A` |
| Orange | `#E8650A` |
| Blue | `#1A56C4` |
| Purple | `#8B80E0` |
| Yellow | `#D4A800` (mustard, not bright) |
| Pink | `#D4607A` |
| Cream | `#F5F0E8` |
| Ink | `#1A1A1A` |
| Tee Pink | `#F4A7B9` |
| Tee Blue | `#A8D8EA` |

All wired into `src/app/globals.css`.

## v1 stage

Pre-launch waitlist site. Going offline first (pop-ups / stockists), then online sales. v1 has NO cart, NO checkout, NO payment gateway. Email capture is the primary CTA.

## Phase right now

**Hero v3 split-color editorial layout shipped.** Aligned to Souled-Store-style brand direction (red full-bleed campaign zone left, cream product stage right, drop banner top, patch lanes strip bottom). Voice rewrites + IP-clean superhero patch library still pending across other sections.

## Done this session

- ✅ Next.js 16.2.4 + React 19.2 + Tailwind v4 + TypeScript scaffold
- ✅ shadcn initialized
- ✅ Brand-spec palette hexes wired (mustard yellow, deeper red, etc.) + tee production colours
- ✅ Fonts: Bricolage Grotesque (display) + Geist (body) + Caveat (handwritten accent)
- ✅ Logo at `public/brand/wordmark-logo.jpeg`
- ✅ All 13 sections shipped (Nav · Hero v3 · TheRealThing · Promise · HowItWorks · PatchWall · CharacterStrip · WhyDoodle · EarlyVoices · Founders · FindUsOffline · DualCTA · Footer)
- ✅ Patch scrubber working, cycles 6 presets, real product photo as base
- ✅ Waitlist Server Action (logs only; Resend wiring TODO)
- ✅ Hydration fix: `suppressHydrationWarning` on form input (browser-extension safety)
- ✅ Hero rebuilt twice this session: first to editorial, then to dramatic split-color red campaign zone
- ✅ TypeScript build passes (`tsc --noEmit` exit 0)

## IP boundary held

Patches folder has **62 images, including licensed Marvel/Disney/Nintendo/anime characters** (Deadpool spotted, others likely). Declined to "rename and stylize" them as a workaround — visual likeness is the legal trigger, not the name. Marvel/Disney lawyers and DMCA bots match on character design. Path agreed: I draw 8–12 **original DOODLE-superhero patches** from scratch (masked sun, lightning kid, cape-star, shield buddy, etc.) — same kid-emotional lane, zero IP risk. Voice CAN reference cultural fandoms ("Pokémon phase ends, Iron Man phase begins") without depicting characters.

## Open items, priority order

1. **Patch scrubber tee** — still uses Ash's prototype photo as base; needs refined SVG model per "make a proper model" directive
2. **Real founder names** in `Founders.tsx` (currently `[Founder One/Two/Three]`)
3. **Voice rewrites** in Promise / HowItWorks / EarlyVoices / WhyDoodle / DualCTA / Footer using brand-doc tone
4. **Original DOODLE-superhero patch library** (8–12 IP-clean characters drawn from scratch)
5. **TheRealThing rework** — small inset rather than full section
6. `npm run build` production verification
7. Resend API key + RESEND_AUDIENCE_ID in `.env.local`
8. Cloudflare Turnstile spam protection on waitlist
9. React Email confirmation template
10. Mobile QA at 375 / 768 / 1024 / 1440

## Hard rules in this project

- Read Next.js 16 docs from `node_modules/next/dist/docs/` before unfamiliar patterns (training data is stale)
- Use `proxy.ts` not `middleware.ts` (Next 16 deprecation)
- Tailwind v4 = CSS-based config (`@theme` in globals.css), NOT `tailwind.config.ts`
- No dark mode in v1 (warm-cream brand)
- No fabricated stats / testimonials / press logos — all clearly marked `[PLACEHOLDER]`
- Free tools only (Resend free tier, Vercel free tier, Google Fonts)
- **No licensed character reproduction** on the public site (originals + DOODLE-original characters only)
- Brand voice: warm, parent-knowing, specific over generic ("Pokémon phase: March. Iron Man phase: June. Same tee.")

## File map

```
src/
  app/
    layout.tsx                — root layout, fonts, metadata
    page.tsx                  — composition root (Nav + 12 sections + Footer)
    globals.css               — DOODLE brand tokens (brand-spec hexes)
    actions/waitlist.ts       — Server Action for waitlist signup
  components/
    sections/
      Nav.tsx · Hero.tsx · TheRealThing.tsx · Promise.tsx · HowItWorks.tsx
      PatchWall.tsx · CharacterStrip.tsx · WhyDoodle.tsx · EarlyVoices.tsx
      Founders.tsx · FindUsOffline.tsx · DualCTA.tsx · Footer.tsx
    ui/
      PillButton.tsx · MarkerHeading.tsx · WaitlistForm.tsx
      PatchScrubber.tsx · CursorCompanion.tsx (unused after chaos rollback)
public/
  brand/wordmark-logo.jpeg    — DOODLE logo
  product/tee-white.jpeg      — Cream/white tee with patches (real product photo)
  product/tee-blue.jpeg       — Blue tee with same patches
  patches/                    — empty (Ash's 62 source patches in ~/Downloads/doodle/patches/)
docs/
  SESSION-STATE.md            — this file
  BRIEF.md                    — frontend-design dispatch spec (now mostly historical)
```

## Brand assets at Ash's source

`C:\Users\Ashutosh Bhavale\Downloads\doodle\` contains:
- 5 pitch decks (PPTX + PDF)
- `Doodle - Brand Guidleines.xlsx` — full brand strategy (target audience, voice, positioning, content pillars, competitors, inspirations)
- `Doodle-Content-Strategy.html` — 12-week IG playbook
- `Children_Tshirt_Spec_Sheet.docx` — production specs
- `wordmark-logo.jpeg`, 2 tee photos, 15+ backpack photos, 5 character face photos (lion/cat/owl)
- `patches/` subfolder: 62 silicone-charm photos (mix of originals + licensed IP)
