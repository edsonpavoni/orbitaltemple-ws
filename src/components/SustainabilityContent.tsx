import { useTranslation } from 'react-i18next';

export default function SustainabilityContent() {
  const { t, ready } = useTranslation('sustainability');

  if (!ready) {
    return null;
  }

  return (
    <div>
      {/* Main Title */}
      <h1 className="artwork-title">
        {t('heading')}
      </h1>

      {/* Opening */}
      <p className="body-text">
        {t('intro.paragraph1')}
      </p>

      <p className="body-text body-text--section-end">
        {t('intro.paragraph2')}
      </p>

      {/* Space Debris */}
      <h2 className="section-heading" style={{ marginTop: '72px' }}>
        {t('spaceDebris.heading')}
      </h2>

      <p className="body-text">
        {t('spaceDebris.paragraph1')}
      </p>

      <p className="body-text">
        {t('spaceDebris.paragraph2')}
      </p>

      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('spaceDebris.list.orbit') }} />

      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('spaceDebris.list.size') }} />

      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('spaceDebris.list.responsibility') }} />

      <p className="body-text body-text--section-end">
        {t('spaceDebris.paragraph3')}
      </p>

      {/* Carbon Neutrality */}
      <h2 className="section-heading">
        {t('carbonNeutrality.heading')}
      </h2>

      <p className="body-text body-text--section-end">
        {t('carbonNeutrality.content')}
      </p>

      {/* Open Source Hardware */}
      <h2 className="section-heading">
        {t('openSource.heading')}
      </h2>

      <p className="body-text">
        {t('openSource.paragraph1')}
      </p>

      <p className="body-text body-text--section-end">
        {t('openSource.paragraph2')}
      </p>

      {/* Educational Impact */}
      <h2 className="section-heading">
        {t('educational.heading')}
      </h2>

      <p className="body-text">
        {t('educational.paragraph1')}
      </p>

      <p className="body-text body-text--section-end">
        {t('educational.paragraph2')}
      </p>

      {/* Long-Term Thinking */}
      <h2 className="section-heading">
        {t('tenYear.heading')}
      </h2>

      <p className="body-text">
        {t('tenYear.paragraph1')}
      </p>

      <p className="body-text body-text--section-end">
        {t('tenYear.paragraph2')}
      </p>

      {/* Art's Responsibility */}
      <h2 className="section-heading">
        {t('artsResponsibility.heading')}
      </h2>

      <p className="body-text">
        {t('artsResponsibility.paragraph1')}
      </p>

      <p className="body-text body-text--section-end">
        {t('artsResponsibility.paragraph2')}
      </p>

      {/* Satellite Image */}
      <div style={{ marginTop: '6rem', marginBottom: '4rem', maxWidth: '100%' }}>
        <img src="/satellite/OT_site_0005.webp" alt={t('imageAlt')} style={{ width: '100%', height: 'auto', borderRadius: '8px', opacity: 0.9 }} />
      </div>
    </div>
  );
}
