
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { translations } from "@/translations";

export type LanguageCode = "en" | "es" | "de" | "nl" | "fr" | "ca" | "pt";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, variables?: Record<string, string>) => string;
}

const defaultLanguage: LanguageCode = "en";

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const savedLanguage = localStorage.getItem("language");
    return (savedLanguage as LanguageCode) || defaultLanguage;
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    // Force update on all components that use translations
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((newLanguage: LanguageCode) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  }, []);

  const t = useCallback((key: string, variables?: Record<string, string>): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to English or just return the key if not found
        let fallback = translations[defaultLanguage];
        for (const fallbackKey of keys) {
          if (fallback && typeof fallback === "object" && fallbackKey in fallback) {
            fallback = fallback[fallbackKey];
          } else {
            return key;
          }
        }
        return typeof fallback === "string" ? interpolateVariables(fallback, variables) : key;
      }
    }

    return typeof value === "string" ? interpolateVariables(value, variables) : key;
  }, [language]);

  // Helper function to interpolate variables in translation strings
  const interpolateVariables = (text: string, variables?: Record<string, string>): string => {
    if (!variables) return text;
    
    return Object.entries(variables).reduce((result, [key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      return result.replace(regex, value);
    }, text);
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
