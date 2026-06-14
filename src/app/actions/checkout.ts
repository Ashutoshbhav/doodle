"use server"

import { revalidatePath } from "next/cache"
import { getCart, getOrCreateCart, getIndiaRegionId } from "@/lib/medusa/cart"
import { medusa, isCommerceConfigured } from "@/lib/medusa/client"
import { env } from "@/env"
import { rateLimit } from "@/lib/ratelimit"

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

export async function addToCart(input: {
  variantId: string
  quantity: number
}): Promise<Result> {
  if (!isCommerceConfigured) return notConfigured()
  if (!input.variantId || !validQty(input.quantity)) return fail("Invalid item or quantity.")
  try {
    const regionId = await getIndiaRegionId()
    const cart = await getOrCreateCart(regionId)
    await medusa.store.cart.createLineItem(cart.id, {
      variant_id: input.variantId,
      quantity: input.quantity,
    })
    revalidatePath("/cart")
    revalidatePath("/", "layout")
    return ok(undefined)
  } catch (e: unknown) {
    return fail(e instanceof Error ? e.message : "Unknown error")
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
    await medusa.store.cart.updateLineItem(cart.id, input.lineId, {
      quantity: input.quantity,
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

    await medusa.store.payment.initiatePaymentSession(cart, {
      provider_id: "cod",
    })

    const result = await medusa.store.cart.complete(cart.id)
    if (result.type === "order") {
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

    const session = await medusa.store.payment.initiatePaymentSession(cart, {
      provider_id: "razorpay",
    })

    // Contract for medusa-plugin-razorpay-v2: the provider returns the Razorpay
    // order object at session.data.razorpayOrder. The PUBLIC key id is a client
    // env var (the secret never leaves the backend).
    const sessions = (session.payment_collection?.payment_sessions ?? []) as Array<{
      provider_id?: string
      data?: { razorpayOrder?: { id?: string } } & Record<string, unknown>
    }>
    const rzpSession = sessions.find((s) => s.provider_id === "razorpay")
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

export async function completeRazorpayOrder(): Promise<Result<{ orderId: string }>> {
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

    // medusa-plugin-razorpay-v2 verifies payment authenticity server-side via
    // the Razorpay WEBHOOK (HMAC over the raw body, validated with the webhook
    // secret) at {backend}/razorpay/hooks — NOT a storefront endpoint. So the
    // client signature fields aren't trusted here; we simply complete the cart,
    // and the webhook confirms/captures the payment. This matches the plugin's
    // reference storefront button (handler → placeOrder()).
    const result = await medusa.store.cart.complete(cart.id)
    if (result.type === "order") {
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
