import { PRESETS, getPresetSlug, type ExamPreset } from "@/lib/presets";
import {
  generatePresetMetadata,
  generateJsonLd,
  generateFaqJsonLd,
  generateBreadcrumbJsonLd,
  getTypeLabel,
} from "@/components/SEOHead";
import type { Metadata } from "next";
import ExamToolClient from "./ExamToolClient";

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
  return generatePresetMetadata(preset);
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

      {/* Related links */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-neutral-300">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {PRESETS.filter((p) => p.id !== preset.id && p.id !== "custom")
            .slice(0, 6)
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
