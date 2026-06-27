import Image from "next/image";
import Link from "next/link";
import { PATCHES } from "@/lib/patches";

/* Featured product / "Build your tee" — the buyable moment moved high on the
   page (right under the hero + trust strip), so a shopper sees a real product,
   a price, and a path to cart before any brand story.

   Photography-ready: the left stage currently shows the upscaled tee render;
   swap in a real on-body kid photo when the shoot lands and it reads like a
   top apparel brand instantly. */

const KIT_PATCHES = ["rainbow", "star", "crown", "bear-brown", "octopus"]
  .map((k) => PATCHES.find((p) => p.key === k))
  .filter(Boolean) as typeof PATCHES;

export function FeaturedTee() {
  return (
    <section id="shop" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid items-center gap-8 rounded-[1.25rem] bg-doodle-stitch p-6 shadow-card md:grid-cols-2 md:gap-12 md:p-12">
          {/* Left — product stage (photography-ready image slot) */}
          <div className="relative mx-auto aspect-square w-full max-w-[440px]">
            <div className="absolute inset-8 rounded-[42%] bg-doodle-yellow/25 blur-2xl" aria-hidden />
            <Image
              src="/product/tee-pink.png"
              alt="DOODLE Bubblegum Pink tee with swappable patches"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Right — copy, price, kit, CTAs */}
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-doodle-orange">
              The Starter Kit
            </span>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,3rem)] leading-[1.04] tracking-[-0.02em] text-doodle-ink">
              Build a tee that&apos;s{" "}
              <span className="italic text-doodle-orange">all theirs</span>.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-doodle-ink/70">
              One soft 100% combed-cotton tee and five swappable velcro patches.
              They remix the look as often as their mood, no new t-shirt required.
            </p>

            {/* What's in the kit */}
            <div className="mt-6">
              <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-doodle-ink/50">
                In the kit
              </span>
              <div className="mt-3 flex items-center gap-2.5">
                {KIT_PATCHES.map((p) => (
                  <span
                    key={p.key}
                    title={p.name}
                    className="grid h-12 w-12 place-items-center rounded-full bg-doodle-canvas shadow-subtle"
                  >
                    <Image src={p.src} alt={p.name} width={40} height={40} className="h-8 w-8 object-contain" />
                  </span>
                ))}
                <span className="ml-1 text-sm font-medium text-doodle-ink/55">+200 more</span>
              </div>
            </div>

            <div className="mt-7 flex items-baseline gap-3">
              <span className="font-display text-3xl text-doodle-ink">₹999</span>
              <span className="text-sm text-doodle-ink/55">1 tee + 5 patches</span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="inline-flex h-11 items-center justify-center rounded-full bg-doodle-orange px-6 text-sm font-medium text-doodle-stitch shadow-card transition-[box-shadow,background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-doodle-orange/95 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-orange/40"
              >
                Shop the drop
              </Link>
              <Link
                href="#how"
                className="inline-flex h-11 items-center justify-center rounded-full bg-doodle-canvas px-6 text-sm font-medium text-doodle-ink shadow-subtle transition-shadow hover:shadow-card"
              >
                See how it works
              </Link>
            </div>

            <p className="mt-4 text-[12px] text-doodle-ink/50">
              Free shipping over ₹999 · Cash on delivery · 7-day exchange
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
