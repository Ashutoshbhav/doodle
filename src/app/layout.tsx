import type { Metadata, Viewport } from "next";
import {
  Nunito,
  Baloo_2,
  Caveat,
  Bagel_Fat_One,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/Providers";
import { ConsentBanner } from "@/components/ui/ConsentBanner";
import { SmoothScroll } from "@/components/motion";
import { env } from "@/env";
import "./globals.css";

// CANDY PASTEL type pairing (Ash, 2026-07-07): rounded and kid-first.
// Body + commerce voice: Nunito — rounded terminals, hugely readable at
// small commerce sizes, friendly without tipping into toy-store.
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

// Display voice: Baloo 2 — chubby, rounded, warm; drawn by Ek Type
// (Mumbai), which suits a made-in-India kids brand down to the metadata.
// Replaces Bricolage Grotesque's editorial quirk. Geist Mono is retired
// with this pass (one fewer family to download); font-mono now falls
// back to the sans stack.
const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  display: "swap",
});

// Caveat kept as a single accent voice for handwritten micro-moments
// (e.g. "try it ↓" labels).
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

// Bagel Fat One re-introduced 2026-05-12 for the controlled single-word
// type-as-object hero treatment (per design-supervisor audit anchored to
// Agence Foudre). NOT for general use — reserved for the one "CREATE."
// hero stamp. If you find yourself reaching for this anywhere else, stop
// and verify with the supervisor first.
const bagel = Bagel_Fat_One({
  variable: "--font-bagel",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://doodlebycanvas.in";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DOODLE by CANVAS",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
};

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  // NO site-wide canonical here: Next merges metadata, so a root canonical
  // of "/" makes every page without its own alternates claim to be a
  // duplicate of the homepage. Each indexable page sets its own.
  title: {
    default: "DOODLE — modular kids' clothing with interchangeable patches",
    template: "%s · DOODLE",
  },
  description:
    "Modular kids' clothing that kids design themselves. One tee, swappable velcro patches, infinite personalities. Made in India, ships across India.",
  applicationName: "DOODLE",
  authors: [{ name: "DOODLE by CANVAS" }],
  keywords: [
    "kids clothing",
    "modular kids wear",
    "interchangeable patches",
    "kids backpacks",
    "DOODLE",
    "CANVAS",
  ],
  openGraph: {
    type: "website",
    siteName: "DOODLE by CANVAS",
    title: "DOODLE — modular kids' clothing with interchangeable patches",
    description:
      "Kids design their own clothes. One tee, swappable patches, infinite personalities. Shop the first drop.",
    locale: "en_IN",
    // Dedicated 1200x630 card under 300 KB — WhatsApp (the real sharing
    // channel here) silently drops previews for oversized images.
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "DOODLE — Don't Just Dress. Create." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DOODLE — modular kids' clothing with interchangeable patches",
    description:
      "Kids design their own clothes. One tee, swappable patches, infinite personalities. Shop the first drop.",
    images: ["/og.png"],
  },
  // Favicons come from the src/app/icon.png + apple-icon.png conventions.
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#fffbf2",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${nunito.variable} ${baloo.variable} ${caveat.variable} ${bagel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        {/* Skip link — visible only on keyboard focus */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-doodle-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-doodle-canvas"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <Providers>
          <SmoothScroll>{children}</SmoothScroll>
          <ConsentBanner />
        </Providers>
        {/* Cookieless aggregate pageviews (Vercel Web Analytics) — the
            zero-consent measurement floor. PostHog/pixels stay consent-gated;
            this counts sessions without identifying anyone, so funnel
            denominators are real even when the banner is ignored.
            No-ops until Web Analytics is enabled on the Vercel project. */}
        <Analytics />
      </body>
    </html>
  );
}
