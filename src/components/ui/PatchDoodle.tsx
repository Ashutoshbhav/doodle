"use client";

import * as React from "react";
import { patchDoodleFor } from "@/lib/patch-doodles";

/* PatchDoodle — each patch's PERSONAL hover doodle. All 39 characters
   have their own bespoke mark, derived from their bio (see
   src/lib/patch-doodles.ts for every assignment). The mark floats off
   the patch's top-right corner and sketches itself in on hover via the
   pure-CSS .doodle-ring draw — zero JS per hover. */

export function PatchDoodle({
  patchKey,
  className = "",
}: {
  patchKey: string;
  /** Extra positioning/size classes; colour comes from the character. */
  className?: string;
}) {
  const spec = React.useMemo(() => patchDoodleFor(patchKey), [patchKey]);
  if (spec.strokes.length === 0 && !spec.dots?.length) return null;

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      className={`doodle-ring doodle-personal pointer-events-none absolute -right-1 -top-1 z-10 w-[36%] overflow-visible ${spec.colorClass} ${className}`}
    >
      {/* Outer g owns the static rotation, inner g owns the character
          animation — CSS transforms would otherwise override the rotate
          attribute and snap tilted doodles straight mid-animation. */}
      <g transform={spec.rotate ? `rotate(${spec.rotate} 20 20)` : undefined}>
      <g className={spec.anim ? `doodle-anim dd-${spec.anim}` : undefined}>
        {spec.strokes.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            suppressHydrationWarning
          />
        ))}
        {spec.dots?.map((dot, i) => (
          <circle
            key={`d${i}`}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="currentColor"
            className="doodle-dot"
          />
        ))}
      </g>
      </g>
    </svg>
  );
}
