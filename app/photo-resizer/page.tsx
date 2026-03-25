import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { PRESETS, getPresetSlug } from "@/lib/presets";
import PhotoResizerClient from "./PhotoResizerClient";

export const metadata: Metadata = {
  title: `Photo Resizer for Govt Exams — Resize to Exact KB & Pixels Free`,
  description:
    "Free online photo resizer for SSC, UPSC, IBPS, Railway, NEET, PAN, Aadhaar, Passport. Auto-compress to exact KB and pixel size. 100% browser-based, no signup.",
  keywords:
    "photo resizer, resize photo for exam, compress photo to 50kb, passport photo resizer, exam photo resize online free",
  alternates: { canonical: "/photo-resizer" },
  openGraph: {
    title: `Photo Resizer for Govt Exams — Resize to Exact KB & Pixels Free | ${SITE_NAME}`,
    description:
      "Free online photo resizer for SSC, UPSC, IBPS, Railway, NEET, PAN, Aadhaar, Passport. Auto-compress to exact KB and pixel size. 100% browser-based, no signup.",
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `Photo Resizer for Govt Exams | ${SITE_NAME}`,
    description:
      "Free online photo resizer for SSC, UPSC, IBPS, Railway, NEET, PAN, Aadhaar, Passport.",
  },
};

const photoPresets = PRESETS.filter(
  (p) => (p.type === "photo" || p.type === "thumb") && p.id !== "custom"
);

const photoResizerJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Photo Resizer for Government Exams",
  description: "Free online photo resizer for SSC, UPSC, IBPS, Railway, NEET, PAN, Aadhaar, Passport. Auto-compress to exact KB and pixel size. 100% browser-based.",
  url: `${SITE_URL}/photo-resizer`,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  browserRequirements: "Any modern browser",
};

export default function PhotoResizerPage() {
  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(photoResizerJsonLd) }}
      />
      <h1 className="text-2xl font-bold">Photo Resizer</h1>
      <p className="text-neutral-400 text-sm">
        Resize your photo to exact exam specifications. 100% client-side.
      </p>

      <PhotoResizerClient />

      {/* Popular Exams — server-rendered for SEO */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-neutral-300">
          Popular Photo Presets
        </h2>
        <div className="flex flex-wrap gap-2">
          {photoPresets.map((p) => (
            <a
              key={p.id}
              href={`/${getPresetSlug(p)}`}
              className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs hover:border-neutral-600"
            >
              {p.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
