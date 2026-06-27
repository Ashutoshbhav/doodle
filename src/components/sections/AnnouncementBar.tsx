import * as React from "react";

/* Thin top strip — sets shipping / COD / returns expectations the moment
   the page loads. A core trust signal for Indian D2C (68% of shoppers cite
   trust signals as their #1 purchase factor). Scrolls away above the sticky
   Nav. Later items hide on small screens to avoid crowding. */

const ITEMS = [
  "Free shipping over ₹999",
  "Cash on delivery available",
  "Easy 7-day exchanges",
  "First drop — Bangalore",
];

export function AnnouncementBar() {
  return (
    <div className="w-full bg-doodle-ink text-doodle-canvas">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-6 py-2 text-center text-[12px] font-medium tracking-[0.01em] md:gap-6 md:text-[13px]">
        {ITEMS.map((t, i) => (
          <React.Fragment key={t}>
            {i > 0 && (
              <span className="text-doodle-orange" aria-hidden>
                •
              </span>
            )}
            <span className={i >= 2 ? "hidden sm:inline" : ""}>{t}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
