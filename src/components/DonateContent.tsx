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

        {/* Option 2: Roy Foundation Deposit */}
        <div style={{ background: 'rgba(250, 212, 58, 0.03)', padding: '2.5rem', borderLeft: '4px solid var(--color-ot-gold200)', borderRadius: '4px' }}>
          <h3 className="section-subtitle" style={{ marginBottom: '1rem' }}>
            {t('option2.heading')}
          </h3>
          <p className="body-text" style={{ marginBottom: '1.5rem' }}>
            <span dangerouslySetInnerHTML={{ __html: t('option2.description') }} />
          </p>

          {/* Banking Details */}
          <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '1.5rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
            <p className="body-text" style={{ marginBottom: '0.75rem', fontWeight: 600, color: 'var(--color-ot-gold200)' }}>
              {t('option2.bankingInfo')}
            </p>
            <p className="body-text body-text--secondary" style={{ margin: '0.5rem 0', fontFamily: 'monospace' }}>
              <strong>{t('option2.fields.accountName')}</strong> The Roy Foundation<br />
              <strong>{t('option2.fields.bankName')}</strong> [Bank Name - Mock Data]<br />
              <strong>{t('option2.fields.accountNumber')}</strong> XXXX-XXXX-XXXX-1234<br />
              <strong>{t('option2.fields.routingNumber')}</strong> 123456789<br />
              <strong>{t('option2.fields.swift')}</strong> MOCKBIC123<br />
              <strong>{t('option2.fields.reference')}</strong> Orbital Temple - {donationType}
            </p>
          </div>

          <p className="body-text body-text--secondary" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <span dangerouslySetInnerHTML={{ __html: t('option2.instructions').replace('{donationType}', donationType) }} />
          </p>

          <div style={{ textAlign: 'center' }}>
            <a
              href={`mailto:sathi.roy@orbitaltemple.art?subject=Bank Deposit for Orbital Temple&body=I've completed a bank deposit for Orbital Temple.%0A%0ADonation Type: ${donationType}%0AAmount: $${amount}%0A%0APlease find my transfer details below:`}
              style={{ display: 'inline-block', padding: '1rem 2rem', border: '2px solid var(--color-ot-gold200)', color: 'var(--color-ot-light)', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', borderRadius: '4px', transition: 'all 0.2s ease' }}>
              {t('option2.button')}
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
