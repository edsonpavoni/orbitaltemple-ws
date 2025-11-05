import { useTranslation } from 'react-i18next';

export default function TeamContent() {
  const { t, ready } = useTranslation('team');

  if (!ready) {
    return null; // or a loading skeleton
  }

  return (
    <div>
      {/* Main Title */}
      <h1 className="artwork-title">
        {t('heading')}
      </h1>

      {/* Team Members */}
      <p className="body-text">
        {t('artist')}
      </p>

      <h3 className="subsection-heading">
        {t('roles.executiveProducer.heading')}
      </h3>
      <p className="body-text">
        {t('roles.executiveProducer.members')}
      </p>

      <h3 className="subsection-heading">
        {t('roles.aerospace.heading')}
      </h3>
      <p className="body-text">
        {t('roles.aerospace.members')}
      </p>

      <h3 className="subsection-heading">
        {t('roles.electronic.heading')}
      </h3>
      <p className="body-text">
        {t('roles.electronic.members')}
      </p>

      <h3 className="subsection-heading">
        {t('roles.software.heading')}
      </h3>
      <p className="body-text">
        {t('roles.software.members')}
      </p>

      <h3 className="subsection-heading">
        {t('roles.design.heading')}
      </h3>
      <p className="body-text">
        {t('roles.design.members')}
      </p>

      <h3 className="subsection-heading">
        {t('roles.printing.heading')}
      </h3>
      <p className="body-text">
        {t('roles.printing.members')}
      </p>

      <h3 className="subsection-heading">
        {t('roles.rendering.heading')}
      </h3>
      <p className="body-text">
        {t('roles.rendering.members')}
      </p>

      <h3 className="subsection-heading">
        {t('roles.research.heading')}
      </h3>
      <p className="body-text">
        {t('roles.research.members')}
      </p>

      <h3 className="subsection-heading">
        {t('roles.exhibition.heading')}
      </h3>
      <p className="body-text">
        {t('roles.exhibition.members')}
      </p>

      <h3 className="subsection-heading">
        {t('roles.silkScreen.heading')}
      </h3>
      <p className="body-text">
        {t('roles.silkScreen.members')}
      </p>

      <h3 className="subsection-heading">
        {t('roles.educational.heading')}
      </h3>
      <p className="body-text">
        {t('roles.educational.members')}
      </p>

      <h3 className="subsection-heading">
        {t('roles.communication.heading')}
      </h3>
      <p className="body-text">
        {t('roles.communication.members')}
      </p>

      <h3 className="subsection-heading">
        {t('roles.specialThanks.heading')}
      </h3>
      <p className="body-text body-text--section-end">
        {t('roles.specialThanks.members')}
      </p>

      {/* Satellite Image */}
      <div style={{ marginTop: '6rem', marginBottom: '4rem', maxWidth: '100%' }}>
        <img src="/satellite/OT_site_0005.webp" alt={t('imageAlt')} style={{ width: '100%', height: 'auto', borderRadius: '8px', opacity: 0.9 }} />
      </div>

      {/* Team Credits */}
      <div style={{ marginTop: '4rem', marginBottom: '2rem' }}>
        <p className="body-text" style={{ fontSize: 'var(--text-body-sm)', opacity: 0.8 }}>
          {t('credits')}
        </p>
      </div>
    </div>
  );
}
