import { Metadata } from "next";
import Link from "next/link";
import { PRESETS, getPresetSlug, getPresetsByCategory } from "@/lib/presets";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

import { CATEGORY_SLUGS } from "@/lib/category-slugs";

function getCategorySlug(categoryName: string): string {
  const entry = Object.entries(CATEGORY_SLUGS).find(([, v]) => v === categoryName);
  return entry ? entry[0] : categoryName.toLowerCase().replace(/\//g, "-");
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_SLUGS).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const categoryName = CATEGORY_SLUGS[params.slug];
  if (!categoryName) {
    return { title: "Category Not Found" };
  }

  const title = `${categoryName} Photo & Signature Resizer - Free Online Tool`;
  const description = `Resize photos and signatures for ${categoryName} exams. Free online tool with exact dimensions, file size limits, and format requirements. 100% browser-based.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/category/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/category/${params.slug}`,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = CATEGORY_SLUGS[params.slug];

  if (!categoryName) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-bold text-neutral-200">Category Not Found</h1>
        <p className="text-neutral-500 mt-2">
          The category you are looking for does not exist.
        </p>
        <Link href="/" className="text-yellow-400 hover:underline mt-4 inline-block">
          Go back home
        </Link>
      </div>
    );
  }

  const presets = getPresetsByCategory(categoryName).filter((p) => p.id !== "custom");
  const otherCategories = Object.entries(CATEGORY_SLUGS).filter(
    ([slug]) => slug !== params.slug
  );

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-neutral-500">
        <Link href="/" className="hover:text-neutral-300">
          Home
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="text-neutral-300">{categoryName} Exams</span>
      </nav>

      {/* Hero */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-neutral-100">
          {categoryName} Photo &amp; Signature Resizer
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Free online tool to resize photos and signatures for {categoryName} exam
          applications. Get exact pixel dimensions, file size compression, and correct
          format — all processed in your browser with zero uploads.
        </p>
      </div>

      {/* Presets Table */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-800">
          <h2 className="font-semibold text-neutral-200 text-sm">
            {categoryName} Exam Presets ({presets.length})
          </h2>
        </div>
        <div className="divide-y divide-neutral-800">
          {presets.map((preset) => (
            <Link
              key={preset.id}
              href={`/${getPresetSlug(preset)}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-neutral-800/50 transition-colors"
            >
              <div>
                <span className="text-yellow-400 text-sm font-medium">
                  {preset.name}
                </span>
                <p className="text-neutral-500 text-xs mt-0.5">
                  {preset.width}x{preset.height}px &middot; {preset.minKB}-{preset.maxKB}KB &middot;{" "}
                  {preset.format.toUpperCase()}
                </p>
              </div>
              <span className="text-neutral-600 text-xs">Resize &rarr;</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Other Categories */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-neutral-300">Other Categories</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {otherCategories.map(([slug, name]) => (
            <Link
              key={slug}
              href={`/category/${slug}`}
              className="bg-neutral-900 rounded-lg border border-neutral-800 px-4 py-3 hover:bg-neutral-800/50 transition-colors"
            >
              <span className="text-yellow-400 text-sm font-medium">{name}</span>
              <p className="text-neutral-500 text-xs mt-0.5">
                {getPresetsByCategory(name).filter((p) => p.id !== "custom").length} presets
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
