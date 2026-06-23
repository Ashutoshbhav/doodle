"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type Props = {
  variant?: Variant;
  size?: Size;
  showArrow?: boolean;
  children: React.ReactNode;
} & Omit<HTMLMotionProps<"button">, "children">;

// Dialog-discipline: no dashed borders. Primary = filled orange + soft
// shadow. Secondary = clean canvas + thin SOLID ink hairline (~15%) + soft
// shadow. Ghost = transparent, subtle hover bg, no border. Hover deepens
// shadow (the lift) while motion handles the y-translate.
const SURFACES: Record<Variant, string> = {
  primary:
    "bg-doodle-orange text-doodle-stitch shadow-card hover:bg-doodle-orange/95 hover:shadow-card-hover",
  secondary:
    "bg-doodle-canvas text-doodle-ink border border-doodle-ink/15 shadow-subtle hover:border-doodle-ink/25 hover:shadow-card",
  ghost:
    "bg-transparent text-doodle-ink hover:bg-doodle-ink/[0.06]",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-2",
  md: "h-12 px-6 text-base gap-3",
  lg: "h-14 px-8 text-lg gap-3",
};

const ARROW_WRAP: Record<Variant, string> = {
  primary: "bg-doodle-stitch text-doodle-orange",
  secondary: "bg-doodle-ink text-doodle-canvas",
  ghost: "bg-doodle-ink text-doodle-canvas",
};

export function PillButton({
  variant = "primary",
  size = "md",
  showArrow = true,
  children,
  className = "",
  ...rest
}: Props) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`
        inline-flex items-center justify-center rounded-full font-sans font-medium
        cursor-pointer select-none transition-[box-shadow,background-color,border-color] duration-200
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-orange/40
        ${SURFACES[variant]} ${SIZES[size]} ${className}
      `}
      {...rest}
    >
      <span className="leading-none">{children}</span>
      {showArrow && (
        <span
          className={`grid place-items-center rounded-full ${ARROW_WRAP[variant]}`}
          style={{
            width: size === "lg" ? 32 : size === "md" ? 28 : 22,
            height: size === "lg" ? 32 : size === "md" ? 28 : 22,
          }}
        >
          <ArrowRight weight="bold" size={size === "lg" ? 16 : 14} />
        </span>
      )}
    </motion.button>
  );
}
