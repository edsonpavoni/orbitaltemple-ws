import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, isRTL } from '../lib/i18n';

// Top 10 most spoken languages (Brazilian Portuguese first)
const TOP_10_CODES = [
  'br',     // Brazilian Portuguese (first)
  'en',     // English
  'zh-CN',  // Mandarin Chinese (Simplified)
  'hi',     // Hindi
  'es',     // Spanish
  'fr',     // French
  'ar',     // Arabic
  'bn',     // Bengali
  'ru',     // Russian
  'ur'      // Urdu
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  // Get current language from URL path (e.g., /pt/send-a-name -> pt)
  const [currentLang, setCurrentLang] = useState(() => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const urlLang = pathParts[0];
      const isSupported = SUPPORTED_LANGUAGES.some(lang => lang.code === urlLang);
      return isSupported ? urlLang : 'en';
    }
    return 'en';
  });

  // Sync i18n with URL language on mount
  useEffect(() => {
    if (currentLang && currentLang !== i18n.language) {
      i18n.changeLanguage(currentLang);
    }
  }, [currentLang]);

  const changeLanguage = (langCode: string) => {
    // Get current path without language prefix
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const currentPath = pathParts.slice(1).join('/'); // Remove first part (language)

    // Navigate to new language path
    const newPath = currentPath ? `/${langCode}/${currentPath}` : `/${langCode}/`;

    // Close the drawer before navigating
    const drawer = document.querySelector('#lang-drawer');
    const btnLang = document.querySelector('#btn-lang');
    if (drawer && btnLang) {
      drawer.setAttribute('data-open', 'false');
      btnLang.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    // Navigate to the new language path
    window.location.href = newPath;
  };

  // Get language by code
  const getLang = (code: string) => {
    return SUPPORTED_LANGUAGES.find(l => l.code === code);
  };

  // Get current language info
  const currentLangInfo = getLang(currentLang);

  // Get top 10 languages
  const top10Languages = TOP_10_CODES
    .map(code => getLang(code))
    .filter(Boolean) as typeof SUPPORTED_LANGUAGES;

  // Get all languages sorted alphabetically by English name
  const allLanguagesSorted = [...SUPPORTED_LANGUAGES].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const styles = {
    container: {
      width: '100%',
      maxWidth: '520px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '1rem',
    },
    langIcon: {
      width: '70px',
      height: '70px',
      marginBottom: '0.5rem',
    },
    selectedLabel: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#553903',
      marginBottom: '1.5rem',
    },
    sectionHeader: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#553903',
      textAlign: 'center' as const,
      marginBottom: '1rem',
      width: '100%',
    },
    languageList: {
      width: '100%',
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    languageItem: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '0.75rem',
      padding: '0.5rem 0',
      cursor: 'pointer',
      transition: 'opacity 0.15s ease',
      background: 'none',
      border: 'none',
      width: '100%',
      textAlign: 'left' as const,
    },
    nativeName: {
      fontSize: '16px',
      fontWeight: 400,
      color: '#553903',
    },
    nativeNameSelected: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#553903',
    },
    englishName: {
      fontSize: '14px',
      fontWeight: 400,
      color: '#999',
    },
    divider: {
      width: '100%',
      height: '2rem',
      borderBottom: '1px solid #eee',
      marginBottom: '1.5rem',
    },
  };

  return (
    <div style={styles.container}>
      {/* Language Icon */}
      <img
        src="/UI/lang_icon_pos.svg"
        alt="languages"
        style={styles.langIcon}
      />

      {/* Selected Language */}
      <div style={styles.selectedLabel}>
        selected: {currentLangInfo?.name.toLowerCase() || currentLang}
      </div>

      {/* Section Header */}
      <div style={styles.sectionHeader}>Choose from 136 languages</div>

      {/* Top 10 Languages */}
      <ul style={styles.languageList}>
        {top10Languages.map((lang) => {
          const isSelected = lang.code === currentLang;
          return (
            <li key={lang.code}>
              <button
                style={styles.languageItem}
                onClick={() => changeLanguage(lang.code)}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <span style={isSelected ? styles.nativeNameSelected : styles.nativeName}>
                  {lang.nativeName}
                </span>
                <span style={styles.englishName}>{lang.name}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Divider */}
      <div style={styles.divider}></div>

      {/* All Languages (alphabetical) */}
      <ul style={styles.languageList}>
        {allLanguagesSorted.map((lang) => {
          const isSelected = lang.code === currentLang;
          return (
            <li key={lang.code}>
              <button
                style={styles.languageItem}
                onClick={() => changeLanguage(lang.code)}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <span style={isSelected ? styles.nativeNameSelected : styles.nativeName}>
                  {lang.nativeName}
                </span>
                <span style={styles.englishName}>{lang.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
