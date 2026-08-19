import { createStorefrontApiClient } from "@shopify/storefront-api-client"
import { env } from "@/env"

const storeDomain = env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? ""
const storefrontToken = env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? ""

export const shopify = createStorefrontApiClient({
  storeDomain,
  publicAccessToken: storefrontToken,
  apiVersion: "2026-07",
})

export const isShopifyConfigured = Boolean(storeDomain && storefrontToken)
