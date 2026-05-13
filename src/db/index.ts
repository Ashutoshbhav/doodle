import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema";

// Required for Node.js runtime — Neon serverless driver speaks WebSocket.
// In Edge / browser this is a no-op.
if (typeof globalThis.WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

type Schema = typeof schema;

let _db: NeonDatabase<Schema> | null = null;

/**
 * Owner-role connection. BYPASSRLS. Use for migrations, webhooks, admin reads.
 *
 * Returns null when DATABASE_URL is unset — callers must handle this and
 * fall back gracefully (e.g., log to console). This lets the app build
 * and dev-run without a live DB so we don't gate front-end work on Neon.
 */
export function getDb(): NeonDatabase<Schema> | null {
  if (!process.env.DATABASE_URL) return null;
  if (_db) return _db;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  _db = drizzle({ client: pool, schema });
  return _db;
}

export { schema };
