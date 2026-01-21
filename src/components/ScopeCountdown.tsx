import { useTranslation } from 'react-i18next';
import { countdownTranslations } from '../data/countdownTranslations';

export default function ScopeCountdown() {
  const { i18n } = useTranslation();

  // Get translation based on current i18n language
  const currentTranslation = countdownTranslations.find(t => t.code === i18n.language)
    || countdownTranslations.find(t => t.code === 'en')
    || countdownTranslations[0];

  return (
    <>
      {/* Title */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{
          fontSize: '27px',
          fontWeight: 700,
          lineHeight: 1.1,
          color: '#ffffff',
          margin: 0,
          textAlign: 'center'
        }}>
          Edson Pavoni
        </h1>
        <div style={{ height: '0.6rem' }}></div>
        <h2 style={{
          fontSize: '36px',
          fontWeight: 700,
          lineHeight: 1.1,
          color: '#ffffff',
          margin: 0,
          textAlign: 'center'
        }}>
          Orbital Temple
        </h2>
      </div>

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
