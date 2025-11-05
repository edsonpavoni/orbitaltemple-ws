import { useTranslation } from 'react-i18next';

export default function ArtworkContent() {
  const { t, ready } = useTranslation('artwork');

  if (!ready) {
    return null; // or a loading skeleton
  }

  return (
    <div>
      {/* Main Title */}
      <h1 className="artwork-title">
        {t('heading')}
      </h1>

      {/* Introduction */}
      <p className="body-text">
        {t('intro.paragraph1')}
      </p>

      <p className="body-text body-text--section-end">
        {t('intro.paragraph2')}
      </p>

      {/* Image 1: Satellite */}
      <figure className="artwork-image">
        <img src="/artwork/satellite_1.webp" alt={t('imageAlts.satellite')} />
      </figure>

      {/* The Sculpture Section */}
      <h2 className="section-heading" style={{ marginTop: '72px' }}>
        {t('sculpture.heading')}
      </h2>

      <p className="body-text">
        {t('sculpture.paragraph1')}
      </p>

      <p className="body-text body-text--section-end">
        {t('sculpture.paragraph2')}
      </p>

      {/* Image 2: Rise NY */}
      <figure className="artwork-image">
        <img src="/press/edson-pavoni-orbital-temple-riseny-03.webp" alt={t('imageAlts.riseNy')} />
        <figcaption dangerouslySetInnerHTML={{ __html: t('imageCaptions.riseNy') }} />
      </figure>

      {/* Image 3: Rise NY */}
      <figure className="artwork-image">
        <img src="/press/edson-pavoni-orbital-temple-riseny-02.webp" alt={t('imageAlts.riseNy')} />
        <figcaption dangerouslySetInnerHTML={{ __html: t('imageCaptions.riseNy') }} />
      </figure>

      {/* Image 4: Clara Marques 1 */}
      <figure className="artwork-image">
        <img src="/press/edson-pavoni-orbital-temple-clara-marques-08.webp" alt={t('imageAlts.installation')} />
        <figcaption dangerouslySetInnerHTML={{ __html: t('imageCaptions.mercosul') }} />
      </figure>

      {/* Image 5: Clara Marques 2 */}
      <figure className="artwork-image">
        <img src="/press/edson-pavoni-orbital-temple-clara-marques-02.webp" alt={t('imageAlts.installation')} />
        <figcaption dangerouslySetInnerHTML={{ __html: t('imageCaptions.mercosul') }} />
      </figure>

      {/* Image 6: Clara Marques 3 */}
      <figure className="artwork-image">
        <img src="/press/edson-pavoni-orbital-temple-clara-marques-07.webp" alt={t('imageAlts.installation')} />
        <figcaption dangerouslySetInnerHTML={{ __html: t('imageCaptions.mercosul') }} />
      </figure>

      {/* The Antenna Section */}
      <h2 className="section-heading">
        {t('antenna.heading')}
      </h2>

      <p className="body-text">
        {t('antenna.paragraph1')}
      </p>

      <p className="body-text">
        {t('antenna.paragraph2')}
      </p>

      <p className="body-text">
        {t('antenna.paragraph3')}
      </p>

      <p className="body-text">
        {t('antenna.paragraph4')}
      </p>

      <p className="body-text body-text--section-end">
        <span dangerouslySetInnerHTML={{ __html: t('antenna.paragraph5') }} />
      </p>

      {/* Image 7: Antenna */}
      <figure className="artwork-image artwork-image--overflow-right">
        <img src="/artwork/antenna.webp" alt={t('imageAlts.antenna')} />
      </figure>
    </div>
  );
}
