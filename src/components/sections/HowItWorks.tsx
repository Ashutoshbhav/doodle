"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import {
  TShirt,
  Stack,
  Sparkle,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { MagneticHover } from "@/components/motion";
import { RoughHighlight } from "@/components/ui/Rough";

const STEPS = [
  {
    Icon: TShirt,
    color: "blue",
    label: "Step 01",
    title: "Pick your base",
    body: "Start with a tee, hoodie or backpack. Patch slots are pre-stitched and ready to receive.",
  },
  {
    Icon: Stack,
    color: "yellow",
    label: "Step 02",
    title: "Choose your patches",
    body: "Browse the patch library, mix prints with shapes with letters. Build today’s mood.",
  },
  {
    Icon: Sparkle,
    color: "pink",
    label: "Step 03",
    title: "Wear, swap, repeat",
    body: "Snap patches on with the press-fix backing. Outfits change while the wardrobe stays the same.",
  },
] as const;

const TILE = {
  blue: { ring: "border-doodle-blue", chip: "bg-doodle-blue", hex: "#2a56b3" },
  yellow: { ring: "border-doodle-yellow", chip: "bg-doodle-yellow", hex: "#f2c84a" },
  pink: { ring: "border-doodle-pink", chip: "bg-doodle-pink", hex: "#d4738a" },
} as const;

export function HowItWorks() {
  return (
    <section
      id="how"
      className="relative border-b-2 border-dashed border-doodle-ink/15 py-24 md:py-32 bg-doodle-canvas"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-doodle-ink/55">
              How DOODLE works
            </div>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              Three moves between{" "}
              <span className="italic text-doodle-orange">boring</span>{" "}
              and{" "}
              <RoughHighlight on="view" strokeWidth={18} padding={2}>
                favourite outfit.
              </RoughHighlight>
            </h2>
          </div>
          <p className="md:col-span-5 text-base text-doodle-ink/70 leading-relaxed">
            {/* [PLACEHOLDER] supporting copy */}
            No app, no subscription, no learning curve. Patches are tactile.
            Press, peel, swap.
          </p>
        </div>

        <ol className="mt-14 grid gap-6 md:grid-cols-3 relative">
          {/* Connector arrows on desktop */}
          <div
            aria-hidden
            className="hidden md:block absolute top-[140px] left-[33%] right-[33%] h-1 border-t-[3px] border-dashed border-doodle-ink/20"
          />

          {STEPS.map((step, i) => (
            <Step key={step.label} step={step} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Step({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  const ref = React.useRef<HTMLLIElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const t = TILE[step.color];

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 24,
        delay: index * 0.12,
      }}
      className="relative flex flex-col items-center text-center"
    >
      {/* Big number outline — magnetic to cursor for tactile playfulness */}
      <MagneticHover strength={0.18}>
        <div
          aria-hidden
          className={`
            relative grid place-items-center h-44 w-44 rounded-full
            bg-doodle-canvas border-[3px] border-dashed ${t.ring}
          `}
        >
          <step.Icon weight="duotone" size={64} style={{ color: t.hex }} />

          <span
            className={`
              absolute -top-3 -right-2 ${t.chip} text-doodle-stitch
              rounded-full h-9 w-9 grid place-items-center
              font-mono text-xs border-2 border-dashed border-doodle-stitch
            `}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </MagneticHover>

      <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-doodle-ink/55">
        {step.label}
      </div>
      <h3 className="mt-2 font-display text-2xl text-doodle-ink leading-tight tracking-[-0.01em]">
        {step.title}
      </h3>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-doodle-ink/70">
        {step.body}
      </p>

      {index < STEPS.length - 1 && (
        <ArrowRight
          weight="bold"
          size={18}
          aria-hidden
          className="md:hidden mt-6 text-doodle-ink/40"
        />
      )}
    </motion.li>
  );
}
