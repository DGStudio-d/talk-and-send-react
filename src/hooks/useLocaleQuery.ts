import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const SUPPORTED = new Set(["ar", "en", "es"]);

export const withLocale = (path: string, locale?: string) => {
  if (!locale || !SUPPORTED.has(locale)) return path;
  const hasQuery = path.includes("?");
  return `${path}${hasQuery ? "&" : "?"}locale=${encodeURIComponent(locale)}`;
};

/**
 * Syncs LanguageContext with URL query param `?locale=`.
 * Also returns helper to build links preserving current locale.
 */
export const useLocaleQuery = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  const localeFromUrl = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const raw = params.get("locale");
    return raw && SUPPORTED.has(raw) ? raw : null;
  }, [location.search]);

  // URL -> context
  useEffect(() => {
    if (localeFromUrl && localeFromUrl !== language) {
      setLanguage(localeFromUrl as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localeFromUrl]);

  // context -> URL (keep URL stable / shareable)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const current = params.get("locale");

    if (SUPPORTED.has(language) && current !== language) {
      params.set("locale", language);
      navigate(
        { pathname: location.pathname, search: params.toString() },
        { replace: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const linkTo = (path: string) => withLocale(path, language);

  return {
    locale: language,
    linkTo,
  };
};
