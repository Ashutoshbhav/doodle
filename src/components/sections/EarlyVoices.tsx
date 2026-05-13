"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import {
  Smiley,
  SmileyWink,
  SmileyMelting,
  Quotes,
  Star,
} from "@phosphor-icons/react/dist/ssr";
import { MagneticHover } from "@/components/motion";
import { RoughHighlight } from "@/components/ui/Rough";

const VOICES = [
  {
    name: "[Sneha]",
    relation: "Mom of two · early DOODLE family",
    avatarColor: "yellow",
    Face: Smiley,
    quote:
      "Mira refuses to wear anything else. She picks her own patches every morning — it's the first time getting dressed isn't a fight.",
    rating: 5,
  },
  {
    name: "[Ravi]",
    relation: "Dad · backer #023",
    avatarColor: "blue",
    Face: SmileyWink,
    quote:
      "We bought one tee. Six months later it's still in rotation, just looking like a different shirt every week.",
    rating: 5,
  },
  {
    name: "[Anjali]",
    relation: "Pre-school teacher · advisor",
    avatarColor: "pink",
    Face: SmileyMelting,
    quote:
      "It teaches kids that 'design' is a verb. Three of mine now ask if they can 'design' their breakfast plate.",
    rating: 5,
  },
] as const;

const AVATAR_BG = {
  yellow: "bg-doodle-yellow",
  blue: "bg-doodle-blue",
  pink: "bg-doodle-pink",
} as const;

export function EarlyVoices() {
  return (
    <section
      id="voices"
      className="relative border-b-2 border-dashed border-doodle-ink/15 py-24 md:py-32 bg-[color:var(--color-surface-blush)]"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-doodle-ink/55">
              Early voices
            </div>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              From the first{" "}
              <span className="italic text-doodle-orange">200</span>{" "}
              families &amp; one{" "}
              <RoughHighlight on="view" strokeWidth={18} padding={2}>
                honest
              </RoughHighlight>{" "}
              teacher.
            </h2>
          </div>

          <div className="md:col-span-4 md:text-right">
            <span className="inline-flex items-center gap-2 rounded-full bg-doodle-stitch px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.22em] text-doodle-ink stitch-ink">
              <span className="h-2 w-2 rounded-full bg-doodle-orange animate-pulse" aria-hidden />
              Early-supporter quotes
            </span>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {VOICES.map((v, i) => (
            <VoiceCard key={v.name + i} voice={v} index={i} />
          ))}
        </div>

        <p className="mt-6 text-center text-xs font-mono uppercase tracking-[0.18em] text-doodle-ink/40">
          [placeholder names — will swap with real consented quotes]
        </p>
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
  const Face = voice.Face;

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
      className="
        relative rounded-[2rem] bg-doodle-stitch p-7 sm:p-8
        stitch-ink flex flex-col gap-5 min-h-[320px]
      "
    >
      <Quotes
        weight="fill"
        size={48}
        className="text-doodle-orange/30 absolute top-5 right-5"
        aria-hidden
      />

      <div className="flex items-center gap-4">
        <div
          className={`
            relative grid place-items-center h-14 w-14 rounded-full
            ${AVATAR_BG[voice.avatarColor]} border-[3px] border-dashed border-doodle-stitch shrink-0
          `}
        >
          <Face weight="duotone" size={32} className="text-doodle-ink" />
        </div>
        <div>
          <div className="font-display text-lg text-doodle-ink leading-tight">
            {voice.name}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-doodle-ink/55">
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
