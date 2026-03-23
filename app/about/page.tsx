import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `About ${SITE_NAME} — Free Photo & Signature Resizer for Govt Exams`,
  description: "FitPic is a free, privacy-first photo and signature resizer for Indian government exam applications. 100% browser-based, no signup required.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-100">About {SITE_NAME}</h1>

      <div className="space-y-4 text-neutral-400 text-sm leading-relaxed">
        <p>
          FitPic is a free online tool that helps Indian government exam candidates resize their photos and signatures to exact specifications. Whether you are applying for SSC CGL, UPSC, IBPS, NEET, JEE, State PSC, or any other exam — FitPic automatically resizes and compresses your image to the required dimensions and file size.
        </p>

        <p>
          Every year, lakhs of candidates face form rejections because their photo or signature does not meet the exact size requirements. Different exams have different rules — SSC needs 100x120px at 20-50KB, UPSC needs 350x350px, IBPS needs 200x230px. FitPic knows all these requirements and handles them automatically.
        </p>

        <h2 className="text-lg font-bold text-neutral-200 pt-2">Privacy First</h2>
        <p>
          All image processing happens entirely in your browser. Your photos are never uploaded to any server. We literally cannot see your images — the processing uses JavaScript running on your device. When you close the tab, your images are gone.
        </p>

        <h2 className="text-lg font-bold text-neutral-200 pt-2">150+ Exam Presets</h2>
        <p>
          FitPic supports 150+ exam formats across SSC, UPSC, Banking, Railway, Medical, Engineering, State PSC, Police, Judiciary, ID, and Passport categories. Each preset knows the exact pixel dimensions, file size range, format, and background color requirements.
        </p>

        <h2 className="text-lg font-bold text-neutral-200 pt-2">Built by PaltanLabs</h2>
        <p>
          FitPic is built and maintained by <a href="https://github.com/PaltanLabs" className="text-yellow-400 hover:underline" target="_blank" rel="noopener noreferrer">PaltanLabs</a>. The source code is available on <a href="https://github.com/PaltanLabs/fitpic" className="text-yellow-400 hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a>.
        </p>
      </div>
    </div>
  );
}
