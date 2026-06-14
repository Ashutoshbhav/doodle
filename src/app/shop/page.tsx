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
          <div className="max-w-3xl">
            <Eyebrow variant="mono" accent="orange">First drop</Eyebrow>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              Build the kit.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-doodle-ink/70">
              Pick a tee. Pick patches. Or grab a kit — same idea, less thinking.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="mt-14 rounded-lg bg-doodle-canvas p-10 border-2 border-dashed border-doodle-ink/20 text-center">
              <p className="font-display text-2xl text-doodle-ink">
                Almost there.
              </p>
              <p className="mt-3 text-doodle-ink/70 max-w-md mx-auto">
                The first drop is being packed right now.
                Drop your email below and we&apos;ll write the day it&apos;s live.
              </p>
            </div>
          ) : (
            <div className="mt-14 grid gap-6 grid-cols-2 lg:grid-cols-4">
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
