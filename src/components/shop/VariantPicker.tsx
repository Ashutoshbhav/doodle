"use client"

import * as React from "react"
import type { Product, Variant } from "@/lib/medusa/types"
import { formatINR } from "@/lib/medusa/types"
import { PillButton } from "@/components/ui/PillButton"
import { Tag } from "@/components/ui/Tag"
import { addToCart } from "@/app/actions/checkout"

type Selection = Record<string, string>

const LOW_STOCK_THRESHOLD = 5

// Derive stock state for a variant from the Medusa store fields.
// If `manage_inventory` is false/absent, the variant is always considered in
// stock. Backorder-enabled variants are orderable even at 0 inventory.
function stockState(variant: Variant | undefined): {
  inStock: boolean
  remaining: number | null // null = effectively unlimited (unmanaged/backorder)
} {
  if (!variant) return { inStock: true, remaining: null }
  if (variant.manage_inventory !== true) return { inStock: true, remaining: null }
  if (variant.allow_backorder === true) return { inStock: true, remaining: null }
  const qty = variant.inventory_quantity ?? 0
  return { inStock: qty > 0, remaining: qty }
}

export function VariantPicker({ product }: { product: Product }) {
  const options = product.options ?? []
  const [selection, setSelection] = React.useState<Selection>(() =>
    Object.fromEntries((options).map((o) => [o.id ?? "", ""]))
  )
  const [busy, setBusy] = React.useState(false)
  const [msg, setMsg] = React.useState<string | null>(null)

  const selected: Variant | undefined = React.useMemo(() => {
    const allChosen = Object.values(selection).every(Boolean)
    if (!allChosen) return undefined
    return product.variants?.find((v) =>
      v.options?.every(
        (o) => selection[o.option_id ?? ""] === o.value
      )
    )
  }, [product.variants, selection])

  const price = selected?.calculated_price?.calculated_amount
  const { inStock, remaining } = stockState(selected)
  const lowStock =
    selected != null &&
    inStock &&
    remaining != null &&
    remaining <= LOW_STOCK_THRESHOLD

  async function onAdd() {
    if (!selected) return
    setBusy(true)
    setMsg(null)
    const result = await addToCart({
      variantId: selected.id,
      quantity: 1,
    })
    setBusy(false)
    setMsg(result.ok ? "Added to cart." : result.error ?? "Something went wrong.")
  }

  if (options.length === 0) {
    // Single-variant product (e.g. Pattern Pack)
    const onlyVariant = product.variants?.[0]
    const only = stockState(onlyVariant)
    const onlyLow =
      only.inStock &&
      only.remaining != null &&
      only.remaining <= LOW_STOCK_THRESHOLD
    return (
      <div className="space-y-5">
        <div className="font-display text-3xl text-doodle-ink">
          {onlyVariant?.calculated_price?.calculated_amount != null
            ? formatINR(onlyVariant.calculated_price.calculated_amount)
            : "—"}
        </div>
        {!only.inStock && (
          <div className="space-y-2">
            <Tag tone="danger">Sold out</Tag>
            <p className="text-sm text-doodle-ink/60">
              Want us to text you when it&apos;s back?
            </p>
          </div>
        )}
        {onlyLow && <Tag tone="accent">Only {only.remaining} left</Tag>}
        <PillButton
          variant="primary"
          size="lg"
          disabled={!onlyVariant || !only.inStock || busy}
          onClick={async () => {
            if (!onlyVariant) return
            setBusy(true)
            setMsg(null)
            const r = await addToCart({
              variantId: onlyVariant.id,
              quantity: 1,
            })
            setBusy(false)
            setMsg(r.ok ? "Added to cart." : r.error ?? "Error")
          }}
        >
          {busy ? "Adding…" : !only.inStock ? "Sold out" : "Add to cart"}
        </PillButton>
        {msg && <p className="text-sm text-doodle-ink/70">{msg}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-7">
      {options.map((opt) => (
        <div key={opt.id}>
          <div className="font-sans text-[13px] font-medium text-doodle-ink/70">
            {opt.title}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {opt.values?.map((val) => {
              const active = selection[opt.id ?? ""] === val.value
              return (
                <button
                  key={val.id}
                  type="button"
                  onClick={() =>
                    setSelection((s) => ({
                      ...s,
                      [opt.id ?? ""]: val.value ?? "",
                    }))
                  }
                  className={[
                    "px-4 py-2 rounded-full border text-sm font-medium transition-[background-color,border-color,box-shadow,transform] duration-200 active:scale-[0.97]",
                    active
                      ? "bg-doodle-orange text-doodle-stitch border-doodle-orange shadow-subtle"
                      : "bg-doodle-canvas text-doodle-ink border-doodle-ink/15 hover:border-doodle-ink/35",
                  ].join(" ")}
                >
                  {val.value}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div className="pt-2">
        <div className="font-display text-3xl text-doodle-ink">
          {price != null ? formatINR(price) : "—"}
        </div>
        {selected && !inStock && (
          <div className="mt-2 space-y-2">
            <Tag tone="danger">Sold out</Tag>
            <p className="text-sm text-doodle-ink/60">
              Want us to text you when it&apos;s back?
            </p>
          </div>
        )}
        {lowStock && (
          <div className="mt-2">
            <Tag tone="accent">Only {remaining} left</Tag>
          </div>
        )}
      </div>

      <PillButton
        variant="primary"
        size="lg"
        onClick={onAdd}
        disabled={!selected || !inStock || busy}
      >
        {busy ? "Adding…" : selected && !inStock ? "Sold out" : "Add to cart"}
      </PillButton>

      {msg && <p className="text-sm text-doodle-ink/70">{msg}</p>}
    </div>
  )
}
