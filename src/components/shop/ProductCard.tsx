import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/medusa/types"
import { formatINR } from "@/lib/medusa/types"

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
        group block rounded-[1.5rem] bg-doodle-canvas overflow-hidden
        border-2 border-dashed border-doodle-ink/20
        hover:border-doodle-ink/45 hover:scale-[1.015] transition-all
      "
    >
      <div className="relative aspect-[4/5] bg-doodle-stitch overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={product.title ?? ""}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="grid place-items-center h-full">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-doodle-ink/40">
              No image
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-doodle-ink leading-tight tracking-[-0.01em]">
          {product.title}
        </h3>
        <p className="mt-2 font-mono text-sm text-doodle-ink/70">
          {cheapest != null ? formatINR(cheapest) : ""}
        </p>
      </div>
    </Link>
  )
}
