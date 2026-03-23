# FitPic Engine Fixes & Quality Tuning — Design Spec

**Date:** 2026-03-17
**Status:** Approved
**Scope:** Sub-project 1 of 3 (Engine only, no new UI features)

## Problem

The image processing engine has several quality issues: HEIC/WebP uploads can silently fail, PNG output has no size optimization, multi-pass resize thresholds are too conservative, signature processing loses light inks, date stamps become illegible at small sizes, and there's no EXIF auto-rotation for phone photos.

## Goal

Fix all identified engine quality issues, improve output quality across presets, add error handling, and expand test coverage. Deliver as a PR for review.

## Out of Scope

- Rotation UI (Sub-project 2)
- Crop editor UI (Sub-project 3)
- Face detection
- Background removal

---

## Fix 1: HEIC/WebP Format Handling

**Problem:** `lib/constants.ts` accepts HEIC and WebP uploads, but `imageEngine.ts` only handles JPEG and PNG output. On browsers that can't decode HEIC (most Android Chrome versions), uploads silently fail.

**Fix:** In `ImageUploader.tsx`, after the user selects a file, use `createImageBitmap()` to decode it. This handles HEIC/WebP on supported browsers natively. If `createImageBitmap` fails (unsupported format), show a user-friendly error: "Your browser can't open this file format. Please convert to JPEG or PNG first."

This is a graceful degradation approach — no new libraries needed. ~6-8% of Indian users are on iPhone (HEIC default), most on Android (JPEG default), so this is a nice-to-have safety net.

**Files:** `components/ImageUploader.tsx`

---

## Fix 2: PNG Size Fallback

**Problem:** If a PNG output exceeds `maxKB`, there's no size optimization. JPEG uses binary search for quality, but PNG is lossless with no quality knob.

**Fix:** After generating PNG blob, if `sizeKB > maxKB`, re-encode as JPEG using the existing binary search. Add `formatChanged: true` flag to `ProcessResult` so the UI can notify the user: "PNG exceeded size limit, saved as JPEG instead."

**Files:** `lib/imageEngine.ts` (processImage function, lines 385-389), `types/` if ProcessResult needs updating

---

## Fix 3: Multi-Pass Resize Threshold

**Problem:** Multi-pass triggers at >4x ratio. A 400x400 source to 100x120 target (3.3x) gets single-pass, which degrades quality. Also, extreme downscales (>8x) only get 2 passes.

**Fix:**
- Lower threshold from `ratio > 4` to `ratio > 3`
- Add three-pass for `ratio > 8`: source → 4x target → 2x target → target
- Increase first-pass unsharp from `0.5x` to `0.75x` to preserve detail

**Files:** `lib/imageEngine.ts` (picaResizeMultiPass function, lines 190-234)

---

## Fix 4: Signature Threshold

**Problem:** Fixed threshold of 140 loses gray ink, pencil, and faded signatures. Luminance 150 (light gray) is above 140 and becomes invisible.

**Fix:**
- Lower threshold from 140 to 115
- Improve dark background detection: sample all 4 edges (top row, bottom row, left column, right column) instead of just 4 corner squares

**Files:** `lib/imageEngine.ts` (processSignatureOnSource lines 162-183, isDarkBackground lines 130-156)

---

## Fix 5: Unsharp Parameter Fixes

**Problem:**
- Extreme downscale (>6x) uses radius 0.8 but 3-6x range uses 0.9 — inconsistent
- Unsharp threshold is hardcoded at 2 for all ratios
- First-pass unsharp in multi-pass is halved (0.5x) which loses detail

**Fix:**
- Set extreme downscale radius to 1.0
- Add dynamic threshold: `Math.max(1, Math.min(3, Math.round(downscaleRatio / 3)))`
- Increase first-pass unsharp multiplier from 0.5 to 0.75

**Files:** `lib/imageEngine.ts` (lines 343-362, lines 207-209)

---

## Fix 6: Date Stamp Improvements

**Problem:** Minimum font size is 5px (illegible at 100px-wide targets). No truncation for long names — text overflows.

**Fix:**
- Raise minimum font size from 5px to 7px
- Add name truncation: if text won't fit at 7px, truncate name with ellipsis
- Use `"system-ui, -apple-system, sans-serif"` font stack for better cross-platform rendering

**Files:** `lib/imageEngine.ts` (drawDateStamp function, lines 240-269)

---

## Fix 7: EXIF Auto-Rotation

**Problem:** Phone photos (especially iPhone) embed EXIF orientation data. Without auto-rotation, photos appear sideways or upside-down.

**Fix:** In `ImageUploader.tsx`, when loading the uploaded image, use `createImageBitmap(blob, {imageOrientation: "from-image"})` to auto-apply EXIF rotation before passing to the engine. Fallback to standard `Image()` loading if `createImageBitmap` options aren't supported.

**Files:** `components/ImageUploader.tsx`

---

## Fix 8: Upscaling Warning

**Problem:** If source image is smaller than target dimensions, the engine silently upscales with poor quality. No indication to the user.

**Fix:** Add `upscaled: boolean` flag to `ProcessResult`. Set to true when `downscaleRatio < 1`. The existing `ResultPreview` component can show a yellow warning: "Source image was smaller than target — quality may be reduced."

**Files:** `lib/imageEngine.ts` (ProcessResult interface, processImage function), `components/ResultPreview.tsx`

---

## Fix 9: Error Handling

**Problem:** `pica.resize()` and `pica.toBlob()` can throw on corrupted images or OOM. No try-catch in the engine — errors bubble up as unhandled.

**Fix:** Wrap pica calls in try-catch. Throw a custom `ProcessingError` with user-friendly messages:
- "Failed to resize image. The file may be corrupted."
- "Failed to compress image. Try a smaller source file."

**Files:** `lib/imageEngine.ts`

---

## Fix 10: Constants Cleanup

**Problem:** Magic numbers scattered throughout the file: threshold 140, ratio 4, unsharp amounts/radii, dark bg threshold 128, etc.

**Fix:** Extract all to named constants at top of `imageEngine.ts`:
```ts
const SIGNATURE_INK_THRESHOLD = 115;
const MULTI_PASS_RATIO = 3;
const THREE_PASS_RATIO = 8;
const DARK_BG_LUMINANCE_THRESHOLD = 128;
const DARK_BG_PIXEL_RATIO = 0.5;
const MIN_STAMP_FONT_SIZE = 7;
const STAMP_HEIGHT_RATIO = 0.12;
const TOP_CROP_BIAS = 0.20;
// ... etc
```

**Files:** `lib/imageEngine.ts`

---

## Test Plan

**Test files:**
- Existing: `public/test-samples/sample-photo.jpg`, `public/test-samples/sample-signature.png`
- User-provided: `/Users/siddharthabose/Downloads/adgen/SiddharthaBose.JPG` (photo), `/Users/siddharthabose/Downloads/adgen/bose sign.png` (signature)

**New tests to add to `__tests__/imageEngine.test.ts`:**
- PNG size fallback: generate PNG, verify JPEG fallback when oversized
- Multi-pass at 3-4x ratio: verify multi-pass path triggers
- Three-pass at >8x ratio: verify three-pass path triggers
- Signature threshold: verify gray ink (luminance ~120) is captured
- Date stamp truncation: long name (50 chars) at 100px width
- Upscaling flag: source smaller than target
- Error handling: verify ProcessingError on invalid input
- Constants: verify all named constants are used (no magic numbers)

**Manual testing (user):**
- Upload SiddharthaBose.JPG through all photo presets, verify output quality
- Upload bose sign.png through all signature presets, verify ink is preserved
- Test on mobile browser (Android Chrome, iOS Safari if available)

---

## Implementation Order

1. Fix 10 (constants cleanup) — prerequisite, makes other changes cleaner
2. Fix 9 (error handling) — safety net for remaining changes
3. Fix 3 (multi-pass threshold) + Fix 5 (unsharp params) — resampling quality
4. Fix 4 (signature threshold) — signature quality
5. Fix 2 (PNG size fallback) — compression quality
6. Fix 6 (date stamp) — rendering quality
7. Fix 8 (upscaling warning) — ProcessResult change
8. Fix 1 (HEIC/WebP) + Fix 7 (EXIF rotation) — ImageUploader changes
9. Tests for all fixes
10. Create PR

## Files Changed

- `lib/imageEngine.ts` — fixes 2-6, 8-10
- `components/ImageUploader.tsx` — fixes 1, 7
- `components/ResultPreview.tsx` — fix 8 (upscale warning display)
- `__tests__/imageEngine.test.ts` — expanded test coverage
