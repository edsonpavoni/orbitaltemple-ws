import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, isRTL } from '../lib/i18n';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  // Languages with home screen translations (for testing)
  const TRANSLATED_LANGS = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'];

  // Split languages into translated and untranslated
  const translatedLanguages = SUPPORTED_LANGUAGES.filter(lang =>
    TRANSLATED_LANGS.includes(lang.code)
  );
  const untranslatedLanguages = SUPPORTED_LANGUAGES.filter(lang =>
    !TRANSLATED_LANGS.includes(lang.code)
  );

  // Set default language to English if none is set
  useEffect(() => {
    // Only set to English if the current language is not one of our supported languages
    const currentLang = i18n.language;
    const isSupported = SUPPORTED_LANGUAGES.some(lang => lang.code === currentLang);

    if (!isSupported) {
      i18n.changeLanguage('en');
    }
  }, []);

  // Update HTML attributes when language changes
  useEffect(() => {
    const currentLang = i18n.language;
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRTL(currentLang) ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    // Close the drawer after selecting a language
    const drawer = document.querySelector('#lang-drawer');
    const btnLang = document.querySelector('#btn-lang');
    if (drawer && btnLang) {
      drawer.setAttribute('data-open', 'false');
      btnLang.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === i18n.language);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(event.target.value);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '520px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem',
    }}>
      {/* Language Icon */}
      <img
        src="/lang_icon_pos.svg"
        alt="languages"
        style={{
          width: '70px',
          height: '70px',
          marginBottom: '1rem',
        }}
      />

      {/* Language Select Dropdown */}
      <select
        value={i18n.language}
        onChange={handleSelectChange}
        style={{
          width: '100%',
          padding: '1rem 1.5rem',
          fontSize: '18px',
          fontWeight: 400,
          color: 'var(--color-ot-gold600)',
          backgroundColor: '#fff',
          border: '2px solid var(--color-ot-gold600)',
          borderRadius: '0',
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23553903' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 1.5rem center',
          paddingRight: '3.5rem',
        }}
        aria-label="Select language"
      >
        <optgroup label="✓ Translated (Home Screen)">
          {translatedLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName}
            </option>
          ))}
        </optgroup>
        <optgroup label="Other Languages (English fallback)">
          {untranslatedLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName}
            </option>
          ))}
        </optgroup>
      </select>

      {/* Subtitle */}
      <div style={{
        fontSize: '14px',
        fontWeight: 400,
        color: 'var(--color-ot-gold600)',
        lineHeight: 1.5,
        textAlign: 'center',
        width: '100%',
      }}>
        {translatedLanguages.length} languages translated • {SUPPORTED_LANGUAGES.length} total
        <br />
        <span style={{ fontSize: '12px', opacity: 0.7 }}>
          (Home screen only for testing)
        </span>
      </div>
    </div>
  );
}
