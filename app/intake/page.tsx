"use client";

import IntakeForm from "@/components/IntakeForm";
import PrivacyBanner from "@/components/PrivacyBanner";
import PageEntry from "@/components/PageEntry";
import { useLanguage } from "@/lib/LanguageContext";

export default function IntakePage() {
  const { t } = useLanguage();

  return (
    <PageEntry>
      <div className="mx-auto max-w-2xl space-y-8 pt-12">
        <div className="space-y-2">
          <p className="section-label">{t.navigatorLabel}</p>
          <h1 className="font-display text-4xl font-bold text-brand-900">
            {t.intakeHeading1}{" "}
            <em className="italic text-brand-500">{t.intakeHeading2}</em>
          </h1>
          <p className="text-base text-brand-700">{t.intakeSubtitle}</p>
        </div>
        <PrivacyBanner variant="privacy" />
        <IntakeForm />
      </div>
    </PageEntry>
  );
}
