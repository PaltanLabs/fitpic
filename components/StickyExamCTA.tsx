"use client";

import { useEffect, useState } from "react";

interface Props {
  examName: string;
  targetId: string;
}

export default function StickyExamCTA({ examName, targetId }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-sm border-t border-neutral-800 py-3 px-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        <p className="text-neutral-300 text-sm truncate">
          {examName} Resizer
        </p>
        <button
          onClick={() => {
            document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          className="shrink-0 px-5 py-2 rounded-xl bg-yellow-400 text-neutral-900 font-bold text-sm hover:bg-yellow-300 transition-colors"
        >
          Resize Now
        </button>
      </div>
    </div>
  );
}
