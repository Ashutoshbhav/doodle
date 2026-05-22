# DOODLE — Session State

_Last updated: 2026-05-22 (commerce build sprint)_

When Ash says **"DOODLE"** in a future session, read this file first, then `docs/BRIEF.md`, then resume.

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
