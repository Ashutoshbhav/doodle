"use client";

import * as React from "react";
import Image from "next/image";
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
import { PATCHES, PATCH_COUNT, patchByKey } from "@/lib/patches";
import { howItWorks as content } from "@/content/home";

// Icons are structural (not copy); label/title/body come from content.steps
const STEP_ICONS = [TShirt, Stack, Sparkle] as const;

// One signature patch per step — a REAL charm from the catalogue, so
// everything on the page that looks like a patch is a patch you can buy.
const STEP_PATCH = [patchByKey("star"), patchByKey("rainbow"), patchByKey("crown")];

const STEPS = content.steps.map((s, i) => ({
  Icon: STEP_ICONS[i],
  color: s.color,
  label: s.label,
  title: s.title,
  body: s.body,
}));

// Tinted soft tiles (no dashed rings). Icon takes the colour; the tile is a
// quiet tint of it; the step number sits on a soft colour chip.
const TILE = {
  blue: { tile: "bg-doodle-blue/10", icon: "text-doodle-blue", chip: "bg-doodle-blue" },
  yellow: { tile: "bg-doodle-yellow/15", icon: "text-doodle-yellow", chip: "bg-doodle-yellow" },
  pink: { tile: "bg-doodle-pink/12", icon: "text-doodle-pink", chip: "bg-doodle-pink" },
} as const;

export function HowItWorks() {
  return (
    <section
      id="how"
      className="relative overflow-hidden py-20 md:py-24 bg-doodle-canvas"
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
            {content.body}
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3 relative">
          {/* Connector — a calm solid hairline, not a dashed rule */}
          <div
            aria-hidden
            className="hidden md:block absolute top-[88px] left-[33%] right-[33%] h-px bg-doodle-ink/12"
          />

          {STEPS.map((step, i) => (
            <Step key={step.label} step={step} index={i} />
          ))}
        </ol>

        {/* Closing patch line — real catalogue charms, and the count comes
            from the registry so it can never drift from reality. */}
        <div className="mt-14 flex flex-col items-center gap-5 rounded-[1rem] bg-doodle-stitch px-6 py-7 shadow-card sm:flex-row sm:justify-between sm:gap-8 sm:px-9">
          <div className="flex shrink-0 items-center">
            {PATCHES.slice(0, 6).map((p, i) => (
              <span
                key={p.key}
                className="-ml-3 inline-grid h-12 w-12 place-items-center rounded-full bg-doodle-canvas p-1.5 shadow-subtle ring-2 ring-doodle-stitch first:ml-0"
                style={{ zIndex: 10 - i }}
              >
                <Image src={p.src} alt={p.name} width={38} height={38} className="h-full w-full object-contain" />
              </span>
            ))}
          </div>
          <p className="text-center font-display text-lg leading-snug text-doodle-ink sm:text-right">
            Snap on any patch from the library.{" "}
            <span className="italic text-doodle-orange">{PATCH_COUNT} and growing.</span>
          </p>
        </div>
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
  const patch = STEP_PATCH[index];

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
      {/* Soft tinted tile — magnetic to cursor for tactile playfulness.
          Replaces the dashed-ring circle: borderless, soft-shadow, ≤16px. */}
      <MagneticHover strength={0.16}>
        <div
          aria-hidden
          className={`
            relative grid h-40 w-40 place-items-center rounded-[1rem]
            ${t.tile} shadow-card
          `}
        >
          <step.Icon weight="duotone" size={52} className={t.icon} />

          {/* Signature patch peeking off the tile — a real catalogue charm */}
          <span className="absolute -bottom-3 left-1/2 inline-grid h-14 w-14 -translate-x-1/2 rotate-[-6deg] place-items-center rounded-full bg-doodle-stitch p-2 shadow-card ring-2 ring-doodle-canvas">
            <Image src={patch.src} alt={patch.name} width={44} height={44} className="h-full w-full object-contain" />
          </span>

          {/* Step number — solid colour chip, clean sans, no dashed border */}
          <span
            className={`
              absolute -right-2 -top-2 grid h-9 w-9 place-items-center
              rounded-full ${t.chip} text-sm font-semibold text-doodle-stitch
              shadow-subtle ring-4 ring-doodle-canvas
            `}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </MagneticHover>

      <Eyebrow variant="rule" accent="ink" className="mt-10">
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
