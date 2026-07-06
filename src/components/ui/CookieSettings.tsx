"use client"

import { clearConsent } from "@/lib/consent"

/**
 * Footer "Cookie settings" control. Re-opens the consent banner so a visitor
 * can change or withdraw consent at any time (DPDP right to withdraw, as easy
 * as it was to give). Clearing consent fires CONSENT_EVENT, which tears down
 * PostHog and re-shows the banner.
 */
export function CookieSettings() {
  return (
    <button
      type="button"
      onClick={() => clearConsent()}
      className="hover:text-doodle-berry transition-colors"
    >
      Cookie settings
    </button>
  )
}
