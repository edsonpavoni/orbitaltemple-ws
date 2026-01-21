import { useTranslation } from 'react-i18next';
import { countdownTranslations } from '../data/countdownTranslations';
import { SUPPORTED_LANGUAGES } from '../lib/i18n';

// Get current language from URL path
const getCurrentLang = () => {
  if (typeof window === 'undefined') return 'en';
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const urlLang = pathParts[0];
  const isSupported = SUPPORTED_LANGUAGES.some(lang => lang.code === urlLang);
  return isSupported ? urlLang : 'en';
};

export default function RotatingCountdown() {
  const { i18n } = useTranslation();

  // Get translation based on current i18n language
  const currentTranslation = countdownTranslations.find(t => t.code === i18n.language)
    || countdownTranslations.find(t => t.code === 'en')
    || countdownTranslations[0];

  return (
    <>
      {/* Mission Status */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '2rem 0',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 400,
            color: '#ffffff',
            opacity: 0.8,
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            {currentTranslation.statusLabel || 'Mission Update'}
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: 500,
            color: '#ffffff',
            maxWidth: '400px',
            lineHeight: 1.4
          }}>
            {currentTranslation.statusMessage || 'New launch date to be announced'}
          </div>
        </div>
      </div>

      {/* Status Text */}
      <p style={{
        fontSize: '16px',
        lineHeight: 1.6,
        color: '#ffffff',
        opacity: 0.9,
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {currentTranslation.statusDescription || 'We are working on a new launch opportunity.'}
      </p>
    </>
  );
}

// Separate component for notify link that syncs with language rotation
export function RotatingNotifyLink() {
  const { i18n } = useTranslation();
  const lang = getCurrentLang();

  // Get translation based on current i18n language
  const currentTranslation = countdownTranslations.find(t => t.code === i18n.language)
    || countdownTranslations.find(t => t.code === 'en')
    || countdownTranslations[0];

  return (
    <a
      href={`/${lang}/notify-me`}
      style={{
        color: '#ffffff',
        opacity: 0.6,
        fontSize: '14px',
        textDecoration: 'none'
      }}
      className="notify-link-rotating"
    >
      {currentTranslation.notify}
    </a>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="time-unit" style={{
      textAlign: 'center',
      minWidth: '80px'
    }}>
      <div className="time-value" style={{
        fontSize: '48px',
        fontWeight: 700,
        lineHeight: 1,
        color: '#ffffff',
        marginBottom: '0.5rem'
      }}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="time-label" style={{
        fontSize: '14px',
        fontWeight: 400,
        color: '#ffffff',
        opacity: 0.6,
        textTransform: 'lowercase'
      }}>
        {label}
      </div>
    </div>
  );
}
