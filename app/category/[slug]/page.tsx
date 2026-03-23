import { Metadata } from "next";
import Link from "next/link";
import { PRESETS, getPresetSlug, getPresetsByCategory } from "@/lib/presets";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

import { CATEGORY_SLUGS } from "@/lib/category-slugs";

const CATEGORY_CONTENT: Record<string, { intro: string }> = {
  SSC: {
    intro: "The Staff Selection Commission (SSC) conducts exams like CGL, CHSL, GD Constable, and MTS for recruitment to various Group B and Group C posts in Government of India ministries. Each SSC exam has specific photo and signature size requirements that must be met exactly, or your application may be rejected.",
  },
  UPSC: {
    intro: "The Union Public Service Commission (UPSC) conducts the Civil Services Examination (CSE) for IAS, IPS, IFS, and other All India Services. UPSC uses the One Time Registration (OTR) system where candidates upload their photo and signature once for all future applications.",
  },
  Banking: {
    intro: "Banking exams conducted by IBPS, SBI, and RBI require candidates to upload a photo, signature, and sometimes a left thumb impression. Most banking exams follow a standard 200x230px photo and 140x60px signature format, but file size limits vary between exams.",
  },
  Railway: {
    intro: "Railway Recruitment Boards (RRBs) conduct exams for NTPC, Group D, ALP, and other railway posts. RRB exams typically require larger photos and have specific requirements for name and date stamping on the photograph.",
  },
  "Medical/Engineering": {
    intro: "National Testing Agency (NTA) conducts NEET UG for medical admissions and JEE Main for engineering admissions. Both exams follow a postcard-size photo format (3.5cm x 4.5cm) with relatively generous file size limits. GATE, conducted by IITs, has its own photo specifications.",
  },
  "ID/Passport": {
    intro: "Indian identity documents like PAN Card, Aadhaar, and Passport each have strict photo specifications. PAN Card photos must be exactly 132x170px through the NSDL portal, while Passport photos follow international standards at 2x2 inches (413x531px).",
  },
  Postal: {
    intro: "India Post GDS (Gramin Dak Sevak) recruitment requires specific photo and signature uploads through the dedicated India Post GDS portal. The photo must be in 4:5 ratio and the signature in 5:2 ratio.",
  },
  "State PSC": {
    intro: "Each Indian state has its own Public Service Commission that conducts competitive exams for state government posts. Photo requirements vary significantly between states — from WBCS requiring 138x177px to APPSC requiring 200x250px. Always check the specific state PSC requirements before uploading.",
  },
  Police: {
    intro: "State police recruitment boards across India conduct constable, SI, and other recruitment exams. Photo specifications vary by state — Delhi Police uses 100x120px while Rajasthan Police requires larger 350x450px photos. Use the correct preset for your state to avoid rejection.",
  },
  Judiciary: {
    intro: "Judicial service examinations are conducted by various High Courts and State Public Service Commissions for recruitment of judges and court staff. Photo and signature requirements follow standard government exam formats.",
  },
};

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

  const categoryIntro = CATEGORY_CONTENT[categoryName]?.intro;

  return (
    <div className="space-y-8">
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: `${categoryName} Exams` },
            ],
          }),
        }}
      />

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

      {/* Category Intro */}
      {categoryIntro && (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <p className="text-neutral-400 text-sm leading-relaxed">{categoryIntro}</p>
        </div>
      )}

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
