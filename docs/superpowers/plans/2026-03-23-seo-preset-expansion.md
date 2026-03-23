# SEO Preset Expansion & Category Hub Pages

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand exam presets from 23 to 150+, split combined presets for SEO, add category hub pages, add rich exam-specific content to each page, and improve internal linking — to outcompete ExamMint Resizer in Google rankings.

**Architecture:** Data-driven approach. All preset specs live in `lib/presets.ts`. The existing `[exam]` dynamic route auto-generates pages. Category hub pages are new static routes. Exam-specific content (dates, eligibility, guides) is stored as data in a new `lib/exam-content.ts` file and rendered on each exam page.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS

---

### Task 1: Add new categories to CATEGORIES array

**Files:**
- Modify: `lib/presets.ts:20-30`

- [ ] **Step 1: Add Police and Judiciary categories**

Update the CATEGORIES array:

```typescript
export const CATEGORIES = [
  "SSC",
  "UPSC",
  "Banking",
  "Railway",
  "Medical/Engineering",
  "ID/Passport",
  "Postal",
  "State PSC",
  "Police",
  "Judiciary",
  "Custom",
] as const;
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Commit**

```bash
git add lib/presets.ts
git commit -m "feat: add Police and Judiciary categories"
```

---

### Task 2: Split existing combined SSC preset into separate exams

**Files:**
- Modify: `lib/presets.ts:32-70`

Currently "SSC CGL/CHSL/MTS Photo" is one preset. Split into 4 separate presets (CGL, CHSL, GD, MTS) — same specs, different IDs and names. This creates 4 separate pages instead of 1.

- [ ] **Step 1: Replace the combined SSC photo preset with 4 individual ones**

Replace the existing SSC CGL/CHSL/MTS entry with:

```typescript
  // ========== SSC ==========
  {
    id: "ssc-cgl-photo",
    name: "SSC CGL Photo",
    exam: "SSC CGL",
    type: "photo",
    width: 100,
    height: 120,
    minKB: 20,
    maxKB: 50,
    bgColor: "#FFFFFF",
    format: "jpeg",
    dpi: 200,
    requiresDateStamp: true,
    note: "3.5cm x 4.5cm, 20-50KB, white bg, name+date required",
    officialUrl: "https://ssc.gov.in",
    category: "SSC",
    searchKeywords: ["ssc cgl photo size", "ssc cgl photo resize", "ssc cgl photo 50kb"],
  },
  {
    id: "ssc-chsl-photo",
    name: "SSC CHSL Photo",
    exam: "SSC CHSL",
    type: "photo",
    width: 200,
    height: 240,
    minKB: 20,
    maxKB: 50,
    bgColor: "#FFFFFF",
    format: "jpeg",
    dpi: 200,
    requiresDateStamp: true,
    note: "200x240px, 20-50KB, white bg, name+date required",
    officialUrl: "https://ssc.gov.in",
    category: "SSC",
    searchKeywords: ["ssc chsl photo size", "ssc chsl photo resize", "ssc chsl photo 50kb"],
  },
  {
    id: "ssc-gd-photo",
    name: "SSC GD Photo",
    exam: "SSC GD",
    type: "photo",
    width: 200,
    height: 240,
    minKB: 20,
    maxKB: 50,
    bgColor: "#FFFFFF",
    format: "jpeg",
    dpi: 200,
    requiresDateStamp: true,
    note: "200x240px, 20-50KB, white bg, name+date required",
    officialUrl: "https://ssc.gov.in",
    category: "SSC",
    searchKeywords: ["ssc gd photo size", "ssc gd constable photo resize"],
  },
  {
    id: "ssc-mts-photo",
    name: "SSC MTS Photo",
    exam: "SSC MTS",
    type: "photo",
    width: 200,
    height: 240,
    minKB: 20,
    maxKB: 50,
    bgColor: "#FFFFFF",
    format: "jpeg",
    dpi: 200,
    requiresDateStamp: true,
    note: "200x240px, 20-50KB, white bg, name+date required",
    officialUrl: "https://ssc.gov.in",
    category: "SSC",
    searchKeywords: ["ssc mts photo size", "ssc mts photo resize"],
  },
```

- [ ] **Step 2: Add separate SSC signature presets for each**

```typescript
  {
    id: "ssc-cgl-signature",
    name: "SSC CGL Signature",
    exam: "SSC CGL",
    type: "signature",
    width: 140,
    height: 60,
    minKB: 10,
    maxKB: 20,
    bgColor: null,
    format: "jpeg",
    dpi: 200,
    requiresDateStamp: false,
    note: "4.0cm x 2.0cm, 10-20KB, black ink on white paper",
    officialUrl: "https://ssc.gov.in",
    category: "SSC",
    searchKeywords: ["ssc cgl signature size", "ssc cgl signature resize"],
  },
  {
    id: "ssc-chsl-signature",
    name: "SSC CHSL Signature",
    exam: "SSC CHSL",
    type: "signature",
    width: 140,
    height: 60,
    minKB: 10,
    maxKB: 20,
    bgColor: null,
    format: "jpeg",
    dpi: 200,
    requiresDateStamp: false,
    note: "4.0cm x 2.0cm, 10-20KB, black ink on white paper",
    officialUrl: "https://ssc.gov.in",
    category: "SSC",
    searchKeywords: ["ssc chsl signature size", "ssc chsl signature resize"],
  },
  {
    id: "ssc-gd-signature",
    name: "SSC GD Signature",
    exam: "SSC GD",
    type: "signature",
    width: 140,
    height: 60,
    minKB: 10,
    maxKB: 20,
    bgColor: null,
    format: "jpeg",
    dpi: 200,
    requiresDateStamp: false,
    note: "4.0cm x 2.0cm, 10-20KB, black ink on white paper",
    officialUrl: "https://ssc.gov.in",
    category: "SSC",
    searchKeywords: ["ssc gd signature size", "ssc gd signature resize"],
  },
  {
    id: "ssc-mts-signature",
    name: "SSC MTS Signature",
    exam: "SSC MTS",
    type: "signature",
    width: 140,
    height: 60,
    minKB: 10,
    maxKB: 20,
    bgColor: null,
    format: "jpeg",
    dpi: 200,
    requiresDateStamp: false,
    note: "4.0cm x 2.0cm, 10-20KB, black ink on white paper",
    officialUrl: "https://ssc.gov.in",
    category: "SSC",
    searchKeywords: ["ssc mts signature size", "ssc mts signature resize"],
  },
```

- [ ] **Step 3: Remove old combined "ssc-signature" preset** (id: "ssc-signature")

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds, now generates ssc-cgl-photo-resizer, ssc-chsl-photo-resizer, ssc-gd-photo-resizer, ssc-mts-photo-resizer + signature variants

- [ ] **Step 5: Commit**

```bash
git add lib/presets.ts
git commit -m "feat: split SSC into separate CGL/CHSL/GD/MTS presets for SEO"
```

---

### Task 3: Add State PSC presets (photo + signature for each)

**Files:**
- Modify: `lib/presets.ts` — add after the existing Kerala PSC entries

Add 28 new State PSC presets. For each state, add both photo AND signature presets (signature uses standard 140x60, 10-20KB if not known). The following states to add:

**BPSC, UPPSC, MPSC, TNPSC, WBCS, GPSC, RPSC, HPSC, TSPSC, CGPSC, UKPSC, APPSC (AP), JPSC, MPPSC, OPSC, APSC (Assam), PPSC (Punjab), HPPSC, JKPSC, JKSSB**

Each follows this pattern:

```typescript
{
  id: "{state-id}-photo",
  name: "{State Name} PSC Photo",
  exam: "{Exam Abbr}",
  type: "photo",
  width: {width},
  height: {height},
  minKB: {min},
  maxKB: {max},
  bgColor: "#FFFFFF",
  format: "jpeg",
  dpi: 200,
  requiresDateStamp: false,
  note: "{width}x{height}px, {min}-{max}KB, white bg",
  officialUrl: "{official url}",
  category: "State PSC",
  searchKeywords: ["{exam} photo size", "{exam} photo resize", "{state} psc photo"],
},
{
  id: "{state-id}-signature",
  name: "{State Name} PSC Signature",
  exam: "{Exam Abbr}",
  type: "signature",
  width: 140,
  height: 60,
  minKB: 10,
  maxKB: 20,
  bgColor: null,
  format: "jpeg",
  dpi: 200,
  requiresDateStamp: false,
  note: "140x60px, 10-20KB",
  officialUrl: "{official url}",
  category: "State PSC",
  searchKeywords: ["{exam} signature size", "{exam} signature resize"],
},
```

**Exact specs per state (from official sources / ExamMint data):**

| State | ID | Exam | Photo WxH | Photo KB | Official URL |
|-------|-----|------|-----------|----------|-------------|
| Bihar | bpsc | BPSC | 250x250 | 20-50 | https://bpsc.bih.nic.in |
| UP | uppsc | UPPSC | 180x216 | 20-50 | https://uppsc.up.nic.in |
| Maharashtra | mpsc | MPSC | 276x354 | 20-50 | https://mpsc.gov.in |
| Tamil Nadu | tnpsc | TNPSC | 275x354 | 20-50 | https://tnpsc.gov.in |
| West Bengal | wbcs | WBCS | 138x177 | 20-100 | https://wbpsc.gov.in |
| Gujarat | gpsc | GPSC | 130x180 | 10-15 | https://gpsc.gujarat.gov.in |
| Rajasthan | rpsc | RPSC | 240x320 | 20-50 | https://rpsc.rajasthan.gov.in |
| Haryana | hpsc | HPSC | 138x177 | 10-100 | https://hpsc.gov.in |
| Telangana | tspsc | TSPSC | 275x354 | 20-50 | https://tspsc.gov.in |
| Chhattisgarh | cgpsc | CGPSC | 275x354 | 30-100 | https://psc.cg.gov.in |
| Uttarakhand | ukpsc | UKPSC | 150x200 | 30-50 | https://ukpsc.gov.in |
| Andhra Pradesh | appsc | APPSC | 200x250 | 50-100 | https://psc.ap.gov.in |
| Jharkhand | jpsc | JPSC | 200x230 | 20-50 | https://jpsc.gov.in |
| Madhya Pradesh | mppsc | MPPSC | 276x354 | 25-200 | https://mppsc.mp.gov.in |
| Odisha | opsc | OPSC | 200x230 | 20-100 | https://opsc.gov.in |
| Assam | apsc | APSC | 276x354 | 50-200 | https://apsc.nic.in |
| Punjab | ppsc | PPSC | 140x177 | 10-40 | https://ppsc.gov.in |
| Himachal | hppsc | HPPSC | 110x140 | 10-40 | https://hppsc.hp.gov.in |
| J&K | jkpsc | JKPSC | 200x240 | 10-20 | https://jkpsc.nic.in |
| J&K SSB | jkssb | JKSSB | 180x225 | 20-50 | https://jkssb.nic.in |

- [ ] **Step 1: Add all 20 State PSC photo presets**
- [ ] **Step 2: Add all 20 State PSC signature presets**
- [ ] **Step 3: Verify build** — Run: `npm run build`
- [ ] **Step 4: Commit**

```bash
git add lib/presets.ts
git commit -m "feat: add 20 State PSC exam presets (photo + signature)"
```

---

### Task 4: Add Banking presets

**Files:**
- Modify: `lib/presets.ts` — add after existing IBPS entries

Add separate presets for: SBI PO, SBI Clerk, RBI Grade B, SBI CBO, IDBI AM. All use similar specs to IBPS (200x230px, 20-50KB). Each gets photo + signature.

| Bank | ID | Photo WxH | Photo KB |
|------|-----|-----------|----------|
| SBI PO | sbi-po | 200x230 | 20-50 |
| SBI Clerk | sbi-clerk | 200x230 | 20-50 |
| RBI Grade B | rbi-grade-b | 200x230 | 20-50 |
| SBI CBO | sbi-cbo | 200x230 | 20-50 |
| IDBI AM | idbi-am | 200x230 | 20-50 |

Signature for all: 140x60, 10-20KB (same as IBPS)

- [ ] **Step 1: Add 5 banking photo presets**
- [ ] **Step 2: Add 5 banking signature presets**
- [ ] **Step 3: Verify build**
- [ ] **Step 4: Commit**

```bash
git add lib/presets.ts
git commit -m "feat: add SBI PO/Clerk, RBI, IDBI banking presets"
```

---

### Task 5: Add Police presets

**Files:**
- Modify: `lib/presets.ts`

| Force | ID | Photo WxH | Photo KB |
|-------|-----|-----------|----------|
| Delhi Police | delhi-police | 100x120 | 20-50 |
| UP Police | up-police | 180x225 | 20-50 |
| Punjab Police | punjab-police | 200x240 | 20-50 |
| WB Police | wb-police | 200x240 | 10-50 |
| Haryana Police | haryana-police | 138x177 | 20-40 |
| Rajasthan Police | rajasthan-police | 350x450 | 50-100 |
| Maharashtra Police | maharashtra-police | 160x200 | 5-20 |
| TN Police | tn-police | 275x354 | 20-50 |
| Kerala Police | kerala-police | 150x200 | 20-30 |
| Bihar Police | bihar-police | 200x230 | 30-50 |
| MP Police | mp-police | 200x250 | 50-200 |
| Karnataka Police | karnataka-police | 200x250 | 30-100 |

Each gets photo + signature preset. Signature: 140x60, 10-20KB.

- [ ] **Step 1: Add 12 police photo presets**
- [ ] **Step 2: Add 12 police signature presets**
- [ ] **Step 3: Verify build**
- [ ] **Step 4: Commit**

```bash
git add lib/presets.ts
git commit -m "feat: add 12 Police recruitment exam presets"
```

---

### Task 6: Add remaining Central + Judiciary + Engineering presets

**Files:**
- Modify: `lib/presets.ts`

**Central:**
| Exam | ID | Photo WxH | Photo KB |
|------|-----|-----------|----------|
| RRB ALP | rrb-alp | 275x354 | 50-150 |
| GATE | gate | 350x450 | 5-1000 |

**Judiciary:**
| Exam | ID | Photo WxH | Photo KB |
|------|-----|-----------|----------|
| Delhi Judicial Service | djs | 200x240 | 20-50 |

Add NEET signature, JEE signature, GATE signature too (currently only photo presets exist for these).

- [ ] **Step 1: Add new central/engineering/judiciary presets (photo + signature)**
- [ ] **Step 2: Verify build**
- [ ] **Step 3: Commit**

```bash
git add lib/presets.ts
git commit -m "feat: add RRB ALP, GATE, DJS, and missing signature presets"
```

---

### Task 7: Create exam content data for rich per-page content

**Files:**
- Create: `lib/exam-content.ts`

This is the content moat. Each exam page should show unique, useful information beyond just the resizer tool. Create a data structure mapping exam IDs to content blocks.

```typescript
export interface ExamContent {
  // Brief about the exam (2-3 sentences)
  about: string;
  // Official website
  officialUrl: string;
  // Application steps specific to photo/signature upload
  uploadSteps: string[];
  // Common mistakes candidates make with photo/signature
  commonMistakes: string[];
  // Tips for taking a good photo for this specific exam
  photoTips: string[];
}

export const EXAM_CONTENT: Record<string, ExamContent> = {
  "SSC CGL": {
    about: "SSC CGL (Combined Graduate Level) is conducted by the Staff Selection Commission for recruitment to Group B and Group C posts in Government of India ministries and departments.",
    officialUrl: "https://ssc.gov.in",
    uploadSteps: [
      "Go to ssc.gov.in and log in to your SSC account",
      "Navigate to the application form photo upload section",
      "Upload your resized photo (100x120px, 20-50KB, JPEG)",
      "Upload your signature (140x60px, 10-20KB, JPEG)",
      "Verify both images in the preview before submitting",
    ],
    commonMistakes: [
      "Photo exceeds 50KB — use FitPic to compress to exact size",
      "Background is not plain white — take photo against white wall",
      "Name and date not written below photo — SSC requires this",
      "Signature is too faint — use black ink pen on white paper",
    ],
    photoTips: [
      "Take photo against a plain white wall with good lighting",
      "Write your name and date of photo on a white paper below your chin",
      "Wear formal clothing, no caps or sunglasses",
      "Face the camera directly, no side angles",
    ],
  },
  // ... similar entries for each exam
};
```

- [ ] **Step 1: Create `lib/exam-content.ts` with the ExamContent interface and data for top 20 exams** (SSC CGL, CHSL, GD, MTS, UPSC, IBPS, SBI PO, SBI Clerk, RBI Grade B, NEET, JEE Main, BPSC, UPPSC, WBCS, TNPSC, MPSC, RPSC, Delhi Police, UP Police, GATE)

- [ ] **Step 2: Commit**

```bash
git add lib/exam-content.ts
git commit -m "feat: add exam-specific content data for top 20 exams"
```

---

### Task 8: Render exam content on each exam page

**Files:**
- Modify: `app/[exam]/page.tsx`

Add a new section between the tool and the FAQ that renders the exam-specific content from `lib/exam-content.ts`. This gives Google unique content per page.

- [ ] **Step 1: Import and render exam content**

Add after the `<ExamToolClient>` component and before the FAQ section:

```tsx
import { EXAM_CONTENT } from "@/lib/exam-content";

// Inside ExamPage component, after ExamToolClient:
{EXAM_CONTENT[preset.exam] && (
  <div className="space-y-6">
    {/* About this exam */}
    <div className="space-y-2">
      <h2 className="text-lg font-bold text-neutral-200">
        About {preset.exam}
      </h2>
      <p className="text-neutral-400 text-sm leading-relaxed">
        {EXAM_CONTENT[preset.exam].about}
      </p>
    </div>

    {/* How to upload */}
    <div className="space-y-2">
      <h2 className="text-lg font-bold text-neutral-200">
        How to Upload Your {typeLabel} for {preset.exam}
      </h2>
      <ol className="list-decimal list-inside space-y-1 text-neutral-400 text-sm">
        {EXAM_CONTENT[preset.exam].uploadSteps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>

    {/* Common mistakes */}
    <div className="space-y-2">
      <h2 className="text-lg font-bold text-neutral-200">
        Common {typeLabel} Mistakes to Avoid
      </h2>
      <ul className="list-disc list-inside space-y-1 text-neutral-400 text-sm">
        {EXAM_CONTENT[preset.exam].commonMistakes.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>

    {/* Photo tips */}
    {preset.type === "photo" && (
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-neutral-200">
          Tips for {preset.exam} {typeLabel}
        </h2>
        <ul className="list-disc list-inside space-y-1 text-neutral-400 text-sm">
          {EXAM_CONTENT[preset.exam].photoTips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}
```

- [ ] **Step 2: Verify build**
- [ ] **Step 3: Commit**

```bash
git add app/[exam]/page.tsx
git commit -m "feat: render exam-specific content on each exam page"
```

---

### Task 9: Improve Related Tools internal linking

**Files:**
- Modify: `app/[exam]/page.tsx:117-132`

Currently shows first 6 random presets. Change to show related presets from the same category first, then others. This improves internal linking relevance.

- [ ] **Step 1: Update Related Tools section**

```tsx
{/* Related links — same category first */}
<div className="space-y-2">
  <h2 className="text-lg font-bold text-neutral-300">Related Tools</h2>
  <div className="flex flex-wrap gap-2">
    {PRESETS
      .filter((p) => p.id !== preset.id && p.id !== "custom")
      .sort((a, b) => {
        // Same category first
        if (a.category === preset.category && b.category !== preset.category) return -1;
        if (b.category === preset.category && a.category !== preset.category) return 1;
        return 0;
      })
      .slice(0, 8)
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
```

- [ ] **Step 2: Commit**

```bash
git add app/[exam]/page.tsx
git commit -m "feat: improve related tools linking to prioritize same category"
```

---

### Task 10: Create category hub pages

**Files:**
- Create: `app/category/[slug]/page.tsx`

Hub pages for each category: `/category/ssc`, `/category/banking`, `/category/state-psc`, `/category/police`, `/category/judiciary`, etc. These rank for broader terms like "SSC photo resizer" or "police exam photo size".

- [ ] **Step 1: Create the category route**

```typescript
// app/category/[slug]/page.tsx
import { PRESETS, CATEGORIES, getPresetSlug } from "@/lib/presets";
import { SITE_NAME } from "@/lib/constants";
import type { Metadata } from "next";

const CATEGORY_SLUGS: Record<string, string> = {
  "ssc": "SSC",
  "upsc": "UPSC",
  "banking": "Banking",
  "railway": "Railway",
  "medical-engineering": "Medical/Engineering",
  "id-passport": "ID/Passport",
  "postal": "Postal",
  "state-psc": "State PSC",
  "police": "Police",
  "judiciary": "Judiciary",
};

export function generateStaticParams() {
  return Object.keys(CATEGORY_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = CATEGORY_SLUGS[params.slug];
  if (!category) return { title: "Not Found" };

  const title = `${category} Photo & Signature Resizer — Free Online Tool | ${SITE_NAME}`;
  const description = `Free online photo and signature resizer for all ${category} exams. Resize to exact pixel and KB requirements. 100% browser-based, no signup.`;

  return {
    title,
    description,
    alternates: { canonical: `/category/${params.slug}` },
    openGraph: { title, description, type: "website", siteName: SITE_NAME },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = CATEGORY_SLUGS[params.slug];
  if (!category) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-neutral-300">Category Not Found</h1>
        <a href="/" className="text-yellow-400 hover:underline text-sm">Go home</a>
      </div>
    );
  }

  const presets = PRESETS.filter((p) => p.category === category && p.id !== "custom");

  return (
    <div className="space-y-8">
      <nav className="text-xs text-neutral-500">
        <a href="/" className="hover:text-neutral-300">Home</a>
        <span className="mx-1">&gt;</span>
        <span className="text-neutral-400">{category} Exams</span>
      </nav>

      <div className="space-y-3">
        <h1 className="text-2xl font-bold">
          {category} Photo & Signature Resizer
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Free online photo and signature resizer for all {category} exams.
          Select your specific exam below to resize to the exact requirements.
          100% browser-based — we never see your photos.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-bold text-neutral-300">
          All {category} Exam Formats
        </h2>
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
                  <td className="py-2 pr-4">
                    <a
                      href={`/${getPresetSlug(p)}`}
                      className="text-yellow-400 hover:underline"
                    >
                      {p.name}
                    </a>
                  </td>
                  <td className="py-2 pr-4 text-neutral-400">
                    {p.type === "photo" ? "Photo" : p.type === "thumb" ? "Thumb" : "Signature"}
                  </td>
                  <td className="py-2 pr-4 text-neutral-400">
                    {p.width}x{p.height}px
                  </td>
                  <td className="py-2 text-neutral-400">
                    {p.minKB}-{p.maxKB}KB
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross-link other categories */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-neutral-300">Other Categories</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_SLUGS)
            .filter(([slug]) => slug !== params.slug)
            .map(([slug, name]) => (
              <a
                key={slug}
                href={`/category/${slug}`}
                className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs hover:border-neutral-600"
              >
                {name}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**
- [ ] **Step 3: Commit**

```bash
git add app/category/
git commit -m "feat: add category hub pages for SEO internal linking"
```

---

### Task 11: Add category hub pages to sitemap

**Files:**
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Add category routes to sitemap**

```typescript
const categoryRoutes = Object.keys(CATEGORY_SLUGS).map((slug) => ({
  url: `${SITE_URL}/category/${slug}`,
  lastModified: new Date(),
  changeFrequency: "weekly" as const,
  priority: 0.85,
}));

return [...staticRoutes, ...categoryRoutes, ...examRoutes];
```

Import CATEGORY_SLUGS from the category page or define a shared constant.

- [ ] **Step 2: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat: add category hub pages to sitemap"
```

---

### Task 12: Update navigation with category links

**Files:**
- Modify: `app/layout.tsx:54-61`

Add category dropdown/links in the header nav for better crawlability.

- [ ] **Step 1: Add category links to nav**

Replace the nav section with:

```tsx
<nav className="flex gap-4 text-sm text-neutral-400">
  <a href="/photo-resizer" className="hover:text-neutral-200">Photo</a>
  <a href="/signature-resizer" className="hover:text-neutral-200">Signature</a>
  <a href="/category/ssc" className="hover:text-neutral-200">SSC</a>
  <a href="/category/banking" className="hover:text-neutral-200">Banking</a>
  <a href="/category/state-psc" className="hover:text-neutral-200">State PSC</a>
</nav>
```

- [ ] **Step 2: Update metadataBase to www**

Change line 8 from `https://fitpic.in` to `https://www.fitpic.in`.

- [ ] **Step 3: Update homepage "22+ exam presets" text to "150+ exam presets"**

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat: add category nav links, update metadataBase to www"
```

---

### Task 13: Final build verification and deploy

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with 150+ static pages generated

- [ ] **Step 2: Verify page count in build output**

Check the build output for number of routes generated.

- [ ] **Step 3: Commit all remaining changes and push**

```bash
git push origin main
```

- [ ] **Step 4: Post-deploy checklist**
- Verify sitemap at https://www.fitpic.in/sitemap.xml shows all new URLs
- Submit updated sitemap in Google Search Console
- Spot-check 5 random new pages for correct rendering
- Verify category hub pages load correctly
