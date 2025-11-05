import { useTranslation } from 'react-i18next';

export default function ArtistContent() {
  const { t, ready } = useTranslation('artist');

  if (!ready) {
    return null;
  }

  return (
    <div>
      {/* Main Title */}
      <h1 className="artwork-title">
        {t('title')}
      </h1>

      {/* Opening */}
      <p className="body-text">
        {t('opening.question')}
      </p>

      <p className="body-text">
        {t('opening.thanks')}
      </p>

      <p className="body-text">
        {t('opening.answer')}
      </p>

      {/* Origin Story */}
      <p className="body-text">
        {t('origin.sao_paulo')}
      </p>

      <p className="body-text">
        {t('origin.technology')}
      </p>

      <p className="body-text">
        {t('origin.christianity')}
      </p>

      <p className="body-text">
        {t('origin.price')}
      </p>

      {/* Searching */}
      <p className="body-text">
        {t('searching.walls')}
      </p>

      <p className="body-text">
        {t('searching.art')}
      </p>

      {/* Pandemic */}
      <p className="body-text">
        {t('pandemic.intro')}
      </p>

      <p className="body-text">
        {t('pandemic.government')}
      </p>

      <p className="body-text">
        {t('pandemic.war')}
      </p>

      <p className="body-text">
        {t('pandemic.memorial')}
      </p>

      <p className="body-text">
        {t('pandemic.meaning')}
      </p>

      {/* Discovery */}
      <p className="body-text">
        {t('discovery.pattern')}
      </p>

      <p className="body-text">
        {t('discovery.understanding')}
      </p>

      <p className="body-text">
        {t('discovery.birth')}
      </p>

      {/* Space */}
      <p className="body-text">
        {t('space.question')}
      </p>

      <p className="body-text">
        {t('space.answer')}
      </p>

      <p className="body-text">
        {t('space.description')}
      </p>

      {/* Closing */}
      <p className="body-text body-text--section-end">
        <span dangerouslySetInnerHTML={{ __html: t('closing.answer') }} />
        <br /><br />
        {t('closing.signature')}<br />
        {t('closing.name')}
      </p>
    </div>
  );
}
