/* Basket skeleton. */
export default function CartLoading() {
  return (
    <main className="min-h-screen bg-[color:var(--color-surface-blush)]">
      <section className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
        <div className="h-3 w-24 animate-pulse rounded-full bg-doodle-ink/10" />
        <div className="mt-6 h-10 w-52 animate-pulse rounded-2xl bg-doodle-ink/10" />
        <div className="mt-10 space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex animate-pulse gap-4 rounded-[1.25rem] bg-doodle-canvas p-5 shadow-card">
              <div className="h-24 w-20 rounded-lg bg-doodle-ink/8" />
              <div className="flex-1">
                <div className="h-5 w-1/2 rounded-full bg-doodle-ink/10" />
                <div className="mt-2 h-4 w-1/4 rounded-full bg-doodle-ink/8" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
