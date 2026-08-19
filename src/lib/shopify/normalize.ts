import "server-only"

// Converts Shopify Storefront API product shapes into the same shape the
// existing UI already renders (Medusa's StoreProduct, loosely typed via the
// `as unknown as Product` pattern already used throughout src/app/shop/*).
// This is what lets VariantPicker/ProductCard/ProductGallery — real design
// investment, not throwaway — work against Shopify with zero UI changes.
//
// Not a general-purpose mapper: only the fields those components actually
// read (see their source) are populated.

interface ShopifyVariantNode {
  id: string
  title: string
  sku: string | null
  availableForSale: boolean
  quantityAvailable: number | null
  price: { amount: string; currencyCode: string }
  selectedOptions: { name: string; value: string }[]
  image: { url: string; altText: string | null } | null
}

interface ShopifyProductNode {
  id: string
  title: string
  handle: string
  description: string | null
  descriptionHtml?: string | null
  images: { nodes: { url: string; altText: string | null }[] }
  options: { id: string; name: string; values: string[] }[]
  variants: { nodes: ShopifyVariantNode[] }
}

interface ShopifyCartLikeLine {
  id: string
  quantity: number
  cost: { totalAmount: { amount: string } }
  merchandise: {
    id: string
    title: string
    sku: string | null
    product: { title: string; handle: string }
    image: { url: string } | null
  }
}

interface ShopifyCartLike {
  id: string
  totalQuantity: number
  cost: {
    subtotalAmount: { amount: string }
    totalAmount: { amount: string }
    totalTaxAmount: { amount: string } | null
  }
  lines: { nodes: ShopifyCartLikeLine[] }
}

// Normalizes a Shopify Cart into the same shape src/components/shop/CartLine
// and src/app/cart/page.tsx already render (Medusa's StoreCart/CartLineItem).
// Shopify has no shipping-total-until-a-method-is-chosen concept the way
// Medusa does (shipping is resolved on Shopify's own hosted checkout page,
// not this cart) — shipping_methods stays empty on purpose so the cart page
// always shows "Calculated at checkout", which is accurate here.
export function normalizeCart(c: ShopifyCartLike) {
  return {
    id: c.id,
    subtotal: parseFloat(c.cost.subtotalAmount.amount),
    item_subtotal: parseFloat(c.cost.subtotalAmount.amount),
    shipping_total: 0,
    tax_total: c.cost.totalTaxAmount ? parseFloat(c.cost.totalTaxAmount.amount) : 0,
    total: parseFloat(c.cost.totalAmount.amount),
    shipping_methods: [],
    items: c.lines.nodes.map((line) => ({
      id: line.id,
      quantity: line.quantity,
      title: line.merchandise.product.title,
      thumbnail: line.merchandise.image?.url ?? null,
      unit_price: line.quantity > 0 ? parseFloat(line.cost.totalAmount.amount) / line.quantity : 0,
      product_handle: line.merchandise.product.handle,
      variant_id: line.merchandise.id,
      variant: {
        id: line.merchandise.id,
        title: line.merchandise.title,
        sku: line.merchandise.sku,
        // Shopify's checkout is the real overselling backstop (see
        // src/lib/shopify/cart.ts's getCheckoutUrl comment) — the cart-page
        // stepper doesn't need its own stock cap the way Medusa's does.
        manage_inventory: false,
        allow_backorder: false,
        inventory_quantity: null,
        product: {
          handle: line.merchandise.product.handle,
          thumbnail: line.merchandise.image?.url ?? null,
        },
      },
    })),
  }
}

export function normalizeProduct(p: ShopifyProductNode) {
  // option "id" in the Medusa shape is what variants key against via
  // `variant.options[].option_id`. Shopify options don't expose a per-value
  // id the same way, so we synthesize one from the option name — stable and
  // unique within a product, which is all VariantPicker needs.
  const optionIdByName = new Map(p.options.map((o) => [o.name, o.id]))

  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    subtitle: null,
    description: p.description ?? null,
    thumbnail: p.images.nodes[0]?.url ?? null,
    origin_country: "India",
    metadata: {},
    images: p.images.nodes.map((img, i) => ({
      id: `img-${i}`,
      url: img.url,
    })),
    options: p.options.map((o) => ({
      id: o.id,
      title: o.name,
      values: o.values.map((v) => ({ id: `${o.id}-${v}`, value: v })),
    })),
    variants: p.variants.nodes.map((v) => ({
      id: v.id,
      title: v.title,
      sku: v.sku,
      calculated_price: { calculated_amount: parseFloat(v.price.amount) },
      // Shopify's availableForSale/quantityAvailable collapses onto Medusa's
      // manage_inventory/allow_backorder/inventory_quantity model: treat the
      // product as always "managed" (so VariantPicker's stock logic engages)
      // and never backordered — availableForSale already accounts for both
      // Shopify-side "continue selling when out of stock" and real stock.
      manage_inventory: true,
      allow_backorder: false,
      inventory_quantity: v.availableForSale
        ? (v.quantityAvailable ?? 1)
        : 0,
      options: v.selectedOptions.map((so) => ({
        option_id: optionIdByName.get(so.name) ?? so.name,
        value: so.value,
      })),
    })),
  }
}
