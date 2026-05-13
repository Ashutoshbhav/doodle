"use client";

/* ============================================================
   Rough — hand-drawn annotation primitives for DOODLE
   Wraps `react-rough-notation` with brand-default colors and
   on-mount / on-view triggers. Use these instead of the CSS
   .marker-yellow / .stitch utilities where you want the authentic
   sketched aesthetic that mirrors the DOODLE name itself.

   Trigger semantics:
     - on="mount"  → draws shortly after mount (good for above-fold)
     - on="view"   → draws when scrolled into view (good for below fold)

   Reduced-motion users see the annotation drawn instantly with no
   stroke animation, courtesy react-rough-notation's `animate=false`.
   ============================================================ */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";

type RoughType =
  | "underline"
  | "box"
  | "circle"
  | "highlight"
  | "strike-through"
  | "crossed-off"
  | "bracket";

type Trigger = "mount" | "view";

type RoughProps = {
  children: ReactNode;
  /** Annotation style. Defaults vary per shorthand wrapper. */
  type?: RoughType;
  /** Brand color — defaults per-shorthand. Accepts any CSS color. */
  color?: string;
  /** When to draw. */
  on?: Trigger;
  /** Stroke width (px). Brand default: 2 for fine, 4 for chunky. */
  strokeWidth?: number;
  /** Animation duration (ms). 0 = instant. */
  animationDuration?: number;
  /** Padding around children's bounding box (px). */
  padding?: number;
  /** Multi-stroke iterations — higher = more "hand-drawn rough" feel. */
  iterations?: number;
  /** Override show toggle externally if needed. */
  show?: boolean;
  className?: string;
};

/**
 * Custom hook: trigger show=true on mount (after a small delay so the
 * browser has painted) OR when scrolled into viewport.
 */
function useShowTrigger(on: Trigger, externalShow?: boolean) {
  const [show, setShow] = useState(externalShow ?? false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (externalShow !== undefined) {
      setShow(externalShow);
      return;
    }

    if (on === "mount") {
      const t = setTimeout(() => setShow(true), 120);
      return () => clearTimeout(t);
    }

    // on === "view"
    const node = ref.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShow(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [on, externalShow]);

  return { show, ref };
}

function RoughBase({
  children,
  type = "underline",
  color,
  on = "mount",
  strokeWidth = 2,
  animationDuration = 700,
  padding,
  iterations,
  show: externalShow,
  className,
}: RoughProps) {
  const { show, ref } = useShowTrigger(on, externalShow);

  return (
    <span ref={ref} className={className}>
      <RoughNotation
        type={type}
        show={show}
        color={color ?? "#1A1A1A"}
        strokeWidth={strokeWidth}
        animationDuration={animationDuration}
        padding={padding}
        iterations={iterations}
        multiline
      >
        {children}
      </RoughNotation>
    </span>
  );
}

/* ---------- Shorthand wrappers with brand defaults ---------- */

/** Yellow marker swipe — like the old .marker-yellow but hand-drawn.
 *  Used for emphasis-word highlights and the hero "CREATE." swipe. */
export function RoughHighlight(props: Omit<RoughProps, "type">) {
  return (
    <RoughBase
      type="highlight"
      color="#D4A800"
      strokeWidth={26}
      animationDuration={900}
      iterations={2}
      {...props}
    />
  );
}

/** Hand-drawn underline — for emphasis on cream surfaces. */
export function RoughUnderline(props: Omit<RoughProps, "type">) {
  return (
    <RoughBase
      type="underline"
      color="#E8650A"
      strokeWidth={3}
      animationDuration={650}
      iterations={2}
      padding={2}
      {...props}
    />
  );
}

/** Hand-drawn rectangle border — replaces dashed-stitch on editorial cards. */
export function RoughBox(props: Omit<RoughProps, "type">) {
  return (
    <RoughBase
      type="box"
      color="#1A1A1A"
      strokeWidth={2.5}
      animationDuration={1100}
      iterations={2}
      padding={8}
      {...props}
    />
  );
}

/** Hand-drawn circle — for floating accent labels / numbers. */
export function RoughCircle(props: Omit<RoughProps, "type">) {
  return (
    <RoughBase
      type="circle"
      color="#1A56C4"
      strokeWidth={3}
      animationDuration={900}
      iterations={2}
      padding={6}
      {...props}
    />
  );
}

/** Group multiple annotations to fire in sequence. */
export function RoughGroup({
  children,
  show: externalShow,
  on = "mount",
}: {
  children: ReactNode;
  show?: boolean;
  on?: Trigger;
}) {
  const { show, ref } = useShowTrigger(on, externalShow);
  return (
    <span ref={ref}>
      <RoughNotationGroup show={show}>{children}</RoughNotationGroup>
    </span>
  );
}
