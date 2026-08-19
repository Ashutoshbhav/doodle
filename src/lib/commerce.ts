import { env } from "@/env";

/* Single source of truth for "is the shop actually on?". Safe to import
   from client AND server components (reads only NEXT_PUBLIC vars, no SDK).
   Production runs without the Medusa env vars until the flip, so the
   marketing site must never render a buy/shop CTA it cannot honour.
   Covers both backends deliberately: once NEXT_PUBLIC_COMMERCE_BACKEND
   flips to "shopify" (the eventual cutover), Medusa's env vars may no
   longer be set on Vercel at all — without this OR, the whole site would
   silently regress to waitlist mode (hero CTA, nav cart/account icons,
   PacksShowcase, BuildYourTee) the moment that happened, despite Shopify
   commerce being genuinely live. */
export const isCommerceEnabled = Boolean(
  (env.NEXT_PUBLIC_MEDUSA_BASE_URL && env.NEXT_PUBLIC_MEDUSA_PUB_KEY) ||
    (env.NEXT_PUBLIC_COMMERCE_BACKEND === "shopify" &&
      env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN &&
      env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN),
);
