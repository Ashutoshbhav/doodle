"use server"

import { createHmac, timingSafeEqual } from "node:crypto"
import { revalidatePath } from "next/cache"
import { getCart, getOrCreateCart, getIndiaRegionId } from "@/lib/medusa/cart"
import { medusa, isCommerceConfigured } from "@/lib/medusa/client"
import { env } from "@/env"
import { rateLimit } from "@/lib/ratelimit"
import { rememberPlacedOrder } from "@/lib/medusa/auth"

type Result<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string }

function ok<T>(data: T): Result<T> {
  return { ok: true, data }
}
function fail(error: string): Result {
  return { ok: false, error }
}

function notConfigured(): Result {
  return fail("Commerce is not yet live. Check back soon.")
}

// Server-side validation — never trust the client form (actions are public POST
// endpoints). Mirrors the India formats the checkout expects.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[6-9]\d{9}$/
const PIN_RE = /^\d{6}$/
const cap = (s: string | undefined, n: number): string => (s ?? "").trim().slice(0, n)
const validQty = (q: number): boolean => Number.isInteger(q) && q > 0 && q <= 99

// ---- Inventory guard -------------------------------------------------------
// The client clamps quantities for UX, but server actions are public POST
// endpoints — the authoritative clamp lives here. A line may exceed available
// stock only when Medusa doesn't manage inventory for it or backorder is on.
import type { CartLine } from "@/lib/medusa/types"

function stockCapFor(line: CartLine): number {
  const v = line.variant
  if (v?.manage_inventory !== true || v?.allow_backorder === true) return 99
  return Math.max(0, v.inventory_quantity ?? 0)
}

/** Clamp a just-written line to available stock. `clamped` is true when we
    had to reduce the line (or remove it entirely: finalQty null). */
async function clampLineToStock(
  cartId: string,
  variantId: string,
): Promise<{ finalQty: number | null; clamped: boolean }> {
  const fresh = await getCart()
  const line = fresh?.items?.find((i) => i.variant_id === variantId)
  if (!fresh || !line) return { finalQty: null, clamped: false }
  const cap = stockCapFor(line)
  if (line.quantity <= cap) return { finalQty: line.quantity, clamped: false }
  if (cap === 0) {
    await medusa.store.cart.deleteLineItem(fresh.id, line.id)
    return { finalQty: null, clamped: true }
  }
  await medusa.store.cart.updateLineItem(fresh.id, line.id, { quantity: cap })
  return { finalQty: cap, clamped: true }
}

export type AddResult = { adjustedTo?: number | null }

export async function addToCart(input: {
  variantId: string
  quantity: number
}): Promise<Result<AddResult>> {
  if (!isCommerceConfigured) return notConfigured() as Result<AddResult>
  if (!input.variantId || !validQty(input.quantity))
    return fail("Invalid item or quantity.") as Result<AddResult>
  try {
    const regionId = await getIndiaRegionId()
    const cart = await getOrCreateCart(regionId)
    await medusa.store.cart.createLineItem(cart.id, {
      variant_id: input.variantId,
      quantity: input.quantity,
    })
    // Overselling guard: repeated adds must never exceed inventory.
    const { finalQty, clamped } = await clampLineToStock(cart.id, input.variantId)
    revalidatePath("/cart")
    revalidatePath("/", "layout")
    return ok({ adjustedTo: clamped ? finalQty : undefined })
  } catch (e: unknown) {
    return fail(e instanceof Error ? e.message : "Unknown error") as Result<AddResult>
  }
}

export async function updateLine(input: {
  lineId: string
  quantity: number
}): Promise<Result> {
  if (!isCommerceConfigured) return notConfigured()
  if (!input.lineId || !validQty(input.quantity)) return fail("Invalid quantity.")
  try {
    const cart = await getCart()
    if (!cart) return fail("Your cart was cleared. Add items again.")
    const line = cart.items?.find((i) => i.id === input.lineId)
    if (!line) return fail("That item is no longer in your cart.")
    // Server-side stock clamp — the UI stepper is advisory only.
    const quantity = Math.min(input.quantity, Math.max(1, stockCapFor(line)))
    await medusa.store.cart.updateLineItem(cart.id, input.lineId, {
      quantity,
    })
    revalidatePath("/cart")
    revalidatePath("/", "layout")
    return ok(undefined)
  } catch (e: unknown) {
    return fail(e instanceof Error ? e.message : "Unknown error")
  }
}

export async function removeLine(input: { lineId: string }): Promise<Result> {
  if (!isCommerceConfigured) return notConfigured()
  try {
    const cart = await getCart()
    if (!cart) return fail("Your cart was cleared.")
    await medusa.store.cart.deleteLineItem(cart.id, input.lineId)
    revalidatePath("/cart")
    revalidatePath("/", "layout")
    return ok(undefined)
  } catch (e: unknown) {
    return fail(e instanceof Error ? e.message : "Unknown error")
  }
}

export async function setCustomerContact(input: {
  email: string
  phone: string
  first_name: string
  last_name: string
}): Promise<Result> {
  if (!isCommerceConfigured) return notConfigured()
  const email = cap(input.email, 254).toLowerCase()
  const phone = cap(input.phone, 10)
  const firstName = cap(input.first_name, 80)
  if (!EMAIL_RE.test(email)) return fail("Enter a valid email address.")
  if (!PHONE_RE.test(phone)) return fail("Enter a valid 10-digit Indian mobile number.")
  if (!firstName) return fail("First name is required.")
  try {
    const cart = await getCart()
    if (!cart) return fail("Your cart was cleared. Add items again.")
    await medusa.store.cart.update(cart.id, {
      email,
      shipping_address: {
        first_name: firstName,
        last_name: cap(input.last_name, 80),
        phone,
      },
    })
    revalidatePath("/checkout")
    return ok(undefined)
  } catch (e: unknown) {
    return fail(e instanceof Error ? e.message : "Unknown error")
  }
}

export async function setShippingAddress(input: {
  first_name: string
  last_name: string
  phone: string
  address_1: string
  address_2?: string
  city: string
  province: string
  postal_code: string
}): Promise<Result> {
  if (!isCommerceConfigured) return notConfigured()
  const phone = cap(input.phone, 10)
  const postal = cap(input.postal_code, 6)
  const firstName = cap(input.first_name, 80)
  const address1 = cap(input.address_1, 200)
  const city = cap(input.city, 80)
  const province = cap(input.province, 80)
  if (!firstName || !address1 || !city || !province) {
    return fail("Name, address, city and state are required.")
  }
  if (!PHONE_RE.test(phone)) return fail("Enter a valid 10-digit Indian mobile number.")
  if (!PIN_RE.test(postal)) return fail("Pincode must be 6 digits.")
  const addr = {
    first_name: firstName,
    last_name: cap(input.last_name, 80),
    phone,
    address_1: address1,
    address_2: cap(input.address_2, 200) || undefined,
    city,
    province,
    postal_code: postal,
    country_code: "in",
  }
  try {
    const cart = await getCart()
    if (!cart) return fail("Your cart was cleared.")
    await medusa.store.cart.update(cart.id, {
      shipping_address: addr,
      billing_address: addr,
    })
    revalidatePath("/checkout")
    return ok(undefined)
  } catch (e: unknown) {
    return fail(e instanceof Error ? e.message : "Unknown error")
  }
}

/** Optional gift note — kidswear is a gifting category. Stored as cart
    metadata so it lands on the order for the packing slip. */
export async function setGiftNote(input: { note: string }): Promise<Result> {
  if (!isCommerceConfigured) return notConfigured()
  const note = cap(input.note, 200)
  try {
    const cart = await getCart()
    if (!cart) return fail("Your cart was cleared.")
    await medusa.store.cart.update(cart.id, {
      metadata: { ...(cart.metadata ?? {}), gift_note: note || null },
    })
    revalidatePath("/checkout")
    return ok(undefined)
  } catch (e: unknown) {
    return fail(e instanceof Error ? e.message : "Unknown error")
  }
}

// ---- Shipping method -------------------------------------------------------
// Medusa v2 will not reliably complete a shippable cart without a shipping
// method, and "shipping: Free" as a hardcoded label is a lie waiting to be
// noticed. The flow: address saved → list the cart's real options → pick one
// (auto-picked when there's exactly one) → totals update everywhere.

export type ShippingOptionLite = { id: string; name: string; amount: number }

export async function listShippingOptions(): Promise<Result<ShippingOptionLite[]>> {
  if (!isCommerceConfigured) return notConfigured() as Result<ShippingOptionLite[]>
  try {
    const cart = await getCart()
    if (!cart) return fail("Your cart was cleared.") as Result<ShippingOptionLite[]>
    const { shipping_options } = await medusa.store.fulfillment.listCartOptions({
      cart_id: cart.id,
    })
    const options = (shipping_options ?? []).map((o) => {
      const priced = o as { calculated_price?: { calculated_amount?: number | null }; amount?: number | null }
      return {
        id: o.id,
        name: o.name ?? "Standard delivery",
        amount: priced.calculated_price?.calculated_amount ?? priced.amount ?? 0,
      }
    })
    return ok(options)
  } catch (e: unknown) {
    return fail(e instanceof Error ? e.message : "Unknown error") as Result<ShippingOptionLite[]>
  }
}

export async function setShippingMethod(input: {
  optionId: string
}): Promise<Result<{ shippingTotal: number; total: number }>> {
  if (!isCommerceConfigured)
    return notConfigured() as Result<{ shippingTotal: number; total: number }>
  if (!input.optionId)
    return fail("Pick a delivery option.") as Result<{ shippingTotal: number; total: number }>
  try {
    const cart = await getCart()
    if (!cart) return fail("Your cart was cleared.") as Result<{ shippingTotal: number; total: number }>
    const { cart: updated } = await medusa.store.cart.addShippingMethod(cart.id, {
      option_id: input.optionId,
    })
    revalidatePath("/checkout")
    revalidatePath("/cart")
    return ok({
      shippingTotal: updated.shipping_total ?? 0,
      total: updated.total ?? 0,
    })
  } catch (e: unknown) {
    return fail(e instanceof Error ? e.message : "Unknown error") as Result<{
      shippingTotal: number
      total: number
    }>
  }
}

export async function placeCodOrder(): Promise<Result<{ orderId: string }>> {
  if (!isCommerceConfigured) return notConfigured() as Result<{ orderId: string }>
  if (!(await rateLimit("checkout"))) {
    return fail("Too many attempts. Please wait a moment and try again.") as Result<{
      orderId: string
    }>
  }
  try {
    const cart = await getCart()
    if (!cart) return fail("Your cart was cleared.") as Result<{ orderId: string }>
    // A shippable cart must carry a shipping method before completion —
    // otherwise Medusa can hard-fail here or create an unfulfillable order.
    if (!cart.shipping_methods?.length) {
      return fail("Pick a delivery option first.") as Result<{ orderId: string }>
    }

    await medusa.store.payment.initiatePaymentSession(cart, {
      provider_id: "pp_cod_cod",
    })

    const result = await medusa.store.cart.complete(cart.id)
    if (result.type === "order") {
      await rememberPlacedOrder(result.order.id)
      revalidatePath("/cart")
      revalidatePath("/", "layout")
      return { ok: true, data: { orderId: result.order.id } }
    }
    return fail(
      result.error?.message ?? "Order could not be placed."
    ) as Result<{ orderId: string }>
  } catch (e: unknown) {
    return fail(e instanceof Error ? e.message : "Unknown error") as Result<{
      orderId: string
    }>
  }
}

type RazorpayInit = {
  providerId: string
  rzpOrderId: string
  amount: number
  currency: string
  keyId: string
}

export async function initiateRazorpayPayment(): Promise<Result<RazorpayInit>> {
  if (!isCommerceConfigured) return notConfigured() as Result<RazorpayInit>
  if (!(await rateLimit("checkout"))) {
    return fail("Too many attempts. Please wait a moment and try again.") as Result<RazorpayInit>
  }
  try {
    const cart = await getCart()
    if (!cart) return fail("Your cart was cleared.") as Result<RazorpayInit>
    if (!cart.shipping_methods?.length) {
      return fail("Pick a delivery option first.") as Result<RazorpayInit>
    }

    const session = await medusa.store.payment.initiatePaymentSession(cart, {
      provider_id: "pp_razorpay_razorpay",
    })

    // Contract for medusa-plugin-razorpay-v2: the provider returns the Razorpay
    // order object at session.data.razorpayOrder. The PUBLIC key id is a client
    // env var (the secret never leaves the backend).
    const sessions = (session.payment_collection?.payment_sessions ?? []) as Array<{
      provider_id?: string
      data?: { razorpayOrder?: { id?: string } } & Record<string, unknown>
    }>
    const rzpSession = sessions.find((s) => s.provider_id === "pp_razorpay_razorpay")
    const rzpOrderId = rzpSession?.data?.razorpayOrder?.id ?? ""
    const keyId = env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? ""

    if (!rzpOrderId) {
      return fail(
        "Razorpay isn't wired yet — set the backend keys + restart it."
      ) as Result<RazorpayInit>
    }
    if (!keyId) {
      return fail(
        "Razorpay public key is missing — set NEXT_PUBLIC_RAZORPAY_KEY_ID."
      ) as Result<RazorpayInit>
    }

    return {
      ok: true,
      data: {
        providerId: "razorpay",
        rzpOrderId,
        // Razorpay expects the amount in the SMALLEST unit (paise). Medusa v2
        // cart.total is in major units (₹999 → 999), so convert. When order_id
        // is supplied, Razorpay treats the order's amount as authoritative —
        // VERIFY this matches on the first TEST transaction.
        amount: Math.round((cart.total ?? 0) * 100),
        currency: cart.currency_code ?? "inr",
        keyId,
      },
    }
  } catch (e: unknown) {
    return fail(e instanceof Error ? e.message : "Unknown error") as Result<RazorpayInit>
  }
}

export async function completeRazorpayOrder(input: {
  paymentId: string
  rzpOrderId: string
  signature: string
}): Promise<Result<{ orderId: string }>> {
  if (!isCommerceConfigured)
    return notConfigured() as Result<{ orderId: string }>
  if (!(await rateLimit("checkout"))) {
    return fail("Too many attempts. Please wait a moment and try again.") as Result<{
      orderId: string
    }>
  }
  try {
    const cart = await getCart()
    if (!cart) return fail("Your cart was cleared.") as Result<{ orderId: string }>

    // Defence in depth. The Razorpay webhook on the backend remains the
    // authority for capture, but this public action must not mint orders for
    // browsers that never paid:
    // 1. The Checkout handler's fields are required — no fields, no order.
    // 2. With RAZORPAY_KEY_SECRET set (server-only env), we verify the
    //    handler signature: HMAC-SHA256(order_id|payment_id, key_secret).
    const paymentId = cap(input.paymentId, 64)
    const rzpOrderId = cap(input.rzpOrderId, 64)
    const signature = cap(input.signature, 128)
    if (!paymentId || !rzpOrderId || !signature) {
      return fail("Payment confirmation is missing. If you were charged, write to hello@doodlebycanvas.in.") as Result<{ orderId: string }>
    }
    const secret = env.RAZORPAY_KEY_SECRET
    if (secret) {
      const expected = createHmac("sha256", secret)
        .update(`${rzpOrderId}|${paymentId}`)
        .digest("hex")
      const a = Buffer.from(expected, "utf8")
      const b = Buffer.from(signature, "utf8")
      if (a.length !== b.length || !timingSafeEqual(a, b)) {
        return fail("Payment could not be verified. If you were charged, write to hello@doodlebycanvas.in.") as Result<{ orderId: string }>
      }
    }

    const result = await medusa.store.cart.complete(cart.id)
    if (result.type === "order") {
      await rememberPlacedOrder(result.order.id)
      revalidatePath("/cart")
      revalidatePath("/", "layout")
      return { ok: true, data: { orderId: result.order.id } }
    }
    return fail(
      result.error?.message ?? "Order could not be placed."
    ) as Result<{ orderId: string }>
  } catch (e: unknown) {
    return fail(e instanceof Error ? e.message : "Unknown error") as Result<{
      orderId: string
    }>
  }
}
