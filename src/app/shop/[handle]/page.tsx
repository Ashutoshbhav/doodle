import { notFound } from "next/navigation"
import Image from "next/image"
import type { Metadata } from "next"
import { medusa, isCommerceConfigured } from "@/lib/medusa/client"
import { VariantPicker } from "@/components/shop/VariantPicker"
import { NavWithCart } from "@/components/sections/NavWithCart"
import { Footer } from "@/components/sections/Footer"
import type { Product } from "@/lib/medusa/types"

export const dynamic = "force-dynamic"

async function fetchProduct(handle: string): Promise<Product | null> {
  if (!isCommerceConfigured) return null
  try {
    const { products } = await medusa.store.product.list({
      handle,
      limit: 1,
      fields:
        "*variants.calculated_price,*variants.options,*variants.inventory_quantity,*options.values,*images,thumbnail,handle,title,description,subtitle",
    })
    return (products[0] as unknown as Product) ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await fetchProduct(handle)
  return {
    title: product ? `${product.title} — DOODLE` : "DOODLE",
    description: product?.description?.slice(0, 160) ?? undefined,
  }
}

export default async function PDPPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await fetchProduct(handle)
  if (!product) notFound()

  const hero = product.images?.[0]?.url ?? product.thumbnail ?? null

  return (
    <>
      <NavWithCart />
      <main className="bg-[color:var(--color-surface-blush)] min-h-screen">
        <section className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24 grid gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] rounded-[1.75rem] overflow-hidden border-2 border-dashed border-doodle-ink/20 bg-doodle-stitch">
            {hero ? (
              <Image
                src={hero}
                alt={product.title ?? ""}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="grid place-items-center h-full">
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-doodle-ink/40">
                  Photo coming soon
                </span>
              </div>
            )}
          </div>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-doodle-ink/55">
              First drop
            </div>
            <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
              {product.title}
            </h1>
            {product.subtitle && (
              <p className="mt-3 text-doodle-ink/70 italic">
                {product.subtitle}
              </p>
            )}
            {product.description && (
              <p className="mt-5 text-base leading-relaxed text-doodle-ink/75 max-w-md">
                {product.description}
              </p>
            )}

            <div className="mt-10">
              <VariantPicker product={product} />
            </div>

            <div className="mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-doodle-ink/40">
              Free shipping on orders above ₹999
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
