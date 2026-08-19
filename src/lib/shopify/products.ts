import "server-only"

import { shopify, isShopifyConfigured } from "./client"
import { normalizeProduct } from "./normalize"

const PRODUCT_FRAGMENT = `
  id
  title
  handle
  description
  images(first: 10) { nodes { url altText } }
  options { id name values }
  variants(first: 30) {
    nodes {
      id
      title
      sku
      availableForSale
      quantityAvailable
      price { amount currencyCode }
      selectedOptions { name value }
      image { url altText }
    }
  }
`

export async function listProducts(limit = 50) {
  if (!isShopifyConfigured) return []
  try {
    const { data } = await shopify.request(
      `query ListProducts($first: Int!) { products(first: $first) { nodes { ${PRODUCT_FRAGMENT} } } }`,
      { variables: { first: limit } }
    )
    return (data?.products?.nodes ?? []).map(normalizeProduct)
  } catch {
    return []
  }
}

export async function getProductByHandle(handle: string) {
  if (!isShopifyConfigured) return null
  try {
    const { data } = await shopify.request(
      `query GetProduct($handle: String!) { product(handle: $handle) { ${PRODUCT_FRAGMENT} } }`,
      { variables: { handle } }
    )
    if (!data?.product) return null
    return normalizeProduct(data.product)
  } catch {
    return null
  }
}
