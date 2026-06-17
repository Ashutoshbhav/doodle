import { notFound } from "next/navigation"
import Image from "next/image"
import type { Metadata } from "next"
import { medusa, isCommerceConfigured } from "@/lib/medusa/client"
import { VariantPicker } from "@/components/shop/VariantPicker"
import { NavWithCart } from "@/components/sections/NavWithCart"
import { Footer } from "@/components/sections/Footer"
import { Eyebrow } from "@/components/ui/Eyebrow"
import type { Product } from "@/lib/medusa/types"

export const dynamic = "force-dynamic"

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://doodlebycanvas.in"

async function fetchProduct(handle: string): Promise<Product | null> {
  if (!isCommerceConfigured) return null
  try {
    const { products } = await medusa.store.product.list({
      handle,
      limit: 1,
      fields:
        "*variants.calculated_price,*variants.options,*variants.inventory_quantity,*variants.manage_inventory,*variants.allow_backorder,*options.values,*images,thumbnail,handle,title,description,subtitle,origin_country,metadata",
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
  const ogImage = product?.images?.[0]?.url ?? product?.thumbnail ?? undefined
  return {
    title: product ? `${product.title} — DOODLE` : "DOODLE",
    description: product?.description?.slice(0, 160) ?? undefined,
    alternates: {
      canonical: `/shop/${handle}`,
    },
    openGraph: ogImage ? { images: [ogImage] } : undefined,
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

  // Country of origin — India Consumer Protection (E-Commerce) Rules 2020.
  // Source: Medusa product `origin_country`, else `metadata.country_of_origin`,
  // else default to India (DOODLE is made in India).
  const metaOrigin = product.metadata?.country_of_origin
  const countryOfOrigin =
    product.origin_country?.trim() ||
    (typeof metaOrigin === "string" ? metaOrigin.trim() : "") ||
    "India"

  const productUrl = `${SITE_URL}/shop/${handle}`
  const images = (product.images ?? [])
    .map((img) => img.url)
    .filter((url): url is string => Boolean(url))

  // Price: same currency/amount the page displays — first variant carrying a
  // calculated_price. Omit offers entirely if unavailable rather than emit bad data.
  const offerVariant = product.variants?.find(
    (v) => v.calculated_price?.calculated_amount != null
  )
  const offerAmount = offerVariant?.calculated_price?.calculated_amount

  // In-stock derivation mirrors VariantPicker: in stock unless every variant
  // explicitly reports zero/negative inventory.
  const variants = product.variants ?? []
  const inStock =
    variants.length === 0 ||
    variants.some(
      (v) => v.inventory_quantity == null || (v.inventory_quantity ?? 0) > 0
    )

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    ...(images.length > 0 ? { image: images } : {}),
    ...(product.description ? { description: product.description } : {}),
    brand: { "@type": "Brand", name: "DOODLE" },
    url: productUrl,
    ...(offerAmount != null
      ? {
          offers: {
            "@type": "Offer",
            price: offerAmount,
            priceCurrency: "INR",
            availability: inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: productUrl,
          },
        }
      : {}),
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: `${SITE_URL}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: productUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <NavWithCart />
      <main className="bg-[color:var(--color-surface-blush)] min-h-screen">
        <section className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24 grid gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden border-2 border-dashed border-doodle-ink/20 bg-doodle-stitch">
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
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-doodle-ink/40">
                  Photo coming soon
                </span>
              </div>
            )}
          </div>

          <div>
            <Eyebrow variant="mono" accent="orange">First drop</Eyebrow>
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

            <div className="mt-10 space-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-doodle-ink/40">
              <div>Country of Origin: {countryOfOrigin}</div>
              <div>Free shipping on orders above ₹999</div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
