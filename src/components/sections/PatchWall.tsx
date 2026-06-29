"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { RoughHighlight } from "@/components/ui/Rough";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PATCHES, EMBROIDERED_PATCHES, PATCH_COUNT, type Patch } from "@/lib/patches";
import { patchWall as content } from "@/content/home";

/* ============================================================
   PatchWall — the real patch library, two collections:
   the silicone charms (hero set, matches the velcro product)
   and the embroidered iron-on patches. All real, transparent,
   AI-upscaled images. Large + named. No placeholders.
   ============================================================ */

export function PatchWall() {
  return (
    <section id="wall" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Eyebrow variant="rule" accent="orange">
              {content.eyebrow}
            </Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              <span className="italic text-doodle-orange">{PATCH_COUNT}</span> {content.headlineMid}{" "}
              <RoughHighlight on="view" strokeWidth={18} padding={2}>
                {content.headlineHighlight}
              </RoughHighlight>{" "}
              {content.headlineEnd}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-doodle-ink/70">
              {content.body}
            </p>
          </div>

          <div className="md:col-span-4 md:text-right">
            <a
              href="#dual-cta"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-doodle-ink/70 transition-colors hover:text-doodle-orange"
            >
              {content.seeAll}
              <ArrowUpRight weight="bold" size={14} />
            </a>
          </div>
        </div>

        <CollectionTray
          label="Silicone charms"
          note="Soft 3D rubber. Our signature velcro patch."
          patches={PATCHES}
          price={100}
          cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
          className="mt-10 md:mt-12"
        />

        <CollectionTray
          label="Embroidered patches"
          note="Stitched fabric, same velcro snap. A whole new lineup."
          patches={EMBROIDERED_PATCHES}
          price={150}
          cols="grid-cols-3 sm:grid-cols-4 md:grid-cols-6"
          className="mt-6"
        />
      </div>
    </section>
  );
}

function CollectionTray({
  label,
  note,
  patches,
  price,
  cols,
  className = "",
}: {
  label: string;
  note: string;
  patches: Patch[];
  price: number;
  cols: string;
  className?: string;
}) {
  return (
    <div className={`rounded-[1rem] bg-doodle-stitch p-5 shadow-card sm:p-7 ${className}`}>
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg text-doodle-ink sm:text-xl">{label}</h3>
        <span className="text-xs italic text-doodle-ink/55 sm:text-sm">{note} · ₹{price} each</span>
      </div>
      <div className={`grid gap-4 md:gap-6 ${cols}`}>
        {patches.map((patch, i) => (
          <PatchTile key={patch.key} patch={patch} index={i} price={price} />
        ))}
      </div>
    </div>
  );
}

function PatchTile({ patch, index, price }: { patch: Patch; index: number; price: number }) {
  const baseTilt = ((index * 13) % 7) - 3;
  return (
    <motion.button
      type="button"
      aria-label={`Patch: ${patch.name}`}
      initial={{ opacity: 0, scale: 0.85, rotate: 0 }}
      whileInView={{ opacity: 1, scale: 1, rotate: baseTilt }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -6, rotate: 0, scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 18,
        delay: (index % 12) * 0.03,
      }}
      className="
        group flex cursor-pointer flex-col items-center gap-2.5
        rounded-[0.9rem] bg-doodle-canvas p-3 sm:p-4
        shadow-subtle transition-shadow hover:shadow-card
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-ink/20
      "
    >
      <span className="grid aspect-square w-full place-items-center">
        <Image
          src={patch.src}
          alt={patch.name}
          width={220}
          height={220}
          className="
            h-[90%] w-[90%] object-contain
            drop-shadow-[0_8px_14px_rgba(42,42,46,0.20)]
            transition-transform duration-200 group-hover:scale-105
          "
        />
      </span>
      <span className="text-center">
        <span className="block text-[12px] font-semibold tracking-[-0.01em] text-doodle-ink/85 sm:text-[13px]">
          {patch.name}
        </span>
        <span className="mt-0.5 block text-[10px] italic leading-tight text-doodle-ink/45 sm:text-[11px]">
          {patch.bio}
        </span>
        <span className="mt-1 block text-[11px] font-semibold text-doodle-ink/70">₹{price}</span>
      </span>
    </motion.button>
  );
}
