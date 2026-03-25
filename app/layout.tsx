import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, GA_ID } from "@/lib/constants";
import Script from "next/script";
import Link from "next/link";
import { PostHogProvider } from "@/components/PostHogProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fitpic.in"),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} - Free Govt Exam Photo & Signature Resizer`,
  },
  description:
    "Free online photo and signature resizer for Indian government exams. SSC, UPSC, IBPS, Railway, NEET, JEE, PAN, Aadhaar, Passport. 100% browser-based, private.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  manifest: "/manifest.json",
  verification: {
    google: "VbDzqbHjZ2pyEsJdRHOOnpvtQy4nRCZl9jSWI7n5MVA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-neutral-950 text-neutral-200 antialiased">
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
        <PostHogProvider>
          <header className="border-b border-neutral-800">
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/" className="font-bold text-yellow-400 text-lg">
                {SITE_NAME}
              </Link>
              <nav className="flex gap-4 text-sm text-neutral-400">
                <Link href="/photo-resizer" className="hover:text-neutral-200">Photo</Link>
                <Link href="/signature-resizer" className="hover:text-neutral-200">Signature</Link>
                <Link href="/category/ssc" className="hover:text-neutral-200 hidden sm:inline">SSC</Link>
                <Link href="/category/banking" className="hover:text-neutral-200 hidden sm:inline">Banking</Link>
                <Link href="/category/state-psc" className="hover:text-neutral-200 hidden sm:inline">State PSC</Link>
                <Link href="/blog" className="hover:text-neutral-200">Blog</Link>
              </nav>
            </div>
          </header>

          <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>

          <footer className="border-t border-neutral-800 mt-12">
            <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
                <div className="space-y-2">
                  <h4 className="text-neutral-300 font-medium">Tools</h4>
                  <div className="space-y-1">
                    <Link href="/photo-resizer" className="block text-neutral-500 hover:text-neutral-300">Photo Resizer</Link>
                    <Link href="/signature-resizer" className="block text-neutral-500 hover:text-neutral-300">Signature Resizer</Link>
                    <Link href="/photo-signature-joiner" className="block text-neutral-500 hover:text-neutral-300">Photo + Signature Joiner</Link>
                    <Link href="/name-date-stamp" className="block text-neutral-500 hover:text-neutral-300">Name & Date Stamp</Link>
                    <Link href="/photo-validator" className="block text-neutral-500 hover:text-neutral-300">Photo Validator</Link>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-neutral-300 font-medium">Exams</h4>
                  <div className="space-y-1">
                    <Link href="/category/ssc" className="block text-neutral-500 hover:text-neutral-300">SSC</Link>
                    <Link href="/category/upsc" className="block text-neutral-500 hover:text-neutral-300">UPSC</Link>
                    <Link href="/category/banking" className="block text-neutral-500 hover:text-neutral-300">Banking</Link>
                    <Link href="/category/state-psc" className="block text-neutral-500 hover:text-neutral-300">State PSC</Link>
                    <Link href="/category/police" className="block text-neutral-500 hover:text-neutral-300">Police</Link>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-neutral-300 font-medium">Resources</h4>
                  <div className="space-y-1">
                    <Link href="/blog" className="block text-neutral-500 hover:text-neutral-300">Blog</Link>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-neutral-300 font-medium">Company</h4>
                  <div className="space-y-1">
                    <Link href="/about" className="block text-neutral-500 hover:text-neutral-300">About</Link>
                    <Link href="/privacy-policy" className="block text-neutral-500 hover:text-neutral-300">Privacy Policy</Link>
                  </div>
                </div>
              </div>
              <div className="text-center text-neutral-600 text-xs space-y-2 pt-4 border-t border-neutral-800">
                <p>All processing happens in your browser. We never see or store your photos.</p>
                <p>&copy; {new Date().getFullYear()} {SITE_NAME}</p>
              </div>
            </div>
          </footer>
        </PostHogProvider>
      </body>
    </html>
  );
}
