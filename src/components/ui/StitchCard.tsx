import type { ReactNode } from "react";

/**
 * StitchCard — the one card primitive. Exists to kill the codex "radius tell":
 * DESIGN.md caps cards at 12–16px, but the codebase had 8 different
 * `rounded-[N]` values up to 32px. This primitive CANNOT exceed 16px — the
 * radius prop only offers `md` (12.8px) and `lg` (16px). There is no larger
 * option by design.
 *
 * In this Tailwind v4 theme the radius scale is amplified (`rounded-2xl` = 28.8px,
 * `rounded-xl` = 22.4px) — both break the cap — so this component uses explicit
 * `rounded-md` / `rounded-lg` (which resolve to 12.8 / 16px) and never the xl+ steps.
 *
 * `tone` paints a brand colour surface or a plain parchment card. Brand-colour
 * fills are allowed here because a card IS content/product chrome, not page
 * chrome — but keep one accent per viewport per DESIGN.md.
 *
 * PREMIUM-FOR-KIDS pass (2026-06): the DEFAULT look is now a soft in-plane
 * shadow card (Dialog discipline) — NOT a dashed border on everything. The
 * dashed-stitch patch signature is preserved as a RARE, opt-in accent:
 *   - `variant="soft"`  (default) → borderless soft-shadow card, premium + calm.
 *   - `variant="stitch"`          → restores the dashed-white-stitch patch look
 *                                    for deliberate playful surfaces (patch cards).
 * The legacy `stitch` prop still works (explicit override); if `stitch` is set
 * to anything but "none" it forces the stitched look regardless of `variant`.
 *
 * `peel` adds the CSS sticker corner-lift on hover (brand voice, intentional).
 * Pure CSS so this stays a server component.
 */

type Tone =
  | "card"
  | "orange"
  | "blue"
  | "purple"
  | "yellow"
  | "red"
  | "pink";
type Radius = "md" | "lg";
type Stitch = "none" | "thin" | "thick" | "ink";
type Variant = "soft" | "stitch";

const TONE: Record<Tone, string> = {
  card: "bg-card text-doodle-ink",
  orange: "bg-doodle-orange text-doodle-stitch",
  blue: "bg-doodle-blue text-doodle-stitch",
  purple: "bg-doodle-purple text-doodle-stitch",
  yellow: "bg-doodle-yellow text-doodle-ink",
  red: "bg-doodle-red text-doodle-stitch",
  pink: "bg-doodle-pink text-doodle-stitch",
};

// Capped: lg = 16px (the maximum allowed), md = 12.8px. No xl+.
const RADIUS: Record<Radius, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
};

const STITCH: Record<Stitch, string> = {
  none: "",
  thin: "stitch",
  thick: "stitch-thick",
  ink: "stitch-ink",
};

export function StitchCard({
  children,
  tone = "card",
  radius = "lg",
  variant = "soft",
  stitch = "none",
  peel = false,
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  radius?: Radius;
  variant?: Variant;
  stitch?: Stitch;
  peel?: boolean;
  className?: string;
}) {
  // Resolve the surface treatment. An explicit `stitch` prop (legacy) always
  // wins; otherwise `variant="stitch"` opts into the default thin white stitch,
  // and `variant="soft"` (default) opts into the premium soft-shadow card.
  const stitchClass =
    stitch !== "none"
      ? STITCH[stitch]
      : variant === "stitch"
        ? STITCH.thin
        : "";

  // Soft cards get a borderless in-plane shadow. Stitched cards keep their own
  // 16px border-radius (set by `.stitch*`), so they skip the shadow to stay
  // flat-and-playful by intent.
  const surface = stitchClass ? stitchClass : "shadow-card";

  // `.stitch*` utilities set their own border-radius (var(--radius) = 16px),
  // which matches the lg cap; we still pass the rounded class for the no-stitch
  // case and to keep md cards at 12.8px.
  return (
    <div
      className={`relative isolate overflow-hidden ${RADIUS[radius]} ${TONE[tone]} ${surface} ${
        peel ? "peel" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
