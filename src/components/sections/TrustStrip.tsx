import { Truck, HandCoins, ArrowsClockwise, Heart } from "@phosphor-icons/react/dist/ssr";

/* Trust / value strip — sits directly under the hero so the four things
   that de-risk a first purchase (shipping, COD, returns, safe materials)
   are seen before any brand story. Over 35% of first-time Indian D2C
   buyers hesitate at checkout over unclear shipping/returns. */

const ITEMS = [
  { icon: Truck, title: "Free shipping", note: "on orders over ₹999" },
  { icon: HandCoins, title: "Cash on delivery", note: "pay when it arrives" },
  { icon: ArrowsClockwise, title: "Easy exchanges", note: "7-day, hassle-free" },
  { icon: Heart, title: "Gentle on skin", note: "100% combed cotton" },
];

export function TrustStrip() {
  return (
    <section
      aria-label="Why shop with DOODLE"
      className="border-y border-doodle-ink/10 bg-doodle-canvas"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-6 px-6 py-7 md:grid-cols-4 md:px-10">
        {ITEMS.map(({ icon: Icon, title, note }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-doodle-stitch text-doodle-orange shadow-subtle">
              <Icon weight="duotone" size={20} aria-hidden />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-doodle-ink">{title}</div>
              <div className="text-[12px] text-doodle-ink/60">{note}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
