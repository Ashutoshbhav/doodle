"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import {
  MapPin,
  CalendarBlank,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import { MagneticHover } from "@/components/motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PatchShape, type PatchKey } from "@/components/ui/PatchShape";
import { findUsOffline as content } from "@/content/home";

const POPUPS = content.popups;

// One on-brand patch charm per pop-up card — fills the mid-card space.
const POPUP_PATCH: PatchKey[] = ["sun", "star", "heart"];

const SURFACE = {
  orange: {
    bg: "bg-doodle-orange",
    text: "text-doodle-stitch",
    chip: "bg-doodle-stitch/15 text-doodle-stitch",
  },
  blue: {
    bg: "bg-doodle-blue",
    text: "text-doodle-stitch",
    chip: "bg-doodle-stitch/15 text-doodle-stitch",
  },
  pink: {
    bg: "bg-doodle-pink",
    text: "text-doodle-stitch",
    chip: "bg-doodle-stitch/15 text-doodle-stitch",
  },
} as const;

export function FindUsOffline() {
  return (
    <section
      id="offline"
      className="relative border-b border-doodle-ink/10 py-16 md:py-24 bg-[color:var(--color-surface-parchment)]"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Eyebrow variant="rule" accent="orange">
              {content.eyebrow}
            </Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              {content.headlineLead}{" "}
              <span className="italic text-doodle-orange">{content.headlineEmphasis}</span>{" "}
              {content.headlineEnd}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-doodle-ink/70">
              {content.body}
            </p>
          </div>

          <div className="md:col-span-4 md:text-right">
            <a
              href="#dual-cta"
              className="inline-flex items-center gap-2 rounded-full bg-doodle-stitch px-4 py-2 text-xs font-semibold text-doodle-ink shadow-subtle transition-shadow hover:shadow-card"
            >
              {content.alertsCta}
              <ArrowUpRight weight="bold" size={12} />
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {POPUPS.map((p, i) => (
            <PopupCard key={p.city + i} popup={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PopupCard({
  popup,
  index,
}: {
  popup: (typeof POPUPS)[number];
  index: number;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const s = SURFACE[popup.color];

  return (
    <MagneticHover strength={0.07}>
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      whileHover={{ y: -6, rotate: index % 2 === 0 ? -1 : 1 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 24,
        delay: index * 0.1,
      }}
      className={`
        relative ${s.bg} rounded-[1rem] p-7 sm:p-8 shadow-card
        flex flex-col gap-5 min-h-[280px]
      `}
    >
      {/* Decorative pin pattern */}
      <DecorativePins />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div
          className={`grid place-items-center h-12 w-12 rounded-full ${s.chip} backdrop-blur-sm`}
        >
          <MapPin weight="duotone" size={24} />
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] ${s.chip}`}
        >
          {popup.badge}
        </span>
      </div>

      <div className="relative z-10 flex items-end justify-between gap-3">
        <div>
          <h3
            className={`font-display text-3xl ${s.text} leading-[0.95] tracking-[-0.01em]`}
          >
            {popup.city}
          </h3>
          <div
            className={`mt-2 text-[13px] font-medium ${s.text}/85`}
          >
            {popup.venue}
          </div>
        </div>
        {/* Patch charm — fills the empty mid-card area with product */}
        <span
          className="shrink-0 drop-shadow-[0_3px_6px_rgba(26,26,26,0.18)]"
          style={{ transform: `rotate(${index % 2 === 0 ? -7 : 7}deg)` }}
          aria-hidden
        >
          <PatchShape patch={POPUP_PATCH[index % POPUP_PATCH.length]} size={52} />
        </span>
      </div>

      <div
        className={`relative z-10 mt-auto flex items-center gap-4 rounded-full ${s.chip} px-4 py-3`}
      >
        <CalendarBlank weight="duotone" size={20} />
        <div className="text-sm">
          <div className={`font-medium ${s.text}`}>{popup.date}</div>
          <div className={`text-[11px] font-medium ${s.text}/85`}>
            {popup.window}
          </div>
        </div>
      </div>
    </motion.article>
    </MagneticHover>
  );
}

function DecorativePins() {
  return (
    <svg
      aria-hidden
      className="absolute -bottom-6 -right-6 w-44 h-44 opacity-20"
      viewBox="0 0 200 200"
    >
      <circle cx="60" cy="80" r="6" fill="white" />
      <circle cx="120" cy="60" r="4" fill="white" />
      <circle cx="160" cy="100" r="5" fill="white" />
      <circle cx="90" cy="140" r="4" fill="white" />
      <circle cx="140" cy="160" r="6" fill="white" />
      <path
        d="M 60 80 Q 100 50 120 60 T 160 100 Q 130 130 140 160"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
