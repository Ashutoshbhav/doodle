import Link from "next/link"
import { NavWithCart } from "@/components/sections/NavWithCart"
import { Footer } from "@/components/sections/Footer"
import { CartLine } from "@/components/shop/CartLine"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { PillButton } from "@/components/ui/PillButton"
import { getCart } from "@/lib/medusa/cart"
import { formatINR } from "@/lib/medusa/types"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Your basket — DOODLE",
  description: "Review what's in your basket.",
}

export default async function CartPage() {
  const cart = await getCart()
  const items = cart?.items ?? []

  return (
    <>
      <NavWithCart />
      <main className="bg-[color:var(--color-surface-blush)] min-h-screen">
        <section className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-24">
          <Eyebrow variant="rule" accent="orange">Your order</Eyebrow>
          <h1 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
            Your basket
          </h1>

          {items.length === 0 ? (
            <div className="mt-10 grid place-items-center rounded-[1rem] bg-doodle-canvas px-6 py-16 text-center shadow-card">
              <p className="max-w-sm text-lg leading-relaxed text-doodle-ink/75">
                Nothing in the basket yet. Pick a tee, pick some patches.
              </p>
              <div className="mt-7">
                <Link href="/shop">
                  <PillButton variant="primary">Browse the drop</PillButton>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-10 rounded-[1rem] bg-doodle-canvas px-6 py-2 shadow-card">
                {items.map((line) => (
                  <CartLine key={line.id} line={line} />
                ))}
              </div>

              <div className="mt-8 rounded-[1rem] bg-doodle-canvas p-6 shadow-card">
                <div className="flex justify-between text-sm text-doodle-ink/70">
                  <span>Subtotal</span>
                  <span className="font-medium text-doodle-ink">
                    {formatINR(cart?.subtotal ?? 0)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-doodle-ink/70">
                  <span>Shipping</span>
                  <span className="font-medium text-doodle-ink">
                    {(cart?.shipping_total ?? 0) > 0
                      ? formatINR(cart?.shipping_total ?? 0)
                      : "Free"}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-doodle-ink/70">
                  <span>Taxes / GST</span>
                  <span className="font-medium text-doodle-ink">
                    {(cart?.tax_total ?? 0) > 0
                      ? formatINR(cart?.tax_total ?? 0)
                      : "Included"}
                  </span>
                </div>
                <div className="mt-4 flex justify-between border-t border-doodle-ink/10 pt-4 font-display text-2xl text-doodle-ink">
                  <span>Total</span>
                  <span>{formatINR(cart?.total ?? 0)}</span>
                </div>
                <p className="mt-4 text-xs text-doodle-ink/50">
                  Prices inclusive of GST where applicable.
                </p>

                <div className="mt-7">
                  <Link href="/checkout" className="block">
                    <PillButton variant="primary" size="lg" className="w-full">
                      Continue to checkout
                    </PillButton>
                  </Link>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
