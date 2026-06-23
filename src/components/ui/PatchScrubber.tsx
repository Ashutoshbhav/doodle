"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

/* ============================================================
   Patch system
   Real product = ~8 silicone charm patches in a horizontal row
   across the chest (velcro receiver dots beneath each slot).
   These are placeholder SVG shapes — Ash will swap to real
   3D-rendered patch images from /public/patches/ later.
   ============================================================ */

type PatchKey =
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

// Brand-token patch palette (locked DOODLE hexes — NOT the drifted values).
// orange #e8650a · blue #1a56c4 · yellow #d4a800 · pink #d4607a
// purple #8b80e0 · red #c8312a
const PATCH_COLOR: Record<PatchKey, string> = {
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

function PatchShape({ patch, size }: { patch: PatchKey; size: number }) {
  const fill = PATCH_COLOR[patch];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      {/* Soft outer glow for "rubber" depth */}
      <circle cx="50" cy="50" r="46" fill={fill} opacity="0.15" />
      {/* Patch body */}
      <PatchBody patch={patch} fill={fill} />
      {/* Tiny highlight = silicone sheen */}
      <ellipse cx="38" cy="32" rx="10" ry="4" fill="white" opacity="0.45" />
    </svg>
  );
}

function PatchBody({ patch, fill }: { patch: PatchKey; fill: string }) {
  const stroke = "white";
  const sw = 2.5;
  switch (patch) {
    case "bear":
      return (
        <>
          <circle cx="28" cy="30" r="11" fill={fill} />
          <circle cx="72" cy="30" r="11" fill={fill} />
          <circle cx="50" cy="58" r="32" fill={fill} />
          <circle cx="50" cy="58" r="32" fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx="40" cy="54" r="3" fill="white" />
          <circle cx="60" cy="54" r="3" fill="white" />
          <ellipse cx="50" cy="68" rx="6" ry="4" fill="white" />
        </>
      );
    case "star":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <path d="M50 22 L57 44 L80 44 L62 58 L68 80 L50 66 L32 80 L38 58 L20 44 L43 44 Z" fill="white" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "lightning":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <path d="M 56 22 L 36 54 L 50 54 L 42 78 L 64 44 L 50 44 Z" fill="white" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "heart":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <path d="M50 76 C28 60 20 48 28 36 C36 28 47 32 50 41 C53 32 64 28 72 36 C80 48 72 60 50 76 Z" fill="white" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "rocket":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <path d="M50 18 C 60 28 64 42 64 56 L 36 56 C 36 42 40 28 50 18 Z" fill="white" />
          <circle cx="50" cy="40" r="5" fill={fill} />
          <path d="M36 56 L 28 70 L 38 66 Z" fill="white" />
          <path d="M64 56 L 72 70 L 62 66 Z" fill="white" />
          <path d="M44 70 Q 50 82 56 70" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "moon":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <path d="M 60 24 A 30 30 0 1 0 70 70 A 22 22 0 1 1 60 24 Z" fill="white" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "cloud":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <path d="M28 60 Q 28 48 40 48 Q 42 36 54 38 Q 66 36 68 48 Q 78 48 78 58 Q 78 68 68 68 L 36 68 Q 28 68 28 60 Z" fill="white" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "sun":
      return (
        <>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const x1 = 50 + Math.cos(a) * 30;
            const y1 = 50 + Math.sin(a) * 30;
            const x2 = 50 + Math.cos(a) * 44;
            const y2 = 50 + Math.sin(a) * 44;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={fill} strokeWidth="6" strokeLinecap="round" />;
          })}
          <circle cx="50" cy="50" r="26" fill={fill} />
          <circle cx="50" cy="50" r="26" fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx="42" cy="46" r="3" fill="white" />
          <circle cx="58" cy="46" r="3" fill="white" />
          <path d="M42 56 Q 50 62 58 56" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case "drop":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <path d="M50 22 C 60 38 70 48 70 60 A 20 20 0 1 1 30 60 C 30 48 40 38 50 22 Z" fill="white" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "burst":
      return (
        <>
          <circle cx="50" cy="50" r="34" fill={fill} />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2 + 0.3;
            const x1 = 50 + Math.cos(a) * 36;
            const y1 = 50 + Math.sin(a) * 36;
            const x2 = 50 + Math.cos(a) * 48;
            const y2 = 50 + Math.sin(a) * 48;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={fill} strokeWidth="6" strokeLinecap="round" />;
          })}
          <circle cx="50" cy="50" r="34" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "diamond":
      return (
        <>
          <path d="M50 14 L 86 50 L 50 86 L 14 50 Z" fill={fill} />
          <path d="M50 14 L 86 50 L 50 86 L 14 50 Z" fill="none" stroke={stroke} strokeWidth={sw} />
          <path d="M50 26 L 74 50 L 50 74 L 26 50 Z" fill="white" opacity="0.6" />
        </>
      );
    case "smile":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <circle cx="38" cy="42" r="4.5" fill="white" />
          <circle cx="62" cy="42" r="4.5" fill="white" />
          <path d="M34 58 Q 50 76 66 58" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "stripe":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <line x1="22" y1="40" x2="78" y2="40" stroke="white" strokeWidth="6" strokeLinecap="round" />
          <line x1="22" y1="50" x2="78" y2="50" stroke="white" strokeWidth="6" strokeLinecap="round" />
          <line x1="22" y1="60" x2="78" y2="60" stroke="white" strokeWidth="6" strokeLinecap="round" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "arrow":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <path d="M30 50 L 65 50 M 50 35 L 65 50 L 50 65" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "flower":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const a = (deg * Math.PI) / 180;
            const cx = 50 + Math.cos(a) * 18;
            const cy = 50 + Math.sin(a) * 18;
            return <circle key={deg} cx={cx} cy={cy} r="11" fill="white" />;
          })}
          <circle cx="50" cy="50" r="9" fill={fill} />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "hex":
      return (
        <>
          <path d="M50 14 L 82 32 L 82 68 L 50 86 L 18 68 L 18 32 Z" fill={fill} />
          <path d="M50 14 L 82 32 L 82 68 L 50 86 L 18 68 L 18 32 Z" fill="none" stroke={stroke} strokeWidth={sw} />
          <path d="M50 28 L 70 38 L 70 62 L 50 72 L 30 62 L 30 38 Z" fill="white" opacity="0.7" />
        </>
      );
  }
}

/* ============================================================
   Presets — six full-chest looks. Each is 8 patches in a row
   that maps to the 8 velcro slots across the chest.
   ============================================================ */

type Preset = { name: string; mood: string; row: PatchKey[]; tee: TeeColor };
type TeeColor = "cream" | "blue" | "yellow" | "pink" | "purple";

// Real product photos cycle by preset tee colour. Warm tones map to the
// cream tee, cool tones to the sky tee. Add more shots as Ash captures them.
const TEE_PHOTO: Record<TeeColor, string> = {
  cream: "/product/tee-white.jpeg",
  yellow: "/product/tee-white.jpeg",
  pink: "/product/tee-white.jpeg",
  blue: "/product/tee-blue.jpeg",
  purple: "/product/tee-blue.jpeg",
};

const PRESETS: Preset[] = [
  {
    name: "Sunday cartoon",
    mood: "Soft saturday energy",
    tee: "cream",
    row: ["smile", "rocket", "star", "heart", "cloud", "moon", "burst", "drop"],
  },
  {
    name: "Storm chaser",
    mood: "Chase the weather",
    tee: "blue",
    row: ["lightning", "cloud", "drop", "moon", "star", "lightning", "burst", "cloud"],
  },
  {
    name: "Bedtime crew",
    mood: "Quiet wonder",
    tee: "purple",
    row: ["moon", "star", "bear", "heart", "cloud", "moon", "star", "drop"],
  },
  {
    name: "Birthday loud",
    mood: "Party started",
    tee: "yellow",
    row: ["burst", "smile", "heart", "star", "diamond", "flower", "rocket", "burst"],
  },
  {
    name: "Garden recess",
    mood: "Outside kid",
    tee: "pink",
    row: ["flower", "sun", "heart", "smile", "drop", "flower", "burst", "star"],
  },
  {
    name: "Mission mode",
    mood: "Builders only",
    tee: "cream",
    row: ["rocket", "lightning", "arrow", "hex", "diamond", "burst", "stripe", "star"],
  },
];

const SLOT_COUNT = 8;
const AUTO_ADVANCE_MS = 3000;
const IDLE_RESUME_MS = 4500;

export function PatchScrubber() {
  const [index, setIndex] = React.useState(0);
  const [interacting, setInteracting] = React.useState(false);
  const [reduced, setReduced] = React.useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const idleTimer = React.useRef<number | null>(null);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  React.useEffect(() => {
    if (interacting || reduced) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % PRESETS.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(t);
  }, [interacting, reduced]);

  const onScrub = (next: number) => {
    setIndex(Math.min(PRESETS.length - 1, Math.max(0, next)));
    setInteracting(true);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(
      () => setInteracting(false),
      IDLE_RESUME_MS,
    );
  };

  const preset = PRESETS[index];

  // Slot positions aligned with the chest patch row in the real product
  // photos. Values are % of the stage box.
  //   y ≈ 41% (chest centre)
  //   x spans 28%..72% across 8 evenly-spaced slots
  const SLOT_Y_PCT = 41;
  const SLOT_X_START = 28;
  const SLOT_X_END = 72;
  const slotW_pct = (SLOT_X_END - SLOT_X_START) / SLOT_COUNT;
  const slotPositions = Array.from({ length: SLOT_COUNT }).map((_, i) => ({
    xPct: SLOT_X_START + slotW_pct * (i + 0.5),
    yPct: SLOT_Y_PCT,
    patchPct: 11, // overlay patch size (% of stage width)
    maskPct: 13.5, // mask circle, slightly larger to obscure photo's patch
  }));

  return (
    <div className="w-full">
      {/* Stage */}
      <div className="relative mx-auto aspect-square w-full max-w-[460px]">
        {/* Soft halo behind tee */}
        <div
          className="absolute inset-6 rounded-[40%] bg-doodle-yellow/30 blur-2xl"
          aria-hidden
        />

        {/* Real product photo as the base — cycles by preset tee */}
        <AnimatePresence mode="wait">
          <motion.div
            key={preset.tee}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Image
              src={TEE_PHOTO[preset.tee]}
              alt="DOODLE base tee with the live patch row"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-contain mix-blend-multiply"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Mask layer — soft white discs over each slot to obscure the
            photo's printed patches so the cycling overlay reads as the
            "live" set. */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {slotPositions.map((s, i) => (
            <div
              key={`mask-${i}`}
              className="absolute rounded-full bg-doodle-stitch"
              style={{
                left: `${s.xPct}%`,
                top: `${s.yPct}%`,
                width: `${s.maskPct}%`,
                height: `${s.maskPct}%`,
                transform: "translate(-50%, -50%)",
                filter: "blur(2px)",
                opacity: 0.92,
              }}
            />
          ))}
        </div>

        {/* Patches as overlaid divs */}
        <div className="absolute inset-0">
          <AnimatePresence mode="popLayout">
            {preset.row.map((patch, i) => {
              const s = slotPositions[i];
              return (
                <motion.div
                  key={`${preset.name}-${i}`}
                  initial={
                    reduced
                      ? false
                      : { opacity: 0, y: -12, scale: 0.55, rotate: -10 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  exit={
                    reduced
                      ? { opacity: 0 }
                      : { opacity: 0, y: 10, scale: 0.55, rotate: 10 }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 20,
                    delay: reduced ? 0 : i * 0.04,
                  }}
                  className="absolute"
                  style={{
                    left: `${s.xPct}%`,
                    top: `${s.yPct}%`,
                    width: `${s.patchPct}%`,
                    height: `${s.patchPct}%`,
                    transform: "translate(-50%, -50%)",
                    filter: "drop-shadow(0 2px 4px rgba(42,42,46,0.25))",
                  }}
                >
                  <PatchShape patch={patch} size={100} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Live region for screen readers */}
      <div className="sr-only" aria-live="polite">
        Look {index + 1} of {PRESETS.length}: {preset.name}
      </div>

      {/* Scrubber controls */}
      <div className="mx-auto mt-7 max-w-[440px]">
        <div className="flex items-baseline justify-between gap-3 text-xs font-semibold uppercase tracking-[0.08em] text-doodle-ink/55">
          <span>Drag to remix &rarr;</span>
          <span>
            {String(index + 1).padStart(2, "0")} / {PRESETS.length}
          </span>
        </div>

        <motion.div
          key={preset.name}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-1 flex items-baseline justify-between gap-3"
        >
          <h3 className="font-display text-xl text-doodle-ink leading-tight">
            {preset.name}
          </h3>
          <span className="text-xs italic text-doodle-ink/55">
            {preset.mood}
          </span>
        </motion.div>

        <div className="relative mt-4">
          {/* Track */}
          <div className="h-2 rounded-full bg-doodle-ink/10" />
          {/* Fill */}
          <motion.div
            className="absolute top-0 left-0 h-2 rounded-full bg-doodle-orange"
            animate={{ width: `${(index / (PRESETS.length - 1)) * 100}%` }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          />
          {/* Thumb */}
          <motion.div
            className="absolute -top-2 h-6 w-6 -translate-x-1/2 rounded-full bg-doodle-stitch shadow-card"
            animate={{ left: `${(index / (PRESETS.length - 1)) * 100}%` }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          />
          <input
            type="range"
            min={0}
            max={PRESETS.length - 1}
            step={1}
            value={index}
            onChange={(e) => onScrub(Number(e.target.value))}
            aria-label="Patch combination scrubber"
            className="absolute inset-x-0 -inset-y-3 h-12 w-full cursor-grab opacity-0"
          />
        </div>

        {/* Preset chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {PRESETS.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => onScrub(i)}
              aria-label={`Choose look: ${p.name}`}
              aria-pressed={i === index}
              className={`
                grid place-items-center h-9 w-9 rounded-full text-[11px] font-semibold
                transition-[box-shadow,background-color,transform] duration-200
                ${
                  i === index
                    ? "bg-doodle-orange text-doodle-stitch shadow-card scale-110"
                    : "bg-doodle-stitch text-doodle-ink/60 shadow-subtle hover:shadow-card hover:text-doodle-ink"
                }
              `}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
