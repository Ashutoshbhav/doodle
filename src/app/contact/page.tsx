import { NavWithCart } from "@/components/sections/NavWithCart";
import { Footer } from "@/components/sections/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { contact, legalCommon } from "@/content/legal";
import { whatsappHref, whatsappNumber } from "@/lib/whatsapp";

export const metadata = {
  title: "Contact us — DOODLE",
  description:
    "Reach DOODLE (by CANVAS) for orders, returns and support, plus our Grievance Officer details.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <NavWithCart />
      <main className="bg-[color:var(--color-surface-blush)] min-h-screen">
        <section className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-24">
          <Eyebrow variant="rule" accent="orange">
            {contact.eyebrow}
          </Eyebrow>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
            {contact.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-doodle-ink/75">
            {contact.intro}
          </p>

          {/* Contact channels */}
          <div className="mt-12">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-doodle-ink/55">
              {contact.channels.heading}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {whatsappHref() && (
                <div className="rounded-lg bg-doodle-canvas border-2 border-dashed border-doodle-ink/20 p-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-doodle-ink/50">
                    WhatsApp
                  </div>
                  <a
                    href={whatsappHref()!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-block font-display text-lg text-doodle-ink hover:text-doodle-berry transition-colors"
                  >
                    +{whatsappNumber}
                  </a>
                  <p className="mt-2 text-sm leading-relaxed text-doodle-ink/65">
                    The fastest way to reach us. A founder replies, usually the
                    same day.
                  </p>
                </div>
              )}
              {contact.channels.items.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg bg-doodle-canvas border-2 border-dashed border-doodle-ink/20 p-5"
                >
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-doodle-ink/50">
                    {item.label}
                  </div>
                  <a
                    href={`mailto:${item.value}`}
                    className="mt-1.5 inline-block font-display text-lg text-doodle-ink hover:text-doodle-berry transition-colors"
                  >
                    {item.value}
                  </a>
                  <p className="mt-2 text-sm leading-relaxed text-doodle-ink/65">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Grievance Officer */}
          <div className="mt-12">
            <Eyebrow variant="rule" accent="orange">
              Grievance redressal
            </Eyebrow>
            <h2 className="mt-3 font-display text-2xl leading-tight tracking-[-0.01em] text-doodle-ink">
              {contact.grievance.heading}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-doodle-ink/70">
              {contact.grievance.note}
            </p>
            <dl className="mt-5 rounded-lg bg-doodle-canvas border-2 border-dashed border-doodle-ink/20 divide-y divide-dashed divide-doodle-ink/15">
              {contact.grievance.rows.map((row) => (
                <DetailRow key={row.label} label={row.label} value={row.value} />
              ))}
            </dl>
          </div>

          {/* Business details */}
          <div className="mt-12">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-doodle-ink/55">
              {contact.entity.heading}
            </h2>
            <dl className="mt-4 rounded-lg bg-doodle-canvas border-2 border-dashed border-doodle-ink/20 divide-y divide-dashed divide-doodle-ink/15">
              {contact.entity.rows.map((row) => (
                <DetailRow key={row.label} label={row.label} value={row.value} />
              ))}
            </dl>
          </div>

          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-doodle-ink/45">
            {legalCommon.brandName} {legalCommon.brandBy}{" "}
            {legalCommon.brandParent} · {legalCommon.city}
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-doodle-ink/50 sm:w-32 sm:shrink-0">
        {label}
      </dt>
      <dd className="text-sm leading-relaxed text-doodle-ink/80">{value}</dd>
    </div>
  );
}
