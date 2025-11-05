import { useTranslation } from 'react-i18next';

export default function EducationContent() {
  const { t, ready } = useTranslation('education');

  if (!ready) {
    return null; // or a loading skeleton
  }

  return (
    <div>
      {/* Main Title */}
      <h1 className="artwork-title">
        {t('heading')}
      </h1>

      {/* Content */}
      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('intro.paragraph1') }} />
      </p>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('intro.paragraph2') }} />
      </p>

      {/* Why This Matters Section */}
      <h2 className="section-heading" style={{ marginTop: '72px' }}>
        {t('spaceGap.heading')}
      </h2>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('spaceGap.paragraph1') }} />
      </p>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('spaceGap.paragraph2') }} />
      </p>

      <p className="body-text">
        {t('spaceGap.paragraph3')}
      </p>

      {/* What We'll Teach Section */}
      <h2 className="section-heading">
        {t('empowering.heading')}
      </h2>

      <p className="body-text">
        {t('empowering.intro')}
      </p>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('empowering.topics.history') }} />
      </p>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('empowering.topics.concepts') }} />
      </p>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('empowering.topics.missions') }} />
      </p>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('empowering.topics.electronics') }} />
      </p>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('empowering.topics.mechanics') }} />
      </p>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('empowering.topics.orbits') }} />
      </p>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('empowering.topics.financing') }} />
      </p>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('empowering.topics.groundStation') }} />
      </p>

      {/* Technology Section */}
      <h2 className="section-heading">
        {t('technology.heading')}
      </h2>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('technology.paragraph1') }} />
      </p>

      <p className="body-text">
        {t('technology.paragraph2')}
      </p>

      {/* Global Access Section */}
      <h2 className="section-heading">
        {t('globalAccess.heading')}
      </h2>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('globalAccess.paragraph1') }} />
      </p>

      <p className="body-text">
        {t('globalAccess.paragraph2')}
      </p>

      {/* Call to Action Section */}
      <h2 className="section-heading">
        {t('callToAction.heading')}
      </h2>

      <p className="body-text body-text--section-end">
        <span dangerouslySetInnerHTML={{ __html: t('callToAction.content') }} />
      </p>

      {/* Satellite Image */}
      <div style={{ marginTop: '6rem', marginBottom: '4rem', maxWidth: '100%' }}>
        <img src="/satellite/OT_site_0001.webp" alt={t('imageAlt')} style={{ width: '100%', height: 'auto', borderRadius: '8px', opacity: 0.9 }} />
      </div>
    </div>
  );
}
