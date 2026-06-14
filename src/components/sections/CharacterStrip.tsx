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
import { Smiley, SmileyXEyes, SmileyWink, SmileyMelting, SmileyNervous } from "@phosphor-icons/react/dist/ssr";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { characterStrip as content } from "@/content/home";

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
  Face: typeof Smiley;
  mood: string;
};

// [PLACEHOLDER] character set — Ash will replace with the real illustrated kids
// Visual data (colors, face icons) lives here; name/age/mood come from content.
const CHAR_VISUALS: {
  bg: CharColor;
  shirt: CharColor;
  patches: [CharColor, CharColor];
  Face: typeof Smiley;
}[] = [
  { bg: "yellow", shirt: "orange", patches: ["blue", "purple"], Face: Smiley },
  { bg: "blue", shirt: "yellow", patches: ["pink", "red"], Face: SmileyWink },
  { bg: "pink", shirt: "purple", patches: ["yellow", "blue"], Face: SmileyMelting },
  { bg: "purple", shirt: "pink", patches: ["orange", "yellow"], Face: SmileyXEyes },
  { bg: "orange", shirt: "blue", patches: ["red", "yellow"], Face: SmileyNervous },
];

const CHARS: Character[] = content.characters.map((c, i) => ({
  name: c.name,
  age: c.age,
  mood: c.mood,
  ...CHAR_VISUALS[i],
}));

const BG = {
  orange: "bg-doodle-orange",
  blue: "bg-doodle-blue",
  yellow: "bg-doodle-yellow",
  purple: "bg-doodle-purple",
  red: "bg-doodle-red",
  pink: "bg-doodle-pink",
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
      className="relative border-b-2 border-dashed border-doodle-ink/15 py-20 md:py-24 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 mb-10">
        <Eyebrow variant="rule" accent="orange">
          {content.eyebrow}
        </Eyebrow>
        <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink max-w-3xl">
          {content.headlineLead}{" "}
          <span className="italic text-doodle-orange">{content.headlineEmphasis}</span>{" "}
          {content.headlineEnd}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-doodle-ink/70">
          {/* [PLACEHOLDER] supporting copy */}
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
 * scrolls. Lusion-tier signature interaction.
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
  const Face = c.Face;
  return (
    <li
      className={`
        relative shrink-0 w-[260px] md:w-[300px] rounded-[1rem]
        ${BG[c.bg]} border-[3px] border-dashed border-doodle-stitch
        p-6 flex flex-col items-center text-center
      `}
    >
      {/* Face */}
      <div className="relative h-32 w-32 grid place-items-center">
        <div className="absolute inset-0 rounded-full bg-doodle-stitch/35" />
        <Face
          weight="duotone"
          size={86}
          className="relative text-doodle-ink"
        />
      </div>

      {/* T-shirt */}
      <svg
        viewBox="0 0 200 180"
        className="mt-4 w-44 h-40"
        aria-hidden
      >
        <path
          d="M 50 32 L 80 18 Q 100 32 120 18 L 150 32 L 168 56 L 144 72 L 144 158 Q 100 168 56 158 L 56 72 L 32 56 Z"
          fill={FILL_VAR[c.shirt]}
          stroke="white"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M 50 32 L 80 18 Q 100 32 120 18 L 150 32 L 168 56 L 144 72 L 144 158 Q 100 168 56 158 L 56 72 L 32 56 Z"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          transform="scale(0.94) translate(6.4, 6)"
        />
        {/* Two patches on tee */}
        <circle cx="100" cy="84" r="22" fill={FILL_VAR[c.patches[0]]} stroke="white" strokeWidth="2.5" strokeDasharray="3 4" />
        <rect
          x="120"
          y="118"
          width="32"
          height="32"
          rx="9"
          fill={FILL_VAR[c.patches[1]]}
          stroke="white"
          strokeWidth="2.5"
          strokeDasharray="3 4"
        />
      </svg>

      {/* Name + mood */}
      <div className="mt-2">
        <div className="font-display text-xl text-doodle-stitch">
          {c.name}, {c.age}
        </div>
        <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-doodle-stitch/80">
          {c.mood}
        </div>
      </div>
    </li>
  );
}
