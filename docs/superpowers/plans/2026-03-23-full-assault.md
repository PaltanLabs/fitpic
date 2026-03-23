# FitPic Full Assault Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship blog system, photo validator, name+date standalone page, Hindi pages, bug fixes, and infrastructure pages to outcompete ExamMint and capture exam photo traffic.

**Architecture:** All new pages are static Next.js App Router routes. Blog is data-driven (TypeScript arrays, no CMS/MDX). Hindi pages use a `/hi/[exam]` route with translated content data. Photo validator reuses existing `validators.ts` logic in a new standalone page.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Pica (image processing)

---

## File Structure

### New files:
- `lib/blog-posts.ts` — Blog post data (title, slug, content, metadata)
- `app/blog/page.tsx` — Blog index page
- `app/blog/[slug]/page.tsx` — Individual blog post page
- `app/name-date-stamp/page.tsx` — Standalone name+date tool page
- `app/photo-validator/page.tsx` — Photo validator page
- `app/photo-validator/ValidatorClient.tsx` — Client component for validator
- `app/privacy-policy/page.tsx` — Privacy policy page
- `app/about/page.tsx` — About page
- `lib/hindi-content.ts` — Hindi translations for exam content
- `app/hi/[exam]/page.tsx` — Hindi exam pages

### Modified files:
- `lib/exam-content.ts` — Fix BPSC KB conflict
- `app/page.tsx` — Add homepage FAQ + structured data
- `app/category/[slug]/page.tsx` — Enrich with intro content + structured data
- `app/layout.tsx` — Add footer nav links
- `app/sitemap.ts` — Add blog, validator, hindi, about, privacy routes

---

### Task 1: Fix BPSC bug + add privacy/about pages

**Files:**
- Modify: `lib/exam-content.ts` — fix BPSC KB from "50-100KB" to "20-50KB"
- Create: `app/privacy-policy/page.tsx`
- Create: `app/about/page.tsx`
- Modify: `app/layout.tsx` — add footer links
- Modify: `app/sitemap.ts` — add new pages

- [ ] **Step 1: Fix BPSC conflict in exam-content.ts**

Find the BPSC uploadSteps that mention "50-100KB" and change to "20-50KB" to match the preset data.

- [ ] **Step 2: Create privacy policy page at `app/privacy-policy/page.tsx`**

Static page with:
- Title: "Privacy Policy | FitPic"
- Content covering: no data collection, browser-only processing, analytics (GA4 + PostHog), cookies, contact info
- Canonical URL: /privacy-policy

- [ ] **Step 3: Create about page at `app/about/page.tsx`**

Static page with:
- Title: "About FitPic — Free Photo & Signature Resizer"
- Content: what FitPic does, why it exists, privacy-first approach, team (PaltanLabs)
- Link to GitHub repo
- Canonical URL: /about

- [ ] **Step 4: Add footer navigation links in `app/layout.tsx`**

Add links to: About, Privacy Policy, Photo Resizer, Signature Resizer, Blog. Add category links row.

- [ ] **Step 5: Add new pages to sitemap**

Add /privacy-policy, /about to sitemap with priority 0.3.

- [ ] **Step 6: Verify build and commit**

```bash
npm run build
git add -A
git commit -m "fix: BPSC KB conflict, add privacy policy + about page + footer nav"
```

---

### Task 2: Enrich category hub pages + add structured data

**Files:**
- Modify: `app/category/[slug]/page.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Add intro content and structured data to category pages**

For each category, add a `CATEGORY_CONTENT` map with:
- `intro`: 2-3 sentence description of the category
- `examCount`: approximate total exams in India for that category

Add BreadcrumbList + ItemList JSON-LD structured data.

Add the intro paragraph between the hero and the presets table.

- [ ] **Step 2: Add structured data + FAQ to homepage**

Add Organization JSON-LD and a FAQ section (5 questions about FitPic: is it free, is it safe, works on mobile, etc.) with FAQPage schema.

- [ ] **Step 3: Verify build and commit**

```bash
npm run build
git add -A
git commit -m "feat: enrich category pages + add homepage structured data"
```

---

### Task 3: Standalone Name + Date Stamp page

**Files:**
- Create: `app/name-date-stamp/page.tsx`

- [ ] **Step 1: Create the page**

This page targets "add name and date on photo for SSC" queries. It should:
- Have SEO metadata targeting: "add name date photo online", "SSC photo name date stamp"
- Show the ImageUploader component
- Show the DateStamper component (always enabled)
- Allow selecting an exam preset for correct dimensions
- Process image with name+date stamp using existing imageEngine
- Show result with download

Use a client component wrapper similar to ExamToolClient but with DateStamper always visible and a preset selector dropdown.

- [ ] **Step 2: Add to sitemap with priority 0.9**

- [ ] **Step 3: Add FAQ section**

5 questions about name/date stamping: which exams need it, where does it appear, what font, etc.

- [ ] **Step 4: Verify build and commit**

```bash
npm run build
git add -A
git commit -m "feat: standalone name + date stamp page for SSC/IBPS"
```

---

### Task 4: Photo Validator tool

**Files:**
- Create: `app/photo-validator/page.tsx`
- Create: `app/photo-validator/ValidatorClient.tsx`

- [ ] **Step 1: Create ValidatorClient.tsx**

Client component that:
1. Shows exam preset selector dropdown
2. Shows image upload area
3. On upload, reads the image and checks:
   - Dimensions (width x height matches preset)
   - File size (within minKB-maxKB range)
   - Format (JPEG/PNG)
   - File size in bytes
   - Aspect ratio
4. Shows pass/fail checklist with green checkmarks / red X for each
5. If any fail, shows "Fix it now" button linking to the exam's resizer page
6. Does NOT resize — just validates

This is a new tool, different from the resizer. It answers "is my photo ready to upload?"

```typescript
interface ValidatorCheck {
  label: string;
  passed: boolean;
  expected: string;
  actual: string;
}
```

Read the uploaded image dimensions via `new Image()` and file size from `File.size`. Compare against selected preset.

- [ ] **Step 2: Create page.tsx with SEO metadata**

- Title: "Photo Validator — Check Your Exam Photo Before Uploading | FitPic"
- Description targeting: "check photo for government exam", "validate photo size"
- FAQ section: 5 questions about photo validation
- FAQPage + WebApplication JSON-LD
- BreadcrumbList: Home > Photo Validator

- [ ] **Step 3: Add to sitemap with priority 0.9**

- [ ] **Step 4: Verify build and commit**

```bash
npm run build
git add -A
git commit -m "feat: photo validator tool — check photos before uploading"
```

---

### Task 5: Blog system + 5 launch posts

**Files:**
- Create: `lib/blog-posts.ts`
- Create: `app/blog/page.tsx`
- Create: `app/blog/[slug]/page.tsx`

- [ ] **Step 1: Create blog data structure in `lib/blog-posts.ts`**

```typescript
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  keywords: string[];
  content: BlogSection[];
}

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
  table?: { headers: string[]; rows: string[][] };
}

export const BLOG_POSTS: BlogPost[] = [
  // 5 posts here
];
```

- [ ] **Step 2: Write 5 blog posts as data**

Post 1: "SSC CGL Photo & Signature Size Requirements 2026"
- slug: "ssc-cgl-photo-size-2026"
- Target keywords: "ssc cgl photo size", "ssc cgl photo size 2026", "ssc cgl signature size"
- Content: exact dimensions, step-by-step resize guide, common mistakes, official links
- ~800 words

Post 2: "Photo Rejected in Government Exam? Complete Fix Guide"
- slug: "photo-rejected-government-exam-fix"
- Target keywords: "photo rejected government exam", "ssc photo rejected", "exam form photo correction"
- Content: why photos get rejected, correction windows per exam (SSC, UPSC, IBPS, NEET, JEE), how to fix, prevention tips
- ~1000 words

Post 3: "Complete Exam Photo Size Guide 2026 — All Government Exams"
- slug: "exam-photo-size-guide-2026"
- Target keywords: "exam photo size guide", "government exam photo requirements 2026"
- Content: master comparison table of all exams with dimensions/KB/format, organized by category
- ~800 words, heavy on tables

Post 4: "How to Take a Perfect Exam Photo at Home with Your Phone"
- slug: "take-exam-photo-at-home-mobile"
- Target keywords: "how to take passport photo at home", "exam photo with phone"
- Content: lighting, background, positioning, phone camera settings, common mistakes
- ~700 words

Post 5: "BPSC Photo & Signature Size Requirements 2026"
- slug: "bpsc-photo-size-2026"
- Target keywords: "bpsc photo size", "bpsc photo size 2026", "bpsc signature size"
- Content: exact specs, step-by-step for BPSC portal, common issues, official links
- ~800 words

- [ ] **Step 3: Create blog index page at `app/blog/page.tsx`**

- Title: "Blog — Photo Resizing Guides & Exam Tips | FitPic"
- List all posts as cards with title, description, date, category
- Sorted by date descending
- Each links to `/blog/{slug}`

- [ ] **Step 4: Create blog post page at `app/blog/[slug]/page.tsx`**

- `generateStaticParams()` from BLOG_POSTS
- `generateMetadata()` with title, description, keywords, canonical, openGraph
- Render BlogSection[] as HTML: h2 headings, paragraphs, lists, tables
- Add Article JSON-LD schema
- Add breadcrumb: Home > Blog > {Post Title}
- Add "Related Posts" section at bottom
- Add CTA: "Use FitPic to resize your photo now →" linking to relevant exam page
- Add inline links to exam resizer pages within content

- [ ] **Step 5: Add blog routes to sitemap**

Blog index: priority 0.8, weekly.
Blog posts: priority 0.75, monthly.

- [ ] **Step 6: Add Blog link to header nav**

In `app/layout.tsx`, add a "Blog" link to the nav.

- [ ] **Step 7: Verify build and commit**

```bash
npm run build
git add -A
git commit -m "feat: blog system with 5 SEO-optimized launch posts"
```

---

### Task 6: Hindi exam pages

**Files:**
- Create: `lib/hindi-content.ts`
- Create: `app/hi/[exam]/page.tsx`
- Modify: `app/[exam]/page.tsx` — add hreflang alternate
- Modify: `app/sitemap.ts` — add Hindi routes

- [ ] **Step 1: Create Hindi content data in `lib/hindi-content.ts`**

Translate exam content for top 10 exams:
SSC CGL, UPSC, BPSC, UPPSC, NEET, JEE Main, SBI PO, IBPS/SBI, Delhi Police, MPSC

```typescript
export interface HindiExamContent {
  examName: string; // Hindi name
  slug: string; // same slug as English
  title: string; // Hindi page title
  description: string; // Hindi meta description
  about: string;
  uploadSteps: string[];
  commonMistakes: string[];
  photoTips: string[];
  faqQuestions: { question: string; answer: string }[];
}

export const HINDI_CONTENT: Record<string, HindiExamContent> = { ... };
```

All content in Hindi (Devanagari script). Use natural Hindi, not Google Translate quality.

- [ ] **Step 2: Create Hindi exam page at `app/hi/[exam]/page.tsx`**

- `generateStaticParams()` from HINDI_CONTENT keys, mapped to preset slugs
- `lang="hi"` on the wrapper div
- Same layout as English exam page: breadcrumb, h1, description, tool (ExamToolClient — tool UI stays English), Hindi content sections, Hindi FAQ
- Metadata in Hindi
- Canonical: `/hi/{slug}`
- hreflang alternate pointing to English version

- [ ] **Step 3: Add hreflang to English exam pages**

In `app/[exam]/page.tsx`, if a Hindi version exists for this exam, add:
```tsx
alternates: {
  canonical: `/${slug}`,
  languages: { 'hi': `/hi/${slug}` }
}
```

- [ ] **Step 4: Add Hindi routes to sitemap**

Hindi exam pages with priority 0.65, monthly.

- [ ] **Step 5: Verify build and commit**

```bash
npm run build
git add -A
git commit -m "feat: Hindi exam pages for top 10 exams"
```

---

### Task 7: Final build, push, and deploy

- [ ] **Step 1: Full build verification**

```bash
npm run build
```

Check output for total static pages (should be ~160+).

- [ ] **Step 2: Commit any remaining changes**

- [ ] **Step 3: Push and create PR**

```bash
git push origin feat/full-assault
gh pr create --title "Full assault: blog, validator, Hindi, name-date, privacy" --body "..."
gh pr merge --squash
```

- [ ] **Step 4: Post-deploy verification**

- Check sitemap at https://www.fitpic.in/sitemap.xml
- Spot-check: /blog, /photo-validator, /name-date-stamp, /hi/bpsc-photo-resizer, /privacy-policy, /about
- Resubmit sitemap in Google Search Console
- Request indexing for: /blog/ssc-cgl-photo-size-2026, /blog/photo-rejected-government-exam-fix, /photo-validator, /name-date-stamp
