import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
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
