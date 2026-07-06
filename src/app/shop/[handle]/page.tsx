import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { medusa, isCommerceConfigured } from "@/lib/medusa/client"
import { getIndiaRegionId } from "@/lib/medusa/cart"
import { VariantPicker } from "@/components/shop/VariantPicker"
import { LazyPatchScrubber } from "@/components/ui/LazyPatchScrubber"
import { NavWithCart } from "@/components/sections/NavWithCart"
import { Footer } from "@/components/sections/Footer"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { BuildYourTee } from "@/components/sections/BuildYourTee"
import { ProductDetails } from "@/components/shop/ProductDetails"
import { ProductGallery } from "@/components/shop/ProductGallery"
import { ProductInfoBlocks } from "@/components/shop/ProductInfoBlocks"
import { CartDrawerProvider } from "@/components/shop/CartDrawer"
import { fetchSuggestions } from "@/lib/medusa/suggestions"
import { PatchWall } from "@/components/sections/PatchWall"
import type { Product } from "@/lib/medusa/types"

export const dynamic = "force-dynamic"

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://doodlebycanvas.in"

async function fetchProduct(handle: string): Promise<Product | null> {
  if (!isCommerceConfigured) return null
  try {
    const regionId = await getIndiaRegionId()
    const { products } = await medusa.store.product.list({
      handle,
      limit: 1,
      // Field-prefix traps (both verified against the live API):
      // - "*options" AND "*options.values": asking only for the nested
      //   relation strips the option's own id/title, which silently broke
      //   variant matching (option buttons could never resolve a variant).
      // - "+variants.inventory_quantity" (PLUS): inventory is a computed
      //   field; with "*" Medusa returns undefined and every stock state
      //   (sold out / only-N-left) runs on missing data.
      fields:
        "*variants.calculated_price,*variants.options,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder,*options,*options.values,*images,thumbnail,handle,title,description,subtitle,origin_country,metadata",
      region_id: regionId,
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
  // No product: either commerce is off (showroom fallback renders — point
  // Google at /shop and don't index the duplicate) or the handle is junk
  // (the page 404s; keep metadata inert). Never self-canonicalize an
  // arbitrary handle — that minted infinite duplicate URLs.
  if (!product) {
    return {
      title: "DOODLE",
      alternates: { canonical: "/shop" },
      robots: { index: false, follow: true },
    }
  }
  const ogImage = product.images?.[0]?.url ?? product.thumbnail ?? undefined
  return {
    title: `${product.title} — DOODLE`,
    description: product.description?.slice(0, 160) ?? undefined,
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

  // Commerce ON + unknown handle = a real 404, not a soft-404 lookalike.
  if (!product && isCommerceConfigured) {
    notFound()
  }

  // Commerce is deferred (no Medusa backend yet) → render the real, viewable
  // static Starter Kit PDP instead of a 404, built from the live pieces
  // (noindexed + canonicalized to /shop in generateMetadata above).
  if (!product) {
    return (
      <>
        <NavWithCart />
        <main className="bg-[color:var(--color-surface-blush)]">
          <BuildYourTee />
          <ProductDetails />
          <PatchWall />
        </main>
        <Footer />
      </>
    )
  }

  const suggestions = await fetchSuggestions([handle])
  // Garment products get sizing/fabric/care blocks; patch products get
  // patch-specific material and care facts.
  const infoKind: "garment" | "patches" =
    handle === "modular-tee" || handle === "starter-kit" ? "garment" : "patches"

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
        <CartDrawerProvider suggestions={suggestions}>
        <section className="mx-auto max-w-7xl px-6 md:px-10 py-12 md:py-20">
          {/* Breadcrumb — quiet clean-sans wayfinding */}
          <nav className="flex items-center gap-2 text-xs font-medium text-doodle-ink/50">
            <Link href="/" className="transition-colors hover:text-doodle-ink">Home</Link>
            <span aria-hidden className="text-doodle-ink/25">/</span>
            <Link href="/shop" className="transition-colors hover:text-doodle-ink">Shop</Link>
            <span aria-hidden className="text-doodle-ink/25">/</span>
            <span className="truncate text-doodle-ink/70">{product.title}</span>
          </nav>

          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* MEDIA — accurate product photos FIRST (the converting asset),
                then the PatchScrubber as the interactive toy below. */}
            <div className="relative">
              <ProductGallery images={images} alt={product.title ?? "DOODLE product"} />

              <div className="relative mt-5 overflow-hidden rounded-[1rem] bg-doodle-stitch p-5 shadow-card sm:p-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-doodle-ink/55">
                  Try the patch swap
                </p>
                {/* Loads its chunk only when scrolled near — keeps the PDP's
                    first paint about the photos, not the toy. */}
                <LazyPatchScrubber />
              </div>
            </div>

            {/* INFO COLUMN — clean composition. One orange accent lives in the
                add-to-cart (VariantPicker → PillButton). */}
            <div className="lg:pt-2">
              <Eyebrow variant="rule" accent="orange">First drop</Eyebrow>
              <h1 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="mt-3 font-display text-xl italic text-doodle-ink/65">
                  {product.subtitle}
                </p>
              )}
              {product.description && (
                <p className="mt-5 max-w-md text-base leading-relaxed text-doodle-ink/75">
                  {product.description}
                </p>
              )}

              <div className="mt-10">
                <VariantPicker product={product} />
              </div>

              {/* Origin / shipping — clean sans rows on a soft card, not mono.
                  Country of origin satisfies the E-Commerce Rules 2020 mandate. */}
              <dl className="mt-10 divide-y divide-doodle-ink/10 rounded-[1rem] bg-doodle-canvas px-5 shadow-subtle">
                <div className="flex items-center justify-between py-3.5 text-sm">
                  <dt className="text-doodle-ink/60">Country of origin</dt>
                  <dd className="font-medium text-doodle-ink">{countryOfOrigin}</dd>
                </div>
                <div className="flex items-center justify-between py-3.5 text-sm">
                  <dt className="text-doodle-ink/60">Shipping</dt>
                  <dd className="font-medium text-doodle-ink">Free over ₹999</dd>
                </div>
              </dl>

              {/* Sizing, fabric/care, and the trust panel — the buy-decision
                  blocks that used to render only on the fallback page. */}
              <ProductInfoBlocks kind={infoKind} />
            </div>
          </div>
        </section>
        </CartDrawerProvider>
      </main>
      <Footer />
    </>
  )
}
