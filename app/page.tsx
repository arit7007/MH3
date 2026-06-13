import Link from "next/link";
import PrivacyBanner from "@/components/PrivacyBanner";

const stats = [
  { value: "7+", label: "Resource categories" },
  { value: "100%", label: "Private & anonymous" },
  { value: "< 5 min", label: "To find options" },
];

const valueCards = [
  {
    num: "01",
    title: "Personalized matching",
    body: "We rank resources by urgency, transportation, documents, pets, language, family needs, and accessibility — not just distance.",
  },
  {
    num: "02",
    title: "Clear action plans",
    body: "Get a simple plan: who to call, what to bring, what to say, and a backup option if the first is full.",
  },
  {
    num: "03",
    title: "Outreach-ready summaries",
    body: "Generate a warm handoff so outreach workers can help without making people repeat their story.",
  },
];

export default function LandingPage() {
  return (
    <div className="-mx-4">
      {/* ── Hero ── */}
      <section className="hero-surface relative overflow-hidden px-6 pb-24 pt-20 text-center">
        {/* Decorative orbs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-60 w-60 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl space-y-8">
          <span className="chip border border-purple-400/30 bg-purple-500/20 text-purple-200">
            Housing Dignity · Santa Clara, CA
          </span>

          <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Find the right <br />
            <span className="text-gradient">next step, fast.</span>
          </h1>

          <p className="mx-auto max-w-xl text-lg leading-relaxed text-purple-100/75 sm:text-xl">
            DignityLink matches people experiencing housing insecurity with
            realistic nearby resources — ranked by what actually matters to
            your situation.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/intake"
              className="btn w-full bg-white font-bold text-brand-800 shadow-xl hover:bg-brand-50 sm:w-auto"
            >
              Start Navigator →
            </Link>
            <Link
              href="/login"
              className="btn w-full border border-white/20 bg-white/10 font-semibold text-white backdrop-blur hover:bg-white/20 sm:w-auto"
            >
              Worker Login
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-10 border-t border-white/10 pt-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-white">{s.value}</div>
                <div className="mt-0.5 text-sm text-purple-200/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="mx-auto max-w-5xl space-y-12 px-4 pt-12">
        <PrivacyBanner variant="privacy" />

        {/* Value cards */}
        <section className="grid gap-5 sm:grid-cols-3">
          {valueCards.map((c) => (
            <div
              key={c.title}
              className="card card-hover group space-y-3 transition-all duration-200"
            >
              <span className="section-label">{c.num}</span>
              <h2 className="text-lg font-bold text-brand-900">{c.title}</h2>
              <p className="text-sm leading-relaxed text-slate-500">{c.body}</p>
            </div>
          ))}
        </section>

        {/* CTA band */}
        <section className="relative overflow-hidden rounded-3xl bg-brand-600 px-8 py-10 text-center text-white">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/5" />
          </div>
          <div className="relative space-y-4">
            <h2 className="text-2xl font-extrabold">
              Ready to find options that fit?
            </h2>
            <p className="mx-auto max-w-lg text-brand-100/80">
              No account required. You choose what to share. Call to confirm
              before going.
            </p>
            <Link
              href="/intake"
              className="btn mt-2 inline-flex bg-white font-bold text-brand-700 shadow-lg hover:bg-brand-50"
            >
              Start Navigator →
            </Link>
          </div>
        </section>

        <PrivacyBanner variant="demo" />
      </div>
    </div>
  );
}
