import type { MetadataRoute } from "next";
import { medusa, isCommerceConfigured } from "@/lib/medusa/client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://doodlebycanvas.in";

// Static route list — always emitted, no network dependency. /shop joins
// only when commerce is actually on (in waitlist mode it's a noindexed
// empty state and has no business in the sitemap).
const ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  ...(isCommerceConfigured
    ? [{ path: "/shop", priority: 0.9, changeFrequency: "weekly" as const }]
    : []),
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/size-guide", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/refunds", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/shipping", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" as const },
];

type SitemapProduct = { handle?: string | null; updated_at?: string | null };

// Build-safe product fetch — same field/query style as the shop pages, with a
// try/catch → [] fallback so a backend outage never breaks the build.
async function fetchProductEntries(): Promise<SitemapProduct[]> {
  if (!isCommerceConfigured) return [];
  try {
    const { products } = await medusa.store.product.list({
      limit: 1000,
      fields: "handle,updated_at",
    });
    return products as unknown as SitemapProduct[];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const products = await fetchProductEntries();
  const productEntries: MetadataRoute.Sitemap = products
    .filter((p): p is SitemapProduct & { handle: string } => Boolean(p.handle))
    .map((p) => ({
      url: `${BASE_URL}/shop/${p.handle}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [...staticEntries, ...productEntries];
}
