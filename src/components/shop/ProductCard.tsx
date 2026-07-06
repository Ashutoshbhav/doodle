import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/medusa/types"
import { formatINR } from "@/lib/medusa/types"
import { DoodleHoverRing } from "@/components/ui/DoodleHoverRing"

// Premium-for-kids (Wave 2): soft in-plane shadow card instead of a dashed
// border on everything. Clean white image frame (no dashed). ONE orange accent
// = the price. Sans title. Hover = shadow deepen + gentle lift (no border swap).
export function ProductCard({ product }: { product: Product }) {
  const thumbnail =
    product.thumbnail ?? product.images?.[0]?.url ?? null

  const cheapest = product.variants?.reduce<number | null>((min, v) => {
    const price = v.calculated_price?.calculated_amount
    if (price == null) return min
    return min == null || price < min ? price : min
  }, null) ?? null

  return (
    <Link
      href={`/shop/${product.handle}`}
      className="
        group block rounded-lg bg-card overflow-hidden
        shadow-card hover:shadow-card-hover
        hover:-translate-y-0.5 active:translate-y-0
        transition-[box-shadow,transform] duration-200
      "
    >
      {/* object-CONTAIN, not cover: the pack composites are edge-to-edge
          patch grids and cover was amputating the outer patches. All source
          images sit on light studio backgrounds, so containing on the card's
          own surface reads clean for tees and packs alike. */}
      <div className="relative aspect-[4/5] bg-doodle-stitch overflow-hidden p-3">
        {/* Crayon ring sketches around the product on hover */}
        <DoodleHoverRing fit="inside" className="z-10 text-doodle-berry/50" />
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={product.title ?? ""}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid place-items-center h-full">
            <span className="font-sans text-xs text-doodle-ink/40">
              No image
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-doodle-ink leading-tight tracking-[-0.01em]">
          {product.title}
        </h3>
        <p className="mt-2 font-sans text-base font-semibold text-doodle-berry">
          {cheapest != null ? formatINR(cheapest) : ""}
        </p>
      </div>
    </Link>
  )
}
