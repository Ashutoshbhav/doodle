"use client"

import * as React from "react"
import Link from "next/link"
import { useConsentChoiceMade, writeConsent } from "@/lib/consent"

/**
 * DPDP-aligned consent banner. Shows once until the visitor chooses. No
 * pre-selected option, Accept and Reject given equal prominence, links to the
 * Privacy Policy. Until "Accept", analytics/marketing trackers stay off.
 *
 * A11y: receives initial focus so keyboard/screen-reader users meet it, and
 * Escape moves focus on WITHOUT recording a choice (the banner persists —
 * dismissal is not consent, and it must not be treated as rejection either).
 */
export function ConsentBanner() {
  const choiceMade = useConsentChoiceMade()
  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (choiceMade) return
    ref.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ref.current?.contains(document.activeElement)) {
        ;(document.activeElement as HTMLElement | null)?.blur()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [choiceMade])

  if (choiceMade) return null

  function choose(value: "granted" | "denied") {
    writeConsent(value)
  }

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-label="Cookie & analytics consent"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-2xl rounded-2xl border-2 border-dashed border-doodle-ink/25 bg-doodle-canvas p-5 shadow-[0_8px_40px_-12px_rgba(42,42,46,0.35)] outline-none sm:p-6"
    >
      <p className="text-sm leading-relaxed text-doodle-ink/80">
        We use essential cookies to run the site. With your okay, we&apos;d also use
        analytics to see what&apos;s working — never anything creepy. You can change
        your mind anytime. See our{" "}
        <Link href="/privacy" className="font-medium text-doodle-ink underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => choose("denied")}
          className="
            inline-flex h-10 items-center justify-center rounded-full px-5
            border-2 border-dashed border-doodle-ink/30 text-sm font-medium text-doodle-ink/75
            transition-colors hover:border-doodle-ink/55 hover:text-doodle-ink
            active:scale-[0.98]
          "
        >
          Reject non-essential
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className="
            inline-flex h-10 items-center justify-center rounded-full px-6
            bg-doodle-orange text-doodle-ink text-sm font-medium
            border-2 border-dashed border-doodle-stitch
            transition-transform hover:scale-[1.02] active:scale-[0.98]
          "
        >
          Accept
        </button>
      </div>
    </div>
  )
}
