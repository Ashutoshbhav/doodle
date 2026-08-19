import {
  createStorefrontApiClient,
  type StorefrontApiClient,
} from "@shopify/storefront-api-client"
import { env } from "@/env"

const storeDomain = env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? ""
const storefrontToken = env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? ""

export const isShopifyConfigured = Boolean(storeDomain && storefrontToken)

// createStorefrontApiClient() throws immediately on an empty storeDomain -
// this MUST stay lazy. Vercel prod has no Shopify env vars configured (only
// local .env.local does), so an eager module-scope call here broke the
// entire production build the moment any file imported this module, even
// on the Medusa-default path that never touches Shopify at runtime.
let client: StorefrontApiClient | null = null

// Loosely typed on purpose, matching the `as unknown as X` pattern already
// used throughout this codebase for API responses — callers destructure
// {data, errors} and cast the shape they expect.
export async function shopifyRequest(
  query: string,
  options?: { variables?: Record<string, unknown> },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  if (!client) {
    client = createStorefrontApiClient({
      storeDomain,
      publicAccessToken: storefrontToken,
      apiVersion: "2026-07",
    })
  }
  return client.request(query, options)
}
