"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { User } from "@phosphor-icons/react/dist/ssr";
import { CartButton } from "@/components/shop/CartButton";

const NAV_LINKS = [
  { href: "/shop", label: "Shop the drop" },
  { href: "/#how", label: "How it works" },
  { href: "/#wall", label: "Patch library" },
  { href: "/#offline", label: "Find us" },
] as const;

export function Nav({ cartCount = 0 }: { cartCount?: number }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <motion.header
      className={`
        sticky top-0 z-50 w-full transition-[background-color,box-shadow,backdrop-filter] duration-300
        ${
          scrolled
            ? "bg-doodle-canvas/85 backdrop-blur-xl shadow-[0_2px_24px_-12px_rgba(42,42,46,0.18)]"
            : "bg-transparent"
        }
      `}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 md:px-10"
      >
        {/* Real DOODLE wordmark — the 3D lettering lifted from the official
            2026 catalogue cover (transparent PNG). */}
        <Link
          href="/"
          aria-label="DOODLE — home"
          className="relative flex items-center"
        >
          <Image
            src="/brand/logo.png"
            alt="DOODLE"
            width={150}
            height={56}
            priority
            unoptimized
            className="h-9 w-auto md:h-11 object-contain"
          />
        </Link>

        <ul className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="
                  relative inline-flex items-center rounded-full px-3.5 py-2
                  font-sans text-[0.9375rem] font-medium tracking-[-0.005em] text-doodle-ink/70
                  transition-[color,background-color] duration-200
                  hover:text-doodle-ink hover:bg-doodle-ink/[0.05]
                  focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-orange/30
                "
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/account"
            aria-label="Your account"
            className="
              grid place-items-center h-11 w-11 rounded-full
              text-doodle-ink/80 transition-[color,background-color] duration-200
              hover:text-doodle-ink hover:bg-doodle-ink/5
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-orange/30
            "
          >
            <User weight="duotone" size={22} aria-hidden />
          </Link>
          <CartButton count={cartCount} />
          <Link
            href="/shop"
            className="
              inline-flex items-center justify-center
              h-9 px-5 rounded-full gap-2
              bg-doodle-orange text-doodle-stitch font-medium text-sm
              shadow-card hover:bg-doodle-orange/95 hover:shadow-card-hover
              hover:-translate-y-0.5 active:scale-[0.97]
              transition-[box-shadow,background-color,transform] duration-200
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-orange/40
            "
          >
            Shop the drop
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
