import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import AppSetClient from "./AppSetClient";

export const metadata: Metadata = {
  title: `Complete Application Set — Photo + Signature + Thumb in One Go`,
  description:
    "Upload all your exam documents at once. Resize photo, signature, and thumb impression for SSC, IBPS, UPSC, NEET, and 150+ exams. Download as ZIP. Free, browser-based.",
  keywords:
    "exam photo signature set, ibps photo signature thumb, ssc complete photo set, exam document set download, photo signature thumb zip",
  alternates: { canonical: "/application-set" },
  openGraph: {
    title: `Complete Application Set — Photo + Signature + Thumb in One Go | ${SITE_NAME}`,
    description:
      "Upload all your exam documents at once. Resize photo, signature, and thumb impression for SSC, IBPS, UPSC, NEET, and 150+ exams. Download as ZIP.",
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `Complete Application Set | ${SITE_NAME}`,
    description:
      "Upload all your exam documents at once. Photo, signature, thumb — resized and downloaded as ZIP.",
  },
};

const faqs = [
  {
    q: "What is a Complete Application Set?",
    a: "It is a one-stop tool that lets you upload, resize, and download all required documents (photo, signature, thumb impression) for a government exam in a single ZIP file.",
  },
  {
    q: "Which exams are supported?",
    a: "Over 150 exams including SSC CGL, SSC CHSL, IBPS PO, IBPS Clerk, UPSC, NEET, JEE, Railway RRB, and many more.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. All processing happens 100% in your browser. Your images are never uploaded to any server.",
  },
  {
    q: "What format is the downloaded ZIP?",
    a: "The ZIP contains individually named files like SSC-CGL-Photo.jpg and SSC-CGL-Signature.jpg, each resized to the exact specifications required by the exam portal.",
  },
  {
    q: "Can I use this on mobile?",
    a: "Absolutely. The tool works on all modern browsers including Chrome, Safari, and Firefox on both desktop and mobile devices.",
  },
];

const steps = [
  { title: "Select Exam", desc: "Choose your exam from the dropdown — we auto-load all required document specs." },
  { title: "Upload All Docs", desc: "Upload your photo, signature, and thumb impression in the designated slots." },
  { title: "Download ZIP", desc: "Hit Process All, verify results, then download everything as a single ZIP file." },
];

export default function ApplicationSetPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Application Set", item: `${SITE_URL}/application-set` },
    ],
  };

  const webAppLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `Complete Application Set — ${SITE_NAME}`,
    url: `${SITE_URL}/application-set`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    description: metadata.description,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Complete Application Set</h1>
        <p className="text-neutral-400 text-sm">
          Upload photo, signature, and thumb impression for your exam — all in one go.
          Resize to exact specs and download everything as a single ZIP.
        </p>
      </div>

      <AppSetClient />

      {/* How It Works */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-300">How It Works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
              <p className="text-sm font-semibold text-blue-400">Step {i + 1}</p>
              <p className="font-medium text-neutral-200">{step.title}</p>
              <p className="text-xs text-neutral-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-300">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="group rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3">
              <summary className="cursor-pointer font-medium text-neutral-200 text-sm group-open:mb-2">
                {f.q}
              </summary>
              <p className="text-xs text-neutral-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
