import { NavWithCart } from "@/components/sections/NavWithCart";
import { Footer } from "@/components/sections/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { legalCommon, type LegalSection } from "@/content/legal";

/**
 * PolicyPage — shared shell for DOODLE's legal/policy pages
 * (privacy, terms, refunds, shipping). Matches the site design
 * system: blush surface, NavWithCart + Footer, display headline,
 * dashed-border draft notice, mono meta. Contact has its own
 * richer layout and does not use this shell.
 */
export function PolicyPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: readonly LegalSection[];
}) {
  return (
    <>
      <NavWithCart />
      <main className="bg-[color:var(--color-surface-blush)] min-h-screen">
        <section className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-24">
          <Eyebrow variant="rule" accent="orange">
            {eyebrow}
          </Eyebrow>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
            {title}
          </h1>

          {/* Meta row */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-doodle-ink/50">
            <span>
              {legalCommon.effectiveDateLabel}: {legalCommon.effectiveDate}
            </span>
            <span>
              {legalCommon.lastUpdatedLabel}: {legalCommon.lastUpdated}
            </span>
          </div>

          {/* Draft notice */}
          <div className="mt-6 rounded-lg bg-doodle-canvas border-2 border-dashed border-doodle-orange/60 p-4">
            <p className="text-sm leading-relaxed text-doodle-ink/80">
              <span className="font-semibold text-doodle-berry">Draft — </span>
              {legalCommon.draftNotice}
            </p>
          </div>

          {/* Intro */}
          <p className="mt-8 text-base leading-relaxed text-doodle-ink/75">
            {intro}
          </p>

          {/* Sections */}
          <div className="mt-12 space-y-10">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="font-display text-xl md:text-2xl leading-tight tracking-[-0.01em] text-doodle-ink">
                  {s.heading}
                </h2>
                {s.paragraphs?.map((p, i) => (
                  <p
                    key={i}
                    className="mt-3 text-base leading-relaxed text-doodle-ink/75"
                  >
                    {p}
                  </p>
                ))}
                {s.bullets && (
                  <ul className="mt-4 space-y-2.5">
                    {s.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-base leading-relaxed text-doodle-ink/75"
                      >
                        <span
                          aria-hidden
                          className="mt-2 inline-block h-1.5 w-3 shrink-0 rounded-sm bg-doodle-orange"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
