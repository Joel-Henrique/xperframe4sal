import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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
  .use(initReactI18next)
  .init({
    resources,
    lng: process.env.REACT_APP_DEFAULT_LANG || 'en',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;