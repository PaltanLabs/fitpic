# FitPic SEO Overhaul Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Get fitpic.in indexed by Google and competitive for exam-specific and generic photo/signature resizer searches.

**Architecture:** Add `metadataBase` to the root layout, split three `"use client"` tool pages into server wrapper + client component pairs so metadata can be exported, enrich homepage with SEO content sections, add breadcrumbs and internal links to exam pages, fix robots.txt, add OG image, favicon, and manifest.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Vercel

**Spec:** `docs/superpowers/specs/2026-03-17-seo-overhaul-design.md`

---

## File Structure

### Files to Create
- `app/photo-resizer/PhotoResizerClient.tsx` — extracted client component (renamed from current page.tsx)
- `app/signature-resizer/SignatureResizerClient.tsx` — extracted client component
- `app/photo-signature-joiner/JoinerClient.tsx` — extracted client component
- `public/og-image.png` — static OpenGraph image (1200x630)
- `public/favicon.ico` — 32x32 favicon
- `public/apple-touch-icon.png` — 180x180 touch icon
- `public/icon-192.png` — 192x192 PWA icon
- `public/icon-512.png` — 512x512 PWA icon
- `public/manifest.json` — web app manifest
- `__tests__/seo.test.ts` — tests for SEO helper functions

### Files to Modify
- `app/layout.tsx` — add metadataBase, default OG image, twitter card, manifest link
- `app/robots.ts` — add disallow for `/ingest/`
- `app/page.tsx` — add homepage metadata export, "How It Works" section, expanded "Supported Exams" table
- `app/photo-resizer/page.tsx` — rewrite as server wrapper with metadata, imports PhotoResizerClient
- `app/signature-resizer/page.tsx` — rewrite as server wrapper with metadata, imports SignatureResizerClient
- `app/photo-signature-joiner/page.tsx` — rewrite as server wrapper with metadata, imports JoinerClient
- `app/[exam]/page.tsx` — add breadcrumb UI, BreadcrumbList JSON-LD, canonical URL, fix typeLabel for "thumb"
- `components/SEOHead.tsx` — add canonical URLs to generatePresetMetadata, add generateBreadcrumbJsonLd, fix typeLabel for "thumb"

---

## Task 1: Add metadataBase and default OG/Twitter metadata to root layout

**Files:**
- Modify: `app/layout.tsx:1-14`

- [ ] **Step 1: Update the metadata export in layout.tsx**

In `app/layout.tsx`, replace the existing metadata export (lines 7-14) with:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://fitpic.in"),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} - Free Govt Exam Photo & Signature Resizer`,
  },
  description:
    "Free online photo and signature resizer for Indian government exams. SSC, UPSC, IBPS, Railway, NEET, JEE, PAN, Aadhaar, Passport. 100% browser-based, private.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  manifest: "/manifest.json",
};
```

- [ ] **Step 2: Verify the app still builds**

Run: `cd /tmp/fitpic && npx next build 2>&1 | tail -20`
Expected: Build succeeds (manifest.json missing is OK for now — it's a warning, not an error)

- [ ] **Step 3: Commit**

```bash
cd /tmp/fitpic && git add app/layout.tsx && git commit -m "feat(seo): add metadataBase, default OG image, Twitter card, manifest to root layout"
```

---

## Task 2: Fix robots.txt to block /ingest/

**Files:**
- Modify: `app/robots.ts:1-12`

- [ ] **Step 1: Write test for robots config**

Create `__tests__/seo.test.ts`:

```ts
import robots from "../app/robots";

describe("robots.ts", () => {
  test("allows all paths by default", () => {
    const config = robots();
    expect(config.rules).toEqual(
      expect.objectContaining({ userAgent: "*", allow: "/" })
    );
  });

  test("disallows /ingest/ path", () => {
    const config = robots();
    expect(config.rules).toEqual(
      expect.objectContaining({ disallow: "/ingest/" })
    );
  });

  test("includes sitemap URL", () => {
    const config = robots();
    expect(config.sitemap).toContain("/sitemap.xml");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /tmp/fitpic && npx jest __tests__/seo.test.ts --verbose`
Expected: FAIL — "disallows /ingest/ path" fails because current robots.ts has no disallow

- [ ] **Step 3: Update robots.ts**

Replace the content of `app/robots.ts`:

```ts
import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/ingest/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /tmp/fitpic && npx jest __tests__/seo.test.ts --verbose`
Expected: All 3 tests PASS

- [ ] **Step 5: Commit**

```bash
cd /tmp/fitpic && git add app/robots.ts __tests__/seo.test.ts && git commit -m "feat(seo): block /ingest/ in robots.txt, add SEO tests"
```

---

## Task 3: Split photo-resizer into server wrapper + client component

**Files:**
- Create: `app/photo-resizer/PhotoResizerClient.tsx`
- Modify: `app/photo-resizer/page.tsx`

- [ ] **Step 1: Create PhotoResizerClient.tsx**

Copy the entire current content of `app/photo-resizer/page.tsx` to `app/photo-resizer/PhotoResizerClient.tsx`. Then make these changes in `PhotoResizerClient.tsx`:
- Remove the `<h1>` (line 68) and `<p>` description (lines 69-71) — these move to the server wrapper
- Rename the function from `PhotoResizerPage` to `PhotoResizerClient`

The file should start with `"use client";` and the return should begin directly with the `<AdSlot>` after the opening `<div>`:

```tsx
"use client";

import { useState, useCallback } from "react";
import ExamPresetSelector from "@/components/ExamPresetSelector";
import ImageUploader from "@/components/ImageUploader";
import ResultPreview from "@/components/ResultPreview";
import DateStamper from "@/components/DateStamper";
import AdSlot from "@/components/AdSlot";
import Tips from "@/components/Tips";
import { type ExamPreset } from "@/lib/presets";
import { processImage, type ProcessResult } from "@/lib/imageEngine";

export default function PhotoResizerClient() {
  // ... all existing state and handlers unchanged ...

  return (
    <div className="space-y-6">
      <AdSlot slot="photo-top" format="horizontal" />

      {/* Step 1: Select Exam */}
      {/* ... rest of JSX unchanged from line 76 onward ... */}
    </div>
  );
}
```

- [ ] **Step 2: Rewrite page.tsx as server wrapper**

Replace `app/photo-resizer/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { PRESETS, getPresetSlug } from "@/lib/presets";
import PhotoResizerClient from "./PhotoResizerClient";

export const metadata: Metadata = {
  title: `Photo Resizer for Govt Exams — Resize to Exact KB & Pixels Free | ${SITE_NAME}`,
  description:
    "Free online photo resizer for SSC, UPSC, IBPS, Railway, NEET, PAN, Aadhaar, Passport. Auto-compress to exact KB and pixel size. 100% browser-based, no signup.",
  keywords:
    "photo resizer, resize photo for exam, compress photo to 50kb, passport photo resizer, exam photo resize online free",
  alternates: { canonical: "/photo-resizer" },
  openGraph: {
    title: `Photo Resizer for Govt Exams — Resize to Exact KB & Pixels Free | ${SITE_NAME}`,
    description:
      "Free online photo resizer for SSC, UPSC, IBPS, Railway, NEET, PAN, Aadhaar, Passport. Auto-compress to exact KB and pixel size. 100% browser-based, no signup.",
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `Photo Resizer for Govt Exams | ${SITE_NAME}`,
    description:
      "Free online photo resizer for SSC, UPSC, IBPS, Railway, NEET, PAN, Aadhaar, Passport.",
  },
};

const photoPresets = PRESETS.filter(
  (p) => (p.type === "photo" || p.type === "thumb") && p.id !== "custom"
);

export default function PhotoResizerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Photo Resizer</h1>
      <p className="text-neutral-400 text-sm">
        Resize your photo to exact exam specifications. 100% client-side.
      </p>

      <PhotoResizerClient />

      {/* Popular Exams — server-rendered for SEO */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-neutral-300">
          Popular Photo Presets
        </h2>
        <div className="flex flex-wrap gap-2">
          {photoPresets.map((p) => (
            <a
              key={p.id}
              href={`/${getPresetSlug(p)}`}
              className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs hover:border-neutral-600"
            >
              {p.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build succeeds**

Run: `cd /tmp/fitpic && npx next build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
cd /tmp/fitpic && git add app/photo-resizer/ && git commit -m "feat(seo): split photo-resizer into server wrapper + client, add metadata and exam links"
```

---

## Task 4: Split signature-resizer into server wrapper + client component

**Files:**
- Create: `app/signature-resizer/SignatureResizerClient.tsx`
- Modify: `app/signature-resizer/page.tsx`

- [ ] **Step 1: Create SignatureResizerClient.tsx**

Copy content from current `app/signature-resizer/page.tsx` to `SignatureResizerClient.tsx`. Remove the `<h1>` (line 61) and description `<p>` (lines 62-65). Rename function to `SignatureResizerClient`.

```tsx
"use client";

import { useState, useCallback } from "react";
import ExamPresetSelector from "@/components/ExamPresetSelector";
import ImageUploader from "@/components/ImageUploader";
import ResultPreview from "@/components/ResultPreview";
import AdSlot from "@/components/AdSlot";
import Tips from "@/components/Tips";
import { type ExamPreset } from "@/lib/presets";
import { processImage, type ProcessResult } from "@/lib/imageEngine";

export default function SignatureResizerClient() {
  // ... all existing state and handlers unchanged ...

  return (
    <div className="space-y-6">
      <AdSlot slot="sig-top" format="horizontal" />

      {/* Step 1: Select Exam */}
      {/* ... rest of JSX unchanged from line 70 onward ... */}
    </div>
  );
}
```

- [ ] **Step 2: Rewrite page.tsx as server wrapper**

Replace `app/signature-resizer/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { PRESETS, getPresetSlug } from "@/lib/presets";
import SignatureResizerClient from "./SignatureResizerClient";

export const metadata: Metadata = {
  title: `Signature Resizer — Clean Up & Resize Signatures for Exams Free | ${SITE_NAME}`,
  description:
    "Free online signature resizer for SSC, UPSC, IBPS, Railway, PAN Card. Auto-converts dark backgrounds to white, black ink optimized. Browser-based, no signup.",
  keywords:
    "signature resizer, resize signature for exam, signature 20kb, exam signature resize online free",
  alternates: { canonical: "/signature-resizer" },
  openGraph: {
    title: `Signature Resizer — Clean Up & Resize Signatures for Exams Free | ${SITE_NAME}`,
    description:
      "Free online signature resizer for SSC, UPSC, IBPS, Railway, PAN Card. Auto-converts dark backgrounds to white, black ink optimized.",
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `Signature Resizer for Exams | ${SITE_NAME}`,
    description:
      "Free online signature resizer for SSC, UPSC, IBPS, Railway, PAN Card.",
  },
};

const sigPresets = PRESETS.filter(
  (p) => p.type === "signature" && p.id !== "custom"
);

export default function SignatureResizerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Signature Resizer</h1>
      <p className="text-neutral-400 text-sm">
        Clean up and resize your signature. Auto-converts dark backgrounds to
        white. Black ink optimized.
      </p>

      <SignatureResizerClient />

      {/* Popular Exams — server-rendered for SEO */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-neutral-300">
          Popular Signature Presets
        </h2>
        <div className="flex flex-wrap gap-2">
          {sigPresets.map((p) => (
            <a
              key={p.id}
              href={`/${getPresetSlug(p)}`}
              className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs hover:border-neutral-600"
            >
              {p.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build succeeds**

Run: `cd /tmp/fitpic && npx next build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
cd /tmp/fitpic && git add app/signature-resizer/ && git commit -m "feat(seo): split signature-resizer into server wrapper + client, add metadata and exam links"
```

---

## Task 5: Split photo-signature-joiner into server wrapper + client component

**Files:**
- Create: `app/photo-signature-joiner/JoinerClient.tsx`
- Modify: `app/photo-signature-joiner/page.tsx`

- [ ] **Step 1: Create JoinerClient.tsx**

Copy content from current `app/photo-signature-joiner/page.tsx` to `JoinerClient.tsx`. Remove the `<h1>` (line 178), description `<p>` (lines 179-181), and the amber warning `<div>` (lines 182-185) — move those to the server wrapper. Rename function to `JoinerClient`.

- [ ] **Step 2: Rewrite page.tsx as server wrapper**

Replace `app/photo-signature-joiner/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { PRESETS, getPresetSlug } from "@/lib/presets";
import JoinerClient from "./JoinerClient";

export const metadata: Metadata = {
  title: `Photo + Signature Joiner — Combine for IBPS/SSC/RRB Upload Free | ${SITE_NAME}`,
  description:
    "Free tool to combine photo and signature into one JPEG for IBPS, SSC, RRB exam uploads. Auto-resize and compress. Works on mobile, no signup.",
  keywords:
    "photo signature joiner, combine photo signature, ibps photo signature, ssc photo signature combine",
  alternates: { canonical: "/photo-signature-joiner" },
  openGraph: {
    title: `Photo + Signature Joiner — Combine for IBPS/SSC/RRB Upload Free | ${SITE_NAME}`,
    description:
      "Free tool to combine photo and signature into one JPEG for IBPS, SSC, RRB exam uploads.",
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `Photo + Signature Joiner | ${SITE_NAME}`,
    description:
      "Free tool to combine photo and signature into one JPEG for IBPS, SSC, RRB exam uploads.",
  },
};

// IBPS and SSC exam pages — relevant for joiner users
const joinerExamPresets = PRESETS.filter(
  (p) =>
    p.id !== "custom" &&
    (p.category === "Banking" || p.category === "SSC")
);

export default function PhotoSignatureJoinerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Photo + Signature Joiner</h1>
      <p className="text-neutral-400 text-sm">
        Combine a resized photo and cleaned signature into one JPEG.
      </p>
      <div className="bg-amber-400/10 text-amber-300 border border-amber-500/30 rounded-xl p-3 text-xs">
        Note: many portals (including IBPS) require separate uploads for
        photo/signature. Use this only when a combined file is explicitly
        requested.
      </div>

      <JoinerClient />

      {/* Related Exam Tools — server-rendered for SEO */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-neutral-300">
          Related Exam Tools
        </h2>
        <div className="flex flex-wrap gap-2">
          {joinerExamPresets.map((p) => (
            <a
              key={p.id}
              href={`/${getPresetSlug(p)}`}
              className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs hover:border-neutral-600"
            >
              {p.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build succeeds**

Run: `cd /tmp/fitpic && npx next build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
cd /tmp/fitpic && git add app/photo-signature-joiner/ && git commit -m "feat(seo): split photo-signature-joiner into server wrapper + client, add metadata and exam links"
```

---

## Task 6: Add homepage metadata and SEO content sections

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add metadata export and "How It Works" section**

Rewrite `app/page.tsx`. The key changes:
1. Add `Metadata` import and metadata export at the top
2. Add `alternates: { canonical: "/" }`
3. Import `PRESETS`, `getPresetSlug`, `CATEGORIES` from `@/lib/presets`
4. Add "How It Works" section after the tool cards
5. Replace the badge-only "Supported Exams" section with a table showing exam name (linked), photo size, and signature size

```tsx
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { PRESETS, getPresetSlug, CATEGORIES } from "@/lib/presets";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Free Photo & Signature Resizer for Govt Exams | SSC, UPSC, IBPS, NEET`,
  description:
    "Free online photo and signature resizer for Indian government exams. SSC, UPSC, IBPS, Railway, NEET, JEE, PAN, Aadhaar, Passport. Resize to exact KB and pixels. 100% browser-based, private, no signup.",
  keywords:
    "photo resizer, signature resizer, exam photo resize, compress photo to kb, govt exam photo size",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — Free Photo & Signature Resizer for Govt Exams`,
    description:
      "Free online photo and signature resizer for Indian government exams. SSC, UPSC, IBPS, Railway, NEET, JEE, PAN, Aadhaar, Passport.",
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Free Photo & Signature Resizer for Govt Exams`,
    description:
      "Free online photo and signature resizer for Indian government exams.",
  },
};

// Group presets by category for the supported exams table
const examsByCategory = CATEGORIES.filter((c) => c !== "Custom").map((cat) => ({
  category: cat,
  presets: PRESETS.filter((p) => p.category === cat && p.id !== "custom"),
}));

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3 py-6">
        <h1 className="text-3xl font-bold text-neutral-100">
          Free Photo & Signature Resizer
        </h1>
        <p className="text-neutral-400 max-w-md mx-auto">
          Resize photos and signatures for Indian government exams. SSC, UPSC,
          IBPS, Railway, NEET, JEE, PAN, Aadhaar, Passport & more.
        </p>
        <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
          <span>🔒</span>
          <span>100% browser-based — we never see your photos</span>
        </div>
      </div>

      <AdSlot slot="top-banner" format="horizontal" />

      {/* Tool cards */}
      <div className="grid gap-4">
        <a
          href="/photo-resizer"
          className="block p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-yellow-400/50 transition-colors"
        >
          <div className="text-2xl mb-2">📷</div>
          <h2 className="text-xl font-bold text-neutral-100">Photo Resizer</h2>
          <p className="text-neutral-400 text-sm mt-1">
            Resize passport photos for any exam. Auto-compress to exact KB and
            pixel requirements.
          </p>
        </a>

        <a
          href="/signature-resizer"
          className="block p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-yellow-400/50 transition-colors"
        >
          <div className="text-2xl mb-2">✍️</div>
          <h2 className="text-xl font-bold text-neutral-100">
            Signature Resizer
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            Clean up and resize signatures. Handles dark backgrounds, auto-converts to
            black ink on white.
          </p>
        </a>

        <a
          href="/photo-signature-joiner"
          className="block p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-yellow-400/50 transition-colors"
        >
          <div className="text-2xl mb-2">🖼️</div>
          <h2 className="text-xl font-bold text-neutral-100">
            Photo + Signature Joiner
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            Combine photo and signature into a single image for IBPS/SSC/RRB uploads.
          </p>
        </a>
      </div>

      {/* How It Works */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-300">How It Works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-neutral-900 rounded-xl p-4">
            <div className="text-yellow-400 font-bold text-lg mb-1">1</div>
            <h3 className="text-neutral-200 font-medium text-sm">Choose Your Exam</h3>
            <p className="text-neutral-500 text-xs mt-1">
              Select from 22+ exam presets (SSC, UPSC, IBPS, Railway, NEET, PAN,
              Aadhaar, Passport) or enter custom dimensions.
            </p>
          </div>
          <div className="bg-neutral-900 rounded-xl p-4">
            <div className="text-yellow-400 font-bold text-lg mb-1">2</div>
            <h3 className="text-neutral-200 font-medium text-sm">Upload Your Photo or Signature</h3>
            <p className="text-neutral-500 text-xs mt-1">
              Works with JPG, PNG, WebP, HEIC. Take a photo directly from your
              phone camera.
            </p>
          </div>
          <div className="bg-neutral-900 rounded-xl p-4">
            <div className="text-yellow-400 font-bold text-lg mb-1">3</div>
            <h3 className="text-neutral-200 font-medium text-sm">Download the Resized File</h3>
            <p className="text-neutral-500 text-xs mt-1">
              Automatically resized to exact pixel dimensions and compressed to
              the required KB range. Ready to upload to the exam form.
            </p>
          </div>
        </div>
      </div>

      {/* Supported Exams — expanded with links and sizes */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-300">
          Supported Exam Formats
        </h2>
        {examsByCategory.map(({ category, presets }) => (
          <div key={category} className="space-y-2">
            <h3 className="text-neutral-400 text-sm font-medium">{category}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-neutral-500 border-b border-neutral-800">
                    <th className="py-1.5 pr-4">Exam</th>
                    <th className="py-1.5 pr-4">Type</th>
                    <th className="py-1.5 pr-4">Size</th>
                    <th className="py-1.5">KB Range</th>
                  </tr>
                </thead>
                <tbody>
                  {presets.map((p) => (
                    <tr key={p.id} className="border-b border-neutral-900">
                      <td className="py-1.5 pr-4">
                        <a
                          href={`/${getPresetSlug(p)}`}
                          className="text-yellow-400 hover:underline"
                        >
                          {p.name}
                        </a>
                      </td>
                      <td className="py-1.5 pr-4 text-neutral-400">
                        {p.type === "photo"
                          ? "Photo"
                          : p.type === "thumb"
                          ? "Thumb"
                          : "Signature"}
                      </td>
                      <td className="py-1.5 pr-4 text-neutral-400">
                        {p.width}x{p.height}px
                      </td>
                      <td className="py-1.5 text-neutral-400">
                        {p.minKB}-{p.maxKB}KB
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <AdSlot slot="bottom-rect" format="rectangle" />
    </div>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

Run: `cd /tmp/fitpic && npx next build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
cd /tmp/fitpic && git add app/page.tsx && git commit -m "feat(seo): add homepage metadata, How It Works, and expanded Supported Exams table with links"
```

---

## Task 7: Fix typeLabel for "thumb" type and add canonical/breadcrumbs to SEOHead

**Files:**
- Modify: `components/SEOHead.tsx`
- Test: `__tests__/seo.test.ts`

- [ ] **Step 1: Add tests for the new SEO helpers**

Append to `__tests__/seo.test.ts`:

```ts
import { getTypeLabel, generatePresetMetadata, generateBreadcrumbJsonLd } from "../components/SEOHead";
import { PRESETS } from "../lib/presets";

describe("getTypeLabel", () => {
  test("returns Photo for photo type", () => {
    expect(getTypeLabel("photo")).toBe("Photo");
  });

  test("returns Signature for signature type", () => {
    expect(getTypeLabel("signature")).toBe("Signature");
  });

  test("returns Thumb Impression for thumb type", () => {
    expect(getTypeLabel("thumb")).toBe("Thumb Impression");
  });
});

describe("generatePresetMetadata", () => {
  test("includes alternates.canonical for a preset", () => {
    const sscPhoto = PRESETS.find((p) => p.id === "ssc-cgl-photo")!;
    const meta = generatePresetMetadata(sscPhoto);
    expect(meta.alternates?.canonical).toBeDefined();
  });

  test("includes twitter card metadata", () => {
    const sscPhoto = PRESETS.find((p) => p.id === "ssc-cgl-photo")!;
    const meta = generatePresetMetadata(sscPhoto);
    expect(meta.twitter).toBeDefined();
    expect(meta.twitter?.card).toBe("summary_large_image");
  });
});

describe("generateBreadcrumbJsonLd", () => {
  test("generates 3 items for a photo preset", () => {
    const sscPhoto = PRESETS.find((p) => p.id === "ssc-cgl-photo")!;
    const breadcrumb = generateBreadcrumbJsonLd(sscPhoto, "ssc-cgl-photo-resizer");
    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(breadcrumb.itemListElement).toHaveLength(3);
    expect(breadcrumb.itemListElement[1].name).toBe("Photo Resizer");
  });

  test("uses Photo Resizer as parent for thumb type", () => {
    const thumb = PRESETS.find((p) => p.id === "ibps-sbi-thumb")!;
    const breadcrumb = generateBreadcrumbJsonLd(thumb, "ibps-sbi-thumb-resizer");
    expect(breadcrumb.itemListElement[1].name).toBe("Photo Resizer");
    expect(breadcrumb.itemListElement[1].item).toContain("/photo-resizer");
  });

  test("uses Signature Resizer as parent for signature type", () => {
    const sig = PRESETS.find((p) => p.id === "ssc-signature")!;
    const breadcrumb = generateBreadcrumbJsonLd(sig, "ssc-signature-resizer");
    expect(breadcrumb.itemListElement[1].name).toBe("Signature Resizer");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /tmp/fitpic && npx jest __tests__/seo.test.ts --verbose`
Expected: FAIL — `getTypeLabel` and `generateBreadcrumbJsonLd` don't exist, `generatePresetMetadata` doesn't include canonical/twitter

- [ ] **Step 3: Update SEOHead.tsx**

Replace `components/SEOHead.tsx` with:

```tsx
import { type ExamPreset } from "@/lib/presets";
import { getPresetSlug } from "@/lib/presets";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export function getTypeLabel(type: ExamPreset["type"]): string {
  if (type === "photo") return "Photo";
  if (type === "thumb") return "Thumb Impression";
  return "Signature";
}

export function generatePresetMetadata(preset: ExamPreset) {
  const typeLabel = getTypeLabel(preset.type);
  const slug = getPresetSlug(preset);
  const title = `${preset.exam} ${typeLabel} Resizer - Resize to ${preset.maxKB}KB Free Online | ${SITE_NAME}`;
  const description = `Free ${preset.exam} ${typeLabel.toLowerCase()} resizer. Resize to ${preset.width}x${preset.height}px, ${preset.minKB}-${preset.maxKB}KB. ${preset.bgColor ? "White background." : ""} Works on mobile. No signup.`;

  return {
    title,
    description,
    keywords: preset.searchKeywords.join(", "),
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title,
      description,
      type: "website" as const,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
  };
}

export function generateJsonLd(preset: ExamPreset) {
  const typeLabel = getTypeLabel(preset.type);
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${preset.exam} ${typeLabel} Resizer`,
    description: `Free online tool to resize ${typeLabel.toLowerCase()}s for ${preset.exam}. Auto-compress to ${preset.minKB}-${preset.maxKB}KB, ${preset.width}x${preset.height}px.`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0" },
    browserRequirements: "Any modern browser",
  };
}

export function generateFaqJsonLd(preset: ExamPreset) {
  const typeLabel = getTypeLabel(preset.type).toLowerCase();
  const faqs = [
    {
      question: `What is the ${preset.exam} ${typeLabel} size requirement?`,
      answer: `${preset.exam} requires ${typeLabel}s to be ${preset.width}x${preset.height} pixels, between ${preset.minKB}-${preset.maxKB}KB in ${preset.format.toUpperCase()} format.${preset.bgColor ? " White background is required." : ""}`,
    },
    {
      question: `How do I resize my ${typeLabel} for ${preset.exam}?`,
      answer: `Upload your ${typeLabel} to our free tool. It will automatically resize to ${preset.width}x${preset.height}px and compress to ${preset.minKB}-${preset.maxKB}KB. Download and upload directly to the ${preset.exam} form.`,
    },
    {
      question: `Is this tool free?`,
      answer: `Yes, completely free. No signup, no watermark, no limits. Your images are processed in your browser and never uploaded to any server.`,
    },
    {
      question: `Does it work on mobile?`,
      answer: `Yes, the tool works on all devices including Android and iPhone. You can even take a photo directly from your camera.`,
    },
    {
      question: `Is my photo safe?`,
      answer: `Absolutely. All processing happens locally in your browser. We never see, store, or upload your photos. Your privacy is guaranteed.`,
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function generateBreadcrumbJsonLd(preset: ExamPreset, slug: string) {
  const typeLabel = getTypeLabel(preset.type);
  // thumb uses Photo Resizer as parent
  const parentPath = preset.type === "signature" ? "/signature-resizer" : "/photo-resizer";
  const parentName = preset.type === "signature" ? "Signature Resizer" : "Photo Resizer";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: parentName,
        item: `${SITE_URL}${parentPath}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${preset.exam} ${typeLabel} Resizer`,
      },
    ],
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /tmp/fitpic && npx jest __tests__/seo.test.ts --verbose`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
cd /tmp/fitpic && git add components/SEOHead.tsx __tests__/seo.test.ts && git commit -m "feat(seo): fix thumb typeLabel, add canonical/twitter to preset metadata, add breadcrumb JSON-LD generator"
```

---

## Task 8: Add breadcrumbs and canonical URL to exam pages

**Files:**
- Modify: `app/[exam]/page.tsx`

- [ ] **Step 1: Update exam page to use new helpers**

Replace `app/[exam]/page.tsx` with:

```tsx
import { PRESETS, getPresetSlug, type ExamPreset } from "@/lib/presets";
import {
  generatePresetMetadata,
  generateJsonLd,
  generateFaqJsonLd,
  generateBreadcrumbJsonLd,
  getTypeLabel,
} from "@/components/SEOHead";
import type { Metadata } from "next";
import ExamToolClient from "./ExamToolClient";

export function generateStaticParams() {
  return PRESETS.filter((p) => p.id !== "custom").map((p) => ({
    exam: getPresetSlug(p),
  }));
}

function getPresetFromSlug(slug: string): ExamPreset | undefined {
  return PRESETS.find((p) => getPresetSlug(p) === slug);
}

export async function generateMetadata({
  params,
}: {
  params: { exam: string };
}): Promise<Metadata> {
  const preset = getPresetFromSlug(params.exam);
  if (!preset) return { title: "Not Found" };
  return generatePresetMetadata(preset);
}

export default function ExamPage({ params }: { params: { exam: string } }) {
  const preset = getPresetFromSlug(params.exam);

  if (!preset) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-neutral-300">Preset Not Found</h1>
        <p className="text-neutral-500 mt-2">
          <a href="/" className="text-yellow-400 hover:underline">
            Go back home
          </a>
        </p>
      </div>
    );
  }

  const typeLabel = getTypeLabel(preset.type);
  const slug = getPresetSlug(preset);
  const jsonLd = generateJsonLd(preset);
  const faqJsonLd = generateFaqJsonLd(preset);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(preset, slug);
  const parentPath = preset.type === "signature" ? "/signature-resizer" : "/photo-resizer";
  const parentName = preset.type === "signature" ? "Signature Resizer" : "Photo Resizer";

  return (
    <div className="space-y-8">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb navigation */}
      <nav className="text-xs text-neutral-500">
        <a href="/" className="hover:text-neutral-300">Home</a>
        <span className="mx-1">&gt;</span>
        <a href={parentPath} className="hover:text-neutral-300">{parentName}</a>
        <span className="mx-1">&gt;</span>
        <span className="text-neutral-400">{preset.exam} {typeLabel} Resizer</span>
      </nav>

      {/* SEO heading */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">
          {preset.exam} {typeLabel} Resizer — Free Online Tool
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Free online {preset.exam} {typeLabel.toLowerCase()} resizer. Automatically resize your{" "}
          {typeLabel.toLowerCase()} to {preset.width}x{preset.height} pixels and compress to{" "}
          {preset.minKB}-{preset.maxKB}KB in {preset.format.toUpperCase()} format.
          {preset.bgColor && " White background applied automatically."}
          {preset.requiresDateStamp && " Name and date stamp supported."}
          {" "}Works on mobile. No signup required. 100% browser-based — we never see your photos.
        </p>
      </div>

      {/* The actual tool */}
      <ExamToolClient presetId={preset.id} />

      {/* FAQ section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-200">
          Frequently Asked Questions
        </h2>
        {faqJsonLd.mainEntity.map((faq: { name: string; acceptedAnswer: { text: string } }, i: number) => (
          <div key={i} className="bg-neutral-900 rounded-xl p-4">
            <h3 className="text-neutral-200 font-medium text-sm">
              {faq.name}
            </h3>
            <p className="text-neutral-400 text-sm mt-2">
              {faq.acceptedAnswer.text}
            </p>
          </div>
        ))}
      </div>

      {/* Related links */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-neutral-300">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {PRESETS.filter((p) => p.id !== preset.id && p.id !== "custom")
            .slice(0, 6)
            .map((p) => (
              <a
                key={p.id}
                href={`/${getPresetSlug(p)}`}
                className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs hover:border-neutral-600"
              >
                {p.name}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

Run: `cd /tmp/fitpic && npx next build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 3: Run all tests**

Run: `cd /tmp/fitpic && npx jest --verbose`
Expected: All tests PASS

- [ ] **Step 4: Commit**

```bash
cd /tmp/fitpic && git add app/\[exam\]/page.tsx && git commit -m "feat(seo): add breadcrumbs, BreadcrumbList JSON-LD, and canonical URLs to exam pages"
```

---

## Task 9: Add static assets (OG image, favicon, manifest)

**Files:**
- Create: `public/og-image.png`
- Create: `public/favicon.ico`
- Create: `public/apple-touch-icon.png`
- Create: `public/icon-192.png`
- Create: `public/icon-512.png`
- Create: `public/manifest.json`

**Note:** The image assets (OG image, favicon, icons) require design work. Use a simple approach: generate a yellow "F" on dark background programmatically or use a favicon generator service.

- [ ] **Step 1: Create manifest.json**

Create `public/manifest.json`:

```json
{
  "name": "FitPic",
  "short_name": "FitPic",
  "description": "Free photo & signature resizer for Indian government exams",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#facc15",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Step 2: Generate placeholder image assets**

Use a script or online tool to create:
- `public/og-image.png` — 1200x630, dark bg (#0a0a0a), yellow text "FitPic" + tagline + exam names
- `public/favicon.ico` — 32x32, yellow "F" on dark bg
- `public/apple-touch-icon.png` — 180x180, same design
- `public/icon-192.png` — 192x192, same design
- `public/icon-512.png` — 512x512, same design

If `sharp` is available (it's in devDependencies), you can generate these with a Node script. Otherwise, create simple placeholder PNGs and replace later with designed versions.

- [ ] **Step 3: Verify build succeeds**

Run: `cd /tmp/fitpic && npx next build 2>&1 | tail -20`
Expected: Build succeeds with no warnings about missing manifest or assets

- [ ] **Step 4: Commit**

```bash
cd /tmp/fitpic && git add public/ && git commit -m "feat(seo): add OG image, favicon, PWA icons, and web manifest"
```

---

## Task 10: Final verification and push

- [ ] **Step 1: Run full test suite**

Run: `cd /tmp/fitpic && npx jest --verbose`
Expected: All tests PASS

- [ ] **Step 2: Run production build**

Run: `cd /tmp/fitpic && npx next build 2>&1 | tail -30`
Expected: Build succeeds, all pages generated

- [ ] **Step 3: Verify sitemap includes all pages**

Run: `cd /tmp/fitpic && npx next build && npx next start &` then `curl -s http://localhost:3000/sitemap.xml | head -50`
Expected: Sitemap XML includes `/`, `/photo-resizer`, `/signature-resizer`, `/photo-signature-joiner`, and all exam slugs

- [ ] **Step 4: Verify robots.txt**

Run: `curl -s http://localhost:3000/robots.txt`
Expected: Contains `Disallow: /ingest/` and `Sitemap: https://fitpic.in/sitemap.xml`

- [ ] **Step 5: Push to GitHub**

```bash
cd /tmp/fitpic && git push origin main
```

- [ ] **Step 6: Manual — Set up Google Search Console**

Follow the step-by-step instructions in Section 1 of the design spec at `docs/superpowers/specs/2026-03-17-seo-overhaul-design.md`. This requires:
1. Go to https://search.google.com/search-console
2. Add `fitpic.in` as a domain property
3. Add the DNS TXT record to your domain registrar
4. Verify ownership
5. Submit sitemap: `https://fitpic.in/sitemap.xml`
