"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { env } from "@/env";
import { useConsentGranted } from "@/lib/consent";

export function Providers({ children }: { children: React.ReactNode }) {
  const consentGranted = useConsentGranted();
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!env.NEXT_PUBLIC_POSTHOG_KEY) return;
    // DPDP: don't capture until opt-in; and STOP capturing on withdrawal.
    if (!consentGranted) {
      if (posthog.__loaded) {
        posthog.opt_out_capturing();
        posthog.reset();
      }
      return;
    }
    if (posthog.__loaded) {
      posthog.opt_in_capturing();
      return;
    }
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: "history_change",
      capture_pageleave: true,
      autocapture: true,
      person_profiles: "identified_only",
    });
  }, [consentGranted]);

  if (!env.NEXT_PUBLIC_POSTHOG_KEY) return <>{children}</>;
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
