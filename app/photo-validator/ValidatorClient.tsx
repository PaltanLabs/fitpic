"use client";

import { useState } from "react";
import { PRESETS, getPresetSlug, type ExamPreset } from "@/lib/presets";

interface Check {
  label: string;
  passed: boolean;
  expected: string;
  actual: string;
}

const validatablePresets = PRESETS.filter(
  (p) => p.id !== "custom"
);

export default function ValidatorClient() {
  const [selectedPresetId, setSelectedPresetId] = useState(validatablePresets[0]?.id ?? "");
  const [checks, setChecks] = useState<Check[] | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const preset = PRESETS.find((p) => p.id === selectedPresetId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !preset) return;

    setChecks(null);
    setPreview(null);
    setFileName(null);

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setPreview(url);
      setFileName(file.name);

      const fileSizeKB = file.size / 1024;
      const expectedFormat = `image/${preset.format}`;

      const results: Check[] = [
        {
          label: `Width matches ${preset.width}px`,
          passed: img.naturalWidth === preset.width,
          expected: `${preset.width}px`,
          actual: `${img.naturalWidth}px`,
        },
        {
          label: `Height matches ${preset.height}px`,
          passed: img.naturalHeight >= preset.height,
          expected: `>=${preset.height}px`,
          actual: `${img.naturalHeight}px`,
        },
        {
          label: `File size above ${preset.minKB}KB`,
          passed: fileSizeKB >= preset.minKB,
          expected: `>=${preset.minKB}KB`,
          actual: `${Math.round(fileSizeKB)}KB`,
        },
        {
          label: `File size under ${preset.maxKB}KB`,
          passed: fileSizeKB <= preset.maxKB,
          expected: `<=${preset.maxKB}KB`,
          actual: `${Math.round(fileSizeKB)}KB`,
        },
        {
          label: `Format is ${preset.format.toUpperCase()}`,
          passed: file.type === expectedFormat,
          expected: expectedFormat,
          actual: file.type || "unknown",
        },
      ];

      setChecks(results);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const allPassed = checks?.every((c) => c.passed) ?? false;
  const anyFailed = checks ? !allPassed : false;

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
            setChecks(null);
            setPreview(null);
            setFileName(null);
          }}
          className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm focus:border-yellow-400 focus:outline-none"
        >
          {validatablePresets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.width}x{p.height}px, {p.minKB}-{p.maxKB}KB, {p.format.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* File input */}
      <div className="space-y-2">
        <label className="text-neutral-400 text-sm font-medium">
          Upload Photo to Validate
        </label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          className="w-full text-sm text-neutral-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-neutral-800 file:text-neutral-200 file:font-medium file:cursor-pointer hover:file:bg-neutral-700"
        />
      </div>

      {/* Preview */}
      {preview && fileName && (
        <div className="bg-neutral-900 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <img
              src={preview}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-neutral-200 text-sm truncate">{fileName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {checks && (
        <div className="space-y-4">
          {/* Status banner */}
          <div
            className={`p-3 rounded-xl text-center font-medium ${
              allPassed
                ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/30"
                : "bg-rose-400/10 text-rose-400 border border-rose-400/30"
            }`}
          >
            {allPassed
              ? "All checks passed! Your photo is ready to upload."
              : "Some checks failed. Your photo may be rejected."}
          </div>

          {/* Checklist */}
          <div className="bg-neutral-900 rounded-xl p-4 space-y-3">
            <p className="text-neutral-400 text-sm font-medium">Validation Results</p>
            {checks.map((check, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="flex-shrink-0 mt-0.5">
                  {check.passed ? (
                    <span className="text-emerald-400">&#10003;</span>
                  ) : (
                    <span className="text-rose-400">&#10007;</span>
                  )}
                </span>
                <div className="flex-1">
                  <span className={check.passed ? "text-neutral-300" : "text-rose-300"}>
                    {check.label}
                  </span>
                  <div className="text-neutral-500 text-xs mt-0.5">
                    Expected: {check.expected} | Actual: {check.actual}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fix link */}
          {anyFailed && preset && (
            <a
              href={`/${getPresetSlug(preset)}`}
              className="block w-full py-3 rounded-xl bg-yellow-400 text-neutral-900 font-bold text-center hover:bg-yellow-300 transition-colors"
            >
              Fix with FitPic &rarr;
            </a>
          )}
        </div>
      )}
    </div>
  );
}
