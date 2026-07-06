import Link from "next/link";
import {
  Truck,
  HandCoins,
  ArrowsClockwise,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import { sizeChart } from "@/content/help";

/* The buy-decision blocks the live PDP was missing: fabric/care facts,
   size guidance, and the trust panel — previously these only rendered on
   the waitlist-mode fallback page, so a paying customer never saw them.
   Server component; facts come from the production spec (content/help.ts). */

const GARMENT_DETAILS: [string, string][] = [
  ["Fabric", "100% combed cotton, 200–220 GSM"],
  ["Fit", "Regular-relaxed, 10–12 cm growth buffer"],
  ["Patches", "Velcro-backed, swap anytime"],
  ["Care", "Patches off, machine wash cold, tumble dry low"],
  ["Made in", "India"],
];

const PATCH_DETAILS: [string, string][] = [
  ["Silicone charms", "Soft 3D rubber — wipe clean with a damp cloth"],
  ["Embroidered", "Stitched fabric — hand wash, air dry"],
  ["Backing", "Hook velcro, grips the tee's soft panel"],
  ["Size", "1.5–2 inches, designed for ages 3+"],
  ["Made in", "India"],
];

const TRUST = [
  { Icon: HandCoins, title: "Cash on delivery", note: "Pay when it arrives" },
  { Icon: Truck, title: "Free shipping", note: "Orders over ₹999" },
  { Icon: ArrowsClockwise, title: "7-day exchange", note: "If the size is off" },
  { Icon: ShieldCheck, title: "Safe for skin", note: "Soft velcro side on the tee" },
];

export function ProductInfoBlocks({ kind }: { kind: "garment" | "patches" }) {
  const details = kind === "garment" ? GARMENT_DETAILS : PATCH_DETAILS;
  return (
    <div className="mt-10 space-y-6">
      {kind === "garment" && (
        <div className="rounded-[1.25rem] bg-doodle-canvas p-5 shadow-subtle">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-display text-lg text-doodle-ink">Sizing</h3>
            <Link
              href="/size-guide"
              className="text-sm font-medium text-doodle-berry hover:underline"
            >
              Full size guide
            </Link>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-doodle-ink/65">
            {sizeChart
              .map((r) => `${r.age}: chest ${r.garmentChest} cm, length ${r.length} cm`)
              .join(" · ")}
            . Between sizes? Size up — the velcro panel sits the same on every fit.
          </p>
        </div>
      )}

      <dl className="divide-y divide-doodle-ink/10 rounded-[1.25rem] bg-doodle-canvas px-5 shadow-subtle">
        {details.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-6 py-3.5 text-sm">
            <dt className="shrink-0 text-doodle-ink/60">{k}</dt>
            <dd className="text-right font-medium text-doodle-ink">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="rounded-[1.25rem] bg-doodle-stitch p-5 shadow-subtle">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TRUST.map(({ Icon, title, note }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-doodle-canvas text-doodle-berry shadow-subtle">
                <Icon weight="duotone" size={20} aria-hidden />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-doodle-ink">{title}</div>
                <div className="text-[12px] text-doodle-ink/60">{note}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] leading-relaxed text-doodle-ink/55">
          Questions before you buy? The{" "}
          <Link href="/faq" className="font-medium text-doodle-berry hover:underline">
            FAQ
          </Link>{" "}
          covers washing, safety and exchanges.
        </p>
      </div>
    </div>
  );
}
