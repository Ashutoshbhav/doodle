/* ============================================================
   PatchMath — stat strip section
   Refero anchor: Agence Foudre (display type 230px / 0.7 line-height)
                  + Family (display 68px treated as headline-object)
   Purpose: the math of the product IS the pitch. Five numbers that
   collapse "modular kidswear" into a memorable equation.
   Position: between PatchWall and CharacterStrip.
   ============================================================ */

import { ScrollReveal } from "@/components/motion";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Stat = {
  value: string;
  label: string;
  /** Optional ink-tint accent on the numeral itself. Defaults to ink. */
  tone?: "ink" | "blue" | "red" | "purple" | "pink";
};

const STATS: Stat[] = [
  { value: "200+", label: "patches" },
  { value: "2", label: "base colours", tone: "blue" },
  { value: "1", label: "tee", tone: "red" },
  { value: "5", label: "looks", tone: "purple" },
  { value: "∞", label: "outfits", tone: "pink" },
];

const TONE_CLASS: Record<NonNullable<Stat["tone"]>, string> = {
  ink: "text-doodle-ink",
  blue: "text-doodle-blue",
  red: "text-doodle-red",
  purple: "text-doodle-purple",
  pink: "text-doodle-pink",
};

export function PatchMath() {
  return (
    <section
      id="patch-math"
      className="relative bg-[color:var(--color-surface-parchment)] border-y-2 border-dashed border-doodle-ink/15"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-14 md:py-20">
        {/* Eyebrow — sets up the equation framing */}
        <ScrollReveal direction="up" amount={0.1}>
          <div className="flex items-center justify-between mb-10 md:mb-14">
            <Eyebrow variant="mono">
              Patch math
            </Eyebrow>
            <div
              className="text-xl md:text-2xl text-doodle-ink/70 hidden sm:block"
              style={{ fontFamily: "var(--font-caveat)" }}
            >
              the maths of the modular wardrobe
            </div>
          </div>
        </ScrollReveal>

        {/* Stat grid — 5 columns on desktop, 2-col zigzag on mobile.
            Numerals in Bricolage 900 at 14vw, line-height 0.85.
            Each numeral uses one palette accent; orange held in reserve
            for CTAs only per orange-discipline rule. */}
        <ScrollReveal direction="up" amount={0.15} delay={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10 md:gap-y-14 items-end">
            {STATS.map((stat, i) => {
              const isInfinity = stat.value === "∞";
              const isOrphan = i === STATS.length - 1 && STATS.length % 2 !== 0;

              const numeralNode = (
                <span
                  className={`
                    font-display leading-[0.85] tracking-[-0.04em] inline-block
                    ${TONE_CLASS[stat.tone ?? "ink"]}
                  `}
                  style={{
                    fontWeight: 900,
                    fontSize: "clamp(3rem, 9vw, 7.5rem)",
                    fontStretch: "115%",
                  }}
                >
                  {stat.value}
                </span>
              );

              return (
                <div
                  key={stat.label}
                  className={`
                    flex flex-col items-start
                    ${isOrphan ? "col-span-2 sm:col-span-1 items-center sm:items-start" : ""}
                  `}
                >
                  {/* The ∞ punchline gets a hand-drawn pink ring via inline
                      SVG (not rough-notation — its overlay positions wrong
                      inside transformed motion parents). Stroke uses two
                      slightly offset ellipses to mimic the sketch quality. */}
                  {isInfinity ? (
                    <span className="relative inline-block">
                      {numeralNode}
                      <svg
                        aria-hidden
                        className="absolute -inset-x-4 -inset-y-3 pointer-events-none"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <ellipse
                          cx="50"
                          cy="50"
                          rx="46"
                          ry="40"
                          fill="none"
                          stroke="var(--color-doodle-pink)"
                          strokeWidth="1.2"
                          strokeDasharray="0.4 1.6"
                          strokeLinecap="round"
                          transform="rotate(-3 50 50)"
                          opacity="0.85"
                        />
                        <ellipse
                          cx="50"
                          cy="50"
                          rx="44"
                          ry="38"
                          fill="none"
                          stroke="var(--color-doodle-pink)"
                          strokeWidth="0.9"
                          strokeDasharray="0.3 1.8"
                          strokeLinecap="round"
                          transform="rotate(2 50 50)"
                          opacity="0.6"
                        />
                      </svg>
                    </span>
                  ) : (
                    numeralNode
                  )}
                  <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-doodle-ink/70">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Punchline — caveat handwritten kicker */}
        <ScrollReveal direction="up" amount={0.2} delay={0.1}>
          <div className="mt-10 md:mt-14 flex items-center justify-end">
            <div
              className="text-2xl md:text-3xl text-doodle-ink/75 max-w-md text-right"
              style={{ fontFamily: "var(--font-caveat)" }}
            >
              one tee. five looks. a hundred Monday mornings.
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
