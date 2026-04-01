# FitPic

Client-side photo & signature resizer for Indian government exam applications. All processing happens in the browser — no server uploads.

**Live site:** https://www.fitpic.in
**Repo:** https://github.com/PaltanLabs/fitpic

## Tech Stack

- Next.js 14 (App Router) + TypeScript 5.5
- React 18 + Tailwind CSS 3.4 (dark theme)
- Pica (Lanczos3 image resizing) — lazy-loaded
- TensorFlow body-segmentation + MediaPipe (background removal) — lazy-loaded, only when white bg toggle is on
- PostHog analytics (lazy-loaded) + GA4
- Deployed on Vercel (Bombay region), reverse-proxied PostHog via `/ingest/*`

## Commands

```bash
npm run dev          # Local dev server (port 3000)
npm run build        # Production build
npx tsc --noEmit     # Type check (1 pre-existing error in validators.test.ts — ignore)
npx jest             # Run tests (47 pass, 2 pre-existing failures in seo.test.ts)
```

## Project Structure

- `app/` — Next.js App Router pages. Each tool has a `page.tsx` (server, metadata/SEO) and a `*Client.tsx` (client, interactive logic)
- `app/[exam]/` — 150+ dynamic exam-specific pages generated from presets
- `components/` — Shared components (ImageUploader, ResultPreview, ExamPresetSelector, TrustBadge, PostHogProvider)
- `lib/imageEngine.ts` — Core resize/compress engine (Pica-based, binary search compression)
- `lib/presets.ts` — 150+ exam preset definitions with specs
- `lib/whiteBackground.ts` — TensorFlow-based background removal (heavy, always dynamic-import)
- `lib/analytics.ts` — PostHog event tracking (file_uploaded, process_complete, file_downloaded, preset_selected, process_error)

## Key Patterns

- **Lazy loading:** TensorFlow, Pica, and PostHog are all dynamically imported. Never add static imports for heavy libraries.
- **Preset-driven:** All exam specs come from `lib/presets.ts`. Each preset has searchKeywords for the selector search.
- **Upload-first flow:** Photo resizer shows upload zone immediately, preset selection is separate.
- **SEO:** Exam pages use `components/SEOHead.tsx` for metadata + JSON-LD. Generic tool pages have inline FAQ + schema.

## Environment Variables

```
NEXT_PUBLIC_POSTHOG_KEY    # PostHog project key
NEXT_PUBLIC_POSTHOG_HOST   # PostHog host (defaults to /ingest)
NEXT_PUBLIC_GA_ID          # Google Analytics 4 ID
NEXT_PUBLIC_ADSENSE_ID     # Google AdSense ID
NEXT_PUBLIC_SITE_URL       # Site URL (defaults to https://www.fitpic.in)
```

## Analytics Events

PostHog tracks these custom events across all tools:
- `file_uploaded` — user selects a file
- `preset_selected` — user picks an exam preset
- `process_complete` — resize/join/bg-removal succeeds
- `file_downloaded` — user clicks download
- `process_error` — processing fails

## Don't

- Don't statically import `lib/whiteBackground.ts` — always use `await import()`
- Don't instantiate Pica at module level — use `getPica()` in imageEngine.ts
- Don't add `posthog` static imports — use dynamic import pattern in analytics.ts
- Don't modify exam preset specs without verifying against official exam requirements
