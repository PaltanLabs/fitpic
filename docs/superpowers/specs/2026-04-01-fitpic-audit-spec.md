# FitPic Audit & Improvement Spec

## Context

FitPic is a client-side photo/signature resizer for Indian government exam applications at www.fitpic.in. After 3 weeks live, the site has ~11 organic visits total. The product works but has critical SEO, UX, and performance issues blocking growth.

**Goal:** Make FitPic discoverable, fast, and frictionless so organic users actually complete the resize workflow.

**Success criteria:**
- Organic traffic doubles within 4 weeks of deploy
- Users from search complete the upload-to-download funnel (tracked via PostHog custom events)
- Lighthouse Performance score >80 on mobile for photo-resizer page
- All tool pages have proper schema markup for rich snippets

---

## Phase 1 — Quick Wins (unblock users + fix critical issues)

### 1.1 Lazy-load TensorFlow/MediaPipe

**Problem:** `whiteBackground.ts` statically imports TensorFlow body-segmentation (~2-5MB). This is bundled into every page that imports `PhotoResizerClient` or `ExamToolClient`, even though white background is an optional toggle.

**Fix:** Dynamic import `whiteBackground.ts` only when the user enables the white background toggle. In `photoSource.ts`, change the static import to a dynamic `import()` call inside `preparePhotoSourceImage` when `whiteBackgroundMode` is true.

**Files:** `lib/photoSource.ts`, `app/background-remover/BgRemoverClient.tsx`

### 1.2 Lazy-instantiate Pica

**Problem:** `imageEngine.ts` line 14: `const pica = new Pica()` runs at module load, spinning up a WebWorker pool immediately.

**Fix:** Lazy-instantiate inside `processImage()` on first call:
```ts
let _pica: Pica | null = null;
function getPica() {
  if (!_pica) _pica = new Pica();
  return _pica;
}
```

**Files:** `lib/imageEngine.ts`

### 1.3 Lazy-load PostHog

**Problem:** `posthog-js` (~50KB gzipped) is eagerly imported on every page.

**Fix:** Dynamic import inside the `useEffect` in `PostHogProvider.tsx`:
```ts
useEffect(() => {
  if (!POSTHOG_KEY) return;
  import("posthog-js").then((mod) => {
    const posthog = mod.default;
    posthog.init(POSTHOG_KEY, { ... });
  });
}, []);
```

Update `lib/analytics.ts` to handle the case where posthog isn't loaded yet (queue events or use `posthog-js`'s built-in buffering).

**Files:** `components/PostHogProvider.tsx`, `lib/analytics.ts`

### 1.4 Add og:image and og:url to all pages

**Problem:** No social preview image on any page. Sharing on WhatsApp/Twitter shows a blank card.

**Fix:**
- Create a default OG image (1200x630) in `public/og-default.png` with FitPic branding
- Add `og:image` and `og:url` to the root layout metadata
- Override with page-specific OG images where relevant (exam pages can share a generic one)

**Files:** `app/layout.tsx`, `public/og-default.png` (new), `components/SEOHead.tsx`

### 1.5 Add error handling to PhotoResizerClient

**Problem:** `handleResize` has try/finally but no catch — errors are silently swallowed.

**Fix:** Add catch block with error state display, matching the pattern used in `BgRemoverClient`.

**Files:** `app/photo-resizer/PhotoResizerClient.tsx`

### 1.6 Move ad slot below exam selector

**Problem:** `<AdSlot slot="photo-top">` renders before the tool, pushing the exam selector below fold on mobile.

**Fix:** Move the top ad slot to after the `ExamPresetSelector` component.

**Files:** `app/photo-resizer/PhotoResizerClient.tsx`, `app/signature-resizer/SignatureResizerClient.tsx`

### 1.7 Fix download button format label

**Problem:** Download button always says "JPEG" even for PNG presets.

**Fix:** Use `preset.format.toUpperCase()` in the button text.

**Files:** `components/ResultPreview.tsx`

---

## Phase 2 — UX Overhaul (convert visitors into users)

### 2.1 Upload-first flow on photo-resizer

**Problem:** Upload zone is hidden behind mandatory preset selection. General users bounce.

**Fix:**
- Show upload zone immediately, regardless of preset selection
- Allow the flow: upload photo -> select exam (or custom) -> resize
- When no preset is selected, show a "Choose your exam or enter custom dimensions" prompt after upload
- Surface "Custom Size" as a visible first option (card or pill) — currently filtered out of ExamPresetSelector

**Files:** `app/photo-resizer/PhotoResizerClient.tsx`, `components/ExamPresetSelector.tsx`

### 2.2 Add search to exam preset selector

**Problem:** 111 presets, no search. Users must browse categories and scroll.

**Fix:**
- Add a search input at the top of `ExamPresetSelector`
- Filter across `preset.name`, `preset.exam`, and `preset.searchKeywords` (data already exists)
- Show matching presets directly, bypassing category pills when searching
- Keep category pill browsing as fallback

**Files:** `components/ExamPresetSelector.tsx`

### 2.3 Add social proof and trust signals

**Problem:** No evidence of other users. Users are uploading personal exam photos to an unknown tool.

**Fix:**
- Add a counter on homepage and tool pages: "X photos resized" (can start with a reasonable seed number + increment via PostHog events, or hardcode initially)
- Add privacy badge: "Your photos never leave your browser" with lock icon
- Add a line: "Used by students preparing for SSC, UPSC, IBPS, Railway exams"

**Files:** `app/page.tsx`, `app/photo-resizer/PhotoResizerClient.tsx`, new shared component `components/TrustBadge.tsx`

### 2.4 Homepage inline quick-start

**Problem:** Homepage is a link directory. No inline tool interaction.

**Fix:**
- Add a prominent CTA section above the fold: "Resize Your Photo Now" button linking to `/photo-resizer`
- Or better: add a mini exam selector + upload zone inline on the homepage that navigates to the tool with state
- Keep the existing exam table for SEO but collapse categories by default

**Files:** `app/page.tsx`

### 2.5 Add loading spinner to photo-resizer

**Problem:** Only "Processing..." text, no visual feedback.

**Fix:** Add spinner animation matching the background-remover pattern.

**Files:** `app/photo-resizer/PhotoResizerClient.tsx`, `app/signature-resizer/SignatureResizerClient.tsx`

### 2.6 Improve Background Remover preset dropdown

**Problem:** Raw `<select>` with 100+ options, no grouping.

**Fix:** Add `<optgroup>` tags grouped by exam category.

**Files:** `app/background-remover/BgRemoverClient.tsx`

---

## Phase 3 — SEO Content (rank for more keywords)

### 3.1 Add FAQ + schema to generic tool pages

**Problem:** `/photo-resizer` and `/signature-resizer` have no FAQ sections, no FAQPage schema, no BreadcrumbList. These are the highest-value generic pages.

**Fix:**
- Add 5-8 FAQs per page (e.g., "What size photo do I need for government exams?", "How do I compress a photo to 50KB?")
- Add FAQPage JSON-LD
- Add BreadcrumbList JSON-LD
- Add HowTo JSON-LD matching the step flow

**Files:** `app/photo-resizer/page.tsx`, `app/signature-resizer/page.tsx`, `components/SEOHead.tsx`

### 3.2 Broaden homepage title and meta for generic keywords

**Problem:** Title only targets "Govt Exams", missing "resize photo online", "photo compressor", "image resizer".

**Fix:**
- Title: "Free Photo Resizer & Compressor | Resize to Exact KB & Pixels | FitPic"
- Meta description: include "resize photo online", "compress image to KB", "passport photo resizer"
- Add content section targeting these keywords

**Files:** `app/page.tsx`

### 3.3 Add hreflang tags for Hindi pages

**Problem:** Hindi pages exist but most pages lack bidirectional hreflang annotations.

**Fix:**
- Add `<link rel="alternate" hreflang="en">` and `<link rel="alternate" hreflang="hi">` on all pages with Hindi counterparts
- Add `hreflang="x-default"` pointing to English version

**Files:** `components/SEOHead.tsx` or layout-level metadata

### 3.4 Add HowTo schema to homepage and generic tool pages

**Problem:** Homepage has "How It Works" section but no HowTo JSON-LD.

**Fix:** Add HowTo schema matching the 3-step flow.

**Files:** `app/page.tsx`, `components/SEOHead.tsx`

### 3.5 Add WebSite schema with SearchAction

**Problem:** No sitelinks searchbox potential.

**Fix:** Add WebSite schema with SearchAction to homepage.

**Files:** `app/page.tsx`

### 3.6 Collapse homepage exam table by default

**Problem:** 110+ presets in a massive table dominate the page, poor scannability.

**Fix:** Use `<details>` to collapse each category, show only top popular exams by default. "See all 150+ exams" expand link.

**Files:** `app/page.tsx`

---

## Out of Scope

- Hindi page expansion (valuable but large content effort)
- Service worker / PWA offline support
- Accessibility overhaul (important but separate effort)
- Ad optimization
- New features (only fixing existing ones)

## Risks

- Lazy-loading TensorFlow may add a perceived delay when user first enables white background — mitigate with loading indicator
- Changing the upload-first flow changes the core UX — need to test that exam-specific users aren't confused
- SEO changes take 2-4 weeks to reflect in Google rankings
