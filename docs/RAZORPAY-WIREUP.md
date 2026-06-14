# Razorpay wire-up — DOODLE

_Status: code wired + security-audited 2026-06-05. Activates when keys land._

## Decision (changed from the old plan)

The old session note said "fork `@devx-commerce/razorpay` into `packages/`". After
researching the current (2026) options, we instead use **`medusa-plugin-razorpay-v2`**
(by SGFGOV — the canonical Razorpay-for-Medusa author) as an **npm dependency, not a fork**.

Why:
- It's the canonical, actively-maintained **Medusa v2** provider.
- Verification is done the correct way: the official
  `Razorpay.validateWebhookSignature(rawBody, signature, secret)` (HMAC over the
  raw webhook body) — audited in `core/razorpay-base.ts`.
- A frozen fork of a **payment** provider cuts it off from security patches. For
  the money path, a maintained dependency is the safer choice.

## What's already wired (no keys needed)

**Backend (`doodle-backend`):**
- `medusa-plugin-razorpay-v2` added to `package.json`.
- Provider registered in `medusa-config.js` under the payment module, **env-gated**
  — it only registers when `RAZORPAY_*` keys are present, so the backend still boots
  without them. Provider id: `razorpay`.
- `.env.template` updated with the exact var names the plugin expects.

**Storefront (`doodle`):**
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` added to `env.ts` (public key only).
- `app/actions/checkout.ts`:
  - `initiateRazorpayPayment` reads `session.data.razorpayOrder.id` (the plugin's
    real shape) and the public key from env.
  - amount converted to **paise** (`total * 100`).
  - `completeRazorpayOrder` no longer calls a `/verify` endpoint — it just completes
    the cart; the **webhook** confirms/captures (matches the plugin's reference button).

## Integration contract (verified against plugin source)

| Thing | Value |
|---|---|
| Provider id | `razorpay` |
| Session data shape | `session.data.razorpayOrder.id` |
| Public key (client) | `NEXT_PUBLIC_RAZORPAY_KEY_ID` |
| Secret + webhook secret | backend env only — never client |
| Webhook URL (register in dashboard) | `{BACKEND_PUBLIC_URL}/razorpay/hooks` |
| Webhook events | `payment.captured`, `payment.authorized`, `payment.failed`, `refund.processed` |

## ⚠️ Verify on the FIRST test transaction

- **Amount/paise**: when `order_id` is passed, Razorpay treats the order's amount as
  authoritative. Confirm the checkout amount matches the order amount (no double-paise).
- **Peer-dep skew**: plugin pins Medusa `2.12.3`; backend is `2.13.6`. Install with peer
  warnings allowed (`pnpm install` should resolve; add a pnpm override if it hard-fails).
- **Webhook reachability**: Razorpay must reach `{BACKEND_PUBLIC_URL}/razorpay/hooks`
  (Railway public URL, not localhost). Use the Razorpay dashboard "test webhook" to confirm.

## What ASH needs to do (account-bound — can't be automated)

1. Create a Razorpay account → **Settings → API Keys → Generate TEST keys**.
2. **Settings → Webhooks → Add** `https://<railway-backend>/razorpay/hooks`, choose a
   webhook secret (any strong string), subscribe to the 4 events above.
3. Put these in the backend `.env` (and Railway → Variables):
   `RAZORPAY_TEST_KEY_ID`, `RAZORPAY_TEST_KEY_SECRET`, `RAZORPAY_TEST_ACCOUNT`,
   `RAZORPAY_TEST_WEBHOOK_SECRET`.
4. Put the **public** key in the storefront env: `NEXT_PUBLIC_RAZORPAY_KEY_ID`.
5. Tell me — I run `pnpm install` on the backend, restart, and we do a TEST checkout
   end-to-end (then wire the `payment.captured` → PaymentReceived email subscriber).
6. After LIVE KYC clears: swap TEST values for the LIVE `RAZORPAY_ID/SECRET/...` set.
