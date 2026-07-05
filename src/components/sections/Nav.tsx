"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";
import { User, List, X } from "@phosphor-icons/react/dist/ssr";
import { CartButton } from "@/components/shop/CartButton";
import { isCommerceEnabled } from "@/lib/commerce";

/* Waitlist mode vs shop mode: until commerce is enabled in this deployment,
   the nav never promises a shop it can't deliver — the primary CTA sends
   people to the waitlist, and the cart/account icons stay hidden. */

const NAV_LINKS = [
  ...(isCommerceEnabled ? [{ href: "/shop", label: "Shop the drop" }] : []),
  { href: "/#shop", label: "Build your tee" },
  { href: "/#how", label: "How it works" },
  { href: "/#wall", label: "Patch library" },
  { href: "/#packs", label: "Patch packs" },
] as const;

const CTA = isCommerceEnabled
  ? { href: "/shop", label: "Shop the drop" }
  : { href: "/#join", label: "Join the first drop" };

export function Nav({ cartCount = 0 }: { cartCount?: number }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const reduceMotion = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Close the sheet on Escape and lock body scroll while it's open.
  React.useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
          {isCommerceEnabled && (
            <>
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
            </>
          )}
          <Link
            href={CTA.href}
            className="
              hidden sm:inline-flex items-center justify-center
              h-9 px-5 rounded-full gap-2
              bg-doodle-orange text-doodle-stitch font-medium text-sm
              shadow-card hover:bg-doodle-orange/95 hover:shadow-card-hover
              hover:-translate-y-0.5 active:scale-[0.97]
              transition-[box-shadow,background-color,transform] duration-200
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-orange/40
            "
          >
            {CTA.label}
          </Link>

          {/* Mobile menu trigger — the header is the site map for the 75%+
              of traffic on phones; every primary destination must be reachable. */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="
              grid lg:hidden place-items-center h-11 w-11 rounded-full
              text-doodle-ink/80 transition-[color,background-color] duration-200
              hover:text-doodle-ink hover:bg-doodle-ink/5
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-orange/30
            "
          >
            <List weight="bold" size={24} aria-hidden />
          </button>
        </div>
      </nav>

      {/* Full-screen mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-doodle-canvas lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex h-20 items-center justify-between px-6">
              <Link href="/" aria-label="DOODLE — home" onClick={() => setMenuOpen(false)}>
                <Image
                  src="/brand/logo.png"
                  alt="DOODLE"
                  width={150}
                  height={56}
                  unoptimized
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="grid place-items-center h-11 w-11 rounded-full text-doodle-ink/80 hover:bg-doodle-ink/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-orange/30"
              >
                <X weight="bold" size={24} aria-hidden />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-8 pb-10">
              <ul className="space-y-2">
                {NAV_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 font-display text-3xl tracking-[-0.02em] text-doodle-ink transition-colors hover:text-doodle-orange"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                {isCommerceEnabled && (
                  <li>
                    <Link
                      href="/account"
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 font-display text-3xl tracking-[-0.02em] text-doodle-ink transition-colors hover:text-doodle-orange"
                    >
                      Your account
                    </Link>
                  </li>
                )}
              </ul>

              <div className="mt-10">
                <Link
                  href={CTA.href}
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-doodle-orange px-7 font-medium text-doodle-stitch shadow-card active:scale-[0.97] transition-transform"
                >
                  {CTA.label}
                </Link>
                <p className="mt-6 text-sm text-doodle-ink/60">
                  Questions?{" "}
                  <a href="mailto:hello@doodlebycanvas.in" className="font-medium text-doodle-ink underline underline-offset-2">
                    hello@doodlebycanvas.in
                  </a>
                </p>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
