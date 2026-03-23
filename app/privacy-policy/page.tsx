import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: "FitPic privacy policy. All photo processing happens in your browser. We never upload, store, or see your photos.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="prose prose-invert prose-sm max-w-none space-y-6">
      <h1 className="text-2xl font-bold text-neutral-100">Privacy Policy</h1>
      <p className="text-neutral-400 text-sm">Last updated: March 2026</p>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-neutral-200">Your Photos Stay on Your Device</h2>
        <p className="text-neutral-400 text-sm leading-relaxed">
          FitPic processes all images entirely in your web browser using client-side JavaScript. Your photos and signatures are never uploaded to any server. We cannot see, access, or store your images. Once you close the browser tab, your images are gone.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-neutral-200">Analytics</h2>
        <p className="text-neutral-400 text-sm leading-relaxed">
          We use Google Analytics 4 and PostHog to understand how visitors use FitPic (page views, button clicks, device types). These services use cookies and collect anonymous usage data. No personal information or image data is sent to analytics services.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-neutral-200">Cookies</h2>
        <p className="text-neutral-400 text-sm leading-relaxed">
          FitPic uses cookies for analytics purposes only. We do not use cookies for advertising, tracking across websites, or storing personal information. You can disable cookies in your browser settings.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-neutral-200">Advertising</h2>
        <p className="text-neutral-400 text-sm leading-relaxed">
          We may display ads through Google AdSense. Google may use cookies to serve ads based on your prior visits. You can opt out of personalized advertising at <a href="https://www.google.com/settings/ads" className="text-yellow-400 hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-neutral-200">Third-Party Services</h2>
        <ul className="list-disc list-inside text-neutral-400 text-sm space-y-1">
          <li>Google Analytics 4 — anonymous usage analytics</li>
          <li>PostHog — product analytics</li>
          <li>Google AdSense — advertising</li>
          <li>Vercel — hosting (no image data is sent to Vercel)</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-neutral-200">Contact</h2>
        <p className="text-neutral-400 text-sm leading-relaxed">
          For privacy-related questions, contact us at <a href="mailto:privacy@fitpic.in" className="text-yellow-400 hover:underline">privacy@fitpic.in</a>.
        </p>
      </section>
    </div>
  );
}
