# DOODLE — Operations Manual

> **Who this is for:** Ash, post-launch. Everything in this doc lets you run the site **without touching code or pinging a developer**.

> **Last updated:** 2026-05-20

---

## 1. The two places you'll spend your time

| What you want to do | Where | URL |
|---|---|---|
| **Commerce operations** (products, orders, prices, customers, discounts, inventory, refunds) | **Medusa Admin** | `https://api.doodle.in/app` |
| **Marketing copy / images / brand text** (Hero, sections, FAQ, footer) | **GitHub web editor** | `https://github.com/Ashutoshbhav/doodle` |
| Deploys after marketing copy edits | **Vercel** (auto, no action needed) | `https://vercel.com/dashboard` |

You almost never need to touch a terminal or run code locally. Vercel auto-deploys every commit you make through GitHub's web UI.

---

## 2. Commerce operations (Medusa Admin)

Bookmark `https://api.doodle.in/app` and sign in with your admin credentials (stored in your password manager).

### 2.1 Add a new product (e.g. a new patch shape for next drop)

1. Admin → **Products** → **Create**
2. Fill in: Title (e.g. "Lightning Bolt Patch"), Handle (auto-generated, can edit), Description
3. **Options**: add option name `Colour`, add values (Red, Blue, etc.)
4. **Variants**: click *Generate*. Each variant gets a SKU + price field — fill them in (use paise: ₹80 = `8000`)
5. **Inventory**: set per-variant stock count
6. **Images**: upload product photos (drag + drop)
7. **Sales channel**: tick "Default Sales Channel"
8. **Status**: set to **Published** when ready to go live (Draft hides it from `/shop`)
9. Click **Save**

The new product appears on `https://doodle.in/shop` within ~30 seconds (no deploy needed).

### 2.2 Change a price (e.g. raise the Tee to ₹1199)

1. Admin → **Products** → click the product
2. Scroll to **Variants** → click the variant → **Edit**
3. Change the **Prices** (each region has its own price entry — change INR)
4. Save

### 2.3 Run a discount code (e.g. ₹100 off all kits this Diwali)

1. Admin → **Promotions** → **Create promotion**
2. Type: *Code-based*
3. Code: `DIWALI100` (case-insensitive)
4. Value: ₹100 off OR 10% off
5. Conditions: *Applies to products → select Starter Kit + Mini Doodle*
6. Start + end date
7. Save → toggle **Active**

Customer enters `DIWALI100` at checkout; discount auto-applies.

### 2.4 Manage an order

1. Admin → **Orders**
2. Click the order to see full timeline (placed → paid → fulfilled → delivered)
3. **Refund:** click **Create Refund** → select line items → enter reason → submit (Razorpay processes the refund automatically; customer gets email)
4. **Cancel:** click **Cancel Order** → restock toggle → confirm
5. **Edit shipping address:** Customer details → Edit
6. **Resend confirmation email:** click **Resend**

### 2.5 Adjust inventory

1. Admin → **Inventory**
2. Search by SKU or product
3. Click into the location (Default = your Bangalore pickup)
4. Edit the **Available** count
5. Save

### 2.6 Add a new admin user (e.g. one of your co-founders)

1. Admin → **Settings** → **Users**
2. **Invite User** → enter email
3. They receive an email with a sign-up link
4. Once they sign up they have full admin access (no role restrictions for v1)

### 2.7 Where to see today's numbers

The **Dashboard** home page shows: today's revenue, today's orders, COD vs prepaid split, top-selling products. (Custom widget I built for you.)

---

## 3. Marketing copy edits (GitHub web editor)

Marketing copy (Hero headline, How It Works steps, Promise pillars, Footer tagline, etc.) lives in code files on GitHub. You can edit them right in the browser — no local code setup needed.

### 3.1 The pattern (memorize this once)

1. Go to `https://github.com/Ashutoshbhav/doodle`
2. Click into the file you want to edit (paths below)
3. Click the **pencil icon** (top right of the file view) → "Edit this file"
4. Make your changes in the textbox (it's just text + some `<tags>`)
5. Scroll down → "Commit changes" → write a short message like "update Hero headline"
6. Click "Commit changes"
7. Wait ~90 seconds — Vercel auto-deploys your change. You'll see the change live at `https://doodle.in`

### 3.2 Where the copy lives — cheat sheet

| What you want to change | File | Look for |
|---|---|---|
| Hero big headline | `src/components/sections/Hero.tsx` | The `<h1>` tag with the big text |
| The "Don't Just Dress. Create." line | `src/components/sections/Hero.tsx` | Search for "Create" |
| Promise section copy (3 pillars) | `src/components/sections/Promise.tsx` | `PILLARS` array near top |
| How It Works steps | `src/components/sections/HowItWorks.tsx` | `STEPS` array near top |
| Why DOODLE accordion items | `src/components/sections/WhyDoodle.tsx` | `ITEMS` array near top |
| Early Voices testimonials | `src/components/sections/EarlyVoices.tsx` | `VOICES` array (replace with real consented quotes!) |
| Founder names + bios | `src/components/sections/Founders.tsx` | Founder data near top |
| Find Us Offline (pop-up venues) | `src/components/sections/FindUsOffline.tsx` | Look for `[Bengaluru/Mumbai/Delhi]` |
| Dual CTA cards (consumer + stockist) | `src/components/sections/DualCTA.tsx` | The H2 + body text |
| Footer tagline | `src/components/sections/Footer.tsx` | Below the wordmark logo |
| Footer link labels | `src/components/sections/Footer.tsx` | `COLUMNS` array |
| Drop landing page copy | `src/app/drop/page.tsx` | The H1 + body |
| Order confirmation email | `doodle-backend/src/emails/OrderPlaced.tsx` | The text inside |
| All other email templates | `doodle-backend/src/emails/*.tsx` | The text inside |

**Rule of thumb for editing TSX:**
- Anything inside `"..."` (quoted strings) is text you can change freely
- Anything inside `<tags>` is structure — don't delete tags, just change the text between them
- If you accidentally break something, GitHub keeps history — revert via the file's history view

### 3.3 Add a new section to the homepage

This one IS code-touching. **Ping me for this** — it's a real architectural change, not a copy edit.

### 3.4 Add a blog post / news article

We don't have a blog yet. When you want one, ping me — I'll spin up `/blog` + MDX content files (~2 hours of work).

---

## 4. Marketing site assets (images, logos)

### 4.1 Replace a section image

1. Upload the new image to **Cloudinary** at `https://cloudinary.com/console` (`doodle/brand/` folder)
2. Copy the public URL (right-click → Copy URL)
3. Find the file referencing the old image (e.g. `src/app/page.tsx` or whichever section)
4. Replace the URL inline via GitHub web editor
5. Commit

### 4.2 Replace the wordmark logo

The logo file is `public/brand/wordmark-logo.jpeg`. Upload a new image with the same name to GitHub (drag + drop into the folder via web UI). Vercel rebuilds with the new logo.

---

## 5. Settings + secrets you'll occasionally need

### 5.1 Razorpay (payment provider)

- **Dashboard:** `https://dashboard.razorpay.com`
- Settlements, refunds beyond admin, KYC, business info, MDR — all here
- The API key (paste into Vercel env vars + Railway env vars when rotating) lives in Settings → API Keys

### 5.2 Shiprocket (fulfillment)

- **Dashboard:** `https://app.shiprocket.in`
- Manage couriers, pickup addresses, COD remittance settings
- Live tracking + customer notifications
- Returns + RTOs

### 5.3 Resend (transactional email)

- **Dashboard:** `https://resend.com/emails`
- See every email sent, delivery status, opens, clicks
- Manage domain verification + DNS records
- Audience lists (waitlist signups)

### 5.4 Vercel (storefront hosting)

- **Dashboard:** `https://vercel.com/dashboard`
- See every deploy, every preview URL
- Roll back to any previous deploy with one click (Deployments → ... → Promote to Production)
- Manage env vars, custom domain DNS

### 5.5 Railway (backend hosting)

- **Dashboard:** `https://railway.com`
- Restart the Medusa backend (Settings → Restart)
- Manage env vars (Variables tab)
- See logs (Logs tab)

### 5.6 Neon (database)

- **Dashboard:** `https://console.neon.tech`
- Branch the DB for testing
- Restore from automated backups (last 7 days on free tier)
- SQL console for ad-hoc queries

---

## 6. The "something broke" playbook

### 6.1 Site is showing an error / blank page

1. Check Vercel Deployments → most recent → click "Visit" → check console + network tab
2. Open Sentry: `https://sentry.io` → look for new errors in the last hour
3. If it's a recent deploy that broke it: **Roll back** via Vercel (Deployments → previous good → Promote to Production)
4. Ping me with the Sentry error link

### 6.2 Customers can't pay (Razorpay failing)

1. Check Razorpay dashboard → recent payments → look for "failed" status
2. Open the failed payment → there's a reason code (e.g. "card declined", "insufficient funds")
3. If it's a system issue: check Razorpay status page `https://status.razorpay.com`
4. If many failures: switch checkout to "Magic Checkout" mode (when v1.1 lands) OR temporarily disable cards in Razorpay dashboard
5. Ping me if you see "signature verification failed" — that's a code issue

### 6.3 An order's stuck in "authorized" status

1. Razorpay sometimes delays the `payment.captured` webhook
2. Wait 5 minutes
3. If still stuck: Admin → Orders → click order → **Capture Payment** manually
4. The cron job I built also handles this every 2 hours automatically

### 6.4 COD order needs manual intervention

1. Admin → Orders → filter by Payment Status = "Awaiting"
2. After Shiprocket confirms delivery + cash collected, the order should auto-mark paid
3. If it doesn't: Admin → Order → **Mark as Paid** manually

### 6.5 Email isn't arriving

1. Check Resend dashboard → search by recipient
2. If it shows "delivered" but customer claims missing → it's in their spam (Gmail bayesian)
3. If it shows "bounced" → customer's email is invalid; reach out via WhatsApp
4. If no record at all → the Medusa subscriber didn't fire. Ping me with order ID.

---

## 7. Things ONLY a developer (me, or a hired one) can do

These are real architectural / code changes. Don't try to do them in the GitHub web editor:

- Add a new product TYPE (e.g. "Stickers" — needs new schema in Medusa)
- Change checkout flow / payment provider
- Add new pages to the site
- Major design overhauls (colour palette, new components)
- Integration with new third-party tools (e.g. WhatsApp, Klaviyo, Yotpo)
- Fix bugs that affect site functionality
- Performance optimization
- Add a blog / news section
- Add multi-language support
- Add a customer portal feature

For these, ping me or hire a freelance Next.js + Medusa engineer (~₹50k-1L for typical scopes).

---

## 8. Future v1.1 self-serve upgrades (when you want them)

If editing marketing copy via GitHub web editor feels heavy, we can upgrade to:

1. **Full headless CMS** (Sanity or Payload) — visual editing, drag-drop, image library, no code touching at all. ~4-6 hours one-time setup. Free tiers exist.
2. **In-app DOODLE admin panel** — custom-build a `/admin/copy` route in the storefront where you can edit Hero text, FAQ, etc. via a web form. ~8-12 hours one-time.

Both are deferred. Today's MVP gives you 95% self-serve via Medusa Admin + GitHub web editor. The remaining 5% (marketing copy convenience) is the upgrade lane.

---

## 9. Emergency contacts + escalation

| Issue | Who to contact |
|---|---|
| Payment / refund disputes | Razorpay support: `support@razorpay.com` |
| Shipping / lost package | Shiprocket support: in-dashboard chat |
| Customer complaint about a product | You / co-founder |
| Site is down (DNS, hosting issue) | Vercel + Railway status pages first, then me |
| Database corruption / data loss | Neon support: in-dashboard chat. Restore from automated backup. |
| Suspected fraud | Razorpay risk team via dashboard |
| Legal / DPDP / GDPR request | Legal counsel; reference DPDP Act compliance |

---

## 10. Where to find the technical docs

If you ever need to learn how a piece works:
- Design spec: `docs/superpowers/specs/2026-05-20-doodle-commerce-design.md`
- Implementation plan: `docs/superpowers/plans/2026-05-20-doodle-commerce-v1.md`
- Brand spec: `docs/BRIEF.md` (if it still exists) + `~/Downloads/doodle/Doodle - Brand Guidleines.xlsx`
- Session state (most recent): `docs/SESSION-STATE.md`
- Build log: `docs/build-log.md`

You don't need to read these to operate the site. They're for debugging or onboarding a future developer.

---

**That's it.** Bookmark this file. The rest is muscle memory after the first few weeks of running the store.
