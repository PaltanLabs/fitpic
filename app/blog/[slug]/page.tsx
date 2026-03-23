import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog-posts";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      siteName: SITE_NAME,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(
    0,
    3
  );

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "FitPic" },
    publisher: { "@type": "Organization", name: "FitPic" },
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
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="space-y-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-neutral-500">
          <a href="/" className="hover:text-neutral-300">
            Home
          </a>
          <span className="mx-1">/</span>
          <a href="/blog" className="hover:text-neutral-300">
            Blog
          </a>
          <span className="mx-1">/</span>
          <span className="text-neutral-400">{post.title}</span>
        </nav>

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
              {post.category}
            </span>
            <span>{post.date}</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-100">{post.title}</h1>
          <p className="text-neutral-400">{post.description}</p>
        </div>

        {/* Content Sections */}
        {post.content.map((section, i) => (
          <section key={i} className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-200">
              {section.heading}
            </h2>

            {section.paragraphs.map((p, j) => (
              <p key={j} className="text-neutral-400 leading-relaxed">
                {p}
              </p>
            ))}

            {section.list && (
              <ul className="list-disc list-inside space-y-2 text-neutral-400 text-sm">
                {section.list.map((item, k) => (
                  <li key={k}>{item}</li>
                ))}
              </ul>
            )}

            {section.table && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-neutral-800 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-neutral-900">
                      {section.table.headers.map((header, h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left text-neutral-300 font-medium border-b border-neutral-800"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, r) => (
                      <tr
                        key={r}
                        className="border-b border-neutral-800 last:border-b-0"
                      >
                        {row.map((cell, c) => (
                          <td
                            key={c}
                            className="px-3 py-2 text-neutral-400"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}

        {/* CTA Box */}
        <div className="p-6 rounded-xl bg-yellow-400/10 border border-yellow-400/30 space-y-4">
          <h3 className="text-lg font-bold text-yellow-400">
            Ready to resize your photo?
          </h3>
          <p className="text-neutral-400 text-sm">
            Use FitPic to resize your photo to exact exam specifications — free,
            instant, and 100% browser-based.
          </p>
          <div className="flex flex-wrap gap-2">
            {post.relatedExamSlugs.map((examSlug) => (
              <a
                key={examSlug}
                href={`/${examSlug}`}
                className="inline-block px-4 py-2 rounded-lg bg-yellow-400 text-neutral-900 font-medium text-sm hover:bg-yellow-300 transition-colors"
              >
                {examSlug
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
                &rarr;
              </a>
            ))}
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-200">
              Related Posts
            </h3>
            <div className="space-y-3">
              {relatedPosts.map((related) => (
                <a
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="block p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-yellow-400/50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                      {related.category}
                    </span>
                    <span>{related.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-300">
                    {related.title}
                  </h4>
                </a>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
