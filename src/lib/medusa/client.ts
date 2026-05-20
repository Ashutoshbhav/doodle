import Medusa from "@medusajs/js-sdk"
import { env } from "@/env"

const baseUrl = env.NEXT_PUBLIC_MEDUSA_BASE_URL ?? "http://localhost:9000"
const publishableKey = env.NEXT_PUBLIC_MEDUSA_PUB_KEY ?? ""

export const medusa = new Medusa({
  baseUrl,
  publishableKey,
  debug: process.env.NODE_ENV !== "production",
})

export const isCommerceConfigured = Boolean(
  env.NEXT_PUBLIC_MEDUSA_BASE_URL && env.NEXT_PUBLIC_MEDUSA_PUB_KEY
)
