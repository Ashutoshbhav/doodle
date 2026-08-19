import "server-only"

import { cookies } from "next/headers"
import { shopifyRequest, isShopifyConfigured } from "./client"
import type { ShopifyCart } from "./types"

// Separate cookie from Medusa's doodle_cart_id so both backends can be
// wired up at once during the migration without colliding.
const CART_COOKIE = "doodle_shopify_cart_id"
const CART_TTL_DAYS = 30

const CART_FRAGMENT = `
  id
  checkoutUrl
  totalQuantity
  note
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
    totalTaxAmount { amount currencyCode }
  }
  lines(first: 50) {
    nodes {
      id
      quantity
      cost { totalAmount { amount currencyCode } }
      merchandise {
        ... on ProductVariant {
          id
          title
          sku
          selectedOptions { name value }
          product { title handle }
          image { url altText }
        }
      }
    }
  }
`

export async function getCart(): Promise<ShopifyCart | null> {
  if (!isShopifyConfigured) return null
  const jar = await cookies()
  const id = jar.get(CART_COOKIE)?.value
  if (!id) return null

  const { data } = await shopifyRequest(`query GetCart($id: ID!) { cart(id: $id) { ${CART_FRAGMENT} } }`, {
    variables: { id },
  })
  if (!data?.cart) {
    jar.delete(CART_COOKIE)
    return null
  }
  return data.cart as ShopifyCart
}

export async function getOrCreateCart(): Promise<ShopifyCart> {
  const existing = await getCart()
  if (existing) return existing

  const { data, errors } = await shopifyRequest(
    `mutation CreateCart($input: CartInput!) { cartCreate(input: $input) { cart { ${CART_FRAGMENT} } userErrors { field message } } }`,
    { variables: { input: { buyerIdentity: { countryCode: "IN" } } } }
  )
  if (errors || data?.cartCreate?.userErrors?.length) {
    throw new Error(
      `Shopify cartCreate failed: ${JSON.stringify(errors ?? data.cartCreate.userErrors)}`
    )
  }
  const cart = data.cartCreate.cart as ShopifyCart

  const jar = await cookies()
  jar.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * CART_TTL_DAYS,
    path: "/",
  })
  return cart
}

export async function addLine(variantId: string, quantity: number): Promise<ShopifyCart> {
  const cart = await getOrCreateCart()
  const { data, errors } = await shopifyRequest(
    `mutation AddLine($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FRAGMENT} } userErrors { field message } } }`,
    { variables: { cartId: cart.id, lines: [{ merchandiseId: variantId, quantity }] } }
  )
  if (errors || data?.cartLinesAdd?.userErrors?.length) {
    throw new Error(`Shopify cartLinesAdd failed: ${JSON.stringify(errors ?? data.cartLinesAdd.userErrors)}`)
  }
  return data.cartLinesAdd.cart as ShopifyCart
}

export async function updateLine(lineId: string, quantity: number): Promise<ShopifyCart> {
  const cart = await getOrCreateCart()
  const { data, errors } = await shopifyRequest(
    `mutation UpdateLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FRAGMENT} } userErrors { field message } } }`,
    { variables: { cartId: cart.id, lines: [{ id: lineId, quantity }] } }
  )
  if (errors || data?.cartLinesUpdate?.userErrors?.length) {
    throw new Error(`Shopify cartLinesUpdate failed: ${JSON.stringify(errors ?? data.cartLinesUpdate.userErrors)}`)
  }
  return data.cartLinesUpdate.cart as ShopifyCart
}

export async function removeLine(lineId: string): Promise<ShopifyCart> {
  const cart = await getOrCreateCart()
  const { data, errors } = await shopifyRequest(
    `mutation RemoveLine($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FRAGMENT} } userErrors { field message } } }`,
    { variables: { cartId: cart.id, lineIds: [lineId] } }
  )
  if (errors || data?.cartLinesRemove?.userErrors?.length) {
    throw new Error(`Shopify cartLinesRemove failed: ${JSON.stringify(errors ?? data.cartLinesRemove.userErrors)}`)
  }
  return data.cartLinesRemove.cart as ShopifyCart
}

export async function setNote(note: string): Promise<ShopifyCart> {
  const cart = await getOrCreateCart()
  const { data, errors } = await shopifyRequest(
    `mutation SetNote($cartId: ID!, $note: String) { cartNoteUpdate(cartId: $cartId, note: $note) { cart { ${CART_FRAGMENT} } userErrors { field message } } }`,
    { variables: { cartId: cart.id, note } }
  )
  if (errors || data?.cartNoteUpdate?.userErrors?.length) {
    throw new Error(`Shopify cartNoteUpdate failed: ${JSON.stringify(errors ?? data.cartNoteUpdate.userErrors)}`)
  }
  return data.cartNoteUpdate.cart as ShopifyCart
}

export async function getCartLineCount(): Promise<number> {
  const cart = await getCart()
  return cart?.totalQuantity ?? 0
}

// Headless Shopify checkout is a redirect, not a custom flow: Shopify's own
// hosted checkout page collects address, shipping method, and payment
// (Razorpay/COD, once configured in the store) — none of that needs to be
// rebuilt here the way it did for Medusa's custom session-based checkout.
export async function getCheckoutUrl(): Promise<string> {
  const cart = await getOrCreateCart()
  return cart.checkoutUrl
}
