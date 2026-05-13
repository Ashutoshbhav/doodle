"use client";

import * as React from "react";
import { useActionState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { joinWaitlist, type WaitlistResult } from "@/app/actions/waitlist";

type Props = {
  /** Optional accent — defaults to orange (primary). */
  accent?: "orange" | "blue" | "purple";
  /** Where the form sits — affects label colour for contrast. */
  surface?: "canvas" | "tile";
  className?: string;
};

const ACCENT_BG: Record<NonNullable<Props["accent"]>, string> = {
  orange: "bg-doodle-orange",
  blue: "bg-doodle-blue",
  purple: "bg-doodle-purple",
};

export function WaitlistForm({
  accent = "orange",
  surface = "canvas",
  className = "",
}: Props) {
  const [state, formAction, isPending] = useActionState<WaitlistResult | null, FormData>(
    joinWaitlist,
    null,
  );

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
            className="flex items-start gap-3 rounded-2xl bg-doodle-stitch px-5 py-4 stitch-ink"
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
            className="relative flex items-center gap-2 rounded-full p-1.5 stitch bg-doodle-canvas/40 backdrop-blur-sm"
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
            <motion.button
              type="submit"
              disabled={isPending}
              whileHover={!isPending ? { y: -2 } : undefined}
              whileTap={!isPending ? { scale: 0.97 } : undefined}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className={`
                inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full
                font-sans font-medium text-sm text-doodle-stitch
                ${ACCENT_BG[accent]} border-2 border-dashed border-doodle-stitch
                disabled:opacity-70 cursor-pointer
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-orange/40
              `}
            >
              {isPending ? "Saving…" : "Join waitlist"}
            </motion.button>
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
