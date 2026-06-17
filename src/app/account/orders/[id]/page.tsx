import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { NavWithCart } from "@/components/sections/NavWithCart"
import { Footer } from "@/components/sections/Footer"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { getCustomer, getCustomerOrder } from "@/lib/medusa/auth"
import { formatINR } from "@/lib/medusa/types"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Order details — DOODLE",
  robots: { index: false, follow: false },
}

function formatDate(value: string | Date | undefined): string {
  if (!value) return ""
  const d = typeof value === "string" ? new Date(value) : value
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default async function AccountOrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const customer = await getCustomer()
  if (!customer) redirect("/account/login")

  const { id } = await params
  const order = await getCustomerOrder(id)
  if (!order) notFound()

  const displayId = order.display_id ?? order.id.slice(-6).toUpperCase()
  const addr = order.shipping_address
  const isCod = order.payment_collections?.some((pc) =>
    pc.payments?.some((p) => p.provider_id === "pp_cod_cod")
  )

  return (
    <>
      <NavWithCart />
      <main className="bg-[color:var(--color-surface-blush)] min-h-screen">
        <section className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-24">
          <Link
            href="/account"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-doodle-ink/55 hover:text-doodle-ink"
          >
            ← All orders
          </Link>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <Eyebrow variant="mono" accent="orange">
                Order
              </Eyebrow>
              <h1 className="mt-3 font-display text-[clamp(1.875rem,4.5vw,2.75rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
                DOD-{displayId}
              </h1>
              <p className="mt-2 text-sm text-doodle-ink/60">
                Placed {formatDate(order.created_at)}
                {order.status ? ` · ${order.status}` : ""}
                {isCod ? " · Cash on delivery" : ""}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="mt-10 rounded-lg bg-doodle-canvas border-2 border-dashed border-doodle-ink/20 p-5 sm:p-7">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-doodle-ink/55">
              What you ordered
            </h2>
            <ul className="mt-4 divide-y divide-dashed divide-doodle-ink/15">
              {order.items?.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-4 py-3 first:pt-0">
                  <div>
                    <div className="text-doodle-ink">{item.title}</div>
                    {item.variant?.title && (
                      <div className="text-sm text-doodle-ink/55">{item.variant.title}</div>
                    )}
                    <div className="text-sm text-doodle-ink/55">Qty {item.quantity}</div>
                  </div>
                  <div className="text-doodle-ink whitespace-nowrap">
                    {formatINR((item.unit_price ?? 0) * (item.quantity ?? 1))}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-1.5 border-t-2 border-dashed border-doodle-ink/15 pt-4">
              <SummaryRow label="Subtotal" value={formatINR(order.subtotal ?? 0)} />
              <SummaryRow
                label="Shipping"
                value={
                  (order.shipping_total ?? 0) === 0
                    ? "Free"
                    : formatINR(order.shipping_total ?? 0)
                }
              />
              <div className="flex items-center justify-between pt-2">
                <span className="font-display text-lg text-doodle-ink">Total</span>
                <span className="font-display text-lg text-doodle-ink">
                  {formatINR(order.total ?? 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          {addr && (
            <div className="mt-6 rounded-lg bg-doodle-canvas border-2 border-dashed border-doodle-ink/20 p-5 sm:p-7">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-doodle-ink/55">
                Shipping to
              </h2>
              <p className="mt-3 text-sm text-doodle-ink/75 leading-relaxed">
                {addr.first_name} {addr.last_name}
                <br />
                {addr.address_1}
                {addr.address_2 ? (
                  <>
                    <br />
                    {addr.address_2}
                  </>
                ) : null}
                <br />
                {addr.city}, {addr.province} {addr.postal_code}
                {addr.phone ? (
                  <>
                    <br />
                    {addr.phone}
                  </>
                ) : null}
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-doodle-ink/65">{label}</span>
      <span className="text-doodle-ink/85">{value}</span>
    </div>
  )
}
