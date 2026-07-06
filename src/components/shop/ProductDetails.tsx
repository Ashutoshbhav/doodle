"use client";

import * as React from "react";
import Link from "next/link";
import {
  Truck,
  HandCoins,
  ArrowsClockwise,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import { sizeChart } from "@/content/help";

/* ProductDetails — size selector, spec table, and a trust panel for the
   Starter Kit PDP. Pairs with the BuildYourTee configurator above it.
   Sizes come from the signed production spec (src/content/help.ts). */

const SIZES = sizeChart.map((row) => ({
  key: row.size,
  age: row.age,
  chest: row.garmentChest,
  length: row.length,
}));

const DETAILS: [string, string][] = [
  ["Fabric", "100% combed cotton, 200–220 GSM"],
  ["Patches", "Velcro-backed, swap anytime"],
  ["Care", "Machine wash cold, tumble dry low"],
  ["Made in", "India"],
];

const TRUST: { Icon: typeof Truck; title: string; note: string }[] = [
  { Icon: HandCoins, title: "Cash on delivery", note: "Pay when it arrives" },
  { Icon: Truck, title: "Free shipping", note: "Orders over ₹999" },
  { Icon: ArrowsClockwise, title: "7-day exchange", note: "If the size is off" },
  { Icon: ShieldCheck, title: "Safe for skin", note: "100% combed cotton" },
];

export function ProductDetails() {
  const [size, setSize] = React.useState("M");
  const [showGuide, setShowGuide] = React.useState(false);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10 md:pb-24">
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-doodle-ink">Pick a size</h3>
            <span className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowGuide((s) => !s)}
                className="text-sm font-medium text-doodle-berry hover:underline"
              >
                Quick fit note
              </button>
              <Link
                href="/size-guide"
                className="text-sm font-medium text-doodle-berry hover:underline"
              >
                Full size guide
              </Link>
            </span>
          </div>

          <div className="mt-4 flex gap-3">
            {SIZES.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSize(s.key)}
                aria-pressed={size === s.key}
                className={`flex flex-1 flex-col items-center rounded-[1.1rem] border-2 px-4 py-3 transition-colors ${
                  size === s.key
                    ? "border-doodle-orange bg-doodle-orange/5"
                    : "border-doodle-ink/15 hover:border-doodle-ink/30"
                }`}
              >
                <span className="font-display text-lg text-doodle-ink">{s.key}</span>
                <span className="text-[12px] text-doodle-ink/55">{s.age}</span>
              </button>
            ))}
          </div>

          {showGuide && (
            <p className="mt-3 text-[13px] leading-relaxed text-doodle-ink/60">
              {/* Numbers from the production spec — chest is the garment laid
                  flat, armpit to armpit, doubled. */}
              {SIZES.map((s) => `${s.key}: chest ${s.chest} cm, length ${s.length} cm`).join(" · ")}
              . Between sizes? Size up — the velcro panel sits the same on
              every fit.
            </p>
          )}

          <dl className="mt-8 divide-y divide-doodle-ink/10 rounded-[1.25rem] bg-doodle-canvas px-5 shadow-subtle">
            {DETAILS.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-3.5 text-sm">
                <dt className="text-doodle-ink/60">{k}</dt>
                <dd className="text-right font-medium text-doodle-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-[1.5rem] bg-doodle-stitch p-7 shadow-card">
          <h3 className="font-display text-lg text-doodle-ink">Shop with zero worry</h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {TRUST.map(({ Icon, title, note }) => (
              <div key={title} className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-doodle-canvas text-doodle-berry shadow-subtle">
                  <Icon weight="duotone" size={20} aria-hidden />
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-doodle-ink">{title}</div>
                  <div className="text-[12px] text-doodle-ink/60">{note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
