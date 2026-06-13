"use client";

import { useMemo, useState } from "react";
import { DemoCase } from "@/lib/demoCases";
import { rankResources } from "@/lib/matching";
import { getResources } from "@/lib/store";
import { buildFallbackPlan } from "@/lib/planFallback";
import CopyButton from "./CopyButton";

export default function OutreachCaseCard({ demoCase }: { demoCase: DemoCase }) {
  const [followedUp, setFollowedUp] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { top, backup, summary } = useMemo(() => {
    const ranked = rankResources(demoCase.intake, getResources());
    const top = ranked[0];
    const backup = ranked[1];
    const plan = buildFallbackPlan(demoCase.intake, top, backup);
    return { top, backup, summary: plan.outreachSummary };
  }, [demoCase]);

  return (
    <article className="card space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-brand-900">{demoCase.name}</h3>
          <p className="text-sm text-brand-700">
            <span className="font-semibold">Need:</span> {demoCase.needSummary}
          </p>
          <p className="text-sm text-brand-600">
            <span className="font-semibold">Constraints:</span> {demoCase.constraints}
          </p>
        </div>
        <span
          className={`chip ${
            followedUp ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
          }`}
        >
          {followedUp ? "Followed up" : "Needs follow-up"}
        </span>
      </div>

      <div className="rounded-lg bg-brand-50 p-3 text-sm">
        <p className="text-brand-800">
          <span className="font-semibold">Recommended:</span> {top.name}
        </p>
        {backup && (
          <p className="text-brand-700">
            <span className="font-semibold">Backup:</span> {backup.name}
          </p>
        )}
        <p className="text-brand-600">
          <span className="font-semibold">Follow-up:</span> {demoCase.followUp}
        </p>
      </div>

      {expanded && (
        <div className="rounded-lg border border-brand-100 p-3 text-sm text-brand-800">
          <p className="mb-1 font-semibold text-brand-700">Warm handoff summary</p>
          {summary}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button className="btn-secondary" onClick={() => setExpanded((e) => !e)}>
          {expanded ? "Hide summary" : "View summary"}
        </button>
        <CopyButton text={summary} label="Copy warm handoff" />
        <button
          className={followedUp ? "btn-secondary" : "btn-primary"}
          onClick={() => setFollowedUp((f) => !f)}
        >
          {followedUp ? "Mark not followed up" : "Mark followed up"}
        </button>
      </div>
    </article>
  );
}
