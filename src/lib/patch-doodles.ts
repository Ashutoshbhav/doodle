import rough from "roughjs";

/* ============================================================
   ONE bespoke hand-drawn doodle PER PATCH — 39 characters, 39
   different marks, each derived from that patch's bio in
   patches.ts. Nothing generic, nothing shared:

     Stella "naps in a nightcap"        → crescent moon
     Pim "cool, never cold"             → sunglasses
     Ellie "never forgets snack time"   → bitten cookie
     Finn "first frog on Mars"          → planted flag
     Saturn "naps with rings on"        → ringed planet
     Nico "vanishes at chore time"      → poof cloud
     … and so on, all 39 annotated below.

   Geometry lives in a 40×40 box. Quality rules learned in the
   motif lab: small shapes need LOW roughness (circles fall apart
   above ~1), long strokes can take more wobble; one confident
   stroke per shape (disableMultiStroke).
   ============================================================ */

type Dot = { cx: number; cy: number; r: number };
/** A drawable path: `soft` marks scribble-fill strokes (rendered thinner
    and translucent — the "coloured in with a crayon" layer). */
export type DoodlePath = { d: string; soft?: boolean };
export type DoodleAnim =
  | "beat"
  | "float"
  | "fall"
  | "flicker"
  | "wiggle"
  | "roll"
  | "shoot"
  | "bounce";
export type PatchDoodleSpec = {
  paths: DoodlePath[];
  dots?: Dot[];
  colorClass: string;
  rotate?: number;
  anim?: DoodleAnim;
  /** Embroidered patches: outlines render as running-stitch dashes. */
  stitched?: boolean;
};

/* The embroidered collection — their doodles are "sewn", not drawn:
   running-stitch dashed outlines so the mark speaks the patch's material. */
const EMBROIDERED = new Set([
  "cosmo-frog", "spaced-out", "major-meow", "space-jam", "rocket-pup", "cosmo-koala",
  "skater-koala", "beach-crab", "pool-party", "surfs-up", "chill-bunny", "snorkel-fox",
  "game-on", "sir-brave", "catnap", "sneaky-ninja", "dj-whiskers",
  "groovy-unicorn", "magic-pop", "lovecorn", "rainbow-mane", "blaze-mane", "sleepy-unicorn",
  "lil-roadster", "rally-racer", "trail-boss", "midnight-cruiser", "hot-rod", "speedy",
]);

/* Every doodle's character animation — hearts beat, flames flicker,
   sleepers float, racers shoot, waves roll. Applied while hovered on
   desktop, always-on for touch (see globals.css). */
const ANIMS: Record<string, DoodleAnim> = {
  rainbow: "fall",
  star: "wiggle",
  crown: "wiggle",
  "bear-brown": "beat",
  "bear-olive": "float",
  elephant: "wiggle",
  penguin: "wiggle",
  puppy: "bounce",
  koala: "wiggle",
  octopus: "float",
  "cosmo-frog": "wiggle",
  "spaced-out": "float",
  "major-meow": "float",
  "space-jam": "wiggle",
  "rocket-pup": "shoot",
  "cosmo-koala": "float",
  "skater-koala": "bounce",
  "beach-crab": "wiggle",
  "pool-party": "beat",
  "surfs-up": "roll",
  "chill-bunny": "wiggle",
  "snorkel-fox": "float",
  "game-on": "beat",
  "sir-brave": "wiggle",
  catnap: "float",
  "sneaky-ninja": "float",
  "dj-whiskers": "beat",
  "groovy-unicorn": "wiggle",
  "magic-pop": "wiggle",
  lovecorn: "beat",
  "rainbow-mane": "float",
  "blaze-mane": "flicker",
  "sleepy-unicorn": "float",
  "lil-roadster": "shoot",
  "rally-racer": "wiggle",
  "trail-boss": "beat",
  "midnight-cruiser": "flicker",
  "hot-rod": "flicker",
  speedy: "shoot",
};

/* Deep, on-white-readable takes on the candy palette. */
const BERRY = "text-doodle-berry";
const AMBER = "text-[#E8A200]";
const SKY = "text-[#3E9CCB]";
const GRAPE = "text-[#8B79D9]";
const MINT = "text-[#2FA36B]";
const INK = "text-doodle-ink/70";
const PINKD = "text-[#E0679A]"; // deep bubblegum — for the pink characters
const BROWN = "text-[#9C6B45]"; // warm cocoa — bears, mud

/* Roughness presets — PLUMP sticker lines, matching the puffy silicone
   charms and thick-thread embroidery (Ash: the pencil-thin scratchy look
   clashed with the patches' own design language). */
const SOFT = { roughness: 0.6, bowing: 0.65, strokeWidth: 2, disableMultiStroke: true } as const;
const SKETCH = { roughness: 0.95, bowing: 0.9, strokeWidth: 2, disableMultiStroke: true } as const;

type Gen = ReturnType<typeof rough.generator>;
type Drawable = ReturnType<Gen["line"]>;

function makeSpecs(seedBase: number): Record<string, PatchDoodleSpec> {
  const gen = rough.generator();
  let seedCounter = seedBase;
  const s = () => ({ seed: seedCounter++ });
  const ds = (...drawables: Drawable[]): DoodlePath[] =>
    drawables.flatMap((d) => gen.toPaths(d).map((p) => ({ d: p.d })));

  /* Crayon scribble fill — THE craft layer. rough.js zigzag fill inside a
     confident outline reads "coloured in by a kid", which is what a single
     uniform outline never will. Fill paths are tagged `soft` and rendered
     thinner + translucent. */
  const FILL = {
    fill: "#000", // colour is irrelevant — rendering uses currentColor
    fillStyle: "zigzag",
    fillWeight: 1.15,
    hachureGap: 3.4,
  } as const;
  const withFill = (drawable: Drawable): DoodlePath[] => {
    const ps = gen.toPaths(drawable);
    return ps.map((p, i) => ({
      d: p.d,
      soft: drawable.sets[i]?.type === "fillSketch",
    }));
  };

  /* tiny vocabulary of reusable prims (positioned per call) */
  const drop = (x: number, y: number, k = 1, fill = false) => {
    const dr = gen.path(
      `M${x} ${y} C${x - 3.4 * k} ${y + 5 * k} ${x - 4 * k} ${y + 8 * k} ${x - 2.4 * k} ${y + 10 * k} A${3.2 * k} ${3.2 * k} 0 0 0 ${x + 2.4 * k} ${y + 10 * k} C${x + 4 * k} ${y + 8 * k} ${x + 3.4 * k} ${y + 5 * k} ${x} ${y} Z`,
      fill ? { ...SOFT, ...FILL, hachureGap: 2.4, fillWeight: 0.9, ...s() } : { ...SOFT, ...s() },
    );
    return fill ? withFill(dr) : ds(dr);
  };
  const heartAt = (cx: number, cy: number, k = 1, fill = false) => {
    const dr = gen.path(
      `M${cx} ${cy + 11 * k} C${cx - 9 * k} ${cy + 3 * k} ${cx - 12 * k} ${cy - 4 * k} ${cx - 8 * k} ${cy - 8 * k} C${cx - 5 * k} ${cy - 11 * k} ${cx - 1 * k} ${cy - 9 * k} ${cx} ${cy - 5 * k} C${cx + 1 * k} ${cy - 9 * k} ${cx + 5 * k} ${cy - 11 * k} ${cx + 8 * k} ${cy - 8 * k} C${cx + 12 * k} ${cy - 4 * k} ${cx + 9 * k} ${cy + 3 * k} ${cx} ${cy + 11 * k} Z`,
      fill ? { ...SOFT, ...FILL, ...s() } : { ...SOFT, ...s() },
    );
    return fill ? withFill(dr) : ds(dr);
  };
  const star5 = (cx: number, cy: number, k = 1, fill = false) => {
    const dr = gen.polygon(
      [
        [cx, cy - 9 * k],
        [cx + 2.4 * k, cy - 2.8 * k],
        [cx + 9 * k, cy - 2.6 * k],
        [cx + 3.8 * k, cy + 1.4 * k],
        [cx + 5.6 * k, cy + 8 * k],
        [cx, cy + 4 * k],
        [cx - 5.6 * k, cy + 8 * k],
        [cx - 3.8 * k, cy + 1.4 * k],
        [cx - 9 * k, cy - 2.6 * k],
        [cx - 2.4 * k, cy - 2.8 * k],
      ],
      fill ? { ...SOFT, ...FILL, hachureGap: 2.8, ...s() } : { ...SOFT, ...s() },
    );
    return fill ? withFill(dr) : ds(dr);
  };
  const zzz = (color: string): PatchDoodleSpec => {
    const z = (x: number, y: number, size: number) =>
      gen.linearPath(
        [
          [x, y],
          [x + size, y],
          [x, y + size],
          [x + size, y + size],
        ],
        { ...SKETCH, ...s() },
      );
    return { paths: ds(z(4, 24, 12), z(19, 13, 9), z(30, 5, 6)), colorClass: color };
  };

  return {
    /* ================= SILICONE CHARMS ================= */

    // Romy the Rainbow — "comes out after the cry": the rain that came first
    rainbow: {
      paths: [
        ...ds(gen.path("M9 16 A5 5 0 0 1 15 9 A6.5 6.5 0 0 1 27 8 A5 5 0 0 1 32 16 Z", { ...SOFT, ...s() })),
        ...drop(14, 22, 0.8, true),
        ...drop(26, 22, 0.8, true),
        ...drop(20, 28, 0.7, true),
      ],
      colorClass: SKY,
    },
    // Stella the Star — "naps in a nightcap": her crescent-moon bedtime
    star: {
      paths: withFill(
        gen.path("M25 5 A13 13 0 1 0 34 27 A10 10 0 0 1 25 5 Z", { ...SOFT, ...FILL, ...s() }),
      ),
      dots: [{ cx: 10, cy: 10, r: 1.4 }],
      colorClass: PINKD,
      rotate: -12,
    },
    // Kingsley the Crown — "rules the playground": the winner's pennant
    crown: {
      paths: ds(
        gen.line(12, 4, 12, 36, { ...SKETCH, ...s() }),
        gen.polygon(
          [
            [13, 5],
            [34, 10],
            [13, 16],
          ],
          { ...SOFT, ...s() },
        ),
      ).concat(withFill(gen.polygon([[13, 5], [34, 10], [13, 16]], { ...SOFT, ...FILL, hachureGap: 2.6, ...s() }))),
      colorClass: AMBER,
    },
    // Bruno the Bear — "first to the hug": two little hearts, one for each arm
    "bear-brown": {
      paths: [...heartAt(13, 15, 0.85, true), ...heartAt(29, 26, 0.62, true)],
      colorClass: BROWN,
    },
    // Theo the Teddy — "softest in the bunch": soft as a cloud
    "bear-olive": {
      paths: ds(
        gen.path("M8 26 A5.5 5.5 0 0 1 13 17 A7 7 0 0 1 26 15 A6 6 0 0 1 33 26 Z", { ...SOFT, ...s() }),
      ),
      colorClass: INK,
    },
    // Ellie the Elephant — "never forgets snack time": the choc-chip cookie
    elephant: {
      paths: withFill(gen.circle(19, 21, 28, { ...SOFT, ...FILL, hachureGap: 3, ...s() })),
      dots: [
        { cx: 14, cy: 16, r: 1.8 },
        { cx: 24, cy: 19, r: 1.8 },
        { cx: 17, cy: 27, r: 1.8 },
        { cx: 35, cy: 8, r: 1.4 }, // crumb
        { cx: 37, cy: 14, r: 1.1 }, // crumb
      ],
      colorClass: AMBER,
    },
    // Pim the Penguin — "cool, never cold": sunglasses
    penguin: {
      paths: ds(
        gen.circle(11, 20, 13, { ...SOFT, ...s() }),
        gen.circle(29, 20, 13, { ...SOFT, ...s() }),
        gen.line(17.5, 19, 22.5, 19, { ...SOFT, ...s() }),
        gen.line(4.5, 18, 1, 14, { ...SOFT, ...s() }),
        gen.line(35.5, 18, 39, 14, { ...SOFT, ...s() }),
      ),
      colorClass: INK,
    },
    // Pip the Puppy — "best friend, on demand": the bouncing fetch ball
    puppy: {
      paths: ds(
        gen.circle(22, 24, 22, { ...SOFT, ...s() }),
        gen.path("M13 16 Q22 24 13 32", { ...SOFT, ...s() }),
        gen.path("M6 10 Q10 5 16 4", { ...SOFT, ...s() }), // bounce arc
      ),
      colorClass: BERRY,
    },
    // Coco the Koala — "champion tree-napper": the eucalyptus branch
    koala: {
      paths: ds(
        gen.path("M6 34 Q20 22 34 8", { ...SKETCH, ...s() }),
        gen.path("M18 24 Q14 16 20 12 Q22 20 18 24 Z", { ...SOFT, ...s() }),
        gen.path("M27 15 Q31 7 25 5 Q23 12 27 15 Z", { ...SOFT, ...s() }),
      ),
      colorClass: MINT,
    },
    // Otto the Octopus — "eight arms, all hugs": a heart floating in his bubble
    octopus: {
      paths: [...ds(gen.circle(20, 20, 30, { ...SOFT, ...s() })), ...heartAt(20, 20, 0.6, true)],
      colorClass: PINKD,
    },

    /* ================= EMBROIDERED · SPACE ================= */

    // Finn the Frog — "first frog on Mars": the flag he planted
    "cosmo-frog": {
      paths: ds(
        gen.line(16, 4, 16, 30, { ...SKETCH, ...s() }),
        gen.polygon(
          [
            [17, 5],
            [33, 9],
            [17, 14],
          ],
          { ...SOFT, ...s() },
        ),
        gen.path("M4 33 Q20 28 36 33", { ...SOFT, ...s() }),
      ),
      colorClass: MINT,
    },
    // Nova the Cat — "took the UFO for snacks": the borrowed UFO
    "spaced-out": {
      paths: ds(
        gen.ellipse(20, 18, 32, 10, { ...SOFT, ...s() }),
        gen.path("M12 14 A9 7 0 0 1 28 14", { ...SOFT, ...s() }),
        gen.line(12, 27, 10, 33, { ...SOFT, ...s() }),
        gen.line(20, 28, 20, 35, { ...SOFT, ...s() }),
        gen.line(28, 27, 30, 33, { ...SOFT, ...s() }),
      ),
      colorClass: GRAPE,
    },
    // Tom the Astrocat — "always over the moon": literally over the moon
    "major-meow": {
      paths: ds(
        gen.path("M22 14 A10 10 0 1 0 30 30 A8 8 0 0 1 22 14 Z", { ...SOFT, ...s() }),
        gen.path("M6 12 Q14 2 26 6", { ...SKETCH, ...s() }),
      ),
      dots: [{ cx: 30, cy: 6, r: 1.6 }],
      colorClass: AMBER,
    },
    // Jimi the Rockcat — "riffs in zero-g": a note floating free
    "space-jam": {
      paths: ds(
        gen.circle(12, 30, 9, { ...SOFT, ...s() }),
        gen.line(16.5, 30, 16.5, 8, { ...SOFT, ...s() }),
        gen.path("M16.5 8 Q24 6 28 12", { ...SOFT, ...s() }),
      ),
      dots: [
        { cx: 30, cy: 22, r: 1.3 },
        { cx: 34, cy: 14, r: 1.1 },
      ],
      colorClass: BERRY,
      rotate: 8,
    },
    // Rocky the Rocket Pup — "counts down to zoomies": lift-off trail
    "rocket-pup": {
      paths: ds(
        gen.path("M30 4 Q22 16 16 26", { ...SKETCH, ...s() }),
        gen.circle(12, 32, 7, { ...SOFT, ...s() }),
        gen.circle(20, 34, 5, { ...SOFT, ...s() }),
        gen.circle(6, 26, 4.5, { ...SOFT, ...s() }),
      ),
      colorClass: AMBER,
    },
    // Saturn the Koala — "naps with rings on": his namesake planet
    "cosmo-koala": {
      paths: [
        ...withFill(gen.circle(20, 20, 18, { ...SOFT, ...FILL, hachureGap: 2.8, ...s() })),
        ...ds(gen.ellipse(20, 21, 38, 10, { ...SOFT, ...s() })),
      ],
      colorClass: AMBER,
      rotate: -14,
    },

    /* ================= EMBROIDERED · SUMMER ================= */

    // Kai the Skater — "kickflips past bedtime": the board mid-flip
    "skater-koala": {
      paths: ds(
        gen.path("M4 18 Q20 12 36 18", { ...SOFT, ...s() }),
        gen.circle(13, 25, 6, { ...SOFT, ...s() }),
        gen.circle(28, 25, 6, { ...SOFT, ...s() }),
      ),
      colorClass: SKY,
      rotate: -10,
    },
    // Cami the Crab — "beach days only": the beach umbrella
    "beach-crab": {
      paths: [
        ...withFill(gen.path("M6 16 A14 12 0 0 1 34 16 Z", { ...SOFT, ...FILL, ...s() })),
        ...ds(
          gen.line(20, 16, 20, 32, { ...SKETCH, ...s() }),
          gen.path("M8 35 Q20 32 32 35", { ...SOFT, ...s() }),
        ),
      ],
      colorClass: BERRY,
      rotate: 8,
    },
    // Gigi the Giraffe — "tallest at the pool party": the cannonball splash
    "pool-party": {
      paths: ds(
        gen.line(20, 18, 20, 6, { ...SOFT, ...s() }),
        gen.line(12, 20, 5, 12, { ...SOFT, ...s() }),
        gen.line(28, 20, 35, 12, { ...SOFT, ...s() }),
        gen.path("M6 30 Q13 24 20 30 Q27 36 34 30", { ...SOFT, ...s() }),
      ),
      colorClass: SKY,
    },
    // Surge the Surf Croc — "catches every wave": the curling wave
    "surfs-up": {
      paths: [
        ...withFill(gen.path("M34 27 C34 10 22 6 14 10 C6 14 6 24 13 25 C18 26 20 22 17 19 C14 22 16 23 17 22 C18 24 15 24 13 22 C10 18 13 13 19 12 C28 10 31 18 30 27 Z", { ...SOFT, ...FILL, hachureGap: 3.8, ...s() })),
        ...ds(gen.path("M3 33 Q20 29 37 33", { ...SOFT, ...s() })),
      ],
      colorClass: SKY,
    },
    // Benny the Bunny — "sips and chills": the drink with a straw
    "chill-bunny": {
      paths: ds(
        gen.polygon(
          [
            [10, 12],
            [30, 12],
            [26, 34],
            [14, 34],
          ],
          { ...SOFT, ...s() },
        ),
        gen.line(24, 12, 32, 2, { ...SOFT, ...s() }),
      ),
      dots: [
        { cx: 17, cy: 20, r: 1.2 },
        { cx: 22, cy: 26, r: 1.2 },
      ],
      colorClass: PINKD,
    },
    // Reef the Fox — "first one in the water": his bubble trail going down
    "snorkel-fox": {
      paths: ds(
        gen.circle(24, 8, 6, { ...SOFT, ...s() }),
        gen.circle(16, 18, 8, { ...SOFT, ...s() }),
        gen.circle(24, 30, 11, { ...SOFT, ...s() }),
      ),
      colorClass: SKY,
    },

    /* ================= EMBROIDERED · GAMER ================= */

    // Ace the Gamepad — "never drops a combo": the D-pad
    "game-on": {
      paths: ds(
        gen.polygon(
          [
            [15, 4],
            [25, 4],
            [25, 15],
            [36, 15],
            [36, 25],
            [25, 25],
            [25, 36],
            [15, 36],
            [15, 25],
            [4, 25],
            [4, 15],
            [15, 15],
          ],
          { ...SOFT, ...s() },
        ),
      ),
      colorClass: INK,
    },
    // Sir Leo the Knight — "brave till bedtime": his trusty sword
    "sir-brave": {
      paths: [
        ...withFill(gen.polygon([[17, 4], [23, 4], [21.5, 24], [18.5, 24]], { ...SOFT, ...FILL, hachureGap: 2.6, ...s() })),
        ...ds(
          gen.line(11, 26, 29, 26, { ...SOFT, ...s() }),
          gen.line(20, 26, 20, 36, { ...SOFT, ...s() }),
        ),
      ],
      colorClass: INK,
      rotate: 20,
    },
    // Cleo the Catnap — "asleep before the story ends": the only zzz
    catnap: zzz(GRAPE),
    // Nico the Ninja — "vanishes at chore time": the poof he leaves behind
    "sneaky-ninja": {
      paths: ds(
        gen.circle(13, 26, 15, { ...SOFT, ...s() }),
        gen.circle(24, 21, 12, { ...SOFT, ...s() }),
        gen.circle(18, 15, 9, { ...SOFT, ...s() }),
        gen.line(33, 8, 38, 5, { ...SOFT, ...s() }),
        gen.line(35, 15, 39, 14, { ...SOFT, ...s() }),
      ),
      colorClass: INK,
    },
    // Remy the DJ — "drops the beat, then a nap": headphones
    "dj-whiskers": {
      paths: [
        ...ds(gen.path("M8 24 A12 12 0 0 1 32 24", { ...SOFT, ...s() })),
        ...withFill(gen.rectangle(5, 24, 7, 11, { ...SOFT, ...FILL, hachureGap: 2.4, ...s() })),
        ...withFill(gen.rectangle(28, 24, 7, 11, { ...SOFT, ...FILL, hachureGap: 2.4, ...s() })),
      ],
      colorClass: GRAPE,
    },

    /* ================= EMBROIDERED · UNICORNS ================= */

    // Juno the Unicorn — "headphones never off": beamed notes she's hearing
    "groovy-unicorn": {
      paths: ds(
        gen.circle(10, 30, 8, { ...SOFT, ...s() }),
        gen.circle(28, 27, 8, { ...SOFT, ...s() }),
        gen.line(14, 30, 14, 10, { ...SOFT, ...s() }),
        gen.line(32, 27, 32, 7, { ...SOFT, ...s() }),
        gen.line(14, 10, 32, 7, { ...SOFT, ...s() }),
      ),
      colorClass: GRAPE,
    },
    // Pixie the Unicorn — "100% magic": the wand
    "magic-pop": {
      paths: [...ds(gen.line(6, 34, 24, 16, { ...SKETCH, ...s() })), ...star5(29, 10, 0.9, true)],
      dots: [
        { cx: 36, cy: 22, r: 1.3 },
        { cx: 20, cy: 6, r: 1.2 },
      ],
      colorClass: AMBER,
    },
    // Lola the Unicorn — "all heart": THE heart
    lovecorn: {
      paths: heartAt(20, 20, 1.4, true),
      colorClass: PINKD,
    },
    // Iris the Unicorn — "mane of every colour": her rainbow
    "rainbow-mane": {
      paths: ds(
        gen.path("M5 32 A15 15 0 0 1 35 32", { ...SOFT, ...s() }),
        gen.path("M11 32 A9 9 0 0 1 29 32", { ...SOFT, ...s() }),
        gen.path("M17 32 A3 3 0 0 1 23 32", { ...SOFT, ...s() }),
      ),
      colorClass: BERRY,
    },
    // Blaze the Unicorn — "too hot to handle": one confident flame + sparks
    "blaze-mane": {
      paths: withFill(
        gen.path(
          "M19 4 C22 10 27 13 27 21 A8.5 8.5 0 0 1 10 21 C10 15 16 12 19 4 Z",
          { ...SOFT, ...FILL, ...s() },
        ),
      ),
      dots: [
        { cx: 33, cy: 10, r: 1.6 },
        { cx: 35, cy: 20, r: 1.2 },
      ],
      colorClass: AMBER,
    },
    // Nia the Unicorn — "dreams in colour": the dream bubble with a star
    "sleepy-unicorn": {
      paths: [
        ...ds(gen.circle(22, 14, 24, { ...SOFT, ...s() })),
        ...star5(22, 14, 0.7, true),
      ],
      dots: [
        { cx: 10, cy: 30, r: 2.2 },
        { cx: 5, cy: 36, r: 1.4 },
      ],
      colorClass: SKY,
    },

    /* ================= EMBROIDERED · CARS ================= */

    // Ruby the Roadster — "zero to zoomies": speed lines
    "lil-roadster": {
      paths: ds(
        gen.line(6, 10, 28, 10, { ...SKETCH, ...s() }),
        gen.line(2, 19, 22, 19, { ...SKETCH, ...s() }),
        gen.line(8, 28, 26, 28, { ...SKETCH, ...s() }),
      ),
      colorClass: BERRY,
      rotate: -6,
    },
    // Dash the Racer — "always in fifth gear": the checkered flag
    "rally-racer": {
      paths: ds(
        gen.line(8, 4, 8, 36, { ...SKETCH, ...s() }),
        gen.path("M9 5 Q20 2 34 6 L34 20 Q20 16 9 19 Z", { ...SOFT, ...s() }),
      ),
      dots: [
        { cx: 15, cy: 9, r: 2.4 },
        { cx: 27, cy: 9, r: 2.4 },
        { cx: 21, cy: 14, r: 2.4 },
      ],
      colorClass: INK,
    },
    // Bronco the Jeep — "mud is the point": the muddy tyre track
    "trail-boss": {
      paths: ds(
        gen.path("M4 14 Q14 10 22 15 Q30 20 37 16", { ...SKETCH, ...s() }),
        gen.path("M3 25 Q13 21 21 26 Q29 31 36 27", { ...SKETCH, ...s() }),
        gen.line(9, 13, 8, 24, { ...SOFT, ...s() }),
        gen.line(18, 14, 17, 25, { ...SOFT, ...s() }),
        gen.line(27, 18, 26, 29, { ...SOFT, ...s() }),
      ),
      dots: [
        { cx: 34, cy: 8, r: 1.6 },
        { cx: 38, cy: 34, r: 1.3 },
      ],
      colorClass: BROWN,
      rotate: -8,
    },
    // Shadow the Cruiser — "rolls in at midnight": headlight beams in the dark
    "midnight-cruiser": {
      paths: ds(
        gen.circle(8, 20, 8, { ...SOFT, ...s() }),
        gen.line(13, 16, 36, 9, { ...SOFT, ...s() }),
        gen.line(13, 24, 36, 31, { ...SOFT, ...s() }),
      ),
      colorClass: AMBER,
    },
    // Flynn the Hot Rod — "two flames, one speed": both flames
    "hot-rod": {
      paths: [
        ...withFill(gen.path("M13 8 C9 14 7 18 7 23 A6.5 6.5 0 0 0 20 23 C20 18 17 14 13 8 Z", { ...SOFT, ...FILL, hachureGap: 2.6, ...s() })),
        ...withFill(gen.path("M29 14 C26 19 24 22 24 26 A5.5 5.5 0 0 0 35 26 C35 22 33 19 29 14 Z", { ...SOFT, ...FILL, hachureGap: 2.6, ...s() })),
      ],
      colorClass: BERRY,
    },
    // Zippy the Speedster — "gone before you blink": the vanish trail
    speedy: {
      paths: ds(
        gen.line(4, 14, 16, 14, { ...SKETCH, ...s() }),
        gen.line(20, 14, 26, 14, { ...SKETCH, ...s() }),
        gen.circle(34, 14, 4, { ...SOFT, ...s() }),
        gen.path("M6 26 A5 5 0 0 1 12 20 A5 5 0 0 1 20 22 A4 4 0 0 1 18 29 L9 29", { ...SOFT, ...s() }),
      ),
      colorClass: BERRY,
    },
  };
}

/* LINE BOIL: the same doodle drawn 3 times with different wobble seeds.
   Cycling the frames (~7fps, CSS steps) makes the ink itself shimmer —
   the hand-drawn-animation trick that makes lines feel ALIVE rather
   than a static path being slid around. */
const BOIL_FRAMES = 3;

let cache: Record<string, PatchDoodleSpec>[] | null = null;

const FALLBACK: PatchDoodleSpec = { paths: [], colorClass: INK };

export function patchDoodleFrames(key: string): PatchDoodleSpec[] {
  if (!cache) {
    cache = Array.from({ length: BOIL_FRAMES }, (_, f) => makeSpecs(100 + f * 7919));
  }
  return cache.map((frame) => {
    const spec = frame[key] ?? FALLBACK;
    return { ...spec, anim: ANIMS[key], stitched: EMBROIDERED.has(key) };
  });
}
