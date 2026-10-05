import type React from 'react';
import { useTranslation } from 'react-i18next';

export default function HomeHero() {
  const { t, ready } = useTranslation('home');

  // Helper to convert \n to <br/>
  const renderTextWithBreaks = (text: string) => {
    // Each line is its own balanced block, and its last two words never split,
    // so a phone never leaves one word alone on a line ("céu.").
    return text.split('\n').map((line, index) => (
      <span key={index} style={{ display: 'block', textWrap: 'balance' } as React.CSSProperties}>
        {line.replace(/ (\S+)$/, '\u00A0$1')}
      </span>
    ));
  };

  // Show loading state instead of null
  if (!ready) {
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
          Orbital Temple
        </h1>
        <p style={{
          fontSize: 'var(--text-body-std)',
          lineHeight: 'var(--text-body-std-lh)',
          opacity: 0.8,
          margin: 0,
          color: '#ffffff'
        }}>
          A purely artistic satellite from the Global South
        </p>
      </>
    );
  }

  return (
    <div style={{ color: '#ffffff' }}>
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
    </div>
  );
}
