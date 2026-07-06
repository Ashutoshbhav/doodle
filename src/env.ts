import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Values piped into `vercel env add` on Windows can arrive with a trailing
// \r that no dashboard view reveals — it fails strict regexes at build time
// and would silently corrupt an HMAC secret. Trim before validating.
const trimmed = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (typeof v === "string" ? v.trim() : v), schema);

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    RESEND_API_KEY: z.string().startsWith("re_").optional(),
    RESEND_AUDIENCE_ID: z.string().uuid().optional(),
    EMAIL_FROM: z.string().email().optional(),
    SENTRY_DSN: z.string().url().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
    // Upstash Redis — powers rate limiting. Optional: limiting no-ops until set.
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
    // Razorpay key SECRET (server-only, same key pair as NEXT_PUBLIC_RAZORPAY_KEY_ID).
    // Enables checkout-handler signature verification before cart completion.
    RAZORPAY_KEY_SECRET: trimmed(z.string().min(1).optional()),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url().default("https://us.i.posthog.com"),
    // Live Campaign Lab — ad-platform tags for the /drop LP. Optional so the
    // app builds/deploys before the ad accounts hand over their IDs.
    NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),
    NEXT_PUBLIC_GOOGLE_ADS_ID: z.string().optional(),
    NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL: z.string().optional(),
    // Medusa commerce backend (optional during pre-launch; required once /shop ships)
    NEXT_PUBLIC_MEDUSA_BASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_MEDUSA_PUB_KEY: z.string().min(1).optional(),
    // Razorpay PUBLIC key id (safe to expose; secret + webhook secret stay on the
    // backend). Used to open Razorpay Checkout. Optional until payments go live.
    NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1).optional(),
    // WhatsApp click-to-chat number in international format WITHOUT "+",
    // e.g. "919876543210". Links render only when this is set.
    NEXT_PUBLIC_WHATSAPP_NUMBER: trimmed(z.string().regex(/^\d{10,15}$/).optional()),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    NEXT_PUBLIC_GOOGLE_ADS_ID: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
    NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL:
      process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL,
    NEXT_PUBLIC_MEDUSA_BASE_URL: process.env.NEXT_PUBLIC_MEDUSA_BASE_URL,
    NEXT_PUBLIC_MEDUSA_PUB_KEY: process.env.NEXT_PUBLIC_MEDUSA_PUB_KEY,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  },
  emptyStringAsUndefined: true,
});
