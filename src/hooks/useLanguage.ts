import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

/**
 * Custom hook to access LanguageContext
 * Note: This is also exported from LanguageContext.tsx for backward compatibility
 * @throws Error if used outside of LanguageProvider
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
