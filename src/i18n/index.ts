import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import en from './locales/en.json';
import tr from './locales/tr.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import it from './locales/it.json';
import pt from './locales/pt.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ar from './locales/ar.json';

const resources = {
  en: { translation: en },
  tr: { translation: tr },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  it: { translation: it },
  pt: { translation: pt },
  zh: { translation: zh },
  ja: { translation: ja },
  ar: { translation: ar }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default English for global users
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false
    },
    
    // Debug mode for development
    debug: process.env.NODE_ENV === 'development'
  });

export default i18n;