import { useTranslation } from 'react-i18next';

export default function HomeCTA() {
  const { t, ready } = useTranslation('home');

  // Don't render until translations are loaded
  if (!ready) return null;

  return (
    <p style={{
      fontSize: 'var(--text-display-sm)',
      lineHeight: 'var(--text-display-sm-lh)',
      fontWeight: 200,
      opacity: 0.5,
      margin: 0,
      textAlign: 'center'
    }}>
      <a
        href="#dome"
        style={{
          color: 'inherit',
          textDecoration: 'none',
          transition: 'color 0.2s',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold200)'}
        onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}
      >
        <span>{t('cta.link')}</span>
        <img
          src="/UI/arrow.svg"
          alt={t('cta.arrowAlt')}
          style={{
            width: '8px',
            height: '12px',
            opacity: 0.5
          }}
        />
      </a>
    </p>
  );
}
