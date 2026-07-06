"use client";

import * as React from "react";
import { patchDoodleFrames } from "@/lib/patch-doodles";

/* PatchDoodle — each patch's PERSONAL living doodle. Three layers of life:
   1. LINE BOIL: three seed-variants of the same drawing cycle at ~7fps
      (CSS steps), so the ink itself shimmers like hand-drawn animation.
   2. Character motion on the whole mark (hearts beat, flames flicker…).
   3. A springy pop-in when summoned.
   Desktop: all of it on hover (pure CSS, zero JS per hover). Touch: no
   hover exists, so the doodles are always drawn and always alive.
   All 39 assignments live in src/lib/patch-doodles.ts. */

export function PatchDoodle({
  patchKey,
  className = "",
}: {
  patchKey: string;
  /** Extra positioning/size classes; colour comes from the character. */
  className?: string;
}) {
  const frames = React.useMemo(() => patchDoodleFrames(patchKey), [patchKey]);
  const base = frames[0];
  if (base.strokes.length === 0 && !base.dots?.length) return null;

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      className={`doodle-ring doodle-personal pointer-events-none absolute -right-1 -top-1 z-10 w-[36%] overflow-visible ${base.colorClass} ${className}`}
    >
      {/* Outer g owns the static rotation, inner g the character motion —
          CSS transforms would otherwise override the rotate attribute. */}
      <g transform={base.rotate ? `rotate(${base.rotate} 20 20)` : undefined}>
        <g className={base.anim ? `doodle-anim dd-${base.anim}` : undefined}>
          {frames.map((frame, f) => (
            <g key={f} className={`dd-boil dd-boil-${f + 1}`}>
              {frame.strokes.map((d, i) => (
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
            </g>
          ))}
          {base.dots?.map((dot, i) => (
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
