"use client";

import { MatchResult } from "@/lib/types";
import { matchLabel } from "@/lib/matching";
import { ReasonList, WarningList, ReliabilityChip, Tag } from "./MatchBadges";

export default function ResourceCard({
  result,
  best,
  rank,
  onCreatePlan,
}: {
  result: MatchResult;
  best: number;
  rank: number;
  onCreatePlan?: () => void;
}) {
  const { percent, label } = matchLabel(result, best);
  const isTop = rank === 0;

  function copyScript() {
    const script = `Hi, I'm looking for help in ${
      result.address.includes("Santa Clara") ? "Santa Clara" : "this area"
    }. Do you have space or an appointment available? My situation: I need ${result.type[0].toLowerCase()}.`;
    navigator.clipboard?.writeText(script);
  }

  return (
    <article
      className={`card card-hover space-y-4 ${
        isTop
          ? "ring-2 ring-brand-500/40 shadow-glow"
          : ""
      }`}
    >
      {/* Top row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {isTop && (
              <span className="chip bg-brand-600 text-white">Best match</span>
            )}
            <h3 className="text-lg font-bold text-brand-900">{result.name}</h3>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            {result.description}
          </p>
        </div>

        {/* Match score */}
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-2xl font-extrabold text-brand-700">
            {percent}%
          </span>
          <span className="text-[10px] uppercase tracking-widest text-brand-300">
            match
          </span>
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-brand-100">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tags row */}
      <div className="flex flex-wrap gap-2">
        <Tag>{result.type[0]}</Tag>
        <Tag>{result.distanceMiles} mi away</Tag>
        <Tag>Intake: {result.intakeHours}</Tag>
        <span
          className={`chip ${
            result.openTonight
              ? "bg-emerald-100 text-emerald-800"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {result.openTonight ? "● Open tonight" : "○ Closed tonight"}
        </span>
        <ReliabilityChip level={result.reliability} />
      </div>

      {/* Reasons & warnings */}
      <div className="grid gap-4 rounded-xl bg-brand-50/60 p-4 sm:grid-cols-2">
        <ReasonList reasons={result.reasons} />
        <WarningList warnings={result.warnings} />
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-100 pt-3">
        <div className="flex flex-col gap-0.5">
          <a
            className="text-sm font-bold text-brand-700 hover:underline"
            href={`tel:${result.phone.replace(/[^0-9+]/g, "")}`}
          >
            {result.phone}
          </a>
          <span className="text-xs text-slate-400">{result.address}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {onCreatePlan && (
            <button
              className="btn-primary px-4 py-2 text-sm"
              onClick={onCreatePlan}
            >
              Create Action Plan
            </button>
          )}
          <button className="btn-secondary px-4 py-2 text-sm" onClick={copyScript}>
            Copy Call Script
          </button>
        </div>
      </div>
    </article>
  );
}
