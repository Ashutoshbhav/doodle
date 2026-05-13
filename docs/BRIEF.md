# DOODLE — Build Brief for `frontend-design`

This is a self-contained brief. You should not need any conversation context to execute it.

---

## 1. Brand identity

- **Name**: DOODLE (parent: CANVAS, future house-of-brands)
- **Render**: "DOODLE" everywhere; "DOODLE by CANVAS" in footer + about + B2B inquiry contexts
- **Product**: Modular kids' clothing + backpacks + accessories with **interchangeable patches**. Kids design their own outfits by swapping patches.
- **Logo**: `/public/brand/wordmark-logo.jpeg` — tactile 3D wordmark, 6 colored letters with white dashed stitching on the two "o"s, orange squiggle accent below "e".
- **The signature element**: The dashed white stitching on the logo's "o" letters is the patches motif. It must reappear throughout the site — on button borders, card edges, section dividers, the patch scrubber track. This is the brand's most recognizable visual fingerprint.

## 2. Stage & audience

- **Stage**: Pre-launch waitlist site. NO cart, NO checkout, NO payment gateway, NO real product purchases. The brand is going offline-first (pop-ups, stockists), then online sales later.
- **Primary CTA**: Email capture for the waitlist.
- **Secondary CTA**: B2B / wholesale / become-a-stockist inquiry.
- **Audience (triple-duty — site must work for all three)**:
  1. Investors / partners / wholesale buyers — site needs to look like a serious brand
  2. Parents (consumers) — hype-building, waitlist conversion
  3. Portfolio quality — distinctive enough to stand on its own

## 3. Visual direction & voice

- **Pure illustration**, zero photography. No kid photos. No stock images.
- **Doodle / sketch language** native to the brand name — hand-drawn squiggles, marker scribbles, sticker-like patches.
- **Warm, playful, intentional**. Not childish — premium-but-playful. The trick is that the design has personality without being saccharine.
- **Tactile feel** — radii are large (1rem default), shapes are rounded, decoration is hand-drawn-feeling (use RoughJS).
- **3-color marker headlines** — most words in `ink`, one emphasis word in `orange` italic, one emphasis word with a `yellow` marker stroke behind it (use `rough-notation` for the authentic brushstroke animation).
- **Spring physics on every interaction** — bouncy easing (motion's `spring` with stiffness ~200, damping ~20). Never linear.

## 4. Brand tokens (already in `src/app/globals.css`)

Use these — do not invent new colors:

| Token (Tailwind class) | Hex | Role |
|---|---|---|
| `bg-doodle-canvas` | #f4f1ec | Page background (default `bg-background`) |
| `text-doodle-ink` | #2a2a2e | All text (default `text-foreground`) |
| `bg-doodle-orange` | #e87a3d | **Primary CTA** (default `bg-primary`) |
| `bg-doodle-yellow` | #f2c84a | **Marker accent** under emphasis words |
| `bg-doodle-blue` | #2a56b3 | Tile fills, accent surfaces |
| `bg-doodle-red` | #d24a3d | Tile fills, destructive |
| `bg-doodle-purple` | #8b7ac6 | Tile fills, character clothing |
| `bg-doodle-pink` | #d4738a | Tile fills, character clothing |
| `border-doodle-stitch` | #ffffff | Dashed stitch borders on colored surfaces |
| Radius | `rounded-lg` = 1rem, `rounded-2xl` = 1.8rem, `rounded-3xl` = 2.2rem | DOODLE leans large + organic |

Utility classes already defined:
- `.stitch` — 2px dashed white border (the patches motif)
- `.stitch-thick` — 3px dashed white border
- `.stitch-ink` — 2px dashed ink border (for use on cream surfaces)
- `.marker-yellow` / `.marker-orange` — CSS-fallback brushstroke behind text
- `.word-emphasis` — italic + display font + orange (for the second-color word in headlines)

Fonts:
- **Display** (h1–h4, decorative): Bricolage Grotesque variable — `font-family: var(--font-display)` or set on `h1/h2/h3/h4` automatically by base layer
- **Body**: Geist sans — automatic via `body { font-family: var(--font-sans) }`
- **Mono**: Geist Mono (rare use)

## 5. Available libraries (when to use which)

| Lib | Use for |
|---|---|
| `motion` (npm: `motion`) | All animations. Spring + drag + scroll + layout. Default easing curve. |
| `roughjs` | Hand-drawn rendered shapes. Use for: section divider squiggles, decorative arcs, the patch outline strokes, the scrubber track. |
| `rough-notation` | Marker/highlight/underline/circle annotations on text. Use for: the yellow marker stroke under headline emphasis words (best-in-world for this exact effect). Animate-on-scroll. |
| `perfect-freehand` | Natural pen strokes when you need a drawn path that isn't quite a shape (e.g. the underline squiggle below "e" in the logo motif). |
| `@phosphor-icons/react` | All icons. Use the `duotone` weight for warmth. Avoid using more than one weight in the same surface. |
| `resend` + `react-email` | Waitlist confirmation email. Server Action posts to Resend. React Email for the template. |
| `shadcn` primitives | `accordion` for "Why DOODLE", `dialog` for B2B inquiry modal, `form` for waitlist. Restyle into DOODLE — do NOT ship vanilla shadcn look. |

**Anti-pattern**: do not reach for `framer-motion` (legacy name; use `motion`). Do not reach for `lucide-react` (use Phosphor — warmer).

## 6. Page architecture (12 sections, top to bottom)

Build each as a standalone component in `src/components/sections/`. Compose them in `src/app/page.tsx`.

| # | Component | Structural function |
|---|---|---|
| 1 | `Nav.tsx` | Sticky top nav. Wordmark logo (image) left. Center: "Story · How it Works · For Stockists". Right: orange `PillButton` "Join Waitlist" + tiny ghost link "B2B inquiry". On scroll: bg fades from transparent to canvas with subtle shadow. |
| 2 | `Hero.tsx` | **Most important section.** Full-viewport. 3-color marker headline (write a placeholder like "_Kids design / their own / clothes._" with "design" in orange-italic and a yellow marker stroke under "their own"). Subhead 1 line. **Patch-swap scrubber demo** (see §7 below). Below: `WaitlistForm` (single email input with stitched orange button). Decorative doodle elements (use RoughJS for arcs/squiggles around the composition). |
| 3 | `Promise.tsx` | "The Promise" — 3-up brand pillars: Modular · Sustainable · Grows With Them. Each pillar is a card on a different brand color (orange / blue / purple) with a stitched white border, a Phosphor duotone icon, headline, 2-line body. |
| 4 | `HowItWorks.tsx` | 3-step animated explainer: 1) Pick your base. 2) Choose patches. 3) Wear & swap. Each step is a card with an illustrated mini-scene (placeholder SVG slots). Animate scroll-in with stagger. |
| 5 | `PatchWall.tsx` | The abundance moment. Wall of 20–30 illustrated patches (placeholder square tiles in the brand colors with stitched borders for now — Ash will drop SVGs into `public/patches/` later). Hover: lift + slight rotation. |
| 6 | `CharacterStrip.tsx` | Horizontal full-bleed strip of 5 illustrated kid characters (placeholder SVG slots), each on a different brand-color rounded card with stitched border. Continuous slow marquee on idle, pause on hover. |
| 7 | `WhyDoodle.tsx` | Full-bleed section in `bg-doodle-orange`. Left: large illustrated scene placeholder. Right: shadcn accordion (restyled) with 4 expandable rows: "Inclusive sizing", "Modular = less waste", "Grows with the kid", "Made in India" (placeholder text — Ash will rewrite). |
| 8 | `EarlyVoices.tsx` | "What early DOODLE families are saying" — 3 cards (carousel optional). Avatar = doodled portrait placeholder, name (placeholder), role (e.g. "Mom of 2"), 5-star row, 2–3 line quote. **Mark these clearly as placeholders** — they're not real testimonials yet. |
| 9 | `Founders.tsx` | "Meet the makers" — 2 or 3 founder cards. **Illustrated avatars** (NOT photos — placeholder SVG circles in brand colors), name placeholder, 1-line role/bio. Triple-duty audience needs this for credibility. |
| 10 | `FindUsOffline.tsx` | "Find DOODLE in person" — 3 pop-up cards with location placeholder, date placeholder, photo placeholder of venue (illustrated, not real). Optional: simple SVG India map with pinned dots. |
| 11 | `DualCTA.tsx` | Two side-by-side cards. Left (`bg-doodle-blue`): "Be first to wear it" → email waitlist. Right (`bg-doodle-purple`): "Stock DOODLE in your store" → B2B inquiry dialog. Both with stitched borders. |
| 12 | `Footer.tsx` | "DOODLE by CANVAS" wordmark + tagline. 4 columns of links (Shop · About · Stockists · Contact — most are stubs). Social icons (Phosphor). Bottom bar: copyright + "Made in India". |

Plus primitives in `src/components/ui/`:
- `PillButton.tsx` — primary CTA. Fully rounded, stitched border, circle-arrow icon inside.
- `MarkerHeading.tsx` — the 3-color split headline component. Takes `before / emphasis / after / markerWord` props.
- `StitchedBox.tsx` — wrapper that applies the dashed-stitch border on a colored bg.
- `WaitlistForm.tsx` — email input + button + Server Action posting to Resend.
- `PatchScrubber.tsx` — see §7.

## 7. Hero spec — the patch-swap scrubber (the proof of modularity)

This is THE moment. Build it carefully.

**Visual**: Centered illustration of a base garment (placeholder: a simple t-shirt SVG in cream with stitched border). 3 "patch slots" on the tee (chest, sleeve, hem). Below the garment: a horizontal scrubber track with 5–7 thumb positions, each thumb being a different patch combination preset.

**Interaction**:
- User drags the scrubber thumb horizontally
- As they drag, the patches on the tee swap in real time (no transitions stutter)
- Each thumb position snaps to a preset combo
- On idle (no interaction for 4s), auto-advances through presets with a 2.5s dwell on each

**Tech**:
- `motion`'s `useDragControls` + `useMotionValue` for the scrubber
- `motion`'s `AnimatePresence` for patch swap animations (scale + fade in)
- Patches are absolute-positioned SVG `<g>` elements with brand-color fills (placeholders until Ash provides real patch SVGs)
- The scrubber TRACK uses RoughJS for a hand-drawn appearance

**State**:
- One state: `currentPresetIndex: 0..6`
- Patch combos defined as a const array of `{ chest: PatchId, sleeve: PatchId, hem: PatchId }`
- Auto-advance via `useEffect` setInterval, paused on user interaction

**Accessibility**:
- Scrubber is a real `<input type="range">` underneath, visually hidden but functional, so keyboard users can change combos with arrow keys
- Each preset has a name announced via `aria-live` on change ("Combo 3: rocket + stripes")
- Honor `prefers-reduced-motion`: skip auto-advance, snap (don't animate) on combo change

## 8. Anti-patterns (do not do these)

- ❌ Gradients (especially purple→blue or pink→orange "AI app" gradients)
- ❌ Glassmorphism, frosted-glass cards
- ❌ Dark mode (DOODLE is a warm-cream brand only in v1)
- ❌ Stock photography of any kind
- ❌ Generic "modern landing page" Inter + blue CTA + gradient hero look
- ❌ Lucide icons in monoline weight (use Phosphor duotone)
- ❌ `framer-motion` (use `motion`)
- ❌ Any animation on linear easing
- ❌ Sharp 90° corners — everything rounds, even small things
- ❌ Reproducing any specific creative work from any reference (no copying SlabPixel's "Crayon Curves" Dribbble shot literally — that was *structural* inspiration only). All copy, illustrations, and art direction must be DOODLE-original.

## 9. Tech constraints (Next.js 16 specifics — your training data is stale)

- This is **Next.js 16.2.4** + React 19.2 + Tailwind v4. Read `node_modules/next/dist/docs/01-app/01-getting-started/*.md` before writing patterns you're unsure about.
- Use **Server Components by default**, mark `'use client'` only where needed (scrubber, form, accordion).
- Form submission = **Server Actions**, not API routes. Place in `src/app/actions/waitlist.ts`.
- Use `proxy.ts` (NOT `middleware.ts`) for any request interception (Cloudflare Turnstile validation later).
- Use `next/font/google` already wired in layout.tsx — never load fonts via `<link>`.
- Tailwind v4 is **CSS-based** (`@theme` in globals.css). NO `tailwind.config.ts`.
- Cache strategy: Server Components are cached by default. The waitlist count (if shown) needs `'use cache'` with `cacheLife('minutes')` and `cacheTag('waitlist-count')` so it can be invalidated on new signup.
- Honor `prefers-reduced-motion` — already wired globally in globals.css; respect it in JS animations too.

## 10. File structure to create

```
src/
  app/
    page.tsx                       # compose all 12 sections
    actions/
      waitlist.ts                  # Server Action: posts to Resend Audiences + sends confirmation
  components/
    sections/
      Nav.tsx
      Hero.tsx
      Promise.tsx
      HowItWorks.tsx
      PatchWall.tsx
      CharacterStrip.tsx
      WhyDoodle.tsx
      EarlyVoices.tsx
      Founders.tsx
      FindUsOffline.tsx
      DualCTA.tsx
      Footer.tsx
    ui/
      PillButton.tsx
      MarkerHeading.tsx
      StitchedBox.tsx
      WaitlistForm.tsx
      PatchScrubber.tsx
    decoration/
      Squiggle.tsx                 # RoughJS-rendered decorative arc
      MarkerStroke.tsx             # rough-notation wrapper
emails/
  WaitlistConfirmation.tsx         # React Email template
public/
  patches/                         # placeholder SVGs you create; Ash replaces later
    .gitkeep
```

## 11. Coding standards

- **Default to no comments.** Only comment when the WHY is non-obvious.
- **No "// added for X" or "// fixes Y" comments** — those belong in PR descriptions.
- **No multi-paragraph docstrings.** One short line max.
- **Tight TypeScript types** — no `any`. Use `Readonly<{ ... }>` for component props per the existing layout.tsx pattern.
- **Server Components by default.** `'use client'` only when needed (any hook, any motion, any browser API).
- **Mobile-first responsive** — every section must look right at 375px before desktop.
- **Accessibility AA**: contrast ratios, focus rings (use `outline-ring/50` from base layer), keyboard navigation, `aria-*` where needed.
- **No fabricated data** — all testimonial names, founder bios, location names, partner logos must be obvious placeholders (e.g. `[Founder Name]`, `[City, Date]`) so Ash knows exactly what to fill in.

## 12. Hand-off contract

When done, leave this state:
- ✅ All 12 section components implemented with placeholder content marked
- ✅ Patch scrubber working with ≥5 placeholder patch combos
- ✅ Waitlist form wired to Server Action that logs to console and `TODO`'s the Resend call (Ash will add the API key later)
- ✅ All animations honor `prefers-reduced-motion`
- ✅ Mobile responsive at 375 / 768 / 1024 / 1440 breakpoints
- ✅ `npm run dev` starts cleanly with no console errors
- ✅ Top of `page.tsx` includes a comment listing all `[PLACEHOLDER]` items Ash needs to fill in
- ❌ Do NOT install new packages without flagging — everything you need is already installed
- ❌ Do NOT add a CMS, database, or analytics in this pass

After the build, the next session will:
1. Visual review against this brief
2. Resolve placeholders with Ash's content
3. Drop in real patch SVGs and character illustrations
4. Wire Resend with API key
5. Add Cloudflare Turnstile spam protection
6. Deploy to Vercel
