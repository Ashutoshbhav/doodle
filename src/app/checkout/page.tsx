import { redirect } from "next/navigation"
import { NavWithCart } from "@/components/sections/NavWithCart"
import { Footer } from "@/components/sections/Footer"
import { CheckoutForm } from "@/components/shop/CheckoutForm"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { getCart } from "@/lib/medusa/cart"
import { formatINR } from "@/lib/medusa/types"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Checkout — DOODLE",
  robots: { index: false, follow: false },
}

export default async function CheckoutPage() {
  const cart = await getCart()
  if (!cart || (cart.items?.length ?? 0) === 0) redirect("/cart")

  return (
    <>
      <NavWithCart />
      <main className="bg-[color:var(--color-surface-blush)] min-h-screen">
        <section className="mx-auto max-w-6xl px-6 md:px-10 py-12 md:py-20 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <Eyebrow variant="rule" accent="orange">Checkout</Eyebrow>
            <h1 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              Almost there.
            </h1>
            <p className="mt-3 max-w-md text-doodle-ink/70">
              Four quick steps. We&apos;ll write once the courier&apos;s on the way.
            </p>
            <div className="mt-10">
              <CheckoutForm cart={cart} />
            </div>
          </div>

          <aside className="self-start lg:sticky lg:top-24">
            <div className="rounded-[1.25rem] bg-doodle-canvas p-6 shadow-card">
              <h2 className="font-display text-lg text-doodle-ink">Order summary</h2>
              <ul className="mt-4 space-y-3">
                {cart.items?.map((line) => (
                  <li key={line.id} className="flex justify-between gap-3 text-sm">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-doodle-ink">{line.title}</div>
                      <div className="text-xs text-doodle-ink/55">
                        {line.variant?.title} · qty {line.quantity}
                      </div>
                    </div>
                    <div className="whitespace-nowrap font-medium text-doodle-ink">
                      {formatINR(line.unit_price * line.quantity)}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5 space-y-2 border-t border-doodle-ink/10 pt-4 text-sm">
                <div className="flex justify-between text-doodle-ink/70">
                  <span>Subtotal</span>
                  {/* item_subtotal: Medusa's cart.subtotal INCLUDES shipping,
                      which reads absurd next to a separate Shipping row */}
                  <span className="font-medium text-doodle-ink">{formatINR(cart.item_subtotal ?? cart.subtotal ?? 0)}</span>
                </div>
                <div className="flex justify-between text-doodle-ink/70">
                  <span>Shipping</span>
                  <span className="font-medium text-doodle-ink">
                    {/* "Free" only once a real method is attached — before
                        that it's not free, it's just not chosen yet. */}
                    {cart.shipping_methods?.length
                      ? (cart.shipping_total ?? 0) > 0
                        ? formatINR(cart.shipping_total ?? 0)
                        : "Free"
                      : "At delivery step"}
                  </span>
                </div>
                <div className="flex justify-between text-doodle-ink/70">
                  <span>Taxes / GST</span>
                  <span className="font-medium text-doodle-ink">
                    {(cart.tax_total ?? 0) > 0
                      ? formatINR(cart.tax_total ?? 0)
                      : "Included"}
                  </span>
                </div>
                <div className="flex justify-between border-t border-doodle-ink/10 pt-3 font-display text-xl text-doodle-ink">
                  <span>Total</span>
                  <span>{formatINR(cart.total ?? 0)}</span>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-doodle-ink/50">
                Prices inclusive of GST where applicable. Free shipping above ₹999.
              </p>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  )
}
