export function ReasonList({ reasons }: { reasons: string[] }) {
  if (reasons.length === 0) return null;
  return (
    <div>
      <p className="mb-1 text-sm font-semibold text-brand-700">Why this matched</p>
      <ul className="space-y-1">
        {reasons.map((r) => (
          <li key={r} className="flex items-start gap-2 text-sm text-brand-800">
            <span aria-hidden className="mt-0.5 text-brand-500">
              ✓
            </span>
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WarningList({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) return null;
  return (
    <div>
      <p className="mb-1 text-sm font-semibold text-amber-700">Possible concerns</p>
      <ul className="space-y-1">
        {warnings.map((w) => (
          <li key={w} className="flex items-start gap-2 text-sm text-amber-800">
            <span aria-hidden className="mt-0.5">
              !
            </span>
            <span>{w}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ReliabilityChip({ level }: { level: "High" | "Medium" | "Low" }) {
  const styles =
    level === "High"
      ? "bg-emerald-100 text-emerald-800"
      : level === "Medium"
      ? "bg-amber-100 text-amber-800"
      : "bg-rose-100 text-rose-800";
  return <span className={`chip ${styles}`}>Reliability: {level}</span>;
}

export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="chip bg-brand-50 text-brand-700">{children}</span>;
}
