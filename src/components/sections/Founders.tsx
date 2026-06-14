"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import {
  SmileyMelting,
  SmileyWink,
  Smiley,
  Heart,
  Lightning,
  Star,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { MagneticHover } from "@/components/motion";
import { RoughHighlight } from "@/components/ui/Rough";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { founders as content } from "@/content/home";

type FounderColor = "orange" | "blue" | "purple";

// Visual data (bg color, face + favourite-patch icons) is structural;
// name/role/bio/favPatch.label come from content.people
const FOUNDER_VISUALS: {
  bg: FounderColor;
  Face: typeof Smiley;
  FavIcon: Icon;
}[] = [
  { bg: "orange", Face: Smiley, FavIcon: Lightning },
  { bg: "blue", Face: SmileyWink, FavIcon: Heart },
  { bg: "purple", Face: SmileyMelting, FavIcon: Star },
];

const FOUNDERS = content.people.map((p, i) => ({
  name: p.name,
  role: p.role,
  bg: FOUNDER_VISUALS[i].bg,
  Face: FOUNDER_VISUALS[i].Face,
  bio: p.bio,
  favPatch: { Icon: FOUNDER_VISUALS[i].FavIcon, label: p.favPatchLabel },
}));

const SURFACE = {
  orange: { bg: "bg-doodle-orange", chip: "text-doodle-stitch/85" },
  blue: { bg: "bg-doodle-blue", chip: "text-doodle-stitch/85" },
  purple: { bg: "bg-doodle-purple", chip: "text-doodle-stitch/85" },
} as const;

export function Founders() {
  return (
    <section
      id="founders"
      className="relative border-b-2 border-dashed border-doodle-ink/15 py-24 md:py-32 bg-doodle-canvas"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow variant="rule" accent="orange">
              {content.eyebrow}
            </Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              {content.headlineLead}{" "}
              <span className="italic text-doodle-orange">{content.headlineEmphasis}</span>{" "}
              {content.headlineMid}{" "}
              <RoughHighlight on="view" strokeWidth={18} padding={2}>
                {content.headlineHighlight}
              </RoughHighlight>{" "}
              {content.headlineEnd}
            </h2>
          </div>
          <p className="md:col-span-5 text-base text-doodle-ink/70 leading-relaxed">
            {/* [PLACEHOLDER] supporting copy */}
            {content.body}
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {FOUNDERS.map((f, i) => (
            <FounderCard key={f.name + i} f={f} index={i} />
          ))}
        </div>

        <p className="mt-6 text-center text-xs font-mono uppercase tracking-[0.18em] text-doodle-ink/40">
          [placeholder names &mdash; Ash will replace with real founders]
        </p>
      </div>
    </section>
  );
}

function FounderCard({
  f,
  index,
}: {
  f: (typeof FOUNDERS)[number];
  index: number;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const s = SURFACE[f.bg];
  const FavIcon: Icon = f.favPatch.Icon;
  const Face = f.Face;

  return (
    <MagneticHover strength={0.07}>
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 28, rotate: 0 }}
      animate={
        inView
          ? { opacity: 1, y: 0, rotate: index % 2 === 0 ? -1 : 1 }
          : undefined
      }
      whileHover={{ y: -6, rotate: 0, scale: 1.02 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 22,
        delay: index * 0.1,
      }}
      className={`
        relative ${s.bg} rounded-[1rem] p-7 sm:p-8 stitch-thick
        flex flex-col gap-5 min-h-[420px]
      `}
    >
      {/* Avatar */}
      <div className="relative mx-auto h-32 w-32">
        <div className="absolute inset-0 rounded-full bg-doodle-stitch border-[3px] border-dashed border-doodle-stitch grid place-items-center">
          <Face weight="duotone" size={84} className="text-doodle-ink" />
        </div>
        {/* Mini "favourite patch" pin */}
        <div
          className={`
            absolute -bottom-2 -right-2 grid place-items-center h-12 w-12 rounded-full
            bg-doodle-canvas border-[3px] border-dashed border-doodle-stitch
          `}
          aria-label={`Favourite patch: ${f.favPatch.label}`}
        >
          <FavIcon weight="duotone" size={22} className="text-doodle-ink" />
        </div>
      </div>

      <div className="text-center">
        <div className="font-display text-2xl text-doodle-stitch leading-tight">
          {f.name}
        </div>
        <div
          className={`mt-1 font-mono text-[10px] uppercase tracking-[0.22em] ${s.chip}`}
        >
          {f.role}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-doodle-stitch/90 text-center">
        {f.bio}
      </p>

      <div
        className={`
          mt-auto flex items-center justify-between gap-2
          rounded-full bg-doodle-stitch/15 px-4 py-2
        `}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-doodle-stitch/85">
          {content.petPatchLabel}
        </span>
        <span className="font-display text-sm text-doodle-stitch">
          {f.favPatch.label}
        </span>
      </div>
    </motion.article>
    </MagneticHover>
  );
}
