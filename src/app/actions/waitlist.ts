"use server";

import * as Sentry from "@sentry/nextjs";
import { getDb, schema } from "@/db";
import { rateLimit } from "@/lib/ratelimit";

export type WaitlistResult =
  | { ok: true; isNew: boolean; message: string }
  | { ok: false; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ONSITE_SOURCES = new Set(["hero", "dual_cta", "footer"]);

// Campaign attribution arrives from /drop as e.g. "lcl_may26:meta:m1".
// On-site sources pass through unchanged; anything else is sanitized to a
// bounded, lowercase token so paid rows stay groupable per creative without
// letting arbitrary query input reach the DB or the console.warn log line.
function normalizeSource(raw: string): string {
  const v = raw.trim().toLowerCase();
  if (ONSITE_SOURCES.has(v)) return v;
  const cleaned = v.replace(/[^a-z0-9:_-]/g, "").slice(0, 60);
  return cleaned || "drop";
}

export async function joinWaitlist(
  _prev: WaitlistResult | null,
  formData: FormData,
): Promise<WaitlistResult> {
  // Honeypot: a hidden field real users never see/fill. Bots that auto-fill
  // every input trip it. Pretend success so we don't teach them to evade it.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return {
      ok: true,
      isNew: false,
      message: "You're on the list. We'll write when the first drop is ready.",
    };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim() || null;
  const source = normalizeSource(String(formData.get("source") ?? "hero"));

  if (!email || !EMAIL.test(email)) {
    return { ok: false, message: "That email looks off — try again." };
  }

  // Throttle abuse (per IP). No-ops until Upstash creds are set.
  if (!(await rateLimit("waitlist"))) {
    return {
      ok: false,
      message: "Too many tries. Give it a few minutes and retry.",
    };
  }

  const db = getDb();

  if (!db) {
    // No DATABASE_URL configured (local dev without Neon yet). Log so signups
    // aren't silently lost while the DB is being provisioned.
    console.warn(
      "[waitlist] DATABASE_URL unset — signup logged only:",
      { email, name, source, ts: new Date().toISOString() },
    );
    return {
      ok: true,
      isNew: false,
      message: "You're on the list. We'll write when the first drop is ready.",
    };
  }

  let isNew = false;
  try {
    const inserted = await db
      .insert(schema.waitlist)
      .values({ email, name, source })
      .onConflictDoNothing({ target: schema.waitlist.email })
      .returning({ id: schema.waitlist.id });
    isNew = inserted.length > 0;
  } catch (error) {
    // DPDP: don't ship the user's email to Sentry. Tags are enough to triage.
    Sentry.captureException(error, {
      tags: { feature: "waitlist", source },
    });
    console.error("[waitlist] insert failed (email omitted from log):", error);
    // Don't block the user — but never report a conversion we didn't persist.
    return {
      ok: true,
      isNew: false,
      message: "You're on the list. We'll write when the first drop is ready.",
    };
  }

  // isNew distinguishes a genuinely new signup from a duplicate email
  // (onConflictDoNothing). The ad-platform conversion fires only on isNew,
  // so the Pixel/Google count tracks real captured leads, not refreshes.
  return {
    ok: true,
    isNew,
    message: "You're on the list. We'll write when the first drop is ready.",
  };
}
