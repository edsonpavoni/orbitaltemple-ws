import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Google Cloud Translation API supported languages (136 total)
export const SUPPORTED_LANGUAGES = [
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans'},
  { code: 'ak', name: 'Twi (Akan)', nativeName: 'Twi'},
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ'},
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া'},
  { code: 'ay', name: 'Aymara', nativeName: 'Aymar aru'},
  { code: 'az', name: 'Azerbaijani', nativeName: 'azərbaycan dili'},
  { code: 'be', name: 'Belarusian', nativeName: 'беларуская мова'},
  { code: 'bg', name: 'Bulgarian', nativeName: 'български'},
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी'},
  { code: 'bm', name: 'Bambara', nativeName: 'Bamanankan'},
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা'},
  { code: 'bs', name: 'Bosnian', nativeName: 'bosanski'},
  { code: 'ca', name: 'Catalan', nativeName: 'català'},
  { code: 'ceb', name: 'Cebuano', nativeName: 'Cebuano'},
  { code: 'ckb', name: 'Kurdish (Sorani)', nativeName: 'کوردی', rtl: true },
  { code: 'co', name: 'Corsican', nativeName: 'corsu'},
  { code: 'cs', name: 'Czech', nativeName: 'čeština'},
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg'},
  { code: 'da', name: 'Danish', nativeName: 'dansk'},
  { code: 'de', name: 'German', nativeName: 'Deutsch'},
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी'},
  { code: 'dv', name: 'Dhivehi', nativeName: 'ދިވެހި', rtl: true },
  { code: 'ee', name: 'Ewe', nativeName: 'Eʋegbe'},
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά'},
  { code: 'en', name: 'English', nativeName: 'English'},
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto'},
  { code: 'es', name: 'Spanish', nativeName: 'Español'},
  { code: 'et', name: 'Estonian', nativeName: 'eesti'},
  { code: 'eu', name: 'Basque', nativeName: 'euskara'},
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', rtl: true },
  { code: 'fi', name: 'Finnish', nativeName: 'suomi'},
  { code: 'fil', name: 'Filipino', nativeName: 'Wikang Filipino'},
  { code: 'fr', name: 'French', nativeName: 'français'},
  { code: 'fy', name: 'Frisian', nativeName: 'Frysk'},
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge'},
  { code: 'gd', name: 'Scots Gaelic', nativeName: 'Gàidhlig'},
  { code: 'gl', name: 'Galician', nativeName: 'Galego'},
  { code: 'gn', name: 'Guarani', nativeName: 'Avañeʼẽ'},
  { code: 'gom', name: 'Konkani', nativeName: 'कोंकणी'},
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી'},
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa'},
  { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi'},
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', rtl: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी'},
  { code: 'hmn', name: 'Hmong', nativeName: 'Hmoob'},
  { code: 'hr', name: 'Croatian', nativeName: 'hrvatski'},
  { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl ayisyen'},
  { code: 'hu', name: 'Hungarian', nativeName: 'magyar'},
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն'},
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia'},
  { code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo'},
  { code: 'ilo', name: 'Ilocano', nativeName: 'Iloko'},
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska'},
  { code: 'it', name: 'Italian', nativeName: 'Italiano'},
  { code: 'ja', name: 'Japanese', nativeName: '日本語'},
  { code: 'jv', name: 'Javanese', nativeName: 'Basa Jawa'},
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული'},
  { code: 'kk', name: 'Kazakh', nativeName: 'қазақ тілі'},
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ'},
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ'},
  { code: 'ko', name: 'Korean', nativeName: '한국어'},
  { code: 'kri', name: 'Krio', nativeName: 'Krio'},
  { code: 'ku', name: 'Kurdish (Kurmanji)', nativeName: 'Kurdî'},
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча'},
  { code: 'la', name: 'Latin', nativeName: 'Latina'},
  { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch'},
  { code: 'lg', name: 'Luganda', nativeName: 'Luganda'},
  { code: 'ln', name: 'Lingala', nativeName: 'Lingála'},
  { code: 'lo', name: 'Lao', nativeName: 'ພາສາລາວ'},
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių'},
  { code: 'lus', name: 'Mizo', nativeName: 'Mizo ṭawng'},
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu'},
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली'},
  { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy'},
  { code: 'mi', name: 'Maori', nativeName: 'te reo Māori'},
  { code: 'mk', name: 'Macedonian', nativeName: 'македонски'},
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം'},
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол хэл'},
  { code: 'mni-Mtei', name: 'Meiteilon (Manipuri)', nativeName: 'মৈতৈলোন্'},
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी'},
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu'},
  { code: 'mt', name: 'Maltese', nativeName: 'Malti'},
  { code: 'my', name: 'Myanmar (Burmese)', nativeName: 'ဗမာစာ'},
  { code: 'nb', name: 'Norwegian', nativeName: 'Norsk'},
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली'},
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands'},
  { code: 'nso', name: 'Sepedi', nativeName: 'Sesotho sa Leboa'},
  { code: 'ny', name: 'Nyanja (Chichewa)', nativeName: 'Chichewa'},
  { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo'},
  { code: 'or', name: 'Odia (Oriya)', nativeName: 'ଓଡ଼ିଆ'},
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ'},
  { code: 'pl', name: 'Polish', nativeName: 'Polski'},
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', rtl: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português'},
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português Brasileiro'},
  { code: 'qu', name: 'Quechua', nativeName: 'Runasimi'},
  { code: 'ro', name: 'Romanian', nativeName: 'Română'},
  { code: 'ru', name: 'Russian', nativeName: 'Русский'},
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda'},
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्'},
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', rtl: true },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල'},
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina'},
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina'},
  { code: 'sm', name: 'Samoan', nativeName: 'Gagana Sāmoa'},
  { code: 'sn', name: 'Shona', nativeName: 'chiShona'},
  { code: 'so', name: 'Somali', nativeName: 'Soomaaliga'},
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip'},
  { code: 'sr', name: 'Serbian', nativeName: 'Српски'},
  { code: 'st', name: 'Sesotho', nativeName: 'Sesotho'},
  { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda'},
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska'},
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili'},
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்'},
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు'},
  { code: 'tg', name: 'Tajik', nativeName: 'тоҷикӣ'},
  { code: 'th', name: 'Thai', nativeName: 'ไทย'},
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ'},
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmençe'},
  { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog'},
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe'},
  { code: 'ts', name: 'Tsonga', nativeName: 'Xitsonga'},
  { code: 'tt', name: 'Tatar', nativeName: 'татар теле'},
  { code: 'ug', name: 'Uyghur', nativeName: 'ئۇيغۇرچە', rtl: true },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська'},
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', rtl: true },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek'},
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt'},
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa'},
  { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש', rtl: true },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá'},
  { code: 'zh', name: 'Chinese', nativeName: '中文'},
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '中文 (简体)'},
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '中文 (繁體)'},
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu'}
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
    ns: [
      'common',
      'home',
      'send-a-name',
      'manifesto',
      'artist',
      'artwork',
      'brief-history',
      'countdown',
      'donate',
      'education',
      'how-it-works',
      'info',
      'milestones',
      'notify-me',
      'partners',
      'press',
      'space-launch',
      'support',
      'sustainability',
      'team',
      'technical'
    ],
    defaultNS: 'common',

    // Backend configuration
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      // Enable cross origin for CDN support (future optimization)
      crossDomain: false,
    },

    // Language detection order - prioritize localStorage, but fallback to English
    detection: {
      order: ['localStorage', 'htmlTag', 'navigator'],
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
