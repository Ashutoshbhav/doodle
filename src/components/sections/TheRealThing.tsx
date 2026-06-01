"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { ArrowsLeftRight, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { MagneticHover } from "@/components/motion";
import { RoughHighlight } from "@/components/ui/Rough";

const SHOTS = [
  {
    src: "/product/tee-white.jpeg",
    alt: "DOODLE base tee in cream, with eight silicone patches arranged across the chest",
    label: "Cream base",
    chip: "Look 01",
    tilt: -1.2,
  },
  {
    src: "/product/tee-blue.jpeg",
    alt: "Same DOODLE base tee in sky blue, with the same eight patches in the same chest row",
    label: "Sky base",
    chip: "Look 02",
    tilt: 1.4,
  },
] as const;

export function TheRealThing() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="real"
      className="relative isolate overflow-hidden border-b-2 border-dashed border-doodle-ink/15 py-24 md:py-32 bg-doodle-canvas"
    >
      {/* Background wash — locked DOODLE hexes (orange #e8650a / blue #1a56c4),
          kept at low alpha as ambient surface depth, not competing chrome. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(45% 35% at 18% 20%, rgba(232,101,10,0.10), transparent 70%), radial-gradient(40% 35% at 90% 75%, rgba(26,86,196,0.08), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Header */}
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-doodle-stitch px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.22em] text-doodle-ink stitch-ink">
              <Sparkle weight="fill" size={10} className="text-doodle-orange" />
              Yes — it&rsquo;s a real thing
            </span>
            <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              Same eight patches.{" "}
              <span className="italic text-doodle-orange">Different</span>{" "}
              <RoughHighlight on="view" strokeWidth={18} padding={2}>
                base.
              </RoughHighlight>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-doodle-ink/70">
              The base is the canvas. Patches do the talking. Press, peel,
              rearrange — same eight pieces, two completely different
              outfits in seconds.
            </p>
          </div>

          <div className="md:col-span-4 md:text-right">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-doodle-ink/60">
              <ArrowsLeftRight weight="bold" size={14} />
              Swap visualised
            </span>
          </div>
        </div>

        {/* Photo pair */}
        <div
          ref={ref}
          className="relative mt-14 grid gap-8 md:grid-cols-2 md:gap-10"
        >
          {SHOTS.map((shot, i) => (
            <MagneticHover key={shot.src} strength={0.08}>
            <motion.figure
              initial={{ opacity: 0, y: 28, rotate: 0 }}
              animate={
                inView
                  ? { opacity: 1, y: 0, rotate: shot.tilt }
                  : undefined
              }
              whileHover={{ y: -6, rotate: 0, scale: 1.015 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 22,
                delay: i * 0.12,
              }}
              className="relative"
            >
              {/* Photo card (radius capped at 16px per DESIGN.md) */}
              <div
                className="
                  relative overflow-hidden rounded-[1rem] bg-doodle-stitch
                  stitch-thick !border-doodle-ink p-3 sm:p-4
                "
              >
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

                {/* Caption strip */}
                <figcaption className="mt-3 flex items-center justify-between px-2 pb-1">
                  <span className="font-display text-lg text-doodle-ink leading-tight">
                    {shot.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-doodle-canvas px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-doodle-ink/65 border-2 border-dashed border-doodle-ink/25">
                    {shot.chip}
                  </span>
                </figcaption>
              </div>

              {/* Floating chip */}
              <span
                className={`
                  absolute -top-3 ${i === 0 ? "-left-3" : "-right-3"}
                  inline-flex items-center gap-1.5 rounded-full
                  bg-doodle-orange text-doodle-stitch
                  px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.22em]
                  border-2 border-dashed border-doodle-stitch
                  rotate-[-4deg]
                `}
              >
                <Sparkle weight="fill" size={10} />
                Real product
              </span>
            </motion.figure>
            </MagneticHover>
          ))}
        </div>

        {/* Caption strip */}
        <p className="mt-10 text-center text-sm text-doodle-ink/65 max-w-xl mx-auto">
          Photos: prototype DOODLE base tees with the first patch set —
          arrangement, attachment system and silicone finish exactly as
          they ship.
        </p>
      </div>
    </section>
  );
}
