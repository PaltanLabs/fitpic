# FitPic Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix critical SEO, UX, and performance issues so organic users can find FitPic, use it without friction, and complete the resize-to-download workflow.

**Architecture:** Three phases executed sequentially. Phase 1 fixes performance and critical bugs (no UX changes). Phase 2 overhauls the user flow. Phase 3 adds SEO content and schema. Each task produces a working commit.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, PostHog, Pica, TensorFlow/MediaPipe

---

## Phase 1 — Quick Wins

### Task 1: Lazy-instantiate Pica

**Files:**
- Modify: `lib/imageEngine.ts:12-14`

- [ ] **Step 1: Change Pica to lazy initialization**

In `lib/imageEngine.ts`, replace lines 12-14:

```ts
import Pica from "pica";

const pica = new Pica();
```

With:

```ts
import Pica from "pica";

let _pica: Pica | null = null;
function getPica(): Pica {
  if (!_pica) _pica = new Pica();
  return _pica;
}
```

- [ ] **Step 2: Replace all `pica.` references with `getPica().`**

Search `lib/imageEngine.ts` for every call to `pica.resize(` and `pica.toBlob(` and replace with `getPica().resize(` and `getPica().toBlob(`.

- [ ] **Step 3: Run tests**

Run: `cd /tmp/fitpic && npx jest __tests__/imageEngine.test.ts -v`
Expected: All tests PASS (Pica is only instantiated when processImage runs, which tests already call).

- [ ] **Step 4: Commit**

```bash
git add lib/imageEngine.ts
git commit -m "perf: lazy-instantiate Pica to avoid WebWorker pool on page load"
```

---

### Task 2: Lazy-load TensorFlow/MediaPipe

**Files:**
- Modify: `app/photo-resizer/PhotoResizerClient.tsx:14`
- Modify: `app/[exam]/ExamToolClient.tsx:12`
- Modify: `app/background-remover/BgRemoverClient.tsx:4`

The problem: `PhotoResizerClient` and `ExamToolClient` statically import `makeWhiteBackground` from `lib/whiteBackground.ts`, which statically imports TensorFlow (~2-5MB). This bundles TF into every photo tool page even when white background is never used.

- [ ] **Step 1: Remove static import of makeWhiteBackground from PhotoResizerClient**

In `app/photo-resizer/PhotoResizerClient.tsx`, remove line 14:
```ts
import { makeWhiteBackground } from "@/lib/whiteBackground";
```

Replace the `handleResize` function's call to `preparePhotoSourceImage` (around line 63) — change:
```ts
      const prepared = await preparePhotoSourceImage({
        image,
        whiteBackgroundMode,
        makeWhiteBackgroundFn: makeWhiteBackground,
      });
```

To:
```ts
      let makeWhiteBackgroundFn: typeof import("@/lib/whiteBackground").makeWhiteBackground | undefined;
      if (whiteBackgroundMode) {
        const mod = await import("@/lib/whiteBackground");
        makeWhiteBackgroundFn = mod.makeWhiteBackground;
      }
      const prepared = await preparePhotoSourceImage({
        image,
        whiteBackgroundMode,
        makeWhiteBackgroundFn: makeWhiteBackgroundFn ?? (async () => { throw new Error("Not loaded"); }),
      });
```

- [ ] **Step 2: Same change in ExamToolClient**

In `app/[exam]/ExamToolClient.tsx`, remove the static import of `makeWhiteBackground` (line 12):
```ts
import { makeWhiteBackground } from "@/lib/whiteBackground";
```

In the `handleResize` function (around line 57), change:
```ts
        : await preparePhotoSourceImage({
            image,
            whiteBackgroundMode,
            makeWhiteBackgroundFn: makeWhiteBackground,
          });
```

To:
```ts
        : await (async () => {
            let fn: typeof import("@/lib/whiteBackground").makeWhiteBackground | undefined;
            if (whiteBackgroundMode) {
              const mod = await import("@/lib/whiteBackground");
              fn = mod.makeWhiteBackground;
            }
            return preparePhotoSourceImage({
              image,
              whiteBackgroundMode,
              makeWhiteBackgroundFn: fn ?? (async () => { throw new Error("Not loaded"); }),
            });
          })();
```

- [ ] **Step 3: Dynamic import in BgRemoverClient**

In `app/background-remover/BgRemoverClient.tsx`, remove the static import (line 4):
```ts
import { makeWhiteBackground } from "@/lib/whiteBackground";
```

In `handleImageLoad` (around line 34), change:
```ts
        const result = await makeWhiteBackground(img);
```

To:
```ts
        const { makeWhiteBackground } = await import("@/lib/whiteBackground");
        const result = await makeWhiteBackground(img);
```

- [ ] **Step 4: Verify build**

Run: `cd /tmp/fitpic && npx tsc --noEmit 2>&1 | grep -v validators.test`
Expected: No new errors.

- [ ] **Step 5: Commit**

```bash
git add app/photo-resizer/PhotoResizerClient.tsx app/[exam]/ExamToolClient.tsx app/background-remover/BgRemoverClient.tsx
git commit -m "perf: lazy-load TensorFlow/MediaPipe only when white background is used"
```

---

### Task 3: Lazy-load PostHog

**Files:**
- Modify: `components/PostHogProvider.tsx`
- Modify: `lib/analytics.ts`

- [ ] **Step 1: Rewrite PostHogProvider to dynamically import posthog-js**

Replace the entire content of `components/PostHogProvider.tsx`:

```tsx
"use client";

import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, useState, Component, type ReactNode, type ErrorInfo } from "react";
import type { PostHog } from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "";
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    import("posthog-js").then((mod) => {
      mod.default.capture("$exception", {
        $exception_message: error.message,
        $exception_stack: error.stack,
        $exception_component: info.componentStack,
        $exception_type: "react_error_boundary",
      });
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[50vh] text-center px-4">
          <div>
            <p className="text-neutral-400 mb-4">Something went wrong.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-4 py-2 bg-yellow-400 text-neutral-900 rounded font-medium"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<PostHog | null>(null);

  useEffect(() => {
    if (!POSTHOG_KEY) return;
    import("posthog-js").then((mod) => {
      const posthog = mod.default;
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        capture_performance: true,
        autocapture: true,
      });
      setClient(posthog);
    });

    const onError = (event: ErrorEvent) => {
      import("posthog-js").then((mod) => {
        mod.default.capture("$exception", {
          $exception_message: event.message,
          $exception_stack: event.error?.stack,
          $exception_source: `${event.filename}:${event.lineno}:${event.colno}`,
          $exception_type: "window_onerror",
        });
      });
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      import("posthog-js").then((mod) => {
        mod.default.capture("$exception", {
          $exception_message: String(event.reason),
          $exception_stack: event.reason?.stack,
          $exception_type: "unhandled_rejection",
        });
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  if (!POSTHOG_KEY) return <ErrorBoundary>{children}</ErrorBoundary>;

  return client ? (
    <PHProvider client={client}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </PHProvider>
  ) : (
    <ErrorBoundary>{children}</ErrorBoundary>
  );
}
```

- [ ] **Step 2: Update analytics.ts to handle posthog not yet loaded**

Replace the entire content of `lib/analytics.ts`:

```ts
/** Centralized PostHog event tracking for FitPic tool usage funnel. */

type ToolName =
  | "photo_resizer"
  | "signature_resizer"
  | "photo_signature_joiner"
  | "background_remover"
  | "pdf_compressor"
  | "application_set"
  | "photo_validator"
  | "name_date_stamp";

interface UploadProps {
  tool: ToolName;
  file_type: string;
  file_size_kb: number;
  preset_id?: string;
  exam_name?: string;
}

interface ProcessProps {
  tool: ToolName;
  preset_id?: string;
  exam_name?: string;
  result_size_kb?: number;
  result_width?: number;
  result_height?: number;
  quality?: number;
  duration_ms?: number;
  validation_passed?: boolean;
}

interface DownloadProps {
  tool: ToolName;
  preset_id?: string;
  exam_name?: string;
  file_size_kb?: number;
}

function capture(event: string, props: Record<string, unknown>) {
  import("posthog-js").then((mod) => {
    if (mod.default.__loaded) {
      mod.default.capture(event, props);
    }
  }).catch(() => {});
}

export function trackUpload(props: UploadProps) {
  capture("file_uploaded", props as unknown as Record<string, unknown>);
}

export function trackProcessComplete(props: ProcessProps) {
  capture("process_complete", props as unknown as Record<string, unknown>);
}

export function trackDownload(props: DownloadProps) {
  capture("file_downloaded", props as unknown as Record<string, unknown>);
}

export function trackPresetSelected(props: {
  tool: ToolName;
  preset_id: string;
  exam_name: string;
  preset_type: string;
}) {
  capture("preset_selected", props as unknown as Record<string, unknown>);
}

export function trackProcessError(props: {
  tool: ToolName;
  error_message: string;
  preset_id?: string;
}) {
  capture("process_error", props as unknown as Record<string, unknown>);
}
```

- [ ] **Step 3: Verify build**

Run: `cd /tmp/fitpic && npx tsc --noEmit 2>&1 | grep -v validators.test`
Expected: No new errors.

- [ ] **Step 4: Commit**

```bash
git add components/PostHogProvider.tsx lib/analytics.ts
git commit -m "perf: lazy-load posthog-js to reduce initial bundle size"
```

---

### Task 4: Add error handling to PhotoResizerClient

**Files:**
- Modify: `app/photo-resizer/PhotoResizerClient.tsx`

- [ ] **Step 1: Add error state**

In `app/photo-resizer/PhotoResizerClient.tsx`, after the `processing` state declaration (around line 36), add:

```ts
  const [error, setError] = useState<string | null>(null);
```

- [ ] **Step 2: Add catch block to handleResize**

Change the try/finally in `handleResize` (around line 62-97) to try/catch/finally. After the existing try block content, before `finally`, add:

```ts
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to resize photo. Please try a different image.";
      setError(errMsg);
      trackProcessError({ tool: "photo_resizer", error_message: errMsg, preset_id: preset?.id });
    } finally {
```

- [ ] **Step 3: Clear error on new upload and display it in the UI**

In `handleImageLoad`, add `setError(null);` alongside the other resets.

In the JSX, after the `whiteBgError` display and before the resize button, add:

```tsx
          {error && (
            <div className="bg-rose-400/10 border border-rose-400/30 text-rose-300 text-sm rounded-xl p-3">
              {error}
            </div>
          )}
```

- [ ] **Step 4: Commit**

```bash
git add app/photo-resizer/PhotoResizerClient.tsx
git commit -m "fix: add error handling to photo resizer so failures are shown to user"
```

---

### Task 5: Move ad slot below exam selector + fix download button format

**Files:**
- Modify: `app/photo-resizer/PhotoResizerClient.tsx`
- Modify: `app/signature-resizer/SignatureResizerClient.tsx`
- Modify: `components/ResultPreview.tsx`

- [ ] **Step 1: Move ad in PhotoResizerClient**

In `app/photo-resizer/PhotoResizerClient.tsx`, move the line:
```tsx
      <AdSlot slot="photo-top" format="horizontal" />
```
From before the `ExamPresetSelector` to after it (after the closing `/>` of `ExamPresetSelector`).

- [ ] **Step 2: Move ad in SignatureResizerClient**

In `app/signature-resizer/SignatureResizerClient.tsx`, move:
```tsx
      <AdSlot slot="sig-top" format="horizontal" />
```
From before the `ExamPresetSelector` to after it.

- [ ] **Step 3: Fix download button format label**

In `components/ResultPreview.tsx`, change line 99:
```tsx
        Download {result.sizeKB}KB JPEG
```
To:
```tsx
        Download {result.sizeKB}KB {preset.format.toUpperCase()}
```

- [ ] **Step 4: Commit**

```bash
git add app/photo-resizer/PhotoResizerClient.tsx app/signature-resizer/SignatureResizerClient.tsx components/ResultPreview.tsx
git commit -m "fix: move ads below exam selector, fix download button format label"
```

---

### Task 6: Add og:image to page-level metadata

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/photo-resizer/page.tsx`
- Modify: `app/signature-resizer/page.tsx`
- Modify: `components/SEOHead.tsx`

The root layout already sets `openGraph.images` to `/og-image.png`. The issue is page-level metadata overrides `openGraph` without including the image.

- [ ] **Step 1: Add og:image to homepage metadata**

In `app/page.tsx`, update the `openGraph` block in `metadata` (around line 42) to include:
```ts
  openGraph: {
    title: `${SITE_NAME} — Free Photo & Signature Resizer for Govt Exams`,
    description: "Free online photo and signature resizer for Indian government exams. SSC, UPSC, IBPS, Railway, NEET, JEE, PAN, Aadhaar, Passport.",
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
```

- [ ] **Step 2: Add og:image to photo-resizer metadata**

In `app/photo-resizer/page.tsx`, add `images` to the `openGraph` block:
```ts
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
```

- [ ] **Step 3: Add og:image to signature-resizer metadata**

In `app/signature-resizer/page.tsx`, add `images` to the `openGraph` block:
```ts
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
```

- [ ] **Step 4: Add og:image to SEOHead for exam-specific pages**

In `components/SEOHead.tsx`, in the `generatePresetMetadata` function, add `images` to the `openGraph` return:
```ts
    openGraph: {
      title,
      description,
      type: "website" as const,
      siteName: SITE_NAME,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
```

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/photo-resizer/page.tsx app/signature-resizer/page.tsx components/SEOHead.tsx
git commit -m "fix: add og:image to all page-level metadata for social sharing"
```

---

## Phase 2 — UX Overhaul

### Task 7: Add search to ExamPresetSelector

**Files:**
- Modify: `components/ExamPresetSelector.tsx`

- [ ] **Step 1: Add search state and filtering logic**

In `components/ExamPresetSelector.tsx`, add a `searchQuery` state after `activeCategory`:

```ts
  const [searchQuery, setSearchQuery] = useState("");
```

Add search filtering logic after `filteredPresets`:

```ts
  const searchResults = searchQuery.trim().length >= 2
    ? filteredPresets.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.exam.toLowerCase().includes(q) ||
          p.searchKeywords.some((kw) => kw.toLowerCase().includes(q))
        );
      })
    : [];

  const showSearchResults = searchQuery.trim().length >= 2;
```

- [ ] **Step 2: Add search input UI**

In the return JSX, after the `<p>Select Exam</p>` label, before the category pills div, add:

```tsx
      {/* Search */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          if (e.target.value.trim().length >= 2) setActiveCategory(null);
        }}
        placeholder="Search exams... (e.g. SSC CGL, NEET, PAN)"
        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-sm text-neutral-200 placeholder:text-neutral-500 focus:border-yellow-400 focus:outline-none"
      />
```

- [ ] **Step 3: Show search results when searching**

Wrap the existing category pills + preset cards in a conditional. After the search input, add:

```tsx
      {showSearchResults ? (
        <div className="grid gap-2">
          {searchResults.length === 0 ? (
            <p className="text-neutral-500 text-sm">No exams found for "{searchQuery}"</p>
          ) : (
            searchResults.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  onSelect(preset);
                  setSearchQuery("");
                }}
                className={`text-left p-3 rounded-xl border transition-colors ${
                  selectedPreset?.id === preset.id
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-neutral-800 bg-neutral-900 hover:border-neutral-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-neutral-200 font-medium text-sm">
                    {preset.name}
                  </span>
                  <span className="text-neutral-500 text-xs">
                    {preset.width}x{preset.height}
                  </span>
                </div>
                <p className="text-neutral-500 text-xs mt-1">{preset.note}</p>
              </button>
            ))
          )}
        </div>
      ) : (
        <>
          {/* Category pills - existing code stays here */}
          ...existing category pills and preset cards...
        </>
      )}
```

Move the existing category pills div and preset cards div inside the `<>...</>` fragment.

- [ ] **Step 4: Verify build**

Run: `cd /tmp/fitpic && npx tsc --noEmit 2>&1 | grep -v validators.test`
Expected: No new errors.

- [ ] **Step 5: Commit**

```bash
git add components/ExamPresetSelector.tsx
git commit -m "feat: add search to exam preset selector for faster exam lookup"
```

---

### Task 8: Upload-first flow + Custom Size option

**Files:**
- Modify: `app/photo-resizer/PhotoResizerClient.tsx`

- [ ] **Step 1: Show upload zone regardless of preset selection**

In `app/photo-resizer/PhotoResizerClient.tsx`, change the conditional around the ImageUploader (around line 150):

From:
```tsx
      {preset && (
        <>
          <ImageUploader .../>
          ...
        </>
      )}
```

To:
```tsx
      <ImageUploader
        key={`photo-${uploaderKey}`}
        onImageLoad={handleImageLoad}
        label="Upload Photo"
      />
```

Remove the `{preset && (` wrapper so upload is always visible.

- [ ] **Step 2: Show prompt when image uploaded but no preset**

After the ImageUploader, add:

```tsx
      {image && !preset && !result && (
        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 text-center space-y-2">
          <p className="text-yellow-400 text-sm font-medium">Photo uploaded! Now select your exam above to resize.</p>
        </div>
      )}
```

- [ ] **Step 3: Guard the resize button**

The existing resize button already checks `{preset && image && !result}`, so no change needed — it only shows when both are set.

- [ ] **Step 4: Commit**

```bash
git add app/photo-resizer/PhotoResizerClient.tsx
git commit -m "feat: show upload zone immediately, allow upload-first flow"
```

---

### Task 9: Add social proof and trust badges

**Files:**
- Create: `components/TrustBadge.tsx`
- Modify: `app/photo-resizer/PhotoResizerClient.tsx`
- Modify: `app/signature-resizer/SignatureResizerClient.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create TrustBadge component**

Create `components/TrustBadge.tsx`:

```tsx
export default function TrustBadge() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-neutral-400">
      <span className="flex items-center gap-1.5">
        <span className="text-emerald-400">&#x2713;</span>
        100% browser-based — photos never leave your device
      </span>
      <span className="hidden sm:inline text-neutral-700">|</span>
      <span className="flex items-center gap-1.5">
        <span className="text-emerald-400">&#x2713;</span>
        Free forever — no signup, no limits
      </span>
      <span className="hidden sm:inline text-neutral-700">|</span>
      <span className="flex items-center gap-1.5">
        <span className="text-emerald-400">&#x2713;</span>
        Used by SSC, UPSC, IBPS exam aspirants
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Add TrustBadge to photo-resizer page**

In `app/photo-resizer/page.tsx`, import and add after the `<p>` description:

```tsx
import TrustBadge from "@/components/TrustBadge";
```

```tsx
      <TrustBadge />
```

- [ ] **Step 3: Add TrustBadge to signature-resizer page**

Same pattern in `app/signature-resizer/page.tsx`.

- [ ] **Step 4: Add TrustBadge to homepage**

In `app/page.tsx`, import TrustBadge and add it after the hero section's privacy line (after the "100% browser-based" span, around line 77).

- [ ] **Step 5: Commit**

```bash
git add components/TrustBadge.tsx app/photo-resizer/page.tsx app/signature-resizer/page.tsx app/page.tsx
git commit -m "feat: add trust badges to build user confidence on tool pages"
```

---

### Task 10: Homepage CTA + collapsible exam table

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add prominent CTA button in hero section**

In `app/page.tsx`, after the privacy line (around line 77) and TrustBadge, add:

```tsx
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <a
            href="/photo-resizer"
            className="px-6 py-3 rounded-xl bg-yellow-400 text-neutral-900 font-bold text-center hover:bg-yellow-300 transition-colors"
          >
            Resize Photo Now
          </a>
          <a
            href="/signature-resizer"
            className="px-6 py-3 rounded-xl bg-neutral-800 text-neutral-200 font-bold text-center hover:bg-neutral-700 transition-colors border border-neutral-700"
          >
            Resize Signature
          </a>
        </div>
```

- [ ] **Step 2: Collapse exam table categories by default**

In the "Supported Exam Formats" section, wrap each category in a `<details>` element:

Change:
```tsx
          <div key={category} className="space-y-2">
            <h3 className="text-neutral-400 text-sm font-medium">{category}</h3>
            <div className="overflow-x-auto">
              <table ...>
```

To:
```tsx
          <details key={category} className="group">
            <summary className="text-neutral-400 text-sm font-medium cursor-pointer hover:text-neutral-200 py-1">
              {category} ({presets.length} presets)
            </summary>
            <div className="overflow-x-auto mt-2">
              <table ...>
```

And close with `</details>` instead of `</div>`.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add CTA buttons to homepage hero, collapse exam table by default"
```

---

### Task 11: Add loading spinner to photo/signature resizer

**Files:**
- Modify: `app/photo-resizer/PhotoResizerClient.tsx`
- Modify: `app/signature-resizer/SignatureResizerClient.tsx`

- [ ] **Step 1: Add spinner to photo resizer processing state**

In `app/photo-resizer/PhotoResizerClient.tsx`, change the resize button's processing text from:
```tsx
            {processing ? "Processing..." : "Resize & Compress Now"}
```
To:
```tsx
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : "Resize & Compress Now"}
```

- [ ] **Step 2: Same change in signature resizer**

Apply identical change to `app/signature-resizer/SignatureResizerClient.tsx` resize button.

- [ ] **Step 3: Commit**

```bash
git add app/photo-resizer/PhotoResizerClient.tsx app/signature-resizer/SignatureResizerClient.tsx
git commit -m "feat: add loading spinner during photo/signature processing"
```

---

## Phase 3 — SEO Content

### Task 12: Add FAQ + schema to photo-resizer and signature-resizer pages

**Files:**
- Modify: `app/photo-resizer/page.tsx`
- Modify: `app/signature-resizer/page.tsx`

- [ ] **Step 1: Add FAQ data and schema to photo-resizer**

In `app/photo-resizer/page.tsx`, add FAQ data after `photoResizerJsonLd`:

```ts
const PHOTO_FAQ = [
  {
    question: "What size photo do I need for government exams?",
    answer: "Each exam has different requirements. Common sizes include 100x120px (SSC), 200x230px (IBPS/SBI), and 150x200px (UPSC). FitPic has 150+ presets with exact specs for each exam.",
  },
  {
    question: "How do I compress a photo to 50KB or less?",
    answer: "Upload your photo, select your exam preset, and click Resize. FitPic automatically compresses to the exact KB range required — no manual quality adjustment needed.",
  },
  {
    question: "Can I resize a photo without selecting an exam?",
    answer: "Yes! You can upload your photo first, then select an exam. We support 150+ exam presets or you can enter custom dimensions.",
  },
  {
    question: "Is my photo uploaded to a server?",
    answer: "No. All processing happens 100% in your browser. Your photos never leave your device. We never see, store, or have access to your images.",
  },
  {
    question: "Does it work on mobile phones?",
    answer: "Yes, FitPic works on all devices. You can take a photo with your phone camera and resize it instantly — no app download needed.",
  },
];

const photoFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PHOTO_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const photoBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Photo Resizer", item: `${SITE_URL}/photo-resizer` },
  ],
};
```

In the JSX, add the JSON-LD scripts and FAQ section after `PhotoResizerClient` and before the popular presets:

```tsx
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(photoFaqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(photoBreadcrumbJsonLd) }}
      />

      {/* FAQ */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-neutral-300">Frequently Asked Questions</h2>
        {PHOTO_FAQ.map((item, i) => (
          <details key={i} className="bg-neutral-900 rounded-xl border border-neutral-800">
            <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-neutral-200 hover:text-yellow-400">
              {item.question}
            </summary>
            <p className="px-4 pb-3 text-neutral-400 text-sm leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
```

- [ ] **Step 2: Add FAQ data and schema to signature-resizer**

Apply the same pattern to `app/signature-resizer/page.tsx` with signature-specific FAQs:

```ts
const SIG_FAQ = [
  {
    question: "How do I resize my signature for an exam?",
    answer: "Upload a photo of your signature, select your exam preset, and click Resize. FitPic auto-detects dark backgrounds and converts to clean black ink on white.",
  },
  {
    question: "What if my signature has a dark background?",
    answer: "FitPic automatically detects dark backgrounds and inverts them. Your signature will be converted to black ink on white paper — no manual editing needed.",
  },
  {
    question: "What size should my signature be?",
    answer: "Common exam requirements: 140x60px for SSC/IBPS/SBI, 150x60px for Railway. FitPic has exact presets for 100+ exams.",
  },
  {
    question: "Can I use a phone photo of my signature?",
    answer: "Yes! Take a photo of your signature on white paper with good lighting. FitPic will clean it up, remove the background, and resize to exact specs.",
  },
];
```

Add corresponding `sigFaqJsonLd`, `sigBreadcrumbJsonLd`, and FAQ section in JSX.

- [ ] **Step 3: Commit**

```bash
git add app/photo-resizer/page.tsx app/signature-resizer/page.tsx
git commit -m "feat: add FAQ sections with schema markup to generic tool pages"
```

---

### Task 13: Broaden homepage SEO + add HowTo schema

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update homepage title and meta description**

In `app/page.tsx`, change the metadata (around line 34):

```ts
export const metadata: Metadata = {
  title: `Free Photo Resizer & Compressor — Resize to Exact KB & Pixels Online`,
  description:
    "Free online photo resizer and compressor. Resize photos to exact KB and pixel dimensions for government exams (SSC, UPSC, IBPS, Railway, NEET), passport, PAN card, Aadhaar. 100% browser-based, no signup.",
  keywords:
    "photo resizer, image resizer, compress photo to kb, resize photo online, signature resizer, passport photo resizer, exam photo size, photo compressor",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — Free Photo Resizer & Compressor`,
    description:
      "Resize photos to exact KB and pixel dimensions. Free, browser-based, no signup. 150+ exam presets.",
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Free Photo Resizer & Compressor`,
    description:
      "Resize photos to exact KB and pixel dimensions. Free, browser-based, no signup.",
  },
};
```

- [ ] **Step 2: Add HowTo JSON-LD to homepage**

In `app/page.tsx`, add a HowTo schema object to the existing JSON-LD array (the one with FAQPage and Organization):

```ts
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Resize a Photo for Government Exams",
              description: "Resize your photo to exact exam specifications in 3 simple steps.",
              step: [
                {
                  "@type": "HowToStep",
                  position: 1,
                  name: "Choose Your Exam",
                  text: "Select from 150+ exam presets (SSC, UPSC, IBPS, Railway, NEET, PAN, Aadhaar, Passport) or enter custom dimensions.",
                },
                {
                  "@type": "HowToStep",
                  position: 2,
                  name: "Upload Your Photo",
                  text: "Upload a JPG, PNG, or WebP photo. Works with phone camera photos too.",
                },
                {
                  "@type": "HowToStep",
                  position: 3,
                  name: "Download the Resized File",
                  text: "Your photo is automatically resized to exact pixel dimensions and compressed to the required KB range. Download and upload to your exam form.",
                },
              ],
            },
```

Add this to the JSON-LD array in the `dangerouslySetInnerHTML`.

- [ ] **Step 3: Add WebSite schema with SearchAction**

Add to the same JSON-LD array:

```ts
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/photo-resizer`,
                "query-input": "required name=search_term_string",
              },
            },
```

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: broaden homepage SEO keywords, add HowTo and WebSite schema"
```

---

### Task 14: Final verification and push

- [ ] **Step 1: Type check**

Run: `cd /tmp/fitpic && npx tsc --noEmit 2>&1 | grep -v validators.test`
Expected: No new errors.

- [ ] **Step 2: Run tests**

Run: `cd /tmp/fitpic && npx jest --passWithNoTests 2>&1`
Expected: Same pass/fail count as before (47 passed, 2 pre-existing failures).

- [ ] **Step 3: Push all changes**

```bash
cd /tmp/fitpic && git push origin main
```
