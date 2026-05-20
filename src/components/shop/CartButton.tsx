"use client"

import Link from "next/link"
import { ShoppingBagOpen } from "@phosphor-icons/react/dist/ssr"
import { usePathname } from "next/navigation"

export function CartButton({ count }: { count: number }) {
  const pathname = usePathname()
  if (pathname?.startsWith("/drop")) return null

  return (
    <Link
      href="/cart"
      aria-label={`Cart (${count} item${count === 1 ? "" : "s"})`}
      className="
        relative grid place-items-center h-11 w-11 rounded-full
        text-doodle-ink/80 hover:text-doodle-ink hover:bg-doodle-ink/5
        transition-colors
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-orange/30
      "
    >
      <ShoppingBagOpen weight="duotone" size={22} />
      {count > 0 && (
        <span
          className="
            absolute -top-1 -right-1 grid place-items-center
            bg-doodle-orange text-doodle-stitch
            rounded-full h-5 min-w-5 px-1 text-[10px] font-mono
          "
        >
          {count}
        </span>
      )}
    </Link>
  )
}
