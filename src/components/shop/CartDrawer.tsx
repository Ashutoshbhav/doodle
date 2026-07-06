"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { X, CheckCircle } from "@phosphor-icons/react/dist/ssr"
import { formatINR } from "@/lib/medusa/types"
import { QuickAdd } from "@/components/shop/QuickAdd"

/* Mini-cart drawer — opens the moment something lands in the basket.
   This is where the attach rate is won: the added item confirmed, patch
   suggestions one tap away, and a straight line to checkout. */

export type CartSuggestion = {
  handle: string
  title: string
  thumbnail: string | null
  price: number | null
  /** Variant to one-tap add. Null = multi-variant, link to the PDP. */
  variantId: string | null
}

export type AddedItem = { title: string; variant?: string; note?: string }

type Ctx = { notifyAdded: (item: AddedItem) => void }

const CartDrawerContext = React.createContext<Ctx | null>(null)

/** Optional hook — components fall back to inline feedback outside a provider. */
export function useCartDrawer(): Ctx | null {
  return React.useContext(CartDrawerContext)
}

export function CartDrawerProvider({
  suggestions,
  children,
}: {
  suggestions: CartSuggestion[]
  children: React.ReactNode
}) {
  const [added, setAdded] = React.useState<AddedItem | null>(null)
  const reduceMotion = useReducedMotion()
  const panelRef = React.useRef<HTMLDivElement | null>(null)

  const close = React.useCallback(() => setAdded(null), [])

  React.useEffect(() => {
    if (!added) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close()
    document.addEventListener("keydown", onKey)
    panelRef.current?.focus()
    return () => document.removeEventListener("keydown", onKey)
  }, [added, close])

  return (
    <CartDrawerContext.Provider value={{ notifyAdded: setAdded }}>
      {children}
      <AnimatePresence>
        {added && (
          <>
            <motion.button
              type="button"
              aria-label="Close basket panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={close}
              className="fixed inset-0 z-50 bg-doodle-ink/35 backdrop-blur-[2px]"
            />
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label="Added to basket"
              initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-doodle-canvas shadow-2xl outline-none"
            >
              <div className="flex items-center justify-between border-b border-doodle-ink/10 px-6 py-4">
                <span className="inline-flex items-center gap-2 font-display text-lg text-doodle-ink">
                  <CheckCircle weight="duotone" size={22} className="text-doodle-berry" />
                  In the basket
                </span>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="grid h-11 w-11 place-items-center rounded-full text-doodle-ink/70 hover:bg-doodle-ink/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-berry/30"
                >
                  <X weight="bold" size={20} aria-hidden />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="rounded-[1.25rem] bg-doodle-stitch p-4 shadow-subtle">
                  <div className="font-display text-base leading-tight text-doodle-ink">
                    {added.title}
                  </div>
                  {added.variant && (
                    <div className="mt-0.5 text-xs text-doodle-ink/55">{added.variant}</div>
                  )}
                  {added.note && (
                    <div className="mt-1.5 text-xs font-medium text-doodle-red">{added.note}</div>
                  )}
                </div>

                {suggestions.length > 0 && (
                  <div className="mt-7">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-doodle-ink/55">
                      Goes on the same tee
                    </h3>
                    <ul className="mt-3 space-y-3">
                      {suggestions.slice(0, 3).map((s) => (
                        <li
                          key={s.handle}
                          className="flex items-center gap-3 rounded-[1.25rem] bg-doodle-stitch p-3 shadow-subtle"
                        >
                          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-doodle-canvas">
                            {s.thumbnail && (
                              <Image src={s.thumbnail} alt={s.title} fill sizes="56px" className="object-contain p-1" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-doodle-ink">
                              {s.title}
                            </span>
                            {s.price != null && (
                              <span className="text-xs text-doodle-ink/55">{formatINR(s.price)}</span>
                            )}
                          </span>
                          {s.variantId ? (
                            <QuickAdd variantId={s.variantId} />
                          ) : (
                            <Link
                              href={`/shop/${s.handle}`}
                              onClick={close}
                              className="inline-flex h-9 items-center rounded-full bg-doodle-canvas px-4 text-xs font-semibold text-doodle-ink shadow-subtle"
                            >
                              View
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2.5 border-t border-doodle-ink/10 px-6 py-5">
                <Link
                  href="/checkout"
                  className="flex h-12 items-center justify-center rounded-full bg-doodle-orange font-medium text-doodle-ink shadow-card transition-transform active:scale-[0.98]"
                >
                  Checkout
                </Link>
                <Link
                  href="/cart"
                  className="flex h-12 items-center justify-center rounded-full bg-doodle-stitch font-medium text-doodle-ink shadow-subtle transition-transform active:scale-[0.98]"
                >
                  View basket
                </Link>
                <button
                  type="button"
                  onClick={close}
                  className="w-full py-1 text-center text-sm font-medium text-doodle-ink/55 hover:text-doodle-ink"
                >
                  Keep shopping
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </CartDrawerContext.Provider>
  )
}
