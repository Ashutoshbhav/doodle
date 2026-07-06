"use client";

import * as React from "react";
import rough from "roughjs";

/* ============================================================
   DoodleMark — free-drawn pencil marks, powered by rough.js.

   The brand is called DOODLE; these are the actual doodles. Rules
   of engagement (so they enhance, never cheapen):
   - Marks are ANNOTATIONS in the page's margins — an arrow, the
     wordmark's squiggle, a sketch on an empty state. Never borders,
     never container decoration (that anti-pattern was purged).
   - Ink or the section's one accent colour, always translucent.
   - Each mark draws itself in like a pencil stroke when it enters
     the viewport; `sway` adds a barely-there paper-alive drift.
   - prefers-reduced-motion: everything appears instantly, no sway.
   - Geometry is seeded → deterministic → SSR/hydration-safe.
   ============================================================ */

type Kind = "squiggle" | "arrow" | "tee";

type Geometry = {
  viewBox: string;
  strokes: string[]; // path d strings
  dot?: { cx: number; cy: number; r: number };
};

const OPTS = {
  roughness: 1.6,
  bowing: 1.4,
  strokeWidth: 2.2,
  disableMultiStroke: false,
} as const;

function buildGeometry(kind: Kind): Geometry {
  const gen = rough.generator();
  const toDs = (drawables: ReturnType<typeof gen.curve>[]) =>
    drawables.flatMap((dr) => gen.toPaths(dr).map((p) => p.d));

  if (kind === "squiggle") {
    // The wordmark's underline wave + end dot, redrawn by hand.
    const curve = gen.curve(
      [
        [4, 14],
        [20, 5],
        [36, 18],
        [52, 5],
        [68, 18],
        [84, 7],
        [96, 12],
      ],
      { ...OPTS, seed: 11 },
    );
    return {
      viewBox: "0 0 120 24",
      strokes: toDs([curve]),
      dot: { cx: 110, cy: 11, r: 3 },
    };
  }

  if (kind === "arrow") {
    // A small curved "look here" arrow, drawn down-and-right.
    const shaft = gen.curve(
      [
        [8, 4],
        [12, 22],
        [26, 38],
        [46, 46],
      ],
      { ...OPTS, seed: 23 },
    );
    const headA = gen.line(46, 46, 32, 44, { ...OPTS, seed: 24 });
    const headB = gen.line(46, 46, 42, 32, { ...OPTS, seed: 25 });
    return { viewBox: "0 0 56 52", strokes: toDs([shaft, headA, headB]) };
  }

  // kind === "tee" — a child's t-shirt outline for empty states.
  const tee = gen.path(
    "M38 8 L14 24 L24 42 L34 36 L34 96 L86 96 L86 36 L96 42 L106 24 L82 8 Q60 22 38 8 Z",
    { ...OPTS, seed: 42 },
  );
  // The velcro panel, sketched as a little rectangle on the chest.
  const panel = gen.rectangle(44, 40, 32, 14, { ...OPTS, seed: 43 });
  return { viewBox: "0 0 120 104", strokes: [...toDs([tee]), ...toDs([panel])] };
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function DoodleMark({
  kind,
  className = "",
  on = "view",
  sway = false,
}: {
  kind: Kind;
  /** Size + colour via className (e.g. "w-16 text-doodle-ink/25"). */
  className?: string;
  /** "view" draws on scroll-into-view; "mount" shortly after load. */
  on?: "view" | "mount";
  /** Barely-there rotation drift once drawn — paper feels alive. */
  sway?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const [drawn, setDrawn] = React.useState(false);
  const ref = React.useRef<SVGSVGElement | null>(null);

  const geo = React.useMemo(() => buildGeometry(kind), [kind]);

  React.useEffect(() => {
    if (drawn) return;
    if (on === "mount") {
      const t = setTimeout(() => setDrawn(true), 250);
      return () => clearTimeout(t);
    }
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [on, drawn]);

  const showNow = drawn || reduced;

  return (
    <svg
      ref={ref}
      viewBox={geo.viewBox}
      fill="none"
      aria-hidden
      className={className}
      style={
        sway && showNow && !reduced
          ? { animation: "doodle-sway 6s ease-in-out infinite", transformOrigin: "50% 50%" }
          : undefined
      }
    >
      {geo.strokes.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={
            reduced
              ? undefined
              : {
                  strokeDasharray: 1,
                  strokeDashoffset: showNow ? 0 : 1,
                  transition: `stroke-dashoffset 700ms cubic-bezier(0.65, 0, 0.35, 1) ${i * 200}ms`,
                }
          }
        />
      ))}
      {geo.dot && (
        <circle
          cx={geo.dot.cx}
          cy={geo.dot.cy}
          r={geo.dot.r}
          fill="currentColor"
          style={
            reduced
              ? undefined
              : {
                  opacity: showNow ? 1 : 0,
                  transform: showNow ? "scale(1)" : "scale(0.4)",
                  transformOrigin: `${geo.dot.cx}px ${geo.dot.cy}px`,
                  transition: `opacity 250ms ease ${geo.strokes.length * 200 + 350}ms, transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1) ${geo.strokes.length * 200 + 350}ms`,
                }
          }
        />
      )}
    </svg>
  );
}
