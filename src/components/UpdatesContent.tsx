import { useTranslation } from 'react-i18next';

// Updates, newest first. Each post with a `paragraphs` array renders from it;
// "fire-and-ashes" keeps its original field-by-field layout.
export default function UpdatesContent() {
  const { t, i18n, ready } = useTranslation('updates');

  if (!ready) {
    return null;
  }

  const currentLang = i18n.language || 'en';

  // Language options for the switcher
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'pt', label: 'Português' },
    { code: 'es', label: 'Español' },
    { code: 'zh', label: '中文' },
  ];

  const onceAgainParagraphs = t('updates.once-again.content.paragraphs', { returnObjects: true });
  const paragraphs: string[] = Array.isArray(onceAgainParagraphs) ? (onceAgainParagraphs as string[]) : [];

  // A "\n" inside a paragraph is a line break the author chose.
  const withBreaks = (text: string) =>
    text.split('\n').map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));

  const headerLabelStyle = {
    opacity: 0.6,
    marginBottom: '0.5rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  };

  return (
    <div>
      {/* Main Title */}
      <h1 className="artwork-title">
        {t('heading')}
      </h1>

      {/* Once Again Update (latest) */}
      <article className="update-article" style={{ marginTop: '3rem' }}>
        {/* Language Switcher */}
        <p className="body-text" style={{ marginBottom: '2rem', opacity: 0.7 }}>
          {t('readIn')}:{' '}
          {languages.map((lang, index) => (
            <span key={lang.code}>
              {index > 0 && <span style={{ opacity: 0.5 }}> | </span>}
              <a
                href={`/${lang.code}/updates`}
                style={{
                  color: currentLang === lang.code ? 'var(--color-ot-gold200)' : 'var(--color-ot-gold100)',
                  textDecoration: currentLang === lang.code ? 'underline' : 'none',
                  fontWeight: currentLang === lang.code ? 600 : 400
                }}
              >
                {lang.label}
              </a>
            </span>
          ))}
        </p>

        <div style={{ marginBottom: '2rem' }}>
          <p className="body-text" style={headerLabelStyle}>
            {t('latestUpdate')} — {t('updates.once-again.date')}
          </p>
          <h2 className="section-heading" style={{ marginTop: 0 }}>
            {t('updates.once-again.title')}
          </h2>
        </div>

        <div className="update-content">
          <p className="body-text">{t('updates.once-again.content.greeting')}</p>

          {paragraphs.map((text, i) => (
            <p className="body-text" key={i}>{withBreaks(text)}</p>
          ))}

          <p className="body-text">
            {t('updates.once-again.content.signature')}<br />
            {t('updates.once-again.content.name')}
          </p>
        </div>
      </article>

      {/* Fire and Ashes Update (previous) */}
      <article
        className="update-article"
        style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <p className="body-text" style={headerLabelStyle}>
            {t('previousUpdate')} — {t('updates.fire-and-ashes.date')}
          </p>
          <h2 className="section-heading" style={{ marginTop: 0 }}>
            {t('updates.fire-and-ashes.title')}
          </h2>
        </div>

        <div className="update-content">
          <p className="body-text">
            {t('updates.fire-and-ashes.content.greeting')}<br />
            {t('updates.fire-and-ashes.content.opening')}
          </p>

          <p className="body-text">{t('updates.fire-and-ashes.content.launch')}</p>

          <p className="body-text"><em>{t('updates.fire-and-ashes.content.different')}</em></p>

          <p className="body-text">{t('updates.fire-and-ashes.content.failure')}</p>

          <p className="body-text">{t('updates.fire-and-ashes.content.whatNow')}</p>

          <p className="body-text">{t('updates.fire-and-ashes.content.backup')}</p>

          <p className="body-text">{t('updates.fire-and-ashes.content.community')}</p>

          <p className="body-text">{t('updates.fire-and-ashes.content.seeking')}</p>

          <p className="body-text">{t('updates.fire-and-ashes.content.thanks')}</p>

          <p className="body-text">
            {t('updates.fire-and-ashes.content.signature')}<br />
            {t('updates.fire-and-ashes.content.name')}
          </p>
        </div>
      </article>

      {/* Support Section */}
      <div
        className="update-article"
        style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <p className="body-text">
          <strong>{t('support.heading')}:</strong> {t('support.text')}{' '}
          <a
            href={`/${currentLang}/support`}
            style={{ color: 'var(--color-ot-gold200)' }}
          >
            orbitaltemple.art/support
          </a>
        </p>

        <p className="body-text" style={{ marginTop: '1rem' }}>
          <strong>{t('follow.heading')}:</strong>{' '}
          <a
            href="https://instagram.com/edsonpavoni/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--color-ot-gold200)' }}
          >
            instagram.com/edsonpavoni
          </a>
        </p>
      </div>
    </div>
  );
}
