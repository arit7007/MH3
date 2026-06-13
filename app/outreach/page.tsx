"use client";

import { useState } from "react";
import { demoCases } from "@/lib/demoCases";
import { Intake } from "@/lib/types";
import OutreachCaseCard from "@/components/OutreachCaseCard";
import PrivacyBanner from "@/components/PrivacyBanner";

export default function OutreachPage() {
  const [note, setNote] = useState(
    "Maria needs shelter tonight near Santa Clara. She has a dog, no ID, no car, and prefers Spanish."
  );
  const [parsed, setParsed] = useState<Intake | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  async function parseNote() {
    setParsing(true);
    setParseError(null);
    try {
      const res = await fetch("/api/extract-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      if (!res.ok) throw new Error("parse failed");
      const data = await res.json();
      setParsed(data as Intake);
    } catch {
      setParseError(
        "Could not parse the note automatically. You can still create a case manually."
      );
    } finally {
      setParsing(false);
    }
  }

  return (
    <div className="space-y-8 pt-8">
      <div>
        <p className="section-label">Outreach</p>
        <h1 className="text-3xl font-extrabold text-brand-900">
          Outreach dashboard
        </h1>
        <p className="mt-1 text-slate-500">
          Review cases, see recommended resources, and copy a warm handoff so
          people don't have to repeat their story.
        </p>
      </div>

      <PrivacyBanner variant="demo" />

      <section className="card space-y-4">
        <div>
          <h2 className="text-lg font-bold text-brand-900">
            Parse an outreach note
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Type a short note in plain language — DignityLink extracts a
            structured intake automatically.
          </p>
        </div>
        <textarea
          className="field-input resize-none text-sm"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          className="btn-primary"
          onClick={parseNote}
          disabled={parsing}
        >
          {parsing ? (
            <span className="flex items-center gap-2">
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Parsing…
            </span>
          ) : (
            "Extract structured intake"
          )}
        </button>
        {parseError && (
          <p className="text-sm text-amber-700">{parseError}</p>
        )}
        {parsed && (
          <pre className="overflow-x-auto rounded-xl bg-brand-50 p-4 text-xs text-brand-800">
            {JSON.stringify(parsed, null, 2)}
          </pre>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-brand-900">Cases</h2>
        <div className="grid gap-4">
          {demoCases.map((c) => (
            <OutreachCaseCard key={c.id} demoCase={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
