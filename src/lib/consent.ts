"use client"

import { useSyncExternalStore } from "react"

/**
 * Lightweight consent state for DPDP-aligned analytics gating.
 * Non-essential trackers (PostHog, Meta Pixel, Google Ads) must NOT load until
 * the visitor explicitly opts in via the ConsentBanner. Choice persists in a
 * first-party cookie; a window event lets already-mounted components react
 * without a reload.
 */

export const CONSENT_COOKIE = "doodle_consent"
export const CONSENT_EVENT = "doodle-consent-change"
export type ConsentValue = "granted" | "denied"

export function readConsent(): ConsentValue | null {
  if (typeof document === "undefined") return null
  const m = document.cookie.match(/(?:^|;\s*)doodle_consent=(granted|denied)/)
  return (m?.[1] as ConsentValue | undefined) ?? null
}

export function writeConsent(value: ConsentValue): void {
  if (typeof document === "undefined") return
  const maxAge = 60 * 60 * 24 * 180 // 180 days
  const secure = window.location.protocol === "https:" ? "; secure" : ""
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${maxAge}; samesite=lax${secure}`
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }))
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  window.addEventListener(CONSENT_EVENT, callback)
  return () => window.removeEventListener(CONSENT_EVENT, callback)
}

/** True only after the visitor has explicitly granted consent. */
export function useConsentGranted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => readConsent() === "granted",
    () => false
  )
}

/** True once the visitor has made any choice (so the banner can hide). */
export function useConsentChoiceMade(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => readConsent() !== null,
    () => false
  )
}
