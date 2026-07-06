"use client"

import * as React from "react"
import dynamic from "next/dynamic"

/* The PatchScrubber is a ~500-line interactive toy. Below the PDP gallery it
   shouldn't cost a byte until the shopper scrolls near it — so its chunk
   loads on approach (IntersectionObserver, 400px lookahead). */

const PatchScrubber = dynamic(
  () => import("@/components/ui/PatchScrubber").then((m) => m.PatchScrubber),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-square w-full animate-pulse rounded-[1.25rem] bg-doodle-ink/8" aria-hidden />
    ),
  },
)

export function LazyPatchScrubber() {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [near, setNear] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el || near) return
    if (!("IntersectionObserver" in window)) {
      setNear(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: "400px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [near])

  return (
    <div ref={ref}>
      {near ? (
        <PatchScrubber />
      ) : (
        <div className="aspect-square w-full rounded-[1.25rem] bg-doodle-ink/8" aria-hidden />
      )}
    </div>
  )
}
