/**
 * Core image processing engine using Pica (Lanczos3 resampling).
 * All processing happens client-side — zero server calls.
 *
 * v4 fixes:
 * - Signatures: FIT mode (contain + white pad) — never crops
 * - Photos: top-biased COVER crop — keeps head, crops bottom
 * - Much stronger unsharp for crisp output at all sizes
 * - Multi-pass resize for extreme downscales (>4x)
 */

import Pica from "pica";

let _pica: Pica | null = null;
function getPica(): Pica {
  if (!_pica) _pica = new Pica();
  return _pica;
}

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
  { maxRatio: 1.5, amount: 40, radius: 0.3 },
  { maxRatio: 3, amount: 60, radius: 0.4 },
  { maxRatio: 6, amount: 80, radius: 0.5 },
  { maxRatio: Infinity, amount: 100, radius: 0.6 },
] as const;

export class ProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProcessingError";
  }
}

export interface ProcessOptions {
  targetWidth: number;
  targetHeight: number;
  minKB: number;
  maxKB: number;
  bgColor: string | null;
  format: "jpeg" | "png";
  dateStamp?: {
    name: string;
    date: string;
  };
  signatureMode?: boolean;
  // For photo crops only: 0 = crop from top, 0.5 = center crop.
  cropBiasY?: number;
}

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

function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

/**
 * Draw source image onto a canvas for PHOTOS.
 * Top-biased COVER crop: keeps head, crops from bottom.
 */
function drawPhotoCropped(
  img: HTMLImageElement,
  targetAspect: number,
  cropBiasY = 0.2
): HTMLCanvasElement {
  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;
  const srcAspect = srcW / srcH;

  let cropX = 0, cropY = 0, cropW = srcW, cropH = srcH;

  if (srcAspect > targetAspect) {
    // Source wider — crop sides (center)
    cropW = Math.round(srcH * targetAspect);
    cropX = Math.round((srcW - cropW) / 2);
  } else {
    // Source taller — crop bottom (keep head at top)
    cropH = Math.round(srcW / targetAspect);
    // Clamp to safe range: [0, 0.5] where 0 is top-biased and 0.5 is centered.
    const bias = Math.max(0, Math.min(0.5, cropBiasY));
    cropY = Math.round((srcH - cropH) * bias);
  }

  const c = makeCanvas(cropW, cropH);
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
  return c;
}

/**
 * Draw source image onto a canvas for SIGNATURES.
 * FIT mode (contain): scales to fit entirely, white padding around edges.
 * Never crops — the full signature is always visible.
 */
function drawSignatureFit(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;

  // Scale to fit within target (contain mode)
  const scale = Math.min(targetWidth / srcW, targetHeight / srcH);
  const drawW = Math.round(srcW * scale);
  const drawH = Math.round(srcH * scale);

  // Create canvas at SOURCE scaled size (we'll pad to target after resize)
  // Actually, draw full source onto a canvas that maintains its aspect ratio
  // then pad to exact target after processing
  const c = makeCanvas(srcW, srcH);
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  return c;
}

/**
 * Flatten PNG transparency to white background.
 */
function flattenToWhite(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d")!;
  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] / 255;
    data[i] = Math.round(data[i] * a + 255 * (1 - a));
    data[i + 1] = Math.round(data[i + 1] * a + 255 * (1 - a));
    data[i + 2] = Math.round(data[i + 2] * a + 255 * (1 - a));
    data[i + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Detect dark background by sampling edge pixels.
 */
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

/**
 * Process signature at SOURCE resolution before resize.
 * Flatten → detect dark bg → invert if needed → threshold at 140.
 */
function processSignatureOnSource(canvas: HTMLCanvasElement): void {
  flattenToWhite(canvas);
  const needsInvert = isDarkBackground(canvas);

  const ctx = canvas.getContext("2d")!;
  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (needsInvert) gray = 255 - gray;
    const val = gray < SIGNATURE_INK_THRESHOLD ? 0 : 255;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

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
    // Only sharpen on the FINAL pass to avoid compounding artifacts
    const mid1W = targetW * 4;
    const mid1H = targetH * 4;
    const mid1Canvas = makeCanvas(mid1W, mid1H);
    try {
      await getPica().resize(src, mid1Canvas, {
        alpha: false,
      });
    } catch {
      throw new ProcessingError("Failed to resize image. The file may be corrupted.");
    }

    const mid2W = targetW * 2;
    const mid2H = targetH * 2;
    const mid2Canvas = makeCanvas(mid2W, mid2H);
    try {
      await getPica().resize(mid1Canvas, mid2Canvas, {
        alpha: false,
      });
    } catch {
      throw new ProcessingError("Failed to resize image. The file may be corrupted.");
    }

    const destCanvas = makeCanvas(targetW, targetH);
    try {
      await getPica().resize(mid2Canvas, destCanvas, {
        unsharpAmount,
        unsharpRadius,
        unsharpThreshold,
        alpha: false,
      });
    } catch {
      throw new ProcessingError("Failed to resize image. The file may be corrupted.");
    }
    return destCanvas;
  }

  if (ratio > MULTI_PASS_RATIO) {
    // Two-pass: source → 2x target → target
    // Only sharpen on the FINAL pass
    const midW = targetW * 2;
    const midH = targetH * 2;
    const midCanvas = makeCanvas(midW, midH);
    try {
      await getPica().resize(src, midCanvas, {
        alpha: false,
      });
    } catch {
      throw new ProcessingError("Failed to resize image. The file may be corrupted.");
    }

    const destCanvas = makeCanvas(targetW, targetH);
    try {
      await getPica().resize(midCanvas, destCanvas, {
        unsharpAmount,
        unsharpRadius,
        unsharpThreshold,
        alpha: false,
      });
    } catch {
      throw new ProcessingError("Failed to resize image. The file may be corrupted.");
    }
    return destCanvas;
  }

  // Single pass
  const destCanvas = makeCanvas(targetW, targetH);
  try {
    await getPica().resize(src, destCanvas, {
      unsharpAmount,
      unsharpRadius,
      unsharpThreshold,
      alpha: false,
    });
  } catch {
    throw new ProcessingError("Failed to resize image. The file may be corrupted.");
  }
  return destCanvas;
}

/**
 * Draw date stamp strip.
 * Single line: "Name | Date", bold, auto-fit font to width.
 */
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

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}


/**
 * Main image processing function.
 */
export async function processImage(
  sourceImage: HTMLImageElement,
  options: ProcessOptions
): Promise<ProcessResult> {
  const {
    targetWidth,
    targetHeight,
    minKB,
    maxKB,
    format,
    dateStamp,
    signatureMode,
    cropBiasY,
  } = options;

  const stampHeight = dateStamp
    ? Math.max(MIN_STAMP_HEIGHT, Math.round(targetHeight * STAMP_HEIGHT_RATIO))
    : 0;
  const totalHeight = targetHeight + stampHeight;

  let destCanvas: HTMLCanvasElement;
  let isUpscaled = false;

  if (signatureMode) {
    // === SIGNATURE PIPELINE ===
    // 1. Draw full source (no crop)
    const srcCanvas = drawSignatureFit(sourceImage, targetWidth, targetHeight);

    // 2. Process at source resolution (flatten, threshold)
    processSignatureOnSource(srcCanvas);

    // 3. Resize processed signature to FIT within target (contain mode)
    const srcW = srcCanvas.width;
    const srcH = srcCanvas.height;
    const scale = Math.min(targetWidth / srcW, targetHeight / srcH);
    isUpscaled = scale > 1;
    const fitW = Math.round(srcW * scale);
    const fitH = Math.round(srcH * scale);

    // Resize to fitted dimensions
    const fitCanvas = makeCanvas(fitW, fitH);
    try {
      await getPica().resize(srcCanvas, fitCanvas, {
        unsharpAmount: SIGNATURE_UNSHARP.amount,
        unsharpRadius: SIGNATURE_UNSHARP.radius,
        unsharpThreshold: SIGNATURE_UNSHARP.threshold,
        alpha: false,
      });
    } catch {
      throw new ProcessingError("Failed to resize image. The file may be corrupted.");
    }

    // 4. Center on white target canvas (pad)
    destCanvas = makeCanvas(targetWidth, targetHeight);
    const ctx = destCanvas.getContext("2d")!;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    const offsetX = Math.round((targetWidth - fitW) / 2);
    const offsetY = Math.round((targetHeight - fitH) / 2);
    ctx.drawImage(fitCanvas, offsetX, offsetY);

  } else {
    // === PHOTO PIPELINE ===
    // 1. Top-biased crop at source resolution
    const targetAspect = targetWidth / targetHeight;
    const srcCanvas = drawPhotoCropped(sourceImage, targetAspect, cropBiasY);
    flattenToWhite(srcCanvas);

    // 2. Multi-pass resize with adaptive unsharp based on downscale ratio
    const srcW = srcCanvas.width;
    const srcH = srcCanvas.height;
    const downscaleRatio = Math.max(srcW / targetWidth, srcH / targetHeight);
    isUpscaled = downscaleRatio < 1;

    // Heavier downscale = more aggressive sharpening.
    // Tuned for tiny exam targets (e.g. 100x120) to preserve edge clarity.
    const config = UNSHARP_CONFIGS.find((c) => downscaleRatio <= c.maxRatio)!;
    let unsharpAmount = config.amount;
    let unsharpRadius = config.radius;
    const unsharpThreshold = Math.max(1, Math.min(3, Math.round(downscaleRatio / 3)));

    destCanvas = await picaResizeMultiPass(
      srcCanvas, targetWidth, targetHeight,
      unsharpAmount, unsharpRadius, unsharpThreshold
    );
  }

  // Date stamp
  let finalCanvas: HTMLCanvasElement;
  if (dateStamp) {
    finalCanvas = makeCanvas(targetWidth, totalHeight);
    const ctx = finalCanvas.getContext("2d")!;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, targetWidth, totalHeight);
    ctx.drawImage(destCanvas, 0, 0);
    drawDateStamp(ctx, targetWidth, targetHeight, stampHeight, dateStamp.name, dateStamp.date);
  } else {
    finalCanvas = destCanvas;
  }

  // Binary search for HIGHEST quality ≤ maxKB
  let bestBlob: Blob | null = null;
  let bestDataUrl = "";
  let bestSizeKB = 0;
  let bestQuality = 0.95;

  let formatChanged = false;

  if (format === "png") {
    try {
      bestBlob = await getPica().toBlob(finalCanvas, "image/png", 0);
    } catch {
      throw new ProcessingError("Failed to compress image. Try a smaller source file.");
    }
    bestSizeKB = Math.round(bestBlob.size / 1024);
    bestQuality = 1.0;
    bestDataUrl = await blobToDataUrl(bestBlob);

    // If PNG exceeds maxKB, fall back to JPEG
    if (bestSizeKB > maxKB) {
      formatChanged = true;
    }
  }

  if (format === "jpeg" || formatChanged) {
    let lo = JPEG_MIN_QUALITY;
    let hi = JPEG_MAX_QUALITY;

    for (let i = 0; i < JPEG_SEARCH_ITERATIONS; i++) {
      const mid = (lo + hi) / 2;
      let blob: Blob;
      try {
        blob = await getPica().toBlob(finalCanvas, "image/jpeg", mid);
      } catch {
        throw new ProcessingError("Failed to compress image. Try a smaller source file.");
      }
      const sizeKB = Math.round(blob.size / 1024);

      if (sizeKB <= maxKB) {
        bestBlob = blob;
        bestSizeKB = sizeKB;
        bestQuality = mid;
        lo = mid;
      } else {
        hi = mid;
      }

      if (hi - lo < JPEG_CONVERGENCE_DELTA) break;
    }

    if (!bestBlob || formatChanged) {
      try {
        bestBlob = await getPica().toBlob(finalCanvas, "image/jpeg", JPEG_MIN_QUALITY);
      } catch {
        throw new ProcessingError("Failed to compress image. Try a smaller source file.");
      }
      bestSizeKB = Math.round(bestBlob.size / 1024);
      bestQuality = JPEG_MIN_QUALITY;
    }

    bestDataUrl = await blobToDataUrl(bestBlob);
  }

  return {
    dataUrl: bestDataUrl,
    blob: bestBlob!,
    sizeKB: bestSizeKB,
    width: targetWidth,
    height: totalHeight,
    quality: Math.round(bestQuality * 100),
    withinRange: bestSizeKB >= minKB && bestSizeKB <= maxKB,
    format: formatChanged ? "image/jpeg" : (format === "png" ? "image/png" : "image/jpeg"),
    upscaled: isUpscaled,
    formatChanged,
  };
}
