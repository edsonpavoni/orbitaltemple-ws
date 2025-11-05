import { useTranslation } from 'react-i18next';
import NameCounter from './NameCounter';

export default function PressContent() {
  const { t, ready } = useTranslation('press');

  if (!ready) {
    return null;
  }

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return (
    <div>
      {/* Main Title */}
      <h1 className="artwork-title">
        {t('heading')}
      </h1>

      {/* Press Contact */}
      <section className="press-section">
        <h2 className="section-heading">
          {t('pressContact.heading')}
        </h2>
        <p className="body-text">
          <span dangerouslySetInnerHTML={{ __html: t('pressContact.content') }} />
        </p>
      </section>

      {/* About the Project */}
      <section className="press-section">
        <h2 className="section-heading">
          {t('aboutProject.heading')}
        </h2>
        <p className="body-text">
          {t('aboutProject.paragraph1')}
        </p>
        <p className="body-text body-text--section-end">
          {t('aboutProject.paragraph2')}
        </p>
      </section>

      {/* About the Artist */}
      <section className="press-section">
        <h2 className="section-heading">
          {t('aboutArtist.heading')}
        </h2>

        <p className="body-text">
          <span dangerouslySetInnerHTML={{ __html: t('aboutArtist.paragraph1') }} />
        </p>
        <p className="body-text">
          <span dangerouslySetInnerHTML={{ __html: t('aboutArtist.paragraph2') }} />
        </p>
        <p className="body-text">
          {t('aboutArtist.paragraph3')}
        </p>
        <p className="body-text body-text--section-end">
          {t('aboutArtist.paragraph4')}
        </p>
      </section>

      {/* Key Facts */}
      <section className="press-section">
        <h2 className="section-heading">
          {t('keyFacts.heading')}
        </h2>
        <ul className="body-text" style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <span dangerouslySetInnerHTML={{ __html: t('keyFacts.artist') }} />
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <span dangerouslySetInnerHTML={{ __html: t('keyFacts.projectType') }} />
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <span dangerouslySetInnerHTML={{ __html: t('keyFacts.launchDate') }} />
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <span dangerouslySetInnerHTML={{ __html: t('keyFacts.launchLocation') }} />
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <span dangerouslySetInnerHTML={{ __html: t('keyFacts.satellite') }} />
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <span dangerouslySetInnerHTML={{ __html: t('keyFacts.orbit') }} />
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <span dangerouslySetInnerHTML={{ __html: t('keyFacts.participation') }} />
          </li>
        </ul>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(250, 212, 58, 0.05)', borderLeft: '3px solid var(--color-ot-gold200)' }}>
          <p className="body-text" style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>
            <span dangerouslySetInnerHTML={{ __html: t('keyFacts.namesSent.heading') }} />
          </p>
          <NameCounter />
          <p className="caption-text" style={{ margin: '0.5rem 0 0 0', textAlign: 'left' }}>
            <span dangerouslySetInnerHTML={{ __html: t('keyFacts.namesSent.caption').replace('{date}', today) }} />
          </p>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="press-section">
        <h2 className="section-heading">
          {t('awards.heading')}
        </h2>
        <ul className="body-text" style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li style={{ marginBottom: '1rem' }}>
            <span dangerouslySetInnerHTML={{ __html: t('awards.mercosul.title') }} />
            <br />
            {t('awards.mercosul.location')}
            <br />
            {t('awards.mercosul.curator')}
          </li>
          <li style={{ marginBottom: '1rem' }}>
            <span dangerouslySetInnerHTML={{ __html: t('awards.lumen.title') }} />
            <br />
            {t('awards.lumen.status')}
          </li>
          <li style={{ marginBottom: '1rem' }}>
            <span dangerouslySetInnerHTML={{ __html: t('awards.cubeDesign.title') }} />
            <br />
            {t('awards.cubeDesign.award')}
            <br />
            {t('awards.cubeDesign.org')}
          </li>
        </ul>

        <div className="milestone-images-container" style={{ marginTop: '2rem' }}>
          <figure className="milestone-image">
            <img src="/milestones/lumen.webp" alt={t('imageAlts.lumenPrize')} />
          </figure>

          <figure className="milestone-image milestone-image-small">
            <img src="/milestones/mercosul.webp" alt={t('imageAlts.mercosulBienal')} />
          </figure>
        </div>
      </section>

      {/* Team */}
      <section className="press-section">
        <h2 className="section-heading">
          {t('team.heading')}
        </h2>
        <p className="body-text body-text--section-end">
          {t('team.content')}
        </p>
      </section>

      {/* Featured In / Press Coverage */}
      <section className="press-section">
        <h2 className="section-heading">
          {t('pressCoverage.heading')}
        </h2>
        <p className="body-text">
          <span dangerouslySetInnerHTML={{ __html: t('pressCoverage.paragraph1') }} />
        </p>
        <p className="body-text body-text--section-end">
          {t('pressCoverage.paragraph2')}
        </p>
      </section>

      {/* High-Resolution Images */}
      <section className="press-section">
        <h2 className="section-heading">
          {t('images.heading')}
        </h2>
        <p className="body-text">
          {t('images.intro')}
        </p>

        <h3 className="subsection-heading">{t('images.installationPhotos.heading')}</h3>
        <p className="body-text">
          {t('images.installationPhotos.credit')}
        </p>

        <div className="press-images-grid">
          <div className="press-image-item">
            <a href="/press/edson-pavoni-orbital-temple-clara-marques-08.jpg" download="edson-pavoni-orbital-temple-clara-marques-08.jpg">
              <img src="/press/edson-pavoni-orbital-temple-clara-marques-08.webp" alt={t('imageAlts.installation')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.installationPhotos.view01') }} />
              </p>
            </a>
          </div>

          <div className="press-image-item">
            <a href="/press/edson-pavoni-orbital-temple-clara-marques-01.jpg" download="edson-pavoni-orbital-temple-clara-marques-01.jpg">
              <img src="/press/edson-pavoni-orbital-temple-clara-marques-01.webp" alt={t('imageAlts.installation')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.installationPhotos.view02') }} />
              </p>
            </a>
          </div>

          <div className="press-image-item">
            <a href="/press/edson-pavoni-orbital-temple-clara-marques-02.png" download="edson-pavoni-orbital-temple-clara-marques-02.png">
              <img src="/press/edson-pavoni-orbital-temple-clara-marques-02.webp" alt={t('imageAlts.installation')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.installationPhotos.view03') }} />
              </p>
            </a>
          </div>

          <div className="press-image-item">
            <a href="/press/edson-pavoni-orbital-temple-clara-marques-03.jpg" download="edson-pavoni-orbital-temple-clara-marques-03.jpg">
              <img src="/press/edson-pavoni-orbital-temple-clara-marques-03.webp" alt={t('imageAlts.installation')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.installationPhotos.view04') }} />
              </p>
            </a>
          </div>

          <div className="press-image-item">
            <a href="/press/edson-pavoni-orbital-temple-clara-marques-04.jpg" download="edson-pavoni-orbital-temple-clara-marques-04.jpg">
              <img src="/press/edson-pavoni-orbital-temple-clara-marques-04.webp" alt={t('imageAlts.installation')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.installationPhotos.view05') }} />
              </p>
            </a>
          </div>

          <div className="press-image-item">
            <a href="/press/edson-pavoni-orbital-temple-clara-marques-05.jpg" download="edson-pavoni-orbital-temple-clara-marques-05.jpg">
              <img src="/press/edson-pavoni-orbital-temple-clara-marques-05.webp" alt={t('imageAlts.installation')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.installationPhotos.view06') }} />
              </p>
            </a>
          </div>

          <div className="press-image-item">
            <a href="/press/edson-pavoni-orbital-temple-clara-marques-06.jpg" download="edson-pavoni-orbital-temple-clara-marques-06.jpg">
              <img src="/press/edson-pavoni-orbital-temple-clara-marques-06.webp" alt={t('imageAlts.installation')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.installationPhotos.view07') }} />
              </p>
            </a>
          </div>

          <div className="press-image-item">
            <a href="/press/edson-pavoni-orbital-temple-clara-marques-07.jpg" download="edson-pavoni-orbital-temple-clara-marques-07.jpg">
              <img src="/press/edson-pavoni-orbital-temple-clara-marques-07.webp" alt={t('imageAlts.installation')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.installationPhotos.view08') }} />
              </p>
            </a>
          </div>

          <div className="press-image-item">
            <a href="/artwork/satellite_1.webp" download="orbital-temple-satellite.webp">
              <img src="/artwork/satellite_1.webp" alt={t('imageAlts.satelliteDesign')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.installationPhotos.satelliteDesign') }} />
              </p>
            </a>
          </div>

          <div className="press-image-item">
            <a href="/artwork/antenna.webp" download="orbital-temple-antenna.webp">
              <img src="/artwork/antenna.webp" alt={t('imageAlts.antenna')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.installationPhotos.antennaSculpture') }} />
              </p>
            </a>
          </div>
        </div>

        <h3 className="subsection-heading" style={{ marginTop: '3rem' }}>{t('images.renders.heading')}</h3>
        <p className="body-text">
          {t('images.renders.credit')}
        </p>

        <div className="press-images-grid">
          <div className="press-image-item">
            <a href="/press/edson-pavoni-orbital-temple-riseny-01.png" download="edson-pavoni-orbital-temple-riseny-01.png">
              <img src="/press/edson-pavoni-orbital-temple-riseny-01.webp" alt={t('imageAlts.render')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.renders.render01') }} />
              </p>
            </a>
          </div>

          <div className="press-image-item">
            <a href="/press/edson-pavoni-orbital-temple-riseny-02.png" download="edson-pavoni-orbital-temple-riseny-02.png">
              <img src="/press/edson-pavoni-orbital-temple-riseny-02.webp" alt={t('imageAlts.render')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.renders.render02') }} />
              </p>
            </a>
          </div>

          <div className="press-image-item">
            <a href="/press/edson-pavoni-orbital-temple-riseny-03.png" download="edson-pavoni-orbital-temple-riseny-03.png">
              <img src="/press/edson-pavoni-orbital-temple-riseny-03.webp" alt={t('imageAlts.render')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.renders.render03') }} />
              </p>
            </a>
          </div>

          <div className="press-image-item">
            <a href="/press/edson-pavoni-orbital-temple-riseny-04.png" download="edson-pavoni-orbital-temple-riseny-04.png">
              <img src="/press/edson-pavoni-orbital-temple-riseny-04.webp" alt={t('imageAlts.render')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.renders.render04') }} />
              </p>
            </a>
          </div>

          <div className="press-image-item">
            <a href="/press/edson-pavoni-orbital-temple-riseny-05.png" download="edson-pavoni-orbital-temple-riseny-05.png">
              <img src="/press/edson-pavoni-orbital-temple-riseny-05.webp" alt={t('imageAlts.render')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.renders.render05') }} />
              </p>
            </a>
          </div>
        </div>

        <h3 className="subsection-heading" style={{ marginTop: '3rem' }}>{t('images.artistPhotos.heading')}</h3>

        <div className="press-images-grid">
          <div className="press-image-item">
            <a href="/press/edson-pavoni-1.jpg" download="edson-pavoni-portrait-1.jpg">
              <img src="/press/edson-pavoni-1.webp" alt={t('imageAlts.edsonPortrait')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.artistPhotos.photo1') }} />
              </p>
            </a>
          </div>
          <div className="press-image-item">
            <a href="/press/edson-pavoni-2.jpg" download="edson-pavoni-portrait-2.jpg">
              <img src="/press/edson-pavoni-2.webp" alt={t('imageAlts.edsonPortrait')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.artistPhotos.photo2') }} />
              </p>
            </a>
          </div>
        </div>

        <h3 className="subsection-heading" style={{ marginTop: '3rem' }}>{t('images.sathiPhotos.heading')}</h3>

        <div className="press-images-grid">
          <div className="press-image-item">
            <a href="/press/sathi-roy-01.jpg" download="sathi-roy-portrait-1.jpg">
              <img src="/press/sathi-roy-01.webp" alt={t('imageAlts.sathiPortrait')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.sathiPhotos.photo1') }} />
              </p>
            </a>
          </div>
          <div className="press-image-item">
            <a href="/press/sathi-roy-02.jpg" download="sathi-roy-portrait-2.jpg">
              <img src="/press/sathi-roy-02.webp" alt={t('imageAlts.sathiPortrait')} />
              <p className="caption-text" style={{ textAlign: 'center' }}>
                <span dangerouslySetInnerHTML={{ __html: t('images.sathiPhotos.photo2') }} />
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="press-section">
        <h2 className="section-heading">
          {t('technicalSpecs.heading')}
        </h2>

        <h3 className="subsection-heading">{t('technicalSpecs.satellite.heading')}</h3>
        <ul className="body-text" style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li>{t('technicalSpecs.satellite.dimensions')}</li>
          <li>{t('technicalSpecs.satellite.classification')}</li>
          <li>{t('technicalSpecs.satellite.weight')}</li>
          <li>{t('technicalSpecs.satellite.materials')}</li>
          <li>{t('technicalSpecs.satellite.orbit')}</li>
          <li>{t('technicalSpecs.satellite.launch')}</li>
        </ul>

        <h3 className="subsection-heading">{t('technicalSpecs.antenna.heading')}</h3>
        <ul className="body-text" style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li>{t('technicalSpecs.antenna.dimensions')}</li>
          <li>{t('technicalSpecs.antenna.weight')}</li>
          <li>{t('technicalSpecs.antenna.materials')}</li>
        </ul>

        <h3 className="subsection-heading">{t('technicalSpecs.radio.heading')}</h3>
        <p className="body-text body-text--section-end">
          {t('technicalSpecs.radio.downlink')}
          <br />
          {t('technicalSpecs.radio.status')}
        </p>
      </section>

      {/* Additional Resources */}
      <section className="press-section">
        <h2 className="section-heading">
          {t('additionalResources.heading')}
        </h2>
        <p className="body-text additional-resources-links">
          <a href="/artwork">{t('additionalResources.artwork')}</a><br />
          <a href="/how-it-works">{t('additionalResources.howItWorks')}</a><br />
          <a href="/info">{t('additionalResources.technicalInfo')}</a><br />
          <a href="/space-launch">{t('additionalResources.spaceLaunch')}</a><br />
          <a href="/">{t('additionalResources.ritual')}</a>
        </p>
      </section>
    </div>
  );
}
