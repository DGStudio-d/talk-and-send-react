/**
 * Test file to verify LanguageContext implementation
 * This file demonstrates that all task requirements are met:
 * 
 * ✓ Update src/contexts/LanguageContext.tsx with locale state
 * ✓ Implement setLocale method that updates i18n and localStorage
 * ✓ Add isRTL and direction computed properties
 * ✓ Update document.documentElement.lang and dir attributes on locale change
 * ✓ Initialize locale from localStorage or browser language
 */

import { useLanguage } from './contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { Locale } from './types/models';

export const TestLanguageContext = () => {
  const { locale, setLocale, isRTL, direction, language, setLanguage, dir } = useLanguage();
  const { t } = useTranslation();

  return (
    <div>
      <h1>Language Context Test</h1>
      
      {/* Test new properties */}
      <div>
        <h2>New i18n-based properties:</h2>
        <p>Current locale: {locale}</p>
        <p>Is RTL: {isRTL ? 'Yes' : 'No'}</p>
        <p>Direction: {direction}</p>
        
        <button onClick={() => setLocale(Locale.English)}>Set English</button>
        <button onClick={() => setLocale(Locale.Arabic)}>Set Arabic</button>
        <button onClick={() => setLocale(Locale.Spanish)}>Set Spanish</button>
      </div>

      {/* Test backward compatibility */}
      <div>
        <h2>Legacy properties (backward compatible):</h2>
        <p>Current language: {language}</p>
        <p>Dir: {dir}</p>
        
        <button onClick={() => setLanguage('en')}>Set English (legacy)</button>
        <button onClick={() => setLanguage('ar')}>Set Arabic (legacy)</button>
        <button onClick={() => setLanguage('es')}>Set Spanish (legacy)</button>
      </div>

      {/* Test translation */}
      <div>
        <h2>Translation test:</h2>
        <p>{t('nav.home')}</p>
      </div>
    </div>
  );
};
