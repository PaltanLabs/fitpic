"use client";

import { useState, useCallback, useRef } from "react";
import ImageUploader from "@/components/ImageUploader";
import { makeWhiteBackground } from "@/lib/whiteBackground";
import { PRESETS } from "@/lib/presets";
import { processImage } from "@/lib/imageEngine";
import { trackUpload, trackProcessComplete, trackDownload, trackProcessError } from "@/lib/analytics";

type Stage = "idle" | "processing" | "done" | "error";

const photoPresets = PRESETS.filter(
  (p) => (p.type === "photo" || p.type === "thumb") && p.id !== "custom"
);

export default function BgRemoverClient() {
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [resultSrc, setResultSrc] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [durationMs, setDurationMs] = useState<number>(0);
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const sourceImageRef = useRef<HTMLImageElement | null>(null);

  const handleImageLoad = useCallback(
    async (img: HTMLImageElement) => {
      setError(null);
      setStage("processing");
      setOriginalSrc(img.src);
      sourceImageRef.current = img;
      setResultSrc(null);
      trackUpload({ tool: "background_remover", file_type: "image", file_size_kb: 0, preset_id: selectedPreset || undefined });

      try {
        const result = await makeWhiteBackground(img);
        let finalSrc = result.image.src;

        // If a preset is selected, also resize
        if (selectedPreset) {
          const preset = PRESETS.find((p) => p.id === selectedPreset);
          if (preset) {
            const processed = await processImage(result.image, {
              targetWidth: preset.width,
              targetHeight: preset.height,
              minKB: preset.minKB,
              maxKB: preset.maxKB,
              bgColor: preset.bgColor,
              format: preset.format,
            });
            finalSrc = processed.dataUrl;
          }
        }

        setResultSrc(finalSrc);
        setConfidence(result.confidence);
        setDurationMs(result.durationMs);
        setStage("done");
        trackProcessComplete({ tool: "background_remover", duration_ms: result.durationMs, preset_id: selectedPreset || undefined });
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Failed to remove background. Please try a different photo.";
        setError(errMsg);
        setStage("error");
        trackProcessError({ tool: "background_remover", error_message: errMsg });
      }
    },
    [selectedPreset]
  );

  const handleDownload = () => {
    if (!resultSrc) return;
    trackDownload({ tool: "background_remover", preset_id: selectedPreset || undefined });
    const a = document.createElement("a");
    a.href = resultSrc;
    a.download = "white-background.png";
    a.click();
  };

  const handleReset = () => {
    setStage("idle");
    setOriginalSrc(null);
    setResultSrc(null);
    setError(null);
    setConfidence(0);
    setDurationMs(0);
    sourceImageRef.current = null;
  };

  return (
    <div className="space-y-6">
      {/* Optional exam preset selector */}
      <div className="space-y-2">
        <label className="text-sm text-neutral-400">
          Optional: Also resize for an exam after removing background
        </label>
        <select
          value={selectedPreset}
          onChange={(e) => setSelectedPreset(e.target.value)}
          className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-200"
          disabled={stage === "processing"}
        >
          <option value="">No resizing (keep original dimensions)</option>
          {photoPresets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.width}x{p.height}px, {p.minKB}-{p.maxKB}KB)
            </option>
          ))}
        </select>
      </div>

      {/* Upload area */}
      {stage === "idle" || stage === "error" ? (
        <ImageUploader
          onImageLoad={handleImageLoad}
          label="Upload Photo to Remove Background"
        />
      ) : null}

      {/* Error message */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
          <p className="text-rose-400 text-sm">{error}</p>
          <button
            onClick={handleReset}
            className="mt-2 text-sm text-rose-300 underline"
          >
            Try another photo
          </button>
        </div>
      )}

      {/* Processing state */}
      {stage === "processing" && (
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-neutral-300 text-sm">
            Removing background... This may take 3-5 seconds on first use.
          </p>
          <p className="text-neutral-500 text-xs">
            AI model is running entirely in your browser
          </p>
        </div>
      )}

      {/* Before / After comparison */}
      {stage === "done" && originalSrc && resultSrc && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs text-neutral-500 text-center uppercase tracking-wider">
                Original
              </p>
              <div className="bg-neutral-900 rounded-xl p-2 flex items-center justify-center min-h-[200px]">
                <img
                  src={originalSrc}
                  alt="Original photo"
                  className="max-w-full max-h-[300px] rounded-lg object-contain"
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-neutral-500 text-center uppercase tracking-wider">
                White Background
              </p>
              <div className="bg-neutral-900 rounded-xl p-2 flex items-center justify-center min-h-[200px]">
                <img
                  src={resultSrc}
                  alt="Photo with white background"
                  className="max-w-full max-h-[300px] rounded-lg object-contain"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 text-sm text-neutral-400">
            <span>
              Confidence:{" "}
              <span className="text-neutral-200 font-medium">
                {Math.round(confidence * 100)}%
              </span>
            </span>
            <span>
              Time:{" "}
              <span className="text-neutral-200 font-medium">
                {(durationMs / 1000).toFixed(1)}s
              </span>
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="bg-yellow-400 text-neutral-900 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-yellow-300 transition-colors"
            >
              Download Result
            </button>
            <button
              onClick={handleReset}
              className="bg-neutral-800 text-neutral-200 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-neutral-700 transition-colors"
            >
              Try Another Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
