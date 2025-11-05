import { useTranslation } from 'react-i18next';

export default function PartnersContent() {
  const { t, ready } = useTranslation('partners');

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
      <p className="body-text" style={{ marginBottom: '3rem' }}>
        {t('intro')}
      </p>

      {/* Partners Grid */}
      <div className="partners-grid">

        {/* RiseNY&Partners */}
        <div className="partner-card">
          <div className="partner-logo-container">
            <a href="https://risenewyork.com/" target="_blank" rel="noopener noreferrer">
              <img src="/partners/riseny.svg" alt={t('imageAlts.riseNy')} className="partner-logo partner-logo-no-filter partner-logo-small" />
            </a>
          </div>
          <h3 className="partner-name">
            <a href="https://risenewyork.com/" target="_blank" rel="noopener noreferrer">{t('partners.riseNy.name')}</a>
          </h3>
          <p className="partner-description">
            {t('partners.riseNy.description')}
          </p>
        </div>

        {/* Our Highest Mantra */}
        <div className="partner-card">
          <div className="partner-logo-container">
            <a href="https://www.ourhighestmantra.com/" target="_blank" rel="noopener noreferrer">
              <img src="/partners/highest-mantra.webp" alt={t('imageAlts.highestMantra')} className="partner-logo partner-logo-small" />
            </a>
          </div>
          <h3 className="partner-name">
            <a href="https://www.ourhighestmantra.com/" target="_blank" rel="noopener noreferrer">{t('partners.highestMantra.name')}</a>
          </h3>
          <p className="partner-description">
            {t('partners.highestMantra.description')}
          </p>
        </div>

        {/* All to Space */}
        <div className="partner-card">
          <div className="partner-logo-container">
            <img src="/partners/all-to-space.webp" alt={t('imageAlts.allToSpace')} className="partner-logo" />
          </div>
          <h3 className="partner-name">
            {t('partners.allToSpace.name')}
          </h3>
          <p className="partner-description">
            {t('partners.allToSpace.description')}
          </p>
        </div>

        {/* ISRO */}
        <div className="partner-card">
          <div className="partner-logo-container">
            <a href="https://www.isro.gov.in/" target="_blank" rel="noopener noreferrer">
              <img src="/partners/isro.svg" alt={t('imageAlts.isro')} className="partner-logo" />
            </a>
          </div>
          <h3 className="partner-name">
            <a href="https://www.isro.gov.in/" target="_blank" rel="noopener noreferrer">{t('partners.isro.name')}</a>
          </h3>
          <p className="partner-description">
            {t('partners.isro.description')}
          </p>
        </div>

        {/* Mercosul Bienial */}
        <div className="partner-card">
          <div className="partner-logo-container">
            <a href="https://www.bienalmercosul.art.br/en/bienais/13%C2%AA-bienal-do-mercosul" target="_blank" rel="noopener noreferrer">
              <img src="/milestones/mercosul.webp" alt={t('imageAlts.mercosul')} className="partner-logo partner-logo-no-filter" />
            </a>
          </div>
          <h3 className="partner-name">
            <a href="https://www.bienalmercosul.art.br/en/bienais/13%C2%AA-bienal-do-mercosul" target="_blank" rel="noopener noreferrer">{t('partners.mercosul.name')}</a>
          </h3>
          <p className="partner-description">
            {t('partners.mercosul.description')}
          </p>
        </div>

        {/* INPE / ArtSat Workshop */}
        <div className="partner-card">
          <div className="partner-logo-container">
            <a href="https://pt.wikipedia.org/wiki/Instituto_Nacional_de_Pesquisas_Espaciais" target="_blank" rel="noopener noreferrer">
              <img src="/partners/inpe.webp" alt={t('imageAlts.inpe')} className="partner-logo" />
            </a>
          </div>
          <h3 className="partner-name">
            <a href="https://pt.wikipedia.org/wiki/Instituto_Nacional_de_Pesquisas_Espaciais" target="_blank" rel="noopener noreferrer">{t('partners.inpe.name')}</a>
          </h3>
          <p className="partner-description">
            {t('partners.inpe.description')}
          </p>
        </div>

        {/* Solid Concepts */}
        <div className="partner-card">
          <div className="partner-logo-container">
            <a href="https://www.linkedin.com/company/solidconcepts3d/" target="_blank" rel="noopener noreferrer">
              <img src="/partners/solid-concepts.webp" alt={t('imageAlts.solidConcepts')} className="partner-logo" />
            </a>
          </div>
          <h3 className="partner-name">
            <a href="https://www.linkedin.com/company/solidconcepts3d/" target="_blank" rel="noopener noreferrer">{t('partners.solidConcepts.name')}</a>
          </h3>
          <p className="partner-description">
            {t('partners.solidConcepts.description')}
          </p>
        </div>

        {/* Idea Space */}
        <div className="partner-card">
          <div className="partner-logo-container">
            <a href="https://www.linkedin.com/company/ideia-space/" target="_blank" rel="noopener noreferrer">
              <img src="/partners/idea-space.svg" alt={t('imageAlts.ideaSpace')} className="partner-logo" />
            </a>
          </div>
          <h3 className="partner-name">
            <a href="https://www.linkedin.com/company/ideia-space/" target="_blank" rel="noopener noreferrer">{t('partners.ideaSpace.name')}</a>
          </h3>
          <p className="partner-description">
            {t('partners.ideaSpace.description')}
          </p>
        </div>

      </div>

      {/* Closing Statement */}
      <div style={{ marginTop: '4rem', padding: '2rem', background: 'rgba(250, 212, 58, 0.05)', borderLeft: '3px solid var(--color-ot-gold200)' }}>
        <p className="body-text" style={{ margin: 0 }}>
          <span dangerouslySetInnerHTML={{ __html: t('closing') }} />
        </p>
      </div>
    </div>
  );
}
