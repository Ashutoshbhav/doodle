import "server-only"

import { medusa, isCommerceConfigured } from "./client"
import { getIndiaRegionId } from "./cart"
import type { Product } from "./types"
import type { CartSuggestion } from "@/components/shop/CartDrawer"

/* Cross-sell candidates, patches first — attach rate IS the business model.
   Single-variant products carry a variantId for one-tap add; multi-variant
   ones link to their PDP instead (never guess a size for the shopper). */
export async function fetchSuggestions(
  excludeHandles: string[],
): Promise<CartSuggestion[]> {
  if (!isCommerceConfigured) return []
  try {
    const regionId = await getIndiaRegionId()
    const { products } = await medusa.store.product.list({
      limit: 20,
      fields: "handle,title,thumbnail,*variants.calculated_price",
      region_id: regionId,
    })
    const excluded = new Set(excludeHandles)
    const rank = (h: string) => (h === "patch" ? 0 : h === "modular-tee" || h === "starter-kit" ? 2 : 1)
    return (products as unknown as Product[])
      .filter((p) => p.handle && !excluded.has(p.handle))
      .sort((a, b) => rank(a.handle ?? "") - rank(b.handle ?? ""))
      .map((p) => {
        const variants = p.variants ?? []
        const only = variants.length === 1 ? variants[0] : null
        return {
          handle: p.handle ?? "",
          title: p.title ?? "",
          thumbnail: p.thumbnail ?? null,
          price:
            only?.calculated_price?.calculated_amount ??
            variants[0]?.calculated_price?.calculated_amount ??
            null,
          variantId: only?.id ?? null,
        }
      })
  } catch {
    return []
  }
}
