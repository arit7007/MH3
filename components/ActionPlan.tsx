"use client";

import { ActionPlan as ActionPlanType } from "@/lib/types";
import CopyButton from "./CopyButton";

export default function ActionPlan({ plan }: { plan: ActionPlanType }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span
          className={`chip ${
            plan.source === "ai"
              ? "bg-brand-600 text-white"
              : "bg-brand-100 text-brand-800"
          }`}
        >
          {plan.source === "ai" ? "AI-generated plan" : "Template plan"}
        </span>
      </div>

      <p className="text-lg font-semibold text-brand-900">{plan.summary}</p>

      <section className="card space-y-2">
        <h3 className="font-bold text-brand-800">Next steps</h3>
        <ol className="ml-5 list-decimal space-y-2 text-brand-800">
          {plan.nextSteps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="card space-y-2">
        <h3 className="font-bold text-brand-800">What to bring</h3>
        <ul className="ml-5 list-disc space-y-1 text-brand-800">
          {plan.whatToBring.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="card space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-brand-800">Message you can send</h3>
          <CopyButton text={plan.messageScript} label="Copy message" />
        </div>
        <p className="rounded-lg bg-brand-50 p-3 text-brand-900">{plan.messageScript}</p>
        {plan.spanishMessageScript && (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-brand-700">En español</h4>
              <CopyButton text={plan.spanishMessageScript} label="Copiar mensaje" />
            </div>
            <p className="rounded-lg bg-brand-50 p-3 text-brand-900">
              {plan.spanishMessageScript}
            </p>
          </div>
        )}
      </section>

      <section className="card space-y-2">
        <h3 className="font-bold text-brand-800">Backup option</h3>
        <p className="text-brand-800">{plan.backupPlan}</p>
      </section>

      <section className="card space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-brand-800">Outreach worker summary</h3>
          <CopyButton text={plan.outreachSummary} label="Copy warm handoff" />
        </div>
        <p className="text-brand-800">{plan.outreachSummary}</p>
      </section>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Availability is not guaranteed. Please call or visit to confirm before
        traveling. This plan is based on the information you provided.
      </div>
    </div>
  );
}
