"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { logoutCustomer } from "@/app/actions/account"

export function LogoutButton() {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)

  async function onClick() {
    setBusy(true)
    await logoutCustomer()
    setBusy(false)
    router.push("/")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="
        font-mono text-[11px] uppercase tracking-[0.14em]
        text-doodle-ink/60 hover:text-doodle-ink transition-colors
        disabled:opacity-60
      "
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  )
}
