/* ============================================================
   PatchShape — renders a REAL DOODLE silicone-charm patch.

   These used to be hand-built SVG placeholder shapes. They now
   render the real catalogue patch photos (transparent PNGs in
   /public/patches), wrapped in the same <svg width/height viewBox>
   envelope as before so every existing call site and sizing
   wrapper keeps working unchanged.

   Each abstract key maps to one of the 10 original, IP-clean
   patches in the registry (src/lib/patches.ts). No placeholders,
   no licensed characters.
   ============================================================ */

import { PATCHES } from "@/lib/patches";

export type PatchKey =
  | "bear"
  | "star"
  | "lightning"
  | "heart"
  | "rocket"
  | "moon"
  | "cloud"
  | "sun"
  | "drop"
  | "burst"
  | "diamond"
  | "smile"
  | "stripe"
  | "arrow"
  | "flower"
  | "hex";

/** Ordered list of every patch key — handy for grids / clusters. */
export const PATCH_KEYS: readonly PatchKey[] = [
  "bear",
  "star",
  "lightning",
  "heart",
  "rocket",
  "moon",
  "cloud",
  "sun",
  "drop",
  "burst",
  "diamond",
  "smile",
  "stripe",
  "arrow",
  "flower",
  "hex",
];

// Each decorative key -> a real patch image. The 16 legacy keys cycle
// the 10 original patches so clusters / grids read as a varied charm set.
const PATCH_SRC: Record<PatchKey, string> = {
  bear: "/patches/bear-brown.png",
  star: "/patches/star.png",
  lightning: "/patches/crown.png",
  heart: "/patches/koala.png",
  rocket: "/patches/penguin.png",
  moon: "/patches/bear-olive.png",
  cloud: "/patches/rainbow.png",
  sun: "/patches/crown.png",
  drop: "/patches/octopus.png",
  burst: "/patches/rainbow.png",
  diamond: "/patches/elephant.png",
  smile: "/patches/puppy.png",
  stripe: "/patches/koala.png",
  arrow: "/patches/penguin.png",
  flower: "/patches/octopus.png",
  hex: "/patches/elephant.png",
};

// Kept for any caller still referencing the brand patch palette.
export const PATCH_COLOR: Record<PatchKey, string> = {
  bear: "#8b80e0",
  star: "#d4a800",
  lightning: "#d4a800",
  heart: "#d4607a",
  rocket: "#e8650a",
  moon: "#1a56c4",
  cloud: "#1a56c4",
  sun: "#e8650a",
  drop: "#1a56c4",
  burst: "#e8650a",
  diamond: "#d4607a",
  smile: "#d4a800",
  stripe: "#c8312a",
  arrow: "#8b80e0",
  flower: "#d4607a",
  hex: "#1a56c4",
};

export function PatchShape({ patch, size }: { patch: PatchKey; size: number }) {
  const src = PATCH_SRC[patch] ?? PATCHES[0].src;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-hidden
    >
      <image
        href={src}
        x="0"
        y="0"
        width="100"
        height="100"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}
