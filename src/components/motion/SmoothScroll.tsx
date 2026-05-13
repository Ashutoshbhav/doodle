"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Site-wide smooth scroll. Mount once at the root of <body>.
 * Lenis publishes scroll position to a global RAF loop; motion's useScroll
 * picks it up automatically.
 *
 * Reduced-motion users: Lenis natively respects `prefers-reduced-motion`
 * via the browser's scroll-behavior fallback, so no extra guard needed.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        syncTouch: false, // keep native momentum on mobile — feels right on iOS
      }}
    >
      {children}
    </ReactLenis>
  );
}
