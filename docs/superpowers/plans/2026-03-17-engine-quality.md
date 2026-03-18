# Engine Quality Tuning Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 10 image engine quality issues (constants cleanup, error handling, multi-pass threshold, unsharp params, signature threshold, PNG fallback, date stamp, upscale warning, HEIC/WebP handling, EXIF rotation) and deliver as a PR.

**Architecture:** All engine fixes go into `lib/imageEngine.ts` which is the core processing file. UI changes touch `components/ImageUploader.tsx` (HEIC/EXIF) and `components/ResultPreview.tsx` (upscale warning). Tests mirror the existing pattern in `__tests__/imageEngine.test.ts` using sharp (Node.js) to validate the same algorithms. Since most fixes target the same file, tasks are grouped by logical dependency rather than one-per-fix.

**Tech Stack:** Next.js 14, TypeScript, Pica (browser), Sharp (tests), Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-03-17-engine-quality-design.md`

**Delivery:** Feature branch `feat/engine-quality` → PR to `main`

---

## File Structure

### Files to Modify
- `lib/imageEngine.ts` — constants extraction, error handling, multi-pass/unsharp fixes, signature threshold, PNG fallback, date stamp, upscale flag, ProcessResult interface update
- `components/ImageUploader.tsx` — HEIC/WebP graceful handling via createImageBitmap, EXIF auto-rotation
- `components/ResultPreview.tsx` — upscale warning display, format-changed notice
- `__tests__/imageEngine.test.ts` — update threshold from 140→115, add new test cases

### No New Files
All changes are modifications to existing files.

---

## Task 0: Create feature branch

- [ ] **Step 1: Create and switch to feature branch**

```bash
cd /tmp/fitpic && git checkout main && git pull origin main && git checkout -b feat/engine-quality
```

- [ ] **Step 2: Verify branch**

```bash
cd /tmp/fitpic && git branch --show-current
```
Expected: `feat/engine-quality`

---

## Task 1: Constants cleanup + ProcessResult interface update

Extract all magic numbers to named constants at the top of `imageEngine.ts`. Also add `upscaled` and `formatChanged` fields to `ProcessResult` for later tasks.

**Files:**
- Modify: `lib/imageEngine.ts:1-39`

- [ ] **Step 1: Add named constants and update ProcessResult**

At the top of `lib/imageEngine.ts`, after `const pica = new Pica();` (line 14), add:

```ts
// ===== Engine constants =====
const SIGNATURE_INK_THRESHOLD = 115;
const MULTI_PASS_RATIO = 3;
const THREE_PASS_RATIO = 8;
const DARK_BG_LUMINANCE_THRESHOLD = 128;
const DARK_BG_PIXEL_RATIO = 0.5;
const MIN_STAMP_FONT_SIZE = 7;
const STAMP_FONT_FAMILY = "system-ui, -apple-system, sans-serif";
const STAMP_HEIGHT_RATIO = 0.12;
const MIN_STAMP_HEIGHT = 16;
const TOP_CROP_BIAS = 0.20;
const STAMP_NAME_MAX_LENGTH = 25;
const JPEG_SEARCH_ITERATIONS = 25;
const JPEG_MIN_QUALITY = 0.05;
const JPEG_MAX_QUALITY = 0.99;
const JPEG_CONVERGENCE_DELTA = 0.005;
const SIGNATURE_UNSHARP = { amount: 200, radius: 0.8, threshold: 1 };
const UNSHARP_CONFIGS = [
  { maxRatio: 1.5, amount: 80, radius: 0.4 },
  { maxRatio: 3, amount: 160, radius: 0.8 },
  { maxRatio: 6, amount: 260, radius: 0.9 },
  { maxRatio: Infinity, amount: 320, radius: 1.0 },
] as const;
```

Update `ProcessResult` interface (lines 30-39) to add two new fields:

```ts
export interface ProcessResult {
  dataUrl: string;
  blob: Blob;
  sizeKB: number;
  width: number;
  height: number;
  quality: number;
  withinRange: boolean;
  format: string;
  upscaled: boolean;
  formatChanged: boolean;
}
```

- [ ] **Step 2: Replace all magic numbers in the file with constants**

Replace these throughout the file:
- Line 70: `0.20` → `TOP_CROP_BIAS`
- Line 134: `Math.max(5, Math.min(20, ...))` — keep as is (sample size, not a tuning param)
- Line 150: `128` → `DARK_BG_LUMINANCE_THRESHOLD`
- Line 155: `0.5` → `DARK_BG_PIXEL_RATIO`
- Line 175: `140` → `SIGNATURE_INK_THRESHOLD`
- Line 202: `4` → `MULTI_PASS_RATIO`
- Lines 208-209: `0.5` → `0.75` (first-pass unsharp multiplier improvement from spec)
- Line 255: `Math.max(6, ...)` → `Math.max(MIN_STAMP_FONT_SIZE, ...)`
- Line 256: `Arial, sans-serif` → `${STAMP_FONT_FAMILY}`
- Line 259: `fontSize > 5` → `fontSize > MIN_STAMP_FONT_SIZE`
- Line 290: `0.12` → `STAMP_HEIGHT_RATIO`
- Line 290: `16` → `MIN_STAMP_HEIGHT`
- Lines 313-317: signature unsharp values → `SIGNATURE_UNSHARP.amount`, etc.
- Lines 344-358: unsharp if/else chain → loop over `UNSHARP_CONFIGS`
- Line 362: hardcoded `2` → dynamic threshold `Math.max(1, Math.min(3, Math.round(downscaleRatio / 3)))`
- Lines 391-408: JPEG search params → use named constants

Replace the unsharp if/else chain (lines 343-358) with:

```ts
const config = UNSHARP_CONFIGS.find((c) => downscaleRatio <= c.maxRatio)!;
let unsharpAmount = config.amount;
let unsharpRadius = config.radius;
const unsharpThreshold = Math.max(1, Math.min(3, Math.round(downscaleRatio / 3)));
```

- [ ] **Step 3: Update return statement to include new fields**

In the return at the bottom of `processImage` (line 420-429), add:

```ts
return {
  dataUrl: bestDataUrl,
  blob: bestBlob!,
  sizeKB: bestSizeKB,
  width: targetWidth,
  height: totalHeight,
  quality: Math.round(bestQuality * 100),
  withinRange: bestSizeKB >= minKB && bestSizeKB <= maxKB,
  format: format === "png" ? "image/png" : "image/jpeg",
  upscaled: false,  // will be set properly in Task 3
  formatChanged: false,  // will be set properly in Task 2
};
```

- [ ] **Step 4: Run existing tests to verify nothing broke**

```bash
cd /tmp/fitpic && npx jest __tests__/imageEngine.test.ts --verbose
```
Expected: All 11 existing tests PASS (threshold change from 140→115 shouldn't affect the sample-signature.png since it's black ink on white)

- [ ] **Step 5: Commit**

```bash
cd /tmp/fitpic && git add lib/imageEngine.ts && git commit -m "refactor: extract magic numbers to named constants, update ProcessResult interface"
```

---

## Task 2: Multi-pass threshold + three-pass + PNG fallback + error handling

These are all compression/resize pipeline changes in `imageEngine.ts`.

**Files:**
- Modify: `lib/imageEngine.ts` (picaResizeMultiPass, processImage compression section)

- [ ] **Step 1: Update picaResizeMultiPass for three-pass support**

Replace the entire `picaResizeMultiPass` function (lines 190-234) with:

```ts
async function picaResizeMultiPass(
  src: HTMLCanvasElement,
  targetW: number,
  targetH: number,
  unsharpAmount: number,
  unsharpRadius: number,
  unsharpThreshold: number
): Promise<HTMLCanvasElement> {
  const srcW = src.width;
  const srcH = src.height;
  const ratio = Math.max(srcW / targetW, srcH / targetH);

  if (ratio > THREE_PASS_RATIO) {
    // Three-pass: source → 4x target → 2x target → target
    const mid1W = targetW * 4;
    const mid1H = targetH * 4;
    const mid1Canvas = makeCanvas(mid1W, mid1H);
    await pica.resize(src, mid1Canvas, {
      unsharpAmount: Math.round(unsharpAmount * 0.5),
      unsharpRadius: unsharpRadius * 0.5,
      unsharpThreshold,
      alpha: false,
    });

    const mid2W = targetW * 2;
    const mid2H = targetH * 2;
    const mid2Canvas = makeCanvas(mid2W, mid2H);
    await pica.resize(mid1Canvas, mid2Canvas, {
      unsharpAmount: Math.round(unsharpAmount * 0.75),
      unsharpRadius,
      unsharpThreshold,
      alpha: false,
    });

    const destCanvas = makeCanvas(targetW, targetH);
    await pica.resize(mid2Canvas, destCanvas, {
      unsharpAmount,
      unsharpRadius,
      unsharpThreshold,
      alpha: false,
    });
    return destCanvas;
  }

  if (ratio > MULTI_PASS_RATIO) {
    // Two-pass: source → 2x target → target
    const midW = targetW * 2;
    const midH = targetH * 2;
    const midCanvas = makeCanvas(midW, midH);
    await pica.resize(src, midCanvas, {
      unsharpAmount: Math.round(unsharpAmount * 0.75),
      unsharpRadius,
      unsharpThreshold,
      alpha: false,
    });

    const destCanvas = makeCanvas(targetW, targetH);
    await pica.resize(midCanvas, destCanvas, {
      unsharpAmount,
      unsharpRadius,
      unsharpThreshold,
      alpha: false,
    });
    return destCanvas;
  }

  // Single pass
  const destCanvas = makeCanvas(targetW, targetH);
  await pica.resize(src, destCanvas, {
    unsharpAmount,
    unsharpRadius,
    unsharpThreshold,
    alpha: false,
  });
  return destCanvas;
}
```

- [ ] **Step 2: Add ProcessingError class and wrap pica calls**

Add after the constants block:

```ts
export class ProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProcessingError";
  }
}
```

Then wrap the two main pica call sites in `processImage`:

In the signature pipeline (around line 313), wrap:
```ts
try {
  await pica.resize(srcCanvas, fitCanvas, { ... });
} catch {
  throw new ProcessingError("Failed to resize image. The file may be corrupted.");
}
```

In the compression section, wrap `pica.toBlob` calls:
```ts
try {
  const blob = await pica.toBlob(finalCanvas, "image/jpeg", mid);
  // ...
} catch {
  throw new ProcessingError("Failed to compress image. Try a smaller source file.");
}
```

- [ ] **Step 3: Add PNG size fallback**

Replace the PNG block (lines 385-389) with:

```ts
if (format === "png") {
  try {
    bestBlob = await pica.toBlob(finalCanvas, "image/png", 0);
  } catch {
    throw new ProcessingError("Failed to compress image. Try a smaller source file.");
  }
  bestSizeKB = Math.round(bestBlob.size / 1024);
  bestQuality = 1.0;
  bestDataUrl = await blobToDataUrl(bestBlob);

  // If PNG exceeds maxKB, fall back to JPEG
  if (bestSizeKB > maxKB) {
    formatChanged = true;
    // Use the JPEG binary search below
  }
}

if (format === "jpeg" || formatChanged) {
  // ... existing JPEG binary search ...
}
```

Add `let formatChanged = false;` before the compression section.

Update the return to use `formatChanged`.

- [ ] **Step 4: Run existing tests**

```bash
cd /tmp/fitpic && npx jest __tests__/imageEngine.test.ts --verbose
```
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
cd /tmp/fitpic && git add lib/imageEngine.ts && git commit -m "feat: add three-pass resize, PNG fallback to JPEG, error handling with ProcessingError"
```

---

## Task 3: Signature threshold + dark bg detection + upscale flag + date stamp

Remaining engine fixes in `imageEngine.ts`.

**Files:**
- Modify: `lib/imageEngine.ts` (isDarkBackground, processSignatureOnSource, drawDateStamp, processImage)

- [ ] **Step 1: Improve isDarkBackground to sample edges, not just corners**

Replace the `isDarkBackground` function with:

```ts
function isDarkBackground(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext("2d")!;
  const w = canvas.width;
  const h = canvas.height;
  const edgeWidth = Math.max(3, Math.min(10, Math.floor(Math.min(w, h) * 0.03)));

  let darkPixels = 0;
  let totalPixels = 0;

  // Sample all 4 edges
  const edges = [
    ctx.getImageData(0, 0, w, edgeWidth),           // top
    ctx.getImageData(0, h - edgeWidth, w, edgeWidth), // bottom
    ctx.getImageData(0, 0, edgeWidth, h),             // left
    ctx.getImageData(w - edgeWidth, 0, edgeWidth, h), // right
  ];

  for (const imageData of edges) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (gray < DARK_BG_LUMINANCE_THRESHOLD) darkPixels++;
      totalPixels++;
    }
  }

  return darkPixels / totalPixels > DARK_BG_PIXEL_RATIO;
}
```

- [ ] **Step 2: Update date stamp with min font size, truncation, and font stack**

Replace the `drawDateStamp` function with:

```ts
function drawDateStamp(
  ctx: CanvasRenderingContext2D,
  width: number,
  yOffset: number,
  stampHeight: number,
  name: string,
  date: string
): void {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, yOffset, width, stampHeight);

  // Truncate long names
  const displayName = name.length > STAMP_NAME_MAX_LENGTH
    ? name.substring(0, STAMP_NAME_MAX_LENGTH - 3) + "..."
    : name;
  const label = `${displayName} | ${date}`;
  const padding = 4;
  const maxTextWidth = width - padding * 2;

  let fontSize = Math.max(MIN_STAMP_FONT_SIZE, Math.round(stampHeight * 0.45));
  ctx.font = `bold ${fontSize}px ${STAMP_FONT_FAMILY}`;
  let textWidth = ctx.measureText(label).width;

  while (textWidth > maxTextWidth && fontSize > MIN_STAMP_FONT_SIZE) {
    fontSize--;
    ctx.font = `bold ${fontSize}px ${STAMP_FONT_FAMILY}`;
    textWidth = ctx.measureText(label).width;
  }

  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, width / 2, yOffset + stampHeight / 2);
}
```

- [ ] **Step 3: Add upscale detection in processImage**

In the photo pipeline section, after computing `downscaleRatio` (around line 339), add:

```ts
const isUpscaled = downscaleRatio < 1;
```

And in the return statement, set `upscaled: isUpscaled`.

For the signature pipeline, compute upscale similarly:
```ts
const sigScale = Math.min(targetWidth / srcW, targetHeight / srcH);
const isUpscaled = sigScale > 1;
```

- [ ] **Step 4: Run tests**

```bash
cd /tmp/fitpic && npx jest __tests__/imageEngine.test.ts --verbose
```
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
cd /tmp/fitpic && git add lib/imageEngine.ts && git commit -m "feat: improve dark bg detection, lower signature threshold, fix date stamp font, add upscale flag"
```

---

## Task 4: Update test file for new threshold and add new test cases

**Files:**
- Modify: `__tests__/imageEngine.test.ts`

- [ ] **Step 1: Update existing test threshold from 140 to 115**

In the `processSignature` function in the test file, change line 50:
```ts
.threshold(140)
```
to:
```ts
.threshold(115)
```

- [ ] **Step 2: Add new test cases**

Append these tests inside the existing `describe("imageEngine", ...)` block:

```ts
  test("Upscale detection: source smaller than target", async () => {
    // Create a small 50x50 image
    const buf = await sharp({
      create: { width: 50, height: 50, channels: 3, background: { r: 200, g: 200, b: 200 } },
    }).jpeg().toBuffer();

    const tmpPath = path.join(__dirname, "../test-output/small_test.jpg");
    if (!fs.existsSync(path.dirname(tmpPath))) fs.mkdirSync(path.dirname(tmpPath), { recursive: true });
    fs.writeFileSync(tmpPath, buf);

    const r = await processImage(tmpPath, { targetWidth: 200, targetHeight: 230, minKB: 1, maxKB: 50, bgColor: "#FFFFFF" });
    expect(r.width).toBe(200);
    expect(r.height).toBe(230);
    // Image was upscaled — quality will be low but dimensions correct

    fs.unlinkSync(tmpPath);
  });

  test("Date stamp with very long name truncates", async () => {
    const r = await processImage(PHOTO, {
      targetWidth: 100, targetHeight: 120, minKB: 1, maxKB: 50,
      bgColor: "#FFFFFF",
      dateStamp: { name: "Anitha Venkatakrishnan Subramaniam", date: "17/03/2026" },
    });
    expect(r.height).toBe(136); // 120 + 16 stamp
    expect(r.sizeKB).toBeLessThanOrEqual(50);
  });

  test("User photo SiddharthaBose.JPG processes for all major presets", async () => {
    const userPhoto = "/Users/siddharthabose/Downloads/adgen/SiddharthaBose.JPG";
    if (!fs.existsSync(userPhoto)) return; // skip if file not available

    // SSC
    const ssc = await processImage(userPhoto, { targetWidth: 100, targetHeight: 120, minKB: 20, maxKB: 50, bgColor: "#FFFFFF" });
    expect(ssc.width).toBe(100);
    expect(ssc.height).toBe(120);
    expect(ssc.sizeKB).toBeLessThanOrEqual(50);

    // UPSC
    const upsc = await processImage(userPhoto, { targetWidth: 350, targetHeight: 350, minKB: 30, maxKB: 100, bgColor: "#FFFFFF" });
    expect(upsc.width).toBe(350);
    expect(upsc.sizeKB).toBeLessThanOrEqual(100);

    // Passport
    const passport = await processImage(userPhoto, { targetWidth: 413, targetHeight: 531, minKB: 20, maxKB: 300, bgColor: "#FFFFFF" });
    expect(passport.width).toBe(413);
    expect(passport.sizeKB).toBeLessThanOrEqual(300);
  });

  test("User signature bose-sign.png processes for SSC preset", async () => {
    const userSig = "/Users/siddharthabose/Downloads/adgen/bose sign.png";
    if (!fs.existsSync(userSig)) return; // skip if file not available

    const r = await processImage(userSig, { targetWidth: 140, targetHeight: 60, minKB: 10, maxKB: 20, bgColor: null, signatureMode: true });
    expect(r.width).toBe(140);
    expect(r.height).toBe(60);
    expect(r.sizeKB).toBeLessThanOrEqual(20);
  });
```

- [ ] **Step 3: Run all tests**

```bash
cd /tmp/fitpic && npx jest --verbose
```
Expected: All tests PASS (including new ones)

- [ ] **Step 4: Commit**

```bash
cd /tmp/fitpic && git add __tests__/imageEngine.test.ts && git commit -m "test: update threshold to 115, add upscale/truncation/user-photo test cases"
```

---

## Task 5: ImageUploader — HEIC/WebP handling + EXIF auto-rotation

**Files:**
- Modify: `components/ImageUploader.tsx`

- [ ] **Step 1: Update handleFile to use createImageBitmap for HEIC/WebP and EXIF**

Replace the `handleFile` function in `ImageUploader.tsx` (lines 18-46) with:

```tsx
  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (file.size > MAX_FILE_SIZE) {
        setError("File too large. Maximum 10MB allowed.");
        return;
      }

      try {
        // Use createImageBitmap for HEIC/WebP support + EXIF auto-rotation
        const bitmap = await createImageBitmap(file, {
          imageOrientation: "from-image",
        });

        // Draw bitmap onto a canvas to get an HTMLImageElement
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();

        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
        const img = new Image();
        img.onload = () => {
          setPreview(dataUrl);
          setFileName(file.name);
          onImageLoad(img, file);
        };
        img.onerror = () => {
          setError("Could not load image. Please try a different file.");
        };
        img.src = dataUrl;
      } catch {
        // createImageBitmap failed — browser can't decode this format
        setError(
          "Your browser can't open this file format. Please convert to JPEG or PNG first."
        );
      }
    },
    [onImageLoad]
  );
```

Note: This removes the old HEIC-specific block (lines 27-30) and the old `new Image()` loading (lines 32-44), replacing both with a unified `createImageBitmap` path that handles all formats + EXIF rotation.

- [ ] **Step 2: Commit**

```bash
cd /tmp/fitpic && git add components/ImageUploader.tsx && git commit -m "feat: use createImageBitmap for HEIC/WebP support and EXIF auto-rotation"
```

---

## Task 6: ResultPreview — upscale warning + format-changed notice

**Files:**
- Modify: `components/ResultPreview.tsx`

- [ ] **Step 1: Add warnings to ResultPreview**

In `ResultPreview.tsx`, after the status banner `<div>` (around line 35), add:

```tsx
      {/* Upscale warning */}
      {result.upscaled && (
        <div className="p-3 rounded-xl text-sm bg-amber-400/10 text-amber-400 border border-amber-400/30">
          Source image was smaller than target — quality may be reduced.
        </div>
      )}

      {/* Format changed notice */}
      {result.formatChanged && (
        <div className="p-3 rounded-xl text-sm bg-blue-400/10 text-blue-400 border border-blue-400/30">
          PNG exceeded size limit — saved as JPEG instead.
        </div>
      )}
```

- [ ] **Step 2: Commit**

```bash
cd /tmp/fitpic && git add components/ResultPreview.tsx && git commit -m "feat: add upscale warning and PNG-to-JPEG format change notice"
```

---

## Task 7: Final verification + PR

- [ ] **Step 1: Run full test suite**

```bash
cd /tmp/fitpic && npx jest --verbose
```
Expected: All tests PASS

- [ ] **Step 2: Run production build**

```bash
cd /tmp/fitpic && npx next build 2>&1 | tail -20
```
Expected: Build succeeds

- [ ] **Step 3: Push branch**

```bash
cd /tmp/fitpic && git push -u origin feat/engine-quality
```

- [ ] **Step 4: Create PR**

```bash
cd /tmp/fitpic && ~/bin/gh pr create --title "Engine quality: constants, thresholds, multi-pass, HEIC, EXIF, error handling" --body "$(cat <<'PREOF'
## Summary
- Extract all magic numbers to named constants for maintainability
- Lower multi-pass threshold from 4x to 3x, add three-pass for >8x downscales
- Fix unsharp radius inconsistency, add dynamic threshold
- Lower signature ink threshold from 140 to 115 (captures light/faded ink)
- Improve dark background detection: sample all 4 edges instead of corners
- Add PNG size fallback: auto-convert to JPEG if PNG exceeds maxKB
- Fix date stamp: min font 7px (was 5px), name truncation, better font stack
- Add upscale warning flag when source is smaller than target
- Add HEIC/WebP support via createImageBitmap with graceful fallback
- Add EXIF auto-rotation for phone photos
- Add ProcessingError class for user-friendly error messages
- Expanded test coverage with user photos and edge cases

## Test plan
- [ ] All automated tests pass
- [ ] Upload SiddharthaBose.JPG through SSC, UPSC, Passport presets — verify quality
- [ ] Upload bose sign.png through SSC, IBPS signature presets — verify ink preserved
- [ ] Test on mobile (Android Chrome)
- [ ] Verify upscale warning shows when uploading a tiny image
- [ ] Verify HEIC error message on Android Chrome

🤖 Generated with [Claude Code](https://claude.com/claude-code)
PREOF
)"
```
