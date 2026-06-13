"use client";

import { ActionPlan as ActionPlanType } from "@/lib/types";
import CopyButton from "./CopyButton";

function PlanSection({
  title,
  children,
  action,
  accent = "brand",
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  accent?: "brand" | "amber";
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-card">
      <div
        className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${
          accent === "amber" ? "bg-gold-400" : "bg-brand-500"
        }`}
      />
      <div className="px-5 py-4 pl-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-brand-900">{title}</h3>
          {action}
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </section>
  );
}

export default function ActionPlan({ plan }: { plan: ActionPlanType }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span
          className={`chip ${
            plan.source === "ai"
              ? "bg-brand-600 text-white"
              : "bg-brand-100 text-brand-800"
          }`}
        >
          {plan.source === "ai" ? "✦ AI-generated plan" : "Template plan"}
        </span>
      </div>

      <p className="text-lg font-semibold text-brand-900">{plan.summary}</p>

      <PlanSection title="Next steps">
        <ol className="ml-4 list-decimal space-y-2 text-sm text-brand-800">
          {plan.nextSteps.map((s, i) => (
            <li key={i} className="leading-relaxed">
              {s}
            </li>
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
        <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-900">
          {plan.messageScript}
        </p>
        {plan.spanishMessageScript && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-500">
                En español
              </span>
              <CopyButton
                text={plan.spanishMessageScript}
                label="Copiar"
              />
            </div>
            <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-900">
              {plan.spanishMessageScript}
            </p>
          </div>
        )}
      </PlanSection>

      <PlanSection title="Backup option" accent="amber">
        <p className="text-sm leading-relaxed text-brand-800">
          {plan.backupPlan}
        </p>
      </PlanSection>

      <PlanSection
        title="Outreach worker summary"
        action={
          <CopyButton text={plan.outreachSummary} label="Copy warm handoff" />
        }
      >
        <p className="text-sm leading-relaxed text-brand-800">
          {plan.outreachSummary}
        </p>
      </PlanSection>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        ⚠️ Availability is not guaranteed. Please call or visit to confirm
        before traveling.
      </div>
    </div>
  );
}
