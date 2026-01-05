import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type Localized = {
  en?: string;
  ar?: string;
  es?: string;
  [key: string]: any;
};

export const useTranslation = () => {
  const { t, language, dir } = useLanguage();

  const formatNumber = useMemo(() => {
    const locale = language === "ar" ? "ar" : language === "es" ? "es" : "en";
    const nf = new Intl.NumberFormat(locale);
    return (value: number) => nf.format(value);
  }, [language]);

  const getLocalizedContent = <T extends Localized | string | undefined | null>(
    value: T
  ): string => {
    if (!value) return "";
    if (typeof value === "string") return value;

    // Prefer current language then english
    const current = (value as any)[language];
    if (typeof current === "string" && current.length > 0) return current;

    const en = (value as any).en;
    if (typeof en === "string" && en.length > 0) return en;

    // Fallback to any string field
    const first = Object.values(value).find(
      (v) => typeof v === "string" && v.length > 0
    );
    return (first as string) || "";
  };

  // Some components historically use getLocalized()
  const getLocalized = getLocalizedContent;

  return {
    t,
    language,
    dir,
    formatNumber,
    getLocalizedContent,
    getLocalized,
  };
};

export default useTranslation;
