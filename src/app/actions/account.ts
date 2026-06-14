"use server"

import { revalidatePath } from "next/cache"
import { medusa, isCommerceConfigured } from "@/lib/medusa/client"
import { setAuthToken, clearAuthToken } from "@/lib/medusa/auth"
import { rateLimit } from "@/lib/ratelimit"

type Result<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string }

function ok<T>(data: T): Result<T> {
  return { ok: true, data }
}
function fail(error: string): Result {
  return { ok: false, error }
}
function notConfigured(): Result {
  return fail("Accounts aren't live yet. Check back soon.")
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(email: string, password: string): string | null {
  if (!EMAIL_RE.test(email)) return "Enter a valid email address."
  if (password.length < 8) return "Password must be at least 8 characters."
  return null
}

/**
 * Register a customer: get a registration token, create the customer profile
 * with it, then log in to obtain a session token. Email verification is off by
 * default for the emailpass provider; if it's ever enabled, `auth.register`
 * returns an object instead of a string and we surface a clear message.
 */
export async function registerCustomer(input: {
  email: string
  password: string
  first_name: string
  last_name?: string
  phone?: string
}): Promise<Result> {
  if (!isCommerceConfigured) return notConfigured()
  if (!(await rateLimit("auth"))) {
    return fail("Too many attempts. Please wait a few minutes and try again.")
  }

  const email = input.email.trim().toLowerCase()
  const invalid = validate(email, input.password)
  if (invalid) return fail(invalid)
  if (!input.first_name.trim()) return fail("First name is required.")

  try {
    const regToken = await medusa.auth.register("customer", "emailpass", {
      email,
      password: input.password,
    })

    if (typeof regToken !== "string") {
      return fail("Please verify your email to finish creating your account.")
    }

    await medusa.store.customer.create(
      {
        email,
        first_name: input.first_name.trim(),
        last_name: input.last_name?.trim() || undefined,
        phone: input.phone?.trim() || undefined,
      },
      {},
      { Authorization: `Bearer ${regToken}` }
    )

    const authToken = await medusa.auth.login("customer", "emailpass", {
      email,
      password: input.password,
    })
    if (typeof authToken !== "string") {
      return fail("Account created. Please sign in.")
    }

    await setAuthToken(authToken)
    revalidatePath("/account")
    revalidatePath("/", "layout")
    return ok(undefined)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message.toLowerCase() : ""
    // Don't echo raw backend errors; map the common one, stay generic otherwise.
    if (msg.includes("already") || msg.includes("exists")) {
      return fail("An account with this email already exists. Try signing in.")
    }
    return fail("Couldn't create your account. Please try again.")
  }
}

export async function loginCustomer(input: {
  email: string
  password: string
}): Promise<Result> {
  if (!isCommerceConfigured) return notConfigured()
  if (!(await rateLimit("auth"))) {
    return fail("Too many attempts. Please wait a few minutes and try again.")
  }

  const email = input.email.trim().toLowerCase()
  if (!EMAIL_RE.test(email) || !input.password) {
    return fail("Email or password is incorrect.")
  }

  try {
    const token = await medusa.auth.login("customer", "emailpass", {
      email,
      password: input.password,
    })
    if (typeof token !== "string") {
      // Third-party providers return a redirect location; emailpass never does.
      return fail("Couldn't sign you in. Please try again.")
    }
    await setAuthToken(token)
    revalidatePath("/account")
    revalidatePath("/", "layout")
    return ok(undefined)
  } catch {
    // Generic on purpose — never reveal whether the email exists.
    return fail("Email or password is incorrect.")
  }
}

export async function logoutCustomer(): Promise<Result> {
  // JWT auth is stateless — clearing the cookie ends the session. Best-effort
  // server logout too, ignoring failures.
  try {
    await medusa.auth.logout()
  } catch {
    /* no-op */
  }
  await clearAuthToken()
  revalidatePath("/account")
  revalidatePath("/", "layout")
  return ok(undefined)
}
