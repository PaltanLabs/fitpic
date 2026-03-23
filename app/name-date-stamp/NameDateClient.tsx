"use client";

import { useState, useCallback } from "react";
import { PRESETS, getPresetSlug, type ExamPreset } from "@/lib/presets";
import ImageUploader from "@/components/ImageUploader";
import ResultPreview from "@/components/ResultPreview";
import DateStamper from "@/components/DateStamper";
import { processImage, type ProcessResult } from "@/lib/imageEngine";

const dateStampPresets = PRESETS.filter(
  (p) => p.type === "photo" && p.id !== "custom"
);

export default function NameDateClient() {
  const [selectedPresetId, setSelectedPresetId] = useState(
    dateStampPresets.find((p) => p.requiresDateStamp)?.id ?? dateStampPresets[0]?.id ?? ""
  );
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dateStampEnabled, setDateStampEnabled] = useState(true);
  const [dateStamp, setDateStamp] = useState<{ name: string; date: string } | undefined>();
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [processing, setProcessing] = useState(false);

  const preset = PRESETS.find((p) => p.id === selectedPresetId)!;

  const handleImageLoad = useCallback((img: HTMLImageElement, f: File) => {
    setImage(img);
    setFile(f);
    setResult(null);
  }, []);

  const handleResize = async () => {
    if (!image || !preset) return;
    setProcessing(true);
    try {
      const res = await processImage(image, {
        targetWidth: preset.width,
        targetHeight: preset.height,
        minKB: preset.minKB,
        maxKB: preset.maxKB,
        bgColor: preset.bgColor,
        format: preset.format,
        dateStamp: dateStampEnabled ? dateStamp : undefined,
      });
      setResult(res);
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setImage(null);
    setFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Preset selector */}
      <div className="space-y-2">
        <label className="text-neutral-400 text-sm font-medium">
          Select Exam Preset
        </label>
        <select
          value={selectedPresetId}
          onChange={(e) => {
            setSelectedPresetId(e.target.value);
            setResult(null);
          }}
          className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm focus:border-yellow-400 focus:outline-none"
        >
          <optgroup label="Exams with Name+Date Stamp">
            {dateStampPresets
              .filter((p) => p.requiresDateStamp)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.width}x{p.height}px, {p.minKB}-{p.maxKB}KB)
                </option>
              ))}
          </optgroup>
          <optgroup label="All Photo Presets">
            {dateStampPresets
              .filter((p) => !p.requiresDateStamp)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.width}x{p.height}px, {p.minKB}-{p.maxKB}KB)
                </option>
              ))}
          </optgroup>
        </select>
      </div>

      <ImageUploader onImageLoad={handleImageLoad} label="Upload Photo" />

      <DateStamper
        enabled={dateStampEnabled}
        onToggle={setDateStampEnabled}
        onStampChange={setDateStamp}
      />

      {image && !result && (
        <div className="space-y-3">
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
            {processing ? "Processing..." : "Resize & Add Stamp"}
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
