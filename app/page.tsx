import Link from "next/link";
import PrivacyBanner from "@/components/PrivacyBanner";

const valueCards = [
  {
    title: "Personalized matching",
    body: "We rank resources by urgency, transportation, documents, pets, language, family needs, and accessibility — not just distance.",
    icon: "🎯",
  },
  {
    title: "Clear action plans",
    body: "Get a simple plan: who to call, what to bring, what to say, and a backup option if the first is full.",
    icon: "🗺️",
  },
  {
    title: "Outreach-ready summaries",
    body: "Generate a warm handoff so outreach workers can help without making people repeat their story.",
    icon: "🤝",
  },
];

export default function LandingPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-6 pt-6 text-center sm:pt-12">
        <span className="chip mx-auto bg-brand-100 text-brand-700">
          Housing Dignity · Santa Clara, CA
        </span>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-brand-900 sm:text-5xl">
          Find the right next step, fast.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-brand-700">
          DignityLink matches people experiencing housing insecurity with realistic
          nearby resources based on urgency, transportation, documents, pets,
          language, family needs, and accessibility.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/intake" className="btn-primary w-full sm:w-auto">
            Start Navigator
          </Link>
          <Link href="/outreach" className="btn-secondary w-full sm:w-auto">
            Outreach Worker Mode
          </Link>
        </div>
        <div className="mx-auto max-w-2xl space-y-2">
          <PrivacyBanner variant="privacy" />
          <PrivacyBanner variant="demo" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {valueCards.map((c) => (
          <div key={c.title} className="card space-y-2">
            <div className="text-3xl" aria-hidden>
              {c.icon}
            </div>
            <h2 className="text-lg font-bold text-brand-900">{c.title}</h2>
            <p className="text-sm text-brand-700">{c.body}</p>
          </div>
        ))}
      </section>

      <section className="card bg-brand-600 text-center text-white">
        <h2 className="text-xl font-bold">Here are options that may fit your situation.</h2>
        <p className="mx-auto mt-2 max-w-xl text-brand-50">
          No account required. You choose what to share. Call to confirm before
          going.
        </p>
        <Link href="/intake" className="btn mt-4 bg-white text-brand-700 hover:bg-brand-50">
          Start Navigator
        </Link>
      </section>
    </div>
  );
}
