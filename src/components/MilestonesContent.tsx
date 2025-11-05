import { useTranslation } from 'react-i18next';

export default function MilestonesContent() {
  const { t, ready } = useTranslation('milestones');

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
        {t('description')}
      </p>

      {/* Images side by side */}
      <div className="milestone-images-container">
        <figure className="milestone-image">
          <img src="/milestones/lumen.webp" alt={t('imageAlts.lumen')} />
        </figure>

        <figure className="milestone-image">
          <img src="/milestones/mercosul.webp" alt={t('imageAlts.mercosul')} />
        </figure>
      </div>
    </div>
  );
}
