"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Intake, Need, Transportation, Urgency } from "@/lib/types";
import { saveIntake } from "@/lib/store";
import { saveContactRequest } from "@/lib/contactRequests";
import { mariaIntake } from "@/lib/demoCases";
import { useLanguage } from "@/lib/LanguageContext";

type DisplayNeed = Exclude<Need, "Transportation help">;

const NEED_KEYS: DisplayNeed[] = [
  "Shelter",
  "Food",
  "Shower/laundry",
  "Medical help",
  "ID/document help",
  "Recovery support",
];

const URGENCY_KEYS: Urgency[] = ["Tonight", "This week", "Planning ahead"];

const TRANSPORT_KEYS: Transportation[] = [
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

const CONSTRAINT_KEYS: BooleanIntakeKey[] = [
  "hasPet",
  "hasChildren",
  "noId",
  "prefersSpanish",
  "wheelchairAccess",
  "womenOrFamilySafe",
];

const defaultIntake: Intake = {
  need: "Shelter",
  location: "Santa Clara, CA",
  requestName: "",
  useCurrentLocation: false,
  currentCoordinates: null,
  urgency: "Tonight",
  transportation: "Walking",
  hasPet: false,
  hasChildren: false,
  noId: false,
  prefersSpanish: false,
  wheelchairAccess: false,
  womenOrFamilySafe: false,
  wantsPlan: true,
  wantsContact: false,
  contactPhone: "",
  contactEmail: "",
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
      className={`relative rounded-sm border px-4 py-4 text-left transition-all duration-150 ${
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
  const { t } = useLanguage();
  const [intake, setIntake] = useState<Intake>(defaultIntake);
  const [step, setStep] = useState(0);
  const [typedLocation, setTypedLocation] = useState(defaultIntake.location);
  const [locationStatus, setLocationStatus] = useState<string>("");
  const [locationError, setLocationError] = useState<string>("");

  function set<K extends keyof Intake>(key: K, value: Intake[K]) {
    setIntake((prev) => ({ ...prev, [key]: value }));
  }

  function toggle(key: BooleanIntakeKey) {
    setIntake((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function submit(data: Intake) {
    saveIntake(data);
    if (data.wantsContact) saveContactRequest(data);
    router.push("/results");
  }

  function useMaria() {
    setIntake(mariaIntake);
    setTypedLocation(mariaIntake.location);
    submit(mariaIntake);
  }

  function useCurrentLocation() {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setLocationError("Current location is not available in this browser.");
      setLocationStatus("");
      return;
    }
    setLocationError("");
    setLocationStatus("Getting your current location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setIntake((prev) => ({
          ...prev,
          useCurrentLocation: true,
          currentCoordinates: { latitude, longitude },
          location: `Current location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
        }));
        setLocationStatus("Current location added.");
      },
      (error) => {
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied. You can keep the city you entered instead."
            : "Could not get your location. You can keep the city you entered instead."
        );
        setLocationStatus("");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }

  return (
    <div className="space-y-10">
      {/* Step indicator */}
      <div className="space-y-4">
        <div className="flex gap-1.5">
          {t.steps.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? "bg-brand-500" : "bg-brand-200"
              }`}
            />
          ))}
        </div>
        <div className="flex items-baseline justify-between">
          <p className="font-display text-sm italic text-brand-500">{t.steps[step]}</p>
          <p className="section-label text-[10px]">{step + 1} / {t.steps.length}</p>
        </div>
      </div>

      {/* Step 0 – Need */}
      {step === 0 && (
        <section className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-900">
              {t.whatDoYouNeed}
            </h2>
            <p className="mt-1 text-sm text-brand-700">{t.whatDoYouNeedSub}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {NEED_KEYS.map((key) => (
              <OptionButton
                key={key}
                active={intake.need === key}
                onClick={() => set("need", key)}
              >
                <span className="block text-lg font-semibold leading-tight sm:text-xl">
                  {t.needLabels[key]}
                </span>
                <p className="mt-1 text-sm leading-snug text-brand-500">
                  {t.needs[key]}
                </p>
              </OptionButton>
            ))}
          </div>
        </section>
      )}

      {/* Step 1 – Location & urgency */}
      {step === 1 && (
        <section className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-brand-900">{t.whereAreYou}</h2>
            <input
              className="field-input"
              value={intake.location}
              onChange={(e) => {
                const value = e.target.value;
                setTypedLocation(value);
                setIntake((prev) => ({
                  ...prev,
                  location: value,
                  useCurrentLocation: false,
                  currentCoordinates: null,
                }));
              }}
              placeholder={t.locationPlaceholder}
            />
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                className="text-sm font-semibold text-brand-600 underline decoration-dotted hover:text-brand-800 transition-colors"
                onClick={useCurrentLocation}
              >
                {t.useCurrentLocation}
              </button>
              {intake.useCurrentLocation && (
                <button
                  type="button"
                  className="text-sm text-brand-400 underline decoration-dotted hover:text-brand-600 transition-colors"
                  onClick={() =>
                    setIntake((prev) => ({
                      ...prev,
                      useCurrentLocation: false,
                      currentCoordinates: null,
                      location: typedLocation,
                    }))
                  }
                >
                  {t.useTypedAddress}
                </button>
              )}
            </div>
            {locationStatus && <p className="text-sm text-brand-600">{locationStatus}</p>}
            {locationError && <p className="text-sm text-amber-700">{locationError}</p>}
          </div>

          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-brand-900">{t.howUrgent}</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {URGENCY_KEYS.map((key) => (
                <OptionButton
                  key={key}
                  active={intake.urgency === key}
                  onClick={() => set("urgency", key)}
                >
                  <span className="block text-lg font-semibold leading-tight sm:text-xl">
                    {t.urgency[key].label}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-brand-500">
                    {t.urgency[key].sub}
                  </span>
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
            <h2 className="font-display text-2xl font-bold text-brand-900">{t.howGetThere}</h2>
            <p className="mt-1 text-sm text-brand-700">{t.howGetThereSub}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {TRANSPORT_KEYS.map((key) => (
              <OptionButton
                key={key}
                active={intake.transportation === key}
                onClick={() => set("transportation", key)}
              >
                <span className="block text-lg font-semibold leading-tight sm:text-xl">
                  {t.transport[key]}
                </span>
              </OptionButton>
            ))}
          </div>
        </section>
      )}

      {/* Step 3 – Important needs */}
      {step === 3 && (
        <section className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-900">{t.importantNeeds}</h2>
            <p className="mt-1 text-sm text-brand-700">{t.importantNeedsSub}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {CONSTRAINT_KEYS.map((key) => (
              <OptionButton
                key={key}
                active={Boolean(intake[key])}
                onClick={() => toggle(key)}
              >
                <span className="block text-lg font-medium leading-tight sm:text-xl">
                  {t.constraints[key]}
                </span>
              </OptionButton>
            ))}
          </div>
        </section>
      )}

      {/* Step 4 – Action plan */}
      {step === 4 && (
        <section className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-900">{t.wantPlan}</h2>
            <p className="mt-1 text-sm text-brand-700">{t.wantPlanSub}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <OptionButton active={intake.wantsPlan} onClick={() => set("wantsPlan", true)}>
              <span className="block text-lg font-semibold leading-tight sm:text-xl">{t.yesPlan}</span>
              <span className="mt-1 block text-sm text-brand-500">{t.yesPlanSub}</span>
            </OptionButton>
            <OptionButton active={!intake.wantsPlan} onClick={() => set("wantsPlan", false)}>
              <span className="block text-lg font-semibold leading-tight sm:text-xl">{t.noPlan}</span>
              <span className="mt-1 block text-sm text-brand-500">{t.noPlanSub}</span>
            </OptionButton>
          </div>
        </section>
      )}

      {/* Step 5 – Stay connected */}
      {step === 5 && (
        <section className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-900">{t.wantContact}</h2>
            <p className="mt-1 text-sm text-brand-700">{t.wantContactSub}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <OptionButton
              active={intake.wantsContact === true}
              onClick={() => set("wantsContact", true)}
            >
              <span className="block text-lg font-semibold leading-tight sm:text-xl">{t.yesContact}</span>
              <span className="mt-1 block text-sm text-brand-500">{t.yesContactSub}</span>
            </OptionButton>
            <OptionButton
              active={intake.wantsContact === false}
              onClick={() => set("wantsContact", false)}
            >
              <span className="block text-lg font-semibold leading-tight sm:text-xl">{t.noContact}</span>
              <span className="mt-1 block text-sm text-brand-500">{t.noContactSub}</span>
            </OptionButton>
          </div>

          {intake.wantsContact && (
            <div className="space-y-4 rounded-sm border border-brand-200 bg-white p-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-brand-900" htmlFor="contact-phone">
                  {t.phoneLabel}
                </label>
                <input
                  id="contact-phone"
                  className="field-input"
                  type="tel"
                  placeholder="(408) 555-0100"
                  value={intake.contactPhone ?? ""}
                  onChange={(e) => set("contactPhone", e.target.value)}
                  autoComplete="tel"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-brand-900" htmlFor="contact-email">
                  {t.emailLabel} <span className="font-normal text-brand-400">{t.emailOptional}</span>
                </label>
                <input
                  id="contact-email"
                  className="field-input"
                  type="email"
                  placeholder="you@example.com"
                  value={intake.contactEmail ?? ""}
                  onChange={(e) => set("contactEmail", e.target.value)}
                  autoComplete="email"
                />
              </div>
              <p className="text-xs text-brand-400">{t.contactPrivacy}</p>
            </div>
          )}
        </section>
      )}

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-200 pt-6">
        <div className="flex gap-3">
          {step > 0 && (
            <button className="btn-secondary py-2.5" onClick={() => setStep((s) => s - 1)}>
              {t.back}
            </button>
          )}
          {step < t.steps.length - 1 ? (
            <button className="btn-primary py-2.5" onClick={() => setStep((s) => s + 1)}>
              {t.continue}
            </button>
          ) : (
            <button className="btn-primary py-2.5" onClick={() => submit(intake)}>
              {t.seeOptions}
            </button>
          )}
        </div>
        <button
          className="text-xs text-brand-400 underline decoration-dotted hover:text-brand-600 transition-colors"
          onClick={useMaria}
        >
          {t.demoPersona}
        </button>
      </div>
    </div>
  );
}
