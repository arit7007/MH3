"use client";

import { MatchResult } from "@/lib/types";
import { matchLabel } from "@/lib/matching";
import {
  ReasonList,
  WarningList,
  ReliabilityChip,
  Tag,
} from "./MatchBadges";

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
    const script = `Hi, I'm looking for help in ${result.address.includes("Santa Clara") ? "Santa Clara" : "this area"}. Do you have space or an appointment available? My situation: I need ${result.type[0].toLowerCase()}.`;
    navigator.clipboard?.writeText(script);
  }

  return (
    <article
      className={`card ${isTop ? "ring-2 ring-brand-400" : ""} space-y-4`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-brand-900">{result.name}</h3>
            <span
              className={`chip ${
                isTop ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-800"
              }`}
            >
              {label}
            </span>
          </div>
          <p className="mt-1 text-sm text-brand-700">{result.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-brand-700">{percent}%</div>
          <div className="text-xs text-brand-500">match score</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm text-brand-700">
        <Tag>{result.type[0]}</Tag>
        <Tag>{result.distanceMiles} mi away</Tag>
        <Tag>Intake: {result.intakeHours}</Tag>
        <span
          className={`chip ${
            result.openTonight
              ? "bg-emerald-100 text-emerald-800"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {result.openTonight ? "Open tonight" : "Not open tonight"}
        </span>
        <ReliabilityChip level={result.reliability} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ReasonList reasons={result.reasons} />
        <WarningList warnings={result.warnings} />
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-brand-50 pt-3 text-sm">
        <a className="font-semibold text-brand-700 hover:underline" href={`tel:${result.phone.replace(/[^0-9+]/g, "")}`}>
          {result.phone}
        </a>
        <span className="text-brand-400">·</span>
        <span className="text-brand-600">{result.address}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {onCreatePlan && (
          <button className="btn-primary" onClick={onCreatePlan}>
            Create Action Plan
          </button>
        )}
        <button className="btn-secondary" onClick={copyScript}>
          Copy Call Script
        </button>
      </div>
    </article>
  );
}
