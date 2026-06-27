import {
  ArrowDown,
  Sparkle,
  Lightning,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import { HeroTee } from "@/components/sections/HeroTee";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { RoughHighlight } from "@/components/ui/Rough";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal, MagneticHover } from "@/components/motion";
import { hero as content } from "@/content/home";

/* ============================================================
   HERO v4 — "premium, but for kids" (Dialog-discipline lift)

   Replaces the loud split-color red slab. New direction:
   - One warm cream canvas (DOODLE soul), NOT a saturated red half.
   - Confident editorial type scale on the left; the reserved Bagel
     "Create." remains the ONE oversized stamp (lock honored).
   - The signature PatchScrubber is the hero visual, lifted on soft
     warm-ink shadows + a quiet brand color-block stack (NO dashed,
     NO photo dependency — the live patch interaction is the proof).
   - ONE orange accent per fold (the CTA + the emphasis word).
   - Mono purged; clean sans + Caveat marker carry the labels.
   - Radius capped at 16px; soft shadows replace dashed-on-everything.
   ============================================================ */

const PATCH_LANES = content.patchLanes;

export function Hero() {
  return (
    <section id="hero" className="relative isolate overflow-hidden bg-doodle-canvas">
      {/* ============================================================
          DROP BANNER — slim, calm. Clean sans, not mono. One live dot.
          ============================================================ */}
      <div className="relative border-b border-doodle-ink/10 bg-doodle-canvas">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3 md:px-10">
          <div className="flex items-center gap-2.5 text-xs font-medium text-doodle-ink/70">
            <span className="inline-flex items-center gap-1.5 text-doodle-ink">
              <Sparkle weight="fill" size={13} className="text-doodle-orange" />
              {content.banner.firstDrop}
            </span>
            <span className="hidden text-doodle-ink/25 sm:inline">·</span>
            <span className="hidden sm:inline">{content.banner.tees}</span>
            <span className="hidden text-doodle-ink/25 md:inline">·</span>
            <span className="hidden md:inline">{content.banner.city}</span>
            <span className="hidden text-doodle-ink/25 md:inline">·</span>
            <span className="hidden md:inline">{content.banner.month}</span>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-doodle-stitch px-3 py-1 text-xs font-medium text-doodle-ink shadow-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-doodle-orange" />
            {content.banner.liveWaitlist}
          </span>
        </div>
      </div>

      {/* ============================================================
          MAIN STAGE — editorial 6/5 grid on one cream canvas.
          Left: type + CTA. Right: the live patch demo on soft shadow.
          ============================================================ */}
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-11 lg:gap-10 lg:py-24">
        {/* ---------- LEFT — TYPE + CTA ---------- */}
        <ScrollReveal
          direction="up"
          amount={0.1}
          className="lg:col-span-6"
        >
          <Eyebrow variant="rule" accent="orange">
            {content.eyebrow}
          </Eyebrow>

          {/* MEGA H1 — Bricolage paragraph-headline + the reserved Bagel
              "Create." stamp (lock honored: Bagel stays exclusive to this
              one word). Capped at the DESIGN.md ≤6rem hero ceiling. */}
          <h1 className="mt-6 font-display leading-[0.9] tracking-[-0.035em] text-doodle-ink">
            <span
              className="block"
              style={{ fontWeight: 800, fontSize: "clamp(2.8rem, 6.5vw, 5rem)" }}
            >
              {content.headlineLine1}{" "}
              <span className="text-doodle-ink/45">{content.headlineLine2}</span>
            </span>
            <span className="mt-1 block">
              <RoughHighlight on="mount" strokeWidth={40} padding={0}>
                <span
                  className="relative z-10 inline-block text-doodle-ink"
                  style={{
                    fontFamily: "var(--font-bagel)",
                    fontSize: "clamp(3.6rem, 9vw, 6rem)",
                    letterSpacing: "-0.02em",
                    lineHeight: 0.85,
                  }}
                >
                  {content.headlineStamp}
                </span>
              </RoughHighlight>
            </span>
          </h1>

          {/* Sub — display weight, one orange emphasis clause */}
          <p className="mt-7 max-w-xl font-display text-2xl leading-[1.15] tracking-[-0.01em] text-doodle-ink md:text-[1.6rem]">
            {content.subLead}{" "}
            <span className="italic text-doodle-orange">{content.subEmphasis}</span>
          </p>

          {/* Body */}
          <p className="mt-5 max-w-lg text-base leading-relaxed text-doodle-ink/70 md:text-lg">
            {content.body}
          </p>

          {/* CTA */}
          <div className="mt-9 max-w-md">
            <WaitlistForm accent="orange" surface="canvas" />
          </div>

          {/* Microproof — clean sans pills on soft shadow (no mono, no dashed) */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full bg-doodle-stitch px-3.5 py-2 text-xs font-medium text-doodle-ink/80 shadow-subtle">
              <span className="inline-flex">
                <span className="inline-block h-3 w-3 rounded-full bg-doodle-tee-pink ring-2 ring-doodle-stitch" />
                <span className="-ml-1.5 inline-block h-3 w-3 rounded-full bg-doodle-tee-blue ring-2 ring-doodle-stitch" />
              </span>
              {content.microproof.baseColours}
            </span>
            <span className="inline-flex items-center rounded-full bg-doodle-stitch px-3.5 py-2 text-xs font-medium text-doodle-ink/80 shadow-subtle">
              {content.microproof.sizes}
            </span>
            <span className="inline-flex items-center rounded-full bg-doodle-stitch px-3.5 py-2 text-xs font-semibold text-doodle-ink shadow-subtle">
              {content.microproof.price}
            </span>
          </div>
        </ScrollReveal>

        {/* ---------- RIGHT — LIVE PATCH DEMO ---------- */}
        <div className="relative lg:col-span-5">
          {/* Header row above the stage */}
          <div className="mb-5 flex items-center justify-between">
            <Eyebrow variant="marker" accent="orange">
              {content.tryIt}
            </Eyebrow>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-doodle-ink px-3 py-1.5 text-xs font-medium text-doodle-stitch shadow-subtle">
              <Lightning weight="fill" size={11} className="text-doodle-yellow" />
              {content.liveDemo}
            </span>
          </div>

          <MagneticHover strength={0.05} className="relative">
            {/* Quiet brand color-block stack behind the frame — the hero
                visual built from brand assets, NOT photos. Soft, capped 16px,
                no dashed. Reads as intentional depth, not decoration. */}
            <div
              aria-hidden
              className="absolute -right-3 -top-3 h-32 w-32 rounded-[1rem] bg-doodle-yellow/35"
            />
            <div
              aria-hidden
              className="absolute -bottom-4 -left-4 h-28 w-28 rounded-[1rem] bg-doodle-blue/15"
            />

            {/* Frame — soft card shadow, NOT dashed stitch border */}
            <div className="relative rounded-[1rem] bg-doodle-stitch p-5 shadow-card-hover sm:p-6">
              <HeroTee />

              {/* Floating product chip — soft shadow, no dashed */}
              <span className="absolute -right-3 -top-3 inline-flex rotate-[5deg] items-center gap-1.5 rounded-full bg-doodle-orange px-3 py-1.5 text-xs font-semibold text-doodle-stitch shadow-card">
                <Sparkle weight="fill" size={11} className="text-doodle-yellow" />
                {content.realProduct}
              </span>
            </div>
          </MagneticHover>
        </div>
      </div>

      {/* ============================================================
          PATCH LANES STRIP — soft-shadow chips on a hairline-topped band.
          ============================================================ */}
      <div className="border-t border-doodle-ink/10 bg-doodle-canvas">
        <div className="mx-auto max-w-[1400px] px-6 py-7 md:px-10">
          <div className="mb-4 flex items-center justify-between">
            <Eyebrow variant="rule" accent="ink">
              {content.patchLanesEyebrow}
            </Eyebrow>
            <a
              href="#wall"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-doodle-ink/70 transition-colors hover:text-doodle-orange"
            >
              {content.seeAll}
              <ArrowUpRight weight="bold" size={13} />
            </a>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {PATCH_LANES.map((lane) => (
              <span
                key={lane.label}
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium shadow-subtle transition-shadow hover:shadow-card ${lane.color}`}
              >
                {lane.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Down indicator — clean sans */}
      <div className="flex items-center justify-center gap-2 bg-doodle-canvas pb-7 text-doodle-ink/45">
        <span className="text-xs font-medium">{content.keepScrolling}</span>
        <ArrowDown weight="bold" size={14} className="animate-bounce" />
      </div>
    </section>
  );
}
