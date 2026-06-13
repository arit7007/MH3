"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Intake,
  Need,
  NEEDS,
  Transportation,
  Urgency,
} from "@/lib/types";
import { saveIntake } from "@/lib/store";
import { mariaIntake } from "@/lib/demoCases";

const NEED_OPTIONS: { value: Need; emoji: string }[] = [
  { value: "Shelter tonight", emoji: "🛏️" },
  { value: "Food", emoji: "🍽️" },
  { value: "Shower/laundry", emoji: "🚿" },
  { value: "Medical help", emoji: "➕" },
  { value: "ID/document help", emoji: "🪪" },
  { value: "Case management", emoji: "🤝" },
  { value: "Transportation help", emoji: "🚌" },
];

const URGENCY_OPTIONS: Urgency[] = ["Tonight", "This week", "Planning ahead"];
const TRANSPORT_OPTIONS: Transportation[] = [
  "Walking",
  "Public transit",
  "Car",
  "Need transportation help",
];

type BooleanIntakeKey =
  | "hasPet"
  | "hasChildren"
  | "noId"
  | "prefersSpanish"
  | "wheelchairAccess"
  | "womenOrFamilySafe";

const NEED_LABELS: { key: BooleanIntakeKey; label: string }[] = [
  { key: "hasPet", label: "I have a pet" },
  { key: "hasChildren", label: "I have children/family with me" },
  { key: "noId", label: "I do not have ID" },
  { key: "prefersSpanish", label: "I prefer Spanish" },
  { key: "wheelchairAccess", label: "I need wheelchair access" },
  { key: "womenOrFamilySafe", label: "I need women-only or family-safe options" },
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
      className={`rounded-xl border px-4 py-3 text-left text-base font-medium transition ${
        active
          ? "border-brand-500 bg-brand-50 text-brand-800 ring-2 ring-brand-300"
          : "border-brand-100 bg-white text-brand-700 hover:border-brand-300"
      }`}
    >
      {children}
    </button>
  );
}

export default function IntakeForm() {
  const router = useRouter();
  const [intake, setIntake] = useState<Intake>(defaultIntake);
  const [step, setStep] = useState(0);

  const steps = [
    "What you need",
    "Where & when",
    "Getting there",
    "Important needs",
    "Action plan",
  ];

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-1.5">
          {steps.map((label, i) => (
            <div
              key={label}
              className={`h-1.5 flex-1 rounded-full ${
                i <= step ? "bg-brand-500" : "bg-brand-100"
              }`}
              aria-label={`Step ${i + 1}: ${label}`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm font-medium text-brand-600">
        Step {step + 1} of {steps.length}: {steps[step]}
      </p>

      {step === 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-900">
            What do you need right now?
          </h2>
          <p className="text-brand-600">Choose the one that fits best. You can change it later.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {NEED_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                active={intake.need === opt.value}
                onClick={() => set("need", opt.value)}
              >
                <span className="mr-2" aria-hidden>
                  {opt.emoji}
                </span>
                {opt.value}
              </OptionButton>
            ))}
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-900">Where are you?</h2>
            <input
              className="w-full rounded-xl border border-brand-200 px-4 py-3 text-base focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
              value={intake.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Santa Clara, CA"
            />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-900">How urgent is this?</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {URGENCY_OPTIONS.map((u) => (
                <OptionButton key={u} active={intake.urgency === u} onClick={() => set("urgency", u)}>
                  {u}
                </OptionButton>
              ))}
            </div>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-900">How can you get there?</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {TRANSPORT_OPTIONS.map((t) => (
              <OptionButton
                key={t}
                active={intake.transportation === t}
                onClick={() => set("transportation", t)}
              >
                {t}
              </OptionButton>
            ))}
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-900">Any important needs?</h2>
          <p className="text-brand-600">Select all that apply. This helps us find options that truly fit.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {NEED_LABELS.map((item) => (
              <OptionButton
                key={item.key}
                active={Boolean(intake[item.key])}
                onClick={() => toggle(item.key)}
              >
                <span className="mr-2" aria-hidden>
                  {intake[item.key] ? "☑" : "☐"}
                </span>
                {item.label}
              </OptionButton>
            ))}
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-900">
            Would you like a simple action plan?
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <OptionButton active={intake.wantsPlan} onClick={() => set("wantsPlan", true)}>
              Yes, create a plan for me
            </OptionButton>
            <OptionButton active={!intake.wantsPlan} onClick={() => set("wantsPlan", false)}>
              No, just show me options
            </OptionButton>
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex gap-2">
          {step > 0 && (
            <button className="btn-secondary" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button className="btn-primary" onClick={() => setStep((s) => s + 1)}>
              Continue
            </button>
          ) : (
            <button className="btn-primary" onClick={() => submit(intake)}>
              See my options
            </button>
          )}
        </div>
        <button
          className="text-sm font-medium text-brand-500 underline hover:text-brand-700"
          onClick={useMaria}
        >
          Use Maria demo persona
        </button>
      </div>
    </div>
  );
}
