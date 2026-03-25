import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { PRESETS, getPresetSlug } from "@/lib/presets";
import JoinerClient from "./JoinerClient";

export const metadata: Metadata = {
  title: `Photo + Signature Joiner — Combine for IBPS/SSC/RRB Upload Free`,
  description:
    "Free tool to combine photo and signature into one JPEG for IBPS, SSC, RRB exam uploads. Auto-resize and compress. Works on mobile, no signup.",
  keywords:
    "photo signature joiner, combine photo signature, ibps photo signature, ssc photo signature combine",
  alternates: { canonical: "/photo-signature-joiner" },
  openGraph: {
    title: `Photo + Signature Joiner — Combine for IBPS/SSC/RRB Upload Free | ${SITE_NAME}`,
    description:
      "Free tool to combine photo and signature into one JPEG for IBPS, SSC, RRB exam uploads.",
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `Photo + Signature Joiner | ${SITE_NAME}`,
    description:
      "Free tool to combine photo and signature into one JPEG for IBPS, SSC, RRB exam uploads.",
  },
};

const joinerExamPresets = PRESETS.filter(
  (p) =>
    p.id !== "custom" &&
    (p.category === "Banking" || p.category === "SSC")
);

export default function PhotoSignatureJoinerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Photo + Signature Joiner</h1>
      <p className="text-neutral-400 text-sm">
        Combine a resized photo and cleaned signature into one JPEG.
      </p>
      <div className="bg-amber-400/10 text-amber-300 border border-amber-500/30 rounded-xl p-3 text-xs">
        Note: many portals (including IBPS) require separate uploads for
        photo/signature. Use this only when a combined file is explicitly
        requested.
      </div>

      <JoinerClient />

      {/* Related Exam Tools — server-rendered for SEO */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-neutral-300">
          Related Exam Tools
        </h2>
        <div className="flex flex-wrap gap-2">
          {joinerExamPresets.map((p) => (
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
