"use client";

import PrivacyBanner from "@/components/PrivacyBanner";
import DoorButton from "@/components/DoorButton";
import { useLanguage } from "@/lib/LanguageContext";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="-mx-4">
      {/* ── Hero ── */}
      <section className="mx-auto flex min-h-[70vh] max-w-5xl items-center px-4 pb-20 pt-16">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="font-display text-5xl font-bold leading-[1.1] text-brand-900 sm:text-6xl">
                {t.heroHeading}<br />
                <span className="font-display italic text-brand-500">
                  {t.heroSubheading}
                </span>
              </h1>
            </div>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-brand-700">
              {t.heroSubtitle}
            </p>
            <div className="flex justify-center">
              <DoorButton />
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
              <span className="section-label">{t.whatWeMatch}</span>
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold text-brand-900 sm:text-4xl">
              {t.matchingTitle}
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.homeFeatures.map((f, i) => (
              <div key={i} className="space-y-3 text-center">
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
                {t.weAreMore.split("directory")[0]}
                <br />
                <em className="italic text-brand-500">
                  {t.weAreMore.includes("directory") ? "a directory." : t.weAreMore}
                </em>
              </p>
              <ul className="mt-8 space-y-4">
                {t.weAreMoreBullets.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-base text-brand-700">
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
                  <span className="section-label">{t.howItWorks}</span>
                </div>
                <h2 className="mt-4 font-display text-3xl font-bold text-brand-900 sm:text-4xl">
                  {t.threeStepsTitle}
                </h2>
              </div>

              <div className="space-y-8">
                {t.howSteps.map((s, i) => (
                  <div key={s.num} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <span className="font-display text-xl font-bold text-brand-300">
                        {s.num}
                      </span>
                      {i < t.howSteps.length - 1 && (
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
            {t.ctaTitle}
          </h2>
          <p className="text-base leading-relaxed text-brand-700">
            {t.ctaBody}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pt-8">
        <PrivacyBanner variant="demo" />
      </div>
    </div>
  );
}
