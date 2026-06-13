"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Intake, Need, Transportation, Urgency } from "@/lib/types";
import { saveIntake } from "@/lib/store";
import { mariaIntake } from "@/lib/demoCases";

const NEED_OPTIONS: { value: Need; emoji: string; desc: string }[] = [
  { value: "Shelter tonight", emoji: "🛏️", desc: "Safe place to sleep" },
  { value: "Food", emoji: "🍽️", desc: "Meals or food assistance" },
  { value: "Shower/laundry", emoji: "🚿", desc: "Hygiene facilities" },
  { value: "Medical help", emoji: "➕", desc: "Health care or clinic" },
  { value: "ID/document help", emoji: "🪪", desc: "Replace lost ID or docs" },
  { value: "Case management", emoji: "🤝", desc: "Ongoing support" },
  { value: "Transportation help", emoji: "🚌", desc: "Rides or transit passes" },
];

const URGENCY_OPTIONS: { value: Urgency; label: string; sub: string }[] = [
  { value: "Tonight", label: "Tonight", sub: "I need help right now" },
  { value: "This week", label: "This week", sub: "Within the next few days" },
  { value: "Planning ahead", label: "Planning ahead", sub: "Getting ready for later" },
];

const TRANSPORT_OPTIONS: { value: Transportation; emoji: string }[] = [
  { value: "Walking", emoji: "🚶" },
  { value: "Public transit", emoji: "🚌" },
  { value: "Car", emoji: "🚗" },
  { value: "Need transportation help", emoji: "🆘" },
];

type BooleanIntakeKey =
  | "hasPet"
  | "hasChildren"
  | "noId"
  | "prefersSpanish"
  | "wheelchairAccess"
  | "womenOrFamilySafe";

const NEED_LABELS: { key: BooleanIntakeKey; label: string; emoji: string }[] = [
  { key: "hasPet", label: "I have a pet", emoji: "🐾" },
  { key: "hasChildren", label: "I have children or family with me", emoji: "👨‍👩‍👧" },
  { key: "noId", label: "I don't have ID right now", emoji: "🪪" },
  { key: "prefersSpanish", label: "I prefer Spanish", emoji: "🌎" },
  { key: "wheelchairAccess", label: "I need wheelchair access", emoji: "♿" },
  { key: "womenOrFamilySafe", label: "I need women-only or family-safe options", emoji: "🛡️" },
];

const defaultIntake: Intake = {
  need: "Shelter tonight",
  location: "Santa Clara, CA",
  urgency: "Tonight",
  transportation: "Walking",
  hasPet: false,
  hasChildren: false,
  noId: false,
  prefersSpanish: false,
  wheelchairAccess: false,
  womenOrFamilySafe: false,
  wantsPlan: true,
};

const steps = ["What you need", "Where & when", "Getting there", "Important needs", "Action plan"];

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative rounded-2xl border-2 px-4 py-4 text-left text-base font-medium transition-all duration-150 ${
        active
          ? "border-brand-500 bg-brand-50 text-brand-900 shadow-glow"
          : "border-brand-100 bg-white text-brand-800 hover:border-brand-300 hover:bg-brand-50/50"
      }`}
    >
      {active && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] text-white">
          ✓
        </span>
      )}
      {children}
    </button>
  );
}

export default function IntakeForm() {
  const router = useRouter();
  const [intake, setIntake] = useState<Intake>(defaultIntake);
  const [step, setStep] = useState(0);

  function set<K extends keyof Intake>(key: K, value: Intake[K]) {
    setIntake((prev) => ({ ...prev, [key]: value }));
  }

  function toggle(key: BooleanIntakeKey) {
    setIntake((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function submit(data: Intake) {
    saveIntake(data);
    router.push("/results");
  }

  function useMaria() {
    setIntake(mariaIntake);
    submit(mariaIntake);
  }

  return (
    <div className="space-y-8">
      {/* Step progress */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          {steps.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-1.5">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  i < step
                    ? "bg-brand-600 text-white cursor-pointer"
                    : i === step
                    ? "bg-brand-600 text-white ring-4 ring-brand-200"
                    : "bg-brand-100 text-brand-400"
                }`}
                aria-label={`Step ${i + 1}: ${label}`}
              >
                {i < step ? "✓" : i + 1}
              </button>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 rounded-full transition-all ${
                    i < step ? "bg-brand-500" : "bg-brand-100"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm font-semibold text-brand-600">
          Step {step + 1} of {steps.length} — {steps[step]}
        </p>
      </div>

      {/* Step 0 – Need */}
      {step === 0 && (
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-900">
              What do you need right now?
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose the one that fits best. You can change it later.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {NEED_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                active={intake.need === opt.value}
                onClick={() => set("need", opt.value)}
              >
                <span className="mr-2 text-xl" aria-hidden>
                  {opt.emoji}
                </span>
                <span className="font-semibold">{opt.value}</span>
                <p className="mt-0.5 text-xs text-slate-400">{opt.desc}</p>
              </OptionButton>
            ))}
          </div>
        </section>
      )}

      {/* Step 1 – Location & urgency */}
      {step === 1 && (
        <section className="space-y-7">
          <div className="space-y-3">
            <h2 className="text-2xl font-extrabold text-brand-900">Where are you?</h2>
            <input
              className="field-input"
              value={intake.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Santa Clara, CA"
            />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-extrabold text-brand-900">How urgent is this?</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {URGENCY_OPTIONS.map((u) => (
                <OptionButton
                  key={u.value}
                  active={intake.urgency === u.value}
                  onClick={() => set("urgency", u.value)}
                >
                  <span className="block font-bold">{u.label}</span>
                  <span className="text-xs text-slate-400">{u.sub}</span>
                </OptionButton>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Step 2 – Transportation */}
      {step === 2 && (
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-900">
              How can you get there?
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              We'll only show places you can realistically reach.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {TRANSPORT_OPTIONS.map((t) => (
              <OptionButton
                key={t.value}
                active={intake.transportation === t.value}
                onClick={() => set("transportation", t.value)}
              >
                <span className="mr-2 text-xl" aria-hidden>
                  {t.emoji}
                </span>
                <span className="font-semibold">{t.value}</span>
              </OptionButton>
            ))}
          </div>
        </section>
      )}

      {/* Step 3 – Important needs */}
      {step === 3 && (
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-900">
              Any important needs?
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select all that apply — this helps us find options that truly fit.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {NEED_LABELS.map((item) => (
              <OptionButton
                key={item.key}
                active={Boolean(intake[item.key])}
                onClick={() => toggle(item.key)}
              >
                <span className="mr-2 text-lg" aria-hidden>
                  {item.emoji}
                </span>
                <span className="font-medium">{item.label}</span>
              </OptionButton>
            ))}
          </div>
        </section>
      )}

      {/* Step 4 – Action plan */}
      {step === 4 && (
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-900">
              Would you like a simple action plan?
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              We'll create a step-by-step guide with what to bring and who to call.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <OptionButton active={intake.wantsPlan} onClick={() => set("wantsPlan", true)}>
              <span className="block font-bold">Yes, create a plan</span>
              <span className="text-xs text-slate-400">Step-by-step guide</span>
            </OptionButton>
            <OptionButton active={!intake.wantsPlan} onClick={() => set("wantsPlan", false)}>
              <span className="block font-bold">Just show options</span>
              <span className="text-xs text-slate-400">Skip the plan</span>
            </OptionButton>
          </div>
        </section>
      )}

      {/* Nav */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-100 pt-4">
        <div className="flex gap-2">
          {step > 0 && (
            <button className="btn-secondary" onClick={() => setStep((s) => s - 1)}>
              ← Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button className="btn-primary" onClick={() => setStep((s) => s + 1)}>
              Continue →
            </button>
          ) : (
            <button className="btn-primary" onClick={() => submit(intake)}>
              See my options →
            </button>
          )}
        </div>
        <button
          className="text-xs font-medium text-brand-400 underline decoration-dotted hover:text-brand-600"
          onClick={useMaria}
        >
          Use demo persona
        </button>
      </div>
    </div>
  );
}
