"use server";

import * as Sentry from "@sentry/nextjs";
import { getDb, schema } from "@/db";

export type WaitlistResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SOURCES = new Set(["hero", "dual_cta", "footer"]);

export async function joinWaitlist(
  _prev: WaitlistResult | null,
  formData: FormData,
): Promise<WaitlistResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim() || null;
  const sourceRaw = String(formData.get("source") ?? "hero").trim();
  const source = SOURCES.has(sourceRaw) ? sourceRaw : "hero";

  if (!email || !EMAIL.test(email)) {
    return { ok: false, message: "That email looks off — try again." };
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
      message: "You're on the list. We'll write when the first drop is ready.",
    };
  }

  try {
    await db
      .insert(schema.waitlist)
      .values({ email, name, source })
      .onConflictDoNothing({ target: schema.waitlist.email });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { feature: "waitlist", source },
      extra: { email },
    });
    console.error("[waitlist] insert failed:", error);
    // Don't lose the signup. Show success to the user; we have it in Sentry.
    return {
      ok: true,
      message: "You're on the list. We'll write when the first drop is ready.",
    };
  }

  return {
    ok: true,
    message: "You're on the list. We'll write when the first drop is ready.",
  };
}
