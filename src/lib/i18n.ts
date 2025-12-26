import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

const savedLocale = localStorage.getItem('locale') || 'en';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: savedLocale,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar', 'es'],
    debug: false,

    load: 'languageOnly',

    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      requestOptions: {
        cache: 'no-cache',
      },
    },

    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded', // ✅ add “loaded” event binding
      bindI18nStore: 'added removed',     // ✅ ensures React updates after load
    },

    returnEmptyString: false,
    returnNull: false,
  });

// ✅ Make sure language is applied only *after* initialization
i18n.on('initialized', () => {
  i18n.changeLanguage(savedLocale);
});

export default i18n;
