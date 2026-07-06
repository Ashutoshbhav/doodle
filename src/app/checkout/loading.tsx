/* Checkout skeleton — form column + summary aside. */
export default function CheckoutLoading() {
  return (
    <main className="min-h-screen bg-[color:var(--color-surface-blush)]">
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:px-10 md:py-20 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="h-3 w-24 animate-pulse rounded-full bg-doodle-ink/10" />
          <div className="mt-5 h-10 w-64 animate-pulse rounded-2xl bg-doodle-ink/10" />
          <div className="mt-10 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-lg bg-doodle-canvas shadow-card" />
            ))}
          </div>
        </div>
        <div className="h-72 animate-pulse rounded-[1rem] bg-doodle-canvas shadow-card lg:sticky lg:top-24" />
      </section>
    </main>
  )
}
