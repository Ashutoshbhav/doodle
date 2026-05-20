"use client"

import * as React from "react"
import type { Product, Variant } from "@/lib/medusa/types"
import { formatINR } from "@/lib/medusa/types"
import { PillButton } from "@/components/ui/PillButton"
import { addToCart } from "@/app/actions/checkout"

type Selection = Record<string, string>

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
  const inStock =
    selected == null ||
    selected.inventory_quantity == null ||
    (selected.inventory_quantity ?? 0) > 0

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
    return (
      <div className="space-y-5">
        <div className="font-display text-3xl text-doodle-ink">
          {onlyVariant?.calculated_price?.calculated_amount != null
            ? formatINR(onlyVariant.calculated_price.calculated_amount)
            : "—"}
        </div>
        <PillButton
          variant="primary"
          size="lg"
          disabled={!onlyVariant || busy}
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
          {busy ? "Adding…" : "Add to cart"}
        </PillButton>
        {msg && <p className="text-sm text-doodle-ink/70">{msg}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-7">
      {options.map((opt) => (
        <div key={opt.id}>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-doodle-ink/55">
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
                    "px-4 py-2 rounded-full border-2 border-dashed text-sm transition-colors",
                    active
                      ? "bg-doodle-ink text-doodle-canvas border-doodle-ink"
                      : "bg-doodle-canvas text-doodle-ink border-doodle-ink/30 hover:border-doodle-ink",
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
          <p className="mt-2 text-sm text-doodle-ink/60">
            Sold out. Want us to text you when it&apos;s back?
          </p>
        )}
      </div>

      <PillButton
        variant="primary"
        size="lg"
        onClick={onAdd}
        disabled={!selected || !inStock || busy}
      >
        {busy ? "Adding…" : "Add to cart"}
      </PillButton>

      {msg && <p className="text-sm text-doodle-ink/70">{msg}</p>}
    </div>
  )
}
