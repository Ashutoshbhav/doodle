import "server-only"

import { cookies } from "next/headers"
import { medusa, isCommerceConfigured } from "./client"
import type { Cart } from "./types"

const CART_COOKIE = "doodle_cart_id"
const CART_TTL_DAYS = 30

export async function getCart(): Promise<Cart | null> {
  if (!isCommerceConfigured) return null
  const jar = await cookies()
  const id = jar.get(CART_COOKIE)?.value
  if (!id) return null
  try {
    const { cart } = await medusa.store.cart.retrieve(id, {
      fields:
        "+items.*,+items.variant.*,+items.variant.inventory_quantity,+items.product.*,+shipping_address.*,+billing_address.*,+region.*",
    })
    return cart as Cart
  } catch {
    jar.delete(CART_COOKIE)
    return null
  }
}

export async function getOrCreateCart(regionId: string): Promise<Cart> {
  const existing = await getCart()
  if (existing) return existing

  const { cart } = await medusa.store.cart.create({ region_id: regionId })
  const jar = await cookies()
  jar.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * CART_TTL_DAYS,
    path: "/",
  })
  return cart as Cart
}

export async function getIndiaRegionId(): Promise<string> {
  const { regions } = await medusa.store.region.list()
  const india = regions.find((r) =>
    r.countries?.some((c) => c.iso_2 === "in")
  )
  if (!india) {
    throw new Error(
      "India region is not configured in Medusa admin. Create one at Admin → Settings → Regions."
    )
  }
  return india.id
}

export async function getCartLineCount(): Promise<number> {
  const cart = await getCart()
  return cart?.items?.reduce((n, i) => n + (i.quantity ?? 0), 0) ?? 0
}
