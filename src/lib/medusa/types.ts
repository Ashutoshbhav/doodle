import type {
  StoreProduct,
  StoreProductVariant,
  StoreCart,
  StoreCartLineItem,
  StoreOrder,
  StoreCustomer,
  StoreRegion,
} from "@medusajs/types"

export type Product = StoreProduct
export type Variant = StoreProductVariant
export type Cart = StoreCart
export type CartLine = StoreCartLineItem
export type Order = StoreOrder
export type Customer = StoreCustomer
export type Region = StoreRegion

export function formatINR(amount: number | undefined | null): string {
  if (amount == null) return "—"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}
