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
    const chosen =
      ranked.find((r) => r.id === selectedId) ?? ranked[0];
    const backup = ranked.find((r) => r.id !== chosen.id);
    setTop(chosen);

    // Always have a deterministic fallback ready.
    const fallback = buildFallbackPlan(i, chosen, backup);
    setPlan(fallback);
    setLoading(false);

    // Try to enrich with AI; silently keep fallback on failure.
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
    return <p className="text-brand-600">Preparing your plan…</p>;
  }

  if (!intake || !plan || !top) {
    return (
      <div className="mx-auto max-w-xl space-y-4 text-center">
        <h1 className="text-2xl font-bold text-brand-900">No plan yet</h1>
        <p className="text-brand-700">Start the navigator to create an action plan.</p>
        <Link href="/intake" className="btn-primary">
          Start Navigator
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-900">
            Your {intake.urgency === "Tonight" ? "plan for tonight" : "plan"}
          </h1>
          <p className="mt-1 text-brand-700">
            Best option: <span className="font-semibold">{top.name}</span>
          </p>
        </div>
        <Link href="/results" className="btn-secondary">
          Back to options
        </Link>
      </div>

      <PrivacyBanner variant="demo" />
      <ActionPlan plan={plan} />
    </div>
  );
}
