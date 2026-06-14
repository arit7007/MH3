"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LangCode, TRANSLATIONS, Translations } from "./translations";

type LanguageContextValue = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: TRANSLATIONS.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem("harbor_lang") as LangCode | null;
    if (saved && saved in TRANSLATIONS) setLangState(saved);
  }, []);

  function setLang(l: LangCode) {
    setLangState(l);
    localStorage.setItem("harbor_lang", l);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: TRANSLATIONS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
