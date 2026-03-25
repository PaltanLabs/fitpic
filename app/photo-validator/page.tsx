import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import ValidatorClient from "./ValidatorClient";

export const metadata: Metadata = {
  title: `Photo Validator — Check Your Exam Photo Before Uploading`,
  description:
    "Free tool to check if your photo meets government exam requirements before uploading. Validates dimensions, file size, and format for SSC, UPSC, IBPS, NEET, and 150+ exams.",
  keywords:
    "photo validator, check photo size, validate exam photo, check photo dimensions, photo size checker for exam",
  alternates: { canonical: "/photo-validator" },
  openGraph: {
    title: `Photo Validator — Check Your Exam Photo Before Uploading | ${SITE_NAME}`,
    description:
      "Free tool to check if your photo meets government exam requirements before uploading. Validates dimensions, file size, and format.",
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `Photo Validator | ${SITE_NAME}`,
    description:
      "Free tool to check if your photo meets government exam requirements before uploading.",
  },
};

const faqs = [
  {
    question: "What does the photo validator check?",
    answer:
      "The validator checks five things: image width in pixels, image height in pixels, minimum file size in KB, maximum file size in KB, and image format (JPEG/PNG). Each check is compared against the official requirements for your selected exam.",
  },
  {
    question: "Why was my photo rejected even though it looks correct?",
    answer:
      "Government exam portals check exact pixel dimensions and file size in KB, not how the photo looks. A photo that appears correct visually may be a few pixels off or a few KB over the limit. Use this validator to check the exact numbers.",
  },
  {
    question: "How do I fix a photo that fails validation?",
    answer:
      "Click the 'Fix with FitPic' button that appears when checks fail. It will take you to the exam-specific resizer that automatically adjusts your photo to the exact dimensions and file size required.",
  },
  {
    question: "Does this tool modify my photo?",
    answer:
      "No. The validator only reads your photo to check its properties. It does not resize, compress, or modify your image in any way. Your original file remains unchanged.",
  },
  {
    question: "Is my photo uploaded to any server?",
    answer:
      "No. All validation happens locally in your browser. Your photo is never uploaded, stored, or transmitted. We never see your images.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Photo Validator for Government Exams",
  description:
    "Free tool to validate exam photo dimensions, file size, and format against official requirements for SSC, UPSC, IBPS, NEET, and 150+ exams.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0" },
  browserRequirements: "Any modern browser",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Photo Validator",
    },
  ],
};

export default function PhotoValidatorPage() {
  return (
    <div className="space-y-8">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb navigation */}
      <nav className="text-xs text-neutral-500">
        <a href="/" className="hover:text-neutral-300">Home</a>
        <span className="mx-1">&gt;</span>
        <span className="text-neutral-400">Photo Validator</span>
      </nav>

      {/* SEO heading */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">
          Photo Validator — Check Before You Upload
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Don&apos;t risk rejection. Check if your photo meets the exact
          requirements for your exam before uploading to the portal. Validates
          dimensions, file size, and format for SSC, UPSC, IBPS, NEET, Railway,
          and 150+ government exams. 100% browser-based — we never see your
          photos.
        </p>
      </div>

      {/* The actual tool */}
      <ValidatorClient />

      {/* How it works */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-neutral-300">How It Works</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="bg-neutral-900 rounded-xl p-4">
            <p className="text-yellow-400 font-bold text-lg mb-1">1</p>
            <p className="text-neutral-200 text-sm font-medium">Select Exam</p>
            <p className="text-neutral-500 text-xs mt-1">
              Pick your exam from 150+ presets
            </p>
          </div>
          <div className="bg-neutral-900 rounded-xl p-4">
            <p className="text-yellow-400 font-bold text-lg mb-1">2</p>
            <p className="text-neutral-200 text-sm font-medium">Upload Photo</p>
            <p className="text-neutral-500 text-xs mt-1">
              Select the photo you want to validate
            </p>
          </div>
          <div className="bg-neutral-900 rounded-xl p-4">
            <p className="text-yellow-400 font-bold text-lg mb-1">3</p>
            <p className="text-neutral-200 text-sm font-medium">Get Results</p>
            <p className="text-neutral-500 text-xs mt-1">
              See pass/fail for each requirement
            </p>
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-300">
          Frequently Asked Questions
        </h2>
        {faqs.map((faq, i) => (
          <details key={i} className="bg-neutral-900 rounded-xl">
            <summary className="px-4 py-3 text-neutral-200 text-sm font-medium cursor-pointer hover:text-neutral-100">
              {faq.question}
            </summary>
            <p className="px-4 pb-3 text-neutral-400 text-sm leading-relaxed">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>

      {/* CTA to resizer */}
      <div className="bg-neutral-900 rounded-xl p-4 text-center space-y-2">
        <p className="text-neutral-300 text-sm">
          Need to resize your photo to match exam requirements?
        </p>
        <a
          href="/photo-resizer"
          className="inline-block px-6 py-2.5 rounded-xl bg-yellow-400 text-neutral-900 font-bold text-sm hover:bg-yellow-300 transition-colors"
        >
          Open Photo Resizer
        </a>
      </div>
    </div>
  );
}
