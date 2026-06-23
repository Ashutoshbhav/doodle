import { medusa, isCommerceConfigured } from "@/lib/medusa/client"
import { ProductCard } from "@/components/shop/ProductCard"
import { NavWithCart } from "@/components/sections/NavWithCart"
import { Footer } from "@/components/sections/Footer"
import { Eyebrow } from "@/components/ui/Eyebrow"
import type { Product } from "@/lib/medusa/types"

export const metadata = {
  title: "Shop the drop — DOODLE",
  description:
    "Modular kids' clothing. Pick a tee, pick patches. Or start with a kit.",
  alternates: {
    canonical: "/shop",
  },
}

export const dynamic = "force-dynamic"

async function safeListProducts(): Promise<Product[]> {
  if (!isCommerceConfigured) return []
  try {
    const { products } = await medusa.store.product.list({
      limit: 50,
      fields: "*variants.calculated_price,*images,thumbnail,handle,title",
    })
    return products as unknown as Product[]
  } catch {
    return []
  }
}

export default async function ShopPage() {
  const products = await safeListProducts()

  return (
    <>
      <NavWithCart />
      <main className="bg-[color:var(--color-surface-blush)] min-h-screen">
        <section className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
          {/* PLP header — clean sans eyebrow, display headline, one orange
              emphasis. Filter/count row reads as quiet metadata, not chrome. */}
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <Eyebrow variant="rule" accent="orange">First drop</Eyebrow>
              <h1 className="mt-5 font-display text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
                Build the kit.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-doodle-ink/70">
                Pick a tee. Pick patches. Or grab a kit —{" "}
                <span className="italic text-doodle-orange">same idea, less thinking.</span>
              </p>
            </div>

            {products.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-doodle-canvas px-3.5 py-2 text-xs font-medium text-doodle-ink/65 shadow-subtle">
                {products.length} {products.length === 1 ? "style" : "styles"}
              </span>
            )}
          </div>

          {products.length === 0 ? (
            <div className="mt-14 grid place-items-center rounded-lg bg-doodle-canvas px-6 py-20 text-center shadow-card">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-doodle-orange/12">
                <span className="h-2.5 w-2.5 rounded-full bg-doodle-orange" />
              </span>
              <p className="mt-6 font-display text-3xl text-doodle-ink">
                Almost there.
              </p>
              <p className="mt-3 max-w-md text-base leading-relaxed text-doodle-ink/70">
                The first drop is being packed right now. Drop your email and
                we&apos;ll write the day it&apos;s live.
              </p>
            </div>
          ) : (
            <div className="mt-14 grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
