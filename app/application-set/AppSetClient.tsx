"use client";

import { useState, useCallback } from "react";
import { PRESETS, type ExamPreset } from "@/lib/presets";
import ImageUploader from "@/components/ImageUploader";
import { processImage, type ProcessResult } from "@/lib/imageEngine";
import JSZip from "jszip";

// Group presets that share the same exam field
const examGroups = PRESETS.filter((p) => p.id !== "custom").reduce(
  (acc, p) => {
    if (!acc[p.exam]) acc[p.exam] = [];
    acc[p.exam].push(p);
    return acc;
  },
  {} as Record<string, ExamPreset[]>
);

const examNames = Object.keys(examGroups).sort();

interface SlotState {
  preset: ExamPreset;
  image: HTMLImageElement | null;
  file: File | null;
  result: ProcessResult | null;
  processing: boolean;
  error: string | null;
}

function typeLabel(type: ExamPreset["type"]): string {
  return type === "photo" ? "Photo" : type === "signature" ? "Signature" : "Thumb Impression";
}

export default function AppSetClient() {
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [slots, setSlots] = useState<SlotState[]>([]);
  const [processingAll, setProcessingAll] = useState(false);
  const [zipping, setZipping] = useState(false);

  const handleExamChange = useCallback((exam: string) => {
    setSelectedExam(exam);
    if (!exam) {
      setSlots([]);
      return;
    }
    const presets = examGroups[exam] || [];
    setSlots(
      presets.map((preset) => ({
        preset,
        image: null,
        file: null,
        result: null,
        processing: false,
        error: null,
      }))
    );
  }, []);

  const handleImageLoad = useCallback(
    (index: number) => (img: HTMLImageElement, file: File) => {
      setSlots((prev) =>
        prev.map((s, i) =>
          i === index ? { ...s, image: img, file, result: null, error: null } : s
        )
      );
    },
    []
  );

  const allUploaded = slots.length > 0 && slots.every((s) => s.image !== null);
  const allProcessed = slots.length > 0 && slots.every((s) => s.result !== null);

  const handleProcessAll = async () => {
    if (!allUploaded) return;
    setProcessingAll(true);

    const updated = [...slots];
    for (let i = 0; i < updated.length; i++) {
      const slot = updated[i];
      if (!slot.image) continue;
      updated[i] = { ...slot, processing: true, error: null, result: null };
      setSlots([...updated]);

      try {
        const res = await processImage(slot.image, {
          targetWidth: slot.preset.width,
          targetHeight: slot.preset.height,
          minKB: slot.preset.minKB,
          maxKB: slot.preset.maxKB,
          bgColor: slot.preset.bgColor,
          format: slot.preset.format,
          signatureMode: slot.preset.type === "signature",
        });
        updated[i] = { ...updated[i], result: res, processing: false };
      } catch (err) {
        updated[i] = {
          ...updated[i],
          error: err instanceof Error ? err.message : "Processing failed",
          processing: false,
        };
      }
      setSlots([...updated]);
    }

    setProcessingAll(false);
  };

  const handleDownloadZip = async () => {
    if (!allProcessed) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      slots.forEach(({ preset, result }) => {
        if (!result) return;
        const filename = `${preset.exam}-${preset.type === "photo" ? "Photo" : preset.type === "signature" ? "Signature" : "Thumb"}.${preset.format === "jpeg" ? "jpg" : "png"}`;
        zip.file(filename, result.blob);
      });
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedExam}-Documents.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Exam selector */}
      <div className="space-y-2">
        <label htmlFor="exam-select" className="block text-sm font-medium text-neutral-300">
          Select Exam
        </label>
        <select
          id="exam-select"
          value={selectedExam}
          onChange={(e) => handleExamChange(e.target.value)}
          className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-500"
        >
          <option value="">— Choose an exam —</option>
          {examNames.map((name) => (
            <option key={name} value={name}>
              {name} ({examGroups[name].length} document{examGroups[name].length > 1 ? "s" : ""})
            </option>
          ))}
        </select>
      </div>

      {/* Upload slots */}
      {slots.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-200">
            Upload Documents for {selectedExam}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map((slot, i) => (
              <div
                key={slot.preset.id}
                className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-3"
              >
                <div>
                  <h3 className="font-medium text-neutral-200">{typeLabel(slot.preset.type)}</h3>
                  <p className="text-xs text-neutral-500">
                    {slot.preset.width}x{slot.preset.height}px &middot;{" "}
                    {slot.preset.minKB}-{slot.preset.maxKB}KB &middot;{" "}
                    {slot.preset.format.toUpperCase()}
                  </p>
                </div>

                <ImageUploader
                  onImageLoad={handleImageLoad(i)}
                  label={`Upload ${typeLabel(slot.preset.type)}`}
                />

                {slot.image && !slot.result && !slot.processing && (
                  <p className="text-xs text-green-400">Ready</p>
                )}

                {slot.processing && (
                  <p className="text-xs text-yellow-400 animate-pulse">Processing...</p>
                )}

                {slot.error && <p className="text-xs text-red-400">{slot.error}</p>}

                {slot.result && (
                  <div className="space-y-2">
                    <img
                      src={slot.result.dataUrl}
                      alt={`${slot.preset.type} result`}
                      className="mx-auto max-h-32 rounded border border-neutral-800"
                    />
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={
                          slot.result.withinRange ? "text-green-400" : "text-red-400"
                        }
                      >
                        {slot.result.sizeKB.toFixed(1)} KB
                      </span>
                      <span className="text-neutral-500">
                        {slot.result.width}x{slot.result.height}px
                      </span>
                      {slot.result.withinRange ? (
                        <span className="text-green-400">Pass</span>
                      ) : (
                        <span className="text-red-400">Fail — outside KB range</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleProcessAll}
              disabled={!allUploaded || processingAll}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 disabled:text-neutral-500 text-white text-sm font-medium transition-colors"
            >
              {processingAll ? "Processing..." : "Process All"}
            </button>

            {allProcessed && (
              <button
                onClick={handleDownloadZip}
                disabled={zipping}
                className="px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-neutral-700 disabled:text-neutral-500 text-white text-sm font-medium transition-colors"
              >
                {zipping ? "Creating ZIP..." : "Download All as ZIP"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
