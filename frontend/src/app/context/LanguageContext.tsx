"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { LangKey } from "../lib/translations";

interface LanguageContextType {
  language: LangKey;
  setLanguage: (lang: LangKey) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "EN",
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LangKey>("EN");
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Convenience hook — use this in any screen
export function useLanguage() {
  return useContext(LanguageContext);
}
