"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en-IN">
      <body
        style={{
          backgroundColor: "#f4f1ec",
          color: "#2a2a2e",
          fontFamily: "system-ui, sans-serif",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Something doodled wrong.</h1>
          <p style={{ color: "#6e695e", marginBottom: 24 }}>
            We hit an unexpected error. Our team has been notified.
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 20px",
              background: "#e87a3d",
              color: "#fff",
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            Back to safety
          </a>
        </div>
      </body>
    </html>
  );
}
