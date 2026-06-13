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
    body: "Resources are scored on a match algorithm that weighs dozens of factors, not just distance.",
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
      <section className="mx-auto flex min-h-[70vh] max-w-5xl items-center px-4 pb-20 pt-16">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="font-display text-5xl font-bold leading-[1.1] text-brand-900 sm:text-6xl">
                Find the right<br />
                <span className="font-display italic text-brand-500">
                  next step.
                </span>
              </h1>
            </div>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-brand-700">
              Harbor matches people experiencing housing insecurity with
              realistic nearby resources — ranked by urgency, transportation,
              language, family needs, and accessibility.
            </p>
            <div className="flex justify-center">
              <Link
                href="/intake"
                className="btn-primary min-w-[18rem] px-12 py-5 text-2xl font-bold sm:min-w-[22rem] sm:px-16 sm:py-6 sm:text-3xl"
              >
                Start Navigator
              </Link>
            </div>
            <PrivacyBanner variant="privacy" />
          </div>
        </div>
      </section>

      {/* ── Thin divider ── */}
      <div className="border-t border-brand-200" />

      {/* ── Features ── */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-5xl space-y-14">
          <div className="text-center">
            <div className="divider">
              <span className="section-label">What we match</span>
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold text-brand-900 sm:text-4xl">
              Matching Solutions That <em className="italic">Actually Help</em>
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.label} className="space-y-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-brand-200 bg-brand-50">
                  <span className="section-label text-[10px]">{f.label.slice(0, 2).toUpperCase()}</span>
                </div>
                <p className="section-label">{f.label}</p>
                <h3 className="font-display text-lg font-bold leading-snug text-brand-900 whitespace-pre-line">
                  {f.heading}
                </h3>
                <p className="text-base leading-relaxed text-brand-700">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Thin divider ── */}
      <div className="border-t border-brand-200" />

      {/* ── How it works ── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* Left — decorative blush panel */}
            <div className="hidden rounded-sm bg-brand-100 p-12 lg:block">
              <p className="font-display text-5xl font-bold leading-tight text-brand-900">
                We're more than<br />
                <em className="italic text-brand-500">a directory.</em>
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "We rank by what matters to your situation",
                  "We factor in pets, ID, language, and safety",
                  "We generate a plan, not just a list",
                  "We support outreach workers, too",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base text-brand-700">
                    <span className="mt-0.5 text-brand-400">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — steps */}
            <div className="space-y-10">
              <div>
                <div className="divider">
                  <span className="section-label">How it works</span>
                </div>
                <h2 className="mt-4 font-display text-3xl font-bold text-brand-900 sm:text-4xl">
                  Three steps to a{" "}
                  <em className="italic text-brand-500">real plan</em>
                </h2>
              </div>

              <div className="space-y-8">
                {steps.map((s, i) => (
                  <div key={s.num} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <span className="font-display text-xl font-bold text-brand-300">
                        {s.num}
                      </span>
                      {i < steps.length - 1 && (
                        <div className="mt-2 h-12 w-px bg-brand-200" />
                      )}
                    </div>
                    <div className="pb-2">
                      <h3 className="font-semibold text-brand-900">{s.title}</h3>
                      <p className="mt-1 text-base leading-relaxed text-brand-700">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── CTA band ── */}
      <section className="border-t border-brand-200 bg-brand-100 px-4 py-16 text-center">
        <div className="mx-auto max-w-xl space-y-6">
          <h2 className="font-display text-3xl font-bold text-brand-900 sm:text-4xl">
            Let's create a plan <em className="italic">together.</em>
          </h2>
          <p className="text-base leading-relaxed text-brand-700">
            No account required. You choose what to share. Call to confirm
            before going.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pt-8">
        <PrivacyBanner variant="demo" />
      </div>
    </div>
  );
}
