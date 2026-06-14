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
import { Eyebrow } from "@/components/ui/Eyebrow";
import { howItWorks as content } from "@/content/home";

// Icons are structural (not copy); label/title/body come from content.steps
const STEP_ICONS = [TShirt, Stack, Sparkle] as const;

const STEPS = content.steps.map((s, i) => ({
  Icon: STEP_ICONS[i],
  color: s.color,
  label: s.label,
  title: s.title,
  body: s.body,
}));

const TILE = {
  blue: { ring: "border-doodle-blue", chip: "bg-doodle-blue", icon: "text-doodle-blue" },
  yellow: { ring: "border-doodle-yellow", chip: "bg-doodle-yellow", icon: "text-doodle-yellow" },
  pink: { ring: "border-doodle-pink", chip: "bg-doodle-pink", icon: "text-doodle-pink" },
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
            <Eyebrow variant="rule" accent="blue">
              {content.eyebrow}
            </Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              {content.headlineLead}{" "}
              <span className="italic text-doodle-orange">{content.headlineEmphasis}</span>{" "}
              {content.headlineAnd}{" "}
              <RoughHighlight on="view" strokeWidth={18} padding={2}>
                {content.headlineHighlight}
              </RoughHighlight>
            </h2>
          </div>
          <p className="md:col-span-5 text-base text-doodle-ink/70 leading-relaxed">
            {/* [PLACEHOLDER] supporting copy */}
            {content.body}
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
          <step.Icon weight="duotone" size={64} className={t.icon} />

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

      <Eyebrow variant="mono" className="mt-6">
        {step.label}
      </Eyebrow>
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
