"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import type { Cart } from "@/lib/medusa/types"
import { formatINR } from "@/lib/medusa/types"
import { Field, SelectField } from "@/components/ui/Field"
import { PillButton } from "@/components/ui/PillButton"
import {
  setCustomerContact,
  setShippingAddress,
  setGiftNote,
  listShippingOptions,
  setShippingMethod,
  placeCodOrder,
  initiateRazorpayPayment,
  completeRazorpayOrder,
  type ShippingOptionLite,
} from "@/app/actions/checkout"

type Step = "contact" | "shipping" | "delivery" | "payment"

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
  const [giftNote, setGiftNoteText] = React.useState(
    typeof cart.metadata?.gift_note === "string" ? cart.metadata.gift_note : "",
  )

  // Step 3 — Delivery (real shipping options from Medusa, never a fake "Free")
  const [options, setOptions] = React.useState<ShippingOptionLite[]>([])
  const [optionId, setOptionId] = React.useState<string>("")
  const [chosenShipping, setChosenShipping] = React.useState<ShippingOptionLite | null>(null)

  // Step 4 — Payment
  const [payment, setPayment] = React.useState<"razorpay" | "cod">("razorpay")

  /** Attach the picked option to the cart and advance. */
  async function applyShippingOption(opt: ShippingOptionLite) {
    const r = await setShippingMethod({ optionId: opt.id })
    if (!r.ok) {
      setErr(r.error)
      return false
    }
    setChosenShipping({ ...opt, amount: r.data.shippingTotal })
    // The order summary aside is server-rendered — refresh so shipping + total update.
    router.refresh()
    setStep("payment")
    return true
  }

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
    if (!r.ok) {
      setBusy(false)
      setErr(r.error)
      return
    }
    if (giftNote.trim()) {
      // Best-effort — a failed gift note must never block checkout.
      await setGiftNote({ note: giftNote })
    }

    // Address is in — fetch the real delivery options for this cart.
    const opts = await listShippingOptions()
    if (!opts.ok) {
      setBusy(false)
      setErr(opts.error)
      return
    }
    if (opts.data.length === 0) {
      setBusy(false)
      setErr(
        "We can't arrange delivery to this address yet. Double-check the pincode, or write to hello@doodlebycanvas.in.",
      )
      return
    }
    if (opts.data.length === 1) {
      // One option — pick it silently, no extra step for the shopper.
      await applyShippingOption(opts.data[0])
      setBusy(false)
      return
    }
    setOptions(opts.data)
    setOptionId(opts.data[0].id)
    setBusy(false)
    setStep("delivery")
  }

  async function submitDelivery() {
    setErr(null)
    const opt = options.find((o) => o.id === optionId)
    if (!opt) {
      setErr("Pick a delivery option.")
      return
    }
    setBusy(true)
    await applyShippingOption(opt)
    setBusy(false)
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
        // The handler's signature fields go to the server, which verifies the
        // HMAC (with the key secret) before completing the cart. The backend
        // webhook remains the authority for capture.
        const r = await completeRazorpayOrder({
          paymentId: response.razorpay_payment_id,
          rzpOrderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
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
            <Field label="First name *" value={firstName} onChange={setFirstName} autoComplete="given-name" />
            <Field label="Last name" value={lastName} onChange={setLastName} autoComplete="family-name" />
            <Field label="Email *" type="email" value={email} onChange={setEmail} autoComplete="email" />
            <Field label="Phone *" type="tel" inputMode="tel" value={phone} onChange={setPhone} autoComplete="tel" />
          </div>
          <PillButton type="button" onClick={submitContact} disabled={busy} showArrow={false}>
            {busy ? "Saving…" : "Continue to shipping"}
          </PillButton>
        </Section>

        <Section
          title="2. Shipping"
          open={step === "shipping"}
          done={step === "delivery" || step === "payment"}
          onEdit={() => setStep("shipping")}
          summary={
            step === "delivery" || step === "payment"
              ? `${address1}, ${city}, ${state} ${postalCode}`
              : null
          }
        >
          <div className="grid gap-4">
            <Field label="Address line 1 *" value={address1} onChange={setAddress1} autoComplete="address-line1" />
            <Field label="Address line 2" value={address2} onChange={setAddress2} autoComplete="address-line2" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="City *" value={city} onChange={setCity} autoComplete="address-level2" />
              <SelectField label="State *" value={state} onChange={setState} options={INDIA_STATES} />
              <Field label="Pincode *" value={postalCode} onChange={setPostalCode} maxLength={6} inputMode="numeric" autoComplete="postal-code" />
            </div>
            {/* Gifting is half of kidswear — one optional field, no upsell */}
            <div>
              <label htmlFor="gift-note" className="block text-sm font-medium text-doodle-ink/70">
                Gift note <span className="text-doodle-ink/45">(optional — we&rsquo;ll tuck it in)</span>
              </label>
              <textarea
                id="gift-note"
                value={giftNote}
                onChange={(e) => setGiftNoteText(e.target.value)}
                maxLength={200}
                rows={2}
                placeholder="Happy birthday, Aarav! Pick your favourite patch first."
                className="mt-1.5 block w-full rounded-lg border border-doodle-ink/15 bg-card px-3.5 py-2.5 text-sm text-doodle-ink placeholder:text-doodle-ink/35 outline-none transition focus:ring-4 focus:ring-doodle-orange/25"
              />
            </div>
          </div>
          <PillButton type="button" onClick={submitShipping} disabled={busy} showArrow={false}>
            {busy ? "Saving…" : "Continue to delivery"}
          </PillButton>
        </Section>

        <Section
          title="3. Delivery"
          open={step === "delivery"}
          done={step === "payment" && chosenShipping != null}
          onEdit={() => setStep("delivery")}
          summary={
            step === "payment" && chosenShipping
              ? `${chosenShipping.name} · ${chosenShipping.amount > 0 ? formatINR(chosenShipping.amount) : "Free"}`
              : null
          }
        >
          <fieldset className="space-y-3">
            {options.map((opt) => (
              <label
                key={opt.id}
                className={[
                  "flex items-center justify-between gap-3 p-4 rounded-lg border cursor-pointer transition-[border-color,box-shadow] duration-200",
                  optionId === opt.id
                    ? "border-doodle-orange bg-card shadow-subtle"
                    : "border-doodle-ink/15 hover:border-doodle-ink/30",
                ].join(" ")}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping-option"
                    value={opt.id}
                    checked={optionId === opt.id}
                    onChange={() => setOptionId(opt.id)}
                  />
                  <span className="font-medium text-doodle-ink">{opt.name}</span>
                </span>
                <span className="font-display text-doodle-ink">
                  {opt.amount > 0 ? formatINR(opt.amount) : "Free"}
                </span>
              </label>
            ))}
          </fieldset>
          <PillButton type="button" onClick={submitDelivery} disabled={busy} showArrow={false}>
            {busy ? "Saving…" : "Continue to payment"}
          </PillButton>
        </Section>

        <Section
          title="4. Payment"
          open={step === "payment"}
          done={false}
          onEdit={() => setStep("payment")}
          summary={null}
        >
          <fieldset className="space-y-3">
            <label
              className={[
                "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-[border-color,box-shadow] duration-200",
                payment === "razorpay"
                  ? "border-doodle-orange bg-card shadow-subtle"
                  : "border-doodle-ink/15 hover:border-doodle-ink/30",
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
                "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-[border-color,box-shadow] duration-200",
                payment === "cod"
                  ? "border-doodle-orange bg-card shadow-subtle"
                  : "border-doodle-ink/15 hover:border-doodle-ink/30",
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
          <PillButton type="button" onClick={submitPayment} disabled={busy} showArrow={false}>
            {busy ? "Processing…" : payment === "cod" ? "Place order (COD)" : `Pay ${formatINR(cart.total ?? 0)}`}
          </PillButton>
        </Section>

        {err && (
          <div className="rounded-lg bg-doodle-red/10 px-4 py-3 text-sm font-sans text-doodle-red">
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
    <div className="rounded-lg bg-card shadow-card p-5 sm:p-7">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-doodle-ink">{title}</h2>
        {done && (
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-sans font-medium text-doodle-ink/60 hover:text-doodle-ink transition-colors"
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

