"use client";

const FEATURES = [
  {
    title: "Exact Dimensions",
    desc: "Crop and resize to the exact pixel specifications required by every exam board.",
    icon: (
      <svg className="feature-icon w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    ),
    color: "text-blue-400",
    glow: "group-hover:shadow-[0_0_20px_rgba(96,165,250,0.1)]",
  },
  {
    title: "Smart Compression",
    desc: "Reduces file size to the target KB range without making your photo blurry.",
    icon: (
      <svg className="feature-icon w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
    color: "text-purple-400",
    glow: "group-hover:shadow-[0_0_20px_rgba(192,132,252,0.1)]",
  },
  {
    title: "100% Private",
    desc: "All processing happens in your browser. Your photos never leave your device.",
    icon: (
      <svg className="feature-icon w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    color: "text-emerald-400",
    glow: "group-hover:shadow-[0_0_20px_rgba(52,211,153,0.1)]",
  },
  {
    title: "Instant Results",
    desc: "No waiting, no queues. Get your processed image in milliseconds, ready to upload.",
    icon: (
      <svg className="feature-icon w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    color: "text-yellow-400",
    glow: "group-hover:shadow-[0_0_20px_rgba(250,204,21,0.1)]",
  },
  {
    title: "Mobile Friendly",
    desc: "Works perfectly on your phone. Take a selfie and convert it to a passport photo instantly.",
    icon: (
      <svg className="feature-icon w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    color: "text-cyan-400",
    glow: "group-hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]",
  },
  {
    title: "Free Forever",
    desc: "No hidden costs, no watermarks, no sign-up required. Just a helpful tool for students.",
    icon: (
      <svg className="feature-icon w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    color: "text-rose-400",
    glow: "group-hover:shadow-[0_0_20px_rgba(251,113,133,0.1)]",
  },
];

export default function FeatureGrid() {
  return (
    <section data-animate="fade-up">
      <h2 className="text-2xl font-bold text-neutral-100 mb-2">
        Everything You Need
      </h2>
      <p className="text-neutral-500 text-sm mb-8">
        Don&apos;t let a simple photo rejection ruin your year of preparation.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((feat, i) => (
          <div
            key={feat.title}
            data-animate="fade-up"
            data-delay={String(i + 1)}
            className={`feature-card group glass-card rounded-2xl p-5 transition-all ${feat.glow}`}
          >
            <div className={`${feat.color} mb-3`}>{feat.icon}</div>
            <h3 className="text-neutral-200 font-semibold text-sm mb-1">
              {feat.title}
            </h3>
            <p className="text-neutral-500 text-xs leading-relaxed">
              {feat.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
