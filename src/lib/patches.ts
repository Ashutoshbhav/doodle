/* ============================================================
   DOODLE patch registry — the 10 real, original, IP-clean
   silicone-charm patches from the 2026 catalogue.

   These are the ONLY patches that ship. No licensed characters
   (no Hello Kitty / Donald / Deadpool / etc.) — every entry here
   is an original DOODLE design. Source images live in
   /public/patches/<key>.png (transparent, web-sized).
   ============================================================ */

export type Patch = {
  key: string;
  name: string;
  /** One-line personality bio, Squishmallows-style (shown on the tag/hover). */
  bio: string;
  src: string;
};

export const PATCHES: Patch[] = [
  { key: "rainbow", name: "Romy the Rainbow", bio: "comes out after the cry", src: "/patches/rainbow.png" },
  { key: "star", name: "Stella the Star", bio: "naps in a nightcap", src: "/patches/star.png" },
  { key: "crown", name: "Kingsley the Crown", bio: "rules the playground", src: "/patches/crown.png" },
  { key: "bear-brown", name: "Bruno the Bear", bio: "first to the hug", src: "/patches/bear-brown.png" },
  { key: "bear-olive", name: "Theo the Teddy", bio: "softest in the bunch", src: "/patches/bear-olive.png" },
  { key: "elephant", name: "Ellie the Elephant", bio: "never forgets snack time", src: "/patches/elephant.png" },
  { key: "penguin", name: "Pim the Penguin", bio: "cool, never cold", src: "/patches/penguin.png" },
  { key: "puppy", name: "Pip the Puppy", bio: "best friend, on demand", src: "/patches/puppy.png" },
  { key: "koala", name: "Coco the Koala", bio: "champion tree-napper", src: "/patches/koala.png" },
  { key: "octopus", name: "Otto the Octopus", bio: "eight arms, all hugs", src: "/patches/octopus.png" },
];

/* ------------------------------------------------------------
   Embroidered collection — stitched iron-on patches (a second,
   separate line from the silicone charms). All original/generic
   designs, AI-upscaled. Grouped by theme.
   ------------------------------------------------------------ */
export const EMBROIDERED_PATCHES: Patch[] = [
  // Space
  { key: "cosmo-frog", name: "Finn the Frog", bio: "first frog on Mars", src: "/patches-embroidered/cosmo-frog.png" },
  { key: "spaced-out", name: "Nova the Cat", bio: "took the UFO for snacks", src: "/patches-embroidered/spaced-out.png" },
  { key: "major-meow", name: "Tom the Astrocat", bio: "always over the moon", src: "/patches-embroidered/major-meow.png" },
  { key: "space-jam", name: "Jimi the Rockcat", bio: "riffs in zero-g", src: "/patches-embroidered/space-jam.png" },
  { key: "rocket-pup", name: "Rocky the Rocket Pup", bio: "counts down to zoomies", src: "/patches-embroidered/rocket-pup.png" },
  { key: "cosmo-koala", name: "Saturn the Koala", bio: "naps with rings on", src: "/patches-embroidered/cosmo-koala.png" },
  // Summer
  { key: "skater-koala", name: "Kai the Skater", bio: "kickflips past bedtime", src: "/patches-embroidered/skater-koala.png" },
  { key: "beach-crab", name: "Cami the Crab", bio: "beach days only", src: "/patches-embroidered/beach-crab.png" },
  { key: "pool-party", name: "Gigi the Giraffe", bio: "tallest at the pool party", src: "/patches-embroidered/pool-party.png" },
  { key: "surfs-up", name: "Surge the Surf Croc", bio: "catches every wave", src: "/patches-embroidered/surfs-up.png" },
  { key: "chill-bunny", name: "Benny the Bunny", bio: "sips and chills", src: "/patches-embroidered/chill-bunny.png" },
  { key: "snorkel-fox", name: "Reef the Fox", bio: "first one in the water", src: "/patches-embroidered/snorkel-fox.png" },
  // Gamer
  { key: "game-on", name: "Ace the Gamepad", bio: "never drops a combo", src: "/patches-embroidered/game-on.png" },
  { key: "sir-brave", name: "Sir Leo the Knight", bio: "brave till bedtime", src: "/patches-embroidered/sir-brave.png" },
  { key: "catnap", name: "Cleo the Catnap", bio: "asleep before the story ends", src: "/patches-embroidered/catnap.png" },
  { key: "sneaky-ninja", name: "Nico the Ninja", bio: "vanishes at chore time", src: "/patches-embroidered/sneaky-ninja.png" },
  { key: "dj-whiskers", name: "Remy the DJ", bio: "drops the beat, then a nap", src: "/patches-embroidered/dj-whiskers.png" },
  // Unicorns
  { key: "groovy-unicorn", name: "Juno the Unicorn", bio: "headphones never off", src: "/patches-embroidered/groovy-unicorn.png" },
  { key: "magic-pop", name: "Pixie the Unicorn", bio: "100% magic", src: "/patches-embroidered/magic-pop.png" },
  { key: "lovecorn", name: "Lola the Unicorn", bio: "all heart", src: "/patches-embroidered/lovecorn.png" },
  { key: "rainbow-mane", name: "Iris the Unicorn", bio: "mane of every colour", src: "/patches-embroidered/rainbow-mane.png" },
  { key: "blaze-mane", name: "Blaze the Unicorn", bio: "too hot to handle", src: "/patches-embroidered/blaze-mane.png" },
  { key: "sleepy-unicorn", name: "Nia the Unicorn", bio: "dreams in colour", src: "/patches-embroidered/sleepy-unicorn.png" },
  // Cars
  { key: "lil-roadster", name: "Ruby the Roadster", bio: "zero to zoomies", src: "/patches-embroidered/lil-roadster.png" },
  { key: "rally-racer", name: "Dash the Racer", bio: "always in fifth gear", src: "/patches-embroidered/rally-racer.png" },
  { key: "trail-boss", name: "Bronco the Jeep", bio: "mud is the point", src: "/patches-embroidered/trail-boss.png" },
  { key: "midnight-cruiser", name: "Shadow the Cruiser", bio: "rolls in at midnight", src: "/patches-embroidered/midnight-cruiser.png" },
  { key: "hot-rod", name: "Flynn the Hot Rod", bio: "two flames, one speed", src: "/patches-embroidered/hot-rod.png" },
  { key: "speedy", name: "Zippy the Speedster", bio: "gone before you blink", src: "/patches-embroidered/speedy.png" },
];

/* ------------------------------------------------------------
   Tee colourways — the 6 catalogue base colours (upscaled images).
   `swatch` is the dot shown in the colour picker.
   ------------------------------------------------------------ */
// `panel` = the velcro receiving area of that tee, as a rectangle in % of the
// square stage. Measured per image because the catalogue mockups differ a lot
// (coral is a thin band, purple is a big tall panel). Patches scatter INSIDE it.
export type TeePanel = { x0: number; x1: number; y0: number; y1: number };
export type Tee = { key: string; name: string; src: string; swatch: string; panel: TeePanel };

export const TEES: Tee[] = [
  { key: "pink", name: "Bubblegum Pink", src: "/product/tee-pink.png", swatch: "#F4A7B9", panel: { x0: 26, x1: 74, y0: 28, y1: 40 } },
  { key: "sky", name: "Powder Blue", src: "/product/tee-sky.png", swatch: "#A8D8EA", panel: { x0: 31, x1: 69, y0: 34, y1: 45 } },
  { key: "coral", name: "Coral", src: "/product/tee-coral.png", swatch: "#E8836B", panel: { x0: 27, x1: 73, y0: 28, y1: 38 } },
  { key: "purple", name: "Lavender", src: "/product/tee-purple.png", swatch: "#B79CE8", panel: { x0: 23, x1: 77, y0: 24, y1: 38 } },
  { key: "yellow", name: "Mustard", src: "/product/tee-yellow.png", swatch: "#E6B800", panel: { x0: 31, x1: 71, y0: 33, y1: 45 } },
  { key: "charcoal", name: "Charcoal", src: "/product/tee-charcoal.png", swatch: "#3A3A3A", panel: { x0: 24, x1: 76, y0: 27, y1: 35 } },
];

/* Seeded RNG so each colour gets its own stable scatter (positions change as
   you switch colours = the ever-changing look) without overlap. */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* Scatter `n` patches INSIDE the panel rectangle: a grid sized to the panel's
   aspect (so big panels get bigger patches, multiple rows), each patch jittered
   within its own cell so they never overlap, and the whole arrangement keyed to
   `seed` (the tee colour) so it re-shuffles per colour. */
export type Slot = { x: number; y: number; size: number; rot: number };
export function velcroSlots(n: number, panel: TeePanel, seed: string): Slot[] {
  if (n <= 0) return [];
  // Inset the panel so patches sit clearly INSIDE the velcro area, never on or
  // past the edge. Placement happens entirely within this inner box.
  const padX = (panel.x1 - panel.x0) * 0.07;
  const padY = (panel.y1 - panel.y0) * 0.12;
  const ix0 = panel.x0 + padX;
  const iy0 = panel.y0 + padY;
  const W = panel.x1 - panel.x0 - 2 * padX;
  const H = panel.y1 - panel.y0 - 2 * padY;

  const rows = Math.max(1, Math.min(n, Math.round(Math.sqrt((n * H) / W))));
  const cols = Math.ceil(n / rows);
  const cellW = W / cols;
  const cellH = H / rows;
  // Fit within a cell in BOTH dimensions, so a patch can never exceed the panel
  // (vertically or horizontally). < cell width ⇒ never overlaps either.
  const size = Math.max(3.5, Math.min(cellW, cellH) * 0.82);
  const rand = makeRng(hashStr(seed) + n * 7919);

  const out: Slot[] = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / cols);
    const itemsInRow = r === rows - 1 ? n - cols * (rows - 1) : cols;
    const c = i - r * cols;
    const rowStart = ix0 + (W - itemsInRow * cellW) / 2; // centre the row
    const cx = rowStart + cellW * (c + 0.5);
    const cy = iy0 + cellH * (r + 0.5);
    // jitter strictly bounded by the leftover room in the cell ⇒ the patch
    // always stays fully within its cell, and therefore within the panel.
    const jx = (rand() - 0.5) * Math.max(0, cellW - size) * 0.5;
    const jy = (rand() - 0.5) * Math.max(0, cellH - size) * 0.5;
    out.push({ x: cx + jx, y: cy + jy, size, rot: (rand() - 0.5) * 8 });
  }
  return out;
}

/* Live counts — derived, never hand-typed, so marketing copy can't drift
   from reality (the no-assumptions rule). */
export const PATCH_COUNT = PATCHES.length + EMBROIDERED_PATCHES.length;
export const TEE_COUNT = TEES.length;

export const patchByKey = (key: string): Patch =>
  [...PATCHES, ...EMBROIDERED_PATCHES].find((p) => p.key === key) ?? PATCHES[0];

/* ------------------------------------------------------------
   Patch packs — sold separately, six at a time.
   • Embroidered = fixed themed packs (the catalogue sheets).
   • Silicone   = "Mix Your Six", build your own from the charms.
   NOTE: "player-one" currently has 5 (its 6th was an IP-infringing
   patch we excluded) — add an original 6th before selling as a 6-pack.
   ------------------------------------------------------------ */
export type Pack = {
  key: string;
  name: string;
  tagline: string;
  collection: "embroidered" | "silicone";
  mix?: boolean; // build-your-own from the collection
  patchKeys: string[];
  price: number; // ₹  (confirm pack price with Ash)
};

export const PACKS: Pack[] = [
  {
    key: "cosmic-crew", name: "Cosmic Crew", tagline: "Six little space explorers",
    collection: "embroidered", price: 700,
    patchKeys: ["cosmo-frog", "spaced-out", "major-meow", "space-jam", "rocket-pup", "cosmo-koala"],
  },
  {
    key: "beach-club", name: "Beach Club", tagline: "Sun, surf and six goofs",
    collection: "embroidered", price: 700,
    patchKeys: ["skater-koala", "beach-crab", "pool-party", "surfs-up", "chill-bunny", "snorkel-fox"],
  },
  {
    key: "player-one", name: "Player One", tagline: "Five for the game room",
    collection: "embroidered", price: 700,
    patchKeys: ["game-on", "sir-brave", "catnap", "sneaky-ninja", "dj-whiskers"],
  },
  {
    key: "magic-makers", name: "Magic Makers", tagline: "Six unicorns, infinite sparkle",
    collection: "embroidered", price: 700,
    patchKeys: ["groovy-unicorn", "magic-pop", "lovecorn", "rainbow-mane", "blaze-mane", "sleepy-unicorn"],
  },
  {
    key: "pit-crew", name: "Pit Crew", tagline: "Six pint-sized racers",
    collection: "embroidered", price: 700,
    patchKeys: ["lil-roadster", "rally-racer", "trail-boss", "midnight-cruiser", "hot-rod", "speedy"],
  },
  {
    key: "mix-your-six", name: "Mix Your Six", tagline: "Any six silicone charms, your call",
    collection: "silicone", price: 600, mix: true, patchKeys: [],
  },
];

export const packPatches = (pack: Pack): Patch[] =>
  pack.mix ? PATCHES.slice(0, 6) : pack.patchKeys.map(patchByKey);
