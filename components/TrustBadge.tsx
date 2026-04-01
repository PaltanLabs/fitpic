export default function TrustBadge() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-neutral-400">
      <span className="flex items-center gap-1.5">
        <span className="text-emerald-400">&#x2713;</span>
        100% browser-based — photos never leave your device
      </span>
      <span className="hidden sm:inline text-neutral-700">|</span>
      <span className="flex items-center gap-1.5">
        <span className="text-emerald-400">&#x2713;</span>
        Free forever — no signup, no limits
      </span>
      <span className="hidden sm:inline text-neutral-700">|</span>
      <span className="flex items-center gap-1.5">
        <span className="text-emerald-400">&#x2713;</span>
        Used by SSC, UPSC, IBPS exam aspirants
      </span>
    </div>
  );
}
