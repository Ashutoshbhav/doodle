# DOODLE — Go-Live Playbook (flip the shop ON)

Everything below makes the public `/shop` connect to the live backend and start selling.
Do this once your real product photos are uploaded in the Medusa admin.

## Pre-requisites (already done ✅)
- Backend live + healthy on Railway: `https://doodle-backend-production-32b1.up.railway.app`
- COD + Razorpay payment providers working (verified)
- Cloudinary photo storage working (verified)
- Products created with INR prices + stock

## The 3 values the storefront needs (Vercel → Production env)

| Variable name | Value |
|---|---|
| `NEXT_PUBLIC_MEDUSA_BASE_URL` | `https://doodle-backend-production-32b1.up.railway.app` |
| `NEXT_PUBLIC_MEDUSA_PUB_KEY` | `pk_5f961d5e9d3ee1d9970781531ad6ef219fa3abf333339ef937193d9057f9a6a4` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_test_T1WTzy1IyStTNx`  ← TEST key (see caveat) |

All three are PUBLIC values (safe in the browser). The Razorpay/Cloudinary/DB *secrets* stay on the backend only.

## Steps

### 1. Push the storefront code (Claude does this)
Uncommitted work that MUST ship for checkout to function:
- provider-id fixes (`cod`→`pp_cod_cod`, `razorpay`→`pp_razorpay_razorpay`) — **essential**, checkout breaks without these
- IDOR confirmation-page guard
- country-of-origin + GST/shipping breakdown (#17)
- overselling guard + qty clamp (#19)

`git add -A && git commit && git push` from `Documents/doodle` → Vercel auto-builds.

### 2. Add the 3 env vars in Vercel
Vercel → project **doodle** → **Settings** → **Environment Variables** → for each:
- Key = the name above, Value = the value above, Environment = **Production** (tick Preview too if you want)
- Save.

### 3. Redeploy
Vercel → **Deployments** → latest → **Redeploy** (so the new env vars are baked in).
(`isCommerceConfigured` becomes true once BASE_URL + PUB_KEY are present → `/shop` goes live.)

### 4. Verify (the smoke test)
- Open `doodlebycanvas.in/shop` → products show with photos + ₹ prices
- Add to cart → checkout → place a **COD** test order → confirms end-to-end
- Place a **Razorpay** order with a test card (4111 1111 1111 1111) → confirms online pay

## ⚠️ Caveats before REAL money / full launch
1. **Razorpay is in TEST mode** (`rzp_test_`). Real customers can't pay real money until you finish Razorpay **KYC/activation** and swap in the **live** keys (`rzp_live_...`) — both `NEXT_PUBLIC_RAZORPAY_KEY_ID` here AND `RAZORPAY_TEST_KEY_ID`/`SECRET`/`WEBHOOK_SECRET` on Railway → live equivalents. Also create a LIVE Razorpay webhook → `…/hooks/payment/razorpay_razorpay`.
2. **Order emails** won't send until `RESEND_API_KEY` is set on Railway.
3. **Shipping labels** need Shiprocket creds.
4. **Metrics**: add `NEXT_PUBLIC_POSTHOG_KEY` (Vercel) + connect Google Search Console.
5. **Optional polish**: point `api.doodlebycanvas.in` at Railway (custom domain) and use it for `NEXT_PUBLIC_MEDUSA_BASE_URL` instead of the railway.app URL.

---

# Resend email setup (order confirmations + abandoned-cart)

Code is already built (Medusa backend subscribers + abandoned-cart job). Needs: an API key + a verified sending domain. Emails are sent from the **backend (Railway)**.

## Part A — Get the API key (5 min)
1. Sign up at https://resend.com (free; GitHub/Google login works). Free tier ≈ 3,000 emails/month, 100/day — plenty for early sales (confirm on their pricing page).
2. Left menu → **API Keys** → **Create API Key** → name `doodle-backend`, permission **Sending access** → copy the `re_...` key (shown once).
3. Give the key to Claude → it sets `RESEND_API_KEY` on Railway (server-side).

## Part B — Verify your sending domain (so emails reach inboxes, not spam)
Without this, Resend only lets you email your OWN address. To email customers you must verify the domain.
1. Resend → **Domains** → **Add Domain**. Recommended: a subdomain `send.doodlebycanvas.in` (industry best practice — protects your main domain's email reputation). Apex `doodlebycanvas.in` also works.
2. Resend shows ~3 DNS records (a TXT for SPF, CNAME/TXT for DKIM, sometimes an MX).
3. **Add these in Vercel** (NOT GoDaddy — the domain's nameservers point to Vercel now): Vercel → Domains/DNS → add each record exactly as Resend shows.
4. Back in Resend → click **Verify** (takes minutes to a few hours to propagate).

## Part C — What Claude does once key + domain are ready
- Set `RESEND_API_KEY` + `RESEND_FROM_EMAIL=hello@send.doodlebycanvas.in` (must match the verified domain) on Railway. Reply-to stays `doodlebycanvas@gmail.com`.
- Redeploy backend → order-confirmation + abandoned-cart emails start sending.
- Test: place an order → confirm the email arrives.

Note: the from-address domain MUST match whatever you verified (apex vs `send.` subdomain). Tell Claude which you picked so EMAIL_FROM matches.

---

## Security cleanup (do once)
- Revoke the Railway project token pasted in chat (Railway → Settings → Tokens)
- Rotate the Razorpay test secret + Cloudinary API secret (both pasted in chat)
- Change the admin password on first login
