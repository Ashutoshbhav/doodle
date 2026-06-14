/* ============================================================
   DOODLE legal copy — edit text here; a lawyer must review
   before launch.

   Each export below holds the visible words for one legal /
   policy page. Layout lives in src/app/<route>/page.tsx.
   Aligned to India's DPDP Act 2023 + Consumer Protection
   (E-Commerce) Rules 2020. Anything we don't yet know is left
   as a clearly-marked [PLACEHOLDER: ...] for Ash to fill in.

   Change the text inside the quotes to update a page. Do not
   rename the keys or remove the quotes/commas.

   A "section" is { heading, paragraphs?, bullets? } and renders
   in order. Pages share that shape so the layout component can
   stay generic.
   ============================================================ */

/* ---- shared facts (known, safe to use) ---- */
export const legalCommon = {
  brandName: "DOODLE",
  brandBy: "by",
  brandParent: "CANVAS",
  domain: "doodlebycanvas.in",
  supportEmail: "hello@doodlebycanvas.in",
  replyInbox: "doodlebycanvas@gmail.com",
  city: "Bengaluru",
  // Shown at the top of every policy page.
  draftNotice:
    "This policy is a draft and must be reviewed by a lawyer before launch.",
  effectiveDateLabel: "Effective date",
  effectiveDate: "[PLACEHOLDER: effective date]",
  lastUpdatedLabel: "Last updated",
  lastUpdated: "[PLACEHOLDER: effective date]",
} as const;

/* A single content block on a policy page. */
export type LegalSection = {
  heading: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
};

/* ---------------- PRIVACY POLICY ---------------- */
export const privacy = {
  eyebrow: "Legal",
  title: "Privacy Policy",
  intro:
    "This Privacy Policy explains what personal data DOODLE (by CANVAS) collects when you visit doodlebycanvas.in or place an order, why we collect it, who we share it with, and the rights you have under India's Digital Personal Data Protection Act, 2023 (the “DPDP Act”). By using our website you agree to the practices described here.",
  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        "DOODLE is a children's clothing brand operated by CANVAS, based in Bengaluru, India. For the purposes of the DPDP Act, the business is the “Data Fiduciary” that decides how and why your personal data is processed.",
        "Registered legal entity: [PLACEHOLDER: registered legal entity name]. Registered business address: [PLACEHOLDER: registered business address]. GSTIN: [PLACEHOLDER: GSTIN — N/A until registered].",
      ],
    },
    {
      heading: "What data we collect",
      paragraphs: [
        "We collect only the data we need to run the shop and fulfil your orders:",
      ],
      bullets: [
        "Identity & contact data — your name, email address and phone number.",
        "Order & delivery data — your shipping address, billing details, order history and delivery status.",
        "Payment data — handled directly by our payment processor, Razorpay. We do not see or store your full card, UPI or bank credentials.",
        "Technical & usage data — basic analytics and cookie data (such as pages viewed and device/browser type) used to keep the site working and improve it.",
      ],
    },
    {
      heading: "Why we collect it",
      paragraphs: [
        "We use your personal data to take and fulfil orders, process payments and refunds, arrange shipping and returns, provide customer support, send transactional messages about your order, prevent fraud, and meet our legal and tax obligations. With your consent, we may also send you occasional updates about new drops — you can opt out at any time.",
      ],
    },
    {
      heading: "Where your data is stored",
      paragraphs: [
        "We use trusted third-party service providers (“Data Processors”) to run the store. Your data may be stored or processed by them:",
      ],
      bullets: [
        "Neon (Postgres database) — stores marketing and account-related records.",
        "Medusa, hosted on Railway — runs our commerce backend (orders, carts, customers).",
        "Razorpay — processes payments.",
        "Resend — sends transactional and account emails.",
        "Vercel — hosts and serves the website.",
      ],
    },
    {
      heading: "Cookies and analytics",
      paragraphs: [
        "We use cookies and similar technologies to keep your cart and session working and to understand how the site is used. You can control or block cookies through your browser settings; some features may not work correctly if you disable them.",
      ],
    },
    {
      heading: "Your rights under the DPDP Act",
      paragraphs: [
        "As a Data Principal under the DPDP Act, you have the right to:",
      ],
      bullets: [
        "Access — ask for a summary of the personal data we hold about you.",
        "Correction — ask us to correct inaccurate or incomplete data.",
        "Erasure — ask us to delete your personal data where we are no longer required to keep it.",
        "Withdraw consent — withdraw any consent you previously gave, as easily as you gave it.",
        "Grievance redressal — raise a complaint with our Grievance Officer (see below).",
      ],
      // Separate paragraph after bullets handled in layout via the next section.
    },
    {
      heading: "How to exercise your rights",
      paragraphs: [
        "To exercise any of these rights, email us at hello@doodlebycanvas.in. We will respond to verified requests within 7 days.",
      ],
    },
    {
      heading: "Children's data",
      paragraphs: [
        "DOODLE makes products for children, but our store is intended to be used by parents and guardians, not by children directly. We do not knowingly sell to or collect personal data directly from children. We do not run behavioural tracking or targeted advertising directed at anyone under 18.",
      ],
    },
    {
      heading: "Data retention",
      paragraphs: [
        "We keep your personal data only for as long as needed to fulfil orders, provide support, and meet legal, accounting and tax requirements, after which it is deleted or anonymised.",
      ],
    },
    {
      heading: "Grievance Officer",
      paragraphs: [
        "In line with the DPDP Act and the Consumer Protection (E-Commerce) Rules, 2020, you may contact our Grievance Officer for any data or consumer complaint. Full contact details are on our Contact page.",
        "Grievance Officer: [PLACEHOLDER: Grievance Officer name]. Email: hello@doodlebycanvas.in. Phone: [PLACEHOLDER: grievance contact phone].",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. The latest version will always be available on this page with its effective date.",
      ],
    },
  ] satisfies readonly LegalSection[],
} as const;

/* ---------------- TERMS & CONDITIONS ---------------- */
export const terms = {
  eyebrow: "Legal",
  title: "Terms & Conditions",
  intro:
    "These Terms & Conditions govern your use of doodlebycanvas.in and any purchase you make from DOODLE (by CANVAS). By accessing the site or placing an order, you agree to these terms. Please read them carefully.",
  sections: [
    {
      heading: "Eligibility",
      paragraphs: [
        "You must be at least 18 years old and capable of entering into a legally binding contract under Indian law to place an order. By ordering, you confirm that the information you provide is accurate and that you are authorised to use the payment method chosen.",
      ],
    },
    {
      heading: "Orders and acceptance",
      paragraphs: [
        "Placing an order is an offer to buy. Your order is accepted only when we confirm dispatch. We may decline or cancel an order — for example, if an item is out of stock, if there is a pricing or description error, or if we suspect fraud. If we cancel a paid order, you receive a full refund.",
      ],
    },
    {
      heading: "Pricing and payment",
      paragraphs: [
        "All prices are listed in Indian Rupees (INR / ₹) and, unless stated otherwise, are inclusive of applicable taxes. Payments are processed securely by Razorpay. We do not charge consumers any unilateral cancellation fee for cancelling an order before dispatch.",
      ],
    },
    {
      heading: "Product information",
      paragraphs: [
        "We try to describe and picture our products as accurately as possible. Colours may vary slightly between screens and the actual product. Patch designs and availability may change between drops.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        "All content on this site — including the DOODLE and CANVAS names, logos, patch designs, artwork, text, and images — is owned by us or our licensors and is protected by Indian and international intellectual property laws. You may not copy, reproduce, or use it without our written permission.",
      ],
    },
    {
      heading: "Acceptable use",
      paragraphs: [
        "You agree not to misuse the site, attempt to gain unauthorised access, interfere with its operation, or use it for any unlawful purpose.",
      ],
    },
    {
      heading: "Limitation of liability",
      paragraphs: [
        "To the maximum extent permitted by law, DOODLE (by CANVAS) is not liable for any indirect, incidental, or consequential loss arising from your use of the site or our products. Nothing in these terms limits your statutory rights as a consumer under the Consumer Protection Act, 2019.",
      ],
    },
    {
      heading: "Returns and refunds",
      paragraphs: [
        "Returns, refunds and shipping are governed by our Return & Refund Policy and Shipping Policy, which form part of these Terms.",
      ],
    },
    {
      heading: "Governing law and jurisdiction",
      paragraphs: [
        "These Terms are governed by the laws of India. Subject to applicable consumer-protection law, the courts at Bengaluru, Karnataka shall have jurisdiction over any dispute arising from these Terms.",
      ],
    },
    {
      heading: "Changes to these terms",
      paragraphs: [
        "We may update these Terms from time to time. The current version will always be available on this page with its effective date. Continued use of the site after changes means you accept the updated Terms.",
      ],
    },
  ] satisfies readonly LegalSection[],
} as const;

/* ---------------- RETURN & REFUND POLICY ---------------- */
export const refunds = {
  eyebrow: "Legal",
  title: "Return & Refund Policy",
  intro:
    "We want you and your kids to love what you order. If something isn't right, here is how returns and refunds work at DOODLE (by CANVAS).",
  sections: [
    {
      heading: "Return window",
      paragraphs: [
        "You can request a return within 7 days of delivery. To start a return, email hello@doodlebycanvas.in with your order number and the reason.",
      ],
    },
    {
      heading: "Condition of returned items",
      paragraphs: [
        "Items must be unworn, unwashed, and in their original condition with all tags, patches and packaging intact. For hygiene reasons we cannot accept items that have been used, altered or damaged after delivery, unless the item arrived defective or incorrect.",
      ],
    },
    {
      heading: "Reverse pickup",
      paragraphs: [
        "Where serviceable, we arrange a reverse pickup through our courier partner. If your location is not serviceable for pickup, we may ask you to self-ship the item to a return address we provide.",
      ],
    },
    {
      heading: "Who pays for return shipping",
      bullets: [
        "If the item is defective, damaged, or we sent the wrong item — we cover return shipping in full.",
        "If you are returning for any other reason (such as a change of mind), a return shipping fee may apply and will be communicated before pickup.",
      ],
    },
    {
      heading: "Refund method and timeline",
      paragraphs: [
        "Once we receive and inspect the returned item, we approve your refund. Approved refunds are issued to your original payment method via Razorpay. Refunds are typically processed within 7 business days of approval; your bank or card provider may take additional time to reflect the credit.",
        "For Cash on Delivery (COD) orders, refunds are issued to a bank account or UPI ID you provide, since there is no original online payment to reverse.",
      ],
    },
    {
      heading: "Exchanges",
      paragraphs: [
        "Need a different size or patch set? Email us and we'll help with an exchange, subject to availability.",
      ],
    },
    {
      heading: "Non-returnable items",
      paragraphs: [
        "Certain items — such as clearly marked final-sale products — may not be eligible for return. Any such exclusions will be shown on the product page.",
      ],
    },
    {
      heading: "Questions",
      paragraphs: [
        "For anything return- or refund-related, email hello@doodlebycanvas.in and we'll sort it out.",
      ],
    },
  ] satisfies readonly LegalSection[],
} as const;

/* ---------------- SHIPPING POLICY ---------------- */
export const shipping = {
  eyebrow: "Legal",
  title: "Shipping Policy",
  intro:
    "Here's how DOODLE (by CANVAS) gets your order to you — dispatch times, delivery estimates, charges and serviceability.",
  sections: [
    {
      heading: "Order processing and dispatch",
      paragraphs: [
        "Orders are typically processed and dispatched within 2–4 business days. You'll receive a confirmation with tracking details once your order ships.",
      ],
    },
    {
      heading: "Delivery estimates",
      paragraphs: [
        "Once dispatched, deliveries usually arrive within 4–8 business days, depending on your location. Metro cities are generally faster than remote or non-metro pin codes. These are estimates, not guarantees, and may be affected by courier delays, weather, or public holidays.",
      ],
    },
    {
      heading: "Shipping charges",
      bullets: [
        "Free standard shipping on all orders above ₹999.",
        "For orders below ₹999, a flat shipping fee is shown at checkout before you pay.",
      ],
    },
    {
      heading: "Cash on Delivery (COD)",
      paragraphs: [
        "COD is available on eligible orders and serviceable pin codes. Availability is shown at checkout. A small COD handling fee may apply and will be displayed before you confirm.",
      ],
    },
    {
      heading: "Serviceability",
      paragraphs: [
        "We ship across India to serviceable pin codes. If your area is not currently serviceable, you'll see a note at checkout. International shipping is not available at this time.",
      ],
    },
    {
      heading: "Tracking and issues",
      paragraphs: [
        "If your tracking hasn't updated, your order is delayed, or a package arrives damaged, email hello@doodlebycanvas.in with your order number and we'll help.",
      ],
    },
  ] satisfies readonly LegalSection[],
} as const;

/* ---------------- CONTACT + GRIEVANCE OFFICER ---------------- */
export const contact = {
  eyebrow: "Get in touch",
  title: "Contact us",
  intro:
    "Questions about an order, a return, our patches, or anything else? We answer every message ourselves.",
  channels: {
    heading: "How to reach us",
    items: [
      {
        label: "Support email",
        value: "hello@doodlebycanvas.in",
        note: "Best for orders, returns and product questions.",
      },
      {
        label: "Reply inbox",
        value: "doodlebycanvas@gmail.com",
        note: "Where our replies come from — add it to your contacts.",
      },
    ],
  },
  grievance: {
    heading: "Grievance Officer",
    note: "In accordance with the Consumer Protection (E-Commerce) Rules, 2020 and the Digital Personal Data Protection Act, 2023, the details of our Grievance Officer (resident in India) are below. We acknowledge complaints within 48 hours and aim to resolve them within the timelines required by law.",
    rows: [
      { label: "Name", value: "[PLACEHOLDER: Grievance Officer name]" },
      { label: "Designation", value: "Grievance Officer" },
      { label: "Email", value: "hello@doodlebycanvas.in" },
      { label: "Phone", value: "[PLACEHOLDER: grievance contact phone]" },
      {
        label: "Address",
        value: "[PLACEHOLDER: registered business address], Bengaluru, India",
      },
    ],
  },
  entity: {
    heading: "Business details",
    rows: [
      { label: "Brand", value: "DOODLE (by CANVAS)" },
      { label: "Legal entity", value: "[PLACEHOLDER: registered legal entity name]" },
      { label: "GSTIN", value: "[PLACEHOLDER: GSTIN — N/A until registered]" },
      { label: "City", value: "Bengaluru, India" },
    ],
  },
} as const;
