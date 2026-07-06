import Link from "next/link"
import { redirect } from "next/navigation"
import { NavWithCart } from "@/components/sections/NavWithCart"
import { Footer } from "@/components/sections/Footer"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { LogoutButton } from "@/components/account/LogoutButton"
import { getCustomer, listCustomerOrders } from "@/lib/medusa/auth"
import { formatINR } from "@/lib/medusa/types"
import type { Order } from "@/lib/medusa/types"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Your account — DOODLE",
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

export default async function AccountPage() {
  const customer = await getCustomer()
  if (!customer) redirect("/account/login")

  const orders = await listCustomerOrders()
  const firstName = customer.first_name ?? ""

  return (
    <>
      <NavWithCart />
      <main className="bg-[color:var(--color-surface-blush)] min-h-screen">
        <section className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-24">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Eyebrow variant="mono" accent="orange">
                Your account
              </Eyebrow>
              <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
                Hi{firstName ? `, ${firstName}` : ""}.
              </h1>
              <p className="mt-3 text-base text-doodle-ink/70">{customer.email}</p>
            </div>
            <LogoutButton />
          </div>

          <div className="mt-12">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-doodle-ink/55">
              Your orders
            </h2>

            {orders.length === 0 ? (
              <div className="mt-4 rounded-lg bg-doodle-canvas border-2 border-dashed border-doodle-ink/20 p-8 text-center">
                <p className="text-doodle-ink/75">No orders yet.</p>
                <Link
                  href="/shop"
                  className="
                    mt-5 inline-flex items-center justify-center h-11 px-6 rounded-full
                    bg-doodle-orange text-doodle-ink font-medium
                    border-2 border-dashed border-doodle-stitch
                    hover:scale-[1.02] active:scale-[0.98] transition-transform
                  "
                >
                  Start creating →
                </Link>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {orders.map((order) => (
                  <OrderRow key={order.id} order={order} formatDate={formatDate} />
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function OrderRow({
  order,
  formatDate,
}: {
  order: Order
  formatDate: (v: string | Date | undefined) => string
}) {
  const displayId = order.display_id ?? order.id.slice(-6).toUpperCase()
  const itemCount =
    order.items?.reduce((n, i) => n + (i.quantity ?? 0), 0) ?? 0

  return (
    <li>
      <Link
        href={`/account/orders/${order.id}`}
        className="
          flex items-center justify-between gap-4
          rounded-lg bg-doodle-canvas border-2 border-dashed border-doodle-ink/20 p-5
          hover:border-doodle-ink/50 transition-colors
        "
      >
        <div>
          <div className="font-display text-lg text-doodle-ink">DOD-{displayId}</div>
          <div className="mt-0.5 text-sm text-doodle-ink/60">
            {formatDate(order.created_at)} · {itemCount}{" "}
            {itemCount === 1 ? "item" : "items"}
            {order.status ? ` · ${order.status}` : ""}
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-lg text-doodle-ink">
            {formatINR(order.total ?? 0)}
          </div>
          <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-doodle-ink/50">
            View →
          </div>
        </div>
      </Link>
    </li>
  )
}
