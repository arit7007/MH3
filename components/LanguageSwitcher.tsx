"use client";

import { LANGUAGES } from "@/lib/translations";
import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`rounded px-2 py-1 text-xs font-semibold transition-colors ${
            lang === l.code
              ? "bg-brand-500 text-white"
              : "text-brand-500 hover:bg-brand-100"
          }`}
        >
          {l.native}
        </button>
      ))}
    </div>
  );
}
