"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import {
  Storefront,
  ArrowRight,
  Sparkle,
  PaperPlaneTilt,
} from "@phosphor-icons/react/dist/ssr";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { MagneticHover } from "@/components/motion";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function DualCTA() {
  return (
    <section
      id="dual-cta"
      className="relative border-b-2 border-dashed border-doodle-ink/15 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <ConsumerCard />
          <StockistCard />
        </div>
      </div>
    </section>
  );
}

function ConsumerCard() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <MagneticHover strength={0.05}>
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className="
        relative isolate overflow-hidden rounded-[1rem] bg-doodle-blue
        p-8 sm:p-10 lg:p-12 stitch-thick
        flex flex-col gap-7 min-h-[460px]
      "
    >
      <DecorScene tone="blue" />

      <div className="relative z-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-doodle-stitch/15 px-3 py-1 text-doodle-stitch">
          <Sparkle weight="fill" size={10} />
          <Eyebrow variant="mono" tone="stitch">Be first</Eyebrow>
        </span>
      </div>

      <div className="relative z-10">
        <h2 className="font-display text-[clamp(1.85rem,3.5vw,2.85rem)] leading-[1.0] tracking-[-0.02em] text-doodle-stitch">
          First drop alerts.{" "}
          <span className="italic block opacity-90">
            One email, when it&rsquo;s ready.
          </span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-doodle-stitch/85 max-w-md">
          {/* [PLACEHOLDER] supporting copy */}
          We&rsquo;ll write once: when the first 200 base tees ship and the
          first patch library is live. No drip campaign. No noise.
        </p>
      </div>

      <div className="relative z-10 mt-auto">
        <WaitlistForm accent="orange" surface="tile" />
      </div>
    </motion.div>
    </MagneticHover>
  );
}

function StockistCard() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <MagneticHover strength={0.05}>
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.08 }}
      className="
        relative isolate overflow-hidden rounded-[1rem] bg-doodle-purple
        p-8 sm:p-10 lg:p-12 stitch-thick
        flex flex-col gap-7 min-h-[460px]
      "
    >
      <DecorScene tone="purple" />

      <div className="relative z-10 flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-doodle-stitch/15 px-3 py-1 text-doodle-stitch">
          <Storefront weight="fill" size={10} />
          <Eyebrow variant="mono" tone="stitch">For stockists</Eyebrow>
        </span>
        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-doodle-stitch/65">
          B2B inquiry
        </span>
      </div>

      <div className="relative z-10">
        <h2 className="font-display text-[clamp(1.85rem,3.5vw,2.85rem)] leading-[1.0] tracking-[-0.02em] text-doodle-stitch">
          Stock DOODLE in your store.{" "}
          <span className="italic block opacity-90">
            We&rsquo;ll bring the patches.
          </span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-doodle-stitch/85 max-w-md">
          {/* [PLACEHOLDER] supporting copy */}
          Looking for boutique kids&rsquo; stores, design schools and
          play-cafes across India. Wholesale terms, sample kits, and
          consignment options available.
        </p>
      </div>

      <div className="relative z-10 mt-auto flex flex-wrap items-center gap-3">
        <a
          href="mailto:hello@example.in?subject=DOODLE%20stockist%20inquiry&body=Tell%20us%20about%20your%20store%20%E2%80%94%20name%2C%20city%2C%20website%2C%20what%20you%20stock%20today."
          className="
            inline-flex items-center gap-3 h-12 px-6 rounded-full
            bg-doodle-stitch text-doodle-purple font-medium text-sm
            border-2 border-dashed border-doodle-stitch
            hover:scale-[1.02] active:scale-[0.97] transition-transform
            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-stitch/40
          "
        >
          <PaperPlaneTilt weight="duotone" size={18} />
          <span>Send a stockist note</span>
          <ArrowRight weight="bold" size={14} />
        </a>
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-doodle-stitch/65">
          [hello@example.in &mdash; replace]
        </span>
      </div>
    </motion.div>
    </MagneticHover>
  );
}

function DecorScene({ tone }: { tone: "blue" | "purple" }) {
  const accent = tone === "blue" ? "var(--color-doodle-yellow)" : "var(--color-doodle-pink)";
  return (
    <>
      {/* Big circle */}
      <div
        aria-hidden
        className="absolute -top-12 -right-12 h-44 w-44 rounded-full border-[3px] border-dashed border-doodle-stitch/40"
      />
      {/* Squiggle */}
      <svg
        aria-hidden
        className="absolute right-6 bottom-6 w-32 h-12 opacity-50"
        viewBox="0 0 120 40"
      >
        <path
          d="M 5 25 Q 20 5, 35 25 T 65 25 T 95 25 T 120 25"
          fill="none"
          stroke={accent}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {/* Small dots */}
      <div className="absolute top-10 right-12 h-3 w-3 rounded-full bg-doodle-stitch/45" aria-hidden />
      <div className="absolute top-20 right-32 h-2 w-2 rounded-full bg-doodle-stitch/60" aria-hidden />
    </>
  );
}
