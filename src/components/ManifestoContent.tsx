import { useTranslation } from 'react-i18next';

export default function ManifestoContent() {
  const { t, ready } = useTranslation('manifesto');

  if (!ready) {
    return null;
  }

  const paragraphs = t('paragraphs', { returnObjects: true }) as string[];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '80px 24px', maxWidth: '768px', margin: '0 auto' }}>
      <h2 className="section-heading" style={{ color: 'var(--color-ot-gold100)', margin: '0 0 1rem 0', letterSpacing: '-0.01em' }}>
        {t('title')}
      </h2>

      {paragraphs.map((paragraph, index) => {
        // Split by \n and render with <br> tags
        const lines = paragraph.split('\n');

        return (
          <p key={index} className="body-text" style={{ color: 'var(--color-ot-gold100)' }}>
            {lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {line}
                {lineIndex < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
