"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { ArrowsLeftRight, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { MagneticHover } from "@/components/motion";
import { RoughHighlight } from "@/components/ui/Rough";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PatchShape, type PatchKey } from "@/components/ui/PatchShape";
import { theRealThing as content } from "@/content/home";

// The constant: the SAME eight patches that ride both bases. Rendered as a
// shared "patch set" rail so the headline ("same eight patches, different
// base") has a literal visual anchor between the two photos.
const PATCH_SET: readonly PatchKey[] = [
  "star",
  "lightning",
  "heart",
  "rocket",
  "moon",
  "sun",
  "smile",
  "flower",
];

// Structural data (image paths + tilt) — labels/chips come from content.shots
const SHOTS = [
  {
    src: "/product/tee-white.jpeg",
    alt: "DOODLE base tee in cream, with eight silicone patches arranged across the chest",
    label: content.shots[0].label,
    chip: content.shots[0].chip,
    tilt: -1,
    blockColor: "bg-doodle-yellow/30",
  },
  {
    src: "/product/tee-blue.jpeg",
    alt: "Same DOODLE base tee in sky blue, with the same eight patches in the same chest row",
    label: content.shots[1].label,
    chip: content.shots[1].chip,
    tilt: 1.2,
    blockColor: "bg-doodle-blue/15",
  },
] as const;

export function TheRealThing() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="real"
      className="relative isolate overflow-hidden bg-surface-blush py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {/* Header — clean sans eyebrow, display headline, one orange emphasis */}
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Eyebrow variant="rule" accent="orange">
              {content.eyebrow}
            </Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              {content.headlineLead}{" "}
              <span className="italic text-doodle-orange">{content.headlineEmphasis}</span>{" "}
              <RoughHighlight on="view" strokeWidth={18} padding={2}>
                {content.headlineHighlight}
              </RoughHighlight>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-doodle-ink/70">
              {content.body}
            </p>
          </div>

          <div className="md:col-span-4 md:text-right">
            <span className="inline-flex items-center gap-2 rounded-full bg-doodle-stitch px-3.5 py-2 text-xs font-medium text-doodle-ink/75 shadow-subtle">
              <ArrowsLeftRight weight="bold" size={14} className="text-doodle-orange" />
              {content.swapVisualised}
            </span>
          </div>
        </div>

        {/* The constant — the same eight silicone patches that ride BOTH bases.
            A shared rail under the header gives the headline a literal anchor
            and fills the space above the photos. Soft cream card, no dashed. */}
        <div className="mt-10 flex flex-col gap-4 rounded-[1rem] bg-doodle-stitch px-5 py-5 shadow-card sm:flex-row sm:items-center sm:gap-6 sm:px-7">
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-doodle-orange/12 px-3 py-1.5 text-xs font-semibold text-doodle-orange">
            <Sparkle weight="fill" size={12} />
            The eight, unchanged
          </span>
          <div className="flex flex-1 flex-wrap items-center justify-center gap-1 sm:justify-between">
            {PATCH_SET.map((p) => (
              <span
                key={p}
                className="inline-grid h-12 w-12 place-items-center rounded-full bg-doodle-canvas shadow-subtle transition-transform hover:-translate-y-0.5"
              >
                <PatchShape patch={p} size={34} />
              </span>
            ))}
          </div>
        </div>

        {/* Photo pair — soft card shadow, quiet brand color-block behind each */}
        <div ref={ref} className="relative mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
          {SHOTS.map((shot, i) => (
            <MagneticHover key={shot.src} strength={0.06}>
              <motion.figure
                initial={{ opacity: 0, y: 28, rotate: 0 }}
                animate={inView ? { opacity: 1, y: 0, rotate: shot.tilt } : undefined}
                whileHover={{ y: -6, rotate: 0, scale: 1.01 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 22,
                  delay: i * 0.12,
                }}
                className="relative"
              >
                {/* Quiet brand color-block behind the card (capped 16px, no dashed) */}
                <div
                  aria-hidden
                  className={`absolute ${
                    i === 0 ? "-left-4 -top-4" : "-right-4 -top-4"
                  } h-24 w-24 rounded-[1rem] ${shot.blockColor}`}
                />

                {/* Photo card — soft card shadow replaces dashed stitch border */}
                <div className="relative overflow-hidden rounded-[1rem] bg-doodle-stitch p-4 shadow-card transition-shadow sm:p-5">
                  <div className="relative aspect-square w-full overflow-hidden rounded-[0.75rem] bg-doodle-canvas">
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes="(min-width: 1024px) 40vw, (min-width: 768px) 45vw, 90vw"
                      className="object-contain mix-blend-multiply"
                      priority={i === 0}
                    />
                  </div>

                  {/* Caption strip — display label + clean sans chip (no dashed) */}
                  <figcaption className="mt-3 flex items-center justify-between px-1 pb-1">
                    <span className="font-display text-lg leading-tight text-doodle-ink">
                      {shot.label}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-doodle-canvas px-2.5 py-1 text-xs font-medium text-doodle-ink/65">
                      {shot.chip}
                    </span>
                  </figcaption>
                </div>

                {/* Floating chip — one orange accent, soft shadow, no dashed */}
                <span
                  className={`absolute -top-3 ${
                    i === 0 ? "-left-3" : "-right-3"
                  } inline-flex rotate-[-4deg] items-center gap-1.5 rounded-full bg-doodle-orange px-3 py-1.5 text-xs font-semibold text-doodle-stitch shadow-card`}
                >
                  <Sparkle weight="fill" size={11} className="text-doodle-yellow" />
                  {content.realProduct}
                </span>
              </motion.figure>
            </MagneticHover>
          ))}
        </div>

        {/* Caption */}
        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-doodle-ink/60">
          {content.caption}
        </p>
      </div>
    </section>
  );
}
