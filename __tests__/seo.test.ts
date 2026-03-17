import robots from "../app/robots";
import { getTypeLabel, generatePresetMetadata, generateBreadcrumbJsonLd } from "../components/SEOHead";
import { PRESETS } from "../lib/presets";

describe("robots.ts", () => {
  test("allows all paths by default", () => {
    const config = robots();
    expect(config.rules).toEqual(
      expect.objectContaining({ userAgent: "*", allow: "/" })
    );
  });

  test("disallows /ingest/ path", () => {
    const config = robots();
    expect(config.rules).toEqual(
      expect.objectContaining({ disallow: "/ingest/" })
    );
  });

  test("includes sitemap URL", () => {
    const config = robots();
    expect(config.sitemap).toContain("/sitemap.xml");
  });
});

describe("getTypeLabel", () => {
  test("returns Photo for photo type", () => {
    expect(getTypeLabel("photo")).toBe("Photo");
  });

  test("returns Signature for signature type", () => {
    expect(getTypeLabel("signature")).toBe("Signature");
  });

  test("returns Thumb Impression for thumb type", () => {
    expect(getTypeLabel("thumb")).toBe("Thumb Impression");
  });
});

describe("generatePresetMetadata", () => {
  test("includes alternates.canonical for a preset", () => {
    const sscPhoto = PRESETS.find((p) => p.id === "ssc-cgl-photo")!;
    const meta = generatePresetMetadata(sscPhoto);
    expect(meta.alternates?.canonical).toBeDefined();
  });

  test("includes twitter card metadata", () => {
    const sscPhoto = PRESETS.find((p) => p.id === "ssc-cgl-photo")!;
    const meta = generatePresetMetadata(sscPhoto);
    expect(meta.twitter).toBeDefined();
    expect(meta.twitter?.card).toBe("summary_large_image");
  });
});

describe("generateBreadcrumbJsonLd", () => {
  test("generates 3 items for a photo preset", () => {
    const sscPhoto = PRESETS.find((p) => p.id === "ssc-cgl-photo")!;
    const breadcrumb = generateBreadcrumbJsonLd(sscPhoto, "ssc-cgl-photo-resizer");
    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(breadcrumb.itemListElement).toHaveLength(3);
    expect(breadcrumb.itemListElement[1].name).toBe("Photo Resizer");
  });

  test("uses Photo Resizer as parent for thumb type", () => {
    const thumb = PRESETS.find((p) => p.id === "ibps-sbi-thumb")!;
    const breadcrumb = generateBreadcrumbJsonLd(thumb, "ibps-sbi-thumb-resizer");
    expect(breadcrumb.itemListElement[1].name).toBe("Photo Resizer");
    expect(breadcrumb.itemListElement[1].item).toContain("/photo-resizer");
  });

  test("uses Signature Resizer as parent for signature type", () => {
    const sig = PRESETS.find((p) => p.id === "ssc-signature")!;
    const breadcrumb = generateBreadcrumbJsonLd(sig, "ssc-signature-resizer");
    expect(breadcrumb.itemListElement[1].name).toBe("Signature Resizer");
  });
});
