
import { createContext, useContext, useState } from "react";
import translations from "@/translations"; // Fix import statement

export type LanguageCode = "en" | "es" | "de" | "nl" | "fr" | "ca" | "pt";

type LanguageContextType = {
  language: LanguageCode;
  t: (key: string) => string;
  setLanguage: (language: LanguageCode) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode>("es");

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value === undefined) return key;
      value = value[k];
    }

    if (typeof value !== "string") return key;
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
