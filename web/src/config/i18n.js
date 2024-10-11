import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend'; 

// Importar traduções diretamente
import translationEN from '../locales/en/translation.json';
import translationPTBR from '../locales/pt-BR/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  'pt-BR': {
    translation: translationPTBR,
  },
};

i18n
  .use(HttpBackend) 
  // Detectar automaticamente o idioma do navegador
  .use(LanguageDetector) 
  .use(initReactI18next) 
  .init({
    resources, 
    fallbackLng: 'en', 
    supportedLngs: ['en', 'pt-BR'], 
    detection: {
      order: ['querystring', 'localStorage', 'navigator'], 
      caches: ['localStorage'], 
    },
    interpolation: {
      escapeValue: false,
    },
    keySeparator: false, 
  });

export default i18n;
