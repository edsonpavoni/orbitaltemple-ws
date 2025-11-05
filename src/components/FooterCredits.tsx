import { useTranslation } from 'react-i18next';

export default function FooterCredits() {
  const { t, ready } = useTranslation('common');

  if (!ready) {
    return null;
  }

  return (
    <p style={{
      fontSize: 'var(--text-body-sm)',
      lineHeight: 'var(--text-body-sm-lh)',
      color: 'var(--color-ot-gold100)',
      opacity: 0.6,
      maxWidth: '720px',
      margin: '0 auto',
      textAlign: 'left'
    }}>
      {t('footer.credits')}
    </p>
  );
}
