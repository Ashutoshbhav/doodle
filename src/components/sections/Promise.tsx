import {
  PuzzlePiece,
  Recycle,
  ArrowsClockwise,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import { ScrollReveal, MagneticHover, ParallaxLayer } from "@/components/motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DoodleMark } from "@/components/ui/DoodleMark";
import { PatchShape, type PatchKey } from "@/components/ui/PatchShape";
import { promise as content } from "@/content/home";

/* ============================================================
   PROMISE v2 — "premium, but for kids" (Dialog-discipline lift)

   Was: 3 saturated colour-fill cards on dashed-stitch borders +
   mono number chips + mono "more on this" link + dashed section rule.
   Now: 3 calm cream cards on soft warm-ink shadow; each carries a
   QUIET brand colour-block + a colour-tinted icon tile for warmth
   (NOT a full saturated fill). One orange accent per section lives in
   the headline emphasis. Mono purged; clean sans labels. Radius ≤16px.
   ============================================================ */

// Icons are structural (not copy); title/body come from content.pillars
const PILLAR_ICONS = [PuzzlePiece, Recycle, ArrowsClockwise] as const;

// A small patch trio per pillar — tactile brand objects that fill the card
// foot. First key is the hero patch on the stage; the rest float quietly.
const PILLAR_PATCHES: readonly [PatchKey, PatchKey, PatchKey][] = [
  ["star", "lightning", "heart"],
  ["rocket", "moon", "sun"],
  ["smile", "flower", "diamond"],
];

const PILLARS = content.pillars.map((p, i) => ({
  color: p.color,
  Icon: PILLAR_ICONS[i],
  patches: PILLAR_PATCHES[i],
  title: p.title,
  body: p.body,
}));

// Per-pillar warmth: a quiet colour-block behind the card + a tinted icon
// tile. Surface stays cream; the colour is an accent, never the whole card.
const ACCENT = {
  orange: {
    block: "bg-doodle-orange/15",
    iconBg: "bg-doodle-orange/12",
    iconText: "text-doodle-orange",
    link: "group-hover:text-doodle-orange",
  },
  blue: {
    block: "bg-doodle-blue/15",
    iconBg: "bg-doodle-blue/12",
    iconText: "text-doodle-blue",
    link: "group-hover:text-doodle-blue",
  },
  purple: {
    block: "bg-doodle-purple/15",
    iconBg: "bg-doodle-purple/12",
    iconText: "text-doodle-purple",
    link: "group-hover:text-doodle-purple",
  },
} as const;

export function Promise() {
  return (
    <section
      id="promise"
      className="relative overflow-hidden py-20 md:py-24 bg-[color:var(--color-surface-blush)]"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* The wordmark's squiggle, hand-drawn — marks the brand-story beat */}
        <div className="mb-10 flex justify-center md:mb-12">
          <DoodleMark kind="squiggle" sway className="w-16 text-doodle-ink/25" />
        </div>
        <ScrollReveal direction="up">
          <div className="max-w-3xl">
            <Eyebrow variant="rule" accent="orange">
              {content.eyebrow}
            </Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              {content.headlineLead}{" "}
              <span className="italic text-doodle-orange">{content.headlineEmphasis}</span>{" "}
              {content.headlineMid}{" "}
              <span className="relative inline-block">
                <span className="relative z-10">{content.headlineUnderline}</span>
                <ParallaxLayer speed={-0.15} className="absolute inset-x-0 bottom-1 h-3 -z-0">
                  <span
                    aria-hidden
                    className="block h-full bg-doodle-yellow/80 -rotate-1"
                  />
                </ParallaxLayer>
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-doodle-ink/70">
              {content.body}
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PILLARS.map(({ color, Icon, patches, title, body }, i) => {
            const a = ACCENT[color];
            return (
              <ScrollReveal key={title} direction="up" delay={0.1 + i * 0.12}>
                <MagneticHover strength={0.1}>
                  <div className="group relative">
                    {/* Quiet brand colour-block behind the card — warmth as
                        intentional composition, not a saturated fill. */}
                    <div
                      aria-hidden
                      className={`absolute -right-3 -top-3 h-20 w-20 rounded-[1rem] ${a.block}`}
                    />

                    <article
                      className="relative isolate flex min-h-[360px] flex-col gap-5 overflow-hidden rounded-[1rem] bg-card p-7 shadow-card transition-shadow duration-200 hover:shadow-card-hover sm:p-8"
                    >
                      {/* Quiet step index — clean sans, not mono */}
                      <span className="absolute right-6 top-6 font-display text-sm font-semibold text-doodle-ink/25">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      {/* Patch-on-stage — the hero silicone patch sits on a soft
                          tinted tile; the icon shrinks to a quiet corner marker.
                          This is the tactile brand object, not a flat icon. */}
                      <div
                        className={`relative z-10 grid h-20 w-20 place-items-center rounded-[0.85rem] ${a.iconBg}`}
                      >
                        <PatchShape patch={patches[0]} size={54} />
                        <span
                          className={`absolute -bottom-2 -right-2 grid h-7 w-7 place-items-center rounded-full bg-card shadow-subtle ${a.iconText}`}
                        >
                          <Icon weight="bold" size={15} />
                        </span>
                      </div>

                      <div className="relative z-10">
                        <h3 className="font-display text-2xl leading-tight tracking-[-0.01em] text-doodle-ink">
                          {title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-doodle-ink/70">
                          {body}
                        </p>
                      </div>

                      {/* Card foot — a quiet patch trio + the link. Fills the
                          space that used to read empty; reads as the patches you
                          swap onto the tee. */}
                      <div className="relative z-10 mt-auto flex items-center justify-between border-t border-doodle-ink/10 pt-4">
                        <div className="flex items-center">
                          {patches.map((p, pi) => (
                            <span
                              key={p}
                              className="-ml-2 inline-grid h-9 w-9 place-items-center rounded-full bg-doodle-canvas shadow-subtle ring-2 ring-card first:ml-0"
                              style={{ zIndex: 3 - pi }}
                            >
                              <PatchShape patch={p} size={26} />
                            </span>
                          ))}
                        </div>
                        <div
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold text-doodle-ink/55 transition-colors ${a.link}`}
                        >
                          {content.moreOnThis}
                          <ArrowUpRight weight="bold" size={12} />
                        </div>
                      </div>
                    </article>
                  </div>
                </MagneticHover>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
