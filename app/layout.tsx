import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, GA_ID } from "@/lib/constants";
import Script from "next/script";
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
              <a href="/" className="font-bold text-yellow-400 text-lg">
                {SITE_NAME}
              </a>
              <nav className="flex gap-4 text-sm text-neutral-400">
                <a href="/photo-resizer" className="hover:text-neutral-200">Photo</a>
                <a href="/signature-resizer" className="hover:text-neutral-200">Signature</a>
                <a href="/category/ssc" className="hover:text-neutral-200 hidden sm:inline">SSC</a>
                <a href="/category/banking" className="hover:text-neutral-200 hidden sm:inline">Banking</a>
                <a href="/category/state-psc" className="hover:text-neutral-200 hidden sm:inline">State PSC</a>
                <a href="/blog" className="hover:text-neutral-200">Blog</a>
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
                    <a href="/photo-resizer" className="block text-neutral-500 hover:text-neutral-300">Photo Resizer</a>
                    <a href="/signature-resizer" className="block text-neutral-500 hover:text-neutral-300">Signature Resizer</a>
                    <a href="/photo-signature-joiner" className="block text-neutral-500 hover:text-neutral-300">Photo + Signature Joiner</a>
                    <a href="/name-date-stamp" className="block text-neutral-500 hover:text-neutral-300">Name & Date Stamp</a>
                    <a href="/photo-validator" className="block text-neutral-500 hover:text-neutral-300">Photo Validator</a>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-neutral-300 font-medium">Exams</h4>
                  <div className="space-y-1">
                    <a href="/category/ssc" className="block text-neutral-500 hover:text-neutral-300">SSC</a>
                    <a href="/category/upsc" className="block text-neutral-500 hover:text-neutral-300">UPSC</a>
                    <a href="/category/banking" className="block text-neutral-500 hover:text-neutral-300">Banking</a>
                    <a href="/category/state-psc" className="block text-neutral-500 hover:text-neutral-300">State PSC</a>
                    <a href="/category/police" className="block text-neutral-500 hover:text-neutral-300">Police</a>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-neutral-300 font-medium">Resources</h4>
                  <div className="space-y-1">
                    <a href="/blog" className="block text-neutral-500 hover:text-neutral-300">Blog</a>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-neutral-300 font-medium">Company</h4>
                  <div className="space-y-1">
                    <a href="/about" className="block text-neutral-500 hover:text-neutral-300">About</a>
                    <a href="/privacy-policy" className="block text-neutral-500 hover:text-neutral-300">Privacy Policy</a>
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
