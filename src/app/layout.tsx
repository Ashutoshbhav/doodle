import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Bricolage_Grotesque,
  Caveat,
  Bagel_Fat_One,
} from "next/font/google";
import { Providers } from "@/components/Providers";
import { SmoothScroll } from "@/components/motion";
import { env } from "@/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "wdth"],
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

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "DOODLE — modular kids' clothing with interchangeable patches",
    template: "%s · DOODLE",
  },
  description:
    "Modular clothing, backpacks and accessories that kids design themselves. Swap patches, mix outfits, grow with the wardrobe. Pre-launch — join the waitlist.",
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
      "Kids design their own clothes. Swap patches on tees, backpacks and accessories. Join the waitlist.",
    locale: "en_IN",
    images: [{ url: "/brand/wordmark-logo.jpeg", width: 2048, height: 2048, alt: "DOODLE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DOODLE — modular kids' clothing with interchangeable patches",
    description:
      "Kids design their own clothes. Swap patches on tees, backpacks and accessories. Join the waitlist.",
    images: ["/brand/wordmark-logo.jpeg"],
  },
  icons: {
    icon: "/brand/wordmark-logo.jpeg",
    apple: "/brand/wordmark-logo.jpeg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f1ec",
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
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${caveat.variable} ${bagel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        <Providers>
          <SmoothScroll>{children}</SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
