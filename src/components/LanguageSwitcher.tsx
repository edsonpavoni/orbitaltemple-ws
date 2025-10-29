import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, isRTL } from '../lib/i18n';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input when opened
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Update HTML attributes when language changes
  useEffect(() => {
    const currentLang = i18n.language;
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRTL(currentLang) ? 'rtl' : 'ltr';
  }, [i18n.language]);

  // Filter languages based on search query
  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    setSearchQuery('');
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === i18n.language);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Current Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          background: 'transparent',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '4px',
          color: 'var(--color-ot-gold100)',
          fontSize: 'var(--text-body-sm)',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>🌐</span>
        <span>{currentLanguage?.nativeName || 'English'}</span>
        <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Select language"
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            right: 0,
            width: '320px',
            maxHeight: '400px',
            background: 'var(--color-ot-dark)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Search Input */}
          <div style={{ padding: '0.75rem', borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search languages"
              style={{
                width: '100%',
                padding: '0.5rem',
                background: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '4px',
                color: 'var(--color-ot-gold100)',
                fontSize: 'var(--text-body-sm)',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
              }}
            />
          </div>

          {/* Language List */}
          <div
            style={{
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  role="option"
                  aria-selected={i18n.language === lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: i18n.language === lang.code
                      ? 'rgba(212, 175, 55, 0.15)'
                      : 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
                    color: 'var(--color-ot-gold100)',
                    fontSize: 'var(--text-body-sm)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => {
                    if (i18n.language !== lang.code) {
                      e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (i18n.language !== lang.code) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{lang.nativeName}</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '0.15rem' }}>
                      {lang.name}
                    </div>
                  </div>
                  {i18n.language === lang.code && (
                    <span style={{ color: 'var(--color-ot-gold200)', fontSize: '1rem' }}>✓</span>
                  )}
                </button>
              ))
            ) : (
              <div
                style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  color: 'var(--color-ot-gold100)',
                  opacity: 0.5,
                  fontSize: 'var(--text-body-sm)',
                }}
              >
                No languages found
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div
            style={{
              padding: '0.5rem 1rem',
              borderTop: '1px solid rgba(212, 175, 55, 0.2)',
              fontSize: '0.75rem',
              opacity: 0.5,
              color: 'var(--color-ot-gold100)',
              textAlign: 'center',
            }}
          >
            {filteredLanguages.length} of {SUPPORTED_LANGUAGES.length} languages
          </div>
        </div>
      )}
    </div>
  );
}
