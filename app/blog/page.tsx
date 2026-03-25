import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Blog — Photo Resizing Guides & Exam Tips`,
  description:
    "Guides on exam photo requirements, how to resize photos for government exams, common rejection reasons, and tips for SSC, UPSC, IBPS, NEET, and more.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const sortedPosts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-neutral-100">Blog</h1>
        <p className="text-neutral-400 text-sm">
          Guides on exam photo requirements, resizing tips, and common mistakes
          to avoid.
        </p>
      </div>

      <div className="space-y-4">
        {sortedPosts.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-yellow-400/50 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                {post.category}
              </span>
              <span>{post.date}</span>
            </div>
            <h2 className="text-lg font-bold text-neutral-200">
              {post.title}
            </h2>
            <p className="text-neutral-400 text-sm mt-1">
              {post.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
