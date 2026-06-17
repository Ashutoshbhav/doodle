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

## Security cleanup (do once)
- Revoke the Railway project token pasted in chat (Railway → Settings → Tokens)
- Rotate the Razorpay test secret + Cloudinary API secret (both pasted in chat)
- Change the admin password on first login
