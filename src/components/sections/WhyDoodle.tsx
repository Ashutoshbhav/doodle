"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Ruler,
  Recycle,
  Plant,
  HandHeart,
} from "@phosphor-icons/react/dist/ssr";
import { ParallaxLayer } from "@/components/motion";
import { Eyebrow } from "@/components/ui/Eyebrow";

const ITEMS = [
  {
    Icon: Ruler,
    title: "Inclusive sizing for every kid",
    body:
      "Bases come in 2T to 12, with side-stretch panels that add real cm — not just a different label on the same body.",
  },
  {
    Icon: Recycle,
    title: "Modular means less landfill",
    body:
      "Every patch is replaceable, every base is mendable, every component is its own SKU. We built the whole thing so a worn-out elbow doesn't become a worn-out outfit.",
  },
  {
    Icon: Plant,
    title: "Grows with the kid",
    body:
      "Sleeve-extender patches and hem-drop sections add 4–6 cm of usable life to the same base tee. One DOODLE piece outlives three fast-fashion ones.",
  },
  {
    Icon: HandHeart,
    title: "Made in India, with the people who make it",
    body:
      "Cut, sewn and finished in a Bengaluru workshop that pays living wages and shares its production calendar publicly.",
  },
] as const;

export function WhyDoodle() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section
      id="why"
      className="relative border-b-2 border-dashed border-doodle-stitch/0 py-24 md:py-32 bg-doodle-orange overflow-hidden"
    >
      {/* Subtle radial wash + scribble */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(50% 50% at 20% 20%, rgba(255,255,255,0.4), transparent 60%), radial-gradient(50% 50% at 90% 80%, rgba(0,0,0,0.15), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10 grid gap-12 lg:grid-cols-12 lg:gap-14">
        {/* Left scene */}
        <div className="lg:col-span-5">
          <Eyebrow variant="rule" tone="stitch">
            Why DOODLE
          </Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-doodle-stitch">
            Built different.{" "}
            <span className="italic block opacity-90">
              On purpose.
            </span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-doodle-stitch/85">
            {/* [PLACEHOLDER] supporting copy */}
            Four answers to the question every parent asks before they
            buy something new for their kid.
          </p>

          {/* Decorative scene — placeholder illustrated composition. Each layer
              parallaxes at a different speed for depth as you scroll. */}
          <div className="relative mt-10 h-72 w-full max-w-md">
            {/* Big yellow blob — slowest, deepest */}
            <ParallaxLayer speed={0.15} className="absolute left-4 top-6 h-44 w-44 rounded-[42%] bg-doodle-yellow border-[3px] border-dashed border-doodle-stitch" >
              <span className="sr-only">decorative</span>
            </ParallaxLayer>
            {/* Blue circle — middle layer */}
            <ParallaxLayer speed={0.3} className="absolute right-2 top-2 h-28 w-28 rounded-full bg-doodle-blue border-[3px] border-dashed border-doodle-stitch grid place-items-center">
              <Recycle weight="duotone" size={42} className="text-doodle-stitch" />
            </ParallaxLayer>
            {/* Pink rectangle — closest, fastest */}
            <ParallaxLayer speed={0.45} className="absolute left-12 bottom-4 h-32 w-44 rounded-[1rem] bg-doodle-pink border-[3px] border-dashed border-doodle-stitch grid place-items-center">
              <Plant weight="duotone" size={48} className="text-doodle-stitch" />
            </ParallaxLayer>
            {/* Squiggle */}
            <svg
              aria-hidden
              className="absolute right-0 bottom-12 w-32 h-12"
              viewBox="0 0 120 40"
            >
              <path
                d="M 5 25 Q 20 5, 35 25 T 65 25 T 95 25 T 120 25"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            {/* Sparkle dot */}
            <div className="absolute right-32 top-20 h-4 w-4 rounded-full bg-doodle-stitch" />
          </div>
        </div>

        {/* Right accordion */}
        <div className="lg:col-span-7">
          <ul className="rounded-[1rem] bg-doodle-canvas p-3 sm:p-4 stitch-thick !border-doodle-stitch divide-y-2 divide-dashed divide-doodle-ink/15">
            {ITEMS.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.title} className="px-2 sm:px-3">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`why-${i}`}
                    className="
                      flex w-full items-center gap-4 py-5 text-left
                      group focus-visible:outline-none
                      transition-transform duration-100 active:scale-[0.97]
                    "
                  >
                    <span
                      className={`
                        grid place-items-center h-11 w-11 rounded-full shrink-0
                        ${isOpen ? "bg-doodle-orange text-doodle-stitch" : "bg-doodle-canvas text-doodle-ink border-2 border-dashed border-doodle-ink/40"}
                        transition-colors
                      `}
                    >
                      <item.Icon weight="duotone" size={22} />
                    </span>

                    <span className="flex-1 font-display text-lg sm:text-xl text-doodle-ink leading-tight">
                      {item.title}
                    </span>

                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ type: "spring", stiffness: 320, damping: 22 }}
                      className="grid place-items-center h-9 w-9 rounded-full border-2 border-dashed border-doodle-ink/40 text-doodle-ink shrink-0"
                    >
                      <Plus weight="bold" size={16} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`why-${i}`}
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { type: "spring", stiffness: 200, damping: 26 },
                          opacity: { duration: 0.2 },
                        }}
                        className="overflow-hidden"
                      >
                        <p className="pl-[3.75rem] pr-3 pb-6 -mt-1 text-sm leading-relaxed text-doodle-ink/80">
                          {item.body}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 px-2 text-xs font-mono uppercase tracking-[0.18em] text-doodle-stitch/60">
            [placeholder copy &mdash; rewrite in your voice]
          </p>
        </div>
      </div>
    </section>
  );
}
