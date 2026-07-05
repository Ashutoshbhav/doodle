/* ============================================================
   DOODLE marketing copy — edit text here; layout lives in
   src/components/sections/. Safe to edit via GitHub web editor.

   Each export below holds the visible words for one homepage
   section. Change the text inside the quotes to update the site.
   Do not rename the keys or remove the quotes/commas.
   ============================================================ */

/* ---------------- HERO ---------------- */
export const hero = {
  // Top drop banner — no calendar dates here: a stale date reads as an
  // abandoned brand. Add a month back ONLY with a confirmed drop window.
  banner: {
    firstDrop: "First drop",
    tees: "200 tees",
    city: "Bangalore",
    byline: "Doodle by Canvas",
    liveWaitlist: "Live waitlist",
  },
  eyebrow: "India’s first modular kidswear",
  // Mega headline (rendered across multiple styled lines)
  headlineLine1: "Don’t Just",
  headlineLine2: "Dress.",
  headlineStamp: "Create.",
  // Sub-headline — the second clause is rendered in italic
  subLead: "Kids don’t outgrow clothes.",
  subEmphasis: "They outgrow characters.",
  body: "A t-shirt with velcro panels and a growing universe of patches your child swaps whenever they feel like it. One tee. Infinite personalities.",
  // Microproof row beneath the form — every number here must match the
  // live catalogue (tee ₹999, patch ₹100, sizes 3-4Y to 9-10Y).
  microproof: {
    baseColours: "6 colours",
    sizes: "Sizes 3–10 yrs",
    price: "Tee ₹999 · patches from ₹100",
  },
  // Right product stage
  tryIt: "build yours ↓",
  liveDemo: "Live demo",
  realProduct: "Tap to build",
  // Patch lanes strip — the six real collections in the catalogue, nothing
  // aspirational (no licensed-fandom lanes, ever).
  patchLanesEyebrow: "Patch lanes",
  seeAll: "See the library",
  patchLanes: [
    { label: "Originals", color: "bg-doodle-pink text-doodle-stitch" },
    { label: "Space", color: "bg-doodle-blue text-doodle-stitch" },
    { label: "Summer", color: "bg-doodle-yellow text-doodle-ink" },
    { label: "Gamer", color: "bg-doodle-red text-doodle-stitch" },
    { label: "Unicorns", color: "bg-doodle-purple text-doodle-stitch" },
    { label: "Cars", color: "bg-doodle-orange text-doodle-stitch" },
  ],
  keepScrolling: "keep scrolling",
} as const;

/* ---------------- THE REAL THING ---------------- */
export const theRealThing = {
  eyebrow: "Yes — it’s a real thing",
  // Headline rendered as: "Same eight patches. [Different] [base.]"
  headlineLead: "Same eight patches.",
  headlineEmphasis: "Different",
  headlineHighlight: "base.",
  body: "The base is the canvas. Patches do the talking. Press, peel, rearrange — same eight pieces, two completely different outfits in seconds.",
  swapVisualised: "Swap visualised",
  realProduct: "Real product",
  shots: [
    { label: "Cream base", chip: "Look 01" },
    { label: "Sky base", chip: "Look 02" },
  ],
  caption:
    "Photos: prototype DOODLE base tees with the first patch set — arrangement, attachment system and silicone finish exactly as they ship.",
} as const;

/* ---------------- PROMISE ---------------- */
export const promise = {
  eyebrow: "The DOODLE promise",
  // Headline rendered as: "Built for [play.] Built to [last.]"
  headlineLead: "Built for",
  headlineEmphasis: "play.",
  headlineMid: "Built to",
  headlineUnderline: "last.",
  body: "Three things we kept watching happen. Three things DOODLE answers.",
  moreOnThis: "More on this",
  pillars: [
    {
      color: "orange",
      title: "Patches change. Tee stays.",
      body: "Pink one Monday. Blue one Friday. Stars one week, lightning the next. The shirt is the constant. The character is the variable.",
    },
    {
      color: "blue",
      title: "One tee instead of five.",
      body: "Five character tees, half a wardrobe that stopped counting the moment the phase ended. We replaced all of that with one shirt and a small pile of patches.",
    },
    {
      color: "purple",
      title: "Outgrows phases, not the shirt.",
      body: "Pokémon phase: March. Iron Man phase: June. Dinosaurs by August. Same tee through all of it — the obsession changes, the tee doesn't have to.",
    },
  ],
} as const;

/* ---------------- HOW IT WORKS ---------------- */
export const howItWorks = {
  eyebrow: "How DOODLE works",
  // Headline rendered as: "Three moves between [boring] and [favourite outfit.]"
  headlineLead: "Three moves between",
  headlineEmphasis: "boring",
  headlineAnd: "and",
  headlineHighlight: "favourite outfit.",
  body: "No app, no subscription, no learning curve. Patches are tactile. Press, peel, swap.",
  steps: [
    {
      color: "blue",
      label: "Step 01",
      title: "Pick your base",
      body: "Start with a tee in one of six colours. The velcro panel is stitched in and ready to receive.",
    },
    {
      color: "yellow",
      label: "Step 02",
      title: "Choose your patches",
      body: "Browse the library — bears, rockets, unicorns, race cars. Build today’s mood.",
    },
    {
      color: "pink",
      label: "Step 03",
      title: "Wear, swap, repeat",
      body: "Snap patches on with the press-fix backing. Outfits change while the wardrobe stays the same.",
    },
  ],
} as const;

/* ---------------- PATCH WALL ---------------- */
export const patchWall = {
  eyebrow: "The patch library",
  // Headline rendered as: "[200+] patches. [Endless] looks."
  headlineCount: "200+",
  headlineMid: "patches.",
  headlineHighlight: "Endless",
  headlineEnd: "looks.",
  body: "Bears, rockets, unicorns, race cars — the catalogue grows every drop. Mix six on a tee and never repeat an outfit.",
  seeAll: "See the library",
  // Patch tiles — `name` is the label shown on hover
  patches: [
    { iconName: "Rocket", color: "orange", name: "Launchpad" },
    { iconName: "Heart", color: "pink", name: "First crush" },
    { iconName: "Lightning", color: "yellow", name: "Volt" },
    { iconName: "Star", color: "blue", name: "North star" },
    { iconName: "Sun", color: "orange", name: "Sundial" },
    { iconName: "Moon", color: "purple", name: "Moonbeam" },
    { iconName: "Cloud", color: "blue", name: "Daydream" },
    { iconName: "Smiley", color: "yellow", name: "Mood" },
    { iconName: "FlowerLotus", color: "pink", name: "Bloom" },
    { iconName: "MusicNote", color: "purple", name: "Loop" },
    { iconName: "Pizza", color: "red", name: "Slice" },
    { iconName: "IceCream", color: "pink", name: "Scoop" },
    { iconName: "Cat", color: "yellow", name: "Whiskers" },
    { iconName: "Dog", color: "orange", name: "Fetch" },
    { iconName: "Rainbow", color: "blue", name: "Arc" },
    { iconName: "Flame", color: "red", name: "Ember" },
    { iconName: "Crown", color: "purple", name: "Tiara" },
    { iconName: "Eye", color: "blue", name: "Watcher" },
    { iconName: "Cake", color: "pink", name: "Sweet 6" },
    { iconName: "Waves", color: "blue", name: "Tide" },
    { iconName: "Mountains", color: "purple", name: "Peak" },
    { iconName: "Compass", color: "orange", name: "Wayfinder" },
    { iconName: "Sparkle", color: "yellow", name: "Glint" },
    { iconName: "Confetti", color: "red", name: "Party trick" },
  ],
} as const;

/* ---------------- PATCH MATH ---------------- */
export const patchMath = {
  eyebrow: "Patch math",
  kicker: "the maths of the modular wardrobe",
  punchline: "one tee. five looks. a hundred Monday mornings.",
  stats: [
    { value: "200+", label: "patches" },
    { value: "2", label: "base colours", tone: "blue" },
    { value: "1", label: "tee", tone: "red" },
    { value: "5", label: "looks", tone: "purple" },
    { value: "∞", label: "outfits", tone: "pink" },
  ],
} as const;

/* ---------------- CHARACTER STRIP ---------------- */
export const characterStrip = {
  eyebrow: "The DOODLE crew",
  // Headline rendered as: "Five looks. [Same five] base pieces."
  headlineLead: "Five looks.",
  headlineEmphasis: "Same five",
  headlineEnd: "base pieces.",
  body: "Each kid below is wearing the same DOODLE base tee. The patches do the rest of the talking.",
  characters: [
    { name: "Aarav", age: 5, mood: "Sunshine mode" },
    { name: "Mira", age: 7, mood: "Mischief allowed" },
    { name: "Kabir", age: 4, mood: "Melting marker" },
    { name: "Zara", age: 6, mood: "Stars in eyes" },
    { name: "Ishaan", age: 8, mood: "First-day feels" },
  ],
} as const;

/* ---------------- WHY DOODLE ---------------- */
export const whyDoodle = {
  eyebrow: "Why DOODLE",
  // Headline rendered as: "Built different. [On purpose.]"
  headlineLead: "Built different.",
  headlineEmphasis: "On purpose.",
  body: "Four answers to the question every parent asks before they buy something new for their kid.",
  items: [
    {
      title: "Inclusive sizing for every kid",
      body: "Bases come in 2T to 12, with side-stretch panels that add real cm — not just a different label on the same body.",
    },
    {
      title: "Modular means less landfill",
      body: "Every patch is replaceable, every base is mendable, every component is its own SKU. We built the whole thing so a worn-out elbow doesn't become a worn-out outfit.",
    },
    {
      title: "Grows with the kid",
      body: "Sleeve-extender patches and hem-drop sections add 4–6 cm of usable life to the same base tee. One DOODLE piece outlives three fast-fashion ones.",
    },
    {
      title: "Made in India, with the people who make it",
      body: "Cut, sewn and finished in a Bengaluru workshop that pays living wages and shares its production calendar publicly.",
    },
  ],
} as const;

/* ---------------- EARLY VOICES ---------------- */
export const earlyVoices = {
  eyebrow: "Early voices",
  // Headline rendered as: "From the first [200] families & one [honest] teacher."
  headlineLead: "From the first",
  headlineCount: "200",
  headlineMid: "families & one",
  headlineHighlight: "honest",
  headlineEnd: "teacher.",
  badge: "Early-supporter quotes",
  voices: [
    {
      name: "[Sneha]",
      relation: "Mom of two · early DOODLE family",
      avatarColor: "yellow",
      quote:
        "Mira refuses to wear anything else. She picks her own patches every morning — it's the first time getting dressed isn't a fight.",
      rating: 5,
    },
    {
      name: "[Ravi]",
      relation: "Dad · backer #023",
      avatarColor: "blue",
      quote:
        "We bought one tee. Six months later it's still in rotation, just looking like a different shirt every week.",
      rating: 5,
    },
    {
      name: "[Anjali]",
      relation: "Pre-school teacher · advisor",
      avatarColor: "pink",
      quote:
        "It teaches kids that 'design' is a verb. Three of mine now ask if they can 'design' their breakfast plate.",
      rating: 5,
    },
  ],
} as const;

/* ---------------- FOUNDERS ---------------- */
// Real people only. Bios stay empty until each founder writes their own
// line — an empty bio renders cleaner than an invented one.
export const founders = {
  eyebrow: "The makers",
  // Headline rendered as: "Five people, [one] idea, a [stubborn] belief."
  headlineLead: "Five people,",
  headlineEmphasis: "one",
  headlineMid: "idea, a",
  headlineHighlight: "stubborn",
  headlineEnd: "belief.",
  body: "Five MBA classmates from Scaler School of Business, building DOODLE out of Bangalore. We answer every email ourselves.",
  petPatchLabel: "Pet patch",
  people: [
    {
      name: "Ronit Dadra",
      role: "Co-founder",
      bio: "",
      favPatchLabel: "Stella the Star",
    },
    {
      name: "Lakshay Vashist",
      role: "Co-founder",
      bio: "",
      favPatchLabel: "Bruno the Bear",
    },
    {
      name: "Ashutosh Bhavale",
      role: "Co-founder",
      bio: "",
      favPatchLabel: "Romy the Rainbow",
    },
    {
      name: "Rohit Prasad",
      role: "Co-founder",
      bio: "",
      favPatchLabel: "Pim the Penguin",
    },
    {
      name: "Aditya Geda",
      role: "Co-founder",
      bio: "",
      favPatchLabel: "Otto the Octopus",
    },
  ],
} as const;

/* ---------------- FIND US OFFLINE ---------------- */
export const findUsOffline = {
  eyebrow: "In person, before online",
  // Headline rendered as: "Touch the patches. [Then] decide."
  headlineLead: "Touch the patches.",
  headlineEmphasis: "Then",
  headlineEnd: "decide.",
  body: "We’re going offline first because patches are tactile. Three pop-ups across Bengaluru, Mumbai and Delhi before the online drop.",
  alertsCta: "Get pop-up alerts",
  popups: [
    {
      city: "[Bengaluru]",
      venue: "[Indiranagar pop-up · 100ft Road]",
      date: "[Sat 10 Jan 2026]",
      window: "11:00 — 19:00",
      color: "orange",
      badge: "First drop",
    },
    {
      city: "[Mumbai]",
      venue: "[Bandra weekend market · Carter Road]",
      date: "[Sat–Sun 24-25 Jan 2026]",
      window: "10:00 — 20:00",
      color: "blue",
      badge: "Two days",
    },
    {
      city: "[New Delhi]",
      venue: "[Hauz Khas village · Boutique Block 3]",
      date: "[Sat 7 Feb 2026]",
      window: "12:00 — 20:00",
      color: "pink",
      badge: "RSVP only",
    },
  ],
} as const;

/* ---------------- DUAL CTA ---------------- */
export const dualCTA = {
  consumer: {
    badge: "Be first",
    // Headline rendered as: "First drop alerts. [One email, when it's ready.]"
    headlineLead: "First drop alerts.",
    headlineEmphasis: "One email, when it’s ready.",
    body: "We’ll write once: when the first 200 base tees ship and the first patch library is live. No drip campaign. No noise.",
  },
  stockist: {
    badge: "For stockists",
    badgeNote: "B2B inquiry",
    // Headline rendered as: "Stock DOODLE in your store. [We'll bring the patches.]"
    headlineLead: "Stock DOODLE in your store.",
    headlineEmphasis: "We’ll bring the patches.",
    body: "Looking for boutique kids’ stores, design schools and play-cafes across India. Wholesale terms, sample kits, and consignment options available.",
    ctaLabel: "Send a stockist note",
    emailNote: "hello@doodlebycanvas.in",
  },
} as const;

/* ---------------- FOOTER ---------------- */
export const footer = {
  tagline:
    "Modular kids’ clothing with patches that swap, mix and remix. Designed in India. Made for the way kids actually play.",
  // Every link below must resolve. No "#" placeholders, no pages that don't
  // exist yet — a dead FAQ link advertises the gap. Add links back only
  // when their destination ships.
  columns: [
    {
      title: "Explore",
      links: [
        { href: "/#shop", label: "Build your tee" },
        { href: "/#how", label: "How it works" },
        { href: "/#wall", label: "Patch library" },
        { href: "/#packs", label: "Patch packs" },
      ],
    },
    {
      title: "Help",
      links: [
        { href: "/size-guide", label: "Size guide" },
        { href: "/faq", label: "FAQs" },
        { href: "/refunds", label: "Returns & refunds" },
        { href: "/shipping", label: "Shipping" },
        { href: "/contact", label: "Contact" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/#founders", label: "The makers" },
        { href: "/#join", label: "Stockists" },
        { href: "/privacy", label: "Privacy" },
      ],
    },
  ],
  // Socials: email only until the real Instagram/YouTube handles exist.
  // Never link a "#" icon, and never TikTok (banned in India since 2020).
  socials: [
    { href: "mailto:hello@doodlebycanvas.in", label: "Email", iconName: "EnvelopeSimple" },
  ],
  brandName: "DOODLE",
  brandBy: "by",
  brandParent: "CANVAS",
  madeInIndia: "Made in India",
  // Bottom-bar legal links (label + destination)
  legalLinks: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
} as const;
