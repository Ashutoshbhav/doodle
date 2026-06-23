"use client";

import * as React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from "motion/react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { characterStrip as content } from "@/content/home";

/* ============================================================
   CHARACTER STRIP v2 — "premium, but for kids" (Dialog discipline)

   - Dashed borders + mono mood labels purged.
   - Smiley placeholders replaced with INTENTIONAL designed tiles:
     a monogram initial in a brand-colour rounded tile (the "face"),
     the base-tee SVG with SOLID strokes, two clean patch shapes.
     Reads finished + playful — never an empty smiley.
   - Cards sit on a cream canvas, soft warm-ink shadow, 16px radius.
   - One orange accent per card (the age chip); the rest of the
     palette is product/illustration, not chrome.
   ============================================================ */

// Modular wrap: keeps a value cycling between [min, max).
// Used to make the marquee loop seamlessly past -50% back to 0%.
function wrap(min: number, max: number, v: number) {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
}

type CharColor = "orange" | "blue" | "yellow" | "purple" | "red" | "pink";

type Character = {
  name: string;
  age: number;
  bg: CharColor;
  shirt: CharColor;
  patches: [CharColor, CharColor];
  mood: string;
};

// [PLACEHOLDER] character set — Ash will replace with the real illustrated kids.
// Visual data (colours only) lives here; name/age/mood come from content.
const CHAR_VISUALS: {
  bg: CharColor;
  shirt: CharColor;
  patches: [CharColor, CharColor];
}[] = [
  { bg: "yellow", shirt: "orange", patches: ["blue", "purple"] },
  { bg: "blue", shirt: "yellow", patches: ["pink", "red"] },
  { bg: "pink", shirt: "purple", patches: ["yellow", "blue"] },
  { bg: "purple", shirt: "pink", patches: ["orange", "yellow"] },
  { bg: "orange", shirt: "blue", patches: ["red", "yellow"] },
];

const CHARS: Character[] = content.characters.map((c, i) => ({
  name: c.name,
  age: c.age,
  mood: c.mood,
  ...CHAR_VISUALS[i],
}));

// Soft tinted "stage" backgrounds for the monogram tile (calm, not saturated).
const STAGE = {
  orange: "bg-doodle-orange/15",
  blue: "bg-doodle-blue/15",
  yellow: "bg-doodle-yellow/30",
  purple: "bg-doodle-purple/15",
  red: "bg-doodle-red/12",
  pink: "bg-doodle-pink/18",
} as const;

const MONO = {
  orange: "bg-doodle-orange",
  blue: "bg-doodle-blue",
  yellow: "bg-doodle-yellow",
  purple: "bg-doodle-purple",
  red: "bg-doodle-red",
  pink: "bg-doodle-pink",
} as const;

// Monogram text colour — readable on the tile fill.
const MONO_TEXT = {
  orange: "text-doodle-stitch",
  blue: "text-doodle-stitch",
  yellow: "text-doodle-ink",
  purple: "text-doodle-stitch",
  red: "text-doodle-stitch",
  pink: "text-doodle-stitch",
} as const;

// Maps to the locked CSS custom props so SVG fills read the same tokens as
// `bg-doodle-*` (no drifted literal hexes).
const FILL_VAR = {
  orange: "var(--color-doodle-orange)",
  blue: "var(--color-doodle-blue)",
  yellow: "var(--color-doodle-yellow)",
  purple: "var(--color-doodle-purple)",
  red: "var(--color-doodle-red)",
  pink: "var(--color-doodle-pink)",
} as const;

export function CharacterStrip() {
  // duplicate the source set for seamless marquee
  const reel = [...CHARS, ...CHARS];

  return (
    <section
      id="characters"
      className="relative py-20 md:py-24 overflow-hidden bg-doodle-canvas"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 mb-10">
        <Eyebrow variant="rule" accent="orange">
          {content.eyebrow}
        </Eyebrow>
        <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink max-w-3xl">
          {content.headlineLead}{" "}
          <span className="italic text-doodle-orange">{content.headlineEmphasis}</span>{" "}
          {content.headlineEnd}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-doodle-ink/70">
          {content.body}
        </p>
      </div>

      <div
        className="relative w-full select-none"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <VelocityMarquee>
          {reel.map((c, i) => (
            <CharacterCard key={`${c.name}-${i}`} c={c} />
          ))}
        </VelocityMarquee>
      </div>
    </section>
  );
}

/**
 * Marquee whose speed is modulated by page scroll velocity.
 * Stays at base speed when idle, accelerates in scroll direction when user
 * scrolls.
 */
function VelocityMarquee({ children }: { children: React.ReactNode }) {
  const baseVelocity = -2; // px/frame at 60fps, negative = leftward
  const reduce = useReducedMotion();

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(
    smoothVelocity,
    [0, 1000],
    [0, 4],
    { clamp: false },
  );

  // x value as a percentage — wraps at -50% (since reel is doubled)
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_t, delta) => {
    if (reduce) return; // skip animation entirely for reduced-motion users

    let moveBy = baseVelocity * (delta / 1000); // base pixels this frame
    // Scroll velocity adds in the direction of scroll
    moveBy += moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy * 0.05); // 0.05 scales px → %
  });

  return (
    <motion.ul
      className="flex gap-5 will-change-transform"
      style={{ x }}
    >
      {children}
    </motion.ul>
  );
}

function CharacterCard({ c }: { c: Character }) {
  const initial = c.name.replace(/[^A-Za-z]/g, "").charAt(0).toUpperCase();

  return (
    <li className="relative shrink-0 w-[260px] md:w-[300px] rounded-[1rem] bg-doodle-stitch p-6 shadow-card flex flex-col items-center text-center">
      {/* Designed "portrait" — soft tinted stage + monogram tile (no smiley) */}
      <div
        className={`relative grid h-32 w-full place-items-center rounded-[0.75rem] ${STAGE[c.bg]}`}
      >
        <div
          className={`grid h-20 w-20 place-items-center rounded-[0.75rem] ${MONO[c.bg]} shadow-subtle`}
        >
          <span className={`font-display text-3xl leading-none ${MONO_TEXT[c.bg]}`}>
            {initial}
          </span>
        </div>
      </div>

      {/* Base-tee SVG — SOLID strokes (dashed purged), clean patches */}
      <svg viewBox="0 0 200 180" className="mt-5 w-40 h-36" aria-hidden>
        <path
          d="M 50 32 L 80 18 Q 100 32 120 18 L 150 32 L 168 56 L 144 72 L 144 158 Q 100 168 56 158 L 56 72 L 32 56 Z"
          fill={FILL_VAR[c.shirt]}
          stroke="var(--color-doodle-stitch)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Two patches on tee — solid, soft */}
        <circle
          cx="100"
          cy="84"
          r="22"
          fill={FILL_VAR[c.patches[0]]}
          stroke="var(--color-doodle-stitch)"
          strokeWidth="2.5"
        />
        <rect
          x="120"
          y="118"
          width="32"
          height="32"
          rx="9"
          fill={FILL_VAR[c.patches[1]]}
          stroke="var(--color-doodle-stitch)"
          strokeWidth="2.5"
        />
      </svg>

      {/* Name + mood — clean sans, one orange accent chip for the age */}
      <div className="mt-2 flex flex-col items-center gap-1.5">
        <div className="font-display text-xl text-doodle-ink leading-tight">
          {c.name}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-doodle-orange/12 px-2.5 py-0.5 text-xs font-semibold text-doodle-orange">
            Age {c.age}
          </span>
          <span className="text-xs font-medium text-doodle-ink/55">{c.mood}</span>
        </div>
      </div>
    </li>
  );
}
