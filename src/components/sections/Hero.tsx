import {
  ArrowDown,
  Sparkle,
  Lightning,
  FireSimple,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import { PatchScrubber } from "@/components/ui/PatchScrubber";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { RoughHighlight } from "@/components/ui/Rough";
import { ScrollReveal, ParallaxLayer, MagneticHover } from "@/components/motion";

/* ============================================================
   HERO v3 — split-color campaign layout
   Left half: saturated red campaign zone (Souled Store energy)
   Right half: cream product stage with the live demo
   Bleeds edge-to-edge. Intentionally unmistakable from prior cream-canvas hero.
   ============================================================ */

const PATCH_LANES = [
  { label: "Originals", color: "bg-doodle-pink text-doodle-stitch" },
  { label: "Animals", color: "bg-doodle-blue text-doodle-stitch" },
  { label: "Letters", color: "bg-doodle-yellow text-doodle-ink" },
  { label: "Superhero", color: "bg-doodle-red text-doodle-stitch" },
  { label: "Anime", color: "bg-doodle-purple text-doodle-stitch" },
  { label: "Sweet Treats", color: "bg-doodle-orange text-doodle-stitch" },
];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden"
    >
      {/* ============================================================
          DROP BANNER — top strip, streetwear drop energy
          ============================================================ */}
      <div className="relative bg-doodle-ink text-doodle-stitch">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.28em]">
            <span className="inline-flex items-center gap-1.5">
              <FireSimple weight="fill" size={11} className="text-doodle-yellow" />
              First drop
            </span>
            <span className="opacity-30 hidden sm:inline">/</span>
            <span className="hidden sm:inline">200 tees</span>
            <span className="opacity-30 hidden sm:inline">/</span>
            <span className="hidden md:inline">Bangalore</span>
            <span className="opacity-30 hidden md:inline">/</span>
            <span className="hidden md:inline">May 2026</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-[0.28em] text-doodle-stitch/55">
              Doodle by Canvas
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-doodle-stitch/35 text-doodle-stitch px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.22em]">
              <span className="h-1.5 w-1.5 rounded-full bg-doodle-yellow animate-pulse" />
              Live waitlist
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================
          MAIN STAGE — split-color 7/5 grid (lg+), stacked on mobile
          ============================================================ */}
      <div className="grid lg:grid-cols-12 min-h-[88vh]">
        {/* ---------- LEFT 7 — RED CAMPAIGN ZONE ---------- */}
        <div className="relative lg:col-span-7 bg-doodle-red text-doodle-stitch overflow-hidden">
          {/* Decorative scribbles — parallax behind text for depth */}
          <ParallaxLayer speed={0.35} className="absolute inset-0 pointer-events-none">
            <DecorativeLeft />
          </ParallaxLayer>

          <ScrollReveal direction="up" amount={0.1} className="relative z-10 h-full flex flex-col justify-center px-6 md:px-10 lg:px-16 xl:px-24 py-20 lg:py-24">
            {/* Eyebrow */}
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-doodle-stitch/75">
              India&rsquo;s first modular kidswear
            </div>

            {/* MEGA H1
                Two-register treatment per design-supervisor audit:
                Lines 1-2 in Bricolage 900 (paragraph-shaped headline)
                Line 3 in Bagel Fat One at 16vw (type-as-object stamp).
                Anchor: Agence Foudre (Beni 230px / 0.7 line-height).
                Reserved Bagel use — do not propagate elsewhere. */}
            <h1
              className="mt-5 font-display text-doodle-stitch leading-[0.84] tracking-[-0.04em]"
              style={{
                fontWeight: 900,
                fontSize: "clamp(3.4rem, 9vw, 8rem)",
                fontStretch: "115%",
              }}
            >
              <span className="block uppercase">Don&rsquo;t Just</span>
              <span className="block uppercase">Dress.</span>
            </h1>
            <div className="mt-1 lg:mt-2 relative inline-block">
              {/* Hand-drawn yellow marker swipe via rough-notation.
                  Draws on mount with a 900ms sketch animation. */}
              <RoughHighlight on="mount" strokeWidth={42} padding={0}>
                <span
                  className="relative z-10 block uppercase text-doodle-stitch leading-[0.78]"
                  style={{
                    fontFamily: "var(--font-bagel)",
                    fontSize: "clamp(4.5rem, 13vw, 10rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Create.
                </span>
              </RoughHighlight>
            </div>

            {/* Sub */}
            <p className="mt-8 max-w-xl text-2xl md:text-[1.65rem] leading-[1.15] text-doodle-stitch font-display tracking-[-0.01em]">
              Kids don&rsquo;t outgrow clothes.{" "}
              <span className="italic text-doodle-stitch/75">
                They outgrow characters.
              </span>
            </p>

            {/* Body */}
            <p className="mt-5 max-w-lg text-base md:text-lg leading-relaxed text-doodle-stitch/85">
              A t-shirt with velcro panels and a growing universe of
              patches your child swaps whenever they feel like it. One
              tee. Infinite personalities.
            </p>

            {/* CTA */}
            <div className="mt-9 max-w-md">
              <WaitlistForm accent="orange" surface="tile" />
            </div>

            {/* Microproof */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-mono uppercase tracking-[0.22em] text-doodle-stitch/75">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-doodle-tee-pink border border-doodle-stitch/30" />
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-doodle-tee-blue border border-doodle-stitch/30" />
                <span>2 base colours</span>
              </span>
              <span className="opacity-40">/</span>
              <span>Sizes 3&ndash;6 yrs</span>
              <span className="opacity-40">/</span>
              <span>From &#8377;370</span>
            </div>
          </ScrollReveal>
        </div>

        {/* ---------- RIGHT 5 — CREAM PRODUCT STAGE ---------- */}
        <div className="relative lg:col-span-5 bg-doodle-canvas overflow-hidden">
          {/* Background warmth */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(60% 50% at 50% 30%, rgba(212,168,0,0.22), transparent 70%)",
            }}
          />

          {/* Floating "live demo" tab */}
          <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-10 lg:px-12 py-16 lg:py-12">
            <div className="flex items-center justify-between mb-5">
              <span
                className="text-2xl text-doodle-ink"
                style={{ fontFamily: "var(--font-caveat)" }}
              >
                try it &darr;
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-doodle-ink text-doodle-stitch px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.22em]">
                <Lightning weight="fill" size={10} className="text-doodle-yellow" />
                Live demo
              </span>
            </div>

            <MagneticHover strength={0.06} className="relative">
              {/* Stacked colour blocks behind the frame */}
              <div
                aria-hidden
                className="absolute inset-x-2 inset-y-1 rounded-[2.4rem] bg-doodle-yellow"
              />
              <div
                aria-hidden
                className="absolute inset-x-6 inset-y-5 rounded-[2.2rem] bg-doodle-pink/85 -rotate-1"
              />

              {/* Frame */}
              <div className="relative rounded-[2rem] bg-doodle-stitch p-4 sm:p-5 stitch-thick !border-doodle-ink shadow-[14px_16px_0_rgba(26,26,26,0.18)] mx-1 my-2">
                <PatchScrubber />
              </div>

              {/* Floating product chip */}
              <span className="absolute -top-3 -right-3 inline-flex items-center gap-1.5 rounded-full bg-doodle-ink text-doodle-stitch px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.22em] border-2 border-dashed border-doodle-stitch rotate-[6deg] shadow-[3px_3px_0_rgba(212,168,0,0.6)]">
                <Sparkle weight="fill" size={11} className="text-doodle-yellow" />
                Real product
              </span>
            </MagneticHover>
          </div>
        </div>
      </div>

      {/* ============================================================
          PATCH LANES STRIP — full-bleed bottom band
          ============================================================ */}
      <div className="relative bg-doodle-canvas border-t-2 border-dashed border-doodle-ink/15">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-7">
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-doodle-ink/55">
              Patch lanes
            </div>
            <a
              href="#wall"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-doodle-ink hover:text-doodle-orange transition-colors"
            >
              See all 200+
              <ArrowUpRight weight="bold" size={11} />
            </a>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {PATCH_LANES.map((lane) => (
              <span
                key={lane.label}
                className={`
                  inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
                  border-2 border-dashed border-doodle-stitch shadow-[3px_3px_0_rgba(26,26,26,0.12)]
                  ${lane.color}
                `}
              >
                {lane.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Down indicator */}
      <div className="bg-doodle-canvas pb-6 flex items-center justify-center gap-2 text-doodle-ink/55">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em]">
          keep scrolling
        </span>
        <ArrowDown weight="bold" size={14} className="animate-bounce" />
      </div>
    </section>
  );
}

function DecorativeLeft() {
  return (
    <>
      {/* Big yellow circle */}
      <div
        aria-hidden
        className="absolute -top-12 -right-12 h-56 w-56 rounded-full border-[3px] border-dashed border-doodle-stitch/30"
      />
      {/* Mid orange ring */}
      <div
        aria-hidden
        className="absolute top-1/2 -left-16 h-48 w-48 rounded-full border-[3px] border-dashed border-doodle-stitch/25"
      />
      {/* Squiggle bottom-right */}
      <svg
        aria-hidden
        className="absolute right-6 bottom-12 w-32 h-16 opacity-50"
        viewBox="0 0 120 50"
      >
        <path
          d="M 5 30 Q 25 5, 50 30 T 100 30 T 120 30"
          fill="none"
          stroke="var(--color-doodle-yellow)"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
      {/* Asterisk top-right */}
      <svg
        aria-hidden
        className="absolute top-12 right-12 w-8 h-8 opacity-70"
        viewBox="0 0 32 32"
      >
        <path
          d="M16 4 L16 28 M4 16 L28 16 M7 7 L25 25 M25 7 L7 25"
          stroke="var(--color-doodle-yellow)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
      {/* Star burst bottom-left */}
      <svg
        aria-hidden
        className="absolute bottom-16 left-8 w-12 h-12 opacity-70"
        viewBox="0 0 50 50"
      >
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          const x1 = 25 + Math.cos(a) * 8;
          const y1 = 25 + Math.sin(a) * 8;
          const x2 = 25 + Math.cos(a) * 22;
          const y2 = 25 + Math.sin(a) * 22;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--color-doodle-yellow)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </>
  );
}
