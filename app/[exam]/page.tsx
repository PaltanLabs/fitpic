import { PRESETS, getPresetSlug, type ExamPreset } from "@/lib/presets";
import {
  generatePresetMetadata,
  generateJsonLd,
  generateFaqJsonLd,
  generateHowToJsonLd,
  generateBreadcrumbJsonLd,
  getTypeLabel,
} from "@/components/SEOHead";
import type { Metadata } from "next";
import ExamToolClient from "./ExamToolClient";
import { EXAM_CONTENT } from "@/lib/exam-content";
import { HINDI_EXAM_CONTENT } from "@/lib/hindi-content";

// Only allow precomputed exam slugs — prevents this route from
// catching URLs meant for other static routes (e.g. /background-remover)
export const dynamicParams = false;

export function generateStaticParams() {
  return PRESETS.filter((p) => p.id !== "custom").map((p) => ({
    exam: getPresetSlug(p),
  }));
}

function getPresetFromSlug(slug: string): ExamPreset | undefined {
  return PRESETS.find((p) => getPresetSlug(p) === slug);
}

export async function generateMetadata({
  params,
}: {
  params: { exam: string };
}): Promise<Metadata> {
  const preset = getPresetFromSlug(params.exam);
  if (!preset) return { title: "Not Found" };
  const base = generatePresetMetadata(preset);
  const hasHindi = HINDI_EXAM_CONTENT.some((h) => h.examSlug === params.exam);
  const metadata: Metadata = {
    ...base,
    alternates: {
      canonical: base.alternates?.canonical,
      languages: hasHindi ? { hi: `/hi/${params.exam}` } : undefined,
    },
  };
  return metadata;
}

export default function ExamPage({ params }: { params: { exam: string } }) {
  const preset = getPresetFromSlug(params.exam);

  if (!preset) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-neutral-300">Preset Not Found</h1>
        <p className="text-neutral-500 mt-2">
          <a href="/" className="text-yellow-400 hover:underline">
            Go back home
          </a>
        </p>
      </div>
    );
  }

  const typeLabel = getTypeLabel(preset.type);
  const slug = getPresetSlug(preset);
  const jsonLd = generateJsonLd(preset);
  const faqJsonLd = generateFaqJsonLd(preset);
  const howToJsonLd = generateHowToJsonLd(preset);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(preset, slug);
  const parentPath = preset.type === "signature" ? "/signature-resizer" : "/photo-resizer";
  const parentName = preset.type === "signature" ? "Signature Resizer" : "Photo Resizer";

  return (
    <div className="space-y-8">
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb navigation */}
      <nav className="text-xs text-neutral-500">
        <a href="/" className="hover:text-neutral-300">Home</a>
        <span className="mx-1">&gt;</span>
        <a href={parentPath} className="hover:text-neutral-300">{parentName}</a>
        <span className="mx-1">&gt;</span>
        <span className="text-neutral-400">{preset.exam} {typeLabel} Resizer</span>
      </nav>

      {/* SEO heading */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">
          {preset.exam} {typeLabel} Resizer — Free Online Tool
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Free online {preset.exam} {typeLabel.toLowerCase()} resizer. Automatically resize your{" "}
          {typeLabel.toLowerCase()} to {preset.width}x{preset.height} pixels and compress to{" "}
          {preset.minKB}-{preset.maxKB}KB in {preset.format.toUpperCase()} format.
          {preset.bgColor && " White background applied automatically."}
          {preset.requiresDateStamp && " Name and date stamp supported."}
          {" "}Works on mobile. No signup required. 100% browser-based — we never see your photos.
        </p>
      </div>

      {/* The actual tool */}
      <ExamToolClient presetId={preset.id} />

      {/* Exam-specific content */}
      {EXAM_CONTENT[preset.exam] && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-200">
              About {preset.exam}
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {EXAM_CONTENT[preset.exam].about}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-200">
              How to Upload Your {typeLabel} for {preset.exam}
            </h2>
            <ol className="list-decimal list-inside space-y-1 text-neutral-400 text-sm">
              {EXAM_CONTENT[preset.exam].uploadSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-200">
              Common {typeLabel} Mistakes to Avoid
            </h2>
            <ul className="list-disc list-inside space-y-1 text-neutral-400 text-sm">
              {EXAM_CONTENT[preset.exam].commonMistakes.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>

          {preset.type === "photo" && (
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-neutral-200">
                Tips for {preset.exam} {typeLabel}
              </h2>
              <ul className="list-disc list-inside space-y-1 text-neutral-400 text-sm">
                {EXAM_CONTENT[preset.exam].photoTips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* FAQ section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-200">
          Frequently Asked Questions
        </h2>
        {faqJsonLd.mainEntity.map((faq: { name: string; acceptedAnswer: { text: string } }, i: number) => (
          <div key={i} className="bg-neutral-900 rounded-xl p-4">
            <h3 className="text-neutral-200 font-medium text-sm">
              {faq.name}
            </h3>
            <p className="text-neutral-400 text-sm mt-2">
              {faq.acceptedAnswer.text}
            </p>
          </div>
        ))}
      </div>

      {/* Cross-link: photo ↔ signature for same exam */}
      {(() => {
        const counterpartType = preset.type === "photo" ? "signature" : preset.type === "signature" ? "photo" : null;
        const counterpart = counterpartType
          ? PRESETS.find((p) => p.exam === preset.exam && p.type === counterpartType)
          : null;
        return counterpart ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <p className="text-neutral-300 text-sm">
              {preset.type === "photo" ? "Need to resize your signature too?" : "Need to resize your photo too?"}{" "}
              <a href={`/${getPresetSlug(counterpart)}`} className="text-yellow-400 hover:underline font-medium">
                {counterpart.exam} {counterpartType === "photo" ? "Photo" : "Signature"} Resizer →
              </a>
            </p>
          </div>
        ) : null;
      })()}

      {/* Related links — same category first */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-neutral-300">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {PRESETS
            .filter((p) => p.id !== preset.id && p.id !== "custom")
            .sort((a, b) => {
              if (a.category === preset.category && b.category !== preset.category) return -1;
              if (b.category === preset.category && a.category !== preset.category) return 1;
              return 0;
            })
            .slice(0, 10)
            .map((p) => (
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
