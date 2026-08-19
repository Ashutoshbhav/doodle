// Minimal hand-written types for the Storefront Cart API — only the fields
// this app actually queries. Shopify's Storefront API has no first-party SDK
// type package the way Medusa's js-sdk does, so these are ad-hoc rather than
// full schema re-exports.

export interface ShopifyMoney {
  amount: string
  currencyCode: string
}

export interface ShopifyCartLine {
  id: string
  quantity: number
  cost: { totalAmount: ShopifyMoney }
  merchandise: {
    id: string
    title: string
    sku: string | null
    selectedOptions: { name: string; value: string }[]
    product: { title: string; handle: string }
    image: { url: string; altText: string | null } | null
  }
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: ShopifyMoney
    totalAmount: ShopifyMoney
    totalTaxAmount: ShopifyMoney | null
  }
  lines: { nodes: ShopifyCartLine[] }
  note: string | null
}

export function formatINR(amount: string | number): string {
  const n = typeof amount === "string" ? parseFloat(amount) : amount
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n)
}
