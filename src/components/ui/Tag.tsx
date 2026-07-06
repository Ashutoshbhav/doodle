import type { ReactNode } from "react"

/**
 * Tag — small soft pill/badge for inline status ("Only N left", "Sold out",
 * "Max in stock"). Replaces ad-hoc `font-mono uppercase tracking` status text
 * scattered across the funnel.
 *
 * Premium-for-kids pass:
 *   - voice = CLEAN SANS, sentence-ish small caps, NOT mono.
 *   - one-accent discipline: `tone="accent"` is the ONE orange-leaning badge
 *     (low-stock urgency); everything else is quiet ink/neutral.
 *   - soft tinted surface, no border by default (the calm look). `outline`
 *     opt-in adds a hairline for surfaces that need it.
 *   - rounded-full pill, no shadow — it sits inline, not a card.
 */

type Tone = "neutral" | "accent" | "muted" | "danger"

const TONE: Record<Tone, string> = {
  // quiet default — reads as metadata
  neutral: "bg-doodle-ink/[0.06] text-doodle-ink/70",
  // the ONE accent — low-stock urgency
  accent: "bg-doodle-orange/12 text-doodle-berry",
  // softest — "max in stock" style ambient note
  muted: "bg-doodle-ink/[0.04] text-doodle-ink/50",
  // sold-out / error
  danger: "bg-doodle-red/10 text-doodle-red",
}

export function Tag({
  children,
  tone = "neutral",
  outline = false,
  className = "",
}: {
  children: ReactNode
  tone?: Tone
  outline?: boolean
  className?: string
}) {
  const ring =
    outline
      ? tone === "accent"
        ? "ring-1 ring-doodle-berry/25"
        : tone === "danger"
          ? "ring-1 ring-doodle-red/25"
          : "ring-1 ring-doodle-ink/12"
      : ""
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-xs font-medium leading-none ${TONE[tone]} ${ring} ${className}`}
    >
      {children}
    </span>
  )
}
