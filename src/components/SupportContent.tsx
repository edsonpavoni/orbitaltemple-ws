import { useTranslation } from 'react-i18next';

// Simple support page (Oct 2026). The long fundraising page (goals, tiers, funding
// opportunities) is in git history before this commit; it will come back redone later.
// Every string here already exists in all languages: support, updates and donate namespaces.
export default function SupportContent() {
  const { t, ready } = useTranslation(['support', 'updates', 'donate']);

  if (!ready) {
    return null;
  }

  const fieldUrl = 'https://app.thefield.org/home/donation/general/632877/0';

  return (
    <div>
      <h1 className="artwork-title">
        {t('support:heading')}
      </h1>

      <p className="body-text" style={{ maxWidth: '700px', margin: '0 auto 2rem auto' }}>
        {t('updates:support.text')}
      </p>

      <div style={{ textAlign: 'center', margin: '0 auto 1.5rem auto' }}>
        <a
          href={fieldUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', padding: '1rem 2rem', background: 'var(--color-ot-gold200)', color: 'var(--color-ot-dark)', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', borderRadius: '4px', transition: 'all 0.2s ease' }}>
          {t('support:join.generalDonation.button')}
        </a>
      </div>

      <p className="body-text body-text--secondary" style={{ maxWidth: '700px', margin: '0 auto 4rem auto', textAlign: 'center' }}>
        {t('support:join.generalDonation.description')}
      </p>

      <h2 className="section-heading">
        {t('support:taxInfo.heading')}
      </h2>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('support:taxInfo.paragraph1') }} />
      </p>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('support:taxInfo.paragraph2') }} />
      </p>

      <p className="body-text">
        <span dangerouslySetInnerHTML={{ __html: t('support:taxInfo.paragraph3') }} />
      </p>

      <p className="body-text body-text--secondary body-text--section-end">
        <span dangerouslySetInnerHTML={{ __html: t('donate:taxInfo.questions') }} />
      </p>
    </div>
  );
}
