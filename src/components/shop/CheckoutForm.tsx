"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import type { Cart } from "@/lib/medusa/types"
import { formatINR } from "@/lib/medusa/types"
import {
  setCustomerContact,
  setShippingAddress,
  placeCodOrder,
  initiateRazorpayPayment,
  completeRazorpayOrder,
} from "@/app/actions/checkout"

type Step = "contact" | "shipping" | "payment"

type RazorpayCheckoutOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
  }) => void
  prefill?: { name?: string; email?: string; contact?: string }
  theme?: { color?: string }
  modal?: { ondismiss?: () => void }
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => { open: () => void }
  }
}

const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Puducherry", "Chandigarh", "Andaman and Nicobar Islands",
  "Dadra and Nagar Haveli and Daman and Diu", "Jammu and Kashmir", "Ladakh",
  "Lakshadweep",
]

export function CheckoutForm({ cart }: { cart: Cart }) {
  const router = useRouter()
  const [step, setStep] = React.useState<Step>("contact")
  const [busy, setBusy] = React.useState(false)
  const [err, setErr] = React.useState<string | null>(null)

  // Step 1 — Contact
  const [firstName, setFirstName] = React.useState(cart.shipping_address?.first_name ?? "")
  const [lastName, setLastName] = React.useState(cart.shipping_address?.last_name ?? "")
  const [email, setEmail] = React.useState(cart.email ?? "")
  const [phone, setPhone] = React.useState(cart.shipping_address?.phone ?? "")

  // Step 2 — Shipping
  const [address1, setAddress1] = React.useState(cart.shipping_address?.address_1 ?? "")
  const [address2, setAddress2] = React.useState(cart.shipping_address?.address_2 ?? "")
  const [city, setCity] = React.useState(cart.shipping_address?.city ?? "")
  const [state, setState] = React.useState(cart.shipping_address?.province ?? "")
  const [postalCode, setPostalCode] = React.useState(cart.shipping_address?.postal_code ?? "")

  // Step 3 — Payment
  const [payment, setPayment] = React.useState<"razorpay" | "cod">("razorpay")

  async function submitContact() {
    setErr(null)
    if (!email || !phone || !firstName) {
      setErr("Email, phone, and first name are required.")
      return
    }
    setBusy(true)
    const r = await setCustomerContact({ email, phone, first_name: firstName, last_name: lastName })
    setBusy(false)
    if (!r.ok) {
      setErr(r.error)
      return
    }
    setStep("shipping")
  }

  async function submitShipping() {
    setErr(null)
    if (!address1 || !city || !state || !postalCode) {
      setErr("Address, city, state, and pincode are required.")
      return
    }
    if (!/^\d{6}$/.test(postalCode)) {
      setErr("Pincode must be 6 digits.")
      return
    }
    setBusy(true)
    const r = await setShippingAddress({
      first_name: firstName,
      last_name: lastName,
      phone,
      address_1: address1,
      address_2: address2,
      city,
      province: state,
      postal_code: postalCode,
    })
    setBusy(false)
    if (!r.ok) {
      setErr(r.error)
      return
    }
    setStep("payment")
  }

  async function submitPayment() {
    setErr(null)
    setBusy(true)
    if (payment === "cod") {
      const r = await placeCodOrder()
      setBusy(false)
      if (!r.ok) {
        setErr(r.error)
        return
      }
      router.push(`/order/${r.data.orderId}/confirmed`)
      return
    }

    // Razorpay path
    const init = await initiateRazorpayPayment()
    if (!init.ok) {
      setBusy(false)
      setErr(init.error)
      return
    }
    if (!window.Razorpay) {
      setBusy(false)
      setErr("Razorpay didn't load. Reload the page and try again.")
      return
    }

    const rzp = new window.Razorpay({
      key: init.data.keyId,
      amount: init.data.amount,
      currency: (init.data.currency ?? "inr").toUpperCase(),
      name: "DOODLE",
      description: "First-drop order",
      order_id: init.data.rzpOrderId,
      prefill: {
        name: `${firstName} ${lastName}`.trim(),
        email,
        contact: phone,
      },
      theme: { color: "#E8650A" },
      handler: async (response) => {
        const r = await completeRazorpayOrder({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        })
        if (!r.ok) {
          setErr(r.error)
          setBusy(false)
          return
        }
        router.push(`/order/${r.data.orderId}/confirmed`)
      },
      modal: {
        ondismiss: () => setBusy(false),
      },
    })
    rzp.open()
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <div className="space-y-4">
        <Section
          title="1. Contact"
          open={step === "contact"}
          done={step !== "contact"}
          onEdit={() => setStep("contact")}
          summary={
            step !== "contact"
              ? `${firstName} ${lastName} · ${email} · ${phone}`
              : null
          }
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="First name *" value={firstName} onChange={setFirstName} />
            <Input label="Last name" value={lastName} onChange={setLastName} />
            <Input label="Email *" type="email" value={email} onChange={setEmail} />
            <Input label="Phone *" type="tel" value={phone} onChange={setPhone} />
          </div>
          <PrimaryButton onClick={submitContact} disabled={busy}>
            {busy ? "Saving…" : "Continue to shipping"}
          </PrimaryButton>
        </Section>

        <Section
          title="2. Shipping"
          open={step === "shipping"}
          done={step === "payment"}
          onEdit={() => setStep("shipping")}
          summary={
            step === "payment"
              ? `${address1}, ${city}, ${state} ${postalCode}`
              : null
          }
        >
          <div className="grid gap-4">
            <Input label="Address line 1 *" value={address1} onChange={setAddress1} />
            <Input label="Address line 2" value={address2} onChange={setAddress2} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="City *" value={city} onChange={setCity} />
              <Select label="State *" value={state} onChange={setState} options={INDIA_STATES} />
              <Input label="Pincode *" value={postalCode} onChange={setPostalCode} maxLength={6} />
            </div>
          </div>
          <PrimaryButton onClick={submitShipping} disabled={busy}>
            {busy ? "Saving…" : "Continue to payment"}
          </PrimaryButton>
        </Section>

        <Section
          title="3. Payment"
          open={step === "payment"}
          done={false}
          onEdit={() => setStep("payment")}
          summary={null}
        >
          <fieldset className="space-y-3">
            <label
              className={[
                "flex items-start gap-3 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors",
                payment === "razorpay"
                  ? "border-doodle-ink bg-doodle-canvas"
                  : "border-doodle-ink/25 hover:border-doodle-ink/50",
              ].join(" ")}
            >
              <input
                type="radio"
                name="payment"
                value="razorpay"
                checked={payment === "razorpay"}
                onChange={() => setPayment("razorpay")}
                className="mt-1.5"
              />
              <div>
                <div className="font-display text-lg text-doodle-ink">UPI · Card · Wallet · Netbanking</div>
                <div className="text-sm text-doodle-ink/70 mt-0.5">Powered by Razorpay. Pay now, ship faster.</div>
              </div>
            </label>
            <label
              className={[
                "flex items-start gap-3 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors",
                payment === "cod"
                  ? "border-doodle-ink bg-doodle-canvas"
                  : "border-doodle-ink/25 hover:border-doodle-ink/50",
              ].join(" ")}
            >
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={payment === "cod"}
                onChange={() => setPayment("cod")}
                className="mt-1.5"
              />
              <div>
                <div className="font-display text-lg text-doodle-ink">Cash on delivery</div>
                <div className="text-sm text-doodle-ink/70 mt-0.5">
                  Pay {formatINR(cart.total ?? 0)} when the courier hands it over. Available in most pincodes.
                </div>
              </div>
            </label>
          </fieldset>
          <PrimaryButton onClick={submitPayment} disabled={busy}>
            {busy ? "Processing…" : payment === "cod" ? "Place order (COD)" : `Pay ${formatINR(cart.total ?? 0)}`}
          </PrimaryButton>
        </Section>

        {err && (
          <div className="rounded-xl bg-doodle-red/10 border-2 border-dashed border-doodle-red px-4 py-3 text-sm text-doodle-red">
            {err}
          </div>
        )}
      </div>
    </>
  )
}

function Section({
  title,
  open,
  done,
  onEdit,
  summary,
  children,
}: {
  title: string
  open: boolean
  done: boolean
  onEdit: () => void
  summary: string | null
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[1.5rem] bg-doodle-canvas border-2 border-dashed border-doodle-ink/20 p-5 sm:p-7">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-doodle-ink">{title}</h2>
        {done && (
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-mono uppercase tracking-[0.18em] text-doodle-ink/60 hover:text-doodle-ink"
          >
            Edit
          </button>
        )}
      </div>
      {open ? (
        <div className="mt-5 space-y-5">{children}</div>
      ) : summary ? (
        <p className="mt-2 text-sm text-doodle-ink/70">{summary}</p>
      ) : null}
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  maxLength,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  maxLength?: number
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-doodle-ink/55">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        className="
          mt-1.5 block w-full h-11 px-3 rounded-lg
          bg-doodle-stitch border-2 border-dashed border-doodle-ink/25
          focus:border-doodle-ink focus:outline-none
          text-doodle-ink font-sans text-base
        "
      />
    </label>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: readonly string[]
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-doodle-ink/55">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          mt-1.5 block w-full h-11 px-3 rounded-lg
          bg-doodle-stitch border-2 border-dashed border-doodle-ink/25
          focus:border-doodle-ink focus:outline-none
          text-doodle-ink font-sans text-base
        "
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        inline-flex items-center justify-center
        h-12 px-6 rounded-full
        bg-doodle-orange text-doodle-stitch font-medium text-base
        border-2 border-dashed border-doodle-stitch
        hover:scale-[1.02] active:scale-[0.98] transition-transform
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
      "
    >
      {children}
    </button>
  )
}
