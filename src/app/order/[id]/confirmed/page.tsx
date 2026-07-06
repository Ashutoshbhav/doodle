import Link from "next/link"
import { notFound } from "next/navigation"
import { medusa, isCommerceConfigured } from "@/lib/medusa/client"
import { getCustomerOrder, wasOrderPlacedHere } from "@/lib/medusa/auth"
import { NavWithCart } from "@/components/sections/NavWithCart"
import { Footer } from "@/components/sections/Footer"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { formatINR } from "@/lib/medusa/types"
import type { Order } from "@/lib/medusa/types"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Order confirmed — DOODLE",
  robots: { index: false, follow: false },
}

async function fetchOrder(id: string): Promise<Order | null> {
  if (!isCommerceConfigured) return null
  try {
    const { order } = await medusa.store.order.retrieve(id, {
      fields:
        "*items,*items.variant,*items.variant.product,*shipping_address,*payment_collections,*payment_collections.payments,*shipping_methods,display_id,email,subtotal,total,shipping_total,tax_total,currency_code",
    })
    return order as unknown as Order
  } catch {
    return null
  }
}

export default async function OrderConfirmedPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // IDOR guard: only the browser that placed this order (httpOnly capability
  // cookie) or the authenticated owner may view it. A guessed/leaked ID with
  // neither → 404. Without this, store.order.retrieve(id) leaks name, address,
  // phone, email and line items to anyone with the ID.
  const order = (await wasOrderPlacedHere(id))
    ? await fetchOrder(id)
    : await getCustomerOrder(id)
  if (!order) notFound()

  const customerFirst = order.shipping_address?.first_name ?? ""
  const displayId = order.display_id ?? order.id.slice(-6).toUpperCase()
  const orderNumber = `DOD-${displayId}`

  const isCod = order.payment_collections?.some((pc) =>
    pc.payments?.some((p) => p.provider_id === "pp_cod_cod")
  )

  return (
    <>
      <NavWithCart />
      <main className="bg-[color:var(--color-surface-blush)] min-h-screen">
        <section className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-24">
          <Eyebrow variant="mono" accent="orange">Order placed</Eyebrow>
          <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
            Got it{customerFirst ? `, ${customerFirst}` : ""}.
          </h1>
          <p className="mt-4 text-lg text-doodle-ink/75 max-w-xl">
            {isCod ? (
              <>
                <span className="text-doodle-ink">{orderNumber}</span> is now in
                motion. Pay {formatINR(order.total ?? 0)} when the courier hands
                it over — they&apos;ll message you the day they&apos;re on the way.
              </>
            ) : (
              <>
                <span className="text-doodle-ink">{orderNumber}</span> is now in
                motion. We&apos;ll write again when the courier picks it up.
              </>
            )}
          </p>

          <div className="mt-10 rounded-lg bg-doodle-canvas border-2 border-dashed border-doodle-ink/20 p-6 sm:p-8">
            <h2 className="font-display text-xl text-doodle-ink">What you ordered</h2>
            <ul className="mt-4 space-y-3">
              {order.items?.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 text-sm">
                  <div>
                    <div className="text-doodle-ink">{item.title}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-doodle-ink/55">
                      {item.variant?.title} · qty {item.quantity}
                    </div>
                  </div>
                  <div className="font-mono text-doodle-ink whitespace-nowrap">
                    {formatINR((item.unit_price ?? 0) * item.quantity)}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-4 border-t border-dashed border-doodle-ink/15 space-y-2 text-sm">
              <div className="flex justify-between text-doodle-ink/75">
                <span>Subtotal</span>
                <span className="font-mono">{formatINR(order.subtotal ?? 0)}</span>
              </div>
              <div className="flex justify-between text-doodle-ink/75">
                <span>Shipping</span>
                <span className="font-mono">
                  {(order.shipping_total ?? 0) === 0
                    ? "Free"
                    : formatINR(order.shipping_total ?? 0)}
                </span>
              </div>
              <div className="flex justify-between text-doodle-ink font-display text-xl pt-3 border-t border-dashed border-doodle-ink/15">
                <span>Total</span>
                <span>{formatINR(order.total ?? 0)}</span>
              </div>
            </div>
          </div>

          {order.shipping_address && (
            <div className="mt-6 rounded-lg bg-doodle-canvas border-2 border-dashed border-doodle-ink/20 p-6">
              <h2 className="font-display text-xl text-doodle-ink">Shipping to</h2>
              <p className="mt-3 text-sm text-doodle-ink/80 leading-relaxed">
                {order.shipping_address.first_name} {order.shipping_address.last_name}
                <br />
                {order.shipping_address.address_1}
                {order.shipping_address.address_2 && (
                  <>
                    <br />
                    {order.shipping_address.address_2}
                  </>
                )}
                <br />
                {order.shipping_address.city}, {order.shipping_address.province}{" "}
                {order.shipping_address.postal_code}
                <br />
                {order.shipping_address.phone}
              </p>
            </div>
          )}

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-doodle-yellow/30 border-2 border-dashed border-doodle-ink/20 p-5">
              <div className="font-display text-lg text-doodle-ink">
                Save your address
              </div>
              <p className="mt-1 text-sm text-doodle-ink/70">
                Next order is two clicks instead of seven.
              </p>
              {/* /account/claim doesn't exist yet — login handles both sign-in
                  and first-time account creation until a claim flow ships. */}
              <Link
                href="/account/login"
                className="
                  mt-3 inline-flex items-center gap-2 text-sm font-medium text-doodle-ink
                  underline underline-offset-4 hover:text-doodle-ink/70
                "
              >
                Create an account →
              </Link>
            </div>
            <div className="rounded-lg bg-doodle-pink/20 border-2 border-dashed border-doodle-ink/20 p-5">
              <div className="font-display text-lg text-doodle-ink">
                Tell a friend
              </div>
              <p className="mt-1 text-sm text-doodle-ink/70">
                Some parent you know is about to buy character tee number five.
              </p>
              <Link
                href="/shop"
                className="
                  mt-3 inline-flex items-center gap-2 text-sm font-medium text-doodle-ink
                  underline underline-offset-4 hover:text-doodle-ink/70
                "
              >
                Share DOODLE →
              </Link>
            </div>
          </div>

          <p className="mt-10 text-center text-xs font-mono uppercase tracking-[0.14em] text-doodle-ink/45">
            A confirmation email is on its way to {order.email}
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
