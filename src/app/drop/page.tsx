import type { Metadata } from "next";
import Image from "next/image";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { ConversionScripts } from "@/components/ui/ConversionScripts";

/**
 * /drop — Live Campaign Lab paid landing page.
 *
 * Single job: turn a paid click into a first-drop waitlist email. No nav, no
 * other exits. Photo-bridges the running ad creatives (scoped exception to
 * the illustration-only site rule — see docs/CAMPAIGN-CONTEXT.md §7.1) while
 * keeping the offer honest and product-agnostic (tees ship first; the ads'
 * backpack is never promised — §7.2).
 */

export const metadata: Metadata = {
  title: "Be first to the DOODLE first drop",
  description:
    "DOODLE — a tee your kid redesigns whenever they want. Swap the patches, change the character, same favourite shirt. The first drop is small. Join the list.",
  // Paid LP: keep it out of organic + away from duplicate-content with the homepage.
  robots: { index: false, follow: false },
};

type SP = { [key: string]: string | string[] | undefined };

function pick(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : (v ?? "")).toLowerCase();
}

function token(raw: string, fallback: string): string {
  const cleaned = raw.replace(/[^a-z0-9_-]/g, "").slice(0, 24);
  return cleaned || fallback;
}

export default async function DropPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  // e.g. lcl_may26:meta:m1 — re-sanitised server-side in waitlist.ts.
  const source = `lcl_may26:${token(pick(sp.utm_source), "direct")}:${token(
    pick(sp.utm_content),
    "none",
  )}`;

  return (
    <>
      <ConversionScripts />

      <main className="flex min-h-screen flex-col bg-doodle-red text-doodle-stitch">
        {/* Drop banner — brand continuity with the main site hero */}
        <div className="bg-doodle-ink text-doodle-stitch">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-2.5 md:px-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em]">
              India&rsquo;s first modular kidswear
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-doodle-stitch/35 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-doodle-yellow" />
              First drop
            </span>
          </div>
        </div>

        <div className="grid flex-1 lg:grid-cols-12">
          {/* ---------- LEFT — campaign zone (guaranteed contrast) ---------- */}
          <section className="order-2 flex flex-col justify-center px-6 py-14 md:px-10 lg:order-1 lg:col-span-7 lg:px-16 lg:py-20 xl:px-24">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-doodle-stitch/75">
              Bangalore &middot; 2026
            </div>

            <h1
              className="mt-5 font-display uppercase leading-[0.86] tracking-[-0.03em]"
              style={{ fontWeight: 900, fontSize: "clamp(2.8rem, 7vw, 6rem)" }}
            >
              <span className="block">Don&rsquo;t Just Dress.</span>
              <span className="marker-yellow inline-block !text-doodle-ink">
                Create.
              </span>
            </h1>

            <p className="mt-7 max-w-xl font-display text-2xl leading-[1.15] tracking-[-0.01em] md:text-[1.65rem]">
              Kids don&rsquo;t outgrow clothes.{" "}
              <span className="italic text-doodle-stitch/75">
                They outgrow characters.
              </span>
            </p>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-doodle-stitch/85 md:text-lg">
              DOODLE is a tee your kid redesigns whenever they feel like it —
              swap the patches, change the character, same favourite shirt.
              The first drop is small. Be first to it.
            </p>

            <div className="mt-9 max-w-md">
              <span
                className="mb-2 block text-2xl text-doodle-stitch"
                style={{ fontFamily: "var(--font-caveat)" }}
              >
                join the first-drop list &darr;
              </span>
              <WaitlistForm
                accent="orange"
                surface="tile"
                source={source}
                conversionTrack
              />
            </div>

            {/* Microproof — all real product facts (see CAMPAIGN-CONTEXT §3) */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-doodle-stitch/75">
              <span>Sizes 3&ndash;6 yrs</span>
              <span className="opacity-40">/</span>
              <span>100% combed cotton</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {[
                "Swap-it-yourself patches",
                "Made in India",
                "First drop is limited",
              ].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center rounded-full border-2 border-dashed border-doodle-stitch/60 px-4 py-2 text-sm font-medium text-doodle-stitch"
                >
                  {chip}
                </span>
              ))}
            </div>

            <p className="mt-9 max-w-md text-sm leading-relaxed text-doodle-stitch/70">
              Five friends from Bangalore who kept watching kids outgrow
              characters, not clothes. &mdash; DOODLE by CANVAS
            </p>
          </section>

          {/* ---------- RIGHT — creative collage (the running ads + clip) ----------
              Cream scrapboard with stitched, slightly-rotated photo cards
              (DOODLE's sticker/stitch motif). 16:9 tiles match the source
              1600x893 ratio, so next/image downscales — crisp, never upscaled. */}
          <section className="order-1 bg-doodle-canvas lg:order-2 lg:col-span-5">
            <div className="flex h-full flex-col justify-center gap-3 p-4 sm:gap-4 sm:p-6 lg:p-7">
              {/* Video is portrait 404x720 — match the frame to its real
                  aspect + object-contain so the WHOLE video is always
                  visible, never cropped. Width-capped + centred. */}
              <div className="mx-auto w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[380px]">
                <div className="relative aspect-[404/720] overflow-hidden rounded-2xl stitch-ink bg-doodle-ink shadow-[6px_8px_0_rgba(26,26,26,0.14)] -rotate-1">
                  <video
                    className="absolute inset-0 h-full w-full object-contain"
                    src="/campaign/clip.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { src: "/campaign/c1.jpg", alt: "Kid in a DOODLE tee with swappable patches, back-to-school flat-lay", rot: "rotate-1" },
                  { src: "/campaign/c2.jpg", alt: "DOODLE backpack with mix-and-match patches", rot: "-rotate-1" },
                  { src: "/campaign/c3.jpg", alt: "Kid in a white DOODLE tee surrounded by their things", rot: "-rotate-1" },
                  { src: "/campaign/c4.jpg", alt: "Kid in a purple DOODLE tee with patches", rot: "rotate-1" },
                ].map((c, i) => (
                  <div
                    key={c.src}
                    className={`relative aspect-video overflow-hidden rounded-xl stitch-ink shadow-[4px_5px_0_rgba(26,26,26,0.12)] ${c.rot}`}
                  >
                    <Image
                      src={c.src}
                      alt={c.alt}
                      fill
                      priority={i === 0}
                      sizes="(max-width: 1024px) 46vw, 21vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Footer — minimal, single message */}
        <footer className="bg-doodle-ink px-6 py-5 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-doodle-stitch/60 md:px-10">
          DOODLE by CANVAS &middot; Made in India &middot; No spam — one email
          when the drop is ready
        </footer>
      </main>
    </>
  );
}
