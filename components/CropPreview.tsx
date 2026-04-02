"use client";

import { useRef, useEffect } from "react";

interface Props {
  image: HTMLImageElement;
  targetWidth: number;
  targetHeight: number;
  cropBiasY: number;
}

/**
 * Live preview of the crop region. Mirrors the drawPhotoCropped logic
 * from imageEngine.ts — shows the kept region bright, discarded area dimmed.
 */
export default function CropPreview({ image, targetWidth, targetHeight, cropBiasY }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const srcW = image.naturalWidth || image.width;
    const srcH = image.naturalHeight || image.height;
    const targetAspect = targetWidth / targetHeight;
    const srcAspect = srcW / srcH;

    let cropX = 0, cropY = 0, cropW = srcW, cropH = srcH;

    if (srcAspect > targetAspect) {
      cropW = Math.round(srcH * targetAspect);
      cropX = Math.round((srcW - cropW) / 2);
    } else {
      cropH = Math.round(srcW / targetAspect);
      const bias = Math.max(0, Math.min(0.5, cropBiasY));
      cropY = Math.round((srcH - cropH) * bias);
    }

    // Scale to fit within 280px wide, max 320px tall
    const maxW = 280;
    const maxH = 320;
    const scale = Math.min(maxW / srcW, maxH / srcH, 1);
    const drawW = Math.round(srcW * scale);
    const drawH = Math.round(srcH * scale);

    canvas.width = drawW;
    canvas.height = drawH;
    const ctx = canvas.getContext("2d")!;

    // Draw full image dimmed
    ctx.globalAlpha = 0.3;
    ctx.drawImage(image, 0, 0, drawW, drawH);

    // Draw crop region at full brightness
    ctx.globalAlpha = 1.0;
    const sx = Math.round(cropX * scale);
    const sy = Math.round(cropY * scale);
    const sw = Math.round(cropW * scale);
    const sh = Math.round(cropH * scale);
    ctx.drawImage(
      image,
      cropX, cropY, cropW, cropH,
      sx, sy, sw, sh
    );

    // Border around crop region
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 2;
    ctx.strokeRect(sx, sy, sw, sh);
  }, [image, targetWidth, targetHeight, cropBiasY]);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <p className="text-neutral-400 text-xs">Crop preview</p>
      <canvas
        ref={canvasRef}
        className="rounded-lg border border-neutral-800"
      />
    </div>
  );
}
