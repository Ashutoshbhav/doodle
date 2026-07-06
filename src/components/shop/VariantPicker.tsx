"use client"

import * as React from "react"
import type { Product, Variant } from "@/lib/medusa/types"
import { formatINR } from "@/lib/medusa/types"
import { PillButton } from "@/components/ui/PillButton"
import { Tag } from "@/components/ui/Tag"
import { addToCart } from "@/app/actions/checkout"
import { useCartDrawer } from "@/components/shop/CartDrawer"
import { RestockCapture } from "@/components/shop/RestockCapture"

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
  // Missing number = the query didn't compute inventory — unknown, not zero.
  // Never show "Sold out" off absent data.
  if (typeof variant.inventory_quantity !== "number") return { inStock: true, remaining: null }
  const qty = variant.inventory_quantity
  return { inStock: qty > 0, remaining: qty }
}

/** "3-4Y" → "3–4 yrs" — variant values are age bands; speak parent. */
function prettySize(value: string): string {
  const m = /^(\d+)\s*-\s*(\d+)\s*Y$/i.exec(value.trim())
  return m ? `${m[1]}–${m[2]} yrs` : value
}

export function VariantPicker({ product }: { product: Product }) {
  const options = product.options ?? []
  const drawer = useCartDrawer()
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

  /** Shared add handler — reports server-side stock clamps honestly and
      opens the mini-cart drawer (falls back to inline text without one). */
  async function addVariant(variant: Variant) {
    setBusy(true)
    setMsg(null)
    const result = await addToCart({ variantId: variant.id, quantity: 1 })
    setBusy(false)
    if (!result.ok) {
      setMsg(result.error ?? "Something went wrong.")
      return
    }
    const adjusted = result.data.adjustedTo
    if (adjusted === null) {
      setMsg("That one just sold out — nothing was added.")
      return
    }
    const note =
      adjusted != null
        ? `Stock is tight — your basket holds the max (${adjusted}).`
        : undefined
    if (drawer) {
      drawer.notifyAdded({
        title: product.title ?? "Added",
        variant: variant.title ?? undefined,
        note,
      })
    } else {
      setMsg(note ?? "Added to cart.")
    }
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
            <RestockCapture sku={onlyVariant?.sku ?? product.handle ?? "item"} />
          </div>
        )}
        {onlyLow && <Tag tone="accent">Only {only.remaining} left</Tag>}
        <StickyAddBar
          price={onlyVariant?.calculated_price?.calculated_amount ?? null}
          disabled={!onlyVariant || !only.inStock || busy}
          label={busy ? "Adding…" : !only.inStock ? "Sold out" : "Add to cart"}
          onAdd={() => onlyVariant && addVariant(onlyVariant)}
        />
        {msg && <p className="text-sm text-doodle-ink/70" role="status">{msg}</p>}
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
                  {prettySize(val.value ?? "")}
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
            <RestockCapture sku={selected.sku ?? selected.id} />
          </div>
        )}
        {lowStock && (
          <div className="mt-2">
            <Tag tone="accent">Only {remaining} left</Tag>
          </div>
        )}
      </div>

      <StickyAddBar
        price={price ?? null}
        disabled={!selected || !inStock || busy}
        label={busy ? "Adding…" : selected && !inStock ? "Sold out" : selected ? "Add to cart" : "Pick your options"}
        onAdd={() => selected && addVariant(selected)}
      />

      {msg && <p className="text-sm text-doodle-ink/70" role="status">{msg}</p>}
    </div>
  )
}

/* Desktop: a normal in-flow button. Mobile (<lg): the same action pinned to
   the bottom of the viewport with the price, so "buy" never scrolls away.
   The spacer stops the pinned bar from covering the page's tail. */
function StickyAddBar({
  price,
  disabled,
  label,
  onAdd,
}: {
  price: number | null
  disabled: boolean
  label: string
  onAdd: () => void
}) {
  return (
    <>
      <div className="hidden lg:block">
        <PillButton variant="primary" size="lg" onClick={onAdd} disabled={disabled}>
          {label}
        </PillButton>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-doodle-ink/10 bg-doodle-canvas/95 px-5 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-4">
          <span className="shrink-0 font-display text-xl text-doodle-ink">
            {price != null ? formatINR(price) : ""}
          </span>
          <PillButton
            variant="primary"
            size="lg"
            onClick={onAdd}
            disabled={disabled}
            className="flex-1"
            showArrow={false}
          >
            {label}
          </PillButton>
        </div>
      </div>
      <div className="h-16 lg:hidden" aria-hidden />
    </>
  )
}
