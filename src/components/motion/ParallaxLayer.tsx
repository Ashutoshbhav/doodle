"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Parallax-translates its content along Y as the user scrolls past.
 * Speed > 0 = moves slower than scroll (background feel).
 * Speed < 0 = moves opposite to scroll (foreground feel).
 *
 * Reduced-motion users see the content with zero offset — no parallax.
 */
export function ParallaxLayer({
  children,
  speed = 0.3,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map 0..1 progress to a vertical translation. 100px is a comfortable max
  // for in-viewport elements; tune via `speed`.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [100 * speed, -100 * speed],
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
