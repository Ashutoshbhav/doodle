import {
  PuzzlePiece,
  Recycle,
  ArrowsClockwise,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import { ScrollReveal, MagneticHover, ParallaxLayer } from "@/components/motion";
import { Eyebrow } from "@/components/ui/Eyebrow";

const PILLARS = [
  {
    color: "orange",
    Icon: PuzzlePiece,
    title: "Patches change. Tee stays.",
    body: "Pink one Monday. Blue one Friday. Stars one week, lightning the next. The shirt is the constant. The character is the variable.",
  },
  {
    color: "blue",
    Icon: Recycle,
    title: "One tee instead of five.",
    body: "Three Avengers tees, two Pokémon tees, half a wardrobe that already doesn't count anymore. We replaced all of that with one shirt and a small pile of patches.",
  },
  {
    color: "purple",
    Icon: ArrowsClockwise,
    title: "Outgrows phases, not the shirt.",
    body: "Pokémon phase: March. Iron Man phase: June. Dinosaurs by August. Same tee through all of it — the obsession changes, the tee doesn't have to.",
  },
] as const;

const SURFACE = {
  orange: {
    bg: "bg-doodle-orange",
    text: "text-doodle-stitch",
    iconBg: "bg-doodle-stitch/15",
    iconText: "text-doodle-stitch",
    chip: "text-doodle-stitch/85",
  },
  blue: {
    bg: "bg-doodle-blue",
    text: "text-doodle-stitch",
    iconBg: "bg-doodle-stitch/15",
    iconText: "text-doodle-stitch",
    chip: "text-doodle-stitch/85",
  },
  purple: {
    bg: "bg-doodle-purple",
    text: "text-doodle-stitch",
    iconBg: "bg-doodle-stitch/15",
    iconText: "text-doodle-stitch",
    chip: "text-doodle-stitch/85",
  },
} as const;

export function Promise() {
  return (
    <section
      id="promise"
      className="relative border-b-2 border-dashed border-doodle-ink/15 py-24 md:py-32 bg-[color:var(--color-surface-blush)]"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <ScrollReveal direction="up">
          <div className="max-w-3xl">
            <Eyebrow variant="rule" accent="orange">
              The DOODLE promise
            </Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              Built for{" "}
              <span className="italic text-doodle-orange">play.</span>{" "}
              Built to{" "}
              <span className="relative inline-block">
                <span className="relative z-10">last.</span>
                <ParallaxLayer speed={-0.15} className="absolute inset-x-0 bottom-1 h-3 -z-0">
                  <span
                    aria-hidden
                    className="block h-full bg-doodle-yellow/80 -rotate-1"
                  />
                </ParallaxLayer>
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-doodle-ink/70">
              Three things we kept watching happen. Three things DOODLE answers.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PILLARS.map(({ color, Icon, title, body }, i) => {
            const s = SURFACE[color];
            return (
              <ScrollReveal key={title} direction="up" delay={0.1 + i * 0.12}>
                <MagneticHover strength={0.12}>
                  <article
                    className={`
                      relative isolate overflow-hidden rounded-[1rem] p-7 sm:p-8
                      ${s.bg} stitch-thick
                      flex flex-col gap-6 min-h-[280px]
                    `}
                  >
                {/* Number chip */}
                <span
                  className={`absolute top-5 right-5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] ${s.chip} bg-doodle-ink/15`}
                >
                  {String(i + 1).padStart(2, "0")} / 03
                </span>

                {/* Decorative scribble */}
                <DecorativeScribble color={color} />

                <div
                  className={`grid place-items-center h-14 w-14 rounded-lg ${s.iconBg} ${s.iconText} relative z-10`}
                >
                  <Icon weight="duotone" size={30} />
                </div>

                    <div className="relative z-10 mt-auto">
                      <h3
                        className={`font-display text-2xl leading-tight tracking-[-0.01em] ${s.text}`}
                      >
                        {title}
                      </h3>
                      <p className={`mt-3 text-sm leading-relaxed ${s.text}/85`}>
                        {body}
                      </p>
                      <div
                        className={`mt-5 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.18em] ${s.chip}`}
                      >
                        More on this
                        <ArrowUpRight weight="bold" size={12} />
                      </div>
                    </div>
                  </article>
                </MagneticHover>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DecorativeScribble({
  color,
}: {
  color: "orange" | "blue" | "purple";
}) {
  // Each pillar gets a different doodle in the bottom-right corner
  if (color === "orange") {
    return (
      <svg
        aria-hidden
        className="absolute -right-8 -bottom-6 opacity-25"
        width="180"
        height="180"
        viewBox="0 0 180 180"
      >
        <path
          d="M 20 80 Q 50 30 90 60 Q 140 100 100 140 Q 60 160 30 130"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (color === "blue") {
    return (
      <svg
        aria-hidden
        className="absolute -right-6 -bottom-8 opacity-25"
        width="200"
        height="200"
        viewBox="0 0 200 200"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <circle
            key={i}
            cx={60 + i * 24}
            cy={140}
            r={8 - i}
            fill="white"
          />
        ))}
        <path
          d="M 20 100 Q 60 50 120 80 T 200 70"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 6"
        />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden
      className="absolute -right-4 -bottom-4 opacity-25"
      width="160"
      height="160"
      viewBox="0 0 160 160"
    >
      <path
        d="M 30 130 Q 30 80 60 60 Q 90 40 90 80 Q 90 130 130 130"
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="60" cy="60" r="6" fill="white" />
      <circle cx="130" cy="130" r="6" fill="white" />
    </svg>
  );
}
