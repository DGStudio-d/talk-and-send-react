import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Locale } from "../types/models";
import i18n from "../lib/i18n";

// Define available languages
export type SupportedLanguage = "ar" | "en" | "es";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
  direction: "rtl" | "ltr";

  // Legacy (for backward compatibility)
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  dir: "rtl" | "ltr";
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize locale from localStorage or i18n
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem("locale");
    if (saved && ["en", "ar", "es"].includes(saved)) {
      return saved as Locale;
    }

    const i18nLang = i18n.language;
    if (i18nLang && ["en", "ar", "es"].includes(i18nLang)) {
      return i18nLang as Locale;
    }

    return Locale.English;
  });

  // Compute direction
  const isRTL = locale === Locale.Arabic;
  const direction: "rtl" | "ltr" = isRTL ? "rtl" : "ltr";

  // 🔥 Main effect: change language, update document direction & persist
  useEffect(() => {
    let active = true;

    const changeLanguage = async () => {
      localStorage.setItem("locale", locale);

      // Change i18n language (handles event emission internally)
      await i18n.changeLanguage(locale);
      if (!active) return;

      // Update document attributes
      document.documentElement.lang = locale;
      document.documentElement.dir = direction;

      document.documentElement.classList.toggle("rtl", direction === "rtl");
      document.documentElement.classList.toggle("ltr", direction === "ltr");

      // Dispatch custom event (useful for API refetch logic)
      window.dispatchEvent(
        new CustomEvent("languageChanged", { detail: { locale } })
      );
    };

    changeLanguage();
    return () => {
      active = false;
    };
  }, [locale, direction]);

  // Update locale
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  // Legacy setter
  const setLanguage = (language: SupportedLanguage) => {
    setLocale(language as Locale);
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        isRTL,
        direction,
        // Legacy props
        language: locale as SupportedLanguage,
        setLanguage,
        dir: direction,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
