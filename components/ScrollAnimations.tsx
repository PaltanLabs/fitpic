"use client";

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-animate]");

    // Mark elements already in viewport as visible BEFORE enabling animations
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 50) {
        el.classList.add("visible");
      }
    });

    // Now enable animation CSS (elements not yet visible will animate on scroll)
    document.documentElement.classList.add("scroll-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((el) => {
      if (!el.classList.contains("visible")) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
