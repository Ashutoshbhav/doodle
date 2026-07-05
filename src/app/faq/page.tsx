import type { Metadata } from "next";
import Link from "next/link";
import { NavWithCart } from "@/components/sections/NavWithCart";
import { Footer } from "@/components/sections/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { faq } from "@/content/help";

export const metadata: Metadata = {
  title: "FAQs — velcro patches, washing, safety, sizing",
  description:
    "How DOODLE's swappable velcro patches work, whether they survive the wash, patch safety for kids 3+, sizing, COD and exchanges. Honest answers from the founders.",
  alternates: { canonical: "/faq" },
};

/* FAQPage JSON-LD — built from the same content the page renders, so the
   structured data can never say something the visible page doesn't. */
function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.groups.flatMap((g) =>
      g.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };
}

export default function FaqPage() {
  return (
    <>
      <NavWithCart />
      <main id="main" className="bg-[color:var(--color-surface-blush)] min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
        />
        <section className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-24">
          <Eyebrow variant="rule" accent="orange">
            {faq.eyebrow}
          </Eyebrow>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
            {faq.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-doodle-ink/75">
            {faq.intro}
          </p>

          {faq.groups.map((group) => (
            <div key={group.heading} className="mt-12">
              <h2 className="font-display text-2xl leading-tight tracking-[-0.01em] text-doodle-ink">
                {group.heading}
              </h2>
              <div className="mt-5 space-y-3">
                {group.items.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-[1rem] bg-doodle-canvas px-5 py-4 shadow-subtle open:shadow-card"
                  >
                    <summary className="cursor-pointer list-none font-medium text-doodle-ink marker:content-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4">
                      <span>{item.q}</span>
                      <span
                        aria-hidden
                        className="shrink-0 text-doodle-orange transition-transform group-open:rotate-45 text-xl leading-none"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-doodle-ink/75">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-14 rounded-[1rem] bg-doodle-canvas p-6 shadow-card">
            <p className="text-sm leading-relaxed text-doodle-ink/75">
              Sizing question? The full centimetre chart is on the{" "}
              <Link href="/size-guide" className="font-medium text-doodle-orange hover:underline">
                size guide
              </Link>
              . Anything else:{" "}
              <a
                href="mailto:hello@doodlebycanvas.in"
                className="font-medium text-doodle-orange hover:underline"
              >
                hello@doodlebycanvas.in
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
