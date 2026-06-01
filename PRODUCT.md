# Product

## Register

brand

## Users

Indian urban millennial parents (design-aware, 28-40) buying for kids aged 3-6.
They shop on phones, in spare minutes, often with the child nearby. They are
tired of buying clothes the kid loves for three weeks then refuses to wear. They
respond to specificity and warmth, not corporate kidswear gloss. Secondary user:
the child, who experiences the product as a toy they control (swapping patches).

## Product Purpose

DOODLE sells a modular kids' T-shirt with interchangeable velcro patches — one
tee, infinite personalities. The site's job pre-launch is to make a parent feel
"this brand actually understands my kid" and convert that into a waitlist signup
or (once commerce is live) a first order. Success = the parent finishes the page
believing the modularity is real and worth ₹999, not a gimmick.

## Brand Personality

Warm, parent-knowing, specific. Confident but never shouty. The voice is a
clever parent talking to another parent, not a brand talking to a market.
Three words: **warm · knowing · playful-with-discipline**.
Emotional goal: recognition ("they get it") then delight (the patch swap).

Real taglines (locked): "Don't Just Dress. Create." · "Wear Your Imagination." ·
"One tee. One bag. Infinite personalities."
Brand promise: "the first clothing that actually listens to your child."
Signature line: "Kids don't outgrow clothes. They outgrow characters."
Voice exemplar: "Pokémon phase: March. Iron Man phase: June. Same tee."

## Anti-references

- Generic AI kidswear: rainbow gradients, balloon fonts, clip-art mascots,
  Comic-Sans energy, "fun!" exclamation everything.
- Corporate kidswear gloss (FirstCry / Hopscotch catalog grid): transactional,
  no point of view.
- Editorial-magazine minimalism (display-serif + italic + drop caps): wrong
  register for a playful product brand; reads cold for kids.
- The Souled Store's loudness WITHOUT its discipline — we want their confidence
  and graphic-tee energy, structured by a children's-book restraint.
- Eyebrow-on-every-section AI scaffolding (tiny uppercase tracked labels above
  every heading). Currently overused on the site; being reworked.

## Design Principles

1. **Elevated kidswear, not childish kidswear.** Children's-book warmth run at
   fintech-grade structural discipline. The chrome is calm and adult; the
   product and patches are loud and joyful. The tension is the brand.
2. **Accent scarcity = elevation.** One accent color per viewport. The six
   letter-colors live on patches and illustrations, not on UI chrome. Monochrome
   cream/ink frame + explosively colorful product.
3. **The patch swap is the argument.** The interactive patch experience is the
   single most important proof; it graduates from hero toy to the PDP buy
   experience. Show modularity, never just claim it.
4. **Specific over generic, always.** Every line of copy names a real parenting
   moment. No buzzwords, no aphoristic filler, no fabricated stats/press.
5. **Imagery is mandatory.** This is a product brand — real tee/patch imagery
   carries the page. Colored blocks where a product photo belongs is a bug.

## Accessibility & Inclusion

- WCAG 2.1 AA. Body text ≥4.5:1 (muted-foreground darkened to #57534a on cream
  to hold this). Large text ≥3:1.
- `prefers-reduced-motion`: motion reduced to opacity/colour crossfades, no
  transform-based movement. Guard already in globals.css.
- Hover effects gated behind `@media (hover:hover) and (pointer:fine)` so touch
  taps don't fire false hovers.
- en-IN, INR (₹), Indian sizing language. No dark mode in v1 (warm-cream brand).
