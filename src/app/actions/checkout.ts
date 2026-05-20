"use server"

import { revalidatePath } from "next/cache"
import { getCart, getOrCreateCart, getIndiaRegionId } from "@/lib/medusa/cart"
import { medusa, isCommerceConfigured } from "@/lib/medusa/client"

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

    // Plugin convention (devx-commerce/razorpay): provider stuffs rzp_order_id + key_id into session.data
    const sessions = (session.payment_collection?.payment_sessions ?? []) as Array<{
      provider_id?: string
      data?: Record<string, unknown>
    }>
    const rzpSession = sessions.find((s) => s.provider_id === "razorpay")
    const data = (rzpSession?.data ?? {}) as Record<string, unknown>

    const rzpOrderId =
      (data.rzp_order_id as string | undefined) ??
      (data.id as string | undefined) ??
      ""
    const keyId = (data.key_id as string | undefined) ?? ""

    if (!rzpOrderId || !keyId) {
      return fail(
        "Razorpay isn't wired yet — paste TEST keys into the backend + restart it."
      ) as Result<RazorpayInit>
    }

    return {
      ok: true,
      data: {
        providerId: "razorpay",
        rzpOrderId,
        amount: cart.total ?? 0,
        currency: cart.currency_code ?? "inr",
        keyId,
      },
    }
  } catch (e: unknown) {
    return fail(e instanceof Error ? e.message : "Unknown error") as Result<RazorpayInit>
  }
}

export async function completeRazorpayOrder(input: {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}): Promise<Result<{ orderId: string }>> {
  if (!isCommerceConfigured)
    return notConfigured() as Result<{ orderId: string }>
  try {
    const cart = await getCart()
    if (!cart) return fail("Your cart was cleared.") as Result<{ orderId: string }>

    // The Razorpay plugin exposes a custom storefront endpoint to verify the
    // HMAC-SHA256 signature server-side before capturing payment. The SDK's
    // generic client.fetch is used because there's no first-class SDK helper.
    // Wires up properly once packages/medusa-plugin-razorpay is forked + registered.
    await medusa.client.fetch("/store/razorpay/verify", {
      method: "POST",
      body: { cart_id: cart.id, ...input },
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
