import { env } from "@/env";

/* Single source of truth for "is the shop actually on?". Safe to import
   from client AND server components (reads only NEXT_PUBLIC vars, no SDK).
   Production runs without the Medusa env vars until the flip, so the
   marketing site must never render a buy/shop CTA it cannot honour. */
export const isCommerceEnabled = Boolean(
  env.NEXT_PUBLIC_MEDUSA_BASE_URL && env.NEXT_PUBLIC_MEDUSA_PUB_KEY,
);
