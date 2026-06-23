import type { ReactNode } from "react";

/**
 * Eyebrow — the single source for section lead-in labels.
 *
 * Replaces ~15 duplicated `font-mono uppercase tracking-[0.22em]` labels that
 * DESIGN.md flags as impeccable's banned "saturated AI scaffold." The fix is a
 * deliberate, *varied* cadence: pick a variant per section instead of stamping
 * the same mono eyebrow on every fold. Tune the whole site's cadence here.
 *
 * PREMIUM-FOR-KIDS pass (2026-06): the DEFAULT label voice is CLEAN SANS
 * (the `rule` variant uses font-sans small-caps). Mono is NOT a default — it is
 * an explicit opt-in only, reserved for sparse commerce/index contexts.
 *
 * Variants:
 * - `rule`   (default) — short colour tick + restrained CLEAN-SANS small-caps
 *                        label. Quiet, structural. Use as the default lead-in.
 * - `marker` — Caveat handwritten micro-label ("try it ↓"). Use SPARINGLY,
 *                        for playful/interactive moments only.
 * - `mono`   — toned legacy mono (tracking dialed 0.22em → 0.14em). EXPLICIT
 *                        opt-in ONLY; reserve for commerce / index-style contexts.
 * - `none`   — render nothing (lets a section opt out of an eyebrow entirely).
 *
 * `accent` controls the one tick/rule colour. Per the one-accent-per-viewport
 * rule, this should match (or stay quieter than) the fold's single accent.
 */

type Variant = "rule" | "marker" | "mono" | "none";
type Accent = "orange" | "blue" | "yellow" | "ink";
/** `tone` switches text/rule colour for the surface underneath:
 *  `ink` for cream/light surfaces, `stitch` for colour-zone / dark surfaces. */
type Tone = "ink" | "stitch";

const ACCENT_TEXT: Record<Accent, string> = {
  orange: "text-doodle-orange",
  blue: "text-doodle-blue",
  yellow: "text-doodle-yellow",
  ink: "text-doodle-ink/55",
};

const ACCENT_RULE: Record<Accent, string> = {
  orange: "bg-doodle-orange",
  blue: "bg-doodle-blue",
  yellow: "bg-doodle-yellow",
  ink: "bg-doodle-ink/30",
};

export function Eyebrow({
  children,
  variant = "rule",
  accent = "ink",
  tone = "ink",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  accent?: Accent;
  tone?: Tone;
  className?: string;
}) {
  if (variant === "none") return null;

  const labelColor =
    tone === "stitch" ? "text-doodle-stitch/80" : "text-doodle-ink/65";

  if (variant === "marker") {
    // On colour zones the handwritten accent stays white; on cream it takes the accent hue.
    const markerColor = tone === "stitch" ? "text-doodle-stitch" : ACCENT_TEXT[accent];
    return (
      <span
        className={`inline-block font-marker text-xl leading-none ${markerColor} ${className}`}
      >
        {children}
      </span>
    );
  }

  if (variant === "mono") {
    return (
      <span
        className={`inline-block font-mono text-[11px] uppercase tracking-[0.14em] ${
          tone === "stitch" ? "text-doodle-stitch/70" : "text-doodle-ink/55"
        } ${className}`}
      >
        {children}
      </span>
    );
  }

  // rule (default): short colour tick + restrained small-caps label
  const ruleColor = tone === "stitch" ? "bg-doodle-stitch/70" : ACCENT_RULE[accent];
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span aria-hidden className={`h-[3px] w-7 rounded-full ${ruleColor}`} />
      <span
        className={`font-sans text-xs font-semibold uppercase tracking-[0.1em] ${labelColor}`}
      >
        {children}
      </span>
    </span>
  );
}
