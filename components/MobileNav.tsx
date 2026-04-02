"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

const TOOLS = [
  { href: "/photo-resizer", label: "Photo Resizer" },
  { href: "/signature-resizer", label: "Signature Resizer" },
  { href: "/background-remover", label: "Background Remover" },
  { href: "/photo-signature-joiner", label: "Photo + Signature Joiner" },
  { href: "/name-date-stamp", label: "Name & Date Stamp" },
  { href: "/photo-validator", label: "Photo Validator" },
  { href: "/pdf-compressor", label: "PDF Compressor" },
  { href: "/application-set", label: "Application Set" },
];

const EXAMS = [
  { href: "/category/ssc", label: "SSC" },
  { href: "/category/upsc", label: "UPSC" },
  { href: "/category/banking", label: "Banking" },
  { href: "/category/state-psc", label: "State PSC" },
  { href: "/category/police", label: "Police" },
];

function MenuOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-[60] bg-[#0a0a0a] overflow-y-auto"
      style={{ top: 52 }}
    >
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-3 mb-2">Tools</h3>
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              onClick={onClose}
              className="block px-3 py-2.5 rounded-xl text-sm text-neutral-300 hover:bg-neutral-800/50 hover:text-yellow-400 transition-colors"
            >
              {t.label}
            </Link>
          ))}
        </div>

        <div className="border-t border-neutral-800" />

        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-3 mb-2">Exams</h3>
          {EXAMS.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              onClick={onClose}
              className="block px-3 py-2.5 rounded-xl text-sm text-neutral-300 hover:bg-neutral-800/50 hover:text-yellow-400 transition-colors"
            >
              {e.label}
            </Link>
          ))}
        </div>

        <div className="border-t border-neutral-800" />

        <div className="space-y-1">
          <Link
            href="/blog"
            onClick={onClose}
            className="block px-3 py-2.5 rounded-xl text-sm text-neutral-300 hover:bg-neutral-800/50 hover:text-yellow-400 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/hi/ssc-cgl-photo-resizer"
            onClick={onClose}
            className="block px-3 py-2.5 rounded-xl text-sm text-neutral-300 hover:bg-neutral-800/50 hover:text-yellow-400 transition-colors"
          >
            हिंदी (Hindi)
          </Link>
          <Link
            href="/about"
            onClick={onClose}
            className="block px-3 py-2.5 rounded-xl text-sm text-neutral-300 hover:bg-neutral-800/50 hover:text-yellow-400 transition-colors"
          >
            About
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 transition-colors"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {open && mounted && createPortal(
        <MenuOverlay onClose={() => setOpen(false)} />,
        document.body
      )}
    </div>
  );
}
