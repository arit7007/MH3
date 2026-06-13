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
      className={`relative rounded-sm border px-4 py-4 text-left text-sm transition-all duration-150 ${
        active
          ? "border-brand-500 bg-brand-50 text-brand-900 ring-1 ring-brand-400"
          : "border-brand-200 bg-white text-brand-800 hover:border-brand-300 hover:bg-brand-50/60"
      }`}
    >
      {active && (
        <span className="absolute right-3 top-3 text-brand-500 text-xs">◆</span>
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
    <div className="space-y-10">
      {/* Step indicator */}
      <div className="space-y-4">
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? "bg-brand-500" : "bg-brand-200"
              }`}
            />
          ))}
        </div>
        <div className="flex items-baseline justify-between">
          <p className="font-display text-sm italic text-brand-500">
            {steps[step]}
          </p>
          <p className="section-label text-[10px]">
            {step + 1} / {steps.length}
          </p>
        </div>
      </div>

      {/* Step 0 – Need */}
      {step === 0 && (
        <section className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-900">
              What do you need right now?
            </h2>
            <p className="mt-1 text-sm text-brand-700">
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
                <span className="mr-2" aria-hidden>{opt.emoji}</span>
                <span className="font-semibold">{opt.value}</span>
                <p className="mt-0.5 text-xs text-brand-400">{opt.desc}</p>
              </OptionButton>
            ))}
          </div>
        </section>
      )}

      {/* Step 1 – Location & urgency */}
      {step === 1 && (
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-brand-900">
              Where are you?
            </h2>
            <input
              className="field-input"
              value={intake.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Santa Clara, CA"
            />
          </div>
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-brand-900">
              How urgent is this?
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {URGENCY_OPTIONS.map((u) => (
                <OptionButton
                  key={u.value}
                  active={intake.urgency === u.value}
                  onClick={() => set("urgency", u.value)}
                >
                  <span className="block font-semibold">{u.label}</span>
                  <span className="text-xs text-brand-400">{u.sub}</span>
                </OptionButton>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Step 2 – Transportation */}
      {step === 2 && (
        <section className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-900">
              How can you get there?
            </h2>
            <p className="mt-1 text-sm text-brand-700">
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
                <span className="mr-2 text-lg" aria-hidden>{t.emoji}</span>
                <span className="font-semibold">{t.value}</span>
              </OptionButton>
            ))}
          </div>
        </section>
      )}

      {/* Step 3 – Important needs */}
      {step === 3 && (
        <section className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-900">
              Any important needs?
            </h2>
            <p className="mt-1 text-sm text-brand-700">
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
                <span className="mr-2" aria-hidden>{item.emoji}</span>
                <span className="font-medium">{item.label}</span>
              </OptionButton>
            ))}
          </div>
        </section>
      )}

      {/* Step 4 – Action plan */}
      {step === 4 && (
        <section className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-900">
              Would you like a simple action plan?
            </h2>
            <p className="mt-1 text-sm text-brand-700">
              We'll create a step-by-step guide with what to bring and who to call.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <OptionButton active={intake.wantsPlan} onClick={() => set("wantsPlan", true)}>
              <span className="block font-semibold">Yes, create a plan</span>
              <span className="text-xs text-brand-400">Recommended</span>
            </OptionButton>
            <OptionButton active={!intake.wantsPlan} onClick={() => set("wantsPlan", false)}>
              <span className="block font-semibold">Just show options</span>
              <span className="text-xs text-brand-400">Skip the plan</span>
            </OptionButton>
          </div>
        </section>
      )}

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-200 pt-6">
        <div className="flex gap-3">
          {step > 0 && (
            <button className="btn-secondary py-2.5" onClick={() => setStep((s) => s - 1)}>
              ← Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button className="btn-primary py-2.5" onClick={() => setStep((s) => s + 1)}>
              Continue →
            </button>
          ) : (
            <button className="btn-primary py-2.5" onClick={() => submit(intake)}>
              See my options →
            </button>
          )}
        </div>
        <button
          className="text-xs text-brand-400 underline decoration-dotted hover:text-brand-600 transition-colors"
          onClick={useMaria}
        >
          Use demo persona
        </button>
      </div>
    </div>
  );
}
