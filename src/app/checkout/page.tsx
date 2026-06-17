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
            <Eyebrow variant="mono" accent="orange">Checkout</Eyebrow>
            <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              Almost there.
            </h1>
            <p className="mt-3 text-doodle-ink/70 max-w-md">
              Three quick steps. We&apos;ll write once the courier&apos;s on the way.
            </p>
            <div className="mt-10">
              <CheckoutForm cart={cart} />
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 self-start">
            <div className="rounded-lg bg-doodle-canvas border-2 border-dashed border-doodle-ink/20 p-6">
              <h2 className="font-display text-lg text-doodle-ink">Order summary</h2>
              <ul className="mt-4 space-y-3">
                {cart.items?.map((line) => (
                  <li key={line.id} className="flex justify-between gap-3 text-sm">
                    <div className="flex-1 min-w-0">
                      <div className="text-doodle-ink truncate">{line.title}</div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-doodle-ink/55">
                        {line.variant?.title} · qty {line.quantity}
                      </div>
                    </div>
                    <div className="font-mono text-doodle-ink whitespace-nowrap">
                      {formatINR(line.unit_price * line.quantity)}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-dashed border-doodle-ink/15 space-y-2 text-sm">
                <div className="flex justify-between text-doodle-ink/75">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatINR(cart.subtotal ?? 0)}</span>
                </div>
                <div className="flex justify-between text-doodle-ink/75">
                  <span>Shipping</span>
                  <span className="font-mono">
                    {(cart.shipping_total ?? 0) > 0
                      ? formatINR(cart.shipping_total ?? 0)
                      : "Free"}
                  </span>
                </div>
                <div className="flex justify-between text-doodle-ink/75">
                  <span>Taxes / GST</span>
                  <span className="font-mono">
                    {(cart.tax_total ?? 0) > 0
                      ? formatINR(cart.tax_total ?? 0)
                      : "Included"}
                  </span>
                </div>
                <div className="flex justify-between text-doodle-ink font-display text-xl pt-3 border-t border-dashed border-doodle-ink/15">
                  <span>Total</span>
                  <span>{formatINR(cart.total ?? 0)}</span>
                </div>
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-doodle-ink/45 text-center">
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
