/* PDP skeleton — mirrors the gallery + info-column layout. */
export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-[color:var(--color-surface-blush)]">
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        <div className="h-3 w-40 animate-pulse rounded-full bg-doodle-ink/10" />
        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-pulse">
            <div className="aspect-[4/5] w-full rounded-[1rem] bg-doodle-ink/8" />
            <div className="mt-3 flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 w-14 rounded-lg bg-doodle-ink/8" />
              ))}
            </div>
          </div>
          <div className="animate-pulse lg:pt-2">
            <div className="h-3 w-20 rounded-full bg-doodle-ink/10" />
            <div className="mt-5 h-10 w-3/4 rounded-2xl bg-doodle-ink/10" />
            <div className="mt-5 h-4 w-full rounded-full bg-doodle-ink/8" />
            <div className="mt-2 h-4 w-5/6 rounded-full bg-doodle-ink/8" />
            <div className="mt-10 flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 w-20 rounded-full bg-doodle-ink/8" />
              ))}
            </div>
            <div className="mt-8 h-9 w-28 rounded-2xl bg-doodle-ink/10" />
            <div className="mt-6 h-12 w-44 rounded-full bg-doodle-ink/10" />
          </div>
        </div>
      </section>
    </main>
  )
}
