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
// `py` = vertical centre (% of the square stage) of that tee's velcro panel.
// Tuned per image because the catalogue crops differ. Patches land here.
export type Tee = { key: string; name: string; src: string; swatch: string; py: number };

export const TEES: Tee[] = [
  { key: "pink", name: "Bubblegum Pink", src: "/product/tee-pink.png", swatch: "#F4A7B9", py: 32 },
  { key: "sky", name: "Powder Blue", src: "/product/tee-sky.png", swatch: "#A8D8EA", py: 35 },
  { key: "coral", name: "Coral", src: "/product/tee-coral.png", swatch: "#E8836B", py: 31 },
  { key: "purple", name: "Lavender", src: "/product/tee-purple.png", swatch: "#B79CE8", py: 33 },
  { key: "yellow", name: "Mustard", src: "/product/tee-yellow.png", swatch: "#E6B800", py: 35 },
  { key: "charcoal", name: "Charcoal", src: "/product/tee-charcoal.png", swatch: "#3A3A3A", py: 33 },
];

/* Velcro-panel patch placement: a centred row inside the panel band. Patch
   size is kept below the per-slot width so patches NEVER overlap, and capped
   so they fit within the panel height. */
export const VELCRO = { x0: 27, x1: 73 };
export function velcroSlots(n: number, py: number) {
  if (n <= 0) return [] as { x: number; y: number; size: number; rot: number }[];
  const span = VELCRO.x1 - VELCRO.x0;
  const slotW = span / n;
  const size = Math.min(slotW * 0.78, 8);
  return Array.from({ length: n }, (_, i) => ({
    x: VELCRO.x0 + slotW * (i + 0.5),
    y: py + (i % 2 ? -0.6 : 0.6),
    size,
    rot: ((i * 37) % 9) - 4,
  }));
}

/* Live counts — derived, never hand-typed, so marketing copy can't drift
   from reality (the no-assumptions rule). */
export const PATCH_COUNT = PATCHES.length + EMBROIDERED_PATCHES.length;
export const TEE_COUNT = TEES.length;

export const patchByKey = (key: string): Patch =>
  [...PATCHES, ...EMBROIDERED_PATCHES].find((p) => p.key === key) ?? PATCHES[0];
