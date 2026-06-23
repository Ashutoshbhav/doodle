"use client";

import * as React from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { RoughHighlight } from "@/components/ui/Rough";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PatchShape, PATCH_KEYS, type PatchKey } from "@/components/ui/PatchShape";
import { patchWall as content } from "@/content/home";

/* ============================================================
   PatchWall — the real patch wall.

   Was: a heading + 24 Phosphor-icon tiles + a literal
   placeholder caption + a large cream void from
   py-24/py-32. Now: the actual silicone-charm patches rendered
   from the shared PatchShape SVGs, scattered-sticker style, with
   the empty area filled by the wall itself. No placeholder caption.
   Padding tightened (py-16/py-24) so no dead space.
   ============================================================ */

// Map each content patch to a real PatchShape key, cycling the
// 16 shapes so all 24 tiles read as distinct silicone charms.
const PATCHES: { key: PatchKey; name: string }[] = content.patches.map(
  (p, i) => ({
    key: PATCH_KEYS[i % PATCH_KEYS.length],
    name: p.name,
  }),
);

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
              <span className="italic text-doodle-orange">{content.headlineCount}</span> {content.headlineMid}{" "}
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

        {/* The wall — real silicone-charm patches on a soft cream tray */}
        <div className="mt-10 rounded-[1rem] bg-doodle-stitch p-5 shadow-card sm:p-7 md:mt-12">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4">
            {PATCHES.map((patch, i) => (
              <PatchTile key={patch.name + i} patch={patch} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PatchTile({
  patch,
  index,
}: {
  patch: { key: PatchKey; name: string };
  index: number;
}) {
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
      className="
        group relative grid aspect-square cursor-pointer place-items-center
        rounded-[0.85rem] bg-doodle-canvas
        shadow-subtle transition-shadow hover:shadow-card
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-ink/30
      "
    >
      <span className="block h-3/5 w-3/5">
        <ResponsivePatch patch={patch.key} />
      </span>
      {/* Patch name overlay on hover — clean sans, not mono */}
      <span className="absolute inset-x-0 bottom-2 text-center text-[11px] font-semibold text-doodle-ink/0 transition-colors group-hover:text-doodle-ink">
        {patch.name}
      </span>
    </motion.button>
  );
}

/* PatchShape takes a fixed pixel size; wrap it so it scales to the
   tile via a full-bleed inline SVG sizing trick. */
function ResponsivePatch({ patch }: { patch: PatchKey }) {
  return (
    <span className="grid h-full w-full place-items-center [&>svg]:h-full [&>svg]:w-full">
      <PatchShape patch={patch} size={100} />
    </span>
  );
}
