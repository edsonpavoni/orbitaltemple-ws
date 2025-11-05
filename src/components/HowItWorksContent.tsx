import { useTranslation } from 'react-i18next';

export default function HowItWorksContent() {
  const { t, ready } = useTranslation('how-it-works');

  if (!ready) {
    return null;
  }

  return (
    <div>
      {/* Main Title */}
      <h1 className="artwork-title">
        {t('heading')}
      </h1>

      <p className="body-text">
        {t('intro')}
      </p>

      {/* Info Diagram */}
      <figure className="artwork-image">
        <img src="/howItWorks/info.webp" alt={t('imageAlt')} />
      </figure>

      <p className="body-text">
        {t('paragraph1')}
      </p>

      <p className="body-text body-text--section-end">
        {t('paragraph2')}
      </p>
    </div>
  );
}
