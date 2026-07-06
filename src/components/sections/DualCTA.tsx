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
import { PatchShape, type PatchKey } from "@/components/ui/PatchShape";
import { DoodleMark } from "@/components/ui/DoodleMark";
import { dualCTA as content } from "@/content/home";

export function DualCTA() {
  return (
    <section
      id="join"
      className="relative border-b border-doodle-ink/10 py-16 md:py-24"
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
        relative isolate overflow-hidden rounded-[1.25rem] bg-doodle-blue
        p-8 sm:p-10 lg:p-12 shadow-card
        flex flex-col gap-7 min-h-[460px]
      "
    >
      <DecorScene tone="blue" />

      <div className="relative z-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-doodle-ink/8 px-3 py-1 text-doodle-ink">
          <Sparkle weight="fill" size={10} />
          <Eyebrow variant="rule">{content.consumer.badge}</Eyebrow>
        </span>
      </div>

      <div className="relative z-10">
        <h2 className="font-display text-[clamp(1.85rem,3.5vw,2.85rem)] leading-[1.0] tracking-[-0.02em] text-doodle-ink">
          {content.consumer.headlineLead}{" "}
          <span className="italic block opacity-90">
            {content.consumer.headlineEmphasis}
          </span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-doodle-ink/85 max-w-md">
          {content.consumer.body}
        </p>
      </div>

      {/* Patch cluster fills the gap between copy and the form */}
      <PatchCluster patches={["rocket", "heart", "star", "lightning"]} />

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
        relative isolate overflow-hidden rounded-[1.25rem] bg-doodle-purple
        p-8 sm:p-10 lg:p-12 shadow-card
        flex flex-col gap-7 min-h-[460px]
      "
    >
      <DecorScene tone="purple" />

      <div className="relative z-10 flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-doodle-ink/8 px-3 py-1 text-doodle-ink">
          <Storefront weight="fill" size={10} />
          <Eyebrow variant="rule">{content.stockist.badge}</Eyebrow>
        </span>
        <span className="text-[11px] font-medium text-doodle-ink/65">
          {content.stockist.badgeNote}
        </span>
      </div>

      <div className="relative z-10">
        <h2 className="font-display text-[clamp(1.85rem,3.5vw,2.85rem)] leading-[1.0] tracking-[-0.02em] text-doodle-ink">
          {content.stockist.headlineLead}{" "}
          <span className="italic block opacity-90">
            {content.stockist.headlineEmphasis}
          </span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-doodle-ink/85 max-w-md">
          {content.stockist.body}
        </p>
      </div>

      {/* Patch cluster fills the gap between copy and the CTA row */}
      <PatchCluster patches={["diamond", "flower", "moon", "burst"]} />

      <div className="relative z-10 mt-auto flex flex-wrap items-center gap-3">
        <a
          href="mailto:hello@doodlebycanvas.in?subject=DOODLE%20stockist%20inquiry&body=Tell%20us%20about%20your%20store%20%E2%80%94%20name%2C%20city%2C%20website%2C%20what%20you%20stock%20today."
          className="
            inline-flex items-center gap-3 h-12 px-6 rounded-full
            bg-doodle-stitch text-doodle-ink font-medium text-sm
            shadow-card hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.97]
            transition-[box-shadow,transform] duration-200
            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-ink/30
          "
        >
          <PaperPlaneTilt weight="duotone" size={18} />
          <span>{content.stockist.ctaLabel}</span>
          <ArrowRight weight="bold" size={14} />
        </a>
        <span className="text-xs font-medium text-doodle-ink/65">
          {content.stockist.emailNote}
        </span>
      </div>
    </motion.div>
    </MagneticHover>
  );
}

/* A row of real silicone-charm patches on a soft white tray —
   fills the previously-empty mid-card space with on-brand product. */
function PatchCluster({ patches }: { patches: PatchKey[] }) {
  return (
    <div className="relative z-10 flex w-fit items-center gap-1 rounded-full bg-doodle-ink/8 px-3 py-2 backdrop-blur-sm">
      {patches.map((key, i) => (
        <span
          key={key}
          className="-ml-2 inline-block first:ml-0 drop-shadow-[0_3px_6px_rgba(26,26,26,0.18)]"
          style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (4 + i)}deg)` }}
        >
          <PatchShape patch={key} size={40} />
        </span>
      ))}
    </div>
  );
}

function DecorScene({ tone }: { tone: "blue" | "purple" }) {
  return (
    <>
      {/* Big circle */}
      <div
        aria-hidden
        className="absolute -top-12 -right-12 h-44 w-44 rounded-full border-2 border-doodle-ink/15"
      />
      {/* Real rough.js doodles instead of the old flat SVG squiggle —
          they sketch themselves in when the card scrolls into view */}
      <DoodleMark
        kind="squiggle"
        sway
        className="absolute bottom-6 right-6 w-28 text-doodle-ink/30"
      />
      <DoodleMark
        kind="star"
        sway
        className={`absolute right-14 top-9 w-10 -rotate-12 ${
          tone === "blue" ? "text-doodle-yellow" : "text-doodle-pink"
        }`}
      />
    </>
  );
}
