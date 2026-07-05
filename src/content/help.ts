/* ============================================================
   DOODLE help content — size guide + FAQ. Same rule as home.ts:
   copy lives here, layout lives in the routes.

   EVERY number in this file comes from the signed production
   spec sheet (Children_Tshirt_Spec_Sheet.docx, signed 27-04-2026)
   or the live catalogue. Never add a measurement that isn't on a
   signed spec — "measurements on request" beats an invented cm.
   ============================================================ */

/* ---------------- SIZE GUIDE ---------------- */

export type SizeRow = {
  size: string;
  age: string;
  /** All in cm, from the signed spec sheet. Null = not yet specced. */
  garmentChest: number | null;
  length: number | null;
  shoulder: number | null;
  sleeve: number | null;
};

export const sizeChart: SizeRow[] = [
  { size: "S", age: "3–4 yrs", garmentChest: 64, length: 40, shoulder: 26, sleeve: 12 },
  { size: "M", age: "4–5 yrs", garmentChest: 68, length: 44, shoulder: 28, sleeve: 13 },
  { size: "L", age: "5–6 yrs", garmentChest: 72, length: 48, shoulder: 30, sleeve: 14.5 },
];

/* Sold in the shop but not on the signed spec sheet yet — shown with an
   honest "write to us" row instead of invented numbers. */
export const unSpeccedSizes = [
  { size: "XL", age: "7–8 yrs" },
  { size: "XXL", age: "9–10 yrs" },
];

export const sizeGuide = {
  eyebrow: "Size guide",
  title: "Find the right size",
  intro:
    "DOODLE tees are cut regular-to-relaxed with a built-in growth buffer of 10–12 cm on the chest, so the same tee fits through a growth spurt. All measurements are of the garment laid flat, in centimetres, with a tolerance of ±1 cm.",
  howToMeasure: {
    heading: "How to measure",
    steps: [
      "Take a tee that fits your child well and lay it flat.",
      "Chest: measure across from armpit to armpit, then double it.",
      "Length: measure from the highest point of the shoulder down to the hem.",
      "Compare with the table — if the numbers land between two sizes, take the bigger one.",
    ],
  },
  betweenSizes:
    "Between sizes, or want it to last longer? Size up. The velcro panel sits the same on every size, so patches work identically.",
  fabricNote:
    "100% combed cotton, 200–220 GSM, pre-shrunk pattern (3–5% shrinkage margin is built in, so it won't suddenly get smaller after the first wash).",
  requestNote:
    "Need the exact measurements for 7–8 yrs or 9–10 yrs? Write to hello@doodlebycanvas.in and we'll send them over.",
} as const;

/* ---------------- FAQ ---------------- */

export type FaqItem = { q: string; a: string };
export type FaqGroup = { heading: string; items: FaqItem[] };

export const faq = {
  eyebrow: "Questions, answered",
  title: "Everything parents ask us",
  intro:
    "The honest answers, before you ask. Anything missing? Write to hello@doodlebycanvas.in — a founder replies, not a bot.",
  groups: [
    {
      heading: "The product",
      items: [
        {
          q: "How do the patches actually work?",
          a: "Every DOODLE tee has a soft velcro panel stitched onto the chest. The soft (loop) side lives on the tee; the scratchy (hook) side is on the back of each patch. Your child presses a patch on, peels it off, and swaps it for another — no buttons, no pins, no tools.",
        },
        {
          q: "Is the velcro scratchy against my kid's skin?",
          a: "No. The side that's stitched to the tee is the soft loop side — it feels like brushed fabric. The scratchy hook side is only on the back of the patches, facing away from the body. Inside, the tee is plain 100% combed cotton.",
        },
        {
          q: "What are the patches made of?",
          a: "Two collections: soft 3D silicone charms (our signature) and stitched embroidered patches. Both are original DOODLE characters — you won't find licensed cartoon characters here, and that's deliberate.",
        },
        {
          q: "What sizes do you make?",
          a: "S (3–4 yrs), M (4–5 yrs) and L (5–6 yrs) are on the current production spec, with 7–8 yrs and 9–10 yrs in the catalogue. The fit is regular-to-relaxed with a 10–12 cm growth buffer, so a tee lasts through a growth spurt. Full measurements are on the size guide page.",
        },
      ],
    },
    {
      heading: "Safety",
      items: [
        {
          q: "Are the patches safe for small kids?",
          a: "Patches are 1.5–2 inches — small enough to swap, big enough to be hard to swallow. That said, they're detachable parts: DOODLE is designed for ages 3 and up, and for kids at the younger end we recommend swapping patches together with your child (they love the ritual anyway).",
        },
        {
          q: "What's the tee made of?",
          a: "100% combed cotton at 200–220 GSM — thicker and softer than a typical printed tee. No polyester blend, no plastisol print sitting on the fabric.",
        },
      ],
    },
    {
      heading: "Washing and care",
      items: [
        {
          q: "Do the patches survive the washing machine?",
          a: "Take the patches off before washing — it takes five seconds and they'll last far longer. The velcro panel itself is stitched with outline stitching that we wash-test at sampling before any production run. Machine wash the tee cold, tumble dry low.",
        },
        {
          q: "How do I clean the patches?",
          a: "Silicone charms: wipe with a damp cloth. Embroidered patches: hand wash and air dry.",
        },
      ],
    },
    {
      heading: "Patches and packs",
      items: [
        {
          q: "What if we lose a patch?",
          a: "It happens — they travel. Single silicone patches are ₹100, so a lost character is a small drama, not a wardrobe crisis. Themed 6-packs are ₹799 when you want a whole new crew at once.",
        },
        {
          q: "Do new patches come out?",
          a: "Yes — the library grows every drop. The tee is the platform; new characters keep it interesting. Join the waitlist and you'll hear about each drop first.",
        },
      ],
    },
    {
      heading: "Orders, shipping and exchanges",
      items: [
        {
          q: "When can I actually buy?",
          a: "The first drop is 200 tees, starting in Bangalore. Online ordering opens right after — the waitlist gets the email first, so if you're on it, you're in line.",
        },
        {
          q: "Do you do cash on delivery?",
          a: "Yes, COD is available. Shipping is free on orders over ₹999.",
        },
        {
          q: "What if the size is wrong?",
          a: "7-day exchange, no drama. Full details are on the returns and refunds page.",
        },
      ],
    },
  ] as FaqGroup[],
} as const;
