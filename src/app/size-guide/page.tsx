import type { Metadata } from "next";
import Link from "next/link";
import { NavWithCart } from "@/components/sections/NavWithCart";
import { Footer } from "@/components/sections/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { sizeChart, unSpeccedSizes, sizeGuide } from "@/content/help";

export const metadata: Metadata = {
  title: "Kids' tee size guide — age, chest and length in cm",
  description:
    "DOODLE kids' t-shirt size chart: age 3–10, garment chest, length, shoulder and sleeve in centimetres, measured flat. Regular-relaxed fit with a 10–12 cm growth buffer.",
  alternates: { canonical: "/size-guide" },
};

export default function SizeGuidePage() {
  return (
    <>
      <NavWithCart />
      <main id="main" className="bg-[color:var(--color-surface-blush)] min-h-screen">
        <section className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-24">
          <Eyebrow variant="rule" accent="orange">
            {sizeGuide.eyebrow}
          </Eyebrow>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
            {sizeGuide.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-doodle-ink/75">
            {sizeGuide.intro}
          </p>

          {/* The chart — real production-spec numbers, measured flat */}
          <div className="mt-10 overflow-x-auto rounded-[1.25rem] bg-doodle-canvas shadow-card">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-doodle-ink/10 text-[11px] font-semibold uppercase tracking-[0.1em] text-doodle-ink/55">
                  <th scope="col" className="px-5 py-4">Size</th>
                  <th scope="col" className="px-5 py-4">Age</th>
                  <th scope="col" className="px-5 py-4">Chest (cm)</th>
                  <th scope="col" className="px-5 py-4">Length (cm)</th>
                  <th scope="col" className="px-5 py-4">Shoulder (cm)</th>
                  <th scope="col" className="px-5 py-4">Sleeve (cm)</th>
                </tr>
              </thead>
              <tbody>
                {sizeChart.map((row) => (
                  <tr key={row.size} className="border-b border-doodle-ink/10 last:border-0">
                    <td className="px-5 py-4 font-display text-lg text-doodle-ink">{row.size}</td>
                    <td className="px-5 py-4 text-doodle-ink/75">{row.age}</td>
                    <td className="px-5 py-4 font-medium text-doodle-ink tabular-nums">{row.garmentChest}</td>
                    <td className="px-5 py-4 font-medium text-doodle-ink tabular-nums">{row.length}</td>
                    <td className="px-5 py-4 font-medium text-doodle-ink tabular-nums">{row.shoulder}</td>
                    <td className="px-5 py-4 font-medium text-doodle-ink tabular-nums">{row.sleeve}</td>
                  </tr>
                ))}
                {unSpeccedSizes.map((row) => (
                  <tr key={row.size} className="border-b border-doodle-ink/10 last:border-0">
                    <td className="px-5 py-4 font-display text-lg text-doodle-ink">{row.size}</td>
                    <td className="px-5 py-4 text-doodle-ink/75">{row.age}</td>
                    <td colSpan={4} className="px-5 py-4 text-doodle-ink/55 italic">
                      measurements on request —{" "}
                      <a href="mailto:hello@doodlebycanvas.in" className="not-italic font-medium text-doodle-berry hover:underline">
                        write to us
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-doodle-ink/55">
            Garment measured flat · chest is armpit-to-armpit doubled · tolerance ±1 cm
          </p>

          {/* How to measure */}
          <div className="mt-12">
            <h2 className="font-display text-2xl leading-tight tracking-[-0.01em] text-doodle-ink">
              {sizeGuide.howToMeasure.heading}
            </h2>
            <ol className="mt-5 space-y-3">
              {sizeGuide.howToMeasure.steps.map((step, i) => (
                <li key={step} className="flex gap-4 text-sm leading-relaxed text-doodle-ink/75">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-doodle-orange/10 font-display text-sm text-doodle-berry">
                    {i + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 space-y-4">
            <div className="rounded-[1.25rem] bg-doodle-canvas p-6 shadow-subtle">
              <h3 className="font-display text-lg text-doodle-ink">Between sizes?</h3>
              <p className="mt-2 text-sm leading-relaxed text-doodle-ink/75">{sizeGuide.betweenSizes}</p>
            </div>
            <div className="rounded-[1.25rem] bg-doodle-canvas p-6 shadow-subtle">
              <h3 className="font-display text-lg text-doodle-ink">Fabric</h3>
              <p className="mt-2 text-sm leading-relaxed text-doodle-ink/75">{sizeGuide.fabricNote}</p>
            </div>
          </div>

          <p className="mt-10 text-sm leading-relaxed text-doodle-ink/65">
            {sizeGuide.requestNote} Wrong size anyway? There&rsquo;s a{" "}
            <Link href="/refunds" className="font-medium text-doodle-berry hover:underline">
              7-day exchange
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
