import Link from "next/link";
import PrivacyBanner from "@/components/PrivacyBanner";

const features = [
  {
    label: "Urgency-aware",
    heading: "Help for tonight\nor next week",
    body: "We surface options based on when you need them — emergency beds, same-day services, or longer-term planning.",
  },
  {
    label: "Transportation-first",
    heading: "Only what\nyou can reach",
    body: "Filter by walking, transit, car, or no transportation. We never show you places you can't get to.",
  },
  {
    label: "Fully private",
    heading: "No account,\nno judgment",
    body: "Your answers stay in your browser. Nothing is stored on a server. You choose exactly what to share.",
  },
  {
    label: "Warm handoff",
    heading: "Skip repeating\nyour story",
    body: "A one-tap outreach summary lets workers advocate for you without asking you to start over.",
  },
];

const steps = [
  {
    num: "01",
    title: "Answer a few questions",
    body: "Tell us what you need, where you are, and what constraints matter — pets, ID, language, access.",
  },
  {
    num: "02",
    title: "See ranked options",
    body: "Resources are scored on an algorithm that weighs dozens of factors, not just distance.",
  },
  {
    num: "03",
    title: "Get a clear action plan",
    body: "Who to call, what to bring, what to say — plus a backup if the first option is full.",
  },
];

export default function LandingPage() {
  return (
    <div className="-mx-4">
      {/* ── Hero ── */}
      <section className="mx-auto flex min-h-[72vh] max-w-5xl items-center px-4 pb-16 pt-16">
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <div className="space-y-3">
            <p className="section-label">Housing Dignity · Santa Clara, CA</p>
            <h1 className="font-display text-5xl font-bold leading-[1.1] text-brand-900 sm:text-6xl lg:text-7xl">
              Find the right<br />
              <em className="font-display italic text-brand-500">next step.</em>
            </h1>
          </div>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-brand-700">
            Harbor matches people experiencing housing insecurity with realistic
            nearby resources — ranked by urgency, transportation, language,
            family needs, and accessibility.
          </p>
          <Link
            href="/intake"
            className="btn-primary inline-flex min-w-[16rem] justify-center py-5 text-base"
          >
            Start Navigator
          </Link>
          <div className="mx-auto max-w-lg">
            <PrivacyBanner variant="privacy" />
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-brand-200" />

      {/* ── Features ── */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-5xl space-y-14">
          <div className="text-center">
            <div className="divider">
              <span className="section-label">What we match</span>
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold text-brand-900 sm:text-4xl">
              Matching that <em className="italic text-brand-500">actually helps</em>
            </h2>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.label} className="space-y-3">
                <p className="section-label">{f.label}</p>
                <h3 className="font-display text-xl font-bold leading-snug text-brand-900 whitespace-pre-line">
                  {f.heading}
                </h3>
                <p className="text-sm leading-relaxed text-brand-700">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-brand-200" />

      {/* ── How it works ── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-2xl space-y-12">
          <div className="text-center">
            <div className="divider">
              <span className="section-label">How it works</span>
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold text-brand-900 sm:text-4xl">
              Three steps to a <em className="italic text-brand-500">real plan</em>
            </h2>
          </div>

          <div className="space-y-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex gap-8">
                <div className="flex flex-col items-center">
                  <span className="font-display text-2xl font-bold text-brand-300">
                    {s.num}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="mt-3 h-14 w-px bg-brand-200" />
                  )}
                </div>
                <div className="pb-2 pt-1">
                  <h3 className="font-semibold text-brand-900">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-brand-700">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band ── */}
      <section className="border-t border-brand-200 bg-brand-100 px-4 py-14 text-center">
        <div className="mx-auto max-w-lg space-y-5">
          <h2 className="font-display text-2xl font-bold text-brand-900">
            Let's find what fits <em className="italic text-brand-500">your situation.</em>
          </h2>
          <p className="text-sm text-brand-700">
            No account required. Call to confirm availability before going.
          </p>
          <PrivacyBanner variant="demo" />
        </div>
      </section>
    </div>
  );
}
