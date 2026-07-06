import type { Metadata } from "next";
import Link from "next/link";
import { NavWithCart } from "@/components/sections/NavWithCart";
import { Footer } from "@/components/sections/Footer";
import { Promise as PromiseSection } from "@/components/sections/Promise";
import { Founders } from "@/components/sections/Founders";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "About — the promise and the people",
  description:
    "Why DOODLE exists: one tee that outlasts every character phase, and the five MBA classmates from Scaler School of Business building it in Bangalore.",
  alternates: { canonical: "/about" },
};

/* The brand-story beats moved here from the homepage (Ash, 2026-07-07):
   the homepage sells, /about persuades. Promise carries the "why",
   Founders carries the "who". */
export default function AboutPage() {
  return (
    <>
      <NavWithCart />
      <main id="main" className="min-h-screen bg-doodle-canvas">
        <section className="mx-auto max-w-7xl px-6 pt-16 md:px-10 md:pt-24">
          <Eyebrow variant="rule" accent="orange">
            About DOODLE
          </Eyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,6vw,4rem)] leading-[1.02] tracking-[-0.02em] text-doodle-ink">
            One tee that keeps up{" "}
            <span className="italic text-doodle-berry">with every phase.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-doodle-ink/75 md:text-lg">
            DOODLE started with a wardrobe full of character tees nobody would
            wear anymore. The fix: one really good tee, a velcro panel, and
            patches that change as fast as kids do.
          </p>
        </section>

        <PromiseSection />
        <Founders />

        <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10 md:pb-28">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center rounded-full bg-doodle-orange px-8 font-medium text-doodle-ink shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-berry/40"
            >
              Shop the drop
            </Link>
            <Link
              href="/faq"
              className="text-sm font-medium text-doodle-ink/65 underline underline-offset-4 transition-colors hover:text-doodle-ink"
            >
              or read the FAQ first
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
