"use client"

import Image from "next/image"
import { useTransition } from "react"
import type { CartLine as CartLineT } from "@/lib/medusa/types"
import { formatINR } from "@/lib/medusa/types"
import { updateLine, removeLine } from "@/app/actions/checkout"

// Server actions cap qty at 1–99; this is the UX clamp layer on top, also
// bounding by available stock so the shopper can't increment past what's left.
const HARD_MAX = 99

export function CartLine({ line }: { line: CartLineT }) {
  const [pending, startTransition] = useTransition()
  const thumbnail =
    line.thumbnail ?? line.variant?.product?.thumbnail ?? null

  // Available stock: only constrains when Medusa manages inventory and the
  // variant isn't backorderable. Otherwise it's effectively unlimited.
  const variant = line.variant
  const stockCap =
    variant?.manage_inventory === true && variant?.allow_backorder !== true
      ? variant.inventory_quantity ?? 0
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
    <div className="flex gap-4 py-5 border-b border-dashed border-doodle-ink/15 last:border-0">
      <div className="relative w-20 h-24 shrink-0 rounded-lg overflow-hidden bg-doodle-stitch">
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={line.title ?? ""}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display text-lg text-doodle-ink leading-tight">
          {line.title}
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-doodle-ink/55 mt-1">
          {line.variant?.title}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="inline-flex items-center rounded-full border-2 border-dashed border-doodle-ink/30">
            <button
              type="button"
              onClick={() => setQty(line.quantity - 1)}
              disabled={pending}
              aria-label="Decrease quantity"
              className="px-3 py-1 text-doodle-ink disabled:opacity-50"
            >
              −
            </button>
            <span className="px-2 font-mono text-sm tabular-nums">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => setQty(line.quantity + 1)}
              disabled={pending || atMax}
              aria-label="Increase quantity"
              className="px-3 py-1 text-doodle-ink disabled:opacity-50"
            >
              +
            </button>
          </div>
          {atMax && maxQty < HARD_MAX && (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-doodle-ink/45">
              Max in stock
            </span>
          )}
          <button
            type="button"
            onClick={() =>
              startTransition(() => {
                void removeLine({ lineId: line.id })
              })
            }
            disabled={pending}
            className="text-xs font-mono uppercase tracking-[0.14em] text-doodle-ink/55 hover:text-doodle-ink disabled:opacity-50"
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
