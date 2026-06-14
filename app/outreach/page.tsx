"use client";

import { useState, useEffect } from "react";
import { demoCases } from "@/lib/demoCases";
import { Intake } from "@/lib/types";
import { ContactRequest, loadContactRequests, markContacted, timeAgo } from "@/lib/contactRequests";
import OutreachCaseCard from "@/components/OutreachCaseCard";
import PrivacyBanner from "@/components/PrivacyBanner";

export default function OutreachPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [note, setNote] = useState(
    "Maria needs shelter tonight near Santa Clara. She has a dog, no ID, no car, and prefers Spanish."
  );
  const [parsed, setParsed] = useState<Intake | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    setRequests(loadContactRequests());
  }, []);

  function handleMarkContacted(id: string) {
    markContacted(id);
    setRequests(loadContactRequests());
  }

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

  const newCount = requests.filter((r) => r.status === "new").length;

  return (
    <div className="space-y-10 pt-12">
      <div className="border-b border-brand-200 pb-6">
        <p className="section-label">Outreach</p>
        <h1 className="font-display text-4xl font-bold text-brand-900">
          Outreach <em className="italic text-brand-500">dashboard</em>
        </h1>
        <p className="mt-2 text-base text-brand-700">
          People who want to be contacted appear here. Reach out to help them get placed.
        </p>
      </div>

      <PrivacyBanner variant="demo" />

      {/* ── Contact request queue ── */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <p className="section-label">Contact requests</p>
          {newCount > 0 && (
            <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-semibold text-white">
              {newCount} new
            </span>
          )}
        </div>

        {requests.length === 0 ? (
          <div className="rounded-sm border border-brand-200 bg-white px-6 py-10 text-center">
            <p className="font-display text-lg font-bold text-brand-900">No requests yet</p>
            <p className="mt-1 text-sm text-brand-500">
              When someone opts in at the end of the intake form, their request appears here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <ContactRequestCard
                key={r.id}
                request={r}
                onMarkContacted={() => handleMarkContacted(r.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── AI intake parser ── */}
      <section className="space-y-5 rounded-sm border border-brand-200 bg-white p-6">
        <div>
          <p className="section-label text-[10px]">AI intake parser</p>
          <h2 className="font-display text-xl font-bold text-brand-900">Parse an outreach note</h2>
          <p className="mt-1 text-base text-brand-700">
            Type a short note in plain language — Harbor extracts a structured intake automatically.
          </p>
        </div>
        <textarea
          className="w-full resize-none rounded-sm border border-brand-200 bg-brand-50 px-4 py-3 text-base text-brand-900 placeholder:text-brand-300 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-300 transition"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className="btn-primary" onClick={parseNote} disabled={parsing}>
          {parsing ? (
            <span className="flex items-center gap-2">
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Parsing…
            </span>
          ) : (
            "Extract structured intake"
          )}
        </button>
        {parseError && <p className="text-base text-amber-700">{parseError}</p>}
        {parsed && (
          <pre className="overflow-x-auto rounded-sm bg-brand-50 p-4 text-sm text-brand-800">
            {JSON.stringify(parsed, null, 2)}
          </pre>
        )}
      </section>

      {/* ── Demo cases ── */}
      <section className="space-y-4">
        <p className="section-label text-[10px]">Active cases</p>
        <div className="grid gap-4">
          {demoCases.map((c) => (
            <OutreachCaseCard key={c.id} demoCase={c} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ContactRequestCard({
  request,
  onMarkContacted,
}: {
  request: ContactRequest;
  onMarkContacted: () => void;
}) {
  const isNew = request.status === "new";

  const tags: string[] = [];
  if (request.hasPet) tags.push("has pet");
  if (request.hasChildren) tags.push("has children");
  if (request.noId) tags.push("no ID");
  if (request.prefersSpanish) tags.push("prefers Spanish");
  if (request.wheelchairAccess) tags.push("wheelchair access");
  if (request.womenOrFamilySafe) tags.push("women/family safe");

  return (
    <div
      className={`rounded-sm border bg-white p-5 space-y-4 ${
        isNew ? "border-brand-400" : "border-brand-200 opacity-70"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isNew && (
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-600">
                New
              </span>
            )}
            <span className="text-xs text-brand-400">{timeAgo(request.submittedAt)}</span>
          </div>
          <p className="font-semibold text-brand-900">
            {request.need} · {request.location}
          </p>
          <p className="text-sm text-brand-600">{request.urgency}</p>
        </div>
        {isNew && (
          <button
            className="btn-secondary shrink-0 py-1.5 text-sm"
            onClick={onMarkContacted}
          >
            Mark contacted
          </button>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-brand-200 px-2.5 py-0.5 text-xs text-brand-700"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-1 border-t border-brand-100 pt-3">
        {request.phone && (
          <a
            href={`tel:${request.phone}`}
            className="flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-900 transition-colors"
          >
            <span className="text-brand-400">📞</span>
            {request.phone}
          </a>
        )}
        {request.email && (
          <a
            href={`mailto:${request.email}`}
            className="flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-900 transition-colors"
          >
            <span className="text-brand-400">✉</span>
            {request.email}
          </a>
        )}
        {!request.phone && !request.email && (
          <p className="text-sm text-brand-400 italic">No contact info provided.</p>
        )}
      </div>
    </div>
  );
}
