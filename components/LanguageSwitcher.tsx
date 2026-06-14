"use client";

import { LANGUAGES, LangCode } from "@/lib/translations";
import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as LangCode)}
      className="rounded border border-brand-200 bg-white px-2 py-1.5 text-xs font-semibold text-brand-700 hover:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400 transition-colors cursor-pointer"
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.native}
        </option>
      ))}
    </select>
  );
}
