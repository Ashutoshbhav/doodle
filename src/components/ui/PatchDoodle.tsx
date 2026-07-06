"use client";

import * as React from "react";
import { patchDoodleFrames } from "@/lib/patch-doodles";

/* PatchDoodle — each patch's PERSONAL living doodle. Layers of craft:
   - Two-tone drawing: crayon scribble fill (thin, translucent) inside a
     confident outline — "coloured in by a kid", not programmer art.
   - LINE BOIL: three wobble-variants cycle at ~7fps so the ink shimmers.
   - Character motion (hearts beat, flames flicker…) + springy pop-in.

   Desktop: everything on hover (pure CSS). Touch: the doodle sits quietly
   drawn; a TAP wakes it for a couple of seconds (constant motion across a
   40-tile wall was noise — life should answer the finger).
   All 39 assignments live in src/lib/patch-doodles.ts. */

const TAP_LIFE_MS = 2600;

export function PatchDoodle({
  patchKey,
  className = "",
}: {
  patchKey: string;
  /** Extra positioning/size classes; colour comes from the character. */
  className?: string;
}) {
  const frames = React.useMemo(() => patchDoodleFrames(patchKey), [patchKey]);
  const ref = React.useRef<SVGSVGElement | null>(null);

  // Tap-to-live: a pointerdown on the surrounding tile (.group) marks it
  // `doodle-live` for a moment — the CSS treats that exactly like hover.
  React.useEffect(() => {
    const group = ref.current?.closest(".group");
    if (!group) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const wake = () => {
      group.classList.add("doodle-live");
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => group.classList.remove("doodle-live"), TAP_LIFE_MS);
    };
    group.addEventListener("pointerdown", wake, { passive: true });
    return () => {
      group.removeEventListener("pointerdown", wake);
      if (timer) clearTimeout(timer);
      group.classList.remove("doodle-live");
    };
  }, []);

  const base = frames[0];
  if (base.paths.length === 0 && !base.dots?.length) return null;

  return (
    <svg
      ref={ref}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      className={`doodle-ring doodle-personal pointer-events-none absolute -right-1.5 -top-1.5 z-10 w-[42%] overflow-visible ${base.colorClass} ${className}`}
    >
      {/* Outer g owns the static rotation, inner g the character motion —
          CSS transforms would otherwise override the rotate attribute. */}
      <g transform={base.rotate ? `rotate(${base.rotate} 20 20)` : undefined}>
        <g className={base.anim ? `doodle-anim dd-${base.anim}` : undefined}>
          {frames.map((frame, f) => (
            <g key={f} className={`dd-boil dd-boil-${f + 1}`}>
              {frame.paths.map((p, i) => (
                <path
                  key={i}
                  d={p.d}
                  stroke="currentColor"
                  strokeWidth={p.soft ? 1.3 : 2.1}
                  strokeOpacity={p.soft ? 0.4 : 1}
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
