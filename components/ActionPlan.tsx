"use client";

import { ActionPlan as ActionPlanType } from "@/lib/types";
import CopyButton from "./CopyButton";

function PlanSection({
  title,
  children,
  action,
  tinted = false,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  tinted?: boolean;
}) {
  return (
    <section
      className={`rounded-sm border border-brand-200 ${tinted ? "bg-brand-50" : "bg-white"}`}
    >
      <div className="flex items-center justify-between border-b border-brand-200 px-5 py-3">
        <p className="section-label text-[10px]">{title}</p>
        {action}
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

export default function ActionPlan({ plan }: { plan: ActionPlanType }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span
          className={`chip text-xs ${
            plan.source === "ai"
              ? "bg-brand-600 text-white"
              : "bg-brand-100 text-brand-700"
          }`}
        >
          {plan.source === "ai" ? "✦ AI-generated plan" : "Template plan"}
        </span>
      </div>

      <p className="font-display text-lg font-bold italic text-brand-800">
        {plan.summary}
      </p>

      <PlanSection title="Next steps">
        <ol className="ml-4 list-decimal space-y-2 text-sm text-brand-800">
          {plan.nextSteps.map((s, i) => (
            <li key={i} className="leading-relaxed">{s}</li>
          ))}
        </ol>
      </PlanSection>

      <PlanSection title="What to bring">
        <ul className="ml-4 list-disc space-y-1.5 text-sm text-brand-800">
          {plan.whatToBring.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </PlanSection>

      <PlanSection
        title="Message you can send"
        action={<CopyButton text={plan.messageScript} label="Copy" />}
      >
        <p className="rounded-sm bg-brand-50 px-4 py-3 text-sm text-brand-900">
          {plan.messageScript}
        </p>
        {plan.spanishMessageScript && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="section-label text-[10px]">En español</span>
              <CopyButton text={plan.spanishMessageScript} label="Copiar" />
            </div>
            <p className="rounded-sm bg-brand-50 px-4 py-3 text-sm text-brand-900">
              {plan.spanishMessageScript}
            </p>
          </div>
        )}
      </PlanSection>

      <PlanSection title="Backup option" tinted>
        <p className="text-sm leading-relaxed text-brand-800">{plan.backupPlan}</p>
      </PlanSection>

      <PlanSection
        title="Outreach worker summary"
        action={<CopyButton text={plan.outreachSummary} label="Copy warm handoff" />}
      >
        <p className="text-sm leading-relaxed text-brand-800">
          {plan.outreachSummary}
        </p>
      </PlanSection>

      <div className="flex items-start gap-3 rounded-sm border border-amber-200 bg-amber-50 px-4 py-3">
        <span className="text-sm">⚠️</span>
        <p className="text-sm text-amber-900">
          Availability is not guaranteed. Please call or visit to confirm before traveling.
        </p>
      </div>
    </div>
  );
}
