import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  ReactNode,
} from "react";
import { translations, type SupportedLanguage } from "../locales/translations";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize language from localStorage or default to Arabic
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const savedLanguage = localStorage.getItem(
      "selectedLanguage"
    ) as SupportedLanguage;
    const language =
      savedLanguage && ["ar", "en", "es"].includes(savedLanguage)
        ? savedLanguage
        : "ar";

    // Ensure locale is set for API client
    localStorage.setItem("locale", language);

    return language;
  });

  // Enhanced setLanguage function that persists to localStorage
  const setLanguage = (newLanguage: SupportedLanguage) => {
    if (import.meta.env.DEV) {
      console.log(`Setting language to: ${newLanguage}`);
    }

    // Update state immediately
    setLanguageState(newLanguage);

    // Persist to localStorage for both language context and API client
    localStorage.setItem("selectedLanguage", newLanguage);
    localStorage.setItem("locale", newLanguage); // For API client

    // Force immediate DOM update
    const newDir = getDirection(newLanguage);
    updateDOM(newLanguage, newDir);
  };

  // Function to update DOM immediately
  const updateDOM = (lang: SupportedLanguage, direction: "rtl" | "ltr") => {
    // Set document direction and language
    document.documentElement.dir = direction;
    document.documentElement.lang = lang;

    // Remove all direction classes first
    document.documentElement.classList.remove("rtl", "ltr");
    document.body.classList.remove("rtl", "ltr");

    // Add appropriate direction classes
    document.documentElement.classList.add(direction);
    document.body.classList.add(direction);

    // Force a re-render by updating CSS custom properties
    document.documentElement.style.setProperty("--text-direction", direction);
    document.documentElement.style.setProperty("--current-language", lang);

    // Add data attributes to trigger CSS animations
    document.documentElement.setAttribute("data-language", lang);
    document.documentElement.setAttribute("data-direction", direction);

    if (import.meta.env.DEV) {
      console.log(`DOM updated - Language: ${lang}, Direction: ${direction}`);
    }
  };

  // Translation function using the comprehensive translations
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language] || translations[key].en || key;
  };

  // Determine text direction based on language
  const getDirection = (lang: SupportedLanguage): "rtl" | "ltr" => {
    return lang === "ar" ? "rtl" : "ltr";
  };

  // Direction based on language
  const dir = getDirection(language);

  // Apply direction to HTML element and body classes using useLayoutEffect for immediate DOM updates
  useLayoutEffect(() => {
    updateDOM(language, dir);
  }, [language, dir]);

  // Additional useEffect for logging and cleanup
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(
        `Language state updated - Language: ${language}, Direction: ${dir}`
      );
      console.log(
        `Document dir: ${document.documentElement.dir}, Document lang: ${document.documentElement.lang}`
      );
      console.log(`Body classes: ${document.body.className}`);
    }
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
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