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

      {/* Falcon 9 on the pad (image: SpaceX) */}
      <figure className="artwork-image">
        <img src="/launch/falcon9-transporter18.webp" alt={t('imageAlts.falcon9')} style={{ width: '100%', height: 'auto' }} />
        <figcaption className="caption-text" style={{ marginTop: '0.75rem', textAlign: 'right' }}>
          {t('captions.falcon9')}
        </figcaption>
      </figure>

      {/* The launch that is coming */}
      <h2 className="section-heading">
        {t('launch.date')}
      </h2>

      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('launch.paragraph1') }} />

      <p className="body-text">
        {t('launch.paragraph2')}
      </p>

      <p className="body-text body-text--section-end" dangerouslySetInnerHTML={{ __html: t('launch.watch') }} />

      {/* Satellite Image */}
      <div style={{ marginTop: '2rem', marginBottom: '4rem', maxWidth: '100%' }}>
        <img src="/satellite/OT_site_0010.webp" alt={t('imageAlts.satellite')} style={{ width: '100%', height: 'auto', borderRadius: '8px', opacity: 0.9 }} />
      </div>

      {/* The first attempt */}
      <h2 className="section-heading" style={{ marginTop: '72px' }}>
        {t('firstAttempt.heading')}
      </h2>

      <p className="body-text">
        {t('firstAttempt.paragraph1')}
      </p>

      <figure className="artwork-image">
        <img src="/launch/pslv-c62-ignition.webp" alt={t('imageAlts.pslv')} style={{ width: '100%', height: 'auto' }} />
        <figcaption className="caption-text" style={{ marginTop: '0.75rem', textAlign: 'right' }}>
          {t('captions.pslv')}
        </figcaption>
      </figure>

      <p className="body-text">
        {t('firstAttempt.partnership')}
      </p>

      <p className="body-text body-text--section-end">
        {t('firstAttempt.paragraph2')}
      </p>
    </div>
  );
}
