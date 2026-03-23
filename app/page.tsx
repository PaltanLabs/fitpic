import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { PRESETS, getPresetSlug, CATEGORIES } from "@/lib/presets";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Free Photo & Signature Resizer for Govt Exams | SSC, UPSC, IBPS, NEET`,
  description:
    "Free online photo and signature resizer for Indian government exams. SSC, UPSC, IBPS, Railway, NEET, JEE, PAN, Aadhaar, Passport. Resize to exact KB and pixels. 100% browser-based, private, no signup.",
  keywords:
    "photo resizer, signature resizer, exam photo resize, compress photo to kb, govt exam photo size",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — Free Photo & Signature Resizer for Govt Exams`,
    description:
      "Free online photo and signature resizer for Indian government exams. SSC, UPSC, IBPS, Railway, NEET, JEE, PAN, Aadhaar, Passport.",
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Free Photo & Signature Resizer for Govt Exams`,
    description:
      "Free online photo and signature resizer for Indian government exams.",
  },
};

const examsByCategory = CATEGORIES.filter((c) => c !== "Custom").map((cat) => ({
  category: cat,
  presets: PRESETS.filter((p) => p.category === cat && p.id !== "custom"),
}));

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3 py-6">
        <h1 className="text-3xl font-bold text-neutral-100">
          Free Photo & Signature Resizer
        </h1>
        <p className="text-neutral-400 max-w-md mx-auto">
          Resize photos and signatures for Indian government exams. SSC, UPSC,
          IBPS, Railway, NEET, JEE, PAN, Aadhaar, Passport & more.
        </p>
        <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
          <span>🔒</span>
          <span>100% browser-based — we never see your photos</span>
        </div>
      </div>

      <AdSlot slot="top-banner" format="horizontal" />

      {/* Tool cards */}
      <div className="grid gap-4">
        <a
          href="/photo-resizer"
          className="block p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-yellow-400/50 transition-colors"
        >
          <div className="text-2xl mb-2">📷</div>
          <h2 className="text-xl font-bold text-neutral-100">Photo Resizer</h2>
          <p className="text-neutral-400 text-sm mt-1">
            Resize passport photos for any exam. Auto-compress to exact KB and
            pixel requirements.
          </p>
        </a>

        <a
          href="/signature-resizer"
          className="block p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-yellow-400/50 transition-colors"
        >
          <div className="text-2xl mb-2">✍️</div>
          <h2 className="text-xl font-bold text-neutral-100">
            Signature Resizer
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            Clean up and resize signatures. Handles dark backgrounds, auto-converts to
            black ink on white.
          </p>
        </a>

        <a
          href="/photo-signature-joiner"
          className="block p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-yellow-400/50 transition-colors"
        >
          <div className="text-2xl mb-2">🖼️</div>
          <h2 className="text-xl font-bold text-neutral-100">
            Photo + Signature Joiner
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            Combine photo and signature into a single image for IBPS/SSC/RRB uploads.
          </p>
        </a>
      </div>

      {/* How It Works */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-300">How It Works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-neutral-900 rounded-xl p-4">
            <div className="text-yellow-400 font-bold text-lg mb-1">1</div>
            <h3 className="text-neutral-200 font-medium text-sm">Choose Your Exam</h3>
            <p className="text-neutral-500 text-xs mt-1">
              Select from 150+ exam presets (SSC, UPSC, IBPS, Railway, NEET, PAN,
              Aadhaar, Passport) or enter custom dimensions.
            </p>
          </div>
          <div className="bg-neutral-900 rounded-xl p-4">
            <div className="text-yellow-400 font-bold text-lg mb-1">2</div>
            <h3 className="text-neutral-200 font-medium text-sm">Upload Your Photo or Signature</h3>
            <p className="text-neutral-500 text-xs mt-1">
              Works with JPG, PNG, WebP, HEIC. Take a photo directly from your
              phone camera.
            </p>
          </div>
          <div className="bg-neutral-900 rounded-xl p-4">
            <div className="text-yellow-400 font-bold text-lg mb-1">3</div>
            <h3 className="text-neutral-200 font-medium text-sm">Download the Resized File</h3>
            <p className="text-neutral-500 text-xs mt-1">
              Automatically resized to exact pixel dimensions and compressed to
              the required KB range. Ready to upload to the exam form.
            </p>
          </div>
        </div>
      </div>

      {/* Supported Exams — expanded with links and sizes */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-300">
          Supported Exam Formats
        </h2>
        {examsByCategory.map(({ category, presets }) => (
          <div key={category} className="space-y-2">
            <h3 className="text-neutral-400 text-sm font-medium">{category}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-neutral-500 border-b border-neutral-800">
                    <th className="py-1.5 pr-4">Exam</th>
                    <th className="py-1.5 pr-4">Type</th>
                    <th className="py-1.5 pr-4">Size</th>
                    <th className="py-1.5">KB Range</th>
                  </tr>
                </thead>
                <tbody>
                  {presets.map((p) => (
                    <tr key={p.id} className="border-b border-neutral-900">
                      <td className="py-1.5 pr-4">
                        <a
                          href={`/${getPresetSlug(p)}`}
                          className="text-yellow-400 hover:underline"
                        >
                          {p.name}
                        </a>
                      </td>
                      <td className="py-1.5 pr-4 text-neutral-400">
                        {p.type === "photo"
                          ? "Photo"
                          : p.type === "thumb"
                          ? "Thumb Impression"
                          : "Signature"}
                      </td>
                      <td className="py-1.5 pr-4 text-neutral-400">
                        {p.width}x{p.height}px
                      </td>
                      <td className="py-1.5 text-neutral-400">
                        {p.minKB}-{p.maxKB}KB
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <AdSlot slot="bottom-rect" format="rectangle" />
    </div>
  );
}
