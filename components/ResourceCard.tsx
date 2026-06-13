"use client";

import { getDirectionsUrl, getEmbedUrl, getMapUrl, getTravelModeLabel } from "@/lib/googleMaps";
import { matchLabel } from "@/lib/matching";
import { Intake, MatchResult } from "@/lib/types";
import { ReasonList, WarningList, ReliabilityChip, Tag } from "./MatchBadges";

function tonightStatus(status: boolean | null) {
  if (status === true) {
    return {
      label: "Open tonight",
      className: "bg-green-100 text-green-800",
    };
  }
  if (status === false) {
    return {
      label: "Not open tonight",
      className: "bg-brand-100 text-brand-600",
    };
  }
  return {
    label: "Check tonight's hours",
    className: "bg-amber-100 text-amber-800",
  };
}

export default function ResourceCard({
  result,
  intake,
  best,
  rank,
  onCreatePlan,
}: {
  result: MatchResult;
  intake: Intake;
  best: number;
  rank: number;
  onCreatePlan?: () => void;
}) {
  const { percent, label } = matchLabel(result, best);
  const isTop = rank === 0;
  const tonight = tonightStatus(result.openTonight);
  const directionsUrl = getDirectionsUrl(intake, result);
  const mapUrl = getMapUrl(result);
  const embedUrl = getEmbedUrl(intake, result);
  const travelModeLabel = getTravelModeLabel(intake);

  function copyScript() {
    const script = `Hi, I'm looking for help in ${
      result.address.includes("Santa Clara") ? "Santa Clara" : "this area"
    }. Do you have space or an appointment available? My situation: I need ${result.type[0].toLowerCase()}.`;
    navigator.clipboard?.writeText(script);
  }

  return (
    <article
      className={`rounded-sm border bg-white transition-shadow hover:shadow-card ${
        isTop
          ? "border-brand-400 shadow-card"
          : "border-brand-200"
      }`}
    >
      {isTop && (
        <div className="rounded-t-sm bg-brand-600 px-6 py-2">
          <p className="text-sm font-bold uppercase tracking-widest text-white">
            Best match
          </p>
        </div>
      )}

      <div className="space-y-5 p-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-xl font-bold text-brand-900">
              {result.name}
            </h3>
            <p className="mt-1 text-base leading-relaxed text-brand-700">
              {result.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 text-right">
            <span className="font-display text-2xl font-bold text-brand-600">
              {percent}%
            </span>
            <span className="section-label text-[10px]">match</span>
            <div className="h-1 w-14 overflow-hidden rounded-full bg-brand-100">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Tag>{result.type[0]}</Tag>
          <Tag>{result.distanceMiles} mi away</Tag>
          <Tag>Intake: {result.intakeHours}</Tag>
          <span className={`chip text-xs ${tonight.className}`}>{tonight.label}</span>
          <ReliabilityChip level={result.reliability} />
        </div>

        {/* Reasons & warnings */}
        <div className="grid gap-4 rounded-sm bg-brand-50 p-4 sm:grid-cols-2">
          <ReasonList reasons={result.reasons} />
          <WarningList warnings={result.warnings} />
        </div>

        <section className="space-y-3 rounded-sm border border-brand-100 bg-brand-50/60 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="section-label">Google Maps</p>
              <p className="mt-1 text-base text-brand-700">{travelModeLabel}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                className="btn-secondary px-4 py-2 text-sm"
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open Map
              </a>
              <a
                className="btn-primary px-4 py-2 text-sm"
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
              >
                Fastest Route
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-sm border border-brand-200 bg-white">
            <iframe
              title={`Map for ${result.name}`}
              src={embedUrl}
              className="h-64 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-100 pt-4">
          <div className="flex flex-col gap-0.5">
            <a
              className="text-base font-bold text-brand-700 hover:text-brand-500 hover:underline transition-colors"
              href={`tel:${result.phone.replace(/[^0-9+]/g, "")}`}
            >
              {result.phone}
            </a>
            <span className="text-sm text-brand-400">{result.address}</span>
            <span className="text-sm text-brand-500">{result.notes}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {onCreatePlan && (
              <button
                className="btn-primary px-4 py-2 text-sm"
                onClick={onCreatePlan}
              >
                Create Action Plan
              </button>
            )}
            <button
              className="btn-secondary px-4 py-2 text-sm"
              onClick={copyScript}
            >
              Copy Call Script
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
