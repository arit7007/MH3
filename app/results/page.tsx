"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Intake, MatchResult } from "@/lib/types";
import { rankResources } from "@/lib/matching";
import { getResources, loadIntake } from "@/lib/store";
import ResourceCard from "@/components/ResourceCard";
import PrivacyBanner from "@/components/PrivacyBanner";

export default function ResultsPage() {
  const router = useRouter();
  const [intake, setIntake] = useState<Intake | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setIntake(loadIntake());
    setLoaded(true);
  }, []);

  const ranked: MatchResult[] = useMemo(() => {
    if (!intake) return [];
    return rankResources(intake, getResources());
  }, [intake]);

  if (loaded && !intake) {
    return (
      <div className="mx-auto max-w-xl space-y-4 pt-16 text-center">
        <p className="text-5xl">🔍</p>
        <h1 className="text-2xl font-bold text-brand-900">No intake found</h1>
        <p className="text-slate-500">
          Answer a few quick questions and we'll show options that fit.
        </p>
        <Link href="/intake" className="btn-primary">
          Start Navigator
        </Link>
      </div>
    );
  }

  if (!intake) return null;

  const best = ranked[0]?.score ?? 1;
  const summary = describeIntake(intake);

  return (
    <div className="space-y-8 pt-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="section-label">Results</p>
          <h1 className="text-3xl font-extrabold text-brand-900">
            Options that may fit
          </h1>
          <p className="mt-1 text-sm text-slate-500">{summary}</p>
        </div>
        <Link href="/intake" className="btn-secondary text-sm">
          Change answers
        </Link>
      </div>

      <PrivacyBanner variant="demo" />

      <div className="space-y-4">
        {ranked.map((r, i) => (
          <ResourceCard
            key={r.id}
            result={r}
            best={best}
            rank={i}
            onCreatePlan={() => {
              window.localStorage.setItem("dignitylink_selected", r.id);
              router.push("/plan");
            }}
          />
        ))}
      </div>
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
  return (
    parts.join(" ") + (extras.length ? ` · ${extras.join(", ")}` : "")
  );
}
