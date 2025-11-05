import { useTranslation } from 'react-i18next';

export default function TechnicalContent() {
  const { t, ready } = useTranslation('technical');

  if (!ready) {
    return null; // or a loading skeleton
  }

  return (
    <div>
      {/* Main Title */}
      <h1 className="artwork-title">
        {t('heading')}
      </h1>

      {/* Satellite Section */}
      <h3 className="subsection-heading">
        {t('satellite.heading')}
      </h3>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('satellite.specs') }} />
      </p>

      {/* Antenna/Sculpture Section */}
      <h3 className="subsection-heading">
        {t('antenna.heading')}
      </h3>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('antenna.specs') }} />
      </p>

      {/* Radio Specs */}
      <h3 className="subsection-heading">
        {t('radio.heading')}
      </h3>

      <p className="body-text body-text--section-end">
        <span dangerouslySetInnerHTML={{ __html: t('radio.specs') }} />
      </p>

      {/* Satellite Image */}
      <div style={{ marginTop: '6rem', marginBottom: '4rem', maxWidth: '100%' }}>
        <img src="/satellite/OT_site_0002.webp" alt={t('imageAlt')} style={{ width: '100%', height: 'auto', borderRadius: '8px', opacity: 0.9 }} />
      </div>
    </div>
  );
}
