"use client";

import { useState, useEffect, useMemo } from "react";
import { demoCases, DemoCase } from "@/lib/demoCases";
import { Intake } from "@/lib/types";
import { ContactRequest, loadContactRequests, markContacted, timeAgo } from "@/lib/contactRequests";
import { rankResources } from "@/lib/matching";
import { getResources } from "@/lib/store";
import { buildFallbackPlan } from "@/lib/planFallback";
import CopyButton from "@/components/CopyButton";
import PrivacyBanner from "@/components/PrivacyBanner";

type QueueEntry =
  | { kind: "request"; data: ContactRequest }
  | { kind: "demo"; data: DemoCase };

type ConstraintSource = {
  hasPet?: boolean;
  hasChildren?: boolean;
  noId?: boolean;
  prefersSpanish?: boolean;
  wheelchairAccess?: boolean;
  womenOrFamilySafe?: boolean;
};

function constraintTags(src: ConstraintSource): string[] {
  const tags: string[] = [];
  if (src.hasPet) tags.push("has pet");
  if (src.hasChildren) tags.push("has children");
  if (src.noId) tags.push("no ID");
  if (src.prefersSpanish) tags.push("prefers Spanish");
  if (src.wheelchairAccess) tags.push("wheelchair access");
  if (src.womenOrFamilySafe) tags.push("women/family safe");
  return tags;
}

function UnifiedCard({
  entry,
  fading,
  onMarkDone,
}: {
  entry: QueueEntry;
  fading: boolean;
  onMarkDone: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [done, setDone] = useState(false);

  const isRequest = entry.kind === "request";
  const isDemo = entry.kind === "demo";

  const intake: Intake | null = isRequest
    ? {
        need: entry.data.need as Intake["need"],
        location: entry.data.location,
        urgency: entry.data.urgency as Intake["urgency"],
        transportation: "Public transit",
        hasPet: entry.data.hasPet,
        hasChildren: entry.data.hasChildren,
        noId: entry.data.noId,
        prefersSpanish: entry.data.prefersSpanish,
        wheelchairAccess: entry.data.wheelchairAccess,
        womenOrFamilySafe: entry.data.womenOrFamilySafe,
        wantsPlan: false,
        wantsContact: true,
        contactPhone: entry.data.phone,
        contactEmail: entry.data.email,
      }
    : entry.data.intake;

  const { top, backup, summary } = useMemo(() => {
    if (!intake) return { top: null, backup: null, summary: "" };
    const ranked = rankResources(intake, getResources());
    const t = ranked[0] ?? null;
    const b = ranked[1] ?? null;
    const plan = t ? buildFallbackPlan(intake, t, b) : null;
    return { top: t, backup: b, summary: plan?.outreachSummary ?? "" };
  }, [intake]);

  const name = isDemo ? entry.data.name : `${entry.data.need} · ${entry.data.location}`;
  const urgency = isRequest ? entry.data.urgency : entry.data.intake.urgency;
  const tags = isRequest ? constraintTags(entry.data) : constraintTags(entry.data.intake);
  const followUp = isDemo ? entry.data.followUp : null;
  const phone = isRequest ? entry.data.phone : null;
  const email = isRequest ? entry.data.email : null;
  const submittedAt = isRequest ? entry.data.submittedAt : null;
  const isDone = done || (isRequest && entry.data.status === "contacted");

  return (
    <article
      className={`rounded-sm border bg-white p-5 space-y-4 transition-opacity duration-500 ${
        fading ? "opacity-0" : isDone ? "border-brand-200 opacity-60" : "border-brand-400"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            {!isDone && submittedAt && (
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-600">
                New
              </span>
            )}
            {submittedAt && (
              <span className="text-xs text-brand-400">{timeAgo(submittedAt)}</span>
            )}
          </div>
          <p className="font-bold text-brand-900">{name}</p>
          <p className="text-sm text-brand-600">{urgency}</p>
        </div>
        <span
          className={`chip ${
            isDone ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
          }`}
        >
          {isDone ? "Done" : "Needs follow-up"}
        </span>
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

      {(top || followUp || phone || email) && (
        <div className="rounded-lg bg-brand-50 p-3 text-sm space-y-0.5">
          {top && (
            <p className="text-brand-800">
              <span className="font-semibold">Recommended:</span> {top.name}
            </p>
          )}
          {backup && (
            <p className="text-brand-700">
              <span className="font-semibold">Backup:</span> {backup.name}
            </p>
          )}
          {followUp && (
            <p className="text-brand-600">
              <span className="font-semibold">Follow-up:</span> {followUp}
            </p>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1.5 font-semibold text-brand-700 hover:text-brand-900 transition-colors"
            >
              📞 {phone}
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 font-semibold text-brand-700 hover:text-brand-900 transition-colors"
            >
              ✉ {email}
            </a>
          )}
          {isRequest && !phone && !email && (
            <p className="text-brand-400 italic">No contact info provided.</p>
          )}
        </div>
      )}

      {expanded && summary && (
        <div className="rounded-lg border border-brand-100 p-3 text-sm text-brand-800">
          <p className="mb-1 font-semibold text-brand-700">Warm handoff summary</p>
          {summary}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {summary && (
          <button className="btn-secondary py-1.5 text-sm" onClick={() => setExpanded((e) => !e)}>
            {expanded ? "Hide summary" : "View summary"}
          </button>
        )}
        {summary && <CopyButton text={summary} label="Copy warm handoff" />}
        {!isDone && (
          <button
            className="btn-primary py-1.5 text-sm"
            onClick={() => {
              if (isRequest) {
                onMarkDone();
              } else {
                setDone(true);
              }
            }}
          >
            Mark done
          </button>
        )}
      </div>
    </article>
  );
}

export default function OutreachPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [fadingIds, setFadingIds] = useState<Set<string>>(new Set());
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
    setFadingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      markContacted(id);
      setRequests(loadContactRequests());
      setFadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 500);
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

  const entries: QueueEntry[] = [
    ...requests
      .filter((r) => r.status === "new" || fadingIds.has(r.id))
      .map((r): QueueEntry => ({ kind: "request", data: r })),
    ...demoCases.map((d): QueueEntry => ({ kind: "demo", data: d })),
  ];

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

      {/* ── Unified queue ── */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <p className="section-label">Cases</p>
          {newCount > 0 && (
            <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-semibold text-white">
              {newCount} new
            </span>
          )}
        </div>

        <div className="space-y-3">
          {entries.map((entry) => {
            const id = entry.kind === "request" ? entry.data.id : entry.data.id;
            return (
              <UnifiedCard
                key={id}
                entry={entry}
                fading={entry.kind === "request" && fadingIds.has(entry.data.id)}
                onMarkDone={() =>
                  entry.kind === "request" && handleMarkContacted(entry.data.id)
                }
              />
            );
          })}
        </div>
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
    </div>
  );
}
