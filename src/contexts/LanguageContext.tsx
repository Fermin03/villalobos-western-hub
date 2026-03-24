/**
 * CONTEXTO DE IDIOMA — Provee funcionalidad multilenguaje ES/EN
 * Guarda preferencia en localStorage. Expone función t() para traducciones.
 */
import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { translations, type Lang } from "@/i18n/translations";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("vw-lang");
    return (stored === "en" ? "en" : "es") as Lang;
  });

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("vw-lang", newLang);
  }, []);

  /** Traduce una clave. Devuelve la clave si no existe traducción. */
  const t = useCallback(
    (key: string): string => {
      return translations[key]?.[lang] ?? key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
