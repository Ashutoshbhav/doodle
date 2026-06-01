import type { ReactNode } from "react";

/**
 * Band — section wrapper that owns surface tone, vertical rhythm, and the
 * dashed divider. Makes DESIGN.md Rule 7 (intentional banding) auditable from
 * one place: page.tsx declares the surface rhythm, sections stop self-picking
 * their own backgrounds.
 *
 * `surface` walks the locked surface ladder (canvas / blush / parchment) so
 * adjacent sections never flatten into each other. Alternate them down the page.
 *
 * `rhythm` gives *varied* (not uniform) spacing — DESIGN.md asks for
 * "varied, not uniform section spacing, one dominant idea per fold."
 *
 * `bleed` opts out of the inner max-width container for full-bleed sections
 * (e.g. marquees, split-colour heroes) that manage their own layout.
 */

type Surface = "canvas" | "blush" | "parchment" | "none";
type Rhythm = "tight" | "default" | "loose";
type Divider = "none" | "top" | "bottom" | "both";

const SURFACE: Record<Surface, string> = {
  canvas: "bg-[color:var(--color-surface-canvas)]",
  blush: "bg-[color:var(--color-surface-blush)]",
  parchment: "bg-[color:var(--color-surface-parchment)]",
  none: "",
};

const RHYTHM: Record<Rhythm, string> = {
  tight: "py-16 md:py-20",
  default: "py-24 md:py-32",
  loose: "py-28 md:py-40",
};

const DIVIDER: Record<Divider, string> = {
  none: "",
  top: "border-t-2 border-dashed border-doodle-ink/15",
  bottom: "border-b-2 border-dashed border-doodle-ink/15",
  both: "border-y-2 border-dashed border-doodle-ink/15",
};

export function Band({
  children,
  id,
  surface = "canvas",
  rhythm = "default",
  divider = "none",
  bleed = false,
  className = "",
}: {
  children: ReactNode;
  id?: string;
  surface?: Surface;
  rhythm?: Rhythm;
  divider?: Divider;
  bleed?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative ${SURFACE[surface]} ${RHYTHM[rhythm]} ${DIVIDER[divider]} ${className}`}
    >
      {bleed ? (
        children
      ) : (
        <div className="mx-auto max-w-7xl px-6 md:px-10">{children}</div>
      )}
    </section>
  );
}
