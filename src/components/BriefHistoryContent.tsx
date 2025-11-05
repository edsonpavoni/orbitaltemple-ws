import { useTranslation } from 'react-i18next';

export default function BriefHistoryContent() {
  const { t, ready } = useTranslation('brief-history');

  if (!ready) {
    return null;
  }

  return (
    <div>
      {/* Main Title */}
      <h1 className="artwork-title">
        {t('heading')}
      </h1>

      {/* Introduction */}
      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('intro') }} />

      {/* Alexei Leonov Section */}
      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('sections.leonov.text') }} />

      <figure className="artwork-image" style={{ margin: '1rem 0 6rem 0' }}>
        <img src="/brief-history/alexei-leonov.webp" alt={t('imageAlts.leonov')} style={{ width: '100%', height: 'auto', opacity: 0.9 }} />
        <figcaption className="caption-text" style={{ marginTop: '0.75rem', textAlign: 'right' }}>
          {t('sections.leonov.caption')}
        </figcaption>
      </figure>

      {/* Moon Museum Section */}
      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('sections.moonMuseum.paragraph1') }} />

      <figure className="artwork-image" style={{ margin: '1rem 0 6rem 0' }}>
        <img src="/brief-history/moon-museum.webp" alt={t('imageAlts.moonMuseum')} style={{ width: '100%', height: 'auto', opacity: 0.9 }} />
        <figcaption className="caption-text" style={{ marginTop: '0.75rem', textAlign: 'right' }}>
          {t('sections.moonMuseum.caption1')}
        </figcaption>
      </figure>

      <p className="body-text">
        {t('sections.moonMuseum.paragraph2')}
      </p>

      <figure className="artwork-image" style={{ margin: '1rem 0 6rem 0' }}>
        <img src="/brief-history/moon-museum-warhol.webp" alt={t('imageAlts.moonMuseumWarhol')} style={{ width: '100%', height: 'auto', opacity: 0.9 }} />
        <figcaption className="caption-text" style={{ marginTop: '0.75rem', textAlign: 'right' }}>
          {t('sections.moonMuseum.caption2')}
        </figcaption>
      </figure>

      {/* Fallen Astronaut Section */}
      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('sections.fallenAstronaut.text') }} />

      <figure className="artwork-image" style={{ margin: '1rem 0 6rem 0' }}>
        <img src="/brief-history/fallen-astronaut.webp" alt={t('imageAlts.fallenAstronaut')} style={{ width: '100%', height: 'auto', opacity: 0.9 }} />
        <figcaption className="caption-text" style={{ marginTop: '0.75rem', textAlign: 'right' }}>
          {t('sections.fallenAstronaut.caption')}
        </figcaption>
      </figure>

      {/* Pioneer/Voyager Section */}
      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('sections.pioneerVoyager.text') }} />

      <figure className="artwork-image" style={{ margin: '1rem 0 6rem 0' }}>
        <img src="/brief-history/pioneer-plaques.webp" alt={t('imageAlts.pioneerPlaques')} style={{ width: '100%', height: 'auto', opacity: 0.9 }} />
        <figcaption className="caption-text" style={{ marginTop: '0.75rem', textAlign: 'right' }}>
          {t('sections.pioneerVoyager.caption')}
        </figcaption>
      </figure>

      {/* DOVE Section */}
      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('sections.dove.text') }} />

      <figure className="artwork-image" style={{ margin: '1rem 0 6rem 0' }}>
        <img src="/brief-history/dove.webp" alt={t('imageAlts.dove')} style={{ width: '100%', height: 'auto', opacity: 0.9 }} />
        <figcaption className="caption-text" style={{ marginTop: '0.75rem', textAlign: 'right' }}>
          {t('sections.dove.caption')}
        </figcaption>
      </figure>

      {/* Last Pictures Section */}
      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('sections.lastPictures.text') }} />

      <figure className="artwork-image" style={{ margin: '1rem 0 6rem 0' }}>
        <img src="/brief-history/last-pictures.webp" alt={t('imageAlts.lastPictures')} style={{ width: '100%', height: 'auto', opacity: 0.9 }} />
        <figcaption className="caption-text" style={{ marginTop: '0.75rem', textAlign: 'right' }}>
          {t('sections.lastPictures.caption')}
        </figcaption>
      </figure>

      {/* Ulises Section */}
      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('sections.ulises.text') }} />

      <figure className="artwork-image" style={{ margin: '1rem 0 6rem 0' }}>
        <img src="/brief-history/ulisses.webp" alt={t('imageAlts.ulises')} style={{ width: '100%', height: 'auto', opacity: 0.9 }} />
        <figcaption className="caption-text" style={{ marginTop: '0.75rem', textAlign: 'right' }}>
          {t('sections.ulises.caption')}
        </figcaption>
      </figure>

      {/* ARTSAT Section */}
      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('sections.artsat.text') }} />

      <figure className="artwork-image" style={{ margin: '1rem 0 3rem 0' }}>
        <img src="/brief-history/artsat-invader.webp" alt={t('imageAlts.artsatInvader')} style={{ width: '100%', height: 'auto', opacity: 0.9 }} />
        <figcaption className="caption-text" style={{ marginTop: '0.75rem', textAlign: 'right' }}>
          {t('sections.artsat.caption1')}
        </figcaption>
      </figure>

      {/* ARTSAT Artworks Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0 6rem 0' }}>
        <figure style={{ margin: 0 }}>
          <img src="/brief-history/artsat_03.webp" alt={t('imageAlts.artsatArt')} style={{ width: '100%', height: 'auto', opacity: 0.9 }} />
        </figure>
        <figure style={{ margin: 0 }}>
          <img src="/brief-history/artsat_02.webp" alt={t('imageAlts.artsatArt')} style={{ width: '100%', height: 'auto', opacity: 0.9 }} />
        </figure>
        <figure style={{ margin: 0 }}>
          <img src="/brief-history/artsat_06.webp" alt={t('imageAlts.artsatArt')} style={{ width: '100%', height: 'auto', opacity: 0.9 }} />
        </figure>
        <figure style={{ margin: 0 }}>
          <img src="/brief-history/artsat_04.webp" alt={t('imageAlts.artsatArt')} style={{ width: '100%', height: 'auto', opacity: 0.9 }} />
        </figure>
      </div>
      <p className="caption-text" style={{ textAlign: 'right', marginTop: '-5rem', marginBottom: '6rem' }}>
        {t('sections.artsat.caption2')}
      </p>

      {/* Eduardo Kac Section */}
      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('sections.kac.text') }} />

      <figure className="artwork-image" style={{ margin: '1rem 0 6rem 0' }}>
        <img src="/brief-history/inner-telescope.webp" alt={t('imageAlts.innerTelescope')} style={{ width: '100%', height: 'auto', opacity: 0.9 }} />
        <figcaption className="caption-text" style={{ marginTop: '0.75rem', textAlign: 'right' }}>
          {t('sections.kac.caption')}
        </figcaption>
      </figure>

      {/* ENOCH Section */}
      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('sections.enoch.text') }} />

      <figure className="artwork-image" style={{ margin: '1rem 0 6rem 0' }}>
        <img src="/brief-history/enoch.webp" alt={t('imageAlts.enoch')} style={{ width: '100%', height: 'auto', opacity: 0.9 }} />
        <figcaption className="caption-text" style={{ marginTop: '0.75rem', textAlign: 'right' }}>
          {t('sections.enoch.caption')}
        </figcaption>
      </figure>

      {/* Orbital Reflector Section */}
      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('sections.orbitalReflector.text') }} />

      <figure className="artwork-image" style={{ margin: '1rem 0 6rem 0' }}>
        <img src="/brief-history/orbital-reflector.webp" alt={t('imageAlts.orbitalReflector')} style={{ width: '100%', height: 'auto', opacity: 0.9 }} />
        <figcaption className="caption-text" style={{ marginTop: '0.75rem', textAlign: 'right' }}>
          {t('sections.orbitalReflector.caption')}
        </figcaption>
      </figure>

      {/* Others Section */}
      <p className="body-text" dangerouslySetInnerHTML={{ __html: t('sections.others.text') }} />

      {/* Orbital Temple Section */}
      <p className="body-text body-text--section-end" dangerouslySetInnerHTML={{ __html: t('sections.orbitalTemple.text') }} />

      {/* Final Satellite Image */}
      <figure className="artwork-image" style={{ marginTop: '1rem', marginBottom: '4rem' }}>
        <img src="/press/edson-pavoni-orbital-temple-clara-marques-08.webp" alt={t('imageAlts.orbitalTemple')} style={{ width: '100%', height: 'auto', opacity: 0.9 }} />
        <figcaption className="caption-text" style={{ marginTop: '0.75rem', textAlign: 'right' }}>
          {t('sections.orbitalTemple.caption')}
        </figcaption>
      </figure>
    </div>
  );
}
