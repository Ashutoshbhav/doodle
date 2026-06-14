import "server-only"

import { cookies } from "next/headers"
import { medusa, isCommerceConfigured } from "./client"
import type { Customer, Order } from "./types"

const AUTH_COOKIE = "doodle_auth_token"
const AUTH_TTL_DAYS = 7

/** Read the stored customer JWT, if any. */
export async function getAuthToken(): Promise<string | null> {
  const jar = await cookies()
  return jar.get(AUTH_COOKIE)?.value ?? null
}

/** Persist the customer JWT in an httpOnly cookie (not readable by JS → XSS-safe). */
export async function setAuthToken(token: string): Promise<void> {
  const jar = await cookies()
  jar.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * AUTH_TTL_DAYS,
    path: "/",
  })
}

/** Remove the stored JWT (logout / stale token cleanup). */
export async function clearAuthToken(): Promise<void> {
  const jar = await cookies()
  jar.delete(AUTH_COOKIE)
}

/**
 * Bearer header for the current session. Passed per-request to the SDK rather
 * than via the shared `medusa.client.setToken()` singleton, which would leak one
 * request's identity into concurrent requests on the server.
 */
async function authHeader(): Promise<Record<string, string> | null> {
  const token = await getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : null
}

/**
 * Resolve the logged-in customer, or null. A 401 (expired/invalid token) clears
 * the cookie so the UI falls back to logged-out state cleanly.
 */
export async function getCustomer(): Promise<Customer | null> {
  if (!isCommerceConfigured) return null
  const headers = await authHeader()
  if (!headers) return null
  try {
    const { customer } = await medusa.store.customer.retrieve({}, headers)
    return customer as Customer
  } catch (e: unknown) {
    // Only drop the session when the token is genuinely rejected (401/403).
    // A transient 500/network blip should NOT silently log the customer out.
    const status = (e as { status?: number })?.status
    if (status === 401 || status === 403) {
      await clearAuthToken()
    }
    return null
  }
}

/** List the authenticated customer's orders (most recent first). */
export async function listCustomerOrders(): Promise<Order[]> {
  if (!isCommerceConfigured) return []
  const headers = await authHeader()
  if (!headers) return []
  try {
    const { orders } = await medusa.store.order.list(
      {
        limit: 50,
        order: "-created_at",
        fields:
          "id,display_id,status,total,currency_code,created_at,*items,*items.variant",
      },
      headers
    )
    return (orders ?? []) as unknown as Order[]
  } catch {
    return []
  }
}

/**
 * Retrieve a single order scoped to the authenticated customer. Medusa returns
 * 404 if the order isn't theirs, so this can't be used to read others' orders.
 */
export async function getCustomerOrder(id: string): Promise<Order | null> {
  if (!isCommerceConfigured) return null
  const headers = await authHeader()
  if (!headers) return null
  try {
    const { order } = await medusa.store.order.retrieve(
      id,
      {
        fields:
          "*items,*items.variant,*items.variant.product,*shipping_address,*payment_collections,*payment_collections.payments,*shipping_methods,display_id,email,status,subtotal,total,shipping_total,tax_total,currency_code,created_at",
      },
      headers
    )
    return order as unknown as Order
  } catch {
    return null
  }
}
