import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { PRESETS, getPresetSlug } from "@/lib/presets";
import PhotoResizerClient from "./PhotoResizerClient";
import TrustBadge from "@/components/TrustBadge";

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
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
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

const PHOTO_FAQ = [
  {
    question: "What size photo do I need for government exams?",
    answer: "Each exam has different requirements. Common sizes include 100x120px (SSC), 200x230px (IBPS/SBI), and 150x200px (UPSC). FitPic has 150+ presets with exact specs for each exam.",
  },
  {
    question: "How do I compress a photo to 50KB or less?",
    answer: "Upload your photo, select your exam preset, and click Resize. FitPic automatically compresses to the exact KB range required — no manual quality adjustment needed.",
  },
  {
    question: "Can I resize a photo without selecting an exam?",
    answer: "Yes! You can upload your photo first, then select an exam. We support 150+ exam presets or you can enter custom dimensions.",
  },
  {
    question: "Is my photo uploaded to a server?",
    answer: "No. All processing happens 100% in your browser. Your photos never leave your device. We never see, store, or have access to your images.",
  },
  {
    question: "Does it work on mobile phones?",
    answer: "Yes, FitPic works on all devices. You can take a photo with your phone camera and resize it instantly — no app download needed.",
  },
];

const photoFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PHOTO_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const photoBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Photo Resizer", item: `${SITE_URL}/photo-resizer` },
  ],
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
      <TrustBadge />

      <PhotoResizerClient />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(photoFaqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(photoBreadcrumbJsonLd) }}
      />

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-neutral-300">Frequently Asked Questions</h2>
        {PHOTO_FAQ.map((item, i) => (
          <details key={i} className="bg-neutral-900 rounded-xl border border-neutral-800">
            <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-neutral-200 hover:text-yellow-400">
              {item.question}
            </summary>
            <p className="px-4 pb-3 text-neutral-400 text-sm leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>

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
