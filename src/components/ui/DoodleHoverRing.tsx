"use client";

import * as React from "react";
import rough from "roughjs";

/* DoodleHoverRing — a hand-drawn crayon ring that sketches itself around
   an element on hover/focus, like a kid circling their favourite.

   Cheap by construction: the rough.js ellipse is generated ONCE (seeded,
   memoised) and the draw-in is pure CSS (stroke-dashoffset transition,
   see .doodle-ring in globals.css) — no JS on hover, so it can sit on
   dozens of patch tiles for free.

   Usage: parent needs `relative` and `group`; drop this inside. */

const RING_OPTS = {
  roughness: 1.7,
  bowing: 1.2,
  strokeWidth: 2,
  disableMultiStroke: false,
} as const;

export function DoodleHoverRing({
  className = "text-doodle-berry/70",
  seed = 7,
  fit = "outside",
}: {
  /** Colour via className; sits absolutely over the parent. */
  className?: string;
  /** Vary per grid for non-identical rings. */
  seed?: number;
  /** "outside" overshoots the box; "inside" stays within clipped parents. */
  fit?: "outside" | "inside";
}) {
  // Three wobble-variants for line boil — the ring shimmers while held
  const frames = React.useMemo(() => {
    const gen = rough.generator();
    return [0, 1, 2].map((f) =>
      gen
        .toPaths(gen.ellipse(50, 50, 94, 90, { ...RING_OPTS, seed: seed + f * 7919 }))
        .map((p) => p.d),
    );
  }, [seed]);

  const fitClass =
    fit === "outside"
      ? "-inset-1 h-[calc(100%+0.5rem)] w-[calc(100%+0.5rem)]"
      : "inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)]";

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      className={`doodle-ring pointer-events-none absolute ${fitClass} ${className}`}
    >
      {frames.map((strokes, f) => (
        <g key={f} className={`dd-boil dd-boil-${f + 1}`}>
          {strokes.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              suppressHydrationWarning
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
