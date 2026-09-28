import { useTranslation } from 'react-i18next';

interface DonateContentProps {
  donationType: string;
  amount: string;
}

export default function DonateContent({ donationType, amount }: DonateContentProps) {
  const { t, ready } = useTranslation('donate');

  if (!ready) {
    return null;
  }

  const fieldUrl = `https://app.thefield.org/home/donation/general/632877/${amount}`;

  return (
    <div>
      {/* Main Title */}
      <h1 className="artwork-title">
        {t('heading')}
      </h1>

      {/* Donation Details */}
      <div style={{ maxWidth: '600px', margin: '0 auto 3rem auto', padding: '2rem', background: 'rgba(250, 212, 58, 0.05)', border: '2px solid var(--color-ot-gold200)', borderRadius: '8px', textAlign: 'center' }}>
        <p className="body-text" style={{ marginBottom: '0.5rem', opacity: 0.8 }}>
          {t('donatingTo')}
        </p>
        <h2 className="section-subtitle" style={{ marginBottom: '1rem' }}>
          {donationType}
        </h2>
        {amount !== '0' && (
          <p className="price-standard" style={{ margin: 0 }}>
            ${parseInt(amount).toLocaleString()}
          </p>
        )}
      </div>

      <p className="body-text" style={{ maxWidth: '800px', margin: '0 auto 3rem auto', textAlign: 'center' }}>
        {t('chooseHow')}
      </p>

      {/* Donation Options */}
      <div style={{ display: 'grid', gap: '2rem', marginBottom: '4rem', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>

        {/* Option 1: Field Payment */}
        <div style={{ background: 'rgba(250, 212, 58, 0.03)', padding: '2.5rem', borderLeft: '4px solid var(--color-ot-gold200)', borderRadius: '4px' }}>
          <h3 className="section-subtitle" style={{ marginBottom: '1rem' }}>
            {t('option1.heading')}
          </h3>
          <p className="body-text" style={{ marginBottom: '1.5rem' }}>
            <span dangerouslySetInnerHTML={{ __html: t('option1.description') }} />
          </p>
          <div style={{ textAlign: 'center' }}>
            <a
              href={fieldUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '1rem 2rem', background: 'var(--color-ot-gold200)', color: 'var(--color-ot-dark)', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', borderRadius: '4px', transition: 'all 0.2s ease' }}>
              {t('option1.button')}
            </a>
          </div>
        </div>

      </div>

      {/* Tax Information */}
      <div style={{ maxWidth: '800px', margin: '0 auto 4rem auto', padding: '2rem', background: 'rgba(250, 212, 58, 0.02)', borderRadius: '4px' }}>
        <h3 className="section-subtitle" style={{ marginBottom: '1rem' }}>
          {t('taxInfo.heading')}
        </h3>
        <p className="body-text" style={{ marginBottom: '1rem' }}>
          <span dangerouslySetInnerHTML={{ __html: t('taxInfo.description') }} />
        </p>
        <p className="body-text body-text--secondary" style={{ margin: 0 }}>
          <span dangerouslySetInnerHTML={{ __html: t('taxInfo.questions') }} />
        </p>
      </div>
    </div>
  );
}
