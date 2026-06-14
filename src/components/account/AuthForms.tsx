"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { loginCustomer, registerCustomer } from "@/app/actions/account"

type Mode = "login" | "register"

export function AuthForms({ initialMode = "login" }: { initialMode?: Mode }) {
  const router = useRouter()
  const [mode, setMode] = React.useState<Mode>(initialMode)
  const [busy, setBusy] = React.useState(false)
  const [err, setErr] = React.useState<string | null>(null)

  // shared
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  // register-only
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [phone, setPhone] = React.useState("")

  function switchMode(next: Mode) {
    setMode(next)
    setErr(null)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setBusy(true)
    const r =
      mode === "login"
        ? await loginCustomer({ email, password })
        : await registerCustomer({
            email,
            password,
            first_name: firstName,
            last_name: lastName,
            phone,
          })
    setBusy(false)
    if (!r.ok) {
      setErr(r.error)
      return
    }
    router.push("/account")
    router.refresh()
  }

  return (
    <div className="rounded-lg bg-doodle-canvas border-2 border-dashed border-doodle-ink/20 p-6 sm:p-8">
      <div className="flex gap-2 mb-6">
        <TabButton active={mode === "login"} onClick={() => switchMode("login")}>
          Sign in
        </TabButton>
        <TabButton active={mode === "register"} onClick={() => switchMode("register")}>
          Create account
        </TabButton>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {mode === "register" && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="First name *" value={firstName} onChange={setFirstName} autoComplete="given-name" />
            <Input label="Last name" value={lastName} onChange={setLastName} autoComplete="family-name" />
          </div>
        )}

        <Input
          label="Email *"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />

        {mode === "register" && (
          <Input label="Phone" type="tel" value={phone} onChange={setPhone} autoComplete="tel" />
        )}

        <Input
          label="Password *"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          hint={mode === "register" ? "At least 8 characters." : undefined}
        />

        {err && (
          <div className="rounded-lg bg-doodle-red/10 border-2 border-dashed border-doodle-red px-4 py-3 text-sm text-doodle-red">
            {err}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="
            inline-flex items-center justify-center w-full sm:w-auto
            h-12 px-6 rounded-full
            bg-doodle-orange text-doodle-stitch font-medium text-base
            border-2 border-dashed border-doodle-stitch
            hover:scale-[1.02] active:scale-[0.98] transition-transform
            disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
          "
        >
          {busy
            ? mode === "login"
              ? "Signing in…"
              : "Creating…"
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-4 py-2 rounded-full font-mono text-[11px] uppercase tracking-[0.14em] transition-colors border-2 border-dashed",
        active
          ? "bg-doodle-ink text-doodle-stitch border-doodle-ink"
          : "border-doodle-ink/25 text-doodle-ink/60 hover:text-doodle-ink hover:border-doodle-ink/50",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  autoComplete?: string
  hint?: string
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-doodle-ink/55">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="
          mt-1.5 block w-full h-11 px-3 rounded-lg
          bg-doodle-stitch border-2 border-dashed border-doodle-ink/25
          focus:border-doodle-ink focus:outline-none
          text-doodle-ink font-sans text-base
        "
      />
      {hint && <span className="mt-1 block text-xs text-doodle-ink/50">{hint}</span>}
    </label>
  )
}
