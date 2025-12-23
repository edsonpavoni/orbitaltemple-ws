import { useTranslation } from 'react-i18next';

export default function SupportDocumentaryContent() {
  const { t, ready } = useTranslation('support');

  if (!ready) {
    return null;
  }

  return (
    <div>
      {/* Main Title */}
      <h1 className="artwork-title">
        Support the Orbital Temple Documentary Film
      </h1>

      {/* Hero Image */}
      <figure className="artwork-image">
        <img
          src="/press/edson-pavoni-orbital-temple-riseny-03.webp"
          alt="Orbital Temple 3D Rendering"
        />
        <figcaption className="caption-text">
          Orbital Temple in space.<br />
          3D rendering by RiseNY&Partners.
        </figcaption>
      </figure>

      {/* Subtitle */}
      <h2 className="section-heading" style={{ marginTop: 'var(--space-lg)' }}>
        A Rare Cultural Milestone in India's Space History
      </h2>

      {/* Opening Content */}
      <p className="body-text">
        On November 28, 2025, India will launch <em>Orbital Temple</em> aboard an ISRO rocket from the Satish Dhawan Space Centre, a first-of-its-kind, participatory art satellite created in and launched by the Global South.
      </p>

      <p className="body-text">
        Conceived by Brazilian artist Edson Pavoni, with executive direction from Bengali-American Sathi Roy, the Orbital Temple transforms satellite technology into a 10-year public memorial. People around the world will send names to space via a multilingual site, creating a decentralized ritual of remembrance that transcends borders.
      </p>

      <p className="body-text body-text--section-end">
        This is a powerful moment for India: the country's space program becomes host to an artwork that fuses spirituality, open-source innovation, and radical inclusivity.
      </p>

      {/* Funding Progress */}
      <h2 className="section-heading">
        {t('funding.heading')}
      </h2>

      <div style={{ maxWidth: '600px', margin: '0 auto 3rem auto', padding: '2rem', background: 'rgba(250, 212, 58, 0.03)', border: '1px solid var(--color-ot-gold200)', borderRadius: '4px' }}>

        <p className="body-text text-center" style={{ marginBottom: '1rem' }}>
          <strong className="price-standard">$29,000</strong> {t('funding.raised')} <strong className="price-standard">$241,000</strong> {t('funding.goal')}
        </p>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: 'rgba(250, 212, 58, 0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <div style={{ width: '12.03%', height: '100%', background: 'var(--color-ot-gold200)', borderRadius: '4px' }}></div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <a
            href="https://app.thefield.org/home/donation/general/632877/0"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', padding: '0.875rem 2rem', background: 'var(--color-ot-gold200)', color: 'var(--color-ot-dark)', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', borderRadius: '4px', transition: 'all 0.2s ease' }}>
            Make a Tax-Deductible Donation
          </a>
        </div>

      </div>

      <p className="body-text body-text--section-end" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
        Generous donators can opt to receive: Executive Producer credit · Featured in opening credits · Private screening for your guests · World premiere invitations in both cities · Behind-the-scenes access · Tax-deductible receipt
      </p>

      {/* Key Info */}
      <h2 className="section-heading">
        Key Info
      </h2>

      <p className="body-text" style={{ marginBottom: 'var(--space-sm)' }}>
        <strong>Artist:</strong> Edson Pavoni (Brazil)
      </p>

      <p className="body-text" style={{ marginBottom: 'var(--space-sm)' }}>
        <strong>Executive Producer:</strong> Sathi Roy (India)
      </p>

      <p className="body-text" style={{ marginBottom: 'var(--space-sm)' }}>
        <strong>Project Type:</strong> Satellite artwork, site-specific on space, web-based ritual
      </p>

      <p className="body-text" style={{ marginBottom: 'var(--space-sm)' }}>
        <strong>Launch Date:</strong> November 28, 2025
      </p>

      <p className="body-text" style={{ marginBottom: 'var(--space-sm)' }}>
        <strong>Launch Location:</strong> Satish Dhawan Space Centre, Sriharikota, India (ISRO)
      </p>

      <p className="body-text" style={{ marginBottom: 'var(--space-sm)' }}>
        <strong>Satellite:</strong> 1P PocketQube, 50x58x64mm, 245g
      </p>

      <p className="body-text" style={{ marginBottom: 'var(--space-sm)' }}>
        <strong>Orbit:</strong> 525km altitude, Sun-synchronous
      </p>

      <p className="body-text body-text--section-end">
        <strong>Participation:</strong> Free, open to everyone globally
      </p>

      {/* The Team */}
      <h2 className="section-heading">
        {t('people.heading')}
      </h2>

      <p className="body-text">
        {t('people.intro')}
      </p>

      {/* Team Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>

        {/* Edson Pavoni */}
        <div>
          <img
            src="/sponsors/edson-pavoni-portrait.webp"
            alt="Edson Pavoni"
            style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '4px', marginBottom: '1.5rem' }}
          />
          <h3 className="section-subtitle">{t('people.edson.name')}</h3>
          <p className="body-text body-text--secondary">
            {t('people.edson.role')}
          </p>
          <p className="body-text">
            {t('people.edson.paragraph1')}
          </p>
          <p className="body-text">
            {t('people.edson.paragraph2')}
          </p>
          <p className="body-text body-text--secondary">
            <span dangerouslySetInnerHTML={{ __html: t('people.edson.paragraph3') }} />
          </p>
        </div>

        {/* Sathi Roy */}
        <div>
          <img
            src="/sponsors/sathi-roy-portrait.webp"
            alt="Sathi Roy"
            style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '4px', marginBottom: '1.5rem' }}
          />
          <h3 className="section-subtitle">{t('people.sathi.name')}</h3>
          <p className="body-text body-text--secondary">
            {t('people.sathi.role')}
          </p>
          <p className="body-text">
            <span dangerouslySetInnerHTML={{ __html: t('people.sathi.paragraph1') }} />
          </p>
          <p className="body-text">
            <span dangerouslySetInnerHTML={{ __html: t('people.sathi.paragraph2') }} />
          </p>
          <p className="body-text body-text--secondary">
            <span dangerouslySetInnerHTML={{ __html: t('people.sathi.paragraph3') }} />
          </p>
        </div>

      </div>

      {/* Fiscal Sponsorship Info */}
      <h2 className="section-heading">
        {t('taxInfo.heading')}
      </h2>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('taxInfo.paragraph1') }} />
      </p>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('taxInfo.paragraph2') }} />
      </p>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('taxInfo.paragraph3') }} />
      </p>
    </div>
  );
}
