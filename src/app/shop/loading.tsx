/* Route-level loading UI — the PLP does a backend round-trip on every
   render; a branded skeleton beats a frozen white screen on 4G. */
export default function ShopLoading() {
  return (
    <main className="min-h-screen bg-[color:var(--color-surface-blush)]">
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="h-3 w-24 animate-pulse rounded-full bg-doodle-ink/10" />
        <div className="mt-6 h-12 w-64 animate-pulse rounded-2xl bg-doodle-ink/10" />
        <div className="mt-14 grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] rounded-[1.25rem] bg-doodle-ink/8" />
              <div className="mt-3 h-4 w-3/4 rounded-full bg-doodle-ink/10" />
              <div className="mt-2 h-4 w-1/3 rounded-full bg-doodle-ink/8" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
