"use client"

import * as React from "react"
import Image from "next/image"

/* PDP media gallery — scroll-snap track with thumbnails. First media on a
   converting PDP is an accurate product photo; swipe/scroll for the rest.
   Native pinch-zoom keeps working on mobile because these are plain images
   in a scrollable track, not a transformed canvas. */

export function ProductGallery({
  images,
  alt,
}: {
  images: string[]
  alt: string
}) {
  const trackRef = React.useRef<HTMLDivElement | null>(null)
  const [active, setActive] = React.useState(0)

  function onScroll() {
    const el = trackRef.current
    if (!el) return
    setActive(Math.round(el.scrollLeft / el.clientWidth))
  }

  function goTo(i: number) {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" })
  }

  if (images.length === 0) return null

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-[1rem] shadow-card [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label={`${alt} photos`}
      >
        {images.map((src, i) => (
          <div
            key={src}
            className="relative aspect-[4/5] w-full shrink-0 snap-center bg-doodle-stitch"
          >
            <Image
              src={src}
              alt={`${alt} — photo ${i + 1} of ${images.length}`}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Photo ${i + 1}`}
              aria-current={active === i}
              className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-lg transition-[box-shadow,opacity] ${
                active === i
                  ? "ring-2 ring-doodle-orange opacity-100"
                  : "opacity-65 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
