"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSETS: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Fades + translates a block into place when it scrolls into view.
 * Reduced-motion users see the block instantly with no transform.
 */
export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  amount = 0.25,
  once = true,
  className,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  amount?: number; // viewport intersection ratio that triggers
  once?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const offset = reduce ? OFFSETS.none : OFFSETS[direction];

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration: reduce ? 0 : duration,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1], // ease-out-quart
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
