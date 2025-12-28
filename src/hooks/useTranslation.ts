import { useLanguage } from '../contexts/LanguageContext';
import { translations, interpolate, getLocalizedContent, formatTime, formatNumber, formatDate } from '../locales/translations';
import type { SupportedLanguage } from '../locales/translations';

export const useTranslation = () => {
  const { language } = useLanguage();

  // Main translation function
  const t = (key: string, variables?: Record<string, string | number>): string => {
    const translation = translations[key];
    
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    let text = translation[language] || translation.en || key;
    
    if (variables) {
      text = interpolate(text, variables);
    }
    
    return text;
  };

  // Get localized content from API responses
  const getLocalized = (content: { en: string; ar?: string; es?: string } | string): string => {
    return getLocalizedContent(content, language);
  };

  // Format time with localization
  const formatTimeLocalized = (seconds: number): string => {
    return formatTime(seconds, language);
  };

  // Format numbers with localization
  const formatNumberLocalized = (num: number): string => {
    return formatNumber(num, language);
  };

  // Format dates with localization
  const formatDateLocalized = (date: Date | string): string => {
    return formatDate(date, language);
  };

  // Get current language
  const getCurrentLanguage = (): SupportedLanguage => {
    return language;
  };

  // Check if current language is RTL
  const isRTL = (): boolean => {
    return language === 'ar';
  };

  // Get language direction
  const getDirection = (): 'rtl' | 'ltr' => {
    return language === 'ar' ? 'rtl' : 'ltr';
  };

  return {
    t,
    getLocalized,
    formatTime: formatTimeLocalized,
    formatNumber: formatNumberLocalized,
    formatDate: formatDateLocalized,
    getCurrentLanguage,
    isRTL,
    getDirection,
    language
  };
};

export default useTranslation;