import Image from "next/image";
import { PATCHES, TEES, velcroSlots } from "@/lib/patches";

/* HeroTee — the hero product visual, built from REAL assets: the upscaled
   Bubblegum Pink catalogue tee with four named patches resting INSIDE the
   velcro panel (non-overlapping). The interactive "Build your tee" demo lives
   just below the fold. */

const PICKS = ["bear-brown", "star", "rainbow", "crown"]
  .map((k) => PATCHES.find((p) => p.key === k))
  .filter(Boolean) as typeof PATCHES;

const PINK = TEES.find((t) => t.key === "pink") ?? TEES[0];

export function HeroTee() {
  const slots = velcroSlots(PICKS.length, PINK.py);
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      <div
        className="absolute inset-8 rounded-[42%] bg-doodle-tee-pink/30 blur-2xl"
        aria-hidden
      />
      <Image
        src={PINK.src}
        alt="DOODLE Bubblegum Pink tee with swappable patches"
        fill
        sizes="(min-width: 1024px) 36vw, 80vw"
        className="object-contain"
        priority
      />
      <div className="absolute inset-0">
        {PICKS.map((p, i) => {
          const s = slots[i];
          return (
            <Image
              key={p.key}
              src={p.src}
              alt={p.name}
              width={80}
              height={80}
              className="absolute object-contain drop-shadow-[0_3px_7px_rgba(42,42,46,0.3)]"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}%`,
                height: `${s.size}%`,
                transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
