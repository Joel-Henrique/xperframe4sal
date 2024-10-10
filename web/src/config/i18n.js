import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend'; // Opcional para carregamento dinâmico

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
  // Usar HttpBackend se quiser carregar arquivos de forma dinâmica
  .use(HttpBackend) 
  // Detectar automaticamente o idioma do navegador
  .use(LanguageDetector) 
  // Conectar com React
  .use(initReactI18next) 
  .init({
    resources, // Definir os recursos de tradução manualmente (se não usar HttpBackend)
    fallbackLng: 'en', // Idioma padrão se o idioma detectado não for suportado
    supportedLngs: ['en', 'pt-BR'], // Definir os idiomas suportados
    detection: {
      order: ['querystring', 'localStorage', 'navigator'], // Ordem de detecção (querystring, armazenamento local, navegador)
      caches: ['localStorage'], // Onde armazenar o idioma detectado
    },
    interpolation: {
      escapeValue: false, // React já escapa os valores por padrão
    },
    keySeparator: false, // Caso suas chaves de tradução não usem separadores como ponto (.)
  });

export default i18n;
