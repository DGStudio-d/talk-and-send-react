import type { Language } from "@/types/api";
import type { SupportedLanguage } from "../locales/translations";

/**
 * Get localized language name from API response
 * The backend already returns the correct localized name in the 'name' field
 * based on the app's locale, so we just use that directly.
 * For admin users who get all language fields, we provide fallback logic.
 */
export const getLocalizedLanguageName = (
  language: Language,
  currentLanguage: SupportedLanguage
): string => {
  switch (currentLanguage) {
    case "ar":
      return language.name_ar || language.name_en || "";
    case "es":
      return language.name_es || language.name_en || "";
    case "en":
    default:
      return language.name_en || "";
  }
};

/**
 * Get localized content with fallback logic
 */
export const getLocalizedField = <T extends Record<string, any>>(
  obj: T,
  field: string,
  currentLanguage: SupportedLanguage
): any => {
  const languageField = `${field}_${currentLanguage}`;
  return obj[languageField] || obj[field] || obj[`${field}_en`] || obj[field];
};
