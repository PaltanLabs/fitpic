import { type ExamPreset } from "@/lib/presets";
import { getPresetSlug } from "@/lib/presets";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export function getTypeLabel(type: ExamPreset["type"]): string {
  if (type === "photo") return "Photo";
  if (type === "thumb") return "Thumb Impression";
  return "Signature";
}

export function generatePresetMetadata(preset: ExamPreset) {
  const typeLabel = getTypeLabel(preset.type);
  const slug = getPresetSlug(preset);
  const title = `${preset.exam} ${typeLabel} Resizer - Resize to ${preset.maxKB}KB Free Online`;
  const description = `Free ${preset.exam} ${typeLabel.toLowerCase()} resizer. Resize to ${preset.width}x${preset.height}px, ${preset.minKB}-${preset.maxKB}KB. ${preset.bgColor ? "White background." : ""} Works on mobile. No signup.`;

  return {
    title,
    description,
    keywords: preset.searchKeywords.join(", "),
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title,
      description,
      type: "website" as const,
      siteName: SITE_NAME,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
  };
}

export function generateJsonLd(preset: ExamPreset) {
  const typeLabel = getTypeLabel(preset.type);
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${preset.exam} ${typeLabel} Resizer`,
    description: `Free online tool to resize ${typeLabel.toLowerCase()}s for ${preset.exam}. Auto-compress to ${preset.minKB}-${preset.maxKB}KB, ${preset.width}x${preset.height}px.`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    browserRequirements: "Any modern browser",
  };
}

export function generateFaqJsonLd(preset: ExamPreset) {
  const typeLabel = getTypeLabel(preset.type).toLowerCase();
  const faqs = [
    {
      question: `What is the ${preset.exam} ${typeLabel} size requirement?`,
      answer: `${preset.exam} requires ${typeLabel}s to be ${preset.width}x${preset.height} pixels, between ${preset.minKB}-${preset.maxKB}KB in ${preset.format.toUpperCase()} format.${preset.bgColor ? " White background is required." : ""}`,
    },
    {
      question: `How do I resize my ${typeLabel} for ${preset.exam}?`,
      answer: `Upload your ${typeLabel} to our free tool. It will automatically resize to ${preset.width}x${preset.height}px and compress to ${preset.minKB}-${preset.maxKB}KB. Download and upload directly to the ${preset.exam} form.`,
    },
    {
      question: `Is this tool free?`,
      answer: `Yes, completely free. No signup, no watermark, no limits. Your images are processed in your browser and never uploaded to any server.`,
    },
    {
      question: `Does it work on mobile?`,
      answer: `Yes, the tool works on all devices including Android and iPhone. You can even take a photo directly from your camera.`,
    },
    {
      question: `Is my photo safe?`,
      answer: `Absolutely. All processing happens locally in your browser. We never see, store, or upload your photos. Your privacy is guaranteed.`,
    },
  ];

  return {
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
}

export function generateHowToJsonLd(preset: ExamPreset) {
  const typeLabel = getTypeLabel(preset.type).toLowerCase();
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Resize Your ${typeLabel} for ${preset.exam}`,
    description: `Step-by-step guide to resize your ${typeLabel} to ${preset.width}x${preset.height}px, ${preset.minKB}-${preset.maxKB}KB for ${preset.exam}.`,
    step: [
      {
        "@type": "HowToStep",
        name: `Select ${preset.exam}`,
        text: `Open the ${preset.exam} ${typeLabel} resizer. The correct dimensions (${preset.width}x${preset.height}px) and file size limits (${preset.minKB}-${preset.maxKB}KB) are pre-configured.`,
      },
      {
        "@type": "HowToStep",
        name: `Upload your ${typeLabel}`,
        text: `Click "Upload" or drag and drop your ${typeLabel}. Works with JPG, PNG, WebP, and HEIC formats.`,
      },
      {
        "@type": "HowToStep",
        name: "Download the resized file",
        text: `Your ${typeLabel} is automatically resized to ${preset.width}x${preset.height}px and compressed to fit within ${preset.minKB}-${preset.maxKB}KB. Click "Download" to save.`,
      },
    ],
    tool: {
      "@type": "HowToTool",
      name: "FitPic Online Resizer",
    },
    totalTime: "PT1M",
  };
}

export function generateBreadcrumbJsonLd(preset: ExamPreset, slug: string) {
  const typeLabel = getTypeLabel(preset.type);
  const parentPath = preset.type === "signature" ? "/signature-resizer" : "/photo-resizer";
  const parentName = preset.type === "signature" ? "Signature Resizer" : "Photo Resizer";

  return {
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
        name: parentName,
        item: `${SITE_URL}${parentPath}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${preset.exam} ${typeLabel} Resizer`,
      },
    ],
  };
}
