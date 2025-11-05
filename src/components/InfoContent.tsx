import { useTranslation } from 'react-i18next';

export default function InfoContent() {
  const { t, ready } = useTranslation('info');

  if (!ready) {
    return null;
  }

  return (
    <div>
      {/* Main Title */}
      <h1 className="artwork-title">
        {t('heading')}
      </h1>

      {/* Satellite Section */}
      <h2 className="section-heading">
        {t('satellite.heading')}
      </h2>

      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('satellite.specs') }} />

      {/* Image */}
      <figure className="artwork-image">
        <img src="/howItWorks/info.webp" alt={t('imageAlt')} />
      </figure>

      {/* Antenna/Sculpture Section */}
      <h2 className="section-heading">
        {t('antenna.heading')}
      </h2>

      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('antenna.specs') }} />

      {/* Radio Specs */}
      <h2 className="section-heading">
        {t('radio.heading')}
      </h2>

      <p className="body-text body-text--section-end" dangerouslySetInnerHTML={{ __html: t('radio.specs') }} />
    </div>
  );
}
