import "server-only"

import { shopifyRequest, isShopifyConfigured } from "./client"
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
    const { data } = await shopifyRequest(
      `query ListProducts($first: Int!) { products(first: $first) { nodes { ${PRODUCT_FRAGMENT} } } }`,
      { variables: { first: limit } }
    )
    return (data?.products?.nodes ?? []).map(normalizeProduct)
  } catch {
    return []
  }
}

// Cross-sell candidates, patches first — mirrors medusa/suggestions.ts's
// ranking exactly (attach rate is the business model either way).
export async function listSuggestions(excludeHandles: string[]) {
  if (!isShopifyConfigured) return []
  try {
    const { data } = await shopifyRequest(
      `query { products(first: 20) { nodes { handle title featuredImage { url } variants(first: 5) { nodes { id title price { amount } } } } } }`
    )
    const excluded = new Set(excludeHandles)
    const rank = (h: string) => (h === "patch" ? 0 : h === "modular-tee" ? 2 : 1)
    return (data?.products?.nodes ?? [])
      .filter((p: { handle: string }) => !excluded.has(p.handle))
      .sort((a: { handle: string }, b: { handle: string }) => rank(a.handle) - rank(b.handle))
      .map((p: { handle: string; title: string; featuredImage: { url: string } | null; variants: { nodes: { id: string; price: { amount: string } }[] } }) => {
        const variants = p.variants.nodes
        const only = variants.length === 1 ? variants[0] : null
        return {
          handle: p.handle,
          title: p.title,
          thumbnail: p.featuredImage?.url ?? null,
          price: only ? parseFloat(only.price.amount) : (variants[0] ? parseFloat(variants[0].price.amount) : null),
          variantId: only?.id ?? null,
        }
      })
  } catch {
    return []
  }
}

export async function getProductByHandle(handle: string) {
  if (!isShopifyConfigured) return null
  try {
    const { data } = await shopifyRequest(
      `query GetProduct($handle: String!) { product(handle: $handle) { ${PRODUCT_FRAGMENT} } }`,
      { variables: { handle } }
    )
    if (!data?.product) return null
    return normalizeProduct(data.product)
  } catch {
    return null
  }
}
