"use client";

import { useState, useCallback } from "react";
import { getPresetById, type ExamPreset } from "@/lib/presets";
import ImageUploader from "@/components/ImageUploader";
import ResultPreview from "@/components/ResultPreview";
import DateStamper from "@/components/DateStamper";
import AdSlot from "@/components/AdSlot";
import PhotoFramingControls from "@/components/PhotoFramingControls";
import CropPreview from "@/components/CropPreview";
import { processImage, type ProcessResult } from "@/lib/imageEngine";
import { preparePhotoSourceImage } from "@/lib/photoSource";
import {
  DEFAULT_CROP_BIAS_Y,
  getPhotoToolPresetState,
} from "@/lib/photoToolState";
import { trackUpload, trackProcessComplete, trackProcessError } from "@/lib/analytics";

interface Props {
  presetId: string;
}

export default function ExamToolClient({ presetId }: Props) {
  const preset = getPresetById(presetId)!;
  const isSignature = preset.type === "signature";

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dateStampEnabled, setDateStampEnabled] = useState(preset.requiresDateStamp);
  const [dateStamp, setDateStamp] = useState<{ name: string; date: string } | undefined>();
  const [cropBiasY, setCropBiasY] = useState(DEFAULT_CROP_BIAS_Y);
  const [whiteBackgroundMode, setWhiteBackgroundMode] = useState(false);
  const [whiteBgError, setWhiteBgError] = useState<string | null>(null);
  const [whiteBgDurationMs, setWhiteBgDurationMs] = useState<number | null>(null);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleImageLoad = useCallback((img: HTMLImageElement, f: File) => {
    setImage(img);
    setFile(f);
    setResult(null);
    setWhiteBgError(null);
    setWhiteBgDurationMs(null);
    trackUpload({
      tool: isSignature ? "signature_resizer" : "photo_resizer",
      file_type: f.type,
      file_size_kb: Math.round(f.size / 1024),
      preset_id: preset.id,
      exam_name: preset.exam,
    });
  }, [preset, isSignature]);

  const handleResize = async () => {
    if (!image) return;
    setProcessing(true);
    setWhiteBgError(null);
    setWhiteBgDurationMs(null);
    try {
      const prepared = isSignature
        ? {
            sourceImage: image,
            whiteBgError: null,
            whiteBgDurationMs: null,
          }
        : await (async () => {
            let fn: ((img: HTMLImageElement) => Promise<{ image: HTMLImageElement; durationMs: number }>) | undefined;
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

      if (prepared.whiteBgError) {
        setWhiteBgError(prepared.whiteBgError);
        return;
      }
      setWhiteBgDurationMs(prepared.whiteBgDurationMs);

      const res = await processImage(prepared.sourceImage, {
        targetWidth: preset.width,
        targetHeight: preset.height,
        minKB: preset.minKB,
        maxKB: preset.maxKB,
        bgColor: preset.bgColor,
        format: preset.format,
        dateStamp: dateStampEnabled ? dateStamp : undefined,
        signatureMode: isSignature,
        cropBiasY,
      });
      setResult(res);
      trackProcessComplete({
        tool: isSignature ? "signature_resizer" : "photo_resizer",
        preset_id: preset.id,
        exam_name: preset.exam,
        result_size_kb: res.sizeKB,
        result_width: res.width,
        result_height: res.height,
        quality: res.quality,
        validation_passed: res.sizeKB >= preset.minKB && res.sizeKB <= preset.maxKB,
      });
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setImage(null);
    setFile(null);
    const next = getPhotoToolPresetState(preset.requiresDateStamp);
    setCropBiasY(next.cropBiasY);
    setWhiteBackgroundMode(next.whiteBackgroundMode);
    setWhiteBgError(next.whiteBgError);
    setWhiteBgDurationMs(next.whiteBgDurationMs);
  };

  return (
    <div className="space-y-6">
      <ImageUploader
        onImageLoad={handleImageLoad}
        label={isSignature ? "Upload Signature" : "Upload Photo"}
      />

      {preset.requiresDateStamp && (
        <DateStamper
          enabled={dateStampEnabled}
          onToggle={setDateStampEnabled}
          onStampChange={setDateStamp}
        />
      )}

      <AdSlot slot={`exam-${presetId}-mid`} format="rectangle" className="my-4" />

      {image && !result && (
        <div className="space-y-3">
          {!isSignature && (
            <>
              <CropPreview
                image={image}
                targetWidth={preset.width}
                targetHeight={preset.height}
                cropBiasY={cropBiasY}
              />
              <PhotoFramingControls
                cropBiasY={cropBiasY}
                onCropBiasYChange={setCropBiasY}
                whiteBackgroundMode={whiteBackgroundMode}
                onWhiteBackgroundModeChange={setWhiteBackgroundMode}
              />
              {whiteBgError && (
                <div className="bg-rose-400/10 border border-rose-400/30 text-rose-300 text-xs rounded-xl p-3">
                  {whiteBgError}
                </div>
              )}
              {!whiteBgError && whiteBackgroundMode && whiteBgDurationMs !== null && (
                <div className="bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-xs rounded-xl p-3">
                  White background applied in {(whiteBgDurationMs / 1000).toFixed(2)}s.
                </div>
              )}
            </>
          )}
          <div className="bg-neutral-900 rounded-xl p-4 text-sm text-neutral-400">
            Target: <span className="text-neutral-200">{preset.width}x{preset.height}px</span> |{" "}
            <span className="text-neutral-200">{preset.minKB}-{preset.maxKB}KB</span> |{" "}
            <span className="text-neutral-200">{preset.format.toUpperCase()}</span>
          </div>
          <button
            onClick={handleResize}
            disabled={processing}
            className="w-full py-3 rounded-xl bg-yellow-400 text-neutral-900 font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50"
          >
            {processing ? "Processing..." : "Resize & Compress Now"}
          </button>
        </div>
      )}

      {result && file && (
        <>
          <ResultPreview result={result} preset={preset} originalSize={file.size} />
          <button
            onClick={reset}
            className="w-full py-2 rounded-xl border border-neutral-700 text-neutral-400 text-sm hover:border-neutral-500"
          >
            Try Another
          </button>
        </>
      )}
    </div>
  );
}
