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
import { whyDoodle as content } from "@/content/home";

/* ============================================================
   WHY DOODLE v2 — "premium, but for kids" (Dialog discipline)

   - Orange full-bleed kept as INTENTIONAL surface banding.
   - All dashed borders purged; mono placeholder line removed.
   - Decorative scene rebuilt from clean soft-shadow brand-colour
     blocks (no dashed outlines) — reads as composed depth.
   - Accordion sits on one soft card; triggers use soft tiles, not
     dashed circles; 16px radius cap respected.
   ============================================================ */

// Icons are structural (not copy); title/body come from content.items
const ITEM_ICONS = [Ruler, Recycle, Plant, HandHeart] as const;

const ITEMS = content.items.map((item, i) => ({
  Icon: ITEM_ICONS[i],
  title: item.title,
  body: item.body,
}));

export function WhyDoodle() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section
      id="why"
      className="relative py-24 md:py-32 bg-doodle-orange overflow-hidden"
    >
      {/* Subtle radial wash for depth */}
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
            {content.eyebrow}
          </Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] tracking-[-0.02em] text-doodle-stitch">
            {content.headlineLead}{" "}
            <span className="italic block opacity-90">
              {content.headlineEmphasis}
            </span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-doodle-stitch/85">
            {content.body}
          </p>

          {/* Decorative scene — clean soft-shadow brand-colour blocks (no dashed).
              Each layer parallaxes at a different speed for depth on scroll. */}
          <div className="relative mt-10 h-72 w-full max-w-md">
            {/* Big yellow block — slowest, deepest */}
            <ParallaxLayer
              speed={0.15}
              className="absolute left-4 top-6 h-44 w-44 rounded-[1.25rem] bg-doodle-yellow shadow-card"
            >
              <span className="sr-only">decorative</span>
            </ParallaxLayer>
            {/* Blue tile — middle layer */}
            <ParallaxLayer
              speed={0.3}
              className="absolute right-2 top-2 grid h-28 w-28 place-items-center rounded-[1.25rem] bg-doodle-blue shadow-card"
            >
              <Recycle weight="duotone" size={42} className="text-doodle-stitch" />
            </ParallaxLayer>
            {/* Pink tile — closest, fastest */}
            <ParallaxLayer
              speed={0.45}
              className="absolute left-12 bottom-4 grid h-32 w-44 place-items-center rounded-[1.25rem] bg-doodle-pink shadow-card-hover"
            >
              <Plant weight="duotone" size={48} className="text-doodle-stitch" />
            </ParallaxLayer>
            {/* Sparkle dot */}
            <div className="absolute right-32 top-20 h-3.5 w-3.5 rounded-full bg-doodle-stitch shadow-subtle" />
          </div>
        </div>

        {/* Right accordion — one soft card on cream, hairline dividers */}
        <div className="lg:col-span-7">
          <ul className="rounded-[1.25rem] bg-doodle-canvas p-3 shadow-card-hover divide-y divide-doodle-ink/10 sm:p-4">
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
                        transition-colors
                        ${
                          isOpen
                            ? "bg-doodle-orange text-doodle-ink shadow-subtle"
                            : "bg-doodle-ink/[0.06] text-doodle-ink"
                        }
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
                      className="grid place-items-center h-9 w-9 rounded-full bg-doodle-ink/[0.06] text-doodle-ink shrink-0"
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
        </div>
      </div>
    </section>
  );
}
