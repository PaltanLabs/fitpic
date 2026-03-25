import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import PdfCompressorClient from "./PdfCompressorClient";

export const metadata: Metadata = {
  title: `PDF Compressor — Compress PDF for Government Forms`,
  description:
    "Free online PDF compressor for government exam forms. Reduce PDF size to 100KB, 200KB, 500KB for SSC, UPSC, IBPS applications. 100% browser-based, no upload to server.",
  keywords:
    "compress pdf online, pdf compressor for government form, reduce pdf size to 100kb, pdf compress for ssc, compress pdf for upsc, reduce pdf size for ibps",
  alternates: { canonical: "/pdf-compressor" },
  openGraph: {
    title: `PDF Compressor — Compress PDF for Government Forms | ${SITE_NAME}`,
    description:
      "Free online PDF compressor for government exam forms. Reduce PDF size to 100KB, 200KB, 500KB. 100% browser-based.",
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `PDF Compressor | ${SITE_NAME}`,
    description:
      "Free online PDF compressor for government exam forms. Reduce PDF size to 100KB, 200KB, 500KB.",
  },
};

const faqs = [
  {
    question: "How does the PDF compressor work?",
    answer:
      "The tool loads your PDF in the browser, creates a clean copy by stripping unused objects, metadata, and bloat accumulated from editing software. This often reduces file size significantly for documents exported from Word, Google Docs, or scanned files with extra metadata.",
  },
  {
    question: "Can I compress a PDF to exactly 100KB?",
    answer:
      "The tool removes metadata and unused objects to reduce size. If the PDF contains high-resolution embedded images, it may not reach very small targets without re-encoding those images. The tool will show you the actual compressed size and warn you if it exceeds your target.",
  },
  {
    question: "Is my PDF uploaded to a server?",
    answer:
      "No. All processing happens 100% in your browser using JavaScript. Your PDF never leaves your device. We never see, store, or access your files.",
  },
  {
    question: "Which government exams require compressed PDFs?",
    answer:
      "Many exams like SSC CGL, SSC CHSL, IBPS PO, IBPS Clerk, UPSC, Railway RRB, and state PSC exams require uploading documents (signature, photo, certificates) as PDFs within specific size limits — often 100KB to 500KB.",
  },
  {
    question: "What if the compressed PDF is still too large?",
    answer:
      "If your PDF contains high-resolution scanned images, browser-based compression alone may not be enough. Try scanning at a lower DPI (150 instead of 300), or use a desktop tool like Ghostscript for deeper image recompression.",
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
  name: "PDF Compressor for Government Forms",
  description:
    "Free online tool to compress PDF files for SSC, UPSC, IBPS, and other government exam form uploads. 100% browser-based.",
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
      name: "PDF Compressor",
      item: `${SITE_URL}/pdf-compressor`,
    },
  ],
};

export default function PdfCompressorPage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb navigation */}
      <nav className="text-xs text-neutral-500">
        <a href="/" className="hover:text-neutral-300">
          Home
        </a>
        <span className="mx-1">&gt;</span>
        <span className="text-neutral-400">PDF Compressor</span>
      </nav>

      {/* SEO heading */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">
          PDF Compressor — Reduce PDF Size for Government Forms
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Compress your PDF files online for free. Reduce PDF size to 100KB,
          200KB, or 500KB for SSC, UPSC, IBPS, Railway, and other government
          exam form uploads. 100% browser-based — your files never leave your
          device.
        </p>
      </div>

      {/* The actual tool */}
      <PdfCompressorClient />

      {/* How It Works */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-neutral-300">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-neutral-900 rounded-xl p-4 text-center space-y-2">
            <div className="text-2xl">1</div>
            <p className="text-neutral-300 text-sm font-medium">Upload PDF</p>
            <p className="text-neutral-500 text-xs">
              Drop or select your PDF file (up to 20 MB)
            </p>
          </div>
          <div className="bg-neutral-900 rounded-xl p-4 text-center space-y-2">
            <div className="text-2xl">2</div>
            <p className="text-neutral-300 text-sm font-medium">
              Select Target Size
            </p>
            <p className="text-neutral-500 text-xs">
              Choose 100KB, 200KB, 500KB, or 1MB
            </p>
          </div>
          <div className="bg-neutral-900 rounded-xl p-4 text-center space-y-2">
            <div className="text-2xl">3</div>
            <p className="text-neutral-300 text-sm font-medium">Download</p>
            <p className="text-neutral-500 text-xs">
              Get your compressed PDF instantly
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
    </div>
  );
}
