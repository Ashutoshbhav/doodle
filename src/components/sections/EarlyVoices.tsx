"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import { Quotes, Star } from "@phosphor-icons/react/dist/ssr";
import { MagneticHover } from "@/components/motion";
import { RoughHighlight } from "@/components/ui/Rough";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Tag } from "@/components/ui/Tag";
import { earlyVoices as content } from "@/content/home";

/* ============================================================
   EARLY VOICES v2 — "premium, but for kids" (Dialog discipline)

   - Dashed borders + mono labels purged.
   - Smiley-face avatars replaced with INTENTIONAL monogram tiles:
     the speaker's initial in a brand-colour rounded tile. Reads as
     a designed identity chip, never an unfinished smiley.
   - Cards on cream, soft warm-ink shadow, 16px radius, clean sans
     relation labels. One orange accent per card (the stars).
   ============================================================ */

const VOICES = content.voices.map((v) => ({
  name: v.name,
  relation: v.relation,
  avatarColor: v.avatarColor,
  quote: v.quote,
  rating: v.rating,
}));

const AVATAR_BG = {
  yellow: "bg-doodle-yellow",
  blue: "bg-doodle-blue",
  pink: "bg-doodle-pink",
} as const;

const AVATAR_TEXT = {
  yellow: "text-doodle-ink",
  blue: "text-doodle-stitch",
  pink: "text-doodle-stitch",
} as const;

export function EarlyVoices() {
  return (
    <section
      id="voices"
      className="relative py-24 md:py-32 bg-[color:var(--color-surface-blush)]"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Eyebrow variant="rule" accent="orange">
              {content.eyebrow}
            </Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              {content.headlineLead}{" "}
              <span className="italic text-doodle-orange">{content.headlineCount}</span>{" "}
              {content.headlineMid}{" "}
              <RoughHighlight on="view" strokeWidth={18} padding={2}>
                {content.headlineHighlight}
              </RoughHighlight>{" "}
              {content.headlineEnd}
            </h2>
          </div>

          <div className="md:col-span-4 md:text-right">
            <Tag tone="accent">
              <span className="h-2 w-2 rounded-full bg-doodle-orange" aria-hidden />
              {content.badge}
            </Tag>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {VOICES.map((v, i) => (
            <VoiceCard key={v.name + i} voice={v} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VoiceCard({
  voice,
  index,
}: {
  voice: (typeof VOICES)[number];
  index: number;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const initial = voice.name.replace(/[^A-Za-z]/g, "").charAt(0).toUpperCase();

  return (
    <MagneticHover strength={0.08}>
      <motion.article
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 24,
          delay: index * 0.1,
        }}
        className="relative rounded-[1rem] bg-doodle-stitch p-7 shadow-card transition-shadow hover:shadow-card-hover flex flex-col gap-5 min-h-[320px] sm:p-8"
      >
        <Quotes
          weight="fill"
          size={48}
          className="text-doodle-orange/25 absolute top-5 right-5"
          aria-hidden
        />

        <div className="flex items-center gap-4">
          {/* Monogram tile — designed identity chip, no smiley */}
          <div
            className={`grid place-items-center h-14 w-14 rounded-[0.75rem] shrink-0 shadow-subtle ${AVATAR_BG[voice.avatarColor]}`}
          >
            <span
              className={`font-display text-xl leading-none ${AVATAR_TEXT[voice.avatarColor]}`}
            >
              {initial}
            </span>
          </div>
          <div>
            <div className="font-display text-lg text-doodle-ink leading-tight">
              {voice.name}
            </div>
            <div className="mt-0.5 text-xs font-medium text-doodle-ink/55">
              {voice.relation}
            </div>
          </div>
        </div>

        <p className="text-base leading-relaxed text-doodle-ink/85 italic">
          &ldquo;{voice.quote}&rdquo;
        </p>

        <div className="mt-auto flex items-center gap-1">
          {Array.from({ length: voice.rating }).map((_, i) => (
            <Star key={i} weight="fill" size={16} className="text-doodle-orange" />
          ))}
        </div>
      </motion.article>
    </MagneticHover>
  );
}
