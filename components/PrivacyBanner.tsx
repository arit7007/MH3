"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function PrivacyBanner({
  variant = "demo",
}: {
  variant?: "demo" | "privacy";
}) {
  const { t } = useLanguage();

  if (variant === "privacy") {
    return (
      <div className="flex items-start gap-3 border border-brand-200 bg-brand-50 px-4 py-3 rounded-sm">
        <span className="section-label mt-0.5">{t.privateLabel}</span>
        <p className="text-base text-brand-700">{t.privateText}</p>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 border border-amber-200 bg-amber-50 px-4 py-3 rounded-sm">
      <span className="section-label mt-0.5 text-amber-700">{t.noteLabel}</span>
      <p className="text-base text-amber-900">{t.noteText}</p>
    </div>
  );
}
