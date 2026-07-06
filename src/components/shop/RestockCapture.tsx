"use client"

import * as React from "react"
import { joinWaitlist } from "@/app/actions/waitlist"

/* Back-in-stock capture — replaces the old dead "want us to text you?"
   sentence with a promise the site can keep: an email capture that lands in
   the waitlist table tagged restock:<sku>, so a sold-out variant becomes
   next drop's demand list. */

export function RestockCapture({ sku }: { sku: string }) {
  const [state, setState] = React.useState<"idle" | "busy" | "done" | "error">("idle")
  const [email, setEmail] = React.useState("")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setState("busy")
    const fd = new FormData()
    fd.set("email", email)
    fd.set("source", `restock:${sku.toLowerCase().slice(0, 40)}`)
    const r = await joinWaitlist(null, fd)
    setState(r.ok ? "done" : "error")
  }

  if (state === "done") {
    return (
      <p className="text-sm font-medium text-doodle-ink">
        Noted — you&rsquo;ll get one email when it&rsquo;s back.
      </p>
    )
  }

  return (
    <form onSubmit={submit} className="flex max-w-sm items-center gap-2">
      <label htmlFor={`restock-${sku}`} className="sr-only">
        Email for restock alert
      </label>
      <input
        id={`restock-${sku}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email"
        disabled={state === "busy"}
        className="h-10 flex-1 rounded-full border border-doodle-ink/15 bg-card px-4 text-sm text-doodle-ink placeholder:text-doodle-ink/35 outline-none transition focus:ring-4 focus:ring-doodle-orange/25"
      />
      <button
        type="submit"
        disabled={state === "busy"}
        className="h-10 shrink-0 rounded-full bg-doodle-ink px-4 text-xs font-semibold text-doodle-canvas transition-transform active:scale-[0.97] disabled:opacity-60"
      >
        {state === "busy" ? "Saving…" : "Email me when it's back"}
      </button>
      {state === "error" && (
        <span className="text-xs text-doodle-red">Try again</span>
      )}
    </form>
  )
}
