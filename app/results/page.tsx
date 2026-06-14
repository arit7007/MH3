"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Intake, MatchResult, Resource } from "@/lib/types";
import { rankResources } from "@/lib/matching";
import { loadIntake } from "@/lib/store";
import { getResources } from "@/lib/store";
import ResourceCard from "@/components/ResourceCard";
import PrivacyBanner from "@/components/PrivacyBanner";

export default function ResultsPage() {
  const router = useRouter();
  const [intake, setIntake] = useState<Intake | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [fetchingResources, setFetchingResources] = useState(false);
  const [resourceSource, setResourceSource] = useState<"ai" | "fallback">("fallback");

  useEffect(() => {
    const savedIntake = loadIntake();
    setIntake(savedIntake);
    setLoaded(true);

    if (!savedIntake) return;

    setFetchingResources(true);
    fetch("/api/find-resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intake: savedIntake }),
    })
      .then((r) => r.json())
      .then((data) => {
        setResources(data.resources ?? getResources());
        setResourceSource(data.source ?? "fallback");
      })
      .catch(() => {
        setResources(getResources());
        setResourceSource("fallback");
      })
      .finally(() => setFetchingResources(false));
  }, []);

  const ranked: MatchResult[] = useMemo(() => {
    if (!intake || resources.length === 0) return [];
    return rankResources(intake, resources);
  }, [intake, resources]);

  if (loaded && !intake) {
    return (
      <div className="mx-auto max-w-xl space-y-4 pt-20 text-center">
        <h1 className="font-display text-2xl font-bold text-brand-900">No intake found</h1>
        <p className="text-base text-brand-700">
          Answer a few quick questions and we'll show options that fit.
        </p>
        <Link href="/intake" className="btn-primary inline-flex">
          Start Navigator
        </Link>
      </div>
    );
  }

  if (!intake) return null;

  const best = ranked[0]?.score ?? 1;
  const summary = describeIntake(intake);

  return (
    <div className="space-y-8 pt-12">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-200 pb-6">
        <div>
          <p className="section-label">Results</p>
          <h1 className="font-display text-4xl font-bold text-brand-900">
            Options that <em className="italic text-brand-500">may fit</em>
          </h1>
          <p className="mt-2 text-base text-brand-700">{summary}</p>
        </div>
        <Link href="/intake" className="btn-secondary py-2.5 text-sm self-end">
          Change answers
        </Link>
      </div>

      <PrivacyBanner variant="demo" />

      {fetchingResources ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-500" />
          <p className="font-display text-lg italic text-brand-600">
            Finding resources near {intake.location}…
          </p>
          <p className="text-sm text-brand-400">This takes a few seconds</p>
        </div>
      ) : (
        <>
          {resourceSource === "ai" && (
            <p className="text-xs text-brand-400">
              Resources found by AI for {intake.location} · Always call ahead to confirm availability
            </p>
          )}
          <div className="space-y-4">
            {ranked.map((r, i) => (
              <ResourceCard
                key={r.id}
                result={r}
                intake={intake}
                best={best}
                rank={i}
                onCreatePlan={() => {
                  window.localStorage.setItem("harbor_selected", r.id);
                  window.localStorage.setItem(
                    "harbor_selected_resource",
                    JSON.stringify(r)
                  );
                  router.push("/plan");
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function describeIntake(intake: Intake): string {
  const parts: string[] = [`Looking for ${intake.need.toLowerCase()}`];
  parts.push(`near ${intake.location}`);
  parts.push(`(${intake.urgency.toLowerCase()})`);
  const extras: string[] = [];
  if (intake.hasPet) extras.push("with a pet");
  if (intake.hasChildren) extras.push("with family");
  if (intake.noId) extras.push("no ID");
  if (intake.prefersSpanish) extras.push("Spanish preferred");
  if (intake.wheelchairAccess) extras.push("wheelchair access");
  return parts.join(" ") + (extras.length ? ` · ${extras.join(", ")}` : "");
}
