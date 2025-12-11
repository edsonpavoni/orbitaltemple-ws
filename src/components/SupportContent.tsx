import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function SupportContent() {
  const { t, ready } = useTranslation('support');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleVideoClick = () => {
    setIsVideoPlaying(true);
  };

  const handleMouseEnter = () => {
    if (!isVideoPlaying) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (!ready) {
    return null;
  }

  return (
    <div>
      {/* Main Title */}
      <h1 className="artwork-title">
        {t('heading')}
      </h1>

      {/* Opening Vision */}
      <p className="body-text" style={{ maxWidth: '900px', margin: '0 auto 3rem auto' }}>
        <span dangerouslySetInnerHTML={{ __html: t('vision') }} />
      </p>

      {/* Visual Content Section */}
      <figure style={{ margin: '3rem auto 48px auto', maxWidth: '900px' }}>
        <div
          onClick={handleVideoClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            borderRadius: '4px',
            cursor: isVideoPlaying ? 'default' : 'pointer'
          }}
        >
          {/* Video Thumbnail */}
          {!isVideoPlaying && (
            <img
              src="https://img.youtube.com/vi/xf-Fj_YaRik/maxresdefault.jpg"
              alt="Orbital Temple video introduction"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
            />
          )}
          {/* Play Button Overlay */}
          {!isVideoPlaying && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: isHovered ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%) scale(1)',
              width: '80px',
              height: '80px',
              background: isHovered ? 'rgba(250, 212, 58, 0.9)' : 'rgba(0, 0, 0, 0.7)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white" style={{ marginLeft: '4px' }}>
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          )}
          {/* YouTube iframe */}
          {isVideoPlaying && (
            <iframe
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '4px' }}
              src="https://www.youtube.com/embed/xf-Fj_YaRik?autoplay=1"
              title="Orbital Temple video introduction"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen>
            </iframe>
          )}
        </div>
        <figcaption className="caption-text">
          {t('videoCaption')}
        </figcaption>
      </figure>

      {/* What We've Accomplished */}
      <h2 className="section-heading" style={{ marginTop: '72px' }}>
        {t('accomplished.heading')}
      </h2>

      <p className="body-text body-text--section-end">
        <span dangerouslySetInnerHTML={{ __html: t('accomplished.content') }} />
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
            {t('funding.button')}
          </a>
        </div>

      </div>

      {/* What We Need Support For */}
      <h2 className="section-heading">
        {t('needs.heading')}
      </h2>

      <p className="body-text">
        {t('needs.intro')}
      </p>

      <div style={{ display: 'grid', gap: '1.25rem', marginBottom: '48px', paddingLeft: '1.5rem' }}>
        <p className="body-text" style={{ margin: 0 }}>
          · <strong>{t('needs.launch.title')}</strong> $32,000
        </p>
        <p className="body-text" style={{ margin: 0 }}>
          · <strong>{t('needs.travel.title')}</strong> $6,000
        </p>
        <p className="body-text" style={{ margin: 0 }}>
          · <strong>{t('needs.carbon.title')}</strong> $2,000
        </p>
        <p className="body-text" style={{ margin: 0 }}>
          · <strong>{t('needs.education.title')}</strong> $46,000
        </p>
        <p className="body-text" style={{ margin: 0 }}>
          · <strong>{t('needs.docPreProd.title')}</strong> $38,000
        </p>
        <p className="body-text" style={{ margin: 0 }}>
          · <strong>{t('needs.docProd.title')}</strong> $88,000
        </p>
      </div>

      {/* The Decade Ahead */}
      <h2 className="section-heading">
        {t('decade.heading')}
      </h2>

      <p className="body-text">
        {t('decade.intro')}
      </p>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('decade.paragraph1') }} />
      </p>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('decade.paragraph2') }} />
      </p>

      <p className="body-text body-text--section-end">
        {t('decade.paragraph3')}
      </p>

      {/* Ways to Support */}
      <h2 className="section-heading">
        {t('waysToSupport.heading')}
      </h2>

      <h3 className="subsection-heading" style={{ margin: '1.5rem 0 1rem 0' }}>
        {t('waysToSupport.individualDonations.heading')}
      </h3>

      <p className="body-text" style={{ marginBottom: '32px' }}>
        {t('waysToSupport.individualDonations.intro')}
      </p>

      <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '4rem', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>

        {/* $100 Tier */}
        <div style={{ background: 'rgba(250, 212, 58, 0.02)', padding: '1.75rem', borderLeft: '3px solid var(--color-ot-gold200)', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className="section-subtitle" style={{ margin: 0 }}>{t('waysToSupport.individualDonations.stargazer.title')}</h3>
            <p className="price-small">$100</p>
          </div>
          <p className="body-text body-text--secondary" style={{ marginTop: '0.75rem' }}>
            {t('waysToSupport.individualDonations.stargazer.benefits')}
          </p>
          <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
            <a
              href="https://app.thefield.org/home/donation/general/632877/0"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid var(--color-ot-gold200)', color: 'var(--color-ot-light)', textDecoration: 'none', borderRadius: '3px', transition: 'all 0.2s ease' }}>
              {t('waysToSupport.individualDonations.stargazer.button')}
            </a>
          </div>
        </div>

        {/* $1,000 Tier */}
        <div style={{ background: 'rgba(250, 212, 58, 0.02)', padding: '1.75rem', borderLeft: '3px solid var(--color-ot-gold200)', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className="section-subtitle" style={{ margin: 0 }}>{t('waysToSupport.individualDonations.orbitalFriend.title')}</h3>
            <p className="price-small">$1,000</p>
          </div>
          <p className="body-text body-text--secondary" style={{ marginTop: '0.75rem' }}>
            {t('waysToSupport.individualDonations.orbitalFriend.benefits')}
          </p>
          <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
            <a
              href="https://app.thefield.org/home/donation/general/632877/0"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid var(--color-ot-gold200)', color: 'var(--color-ot-light)', textDecoration: 'none', borderRadius: '3px', transition: 'all 0.2s ease' }}>
              {t('waysToSupport.individualDonations.orbitalFriend.button')}
            </a>
          </div>
        </div>

        {/* $2,500 Tier */}
        <div style={{ background: 'rgba(250, 212, 58, 0.02)', padding: '1.75rem', borderLeft: '3px solid var(--color-ot-gold200)', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className="section-subtitle" style={{ margin: 0 }}>{t('waysToSupport.individualDonations.satelliteSupporter.title')}</h3>
            <p className="price-small">$2,500</p>
          </div>
          <p className="body-text body-text--secondary" style={{ marginTop: '0.75rem' }}>
            {t('waysToSupport.individualDonations.satelliteSupporter.benefits')}
          </p>
          <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
            <a
              href="https://app.thefield.org/home/donation/general/632877/0"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid var(--color-ot-gold200)', color: 'var(--color-ot-light)', textDecoration: 'none', borderRadius: '3px', transition: 'all 0.2s ease' }}>
              {t('waysToSupport.individualDonations.satelliteSupporter.button')}
            </a>
          </div>
        </div>

        {/* $5,000 Tier */}
        <div style={{ background: 'rgba(250, 212, 58, 0.02)', padding: '1.75rem', borderLeft: '3px solid var(--color-ot-gold200)', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className="section-subtitle" style={{ margin: 0 }}>{t('waysToSupport.individualDonations.spaceAdvocate.title')}</h3>
            <p className="price-small">$5,000</p>
          </div>
          <p className="body-text body-text--secondary" style={{ marginTop: '0.75rem' }}>
            {t('waysToSupport.individualDonations.spaceAdvocate.benefits')}
          </p>
          <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
            <a
              href="https://app.thefield.org/home/donation/general/632877/0"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid var(--color-ot-gold200)', color: 'var(--color-ot-light)', textDecoration: 'none', borderRadius: '3px', transition: 'all 0.2s ease' }}>
              {t('waysToSupport.individualDonations.spaceAdvocate.button')}
            </a>
          </div>
        </div>

      </div>

      {/* Funding Opportunities */}
      <h3 className="subsection-heading" style={{ margin: '2rem 0 1rem 0' }}>
        {t('fundingOpportunities.heading')}
      </h3>

      <p className="body-text" style={{ marginBottom: '32px' }}>
        {t('fundingOpportunities.intro')}
      </p>

      <div style={{ display: 'grid', gap: '2rem', marginBottom: '4rem' }}>

        {/* Satellite Launch */}
        <div style={{ background: 'rgba(250, 212, 58, 0.03)', padding: '2rem', borderLeft: '4px solid var(--color-ot-gold200)', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className="section-subtitle" style={{ margin: 0 }}>{t('fundingOpportunities.launch.title')}</h3>
            <p className="price-standard">$32,000</p>
          </div>
          <p className="body-text">
            <span dangerouslySetInnerHTML={{ __html: t('fundingOpportunities.launch.description') }} />
          </p>
          <p className="body-text body-text--secondary" style={{ marginTop: '1rem' }}>
            {t('fundingOpportunities.launch.benefits')}
          </p>
          <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
            <a
              href="https://app.thefield.org/home/donation/general/632877/0"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid var(--color-ot-gold200)', color: 'var(--color-ot-light)', textDecoration: 'none', borderRadius: '3px', transition: 'all 0.2s ease' }}>
              {t('fundingOpportunities.launch.button')}
            </a>
          </div>
        </div>

        {/* Artist Travel */}
        <div style={{ background: 'rgba(250, 212, 58, 0.03)', padding: '2rem', borderLeft: '4px solid var(--color-ot-gold200)', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className="section-subtitle" style={{ margin: 0 }}>{t('fundingOpportunities.travel.title')}</h3>
            <p className="price-standard">$6,000</p>
          </div>
          <p className="body-text">
            <span dangerouslySetInnerHTML={{ __html: t('fundingOpportunities.travel.description') }} />
          </p>
          <p className="body-text body-text--secondary" style={{ marginTop: '1rem' }}>
            {t('fundingOpportunities.travel.benefits')}
          </p>
          <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
            <a
              href="https://app.thefield.org/home/donation/general/632877/0"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid var(--color-ot-gold200)', color: 'var(--color-ot-light)', textDecoration: 'none', borderRadius: '3px', transition: 'all 0.2s ease' }}>
              {t('fundingOpportunities.travel.button')}
            </a>
          </div>
        </div>

        {/* Carbon Offset */}
        <div style={{ background: 'rgba(250, 212, 58, 0.03)', padding: '2rem', borderLeft: '4px solid var(--color-ot-gold200)', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className="section-subtitle" style={{ margin: 0 }}>{t('fundingOpportunities.carbon.title')}</h3>
            <p className="price-standard">$2,000</p>
          </div>
          <p className="body-text">
            {t('fundingOpportunities.carbon.description')}
          </p>
          <p className="body-text body-text--secondary" style={{ marginTop: '1rem' }}>
            {t('fundingOpportunities.carbon.benefits')}
          </p>
          <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
            <a
              href="https://app.thefield.org/home/donation/general/632877/0"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid var(--color-ot-gold200)', color: 'var(--color-ot-light)', textDecoration: 'none', borderRadius: '3px', transition: 'all 0.2s ease' }}>
              {t('fundingOpportunities.carbon.button')}
            </a>
          </div>
        </div>

        {/* Educational Program */}
        <div style={{ background: 'rgba(250, 212, 58, 0.03)', padding: '2rem', borderLeft: '4px solid var(--color-ot-gold200)', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className="section-subtitle" style={{ margin: 0 }}>{t('fundingOpportunities.education.title')}</h3>
            <p className="price-standard">$46,000</p>
          </div>
          <p className="body-text">
            {t('fundingOpportunities.education.description')}
          </p>
          <p className="body-text body-text--secondary" style={{ marginTop: '1rem' }}>
            {t('fundingOpportunities.education.benefits')}
          </p>
          <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
            <a
              href="https://app.thefield.org/home/donation/general/632877/0"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid var(--color-ot-gold200)', color: 'var(--color-ot-light)', textDecoration: 'none', borderRadius: '3px', transition: 'all 0.2s ease' }}>
              {t('fundingOpportunities.education.button')}
            </a>
          </div>
        </div>

        {/* Documentary Pre-Production */}
        <div style={{ background: 'rgba(250, 212, 58, 0.03)', padding: '2rem', borderLeft: '4px solid var(--color-ot-gold200)', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className="section-subtitle" style={{ margin: 0 }}>{t('fundingOpportunities.docPreProd.title')}</h3>
            <p className="price-standard">$38,000</p>
          </div>
          <p className="body-text">
            <span dangerouslySetInnerHTML={{ __html: t('fundingOpportunities.docPreProd.description') }} />
          </p>
          <p className="body-text body-text--secondary" style={{ marginTop: '1rem' }}>
            {t('fundingOpportunities.docPreProd.benefits')}
          </p>
          <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
            <a
              href="https://app.thefield.org/home/donation/general/632877/0"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid var(--color-ot-gold200)', color: 'var(--color-ot-light)', textDecoration: 'none', borderRadius: '3px', transition: 'all 0.2s ease' }}>
              {t('fundingOpportunities.docPreProd.button')}
            </a>
          </div>
        </div>

        {/* Documentary Production */}
        <div style={{ background: 'rgba(250, 212, 58, 0.03)', padding: '2rem', borderLeft: '4px solid var(--color-ot-gold200)', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className="section-subtitle" style={{ margin: 0 }}>{t('fundingOpportunities.docProd.title')}</h3>
            <p className="price-standard">$88,000</p>
          </div>
          <p className="body-text">
            <span dangerouslySetInnerHTML={{ __html: t('fundingOpportunities.docProd.description') }} />
          </p>
          <p className="body-text body-text--secondary" style={{ marginTop: '1rem' }}>
            {t('fundingOpportunities.docProd.benefits')}
          </p>
          <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
            <a
              href="https://app.thefield.org/home/donation/general/632877/0"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid var(--color-ot-gold200)', color: 'var(--color-ot-light)', textDecoration: 'none', borderRadius: '3px', transition: 'all 0.2s ease' }}>
              {t('fundingOpportunities.docProd.button')}
            </a>
          </div>
        </div>

        {/* Art Collector */}
        <div style={{ background: 'linear-gradient(135deg, rgba(250, 212, 58, 0.12) 0%, rgba(250, 212, 58, 0.03) 100%)', padding: '3rem', border: '3px solid var(--color-ot-gold200)', borderRadius: '4px' }}>
          <h3 className="section-heading text-gold" style={{ margin: '0 0 1.5rem 0' }}>{t('fundingOpportunities.artCollector.title')}</h3>

          <figure style={{ margin: '0 0 2rem 0' }}>
            <img
              src="/press/edson-pavoni-orbital-temple-clara-marques-07.webp"
              alt={t('fundingOpportunities.artCollector.imageAlt')}
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }}
            />
            <figcaption style={{ fontSize: 'var(--text-body-sm)', lineHeight: 'var(--text-body-sm-lh)', color: 'var(--color-ot-gold100)', opacity: 0.6, marginTop: '8px', textAlign: 'right' }}>
              {t('fundingOpportunities.artCollector.imageCaption')}
            </figcaption>
          </figure>

          <p className="body-text">
            <span dangerouslySetInnerHTML={{ __html: t('fundingOpportunities.artCollector.paragraph1') }} />
          </p>

          <p className="body-text">
            <span dangerouslySetInnerHTML={{ __html: t('fundingOpportunities.artCollector.paragraph2') }} />
          </p>

          <p className="body-text">
            <span dangerouslySetInnerHTML={{ __html: t('fundingOpportunities.artCollector.paragraph3') }} />
          </p>

          <p className="body-text">
            <span dangerouslySetInnerHTML={{ __html: t('fundingOpportunities.artCollector.paragraph4') }} />
          </p>

          <p className="body-text" style={{ marginBottom: '2rem' }}>
            <span dangerouslySetInnerHTML={{ __html: t('fundingOpportunities.artCollector.paragraph5') }} />
          </p>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p className="price-small" style={{ margin: '0 0 1rem 0' }}>$50,000</p>
            <a
              href="mailto:gabriela.veiga@orbitaltemple.art?subject=Orbital Temple Art Collector Inquiry"
              style={{ display: 'inline-block', padding: '1rem 2.5rem', background: 'var(--color-ot-gold200)', color: 'var(--color-ot-dark)', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', borderRadius: '4px', transition: 'all 0.2s ease' }}>
              {t('fundingOpportunities.artCollector.button')}
            </a>
          </div>
        </div>

      </div>

      {/* Current Supporters */}
      <h2 className="section-heading">
        {t('gratitude.heading')}
      </h2>

      <p className="body-text" style={{ marginBottom: '2rem' }}>
        {t('gratitude.intro')}
      </p>

      <div style={{ margin: '0 0 3rem 0', padding: '2.5rem', background: 'rgba(250, 212, 58, 0.05)', border: '2px solid var(--color-ot-gold200)', borderRadius: '4px' }}>
        <img
          src="https://cdn.prod.website-files.com/5f467eca8efd267ebe6dc293/63b59b7475377c988b04eb2e_Pearmill-logo-svg.svg"
          alt="Pearmill"
          style={{ height: '40px', marginBottom: '1.5rem' }}
        />
        <p className="body-text" style={{ margin: '0 0 1rem 0', fontWeight: 600, color: 'var(--color-ot-gold200)' }}>
          {t('gratitude.pearmill.title')}
        </p>
        <p className="body-text" style={{ margin: 0, lineHeight: 1.6 }}>
          {t('gratitude.pearmill.description')}
        </p>
      </div>

      <p className="body-text" style={{ textAlign: 'center', fontStyle: 'italic', opacity: 0.9 }}>
        {t('gratitude.yourName')}
      </p>

      {/* The Team */}
      <h2 className="section-heading">
        {t('people.heading')}
      </h2>

      <p className="body-text" style={{ marginBottom: '2rem' }}>
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
          <h3 className="section-subtitle" style={{ marginBottom: '0.5rem' }}>{t('people.edson.name')}</h3>
          <p className="body-text body-text--secondary" style={{ marginBottom: '1rem' }}>
            {t('people.edson.role')}
          </p>
          <p className="body-text" style={{ marginBottom: '0.75rem' }}>
            {t('people.edson.paragraph1')}
          </p>
          <p className="body-text" style={{ marginBottom: '0.75rem' }}>
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
          <h3 className="section-subtitle" style={{ marginBottom: '0.5rem' }}>{t('people.sathi.name')}</h3>
          <p className="body-text body-text--secondary" style={{ marginBottom: '1rem' }}>
            {t('people.sathi.role')}
          </p>
          <p className="body-text" style={{ marginBottom: '0.75rem' }}>
            <span dangerouslySetInnerHTML={{ __html: t('people.sathi.paragraph1') }} />
          </p>
          <p className="body-text" style={{ marginBottom: '0.75rem' }}>
            <span dangerouslySetInnerHTML={{ __html: t('people.sathi.paragraph2') }} />
          </p>
          <p className="body-text body-text--secondary">
            <span dangerouslySetInnerHTML={{ __html: t('people.sathi.paragraph3') }} />
          </p>
        </div>

      </div>

      <p className="body-text" style={{ textAlign: 'center', marginBottom: '3rem', fontStyle: 'italic', opacity: 0.95 }}>
        {t('people.together')}
      </p>

      {/* Take Action */}
      <h2 className="section-heading">
        {t('join.heading')}
      </h2>

      <p className="body-text" style={{ marginBottom: '2rem' }}>
        <span dangerouslySetInnerHTML={{ __html: t('join.content') }} />
      </p>

      <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '4rem' }}>

        {/* Contact for Major Sponsorship */}
        <div style={{ background: 'rgba(250, 212, 58, 0.05)', padding: '2rem', borderLeft: '4px solid var(--color-ot-gold200)', borderRadius: '4px' }}>
          <h3 className="section-subtitle" style={{ marginBottom: '1rem' }}>{t('join.fundSpecific.heading')}</h3>
          <p className="body-text" style={{ marginBottom: '1.5rem' }}>
            {t('join.fundSpecific.description')}
          </p>
          <a
            href="mailto:sathi.roy@orbitaltemple.art?subject=Orbital Temple Sponsorship Inquiry"
            style={{ display: 'inline-block', padding: '1rem 2rem', background: 'var(--color-ot-gold200)', color: 'var(--color-ot-dark)', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', borderRadius: '4px', transition: 'all 0.2s ease' }}>
            {t('join.fundSpecific.button')}
          </a>
        </div>

        {/* General Donation */}
        <div style={{ background: 'rgba(250, 212, 58, 0.03)', padding: '2rem', borderLeft: '4px solid var(--color-ot-gold200)', borderRadius: '4px' }}>
          <h3 className="section-subtitle" style={{ marginBottom: '1rem' }}>{t('join.generalDonation.heading')}</h3>
          <p className="body-text" style={{ marginBottom: '1.5rem' }}>
            {t('join.generalDonation.description')}
          </p>
          <a
            href="https://app.thefield.org/home/donation/general/632877/0"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', padding: '1rem 2rem', border: '2px solid var(--color-ot-gold200)', color: 'var(--color-ot-light)', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', borderRadius: '4px', transition: 'all 0.2s ease' }}>
            {t('join.generalDonation.button')}
          </a>
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

      <p className="body-text body-text--section-end">
        <span dangerouslySetInnerHTML={{ __html: t('taxInfo.paragraph3') }} />
      </p>
    </div>
  );
}
