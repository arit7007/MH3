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
        ? window.localStorage.getItem("dignitylink_selected")
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
      <div className="flex items-center gap-3 pt-16 text-brand-600">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-300 border-t-brand-600" />
        Preparing your plan…
      </div>
    );
  }

  if (!intake || !plan || !top) {
    return (
      <div className="mx-auto max-w-xl space-y-4 pt-16 text-center">
        <p className="text-5xl">📋</p>
        <h1 className="text-2xl font-bold text-brand-900">No plan yet</h1>
        <p className="text-slate-500">
          Start the navigator to create an action plan.
        </p>
        <Link href="/intake" className="btn-primary">
          Start Navigator
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 pt-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="section-label">Action Plan</p>
          <h1 className="text-3xl font-extrabold text-brand-900">
            {intake.urgency === "Tonight" ? "Your plan for tonight" : "Your plan"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Best option:{" "}
            <span className="font-semibold text-brand-700">{top.name}</span>
          </p>
        </div>
        <Link href="/results" className="btn-secondary text-sm">
          ← Back to options
        </Link>
      </div>

      <PrivacyBanner variant="demo" />
      <ActionPlan plan={plan} />
    </div>
  );
}
