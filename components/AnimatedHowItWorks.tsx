"use client";

import { useState, useEffect } from "react";

const STEPS = [
  {
    num: 1,
    title: "Choose Your Exam",
    desc: "Select from 150+ exam presets (SSC, UPSC, IBPS, Railway, NEET, PAN, Aadhaar, Passport) or enter custom dimensions.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    num: 2,
    title: "Upload Your Photo",
    desc: "Works with JPG, PNG, WebP, HEIC. Take a photo directly from your phone camera — no app needed.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    num: 3,
    title: "Download the Result",
    desc: "Automatically resized to exact pixel dimensions and compressed to the required KB range. Ready to upload to the exam form.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function AnimatedHowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((s) => (s + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section data-animate="fade-up">
      <h2 className="text-2xl font-bold text-neutral-100 mb-2">
        How It Works
      </h2>
      <p className="text-neutral-500 text-sm mb-8">
        Get your exam documents ready in 3 simple steps. No technical skills needed.
      </p>

      {/* Desktop: horizontal stepper */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-6">
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            className={`relative glass-card rounded-2xl p-6 text-center transition-all duration-500 ${
              activeStep === i
                ? "border-yellow-400/40 shadow-[0_0_30px_rgba(250,204,21,0.08)]"
                : ""
            }`}
          >
            {/* Connector line */}
            {i < 2 && (
              <div className="absolute top-1/2 -right-3 w-6 h-[2px] bg-gradient-to-r from-neutral-700 to-transparent z-10 hidden sm:block" />
            )}

            <div
              className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-500 ${
                activeStep === i
                  ? "bg-yellow-400 text-neutral-900 shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                  : "bg-neutral-800 text-neutral-400 border border-neutral-700"
              }`}
            >
              {step.icon}
            </div>

            <h3 className="text-neutral-200 font-semibold text-sm mb-2">
              <span className={`${activeStep === i ? "text-yellow-400" : "text-neutral-500"} mr-1`}>
                {step.num}.
              </span>
              {step.title}
            </h3>
            <p className="text-neutral-500 text-xs leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile: vertical timeline */}
      <div className="sm:hidden space-y-0">
        {STEPS.map((step, i) => (
          <div key={step.num} className={`flex gap-4 ${i < 2 ? "step-line" : ""} pb-8`}>
            <div
              className={`step-node ${
                activeStep === i ? "active" : "inactive"
              }`}
            >
              {step.icon}
            </div>
            <div className="pt-2">
              <h3 className="text-neutral-200 font-semibold text-sm mb-1">
                {step.title}
              </h3>
              <p className="text-neutral-500 text-xs leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
