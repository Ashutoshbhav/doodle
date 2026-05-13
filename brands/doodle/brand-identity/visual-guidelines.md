# DOODLE — Visual Guidelines

_For packshot / product-shoot / image-generation workflows. Maintained alongside `docs/SESSION-STATE.md` and the design-supervisor log._

## Brand

- **Brand**: DOODLE (parent: CANVAS — future house-of-brands)
- **Founded**: Bangalore, 2024 — Scaler School of Business MBA project
- **Positioning**: *Don't Just Dress. Create.*
- **Promise**: The first clothing that actually listens to your child
- **Stated visual direction**: Creative studio, not retail catalogue. The Souled Store meets a D2C kidswear brand — Indian, confident, character-driven, but elevated.

## Palette (locked — do not drift)

| Token | Hex | Use |
|---|---|---|
| Red | `#C8312A` | Campaign zones, hero backgrounds |
| Orange | `#E8650A` | Primary CTAs only (one per viewport) |
| Blue | `#1A56C4` | Patch tiles, accent fills |
| Purple | `#8B80E0` | Patch tiles, accent fills |
| Yellow | `#D4A800` (mustard, not bright) | Marker highlights via rough.js |
| Pink | `#D4607A` | Patch tiles, accent fills |
| Cream | `#F5F0E8` | Default surface |
| Ink | `#1A1A1A` | Body type, deep accents |
| Tee Pink | `#F4A7B9` (Pantone 183C) | First-run tee colour |
| Tee Blue | `#A8D8EA` (Pantone 290C) | First-run tee colour |
| Surface Blush | `#F8EFE9` | Section band tone |
| Surface Parchment | `#F0EADC` | Section band tone |

## Typography

- **Display**: Bricolage Grotesque (heading + headline)
- **Display chunky**: Bagel Fat One — **reserved for one Hero word ("CREATE.") only — do not propagate**
- **Body**: Geist Sans
- **Mono**: Geist Mono — eyebrow labels, taxonomy chips
- **Handwritten accent**: Caveat — micro-moments ("try it ↓", caveats, kicker lines)

## Product reality (first-run)

- **Tees only** — backpacks in v2 testing, not first-run
- **Tee colours**: Bubblegum Pink (#F4A7B9) + Powder Blue (#A8D8EA)
- **Sizes**: S (3–4 yrs) / M (4–5 yrs) / L (5–6 yrs)
- **Material**: 100% combed cotton, 200–220 GSM
- **Price**: ₹370 per tee inclusive of velcro + tags. MOQ 120 units.
- **Patches**: 1.5–2", silicone-charm style, attach via velcro panels
- **First SKU patch shapes**: geometric (Star/Square/Circle/Triangle/Pentagon)

## IP boundary (non-negotiable)

**No licensed character reproduction on the public site.** This includes Marvel, Disney, Nintendo, anime IP, real-person likeness, sports-team kit colors evoking specific players.

**Reason**: Visual likeness is the legal trigger, not the name. Marvel/Disney lawyers and DMCA bots match on character design — rename/stylize doesn't help. Image-generation tools tend to "improve" derivative work which INCREASES fidelity and infringement risk.

**Path forward**: Original DOODLE-superhero characters drawn from scratch (masked sun, lightning kid, cape-star, shield buddy, web rider) — same kid-emotional lane, zero IP risk, becomes DOODLE-owned IP.

## Packshot defaults

When running `/packshot` for DOODLE:
- **Default staging**: ghost-mannequin (hollow-body floating) for tees
- **Default aspect**: 3:4
- **Background**: Clinical neutral grey (#f9f9f9) per skill's render spec
- **Product references**: `public/product/tee-white.jpeg`, `public/product/tee-blue.jpeg` — **BUT first verify all patches in the reference image are IP-clean** (currently they are NOT — see `~/Downloads/doodle/patches/` IP audit)
- **Output naming**: `doodle-tee-[colour]-ghost-v[n]`

## Image generation policy

- **Cost gate**: every paid render (FAL/Midjourney/etc.) requires explicit Ash approval before spend
- **IP gate**: every input image must be audited for licensed IP before generation — see above
- **Output policy**: AI-generated photos require Ash's visual approval before landing in `public/`
