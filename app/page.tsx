import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { PRESETS, getPresetSlug, CATEGORIES } from "@/lib/presets";
import AdSlot from "@/components/AdSlot";
import TrustBadge from "@/components/TrustBadge";
import ScrollAnimations from "@/components/ScrollAnimations";
import AnimatedHowItWorks from "@/components/AnimatedHowItWorks";
import FeatureGrid from "@/components/FeatureGrid";
import AnimatedDemo from "@/components/AnimatedDemo";

const FAQ_ITEMS = [
  {
    question: "Is FitPic free?",
    answer:
      "Yes, FitPic is completely free to use. There are no hidden charges, no premium plans, and no limits on the number of photos or signatures you can resize.",
  },
  {
    question: "Is my photo safe?",
    answer:
      "All processing happens entirely in your browser. Your photos and signatures are never uploaded to any server. We never see, store, or have access to your images.",
  },
  {
    question: "Does it work on mobile?",
    answer:
      "Yes, FitPic works on all devices including smartphones, tablets, laptops, and desktops. You can even take a photo directly from your phone camera and resize it instantly.",
  },
  {
    question: "Which exams are supported?",
    answer:
      "FitPic supports 150+ exam presets including SSC CGL, SSC CHSL, UPSC CSE, IBPS PO, IBPS Clerk, SBI PO, RRB NTPC, NEET UG, JEE Main, GATE, PAN Card, Aadhaar, Passport, and many more state-level exams.",
  },
  {
    question: "Do I need to sign up?",
    answer:
      "No signup, no account, and no email required. Just open the website, pick your exam, upload your photo or signature, and download the resized file.",
  },
];

export const metadata: Metadata = {
  title: `Free Photo Resizer & Compressor — Resize to Exact KB & Pixels Online`,
  description:
    "Free online photo resizer and compressor. Resize photos to exact KB and pixel dimensions for government exams (SSC, UPSC, IBPS, Railway, NEET), passport, PAN card, Aadhaar. 100% browser-based, no signup.",
  keywords:
    "photo resizer, image resizer, compress photo to kb, resize photo online, signature resizer, passport photo resizer, exam photo size, photo compressor",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — Free Photo Resizer & Compressor`,
    description:
      "Resize photos to exact KB and pixel dimensions. Free, browser-based, no signup. 150+ exam presets.",
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Free Photo Resizer & Compressor`,
    description:
      "Resize photos to exact KB and pixel dimensions. Free, browser-based, no signup. 150+ exam presets.",
  },
};

const examsByCategory = CATEGORIES.filter((c) => c !== "Custom").map((cat) => ({
  category: cat,
  presets: PRESETS.filter((p) => p.category === cat && p.id !== "custom"),
}));

export default function HomePage() {
  return (
    <div className="space-y-16">
      <ScrollAnimations />

      {/* ===== Hero ===== */}
      <section className="hero-bg dot-grid text-center space-y-5 py-12 -mx-4 px-4 rounded-3xl relative">
        <div data-animate="fade-up">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Exam Ready Photos in{" "}
            <span className="gradient-text-animated">Seconds</span>
          </h1>
        </div>

        <p
          className="text-neutral-400 max-w-lg mx-auto text-base leading-relaxed"
          data-animate="fade-up"
          data-delay="1"
        >
          Automatically resize and compress photos & signatures for{" "}
          <span className="text-neutral-300 font-medium">SSC, UPSC, IBPS, Railway, NEET, JEE</span>,
          PAN, Aadhaar, Passport & 100+ more exams.{" "}
          <span className="text-emerald-400 font-medium">100% Free & Private.</span>
        </p>

        <div data-animate="fade-up" data-delay="2">
          <TrustBadge />
        </div>

        <div
          className="flex flex-col sm:flex-row gap-3 justify-center pt-3"
          data-animate="fade-up"
          data-delay="3"
        >
          <a
            href="/photo-resizer"
            className="btn-glow px-8 py-3.5 rounded-xl bg-yellow-400 text-neutral-900 font-bold text-center text-sm"
          >
            Resize Photo Now →
          </a>
          <a
            href="/signature-resizer"
            className="btn-glow px-8 py-3.5 rounded-xl bg-neutral-800/80 text-neutral-200 font-bold text-center text-sm border border-neutral-700 hover:border-neutral-500"
          >
            Resize Signature
          </a>
        </div>
      </section>

      <AdSlot slot="top-banner" format="horizontal" />

      {/* ===== Tool Cards ===== */}
      <section className="space-y-6" data-animate="fade-up">
        <h2 className="text-2xl font-bold text-neutral-100">Our Tools</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <a
            href="/photo-resizer"
            className="glass-card rounded-2xl p-6 block group"
            data-animate="fade-up"
            data-delay="1"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
              <svg className="w-5 h-5 text-blue-400 feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-neutral-100">Photo Resizer</h3>
            <p className="text-neutral-400 text-sm mt-1.5 leading-relaxed">
              Resize passport photos for any exam. Auto-compress to exact KB and pixel requirements.
            </p>
          </a>

          <a
            href="/signature-resizer"
            className="glass-card rounded-2xl p-6 block group"
            data-animate="fade-up"
            data-delay="2"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition-colors">
              <svg className="w-5 h-5 text-purple-400 feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-neutral-100">Signature Resizer</h3>
            <p className="text-neutral-400 text-sm mt-1.5 leading-relaxed">
              Clean up and resize signatures. Handles dark backgrounds, auto-converts to black ink on white.
            </p>
          </a>

          <a
            href="/photo-signature-joiner"
            className="glass-card rounded-2xl p-6 block group"
            data-animate="fade-up"
            data-delay="3"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3 group-hover:bg-amber-500/20 transition-colors">
              <svg className="w-5 h-5 text-amber-400 feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-neutral-100">Photo + Signature Joiner</h3>
            <p className="text-neutral-400 text-sm mt-1.5 leading-relaxed">
              Combine photo and signature into a single image for IBPS/SSC/RRB uploads.
            </p>
          </a>
        </div>
      </section>

      {/* ===== Animated Demo ===== */}
      <AnimatedDemo />

      {/* ===== How It Works ===== */}
      <AnimatedHowItWorks />

      {/* ===== Feature Grid ===== */}
      <FeatureGrid />

      <AdSlot slot="mid-banner" format="horizontal" />

      {/* ===== Supported Exams ===== */}
      <section className="space-y-4" data-animate="fade-up">
        <h2 className="text-2xl font-bold text-neutral-100">
          Supported Exam Formats
        </h2>
        <p className="text-neutral-500 text-sm">
          We automatically handle the exact specifications for each exam.
        </p>
        <div className="space-y-3">
          {examsByCategory.map(({ category, presets }) => (
            <details key={category} className="group glass-card rounded-xl overflow-hidden">
              <summary className="px-5 py-3.5 cursor-pointer text-sm font-medium text-neutral-300 hover:text-yellow-400 transition-colors flex items-center justify-between">
                <span>{category} <span className="text-neutral-600 font-normal">({presets.length} presets)</span></span>
                <svg className="w-4 h-4 text-neutral-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <div className="overflow-x-auto px-5 pb-4">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-neutral-500 border-b border-neutral-800">
                      <th className="py-2 pr-4 font-medium">Exam</th>
                      <th className="py-2 pr-4 font-medium">Type</th>
                      <th className="py-2 pr-4 font-medium">Size</th>
                      <th className="py-2 font-medium">KB Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {presets.map((p) => (
                      <tr key={p.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                        <td className="py-2 pr-4">
                          <a
                            href={`/${getPresetSlug(p)}`}
                            className="text-yellow-400 hover:underline"
                          >
                            {p.name}
                          </a>
                        </td>
                        <td className="py-2 pr-4 text-neutral-400">
                          {p.type === "photo"
                            ? "Photo"
                            : p.type === "thumb"
                            ? "Thumb Impression"
                            : "Signature"}
                        </td>
                        <td className="py-2 pr-4 text-neutral-400">
                          {p.width}x{p.height}px
                        </td>
                        <td className="py-2 text-neutral-400">
                          {p.minKB}-{p.maxKB}KB
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="space-y-4" data-animate="fade-up">
        <h2 className="text-2xl font-bold text-neutral-100">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <details
              key={i}
              className="glass-card rounded-xl group overflow-hidden"
            >
              <summary className="px-5 py-3.5 cursor-pointer text-sm font-medium text-neutral-200 hover:text-yellow-400 transition-colors flex items-center justify-between">
                {item.question}
                <svg className="w-4 h-4 text-neutral-500 transition-transform group-open:rotate-180 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <p className="px-5 pb-4 text-neutral-400 text-sm leading-relaxed">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <AdSlot slot="bottom-rect" format="rectangle" />

      {/* FAQPage + Organization JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQ_ITEMS.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/icon.png`,
              description:
                "Free online photo and signature resizer for Indian government exams. 100% browser-based, private, no signup required.",
            },
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Resize a Photo for Government Exams",
              description: "Resize your photo to exact exam specifications in 3 simple steps.",
              step: [
                {
                  "@type": "HowToStep",
                  position: 1,
                  name: "Choose Your Exam",
                  text: "Select from 150+ exam presets (SSC, UPSC, IBPS, Railway, NEET, PAN, Aadhaar, Passport) or enter custom dimensions.",
                },
                {
                  "@type": "HowToStep",
                  position: 2,
                  name: "Upload Your Photo",
                  text: "Upload a JPG, PNG, or WebP photo. Works with phone camera photos too.",
                },
                {
                  "@type": "HowToStep",
                  position: 3,
                  name: "Download the Resized File",
                  text: "Your photo is automatically resized to exact pixel dimensions and compressed to the required KB range. Download and upload to your exam form.",
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/photo-resizer`,
                "query-input": "required name=search_term_string",
              },
            },
          ]),
        }}
      />
    </div>
  );
}
