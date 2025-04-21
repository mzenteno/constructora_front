import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from "./en/common.json";
import esTranslations from "./es/common.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslations },
            es: { translation: esTranslations }
          },
        fallbackLng: 'es', // Idioma por defecto
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;