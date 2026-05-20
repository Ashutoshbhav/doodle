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
