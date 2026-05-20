import Link from "next/link"
import { NavWithCart } from "@/components/sections/NavWithCart"
import { Footer } from "@/components/sections/Footer"
import { CartLine } from "@/components/shop/CartLine"
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
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
            Your basket
          </h1>

          {items.length === 0 ? (
            <div className="mt-10 rounded-[1.5rem] bg-doodle-canvas p-10 border-2 border-dashed border-doodle-ink/20 text-center">
              <p className="text-doodle-ink/75 text-lg leading-relaxed">
                Nothing in the basket yet. Pick a tee, pick some patches —{" "}
                <Link href="/shop" className="underline underline-offset-4 hover:text-doodle-ink">
                  they&apos;re all over there →
                </Link>
              </p>
            </div>
          ) : (
            <>
              <div className="mt-10 rounded-[1.5rem] bg-doodle-canvas px-6 py-2 border-2 border-dashed border-doodle-ink/20">
                {items.map((line) => (
                  <CartLine key={line.id} line={line} />
                ))}
              </div>

              <div className="mt-8 rounded-[1.5rem] bg-doodle-canvas p-6 border-2 border-dashed border-doodle-ink/20">
                <div className="flex justify-between text-doodle-ink/75 text-sm">
                  <span>Subtotal</span>
                  <span className="font-mono">
                    {formatINR(cart?.subtotal ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between text-doodle-ink/75 text-sm mt-2">
                  <span>Shipping</span>
                  <span className="font-mono">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-doodle-ink font-display text-2xl mt-4 pt-4 border-t border-dashed border-doodle-ink/15">
                  <span>Total</span>
                  <span>{formatINR(cart?.total ?? 0)}</span>
                </div>

                <div className="mt-7 text-center">
                  <Link
                    href="/checkout"
                    className="
                      inline-flex items-center justify-center
                      h-14 px-8 rounded-full
                      bg-doodle-orange text-doodle-stitch font-medium text-lg
                      border-2 border-dashed border-doodle-stitch
                      hover:scale-[1.015] active:scale-[0.98]
                      transition-transform
                    "
                  >
                    Continue to checkout →
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
