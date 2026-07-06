import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Content-Security-Policy allowlist — covers the site's real third parties:
// Cloudinary (images), PostHog (analytics), Meta Pixel + gtag (/drop ads),
// Razorpay (checkout), Sentry (errors), Vercel, and the Medusa backend.
// 'unsafe-inline'/'unsafe-eval' on script-src is the pragmatic Next.js baseline
// (the framework's hydration + the inline Meta Pixel need it). Hardening path =
// nonce-based CSP via proxy.ts in v1.1.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://www.googletagmanager.com https://checkout.razorpay.com https://*.posthog.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://api.doodlebycanvas.in https://*.doodlebycanvas.in https://*.up.railway.app https://www.facebook.com https://*.posthog.com https://*.razorpay.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.doodlebycanvas.in https://*.doodlebycanvas.in https://*.up.railway.app https://*.posthog.com https://www.facebook.com https://*.razorpay.com https://api.razorpay.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://vitals.vercel-insights.com",
  "frame-src 'self' https://*.razorpay.com https://api.razorpay.com https://checkout.razorpay.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Product images come from the Medusa backend (local /static or MinIO) and
    // optionally Cloudinary. Wildcards cover prod (api.doodlebycanvas.in),
    // Railway during cutover, and local dev (Medusa on :9000).
    remotePatterns: [
      { protocol: "https", hostname: "api.doodlebycanvas.in" },
      { protocol: "https", hostname: "**.doodlebycanvas.in" },
      { protocol: "https", hostname: "**.up.railway.app" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "http", hostname: "localhost", port: "9000" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  // Skip source map upload entirely if Sentry isn't configured (no auth token).
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
  // disableLogger / automaticVercelMonitors / reactComponentAnnotation
  // are Turbopack-incompatible and deprecated in this code path — omit them.
});
