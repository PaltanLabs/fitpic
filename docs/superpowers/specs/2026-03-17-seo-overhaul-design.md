# FitPic SEO Overhaul — Design Spec

**Date:** 2026-03-17
**Status:** Approved
**Approach:** B — Foundation + On-Page SEO Overhaul

## Problem

FitPic (fitpic.in) is live but has zero Google indexation. Searching `site:fitpic.in` returns no results. Competitors (formphotoeditor.com, examphotoresize.in, photoresizer.net, fatafatresize.in, etc.) already rank for all target keywords like "ssc cgl photo resize", "ibps photo size 50kb", etc.

## Goal

Get fitpic.in indexed by Google and competitive for both exam-specific searches ("ssc cgl photo resize") and generic searches ("resize photo online free", "compress image to 50kb").

## Out of Scope

- Blog/guide pages
- Hindi/regional language support
- Programmatic long-tail keyword pages
- Core Web Vitals optimization
- Ongoing content strategy

---

## Section 1: Google Search Console Setup (Manual)

Step-by-step instructions for the site owner:

1. Go to https://search.google.com/search-console
2. Click "Add Property"
3. Choose "Domain" property type
4. Enter `fitpic.in`
5. Google will provide a DNS TXT record (e.g., `google-site-verification=abc123...`)
6. Log in to your domain registrar (wherever fitpic.in was purchased)
7. Go to DNS settings
8. Add a new TXT record:
   - **Type:** TXT
   - **Host/Name:** `@` (or leave blank, depending on registrar)
   - **Value:** paste the verification string Google gave you
   - **TTL:** 3600 (or default)
9. Go back to Google Search Console, click "Verify"
   - DNS propagation can take up to 48 hours, but usually works within minutes
10. Once verified, go to "Sitemaps" in the left sidebar
11. Enter `https://fitpic.in/sitemap.xml` and click "Submit"
12. Google will begin crawling your site within hours to days

**Also recommended:** Submit to Bing Webmaster Tools at https://www.bing.com/webmasters (same process, different verification).

---

## Section 2: Fix Missing Metadata on Static Pages

### Problem

The three tool pages (`/photo-resizer`, `/signature-resizer`, `/photo-signature-joiner`) are `"use client"` components with no exported metadata. They inherit only the generic fallback from `layout.tsx`:

> "FitPic - Free Govt Exam Photo & Signature Resizer"

This means Google sees three pages with identical titles and no unique descriptions.

### Solution

For each tool page, create a server component wrapper that exports metadata and renders the client component as a child. This is the standard Next.js App Router pattern.

**File structure change:**

```
app/photo-resizer/page.tsx          → server component with metadata export + imports client
app/photo-resizer/PhotoResizerClient.tsx  → existing "use client" component (renamed)
```

Same pattern for `/signature-resizer` and `/photo-signature-joiner`.

**Important:** The `<h1>` and description text currently inside each client component should be moved to the server wrapper so Google sees them in the initial HTML response. The client component should only contain the interactive tool (preset selector, uploader, result preview).

### Metadata for each page

**`/` (homepage):**
- Title: `FitPic — Free Photo & Signature Resizer for Govt Exams | SSC, UPSC, IBPS, NEET`
- Description: `Free online photo and signature resizer for Indian government exams. SSC, UPSC, IBPS, Railway, NEET, JEE, PAN, Aadhaar, Passport. Resize to exact KB and pixels. 100% browser-based, private, no signup.`
- Keywords: `photo resizer, signature resizer, exam photo resize, compress photo to kb, govt exam photo size`
- Canonical: `/`

**`/photo-resizer`:**
- Title: `Photo Resizer for Govt Exams — Resize to Exact KB & Pixels Free | FitPic`
- Description: `Free online photo resizer for SSC, UPSC, IBPS, Railway, NEET, PAN, Aadhaar, Passport. Auto-compress to exact KB and pixel size. 100% browser-based, no signup.`
- Keywords: `photo resizer, resize photo for exam, compress photo to 50kb, passport photo resizer, exam photo resize online free`

**`/signature-resizer`:**
- Title: `Signature Resizer — Clean Up & Resize Signatures for Exams Free | FitPic`
- Description: `Free online signature resizer for SSC, UPSC, IBPS, Railway, PAN Card. Auto-converts dark backgrounds to white, black ink optimized. Browser-based, no signup.`
- Keywords: `signature resizer, resize signature for exam, signature 20kb, exam signature resize online free`

**`/photo-signature-joiner`:**
- Title: `Photo + Signature Joiner — Combine for IBPS/SSC/RRB Upload Free | FitPic`
- Description: `Free tool to combine photo and signature into one JPEG for IBPS, SSC, RRB exam uploads. Auto-resize and compress. Works on mobile, no signup.`
- Keywords: `photo signature joiner, combine photo signature, ibps photo signature, ssc photo signature combine`

### OpenGraph for each page

Each page should also export `openGraph` metadata with `title`, `description`, `type: "website"`, and `siteName: "FitPic"`.

Additionally, include `twitter` card metadata on all pages:
```
twitter: {
  card: "summary_large_image",
  title: "...",
  description: "...",
}
```

---

## Section 3: Canonical URLs & OpenGraph Image

### Canonical URLs

Add `alternates.canonical` to every page's metadata. This tells Google the definitive URL and prevents duplicate content from query strings or trailing slashes.

**Implementation:** In `layout.tsx` default metadata, set `metadataBase` as the very first code change (prerequisite for all other metadata — canonical URLs, OG images, and Twitter cards all depend on it):
```
metadataBase: new URL("https://fitpic.in")
```

Then each page's metadata should include:
```
alternates: { canonical: "/photo-resizer" }
```

The `[exam]` pages should use their dynamic slug: `alternates: { canonical: "/${slug}" }`.

### OpenGraph Image

Create a static OG image at `public/og-image.png` (1200x630px) containing:
- FitPic logo/name
- Tagline: "Free Photo & Signature Resizer for Indian Govt Exams"
- A few exam names (SSC, UPSC, IBPS, NEET, etc.)

Set as default in `layout.tsx` metadata:
```
openGraph: {
  images: [{ url: "/og-image.png", width: 1200, height: 630 }]
}
```

Individual pages can override this later if needed (e.g., per-exam OG images via `opengraph-image.tsx`).

---

## Section 4: Homepage SEO Content

### Problem

The homepage has minimal crawlable text — a short tagline, three tool cards, and exam name badges. Competitors have keyword-rich content that helps them rank for generic searches.

### Solution

Add two server-rendered sections below the existing tool cards:

#### 4a. "How It Works" Section

Three steps with brief descriptions:
1. **Choose Your Exam** — Select from 22+ exam presets (SSC, UPSC, IBPS, Railway, NEET, PAN, Aadhaar, Passport) or enter custom dimensions.
2. **Upload Your Photo or Signature** — Works with JPG, PNG, WebP, HEIC. Take a photo directly from your phone camera.
3. **Download the Resized File** — Automatically resized to exact pixel dimensions and compressed to the required KB range. Ready to upload to the exam form.

#### 4b. "Supported Exams" Expanded Section

Replace the current badge-only list with a structured list/table containing:
- Exam name (linked to its dedicated page)
- Photo size (e.g., "100x120px, 20-50KB")
- Signature size (e.g., "140x60px, 10-20KB")

This creates:
- Internal links to every `[exam]` page (important for SEO link graph)
- Keyword-rich crawlable text with exact dimensions (matches what people search for)

Data source: derive from the existing `PRESETS` array, grouped by category.

---

## Section 5: Internal Linking & Breadcrumbs

### Tool Pages → Exam Pages

Add a "Popular Exams" section at the bottom of `/photo-resizer`, `/signature-resizer`, and `/photo-signature-joiner`:
- `/photo-resizer`: links to all photo-type exam preset pages
- `/signature-resizer`: links to all signature-type exam preset pages
- `/photo-signature-joiner`: links to IBPS and SSC exam pages (the exams that commonly require combined uploads)

These are server-rendered links below the client tool component (placed in the server wrapper after Section 2's refactor).

### Exam Pages → Parent Tool Pages (Breadcrumbs)

Add a breadcrumb trail at the top of each `[exam]` page:

> Home > Photo Resizer > SSC CGL Photo Resizer

Or for signature:

> Home > Signature Resizer > SSC Signature Resizer

For "thumb" type presets (e.g., `ibps-sbi-thumb`), the parent is Photo Resizer:

> Home > Photo Resizer > IBPS/SBI Left Thumb Resizer

**Note:** The existing `typeLabel` ternary in `[exam]/page.tsx` and `SEOHead.tsx` only handles "photo" and "signature", treating "thumb" as "Signature". Update to handle three types: `preset.type === "photo" ? "Photo" : preset.type === "thumb" ? "Thumb Impression" : "Signature"`.

### BreadcrumbList JSON-LD

Add BreadcrumbList structured data to `[exam]` pages so Google displays breadcrumbs in search results:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://fitpic.in" },
    { "@type": "ListItem", "position": 2, "name": "Photo Resizer", "item": "https://fitpic.in/photo-resizer" },
    { "@type": "ListItem", "position": 3, "name": "SSC CGL Photo Resizer" }
  ]
}
```

---

## Section 6: Technical SEO Fixes

### 6a. Block `/ingest/` in robots.txt

Update `app/robots.ts` to add a disallow rule for the PostHog reverse proxy:

```ts
rules: {
  userAgent: "*",
  allow: "/",
  disallow: "/ingest/",
}
```

### 6b. Favicon

Add `favicon.ico` (32x32) and `apple-touch-icon.png` (180x180) to the `public/` directory. Next.js serves these automatically. Use a simple "FP" or FitPic logo mark.

Can be generated from any favicon generator site, or created as a simple yellow "F" on dark background to match the brand.

### 6c. Web App Manifest

Add `public/manifest.json`:
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

Link it in `layout.tsx` metadata:
```
manifest: "/manifest.json"
```

---

## Implementation Order

1. Section 1 (Search Console) — manual, can be done in parallel with code changes
2. `metadataBase` in `layout.tsx` — prerequisite for all metadata, must come first
3. Section 6a (robots.txt fix) — quick, unblocks crawling
4. Section 2 (static page metadata + homepage metadata) — highest SEO impact code change
5. Section 3 (canonical URLs + OG image + Twitter cards) — builds on metadataBase
6. Section 4 (homepage content) — adds crawlable keyword content
7. Section 5 (internal linking + breadcrumbs) — strengthens link graph; depends on Section 2 refactor
8. Section 6b-c (favicon + manifest) — polish; design assets (OG image, favicon, icons) can be created in parallel with code work

## Files Changed

- `app/robots.ts` — add disallow rule
- `app/layout.tsx` — add metadataBase, OG image default, Twitter card default, manifest link
- `app/page.tsx` — add homepage metadata export, "How It Works" and expanded "Supported Exams" sections
- `app/photo-resizer/page.tsx` — split into server wrapper + client component
- `app/photo-resizer/PhotoResizerClient.tsx` — renamed from current page.tsx
- `app/signature-resizer/page.tsx` — split into server wrapper + client component
- `app/signature-resizer/SignatureResizerClient.tsx` — renamed
- `app/photo-signature-joiner/page.tsx` — split into server wrapper + client component
- `app/photo-signature-joiner/JoinerClient.tsx` — renamed
- `app/[exam]/page.tsx` — add breadcrumb UI + BreadcrumbList JSON-LD + canonical URL
- `components/SEOHead.tsx` — add canonical to generatePresetMetadata, add breadcrumb generator
- `public/og-image.png` — new static OG image (1200x630)
- `public/favicon.ico` — new
- `public/apple-touch-icon.png` — new
- `public/icon-192.png` — new
- `public/icon-512.png` — new
- `public/manifest.json` — new
