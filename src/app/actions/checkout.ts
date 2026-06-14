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

export async function addToCart(input: {
  variantId: string
  quantity: number
}): Promise<Result> {
  if (!isCommerceConfigured) return notConfigured()
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
  try {
    const cart = await getCart()
    if (!cart) return fail("Your cart was cleared. Add items again.")
    await medusa.store.cart.update(cart.id, {
      email: input.email,
      shipping_address: {
        first_name: input.first_name,
        last_name: input.last_name,
        phone: input.phone,
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
  try {
    const cart = await getCart()
    if (!cart) return fail("Your cart was cleared.")
    await medusa.store.cart.update(cart.id, {
      shipping_address: {
        first_name: input.first_name,
        last_name: input.last_name,
        phone: input.phone,
        address_1: input.address_1,
        address_2: input.address_2,
        city: input.city,
        province: input.province,
        postal_code: input.postal_code,
        country_code: "in",
      },
      billing_address: {
        first_name: input.first_name,
        last_name: input.last_name,
        phone: input.phone,
        address_1: input.address_1,
        address_2: input.address_2,
        city: input.city,
        province: input.province,
        postal_code: input.postal_code,
        country_code: "in",
      },
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
