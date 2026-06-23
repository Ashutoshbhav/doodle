/* ============================================================
   PatchShape — shared silicone-charm patch SVGs

   Extracted from PatchScrubber so every homepage section can
   reuse the same on-brand patch shapes (clusters / floating
   patches / grids / color-block compositions) without waiting on
   real /public/patches/*.svg renders.

   Locked DOODLE patch palette (NOT drifted values):
     orange #e8650a · blue #1a56c4 · yellow #d4a800
     pink   #d4607a · purple #8b80e0 · red #c8312a

   Each shape is a viewBox 0..100 SVG with a soft rubber glow,
   white sheen highlight, and a white outline — reads premium +
   playful. Radius / softness handled by the SVG itself.
   ============================================================ */

export type PatchKey =
  | "bear"
  | "star"
  | "lightning"
  | "heart"
  | "rocket"
  | "moon"
  | "cloud"
  | "sun"
  | "drop"
  | "burst"
  | "diamond"
  | "smile"
  | "stripe"
  | "arrow"
  | "flower"
  | "hex";

export const PATCH_COLOR: Record<PatchKey, string> = {
  bear: "#8b80e0",
  star: "#d4a800",
  lightning: "#d4a800",
  heart: "#d4607a",
  rocket: "#e8650a",
  moon: "#1a56c4",
  cloud: "#1a56c4",
  sun: "#e8650a",
  drop: "#1a56c4",
  burst: "#e8650a",
  diamond: "#d4607a",
  smile: "#d4a800",
  stripe: "#c8312a",
  arrow: "#8b80e0",
  flower: "#d4607a",
  hex: "#1a56c4",
};

/** Ordered list of every patch key — handy for grids / clusters. */
export const PATCH_KEYS: readonly PatchKey[] = [
  "bear",
  "star",
  "lightning",
  "heart",
  "rocket",
  "moon",
  "cloud",
  "sun",
  "drop",
  "burst",
  "diamond",
  "smile",
  "stripe",
  "arrow",
  "flower",
  "hex",
];

export function PatchShape({ patch, size }: { patch: PatchKey; size: number }) {
  const fill = PATCH_COLOR[patch];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      {/* Soft outer glow for "rubber" depth */}
      <circle cx="50" cy="50" r="46" fill={fill} opacity="0.15" />
      {/* Patch body */}
      <PatchBody patch={patch} fill={fill} />
      {/* Tiny highlight = silicone sheen */}
      <ellipse cx="38" cy="32" rx="10" ry="4" fill="white" opacity="0.45" />
    </svg>
  );
}

function PatchBody({ patch, fill }: { patch: PatchKey; fill: string }) {
  const stroke = "white";
  const sw = 2.5;
  // Round trig-derived coords to a fixed precision so SSR + client serialize
  // identically (avoids a React hydration mismatch on the computed circles/lines).
  const R = (n: number) => Math.round(n * 1000) / 1000;
  switch (patch) {
    case "bear":
      return (
        <>
          <circle cx="28" cy="30" r="11" fill={fill} />
          <circle cx="72" cy="30" r="11" fill={fill} />
          <circle cx="50" cy="58" r="32" fill={fill} />
          <circle cx="50" cy="58" r="32" fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx="40" cy="54" r="3" fill="white" />
          <circle cx="60" cy="54" r="3" fill="white" />
          <ellipse cx="50" cy="68" rx="6" ry="4" fill="white" />
        </>
      );
    case "star":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <path d="M50 22 L57 44 L80 44 L62 58 L68 80 L50 66 L32 80 L38 58 L20 44 L43 44 Z" fill="white" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "lightning":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <path d="M 56 22 L 36 54 L 50 54 L 42 78 L 64 44 L 50 44 Z" fill="white" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "heart":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <path d="M50 76 C28 60 20 48 28 36 C36 28 47 32 50 41 C53 32 64 28 72 36 C80 48 72 60 50 76 Z" fill="white" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "rocket":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <path d="M50 18 C 60 28 64 42 64 56 L 36 56 C 36 42 40 28 50 18 Z" fill="white" />
          <circle cx="50" cy="40" r="5" fill={fill} />
          <path d="M36 56 L 28 70 L 38 66 Z" fill="white" />
          <path d="M64 56 L 72 70 L 62 66 Z" fill="white" />
          <path d="M44 70 Q 50 82 56 70" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "moon":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <path d="M 60 24 A 30 30 0 1 0 70 70 A 22 22 0 1 1 60 24 Z" fill="white" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "cloud":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <path d="M28 60 Q 28 48 40 48 Q 42 36 54 38 Q 66 36 68 48 Q 78 48 78 58 Q 78 68 68 68 L 36 68 Q 28 68 28 60 Z" fill="white" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "sun":
      return (
        <>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const x1 = R(50 + Math.cos(a) * 30);
            const y1 = R(50 + Math.sin(a) * 30);
            const x2 = R(50 + Math.cos(a) * 44);
            const y2 = R(50 + Math.sin(a) * 44);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={fill} strokeWidth="6" strokeLinecap="round" />;
          })}
          <circle cx="50" cy="50" r="26" fill={fill} />
          <circle cx="50" cy="50" r="26" fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx="42" cy="46" r="3" fill="white" />
          <circle cx="58" cy="46" r="3" fill="white" />
          <path d="M42 56 Q 50 62 58 56" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case "drop":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <path d="M50 22 C 60 38 70 48 70 60 A 20 20 0 1 1 30 60 C 30 48 40 38 50 22 Z" fill="white" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "burst":
      return (
        <>
          <circle cx="50" cy="50" r="34" fill={fill} />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2 + 0.3;
            const x1 = R(50 + Math.cos(a) * 36);
            const y1 = R(50 + Math.sin(a) * 36);
            const x2 = R(50 + Math.cos(a) * 48);
            const y2 = R(50 + Math.sin(a) * 48);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={fill} strokeWidth="6" strokeLinecap="round" />;
          })}
          <circle cx="50" cy="50" r="34" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "diamond":
      return (
        <>
          <path d="M50 14 L 86 50 L 50 86 L 14 50 Z" fill={fill} />
          <path d="M50 14 L 86 50 L 50 86 L 14 50 Z" fill="none" stroke={stroke} strokeWidth={sw} />
          <path d="M50 26 L 74 50 L 50 74 L 26 50 Z" fill="white" opacity="0.6" />
        </>
      );
    case "smile":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <circle cx="38" cy="42" r="4.5" fill="white" />
          <circle cx="62" cy="42" r="4.5" fill="white" />
          <path d="M34 58 Q 50 76 66 58" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "stripe":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <line x1="22" y1="40" x2="78" y2="40" stroke="white" strokeWidth="6" strokeLinecap="round" />
          <line x1="22" y1="50" x2="78" y2="50" stroke="white" strokeWidth="6" strokeLinecap="round" />
          <line x1="22" y1="60" x2="78" y2="60" stroke="white" strokeWidth="6" strokeLinecap="round" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "arrow":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          <path d="M30 50 L 65 50 M 50 35 L 65 50 L 50 65" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "flower":
      return (
        <>
          <circle cx="50" cy="50" r="38" fill={fill} />
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const a = (deg * Math.PI) / 180;
            const cx = R(50 + Math.cos(a) * 18);
            const cy = R(50 + Math.sin(a) * 18);
            return <circle key={deg} cx={cx} cy={cy} r="11" fill="white" />;
          })}
          <circle cx="50" cy="50" r="9" fill={fill} />
          <circle cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth={sw} />
        </>
      );
    case "hex":
      return (
        <>
          <path d="M50 14 L 82 32 L 82 68 L 50 86 L 18 68 L 18 32 Z" fill={fill} />
          <path d="M50 14 L 82 32 L 82 68 L 50 86 L 18 68 L 18 32 Z" fill="none" stroke={stroke} strokeWidth={sw} />
          <path d="M50 28 L 70 38 L 70 62 L 50 72 L 30 62 L 30 38 Z" fill="white" opacity="0.7" />
        </>
      );
  }
}
