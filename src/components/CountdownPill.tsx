import { SUPPORTED_LANGUAGES } from '../lib/i18n';

export default function CountdownPill() {
  // Get current language from URL path
  const getCurrentLang = () => {
    if (typeof window === 'undefined') return 'en';
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const urlLang = pathParts[0];
    const isSupported = SUPPORTED_LANGUAGES.some(lang => lang.code === urlLang);
    return isSupported ? urlLang : 'en';
  };

  const lang = getCurrentLang();

  return (
    <>
      <style>{`
        .countdown-pill-wrapper {
          display: flex;
          justify-content: center;
          transform: scale(0.9);
          transform-origin: top center;
        }
        .countdown-pill {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          background: rgba(255,255,255,0.05);
          padding: 0.75rem 1.5rem;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.1);
          text-decoration: none;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .countdown-pill:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }
        @media (min-width: 640px) {
          .countdown-pill-wrapper {
            transform: scale(1);
          }
          .countdown-pill {
            flex-direction: row;
            gap: 0.75rem;
            border-radius: 100px;
          }
        }
      `}</style>
      <div className="countdown-pill-wrapper">
        <a href={`/${lang}/space-launch`} className="countdown-pill">
        <span style={{
          fontSize: '12px',
          opacity: 0.6,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#ffffff',
        }}>
          Mission Update
        </span>
        <span style={{
          fontSize: '16px',
          fontWeight: 500,
          color: '#ffffff',
        }}>
          New launch date TBA
        </span>
      </a>
      </div>
    </>
  );
}
