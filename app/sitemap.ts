import { MetadataRoute } from "next";
import { PRESETS, getPresetSlug } from "@/lib/presets";
import { SITE_URL } from "@/lib/constants";
import { CATEGORY_SLUGS } from "@/lib/category-slugs";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { HINDI_EXAM_CONTENT } from "@/lib/hindi-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${SITE_URL}/photo-resizer`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/signature-resizer`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/photo-signature-joiner`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/name-date-stamp`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/photo-validator`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/application-set`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/pdf-compressor`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/background-remover`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
  ];

  const categoryRoutes = Object.keys(CATEGORY_SLUGS).map((slug) => ({
    url: `${SITE_URL}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const examRoutes = PRESETS.filter((p) => p.id !== "custom").map((p) => ({
    url: `${SITE_URL}/${getPresetSlug(p)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogRoutes = [
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    ...BLOG_POSTS.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];

  const hindiRoutes = HINDI_EXAM_CONTENT.map((h) => ({
    url: `${SITE_URL}/hi/${h.examSlug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticRoutes, ...categoryRoutes, ...blogRoutes, ...hindiRoutes, ...examRoutes];
}
