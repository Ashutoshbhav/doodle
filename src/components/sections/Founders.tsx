"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import { Heart, Lightning, Star, Rocket, Sun } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { MagneticHover } from "@/components/motion";
import { RoughHighlight } from "@/components/ui/Rough";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DoodleMark } from "@/components/ui/DoodleMark";
import { founders as content } from "@/content/home";

/* ============================================================
   FOUNDERS v2 — "premium, but for kids" (Dialog discipline)

   - Dashed borders + mono role labels + placeholder line purged.
   - Smiley portraits replaced with a TASTEFUL colour portrait
     placeholder: a large monogram initial on a soft-tinted stage
     inside a calm cream card (not a saturated full-colour card).
     Reads as an intentional "photo coming" frame, never a smiley.
   - Soft warm-ink shadow, 16px radius, clean sans role labels.
     One orange accent (the fav-patch pin) per card.
   ============================================================ */

type FounderColor = "orange" | "blue" | "purple" | "pink" | "yellow";

// Visual data (stage colour + favourite-patch icon) is structural;
// name/role/bio/favPatch.label come from content.people
const FOUNDER_VISUALS: {
  tint: FounderColor;
  FavIcon: Icon;
}[] = [
  { tint: "orange", FavIcon: Lightning },
  { tint: "blue", FavIcon: Heart },
  { tint: "purple", FavIcon: Star },
  { tint: "pink", FavIcon: Rocket },
  { tint: "yellow", FavIcon: Sun },
];

const FOUNDERS = content.people.map((p, i) => ({
  name: p.name,
  role: p.role,
  tint: FOUNDER_VISUALS[i].tint,
  bio: p.bio,
  favPatch: { Icon: FOUNDER_VISUALS[i].FavIcon, label: p.favPatchLabel },
}));

// Soft tinted "stage" for the portrait placeholder (calm, premium).
const STAGE = {
  orange: "bg-doodle-orange/15",
  blue: "bg-doodle-blue/15",
  purple: "bg-doodle-purple/15",
  pink: "bg-doodle-pink/15",
  yellow: "bg-doodle-yellow/15",
} as const;

// Monogram tile fill + readable text (dark ink on the yellow tile for AA).
const MONO = {
  orange: "bg-doodle-orange text-doodle-stitch",
  blue: "bg-doodle-blue text-doodle-stitch",
  purple: "bg-doodle-purple text-doodle-stitch",
  pink: "bg-doodle-pink text-doodle-stitch",
  yellow: "bg-doodle-yellow text-doodle-ink",
} as const;

export function Founders() {
  return (
    <section
      id="founders"
      className="relative py-24 md:py-32 bg-doodle-canvas"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Same hand-drawn squiggle beat as Promise — the two brand-story
            sections share the wordmark's mark */}
        <div className="mb-10 flex justify-center md:mb-12">
          <DoodleMark kind="squiggle" sway className="w-16 text-doodle-ink/25" />
        </div>
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow variant="rule" accent="orange">
              {content.eyebrow}
            </Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
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
            {content.body}
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FOUNDERS.map((f, i) => (
            <FounderCard key={f.name + i} f={f} index={i} />
          ))}
        </div>
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
  const FavIcon: Icon = f.favPatch.Icon;
  const initial = f.name.replace(/[^A-Za-z]/g, "").charAt(0).toUpperCase();

  return (
    <MagneticHover strength={0.07}>
      <motion.article
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 22,
          delay: index * 0.1,
        }}
        className="relative rounded-[1rem] bg-doodle-stitch p-7 shadow-card transition-shadow hover:shadow-card-hover flex flex-col gap-5 sm:p-8"
      >
        {/* Portrait placeholder — soft tinted stage + monogram (no smiley) */}
        <div
          className={`relative grid h-44 w-full place-items-center rounded-[0.75rem] ${STAGE[f.tint]}`}
        >
          <div
            className={`grid h-24 w-24 place-items-center rounded-[0.75rem] shadow-subtle ${MONO[f.tint]}`}
          >
            <span className="font-display text-4xl leading-none">{initial}</span>
          </div>
          {/* Favourite-patch pin — one orange accent, soft, no dashed */}
          <div
            className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-doodle-stitch shadow-card"
            aria-label={`Favourite patch: ${f.favPatch.label}`}
          >
            <FavIcon weight="duotone" size={20} className="text-doodle-orange" />
          </div>
        </div>

        <div>
          <div className="font-display text-2xl text-doodle-ink leading-tight">
            {f.name}
          </div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-doodle-ink/55">
            {f.role}
          </div>
        </div>

        {/* Bio renders only when the founder has written one — never filler */}
        {f.bio && <p className="text-sm leading-relaxed text-doodle-ink/75">{f.bio}</p>}

        <div className="mt-auto flex items-center justify-between gap-2 rounded-full bg-doodle-ink/[0.05] px-4 py-2.5">
          <span className="text-xs font-medium text-doodle-ink/55">
            {content.petPatchLabel}
          </span>
          <span className="font-display text-sm text-doodle-ink">
            {f.favPatch.label}
          </span>
        </div>
      </motion.article>
    </MagneticHover>
  );
}
