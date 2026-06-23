/* ============================================================
   PatchMath — stat strip section
   Refero anchor: Agence Foudre (display type 230px / 0.7 line-height)
                  + Family (display 68px treated as headline-object)
   Purpose: the math of the product IS the pitch. Five numbers that
   collapse "modular kidswear" into a memorable equation.
   Position: between PatchWall and CharacterStrip.

   Fill pass: the big numerals sat in a large parchment void. Each
   stat now carries a real PatchShape charm above its numeral (so
   the equation reads as patches → maths), and the punchline shares
   its row with a small scattered patch cluster instead of empty
   space. Vertical padding tightened (py-12/py-16).
   ============================================================ */

import { ScrollReveal } from "@/components/motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PatchShape, type PatchKey } from "@/components/ui/PatchShape";
import { patchMath as content } from "@/content/home";

type Stat = {
  value: string;
  label: string;
  /** Optional ink-tint accent on the numeral itself. Defaults to ink. */
  tone?: "ink" | "blue" | "red" | "purple" | "pink";
};

const STATS: readonly Stat[] = content.stats;

const TONE_CLASS: Record<NonNullable<Stat["tone"]>, string> = {
  ink: "text-doodle-ink",
  blue: "text-doodle-blue",
  red: "text-doodle-red",
  purple: "text-doodle-purple",
  pink: "text-doodle-pink",
};

// One on-brand silicone-charm per stat — visual shorthand for the
// number it sits above (patches / colours / tee / looks / outfits).
const STAT_PATCH: PatchKey[] = ["star", "drop", "smile", "lightning", "heart"];

// Small scattered cluster that fills the punchline row's empty side.
const PUNCH_CLUSTER: { key: PatchKey; size: number; tilt: number }[] = [
  { key: "rocket", size: 46, tilt: -8 },
  { key: "sun", size: 38, tilt: 6 },
  { key: "flower", size: 42, tilt: -3 },
  { key: "moon", size: 34, tilt: 10 },
];

export function PatchMath() {
  return (
    <section
      id="patch-math"
      className="relative bg-[color:var(--color-surface-parchment)] border-y border-doodle-ink/10"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-12 md:py-16">
        {/* Eyebrow — sets up the equation framing */}
        <ScrollReveal direction="up" amount={0.1}>
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <Eyebrow variant="rule" accent="ink">
              {content.eyebrow}
            </Eyebrow>
            <div
              className="text-xl md:text-2xl text-doodle-ink/70 hidden sm:block"
              style={{ fontFamily: "var(--font-caveat)" }}
            >
              {content.kicker}
            </div>
          </div>
        </ScrollReveal>

        {/* Stat grid — 5 columns on desktop, 2-col zigzag on mobile.
            Numerals in Bricolage 900; each carries its own patch charm
            above so the empty space reads as the equation, not a void.
            Orange held in reserve for CTAs only per orange-discipline. */}
        <ScrollReveal direction="up" amount={0.15} delay={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8 md:gap-y-10 items-end">
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
                  {/* Charm above the numeral — fills the column head + ties
                      the abstract number back to a real patch. */}
                  <span className="mb-3 inline-block drop-shadow-[0_3px_6px_rgba(26,26,26,0.12)]">
                    <PatchShape patch={STAT_PATCH[i % STAT_PATCH.length]} size={44} />
                  </span>

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
                  <span className="mt-2 text-xs font-semibold uppercase tracking-[0.1em] text-doodle-ink/55">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Punchline — caveat handwritten kicker, paired with a small
            scattered patch cluster so the row is balanced, not empty. */}
        <ScrollReveal direction="up" amount={0.2} delay={0.1}>
          <div className="mt-10 md:mt-12 flex flex-col-reverse items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1">
              {PUNCH_CLUSTER.map((c) => (
                <span
                  key={c.key}
                  className="-ml-2 inline-block first:ml-0 drop-shadow-[0_3px_6px_rgba(26,26,26,0.12)]"
                  style={{ transform: `rotate(${c.tilt}deg)` }}
                >
                  <PatchShape patch={c.key} size={c.size} />
                </span>
              ))}
            </div>
            <div
              className="text-2xl md:text-3xl text-doodle-ink/75 max-w-md text-left sm:text-right"
              style={{ fontFamily: "var(--font-caveat)" }}
            >
              {content.punchline}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
