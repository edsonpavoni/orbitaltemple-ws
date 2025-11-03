import { useTranslation } from 'react-i18next';

export default function HomeHero() {
  const { t, ready } = useTranslation('home');

  // Helper to convert \n to <br/>
  const renderTextWithBreaks = (text: string) => {
    return text.split('\n').map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  // Don't render until translations are loaded
  if (!ready) return null;

  return (
    <>
      <h1 style={{
        fontSize: 'var(--text-display-lg)',
        lineHeight: 'var(--text-display-lg-lh)',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        margin: '0 0 1rem 0',
        color: '#ffffff'
      }}>
        {t('hero.title')}
      </h1>

      <p style={{
        fontSize: 'var(--text-body-std)',
        lineHeight: 'var(--text-body-std-lh)',
        opacity: 0.8,
        margin: 0,
        color: '#ffffff'
      }}>
        {renderTextWithBreaks(t('hero.subtitle'))}
      </p>
    </>
  );
}
