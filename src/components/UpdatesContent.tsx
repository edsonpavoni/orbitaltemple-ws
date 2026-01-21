import { useTranslation } from 'react-i18next';

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

  return (
    <div>
      {/* Main Title */}
      <h1 className="artwork-title">
        {t('heading')}
      </h1>

      {/* Fire and Ashes Update */}
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

        {/* Update Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p className="body-text" style={{
            opacity: 0.6,
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {t('latestUpdate')} — {t('updates.fire-and-ashes.date')}
          </p>
          <h2 className="section-heading" style={{ marginTop: 0 }}>
            {t('updates.fire-and-ashes.title')}
          </h2>
        </div>

        {/* Update Content */}
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

        {/* Support Section */}
        <div style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
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
      </article>
    </div>
  );
}
