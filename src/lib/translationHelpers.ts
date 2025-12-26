import { TFunction } from 'i18next';
import { Locale } from '@/types/models';

/**
 * Get localized content from multilingual object
 * @param content - Object with translations for each locale
 * @param locale - Current locale
 * @param fallback - Fallback value if content is undefined
 * @returns Localized content or fallback
 */
export function getLocalizedContent<T extends Record<string, any>>(
  content: { en: T; ar: T; es: T } | undefined,
  locale: Locale,
  fallback: T
): T {
  if (!content) return fallback;
  return content[locale] || content.en || fallback;
}

/**
 * Get localized string from multilingual object
 * @param content - Object with string translations for each locale
 * @param locale - Current locale
 * @param fallback - Fallback string if content is undefined
 * @returns Localized string or fallback
 */
export function getLocalizedString(
  content: { en: string; ar: string; es: string } | undefined,
  locale: Locale,
  fallback: string = ''
): string {
  if (!content) return fallback;
  return content[locale] || content.en || fallback;
}

/**
 * Format translation key with interpolation
 * @param t - Translation function from useTranslation
 * @param key - Translation key
 * @param values - Optional interpolation values
 * @returns Formatted translation string
 */
export function formatTranslation(
  t: TFunction,
  key: string,
  values?: Record<string, any>
): string {
  return t(key, values) as string;
}

/**
 * Get translated error message from error object
 * @param error - Error object from API or other source
 * @param t - Translation function from useTranslation
 * @param defaultKey - Default translation key if no specific error message
 * @returns Translated error message
 */
export function getErrorMessage(
  error: any,
  t: TFunction,
  defaultKey: string = 'error.generic'
): string {
  // Check for API response error message
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Check for general error message
  if (error?.message) {
    // Check if it's a network error
    if (error.message === 'Network Error') {
      return t('error.networkError');
    }
    return error.message;
  }
  
  // Return default translated error message
  return t(defaultKey);
}

/**
 * Get translated validation errors from API response
 * @param error - Error object from API
 * @param t - Translation function from useTranslation
 * @returns Object with field names as keys and translated error messages as values
 */
export function getValidationErrors(
  error: any,
  t: TFunction
): Record<string, string> | null {
  if (!error?.response?.data?.errors) {
    return null;
  }
  
  const errors = error.response.data.errors;
  const translatedErrors: Record<string, string> = {};
  
  // Convert Laravel validation errors to translated messages
  Object.keys(errors).forEach((field) => {
    const fieldErrors = errors[field];
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      // Use the first error message for each field
      translatedErrors[field] = fieldErrors[0];
    }
  });
  
  return translatedErrors;
}

/**
 * Check if a translation key exists
 * @param t - Translation function from useTranslation
 * @param key - Translation key to check
 * @returns True if key exists, false otherwise
 */
export function translationKeyExists(t: TFunction, key: string): boolean {
  const translation = t(key);
  return translation !== key;
}

/**
 * Get translated role name
 * @param role - User role
 * @param t - Translation function from useTranslation
 * @returns Translated role name
 */
export function getTranslatedRole(role: string, t: TFunction): string {
  const roleKey = `roles.${role}`;
  return translationKeyExists(t, roleKey) ? t(roleKey) : role;
}

/**
 * Get translated level name
 * @param level - User or quiz level
 * @param t - Translation function from useTranslation
 * @returns Translated level name
 */
export function getTranslatedLevel(level: string, t: TFunction): string {
  const levelKey = `levels.${level}`;
  if (translationKeyExists(t, levelKey)) {
    return t(levelKey);
  }
  
  // Try alternative level key format
  const altLevelKey = `level.${level}`;
  return translationKeyExists(t, altLevelKey) ? t(altLevelKey) : level;
}

/**
 * Get translated subscription type
 * @param type - Subscription type
 * @param t - Translation function from useTranslation
 * @returns Translated subscription type
 */
export function getTranslatedSubscriptionType(type: string, t: TFunction): string {
  const typeKey = `subscription.${type}`;
  return translationKeyExists(t, typeKey) ? t(typeKey) : type;
}

/**
 * Format date with locale
 * @param date - Date string or Date object
 * @param locale - Current locale
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatLocalizedDate(
  date: string | Date,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  
  return dateObj.toLocaleDateString(locale, defaultOptions);
}

/**
 * Format number with locale
 * @param number - Number to format
 * @param locale - Current locale
 * @param options - Intl.NumberFormatOptions
 * @returns Formatted number string
 */
export function formatLocalizedNumber(
  number: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  return number.toLocaleString(locale, options);
}

/**
 * Get translated field from multilingual object
 * @param content - Object with translations for each locale
 * @param locale - Current locale
 * @param fallback - Fallback value if content is undefined
 * @returns Localized content or fallback
 */
export function getTranslatedField(
  content: { en: string; ar: string; es: string } | undefined,
  locale: string,
  fallback: string = ''
): string {
  if (!content) return fallback;
  return content[locale as keyof typeof content] || content.en || fallback;
}

/**
 * Get language name from Language object
 * Prefers the localized 'name' field, falls back to name_en/ar/es based on locale
 * @param language - Language object
 * @param locale - Current locale
 * @returns Language name
 */
export function getLanguageName(
  language: { name?: string; name_en?: string; name_ar?: string; name_es?: string } | undefined,
  locale?: string
): string {
  if (!language) return '';
  
  // Prefer the localized name field from API
  if (language.name) return language.name;
  
  // Fallback to specific language fields for admin/legacy support
  if (locale === 'ar' && language.name_ar) return language.name_ar;
  if (locale === 'es' && language.name_es) return language.name_es;
  return language.name_en || '';
}
