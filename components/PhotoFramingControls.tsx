"use client";

interface Props {
  cropBiasY: number;
  onCropBiasYChange: (value: number) => void;
  whiteBackgroundMode: boolean;
  onWhiteBackgroundModeChange: (enabled: boolean) => void;
}

export default function PhotoFramingControls({
  cropBiasY,
  onCropBiasYChange,
  whiteBackgroundMode,
  onWhiteBackgroundModeChange,
}: Props) {
  return (
    <div className="bg-neutral-900 rounded-xl p-4 space-y-3">
      <p className="text-neutral-300 text-sm font-medium">Photo guidance</p>
      <ul className="text-neutral-500 text-xs space-y-1 list-disc pl-4">
        <li>Use a plain light background (white/off-white wall works best).</li>
        <li>Avoid sky, mountains, trees, or textured backgrounds for govt forms.</li>
        <li>Keep head and shoulders clearly visible with no harsh shadows.</li>
      </ul>

      <div className="space-y-2 pt-1">
        <label className="flex items-center justify-between gap-3 cursor-pointer bg-neutral-800 rounded-lg px-3 py-2">
          <span className="text-neutral-300 text-xs">Make background white (beta)</span>
          <input
            type="checkbox"
            checked={whiteBackgroundMode}
            onChange={(e) => onWhiteBackgroundModeChange(e.target.checked)}
            className="w-4 h-4 accent-yellow-400"
          />
        </label>
        {whiteBackgroundMode && (
          <p className="text-neutral-600 text-xs">
            First run may take longer while model files are downloaded in your browser.
          </p>
        )}

        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-400">Head framing</span>
          <span className="text-neutral-500">
            {cropBiasY <= 0.12
              ? "Top focused"
              : cropBiasY <= 0.28
                ? "Balanced"
                : "Centered"}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={50}
          step={1}
          value={Math.round(cropBiasY * 100)}
          onChange={(e) => onCropBiasYChange(Number(e.target.value) / 100)}
          className="w-full accent-yellow-400"
        />
        <p className="text-neutral-600 text-xs">
          Move left to keep more of the top/head area. Move right to keep more center.
        </p>
      </div>
    </div>
  );
}
