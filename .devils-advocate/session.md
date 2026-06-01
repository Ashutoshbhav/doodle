- 2026-05-03 17:00 — check-1 — FAIL — 2 TS errors block build (`Icon` type not in SSR subpath, PatchWall.tsx:31 + Founders.tsx:12); Hero.tsx:53 dynamic `bg-${c}` Tailwind classes purge (invisible avatar dots); Footer.tsx:111 gratuitous dSIH; 2 ESLint errors (WhyDoodle.tsx:173 unescaped `'`, PatchScrubber.tsx:303 setState-in-effect); 2 unused imports

## Check #2 — Critique | 2026-05-15 17:40 | 8e68dff

**Result:** 15/20

**Failing:**
1. tests-pass / tests-exist — zero tests in repo
2. logic-correct — Pixel Lead has no eventID (double-count on repeat/refresh)
3. error-handling / no-hacky-shortcuts — success returned when DB row not persisted; conversion fires on lost lead
4. no-code-smell — dead hidden `name` field; onConflictDoNothing can't distinguish new vs repeat
5. no-hacky-shortcuts — production deployed from uncommitted tree vs GitHub-connected Vercel project

**Summary:** Code is type-clean (`tsc --noEmit` exit 0) and the Next.js 16 async-searchParams + server/client boundaries are correct; normalizeSource() preserves per-creative attribution (`lcl_may26:meta:m1` round-trips intact); no secret exposure (.env* gitignored, only src/env.ts schema tracked). The two campaign-killing risks are operational, not syntactic: (1) waitlist.ts returns success even when the row is NOT persisted (missing DATABASE_URL = 100% silent signup loss while ad platforms report leads — Sentry is an error tracker, not a lead store), and (2) ALL campaign files are uncommitted (only commit = 8e68dff "Initial commit") while the Vercel project is GitHub-connected, so any git-triggered build promotes 8e68dff (no /drop, old waitlist) to production and overwrites the live campaign alias mid-flight. Both must be fixed before ₹5,000 spend. Unverified: actual Vercel project/deploy/env state, npm run build, Sentry DSN in prod, Neon migration applied.
