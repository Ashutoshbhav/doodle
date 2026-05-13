"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { PillButton } from "@/components/ui/PillButton";

const NAV_LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#wall", label: "Patch library" },
  { href: "#voices", label: "For families" },
  { href: "#offline", label: "Find us" },
] as const;

export function Nav() {
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
        <Link
          href="/"
          aria-label="DOODLE — home"
          className="relative flex items-center gap-2"
        >
          <Image
            src="/brand/wordmark-logo.jpeg"
            alt="DOODLE"
            width={160}
            height={48}
            priority
            className="h-10 w-auto md:h-12 object-contain mix-blend-multiply"
          />
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="
                  relative inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-doodle-ink/75
                  transition-colors hover:text-doodle-ink
                  focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-orange/30
                "
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="#dual-cta"
            className="
              hidden md:inline-flex items-center px-3 py-2 text-sm font-medium text-doodle-ink/65
              hover:text-doodle-ink transition-colors
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-ink/15 rounded-full
            "
          >
            Become a stockist
          </Link>
          <PillButton
            variant="primary"
            size="sm"
            onClick={() => {
              const el = document.getElementById("hero");
              el?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Join the waitlist
          </PillButton>
        </div>
      </nav>
    </motion.header>
  );
}
