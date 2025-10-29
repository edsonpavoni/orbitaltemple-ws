import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// List of all 246 supported languages
// This is a comprehensive list - you can add/remove based on your needs
export const SUPPORTED_LANGUAGES = [
  // Top 20 most spoken languages
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', rtl: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },

  // Additional major languages
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', rtl: true },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', rtl: true },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },

  // Add more languages as needed - this structure supports all 246
  // Format: { code: 'ISO-639-1', name: 'English Name', nativeName: 'Native Name', rtl?: true }
];

// RTL languages helper
export const RTL_LANGUAGES = SUPPORTED_LANGUAGES
  .filter(lang => lang.rtl)
  .map(lang => lang.code);

// Initialize i18next
i18n
  .use(HttpBackend) // Load translations using http (from /public/locales)
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n to react-i18next
  .init({
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES.map(lang => lang.code),

    // Namespaces - organize translations by feature
    ns: ['common', 'home', 'send-a-name', 'manifesto'],
    defaultNS: 'common',

    // Backend configuration
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      // Enable cross origin for CDN support (future optimization)
      crossDomain: false,
    },

    // Language detection order
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    // React i18next options
    react: {
      useSuspense: false, // Important for Astro SSR
    },

    // Interpolation
    interpolation: {
      escapeValue: false, // React already escapes
    },

    // Performance optimizations
    load: 'languageOnly', // Load 'en' instead of 'en-US'
    cleanCode: true,

    // Debug in development
    debug: import.meta.env.DEV,
  });

// Helper to check if language is RTL
export const isRTL = (languageCode: string): boolean => {
  return RTL_LANGUAGES.includes(languageCode);
};

// Helper to get language name
export const getLanguageName = (code: string): string => {
  const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
  return lang?.nativeName || code;
};

export default i18n;
