"use client";

import * as bodySegmentation from "@tensorflow-models/body-segmentation";
import "@mediapipe/selfie_segmentation";

function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function canvasToDataUrl(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not convert canvas to blob"));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      },
      "image/png"
    );
  });
}

async function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Could not load processed image"));
    img.src = dataUrl;
  });
  return img;
}

let segmenterPromise: Promise<bodySegmentation.BodySegmenter> | null = null;

async function getSegmenter(): Promise<bodySegmentation.BodySegmenter> {
  if (!segmenterPromise) {
    segmenterPromise = bodySegmentation.createSegmenter(
      bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation,
      {
        runtime: "mediapipe",
        modelType: "general",
        solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation",
      }
    );
  }

  return segmenterPromise;
}

interface WhiteBackgroundResult {
  image: HTMLImageElement;
  confidence: number;
  durationMs: number;
}

function blurMask(mask: Float32Array, width: number, height: number, radius: number): Float32Array {
  if (radius <= 0) return mask;
  const temp = new Float32Array(mask.length);
  const out = new Float32Array(mask.length);

  // Horizontal pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;
      for (let dx = -radius; dx <= radius; dx++) {
        const xx = x + dx;
        if (xx < 0 || xx >= width) continue;
        sum += mask[y * width + xx];
        count++;
      }
      temp[y * width + x] = count ? sum / count : 0;
    }
  }

  // Vertical pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= height) continue;
        sum += temp[yy * width + x];
        count++;
      }
      out[y * width + x] = count ? sum / count : 0;
    }
  }

  return out;
}

function dilateMask(mask: Uint8Array, width: number, height: number, radius: number): Uint8Array {
  if (radius <= 0) return mask;
  const out = new Uint8Array(mask.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      let on = 0;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const yy = y + dy;
          const xx = x + dx;
          if (yy < 0 || yy >= height || xx < 0 || xx >= width) continue;
          if (mask[yy * width + xx]) {
            on = 1;
            break;
          }
        }
        if (on) break;
      }

      out[idx] = on;
    }
  }

  return out;
}

function erodeMask(mask: Uint8Array, width: number, height: number, radius: number): Uint8Array {
  if (radius <= 0) return mask;
  const out = new Uint8Array(mask.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      let on = 1;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const yy = y + dy;
          const xx = x + dx;
          if (yy < 0 || yy >= height || xx < 0 || xx >= width) {
            on = 0;
            break;
          }
          if (!mask[yy * width + xx]) {
            on = 0;
            break;
          }
        }
        if (!on) break;
      }

      out[idx] = on;
    }
  }

  return out;
}

function keepLargestConnectedComponent(mask: Uint8Array, width: number, height: number): Uint8Array {
  const visited = new Uint8Array(mask.length);
  const labels = new Int32Array(mask.length);
  let currentLabel = 1;
  let bestLabel = 0;
  let bestSize = 0;

  const queueX = new Int32Array(mask.length);
  const queueY = new Int32Array(mask.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (!mask[idx] || visited[idx]) continue;

      let head = 0;
      let tail = 0;
      queueX[tail] = x;
      queueY[tail] = y;
      tail++;
      visited[idx] = 1;
      labels[idx] = currentLabel;
      let size = 0;

      while (head < tail) {
        const cx = queueX[head];
        const cy = queueY[head];
        head++;
        size++;

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
            const nIdx = ny * width + nx;
            if (!mask[nIdx] || visited[nIdx]) continue;
            visited[nIdx] = 1;
            labels[nIdx] = currentLabel;
            queueX[tail] = nx;
            queueY[tail] = ny;
            tail++;
          }
        }
      }

      if (size > bestSize) {
        bestSize = size;
        bestLabel = currentLabel;
      }
      currentLabel++;
    }
  }

  const out = new Uint8Array(mask.length);
  if (!bestLabel) return out;
  for (let i = 0; i < labels.length; i++) {
    out[i] = labels[i] === bestLabel ? 1 : 0;
  }
  return out;
}

function cleanupMask(mask: Uint8Array, width: number, height: number): Uint8Array {
  // Keep only the largest subject region, then close small gaps.
  const largest = keepLargestConnectedComponent(mask, width, height);
  const dilated = dilateMask(largest, width, height, 2);
  const closed = erodeMask(dilated, width, height, 2);
  return closed;
}

function despillEdges(
  pixels: Uint8ClampedArray,
  mask: Float32Array,
  width: number,
  height: number
) {
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const alpha = mask[idx];
      if (alpha <= 0.35 || alpha >= 0.95) continue;
      const p = idx * 4;
      // Pull edge colors slightly toward neutral to reduce blue/green spill.
      const avg = (pixels[p] + pixels[p + 1] + pixels[p + 2]) / 3;
      pixels[p] = Math.round(pixels[p] * 0.8 + avg * 0.2);
      pixels[p + 1] = Math.round(pixels[p + 1] * 0.8 + avg * 0.2);
      pixels[p + 2] = Math.round(pixels[p + 2] * 0.8 + avg * 0.2);
    }
  }
}

function getMaskCoverage(mask: Uint8Array): number {
  let count = 0;
  for (let i = 0; i < mask.length; i++) count += mask[i] ? 1 : 0;
  return count / mask.length;
}

function getMaskHeightCoverage(mask: Uint8Array, width: number, height: number): number {
  const bbox = getMaskBoundingBox(mask, width, height);
  if (!bbox) return 0;
  return (bbox.maxY - bbox.minY + 1) / height;
}

function getMaskBoundingBox(mask: Uint8Array, width: number, height: number) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (!mask[idx]) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < 0 || maxY < 0) return null;
  return { minX, minY, maxX, maxY };
}

export async function makeWhiteBackground(
  sourceImage: HTMLImageElement
): Promise<WhiteBackgroundResult> {
  const startedAt = performance.now();
  const srcW = sourceImage.naturalWidth || sourceImage.width;
  const srcH = sourceImage.naturalHeight || sourceImage.height;
  const segmenter = await getSegmenter();
  const segmentation = await segmenter.segmentPeople(sourceImage, {
    flipHorizontal: false,
  });
  if (!segmentation.length) {
    throw new Error("Could not detect subject clearly. Use a closer portrait photo.");
  }

  const binary = await bodySegmentation.toBinaryMask(
    segmentation,
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 0, g: 0, b: 0, a: 0 },
    false,
    0.65
  );

  const rawMask = new Uint8Array(srcW * srcH);
  for (let i = 0; i < rawMask.length; i++) {
    rawMask[i] = binary.data[i * 4 + 3] > 127 ? 1 : 0;
  }

  const cleanedMask = cleanupMask(rawMask, srcW, srcH);
  const bbox = getMaskBoundingBox(cleanedMask, srcW, srcH);
  if (!bbox) {
    throw new Error("Could not detect subject clearly. Use a closer portrait photo.");
  }

  const foregroundRatio = getMaskCoverage(cleanedMask);
  const personHeightRatio = getMaskHeightCoverage(cleanedMask, srcW, srcH);
  // Confidence heuristic: reject weak/degenerate masks before exporting.
  if (foregroundRatio < 0.1 || foregroundRatio > 0.9 || personHeightRatio < 0.35) {
    throw new Error("Background detection confidence is low. Try a clearer, front-facing photo.");
  }

  const softMaskInput = new Float32Array(cleanedMask.length);
  for (let i = 0; i < cleanedMask.length; i++) {
    softMaskInput[i] = cleanedMask[i] ? 1 : 0;
  }
  const blurred = blurMask(softMaskInput, srcW, srcH, 3);

  const outputCanvas = makeCanvas(srcW, srcH);
  const outputCtx = outputCanvas.getContext("2d")!;
  outputCtx.fillStyle = "#FFFFFF";
  outputCtx.fillRect(0, 0, srcW, srcH);
  outputCtx.drawImage(sourceImage, 0, 0, srcW, srcH);

  const imageData = outputCtx.getImageData(0, 0, srcW, srcH);
  const pixels = imageData.data;
  const mask = blurred;

  despillEdges(pixels, mask, srcW, srcH);

  for (let i = 0; i < mask.length; i++) {
    const p = i * 4;
    // Soft edge alpha for less jagged cutouts.
    const alpha = Math.max(0, Math.min(1, (mask[i] - 0.2) / 0.6));
    pixels[p] = Math.round(pixels[p] * alpha + 255 * (1 - alpha));
    pixels[p + 1] = Math.round(pixels[p + 1] * alpha + 255 * (1 - alpha));
    pixels[p + 2] = Math.round(pixels[p + 2] * alpha + 255 * (1 - alpha));
    pixels[p + 3] = 255;
  }

  outputCtx.putImageData(imageData, 0, 0);

  // Recenter subject for more passport-like composition.
  const recenteredCanvas = makeCanvas(srcW, srcH);
  const recenteredCtx = recenteredCanvas.getContext("2d")!;
  recenteredCtx.fillStyle = "#FFFFFF";
  recenteredCtx.fillRect(0, 0, srcW, srcH);

  const centerX = (bbox.minX + bbox.maxX) / 2;
  const centerY = (bbox.minY + bbox.maxY) / 2;
  const targetCenterX = srcW * 0.5;
  const targetCenterY = srcH * 0.42; // slight top bias for ID-style framing
  const shiftX = Math.round(targetCenterX - centerX);
  const shiftY = Math.round(targetCenterY - centerY);
  recenteredCtx.drawImage(outputCanvas, shiftX, shiftY);

  const dataUrl = await canvasToDataUrl(recenteredCanvas);
  return {
    image: await loadImageFromDataUrl(dataUrl),
    confidence: Math.round(foregroundRatio * 100) / 100,
    durationMs: Math.round(performance.now() - startedAt),
  };
}
