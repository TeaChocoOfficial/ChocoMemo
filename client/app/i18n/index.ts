// -Path: 'Vite-React-Router-TypeScript/app/i18n/index.ts'
import i18n from 'i18next';
import { resources } from './locales';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector);

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'en-US',
    interpolation: { escapeValue: false },
    detection: {
        order: ['cookie', 'localStorage', 'navigator'],
        caches: ['cookie', 'localStorage'],
        lookupCookie: 'i18next',
        cookieMinutes: 10080,
        lookupLocalStorage: 'i18next',
    },
});

export default i18n;
