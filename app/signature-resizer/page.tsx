import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { PRESETS, getPresetSlug } from "@/lib/presets";
import SignatureResizerClient from "./SignatureResizerClient";

export const metadata: Metadata = {
  title: `Signature Resizer — Clean Up & Resize Signatures for Exams Free`,
  description:
    "Free online signature resizer for SSC, UPSC, IBPS, Railway, PAN Card. Auto-converts dark backgrounds to white, black ink optimized. Browser-based, no signup.",
  keywords:
    "signature resizer, resize signature for exam, signature 20kb, exam signature resize online free",
  alternates: { canonical: "/signature-resizer" },
  openGraph: {
    title: `Signature Resizer — Clean Up & Resize Signatures for Exams Free | ${SITE_NAME}`,
    description:
      "Free online signature resizer for SSC, UPSC, IBPS, Railway, PAN Card. Auto-converts dark backgrounds to white, black ink optimized.",
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Signature Resizer for Exams | ${SITE_NAME}`,
    description:
      "Free online signature resizer for SSC, UPSC, IBPS, Railway, PAN Card.",
  },
};

const sigPresets = PRESETS.filter(
  (p) => p.type === "signature" && p.id !== "custom"
);

const signatureResizerJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Signature Resizer for Government Exams",
  description: "Free online signature resizer for SSC, UPSC, IBPS, Railway, PAN Card. Auto-converts dark backgrounds to white, black ink optimized. Browser-based.",
  url: `${SITE_URL}/signature-resizer`,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  browserRequirements: "Any modern browser",
};

export default function SignatureResizerPage() {
  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(signatureResizerJsonLd) }}
      />
      <h1 className="text-2xl font-bold">Signature Resizer</h1>
      <p className="text-neutral-400 text-sm">
        Clean up and resize your signature. Auto-converts dark backgrounds to
        white. Black ink optimized.
      </p>

      <SignatureResizerClient />

      {/* Popular Exams — server-rendered for SEO */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-neutral-300">
          Popular Signature Presets
        </h2>
        <div className="flex flex-wrap gap-2">
          {sigPresets.map((p) => (
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
