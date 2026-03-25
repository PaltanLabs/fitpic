import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { PRESETS, getPresetSlug } from "@/lib/presets";
import NameDateClient from "./NameDateClient";

export const metadata: Metadata = {
  title: `Add Name & Date on Photo for SSC/IBPS — Free Online`,
  description:
    "Add name and date stamp on photo online free for SSC, IBPS, Railway exams. Add name and date of birth on photo for government form upload. Works on mobile, no signup.",
  keywords:
    "add name date photo online, SSC photo name date stamp, add name and date of birth on photo, name date stamp on photo for exam, IBPS photo name date",
  alternates: { canonical: "/name-date-stamp" },
  openGraph: {
    title: `Add Name & Date on Photo for SSC/IBPS — Free Online | ${SITE_NAME}`,
    description:
      "Add name and date stamp on photo online free for SSC, IBPS, Railway exams. Works on mobile, no signup.",
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `Add Name & Date on Photo | ${SITE_NAME}`,
    description:
      "Add name and date stamp on photo online free for SSC, IBPS, Railway exams.",
  },
};

const dateStampPresets = PRESETS.filter(
  (p) => p.type === "photo" && p.requiresDateStamp && p.id !== "custom"
);

const faqs = [
  {
    question: "How do I add name and date on photo for SSC?",
    answer:
      "Upload your photo, select the SSC exam preset, type your full name, and click 'Resize & Add Stamp'. The tool automatically adds a white strip below your photo with your name and today's date in DD/MM/YYYY format.",
  },
  {
    question: "What format is the name and date stamp?",
    answer:
      "The stamp appears as a white strip below your photo showing 'Your Name | DD/MM/YYYY'. This is the standard format accepted by SSC, IBPS, and other government exam portals.",
  },
  {
    question: "Can I add a date of birth instead of today's date?",
    answer:
      "The tool uses today's date by default, which is what most exam forms require. The date stamp shows when the photo was taken/processed, not your date of birth. Check your exam notification for specific requirements.",
  },
  {
    question: "Does this work for IBPS and banking exams?",
    answer:
      "Yes. Select the appropriate IBPS preset (PO, Clerk, SO, or RRB) from the dropdown. The tool will resize to the exact dimensions and KB required by IBPS and add the name+date stamp.",
  },
  {
    question: "Is my photo safe when using this tool?",
    answer:
      "Yes, completely safe. All processing happens locally in your browser. Your photos are never uploaded to any server. We never see, store, or access your images.",
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
  name: "Add Name & Date on Photo for SSC/IBPS",
  description:
    "Free online tool to add name and date stamp on photos for SSC, IBPS, Railway, and other government exam form uploads.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0" },
  browserRequirements: "Any modern browser",
};

export default function NameDateStampPage() {
  return (
    <div className="space-y-8">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />

      {/* Breadcrumb navigation */}
      <nav className="text-xs text-neutral-500">
        <a href="/" className="hover:text-neutral-300">Home</a>
        <span className="mx-1">&gt;</span>
        <span className="text-neutral-400">Name & Date Stamp</span>
      </nav>

      {/* SEO heading */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">
          Add Name & Date on Photo — Free Online Tool
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Add name and date stamp on your exam photo for SSC, IBPS, Railway, and
          other government exams. Select your exam, upload your photo, enter your
          name, and download the stamped result. Automatically resized and
          compressed to exact specifications. 100% browser-based — we never see
          your photos.
        </p>
      </div>

      {/* The actual tool */}
      <NameDateClient />

      {/* Exams that require name+date stamp */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-neutral-300">
          Exams Requiring Name & Date Stamp
        </h2>
        <div className="flex flex-wrap gap-2">
          {dateStampPresets.map((p) => (
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
    </div>
  );
}
