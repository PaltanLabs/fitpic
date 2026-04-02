import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, GA_ID } from "@/lib/constants";
import Script from "next/script";
import Link from "next/link";
import { Inter } from "next/font/google";
import { PostHogProvider } from "@/components/PostHogProvider";
import MobileNav from "@/components/MobileNav";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`min-h-screen bg-surface-1 text-neutral-200 antialiased ${inter.className}`}>
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
          {/* Sticky Glass Header */}
          <header className="header-glass sticky top-0 z-50">
            <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/" className="logo-shimmer font-bold text-lg relative">
                <span className="gradient-text">{SITE_NAME}</span>
              </Link>
              <nav className="hidden sm:flex gap-5 text-sm text-neutral-400">
                <Link href="/photo-resizer" className="nav-link">Photo</Link>
                <Link href="/signature-resizer" className="nav-link">Signature</Link>
                <Link href="/category/ssc" className="nav-link">SSC</Link>
                <Link href="/category/banking" className="nav-link">Banking</Link>
                <Link href="/category/state-psc" className="nav-link">State PSC</Link>
                <Link href="/blog" className="nav-link">Blog</Link>
              </nav>
              <MobileNav />
            </div>
          </header>

          <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>

          {/* Polished Footer */}
          <footer className="border-t border-neutral-800/50 mt-16">
            <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
                <div className="space-y-3">
                  <h4 className="text-neutral-200 font-semibold text-sm">Tools</h4>
                  <div className="space-y-2">
                    <Link href="/photo-resizer" className="block text-neutral-500 hover:text-neutral-300 transition-colors">Photo Resizer</Link>
                    <Link href="/signature-resizer" className="block text-neutral-500 hover:text-neutral-300 transition-colors">Signature Resizer</Link>
                    <Link href="/photo-signature-joiner" className="block text-neutral-500 hover:text-neutral-300 transition-colors">Photo + Signature Joiner</Link>
                    <Link href="/name-date-stamp" className="block text-neutral-500 hover:text-neutral-300 transition-colors">Name & Date Stamp</Link>
                    <Link href="/photo-validator" className="block text-neutral-500 hover:text-neutral-300 transition-colors">Photo Validator</Link>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-neutral-200 font-semibold text-sm">Exams</h4>
                  <div className="space-y-2">
                    <Link href="/category/ssc" className="block text-neutral-500 hover:text-neutral-300 transition-colors">SSC</Link>
                    <Link href="/category/upsc" className="block text-neutral-500 hover:text-neutral-300 transition-colors">UPSC</Link>
                    <Link href="/category/banking" className="block text-neutral-500 hover:text-neutral-300 transition-colors">Banking</Link>
                    <Link href="/category/state-psc" className="block text-neutral-500 hover:text-neutral-300 transition-colors">State PSC</Link>
                    <Link href="/category/police" className="block text-neutral-500 hover:text-neutral-300 transition-colors">Police</Link>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-neutral-200 font-semibold text-sm">Resources</h4>
                  <div className="space-y-2">
                    <Link href="/blog" className="block text-neutral-500 hover:text-neutral-300 transition-colors">Blog</Link>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-neutral-200 font-semibold text-sm">Company</h4>
                  <div className="space-y-2">
                    <Link href="/about" className="block text-neutral-500 hover:text-neutral-300 transition-colors">About</Link>
                    <Link href="/privacy-policy" className="block text-neutral-500 hover:text-neutral-300 transition-colors">Privacy Policy</Link>
                  </div>
                </div>
              </div>

              {/* Privacy strip */}
              <div className="footer-privacy text-center rounded-xl bg-neutral-900/50 border border-emerald-500/10 px-4 py-3">
                <p className="text-emerald-400/80 text-xs flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  All processing happens in your browser. We never see or store your photos.
                </p>
              </div>

              <div className="text-center text-neutral-600 text-xs pt-2">
                <p>&copy; {new Date().getFullYear()} {SITE_NAME}</p>
              </div>
            </div>
          </footer>
        </PostHogProvider>
      </body>
    </html>
  );
}
