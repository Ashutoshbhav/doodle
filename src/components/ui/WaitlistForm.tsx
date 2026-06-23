"use client";

import * as React from "react";
import { useActionState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { joinWaitlist, type WaitlistResult } from "@/app/actions/waitlist";
import { PillButton } from "@/components/ui/PillButton";
import { env } from "@/env";

type Props = {
  /** Optional accent — defaults to orange (primary). */
  accent?: "orange" | "blue" | "purple";
  /** Where the form sits — affects label colour for contrast. */
  surface?: "canvas" | "tile";
  className?: string;
  /** Campaign attribution token written to waitlist.source (e.g. "lcl_may26:meta:m1"). */
  source?: string;
  /** Fire Meta Pixel + Google Ads conversion events on a successful signup. */
  conversionTrack?: boolean;
};

export function WaitlistForm({
  // `accent` is retained for backward-compatible API; the submit now uses the
  // shared PillButton (primary = the one orange), so the accent no longer
  // recolours the button. Kept so existing callers don't break.
  accent: _accent = "orange",
  surface = "canvas",
  className = "",
  source,
  conversionTrack = false,
}: Props) {
  void _accent;
  const [state, formAction, isPending] = useActionState<WaitlistResult | null, FormData>(
    joinWaitlist,
    null,
  );

  // Fire ad-platform conversion events exactly once, and only for a
  // genuinely NEW persisted signup (state.isNew). Duplicates, DB failures,
  // and refreshes do not fire — so the Pixel/Google count matches the real
  // captured-lead count in Neon. Used by the /drop campaign LP; no-ops
  // elsewhere (conversionTrack=false) and when platform IDs are unset.
  const conversionFired = useRef(false);
  useEffect(() => {
    if (conversionFired.current) return;
    if (!conversionTrack) return;
    if (!state || !state.ok || !state.isNew) return;
    conversionFired.current = true;
    type Tracker = (...args: unknown[]) => void;
    const w = window as unknown as { fbq?: Tracker; gtag?: Tracker };
    w.fbq?.("track", "Lead");
    const gadsId = env.NEXT_PUBLIC_GOOGLE_ADS_ID;
    const gadsLabel = env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
    if (gadsId && gadsLabel) {
      w.gtag?.("event", "conversion", { send_to: `${gadsId}/${gadsLabel}` });
    }
  }, [conversionTrack, state]);

  const inputColor =
    surface === "canvas"
      ? "bg-doodle-stitch text-doodle-ink placeholder:text-doodle-ink/40"
      : "bg-doodle-stitch/95 text-doodle-ink placeholder:text-doodle-ink/40";

  return (
    <div className={`w-full max-w-md ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        {state?.ok ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="flex items-start gap-3 rounded-[1rem] bg-doodle-stitch px-5 py-4 shadow-card"
          >
            <CheckCircle weight="duotone" size={28} className="text-doodle-orange shrink-0 mt-0.5" />
            <div>
              <div className="font-display text-lg leading-tight text-doodle-ink">
                You&rsquo;re in.
              </div>
              <p className="mt-1 text-sm text-doodle-ink/70 leading-snug">
                {state.message}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            action={formAction}
            initial={false}
            className="relative flex items-center gap-2 rounded-full border border-doodle-ink/15 bg-doodle-canvas/40 p-1.5 shadow-subtle backdrop-blur-sm"
          >
            <label htmlFor="waitlist-email" className="sr-only">
              Email address
            </label>
            <div className="relative flex-1">
              <EnvelopeSimple
                weight="duotone"
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-doodle-ink/45"
                aria-hidden
              />
              <input
                id="waitlist-email"
                name="email"
                type="email"
                inputMode="email"
                required
                placeholder="your@email"
                disabled={isPending}
                suppressHydrationWarning
                className={`
                  block w-full rounded-full pl-10 pr-3 h-11 text-sm font-sans
                  outline-none transition focus:ring-4 focus:ring-doodle-orange/30
                  ${inputColor}
                `}
              />
            </div>
            <input type="hidden" name="name" value="" />
            {/* Honeypot — hidden from humans; bots that fill every field get dropped. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] top-0 h-0 w-0 opacity-0"
            />
            {source ? (
              <input type="hidden" name="source" value={source} />
            ) : null}
            <PillButton
              type="submit"
              size="sm"
              showArrow={false}
              disabled={isPending}
            >
              {isPending ? "Saving…" : "Join waitlist"}
            </PillButton>
          </motion.form>
        )}
      </AnimatePresence>

      {state && !state.ok && (
        <p
          role="alert"
          className="mt-3 text-sm text-doodle-red font-medium px-2"
        >
          {state.message}
        </p>
      )}

      <p className="mt-3 px-2 text-xs text-doodle-ink/55">
        No spam, ever. One email when the first drop is ready.
      </p>
    </div>
  );
}
