import { PRESETS, getPresetSlug, type ExamPreset } from "@/lib/presets";
import { HINDI_EXAM_CONTENT, type HindiExamContent } from "@/lib/hindi-content";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import ExamToolClient from "@/app/[exam]/ExamToolClient";

export function generateStaticParams() {
  return HINDI_EXAM_CONTENT.map((h) => ({ exam: h.examSlug }));
}

function getHindiAndPreset(slug: string): { hindi: HindiExamContent; preset: ExamPreset } | null {
  const hindi = HINDI_EXAM_CONTENT.find((h) => h.examSlug === slug);
  if (!hindi) return null;
  const preset = PRESETS.find((p) => getPresetSlug(p) === slug);
  if (!preset) return null;
  return { hindi, preset };
}

export async function generateMetadata({
  params,
}: {
  params: { exam: string };
}): Promise<Metadata> {
  const match = getHindiAndPreset(params.exam);
  if (!match) return { title: "Not Found" };

  const { hindi } = match;

  return {
    title: hindi.title,
    description: hindi.description,
    alternates: {
      canonical: `/hi/${params.exam}`,
      languages: { en: `/${params.exam}` },
    },
    openGraph: {
      title: hindi.title,
      description: hindi.description,
      type: "website",
      siteName: SITE_NAME,
      locale: "hi_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: hindi.title,
      description: hindi.description,
    },
  };
}

export default function HindiExamPage({ params }: { params: { exam: string } }) {
  const match = getHindiAndPreset(params.exam);

  if (!match) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-neutral-300">पेज नहीं मिला</h1>
        <p className="text-neutral-500 mt-2">
          <a href="/" className="text-yellow-400 hover:underline">
            होम पेज पर जाएं
          </a>
        </p>
      </div>
    );
  }

  const { hindi, preset } = match;
  const slug = params.exam;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: hindi.h1,
    description: hindi.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0" },
    browserRequirements: "Any modern browser",
    inLanguage: "hi",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: hindi.faqQuestions.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
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
        name: "हिंदी",
        item: `${SITE_URL}/hi`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: hindi.examName,
      },
    ],
  };

  return (
    <div className="space-y-8" lang="hi">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
        <span className="hover:text-neutral-300">हिंदी</span>
        <span className="mx-1">&gt;</span>
        <span className="text-neutral-400">{hindi.examName}</span>
      </nav>

      {/* Hindi heading and intro */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">{hindi.h1}</h1>
        <p className="text-neutral-400 text-sm leading-relaxed">{hindi.introText}</p>
      </div>

      {/* The tool (stays in English — component is client-side) */}
      <ExamToolClient presetId={preset.id} />

      {/* About section */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-neutral-200">
          {hindi.examName} के बारे में
        </h2>
        <p className="text-neutral-400 text-sm leading-relaxed">{hindi.about}</p>
      </div>

      {/* Upload steps */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-neutral-200">
          फोटो कैसे अपलोड करें
        </h2>
        <ol className="list-decimal list-inside space-y-1 text-neutral-400 text-sm">
          {hindi.uploadSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      {/* Common mistakes */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-neutral-200">
          आम गलतियां जो बचनी चाहिए
        </h2>
        <ul className="list-disc list-inside space-y-1 text-neutral-400 text-sm">
          {hindi.commonMistakes.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>

      {/* Photo tips */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-neutral-200">
          फोटो के लिए ज़रूरी सुझाव
        </h2>
        <ul className="list-disc list-inside space-y-1 text-neutral-400 text-sm">
          {hindi.photoTips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>

      {/* FAQ section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-200">
          अक्सर पूछे जाने वाले सवाल
        </h2>
        {hindi.faqQuestions.map((faq, i) => (
          <div key={i} className="bg-neutral-900 rounded-xl p-4">
            <h3 className="text-neutral-200 font-medium text-sm">
              {faq.question}
            </h3>
            <p className="text-neutral-400 text-sm mt-2">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Link to English version */}
      <div className="text-center">
        <a href={`/${slug}`} className="text-yellow-400 hover:underline text-sm">
          View in English →
        </a>
      </div>
    </div>
  );
}
