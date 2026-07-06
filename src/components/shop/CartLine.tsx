"use client"

import Image from "next/image"
import { useTransition } from "react"
import type { CartLine as CartLineT } from "@/lib/medusa/types"
import { formatINR } from "@/lib/medusa/types"
import { updateLine, removeLine } from "@/app/actions/checkout"
import { Tag } from "@/components/ui/Tag"

// Server actions cap qty at 1–99; this is the UX clamp layer on top, also
// bounding by available stock so the shopper can't increment past what's left.
const HARD_MAX = 99

export function CartLine({ line }: { line: CartLineT }) {
  const [pending, startTransition] = useTransition()
  const thumbnail =
    line.thumbnail ?? line.variant?.product?.thumbnail ?? null

  // Available stock: only constrains when Medusa manages inventory, the
  // variant isn't backorderable, AND the number actually arrived — cart
  // queries don't compute inventory, so missing data means unknown, not
  // zero (zero silently disabled the + stepper). The server action holds
  // the authoritative clamp.
  const variant = line.variant
  const stockCap =
    variant?.manage_inventory === true &&
    variant?.allow_backorder !== true &&
    typeof variant.inventory_quantity === "number"
      ? variant.inventory_quantity
      : HARD_MAX
  const maxQty = Math.min(HARD_MAX, stockCap)
  const atMax = line.quantity >= maxQty

  function setQty(q: number) {
    if (q < 1) {
      startTransition(() => {
        void removeLine({ lineId: line.id })
      })
      return
    }
    if (q > maxQty) return
    startTransition(() => {
      void updateLine({ lineId: line.id, quantity: q })
    })
  }

  return (
    <div className="flex gap-4 py-5 border-b border-doodle-ink/10 last:border-0">
      <div className="relative w-20 h-24 shrink-0 rounded-lg overflow-hidden bg-doodle-stitch">
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={line.title ?? ""}
            fill
            sizes="80px"
            className="object-contain p-1"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display text-lg text-doodle-ink leading-tight">
          {line.title}
        </div>
        <div className="font-sans text-[13px] text-doodle-ink/55 mt-1">
          {line.variant?.title}
        </div>
        <div className="mt-3 flex items-center gap-3">
          {/* 44px tap targets — the minus button removes the line at qty 1,
              so a mis-tap here is destructive. Never shrink these. */}
          <div className="inline-flex items-center rounded-full border border-doodle-ink/15 bg-card shadow-subtle">
            <button
              type="button"
              onClick={() => setQty(line.quantity - 1)}
              disabled={pending}
              aria-label="Decrease quantity"
              className="grid h-11 w-11 place-items-center text-doodle-ink hover:text-doodle-berry transition-colors disabled:opacity-50"
            >
              −
            </button>
            <span className="px-1 font-sans text-sm font-medium tabular-nums">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => setQty(line.quantity + 1)}
              disabled={pending || atMax}
              aria-label="Increase quantity"
              className="grid h-11 w-11 place-items-center text-doodle-ink hover:text-doodle-berry transition-colors disabled:opacity-50"
            >
              +
            </button>
          </div>
          {atMax && maxQty < HARD_MAX && <Tag tone="muted">Max in stock</Tag>}
          <button
            type="button"
            onClick={() =>
              startTransition(() => {
                void removeLine({ lineId: line.id })
              })
            }
            disabled={pending}
            className="inline-flex h-11 items-center px-2 text-xs font-sans font-medium text-doodle-ink/55 hover:text-doodle-ink transition-colors disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="text-right font-display text-lg text-doodle-ink whitespace-nowrap">
        {formatINR(line.unit_price * line.quantity)}
      </div>
    </div>
  )
}
