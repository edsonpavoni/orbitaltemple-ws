import { useTranslation } from 'react-i18next';

export default function SpaceLaunchContent() {
  const { t, ready } = useTranslation('space-launch');

  if (!ready) {
    return null;
  }

  return (
    <div>
      {/* Main Title */}
      <h1 className="artwork-title">
        {t('heading')}
      </h1>

      {/* Content */}
      <p className="body-text body-text--section-end">
        {t('intro')}
      </p>

      {/* Image */}
      <figure className="artwork-image">
        <img src="/launch/india.webp" alt={t('imageAlts.india')} />
      </figure>

      <p className="body-text body-text--section-end" dangerouslySetInnerHTML={{ __html: t('partnership') }} />

      {/* Risks Section */}
      <h2 className="section-heading" style={{ marginTop: '72px' }}>
        {t('risks.heading')}
      </h2>

      <p className="body-text">
        {t('risks.paragraph1')}
      </p>

      <p className="body-text">
        {t('risks.paragraph2')}
      </p>

      <p className="body-text body-text--section-end">
        {t('risks.paragraph3')}
      </p>

      {/* Satellite Image */}
      <div style={{ marginTop: '6rem', marginBottom: '4rem', maxWidth: '100%' }}>
        <img src="/satellite/OT_site_0010.webp" alt={t('imageAlts.satellite')} style={{ width: '100%', height: 'auto', borderRadius: '8px', opacity: 0.9 }} />
      </div>
    </div>
  );
}
