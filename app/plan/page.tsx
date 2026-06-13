"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ActionPlan as ActionPlanType, Intake, MatchResult } from "@/lib/types";
import { rankResources } from "@/lib/matching";
import { getResources, loadIntake } from "@/lib/store";
import { buildFallbackPlan } from "@/lib/planFallback";
import ActionPlan from "@/components/ActionPlan";
import PrivacyBanner from "@/components/PrivacyBanner";

export default function PlanPage() {
  const [intake, setIntake] = useState<Intake | null>(null);
  const [plan, setPlan] = useState<ActionPlanType | null>(null);
  const [top, setTop] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const i = loadIntake();
    setIntake(i);
    if (!i) {
      setLoading(false);
      return;
    }

    const ranked = rankResources(i, getResources());
    const selectedId =
      typeof window !== "undefined"
        ? window.localStorage.getItem("harbor_selected")
        : null;
    const chosen = ranked.find((r) => r.id === selectedId) ?? ranked[0];
    const backup = ranked.find((r) => r.id !== chosen.id);
    setTop(chosen);

    const fallback = buildFallbackPlan(i, chosen, backup);
    setPlan(fallback);
    setLoading(false);

    fetch("/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intake: i, top: chosen, backup }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.summary) setPlan(data as ActionPlanType);
      })
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 pt-20 text-brand-600">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-500" />
        <span className="text-base italic text-brand-500">Preparing your plan…</span>
      </div>
    );
  }

  if (!intake || !plan || !top) {
    return (
      <div className="mx-auto max-w-xl space-y-4 pt-20 text-center">
        <h1 className="font-display text-2xl font-bold text-brand-900">
          No plan yet
        </h1>
        <p className="text-base text-brand-700">
          Start the navigator to create an action plan.
        </p>
        <Link href="/intake" className="btn-primary inline-flex">
          Start Navigator
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 pt-12">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-200 pb-6">
        <div>
          <p className="section-label">Action Plan</p>
          <h1 className="font-display text-4xl font-bold text-brand-900">
            {intake.urgency === "Tonight" ? (
              <>Your plan for <em className="italic text-brand-500">tonight</em></>
            ) : (
              <>Your <em className="italic text-brand-500">plan</em></>
            )}
          </h1>
          {intake.requestName ? (
            <p className="mt-2 text-base font-semibold text-brand-800">
              Prepared for {intake.requestName}
            </p>
          ) : null}
          <p className="mt-2 text-base text-brand-700">
            Best option:{" "}
            <span className="font-semibold text-brand-800">{top.name}</span>
          </p>
        </div>
        <Link href="/results" className="btn-secondary py-2.5 text-sm self-end">
          ← Back to options
        </Link>
      </div>

      <PrivacyBanner variant="demo" />
      <ActionPlan plan={plan} />
    </div>
  );
}
