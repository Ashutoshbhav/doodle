import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PACKS, packPatches, type Pack } from "@/lib/patches";
import { isCommerceEnabled } from "@/lib/commerce";

/* PacksShowcase — patch packs sold separately, six at a time. Five themed
   embroidered packs + the "Mix Your Six" build-your-own from the silicone
   charms. Displayed as its own section, distinct from the patch library. */

export function PacksShowcase() {
  return (
    <section id="packs" className="relative bg-[color:var(--color-surface-mint)] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Eyebrow variant="rule" accent="orange">
          Patch packs
        </Eyebrow>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
          Six at a time. <span className="italic text-doodle-berry">Pick a crew.</span>
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-doodle-ink/70">
          Themed embroidered packs of six, or mix your own six from the silicone
          charms. Snap them on, swap them out, collect the whole gang.
        </p>

        <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
          {PACKS.map((pack) => (
            <PackCard key={pack.key} pack={pack} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PackCard({ pack }: { pack: Pack }) {
  const patches = packPatches(pack);
  return (
    <div className="flex flex-col rounded-[1.35rem] bg-doodle-stitch p-6 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-xl text-doodle-ink">{pack.name}</h3>
        <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-doodle-ink/40">
          {pack.collection}
        </span>
      </div>
      <p className="mt-1 text-sm text-doodle-ink/60">{pack.tagline}</p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {patches.map((p) => (
          <span
            key={p.key}
            title={p.name}
            className="grid aspect-square place-items-center rounded-lg bg-doodle-canvas p-2 shadow-subtle"
          >
            <Image src={p.src} alt={p.name} width={72} height={72} className="h-full w-full object-contain" />
          </span>
        ))}
        {pack.mix && (
          <span className="grid aspect-square place-items-center rounded-lg border-2 border-dashed border-doodle-ink/15 p-2 text-center text-[11px] font-medium leading-tight text-doodle-ink/40">
            + your pick
          </span>
        )}
      </div>

      {/* In waitlist mode the button never says "Add" — it can't deliver.
          It routes to the waitlist instead. */}
      <div className="mt-6 flex items-center justify-between pt-2">
        <span className="font-display text-2xl text-doodle-ink">₹{pack.price}</span>
        <Link
          href={pack.mix ? "/#shop" : isCommerceEnabled ? `/shop/${pack.key}` : "/#join"}
          className="inline-flex h-10 items-center justify-center rounded-full bg-doodle-orange px-5 text-sm font-medium text-doodle-ink shadow-card transition-[box-shadow,background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-doodle-orange/95 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-berry/40"
        >
          {pack.mix ? "Build it" : isCommerceEnabled ? "Add pack" : "Get drop alerts"}
        </Link>
      </div>
    </div>
  );
}
