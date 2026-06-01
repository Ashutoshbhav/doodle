"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  Star,
  Heart,
  Lightning,
  Smiley,
  Sun,
  Cloud,
  Moon,
  FlowerLotus,
  MusicNote,
  Sparkle,
  Rocket,
  Pizza,
  IceCream,
  Cat,
  Dog,
  Rainbow,
  Flame,
  Crown,
  Eye,
  Cake,
  Waves,
  Mountains,
  Compass,
  Confetti,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { RoughHighlight } from "@/components/ui/Rough";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Patch = {
  Icon: Icon;
  color: "orange" | "blue" | "yellow" | "purple" | "red" | "pink";
  name: string;
};

// 24 placeholder patches — Ash will replace with real SVGs in /public/patches/
const PATCHES: Patch[] = [
  { Icon: Rocket, color: "orange", name: "Launchpad" },
  { Icon: Heart, color: "pink", name: "First crush" },
  { Icon: Lightning, color: "yellow", name: "Volt" },
  { Icon: Star, color: "blue", name: "North star" },
  { Icon: Sun, color: "orange", name: "Sundial" },
  { Icon: Moon, color: "purple", name: "Moonbeam" },
  { Icon: Cloud, color: "blue", name: "Daydream" },
  { Icon: Smiley, color: "yellow", name: "Mood" },
  { Icon: FlowerLotus, color: "pink", name: "Bloom" },
  { Icon: MusicNote, color: "purple", name: "Loop" },
  { Icon: Pizza, color: "red", name: "Slice" },
  { Icon: IceCream, color: "pink", name: "Scoop" },
  { Icon: Cat, color: "yellow", name: "Whiskers" },
  { Icon: Dog, color: "orange", name: "Fetch" },
  { Icon: Rainbow, color: "blue", name: "Arc" },
  { Icon: Flame, color: "red", name: "Ember" },
  { Icon: Crown, color: "purple", name: "Tiara" },
  { Icon: Eye, color: "blue", name: "Watcher" },
  { Icon: Cake, color: "pink", name: "Sweet 6" },
  { Icon: Waves, color: "blue", name: "Tide" },
  { Icon: Mountains, color: "purple", name: "Peak" },
  { Icon: Compass, color: "orange", name: "Wayfinder" },
  { Icon: Sparkle, color: "yellow", name: "Glint" },
  { Icon: Confetti, color: "red", name: "Party trick" },
];

const PATCH_BG = {
  orange: "bg-doodle-orange",
  blue: "bg-doodle-blue",
  yellow: "bg-doodle-yellow",
  purple: "bg-doodle-purple",
  red: "bg-doodle-red",
  pink: "bg-doodle-pink",
} as const;

export function PatchWall() {
  return (
    <section
      id="wall"
      className="relative border-b-2 border-dashed border-doodle-ink/15 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Eyebrow variant="rule" accent="orange">
              The patch library
            </Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              <span className="italic text-doodle-orange">200+</span> patches.{" "}
              <RoughHighlight on="view" strokeWidth={18} padding={2}>
                Endless
              </RoughHighlight>{" "}
              looks.
            </h2>
            {/* [PLACEHOLDER] supporting copy */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-doodle-ink/70">
              Letters, planets, mood blobs, monograms — the catalogue grows
              every drop. Mix four on a tee and never repeat an outfit.
            </p>
          </div>

          <div className="md:col-span-4 md:text-right">
            <a
              href="#dual-cta"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-doodle-ink hover:text-doodle-orange transition-colors"
            >
              See all 200+
              <ArrowUpRight weight="bold" size={14} />
            </a>
          </div>
        </div>

        {/* Wall */}
        <div className="mt-12 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4">
          {PATCHES.map((patch, i) => (
            <PatchTile key={patch.name + i} patch={patch} index={i} />
          ))}
        </div>

        <p className="mt-6 text-center text-xs font-mono uppercase tracking-[0.2em] text-doodle-ink/40">
          [placeholder patches — real SVGs land in <code>/public/patches/</code>]
        </p>
      </div>
    </section>
  );
}

function PatchTile({ patch, index }: { patch: Patch; index: number }) {
  // Slight randomised tilt for a "scattered stickers" feel
  const baseTilt = ((index * 13) % 7) - 3;
  return (
    <motion.button
      type="button"
      aria-label={`Patch: ${patch.name}`}
      initial={{ opacity: 0, scale: 0.85, rotate: 0 }}
      whileInView={{ opacity: 1, scale: 1, rotate: baseTilt }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{
        y: -6,
        rotate: baseTilt + (baseTilt > 0 ? 4 : -4),
        scale: 1.05,
      }}
      whileTap={{ scale: 0.96 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 18,
        delay: (index % 12) * 0.03,
      }}
      className={`
        relative aspect-square rounded-[1rem] ${PATCH_BG[patch.color]}
        border-[3px] border-dashed border-doodle-stitch
        grid place-items-center group cursor-pointer
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-ink/30
      `}
    >
      <patch.Icon
        weight="duotone"
        className="text-doodle-stitch w-1/2 h-1/2 drop-shadow-[0_2px_0_rgba(0,0,0,0.08)]"
      />
      {/* Patch name overlay on hover */}
      <span className="absolute inset-x-0 bottom-1.5 text-center text-[10px] font-mono uppercase tracking-[0.18em] text-doodle-stitch/0 group-hover:text-doodle-stitch transition-colors">
        {patch.name}
      </span>
    </motion.button>
  );
}
