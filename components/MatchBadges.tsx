"use client";

import { useLanguage } from "@/lib/LanguageContext";

export function ReasonList({ reasons }: { reasons: string[] }) {
  const { t } = useLanguage();
  if (reasons.length === 0) return null;
  return (
    <div>
      <p className="mb-2 section-label text-[10px] text-brand-500">{t.whyMatched}</p>
      <ul className="space-y-1.5">
        {reasons.map((r) => (
          <li key={r} className="flex items-start gap-2 text-base text-brand-800">
            <span aria-hidden className="mt-0.5 text-brand-400">◆</span>
            <span>{(t.reasonMap as Record<string, string>)[r] ?? r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WarningList({ warnings }: { warnings: string[] }) {
  const { t } = useLanguage();
  if (warnings.length === 0) return null;
  return (
    <div>
      <p className="mb-2 section-label text-[10px] text-amber-600">{t.possibleConcerns}</p>
      <ul className="space-y-1.5">
        {warnings.map((w) => (
          <li key={w} className="flex items-start gap-2 text-base text-amber-800">
            <span aria-hidden className="mt-0.5">!</span>
            <span>{(t.warningMap as Record<string, string>)[w] ?? w}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ReliabilityChip({ level }: { level: "High" | "Medium" | "Low" }) {
  const { t } = useLanguage();
  const styles =
    level === "High"
      ? "bg-green-100 text-green-800"
      : level === "Medium"
      ? "bg-amber-100 text-amber-800"
      : "bg-rose-100 text-rose-800";
  return <span className={`chip text-xs ${styles}`}>{t.reliabilityPrefix} {level}</span>;
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="chip bg-brand-100 text-brand-700 text-xs">
      {children}
    </span>
  );
}
