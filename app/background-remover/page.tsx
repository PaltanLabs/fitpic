import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import BgRemoverClient from "./BgRemoverClient";

const title = `Remove Photo Background — Free Online Background Remover | ${SITE_NAME}`;
const description =
  "Free online tool to remove photo background and replace with white. Perfect for government exam forms, passport photos, and ID cards. 100% browser-based, no uploads.";

export const metadata: Metadata = {
  title,
  description,
  keywords:
    "remove background online, white background photo, passport photo background remove, exam photo background remover, background remover free, white bg for exam photo",
  alternates: { canonical: "/background-remover" },
  openGraph: {
    title,
    description,
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `Remove Photo Background — Free Online | ${SITE_NAME}`,
    description,
  },
};

const faqItems = [
  {
    q: "Is it free?",
    a: "Yes, completely free with no limits. There is no signup, watermark, or hidden charges. You can remove backgrounds from as many photos as you want.",
  },
  {
    q: "Does it upload my photo?",
    a: "No, 100% browser-based. Your photo never leaves your device. The AI model runs entirely in your browser using TensorFlow.js, so your privacy is fully protected.",
  },
  {
    q: "How does it work?",
    a: "Uses AI (MediaPipe SelfieSegmentation) to detect the person in the photo and remove the background. The background is replaced with a clean white color, perfect for official documents.",
  },
  {
    q: "Which exams need white background photos?",
    a: "Most government exams including SSC CGL, SSC CHSL, UPSC, IBPS PO/Clerk, RRB NTPC, and many state PSC exams require white background passport-style photos. Passport and Aadhaar also require plain white backgrounds.",
  },
  {
    q: "Can I resize after removing the background?",
    a: "Yes, select an exam preset before uploading your photo. The tool will remove the background and then resize to the exact pixel dimensions and file size required for that exam.",
  },
];

const steps = [
  { num: "1", title: "Upload Photo", desc: "Upload any photo from your phone or computer." },
  { num: "2", title: "AI Removes Background", desc: "Our AI detects the person and replaces the background with white." },
  { num: "3", title: "Download", desc: "Download your photo with a clean white background, ready for use." },
];

export default function BackgroundRemoverPage() {
  const breadcrumbLd = {
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
        name: "Background Remover",
        item: `${SITE_URL}/background-remover`,
      },
    ],
  };

  const webAppLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "FitPic Background Remover",
    url: `${SITE_URL}/background-remover`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="space-y-8">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          Remove Photo Background
        </h1>
        <p className="text-neutral-400 text-sm">
          Remove any background and replace with white — perfect for exam forms,
          passport photos, and ID cards. 100% browser-based, your photo never
          leaves your device.
        </p>
      </div>

      {/* Main Tool */}
      <BgRemoverClient />

      {/* How It Works */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-300">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-neutral-900 rounded-xl p-4 text-center space-y-2"
            >
              <div className="w-10 h-10 rounded-full bg-yellow-400/20 text-yellow-400 font-bold text-lg flex items-center justify-center mx-auto">
                {step.num}
              </div>
              <h3 className="font-semibold text-neutral-200 text-sm">
                {step.title}
              </h3>
              <p className="text-neutral-500 text-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-neutral-300">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          <a
            href="/photo-resizer"
            className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-sm hover:bg-neutral-700 transition-colors"
          >
            Photo Resizer
          </a>
          <a
            href="/signature-resizer"
            className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-sm hover:bg-neutral-700 transition-colors"
          >
            Signature Resizer
          </a>
          <a
            href="/photo-validator"
            className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-sm hover:bg-neutral-700 transition-colors"
          >
            Photo Validator
          </a>
          <a
            href="/name-date-stamp"
            className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-sm hover:bg-neutral-700 transition-colors"
          >
            Name & Date Stamp
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-300">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <details
              key={i}
              className="bg-neutral-900 rounded-xl px-4 py-3 group"
            >
              <summary className="text-neutral-200 text-sm font-medium cursor-pointer list-none flex items-center justify-between">
                {item.q}
                <span className="text-neutral-500 group-open:rotate-180 transition-transform">
                  &#9662;
                </span>
              </summary>
              <p className="text-neutral-400 text-sm mt-2">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
