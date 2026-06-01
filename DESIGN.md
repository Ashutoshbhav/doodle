# Design

DOODLE visual system. Locked 2026-05-29 via the `/sauce` design pass
(design-supervisor anchor → impeccable anti-patterns → emil motion).
Source of truth for every future design decision. When this and the code
disagree, fix the code.

## Refero anchor

A deliberate 2-brand blend:

- **Family** (`family-1bcae895`) — PRIMARY. Owns the marketing site and the
  system's soul. Children's-book aesthetic run at fintech-grade discipline =
  literal "elevated kidswear." Calm structured chrome, expressive content.
- **Shop** (`shop-4fa67bd1`) — SECONDARY. Owns the commerce funnel
  (PLP / PDP / cart / checkout). Shopify's own storefront grammar, recolored
  from violet → DOODLE orange. Conversion-grade structure, not scaffold.

## Theme

Light only. Warm-cream canvas, ink text, one accent per viewport. No dark mode
in v1. The mood: a well-made children's hardback — warm paper, confident
printing, bursts of saturated colour where it earns attention.

## Color

Strategy: **Restrained chrome + Full-palette product.** The page frame is
near-monochrome (canvas + ink + one accent). The six brand colours are
deployed ONLY on patches, illustrations, and product — never as competing UI
chrome. This accent scarcity is the primary anti-slop move.

Exact hexes (locked, deck slide 4 + Brand Guidelines.xlsx — do not drift):

| Token | Hex | Role |
| --- | --- | --- |
| `--color-doodle-red` | `#c8312a` | patch / accent / destructive |
| `--color-doodle-orange` | `#e8650a` | PRIMARY accent · CTA · `--primary` |
| `--color-doodle-blue` | `#1a56c4` | patch / tile accent · `--accent` |
| `--color-doodle-purple` | `#8b80e0` | patch / illustration only |
| `--color-doodle-yellow` | `#d4a800` | mustard (NOT bright) · marker · `--secondary` |
| `--color-doodle-pink` | `#d4607a` | patch / illustration only |
| `--color-doodle-canvas` | `#f5f0e8` | body background |
| `--color-doodle-ink` | `#1a1a1a` | foreground text |
| `--color-doodle-stitch` | `#ffffff` | dashed stitching on colour surfaces |
| `--color-doodle-tee-pink` | `#f4a7b9` | production tee (Bubblegum, Pantone 183C) |
| `--color-doodle-tee-blue` | `#a8d8ea` | production tee (Powder, Pantone 290C) |

Surface ladder (application tints, not new brand colours): `surface-canvas`
`#f5f0e8` · `surface-blush` `#f8efe9` · `surface-parchment` `#f0eadc` for
section banding rhythm.

Role tokens in `:root` are all bound to the locked hexes (reconciled 2026-05-29
after a drift where orange/ink/yellow rendered lighter & off-spec).
`--muted-foreground` is `#57534a` (darkened to hold ≥4.5:1 on cream).

Rule: **one accent per viewport.** If orange is the CTA in a fold, blue/yellow
do not also appear as chrome in that fold. More than one accent = revert to the
patch/illustration layer for the others.

## Typography

Family count: 3 working + 1 single-word stamp. Display pairs against body on a
contrast axis (quirky grotesque vs warm humanist), not two similar sans.

| Role | Family | Notes |
| --- | --- | --- |
| Display / headings | **Bricolage Grotesque** (`--font-display`) | variable opsz+wdth; quirky humanist grotesque; H1-H4 |
| Body / commerce | **Figtree** (`--font-sans`) | warm humanist-geometric; replaced Geist 2026-05-29 (Geist read cold) |
| Handwritten accent | **Caveat** (`--font-marker`) | sparingly — micro-labels like "try it ↓" |
| Single-word stamp | **Bagel Fat One** (`--font-bubble`) | RESERVED for the one "CREATE." hero word only |
| Mono label | **Geist Mono** (`--font-mono`) | ⚠ legacy eyebrow voice, overused — see Anti-patterns |

Ceilings (impeccable): hero `clamp()` max ≤ 6rem; display letter-spacing ≥
-0.04em (current base -0.015em is safe); `text-wrap: balance` on h1-h3,
`pretty` on prose; body line-length 65-75ch; no all-caps body.

## Motion

Emil Kowalski curves, in globals.css as tokens:
- `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` — enter/exit, default UI
- `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` — on-screen morph
- `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)` — sheets, cart drawer

Rules: UI animations < 300ms (button press 100-160ms, dropdown 150-250ms, cart
drawer 200-500ms). Never `ease-in` on UI. Never animate from `scale(0)` — start
`scale(0.95)` + opacity. Only animate `transform`/`opacity` (+ blur/clip-path
when they earn it). Buttons get `:active { transform: scale(0.97) }`. Popovers
scale from trigger origin, modals stay centered. Stagger lists 30-80ms. Every
animation needs a `prefers-reduced-motion` crossfade/instant fallback (global
guard present). Playful bounce (sticker `.peel`) is allowed — it is brand voice,
not generic UI.

## Layout

- Marketing homepage: Family's banded editorial scroll. Generous `clamp()`
  vertical rhythm, varied (not uniform) section spacing, one dominant idea per
  fold. Asymmetry allowed for emphasis.
- Commerce: Shop's grammar. PLP = `repeat(auto-fit, minmax(280px, 1fr))` product
  grid. PDP = image stage + sticky buy rail; the patch scrubber is the PDP hero.
- Radius leans organic (`--radius: 1rem`); cards 12-16px, pills for tags/buttons.
  Never 24px+ on a card (codex tell).

## Shared primitives (in src/components/ui/ — use these, don't re-roll)

Built 2026-06-01 to enforce the system from ONE place across all sections:

- **`<Eyebrow variant accent tone>`** — the single source for section lead-in
  labels. Replaced ~15 duplicated `font-mono uppercase tracking-[0.22em]`
  eyebrows. Variants: `rule` (tick + small-caps, default) · `marker` (Caveat,
  sparingly) · `mono` (toned legacy, tracking 0.14em, for index/commerce voice)
  · `none`. `tone="stitch"` for colour/dark surfaces, `ink` for cream.
- **`<Band surface rhythm divider>`** — section wrapper owning surface tone,
  vertical rhythm, dashed divider. Makes banding (Rule 7) intentional.
- **`<StitchCard tone radius stitch peel>`** — the one card primitive.
  Radius HARD-CAPPED at 16px (`md`=12.8 / `lg`=16). Kills the codex radius tell.

⚠ Tailwind v4 radius trap: `rounded-xl`=22px and `rounded-2xl`=29px in THIS
theme (scale is amplified) — both break the 16px card cap. Use `rounded-lg`
(16px) / `rounded-md` (13px) / explicit `rounded-[1rem]` on cards.

## Signature components / utilities (in globals.css)

- `.stitch` / `.stitch-thick` / `.stitch-ink` — dashed stitching, the patch
  signature lifted from the logo "o"s. Use on colour surfaces.
- `.marker-yellow` / `.marker-orange` — brushstroke highlight behind an emphasis
  word (CSS fallback; rough-notation for the animated version).
- `.peel` / `.peel-host` — sticker corner-lift on hover (playful, intentional).
- `.noise-paper` — subtle paper-grain overlay for tactile warmth.
- `.wobble` — slow drift for floating sticker decoration.
- Marquee utilities for patch lanes.

## Anti-patterns (DOODLE-specific, on top of impeccable's absolute bans)

1. **Eyebrow overuse.** ✅ RESOLVED 2026-06-01 — all section lead-in eyebrows
   routed through `<Eyebrow>` with varied cadence. (Inline chips / floating
   product tags / data tickers legitimately keep a mono voice — they are NOT
   section eyebrows; don't over-correct them.)
2. **Accent soup.** ✅ Largely resolved 2026-06-01 — one-accent-per-viewport
   enforced across sections; drifted hex maps (HowItWorks/CharacterStrip)
   deleted → `bg-doodle-*` vars. Keep enforcing on any new fold.
3. No rainbow gradients, no balloon/Comic-Sans fonts, no clip-art mascots.
4. No fabricated stats / testimonials / press logos — mark `[PLACEHOLDER]`.
5. No licensed-character reproduction on the public site (originals only).
6. Imagery is mandatory — never a colored `<div>` where a product photo belongs.

## Hard build rules

- Read Next.js 16 docs from `node_modules/next/dist/docs/` before unfamiliar
  patterns. `proxy.ts` not `middleware.ts`. Tailwind v4 = CSS `@theme`, no
  `tailwind.config.ts`.
- Free tools only. en-IN / INR.
