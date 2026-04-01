"use client";

import { useState, useEffect } from "react";

const DEMO_STEPS = [
  { label: "Select Exam", detail: "SSC CGL — Photo" },
  { label: "Upload Photo", detail: "passport_photo.jpg" },
  { label: "Processing", detail: "Resizing to 100×120px, 20-50KB..." },
  { label: "Done!", detail: "✅ 42KB JPEG — Ready to upload" },
];

export default function AnimatedDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const durations = [2500, 2000, 1800, 2800];
    const timeout = setTimeout(() => {
      setStep((s) => (s + 1) % 4);
    }, durations[step]);
    return () => clearTimeout(timeout);
  }, [step]);

  return (
    <section data-animate="fade-up">
      <h2 className="text-2xl font-bold text-neutral-100 mb-2">
        See It in Action
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        Watch how easy it is to resize your photo — all in 3 steps.
      </p>

      <div className="browser-mockup max-w-lg mx-auto">
        {/* Toolbar */}
        <div className="browser-toolbar">
          <div className="browser-dot bg-red-500/70" />
          <div className="browser-dot bg-yellow-500/70" />
          <div className="browser-dot bg-green-500/70" />
          <div className="ml-3 flex-1 bg-neutral-800 rounded-md px-3 py-1 text-xs text-neutral-500">
            fitpic.in/photo-resizer
          </div>
        </div>

        {/* Content area */}
        <div className="p-6 min-h-[260px] flex flex-col justify-between">
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-6">
            {DEMO_STEPS.map((s, i) => (
              <div key={i} className="flex-1 flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-500 ${
                    i <= step
                      ? "bg-yellow-400 text-neutral-900 shadow-[0_0_12px_rgba(250,204,21,0.3)]"
                      : "bg-neutral-800 text-neutral-600 border border-neutral-700"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                {i < 3 && (
                  <div className="flex-1 h-[2px] rounded-full overflow-hidden bg-neutral-800">
                    <div
                      className={`h-full bg-yellow-400 transition-all duration-700 ${
                        i < step ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Animated content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            {step === 0 && (
              <div className="animate-fade-in space-y-3">
                <div className="flex flex-wrap gap-2 justify-center">
                  {["UPSC", "SSC CGL", "NEET", "IBPS PO", "SBI"].map((exam) => (
                    <span
                      key={exam}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                        exam === "SSC CGL"
                          ? "bg-yellow-400 text-neutral-900 shadow-[0_0_12px_rgba(250,204,21,0.2)]"
                          : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                      }`}
                    >
                      {exam}
                    </span>
                  ))}
                </div>
                <p className="text-neutral-500 text-xs">Selecting SSC CGL preset...</p>
              </div>
            )}

            {step === 1 && (
              <div className="animate-fade-in space-y-3">
                <div className="w-20 h-20 mx-auto rounded-xl bg-neutral-800 border-2 border-dashed border-neutral-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-neutral-500 upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="text-neutral-500 text-xs">Uploading passport_photo.jpg...</p>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in space-y-3">
                <div className="w-full max-w-[200px] mx-auto">
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shimmer" style={{ width: "100%", animation: "shimmer-slide 1s ease-in-out infinite" }} />
                  </div>
                </div>
                <p className="text-neutral-400 text-xs font-medium">
                  Resizing to 100×120px, compressing to 20-50KB...
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center">
                  <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-emerald-400 font-semibold text-sm">Ready to upload!</p>
                  <p className="text-neutral-500 text-xs mt-1">42KB JPEG • 100×120px • SSC CGL</p>
                </div>
                <button className="px-6 py-2 rounded-xl bg-yellow-400 text-neutral-900 text-xs font-bold">
                  Download
                </button>
              </div>
            )}
          </div>

          {/* Step label */}
          <div className="mt-4 text-center">
            <p className="text-neutral-400 text-xs font-medium">
              {DEMO_STEPS[step].label}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
