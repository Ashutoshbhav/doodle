import Image from "next/image";
import Link from "next/link";
import { PATCHES } from "@/lib/patches";

/* Branded 404 — a mistyped link should land on brand, not on the default
   Next.js black-and-white page. Static, no client JS needed. */

export default function NotFound() {
  const crew = PATCHES.slice(0, 3);
  return (
    <main className="grid min-h-[70vh] place-items-center bg-doodle-canvas px-6 py-24 text-center">
      <div>
        <div className="flex items-center justify-center">
          {crew.map((p, i) => (
            <span
              key={p.key}
              className="-ml-4 inline-grid h-20 w-20 place-items-center rounded-full bg-doodle-stitch p-3 shadow-card ring-2 ring-doodle-canvas first:ml-0"
              style={{ zIndex: 10 - i, transform: `rotate(${(i - 1) * 8}deg)` }}
            >
              <Image src={p.src} alt={p.name} width={64} height={64} className="h-full w-full object-contain" />
            </span>
          ))}
        </div>
        <h1 className="mt-8 font-display text-[clamp(2.2rem,6vw,3.8rem)] leading-[1.02] tracking-[-0.02em] text-doodle-ink">
          This page peeled off.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-doodle-ink/70">
          The patch you were looking for isn&rsquo;t on this tee. The crew above
          will walk you back.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full bg-doodle-orange px-6 text-sm font-medium text-doodle-stitch shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-orange/40"
          >
            Back to the tee
          </Link>
          <Link
            href="/#wall"
            className="inline-flex h-11 items-center justify-center rounded-full bg-doodle-stitch px-6 text-sm font-medium text-doodle-ink shadow-subtle transition-shadow hover:shadow-card"
          >
            Meet the patches
          </Link>
        </div>
      </div>
    </main>
  );
}
