"use client";

import { useState, useCallback, useRef } from "react";
import { PDFDocument } from "pdf-lib";

const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20MB

const TARGET_OPTIONS = [
  { label: "100 KB", value: 100 },
  { label: "200 KB", value: 200 },
  { label: "500 KB", value: 500 },
  { label: "1 MB", value: 1024 },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function compressPdf(
  file: File
): Promise<{ blob: Blob; pages: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  // Copy to a new document (strips unused objects, metadata bloat)
  const newDoc = await PDFDocument.create();
  const pages = await newDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
  pages.forEach((page) => newDoc.addPage(page));

  // Strip metadata
  newDoc.setTitle("");
  newDoc.setAuthor("");
  newDoc.setSubject("");
  newDoc.setKeywords([]);
  newDoc.setProducer("");
  newDoc.setCreator("");

  const pdfBytes = await newDoc.save();
  return {
    blob: new Blob([pdfBytes as BlobPart], { type: "application/pdf" }),
    pages: pdfDoc.getPageCount(),
  };
}

export default function PdfCompressorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [targetKB, setTargetKB] = useState(200);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{
    blob: Blob;
    pages: number;
    originalSize: number;
    compressedSize: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setResult(null);
    setError(null);

    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    if (f.size > MAX_PDF_SIZE) {
      setError("File too large. Maximum size is 20 MB.");
      return;
    }
    setFile(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleCompress = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setResult(null);

    try {
      const { blob, pages } = await compressPdf(file);
      setResult({
        blob,
        pages,
        originalSize: file.size,
        compressedSize: blob.size,
      });
    } catch {
      setError(
        "Failed to compress this PDF. It may be corrupted or password-protected."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    const baseName = file?.name?.replace(/\.pdf$/i, "") ?? "document";
    a.download = `${baseName}-compressed.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const compressionRatio = result
    ? ((1 - result.compressedSize / result.originalSize) * 100).toFixed(1)
    : null;

  const aboveTarget =
    result && result.compressedSize > targetKB * 1024;

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-blue-500 bg-blue-500/10"
            : "border-neutral-700 hover:border-neutral-500 bg-neutral-900/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <div className="text-3xl mb-2">📄</div>
        <p className="text-neutral-300 text-sm font-medium">
          {file ? file.name : "Drop PDF here or click to upload"}
        </p>
        {file && (
          <p className="text-neutral-500 text-xs mt-1">
            Original size: {formatSize(file.size)}
          </p>
        )}
        <p className="text-neutral-600 text-xs mt-2">
          PDF only, max 20 MB
        </p>
      </div>

      {/* Target size selector */}
      {file && (
        <div className="space-y-2">
          <label className="text-sm text-neutral-300 font-medium">
            Target Size
          </label>
          <div className="flex flex-wrap gap-2">
            {TARGET_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTargetKB(opt.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  targetKB === opt.value
                    ? "bg-blue-600 text-white"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compress button */}
      {file && !result && (
        <button
          onClick={handleCompress}
          disabled={processing}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-semibold text-sm transition-colors"
        >
          {processing ? "Compressing..." : "Compress PDF"}
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-neutral-900 rounded-xl p-5 space-y-4">
          <h3 className="text-neutral-200 font-semibold text-sm">
            Compression Result
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-neutral-500 text-xs">Original</p>
              <p className="text-neutral-200 font-mono text-sm mt-1">
                {formatSize(result.originalSize)}
              </p>
            </div>
            <div>
              <p className="text-neutral-500 text-xs">Compressed</p>
              <p className="text-neutral-200 font-mono text-sm mt-1">
                {formatSize(result.compressedSize)}
              </p>
            </div>
            <div>
              <p className="text-neutral-500 text-xs">Reduced</p>
              <p className="text-green-400 font-mono text-sm mt-1">
                {Number(compressionRatio) > 0
                  ? `${compressionRatio}%`
                  : "No reduction"}
              </p>
            </div>
            <div>
              <p className="text-neutral-500 text-xs">Pages</p>
              <p className="text-neutral-200 font-mono text-sm mt-1">
                {result.pages}
              </p>
            </div>
          </div>

          {aboveTarget && (
            <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-3 text-yellow-300 text-xs leading-relaxed">
              Compressed size ({formatSize(result.compressedSize)}) is above
              your target ({targetKB >= 1024 ? `${targetKB / 1024} MB` : `${targetKB} KB`}).
              This PDF likely contains high-resolution images that cannot be
              compressed further without re-encoding. Browser-based tools
              cannot recompress embedded images — for deeper compression,
              try a desktop tool like Ghostscript.
            </div>
          )}

          <button
            onClick={handleDownload}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-colors"
          >
            Download Compressed PDF
          </button>

          <button
            onClick={() => {
              setFile(null);
              setResult(null);
              setError(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-sm transition-colors"
          >
            Compress Another PDF
          </button>
        </div>
      )}
    </div>
  );
}
