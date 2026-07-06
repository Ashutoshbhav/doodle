"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  TEES,
  PATCHES,
  EMBROIDERED_PATCHES,
  velcroSlots,
  type Patch,
} from "@/lib/patches";
import { isCommerceEnabled } from "@/lib/commerce";
import { DoodleHoverRing } from "@/components/ui/DoodleHoverRing";
import { PatchDoodle } from "@/components/ui/PatchDoodle";

/* BuildYourTee — the real, interactive "build your own t-shirt" demo.
   Pick a colour, tap patches to drop them onto the chest (up to 5), tap a
   placed patch to take it off, or hit Surprise me. Uses the real upscaled
   catalogue tees + the real patch library. This replaces the old preset
   carousel that ran on stale photos. */

const MAX = 6;
const ALL = [...PATCHES, ...EMBROIDERED_PATCHES];

export function BuildYourTee() {
  const [teeKey, setTeeKey] = React.useState(TEES[0].key);
  const [placed, setPlaced] = React.useState<Patch[]>([]);
  const [tab, setTab] = React.useState<"silicone" | "embroidered">("silicone");

  const tee = TEES.find((t) => t.key === teeKey) ?? TEES[0];
  const tray = tab === "silicone" ? PATCHES : EMBROIDERED_PATCHES;
  const full = placed.length >= MAX;
  const slots = velcroSlots(placed.length, tee.panel, tee.key);

  const add = (p: Patch) => setPlaced((prev) => (prev.length >= MAX ? prev : [...prev, p]));
  const removeAt = (i: number) => setPlaced((prev) => prev.filter((_, j) => j !== i));
  const clear = () => setPlaced([]);
  const surprise = () => {
    setTeeKey(TEES[Math.floor(Math.random() * TEES.length)].key);
    // unique patches — no repeats
    const shuffled = [...ALL].sort(() => Math.random() - 0.5);
    setPlaced(shuffled.slice(0, MAX));
  };

  return (
    <section id="shop" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          {/* ---------- STAGE ---------- */}
          <div>
            <div className="relative mx-auto aspect-square w-full max-w-[460px]">
              <div
                className="absolute inset-8 rounded-[42%] blur-2xl transition-colors duration-500"
                style={{ backgroundColor: `${tee.swatch}55` }}
                aria-hidden
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={tee.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={tee.src}
                    alt={`DOODLE ${tee.name} tee`}
                    fill
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0">
                <AnimatePresence>
                  {placed.map((p, i) => {
                    const s = slots[i];
                    return (
                      <motion.button
                        key={`${p.key}-${i}`}
                        type="button"
                        onClick={() => removeAt(i)}
                        aria-label={`Remove ${p.name}`}
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.4 }}
                        transition={{ type: "spring", stiffness: 320, damping: 18 }}
                        className="absolute"
                        style={{
                          left: `${s.x}%`,
                          top: `${s.y}%`,
                          width: `${s.size}%`,
                          height: `${s.size}%`,
                          transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
                        }}
                      >
                        <Image
                          src={p.src}
                          alt={p.name}
                          width={90}
                          height={90}
                          className="h-full w-full object-contain drop-shadow-[0_2px_6px_rgba(42,42,46,0.32)]"
                        />
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* colour picker */}
            <div className="mt-7 flex items-center justify-center gap-3">
              {TEES.map((t, i) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTeeKey(t.key)}
                  aria-label={t.name}
                  aria-pressed={t.key === teeKey}
                  title={t.name}
                  className={`group relative h-10 w-10 rounded-full shadow-subtle transition-transform duration-200 ${
                    t.key === teeKey
                      ? "scale-110 ring-2 ring-doodle-ink ring-offset-2 ring-offset-doodle-canvas"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: t.swatch }}
                >
                  {/* Crayon circle on hover — a kid circling the colour they want */}
                  <DoodleHoverRing seed={29 + i} className="text-doodle-ink/50" />
                </button>
              ))}
            </div>

            {placed.length > 0 && (
              <p className="mt-5 text-center text-sm leading-relaxed text-doodle-ink/65">
                <span className="font-semibold text-doodle-ink/85">On the tee: </span>
                {placed.map((p) => p.name).join("  ·  ")}
              </p>
            )}
          </div>

          {/* ---------- CONTROLS ---------- */}
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-doodle-berry">
              Build your tee
            </span>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,3rem)] leading-[1.04] tracking-[-0.02em] text-doodle-ink">
              Tap a patch. <span className="italic text-doodle-berry">Watch it land.</span>
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-doodle-ink/70">
              Pick a colour, drop up to six patches onto the tee, and swap them
              anytime. Tap a patch on the shirt to take it off.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-doodle-ink">
                {placed.length}/{MAX} patches
              </span>
              <button
                type="button"
                onClick={surprise}
                className="rounded-full bg-doodle-canvas px-4 py-1.5 text-sm font-medium text-doodle-ink shadow-subtle transition-shadow hover:shadow-card"
              >
                Surprise me
              </button>
              <button
                type="button"
                onClick={clear}
                disabled={placed.length === 0}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-doodle-ink/55 transition-colors hover:text-doodle-ink disabled:opacity-40"
              >
                Clear
              </button>
            </div>

            {/* tabs */}
            <div className="mt-6 flex gap-2">
              {(["silicone", "embroidered"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  aria-pressed={tab === t}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                    tab === t
                      ? "bg-doodle-ink text-doodle-canvas"
                      : "bg-doodle-stitch text-doodle-ink/60 hover:text-doodle-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* patch tray */}
            <div className="mt-3 grid max-h-[230px] grid-cols-5 gap-2 overflow-y-auto rounded-[1.25rem] bg-doodle-stitch p-3 shadow-subtle sm:grid-cols-6">
              {tray.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => add(p)}
                  disabled={full}
                  title={p.name}
                  className="group relative grid aspect-square place-items-center rounded-lg bg-doodle-canvas p-1.5 shadow-subtle transition hover:-translate-y-0.5 hover:shadow-card disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {/* The patch's personal doodle, tiny, on hover */}
                  <PatchDoodle patchKey={p.key} className="w-[44%]" />
                  <Image src={p.src} alt={p.name} width={60} height={60} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>

            {/* Honest price only — no invented MRP anchor. In waitlist mode
                the CTA reserves a spot instead of promising a cart. */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="font-display text-2xl text-doodle-ink">₹999</span>
              <Link
                href={isCommerceEnabled ? "/shop" : "/#join"}
                className="inline-flex h-11 items-center justify-center rounded-full bg-doodle-orange px-6 text-sm font-medium text-doodle-ink shadow-card transition-[box-shadow,background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-doodle-orange/95 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-berry/40"
              >
                {isCommerceEnabled ? "Add this kit" : "Reserve this kit"}
              </Link>
            </div>
            <p className="mt-3 text-[12px] text-doodle-ink/50">
              Free shipping over ₹999 · Cash on delivery · 7-day exchange
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
