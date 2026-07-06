"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { addToCart } from "@/app/actions/checkout"

/* One-tap add for single-variant products (patches, packs) in cross-sell
   spots. Multi-variant products should link to their PDP instead — never
   guess a size on the shopper's behalf. */

export function QuickAdd({
  variantId,
  className = "",
  onAdded,
}: {
  variantId: string
  className?: string
  onAdded?: () => void
}) {
  const router = useRouter()
  const [state, setState] = React.useState<"idle" | "busy" | "added" | "error">("idle")

  async function add() {
    setState("busy")
    const r = await addToCart({ variantId, quantity: 1 })
    if (!r.ok) {
      setState("error")
      return
    }
    setState("added")
    router.refresh()
    onAdded?.()
    setTimeout(() => setState("idle"), 2500)
  }

  return (
    <button
      type="button"
      onClick={add}
      disabled={state === "busy"}
      className={`inline-flex h-9 items-center justify-center rounded-full bg-doodle-orange px-4 text-xs font-semibold text-doodle-stitch shadow-subtle transition-[transform,background-color] duration-200 hover:bg-doodle-orange/95 active:scale-[0.97] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-orange/40 ${className}`}
    >
      {state === "busy" ? "Adding…" : state === "added" ? "Added ✓" : state === "error" ? "Try again" : "Add"}
    </button>
  )
}
