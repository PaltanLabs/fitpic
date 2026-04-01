export default function TrustBadge() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-neutral-400">
      <span className="flex items-center gap-1">
        <span className="text-emerald-400">&#x2713;</span>
        Photos never leave your device
      </span>
      <span className="flex items-center gap-1">
        <span className="text-emerald-400">&#x2713;</span>
        Free — no signup, no limits
      </span>
      <span className="flex items-center gap-1">
        <span className="text-emerald-400">&#x2713;</span>
        150+ exam presets
      </span>
    </div>
  );
}
