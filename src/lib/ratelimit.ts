import "server-only"

import { headers } from "next/headers"

/**
 * Distributed rate limiting via Upstash Redis (free tier), env-gated.
 *
 * If UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set, every check
 * ALLOWS (no-op) and logs once — so local/preview keeps working and production
 * gains real protection the moment the creds are added. The honeypot on public
 * forms is the always-on, dependency-free first line of defence.
 */

type Limiter = { limit: (id: string) => Promise<{ success: boolean }> }

export type Bucket = "waitlist" | "auth" | "checkout"

let limiters: Record<Bucket, Limiter> | null = null
let initialized = false
let warned = false

async function getLimiters(): Promise<Record<Bucket, Limiter> | null> {
  if (initialized) return limiters
  initialized = true

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    if (!warned) {
      warned = true
      console.warn(
        "[ratelimit] Upstash creds unset — rate limiting disabled (allow-all). " +
          "Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to enable."
      )
    }
    limiters = null
    return null
  }

  const { Ratelimit } = await import("@upstash/ratelimit")
  const { Redis } = await import("@upstash/redis")
  const redis = new Redis({ url, token })

  limiters = {
    // tune per bucket: signups are rarer than checkout retries
    waitlist: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      prefix: "rl:waitlist",
      analytics: false,
    }),
    auth: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(8, "10 m"),
      prefix: "rl:auth",
      analytics: false,
    }),
    checkout: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(12, "10 m"),
      prefix: "rl:checkout",
      analytics: false,
    }),
  }
  return limiters
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export async function getClientIp(): Promise<string> {
  const h = await headers()
  const xff = h.get("x-forwarded-for")
  return xff?.split(",")[0]?.trim() || h.get("x-real-ip") || "anon"
}

/**
 * Returns true if the request is allowed, false if rate-limited.
 * Allows (returns true) when Upstash isn't configured. Never throws — a limiter
 * error fails open so a Redis blip can't take checkout/auth down.
 */
export async function rateLimit(bucket: Bucket, identifier?: string): Promise<boolean> {
  try {
    const ls = await getLimiters()
    if (!ls) return true
    const id = identifier ?? (await getClientIp())
    const { success } = await ls[bucket].limit(id)
    return success
  } catch (e) {
    console.error("[ratelimit] check failed (failing open):", e)
    return true
  }
}
