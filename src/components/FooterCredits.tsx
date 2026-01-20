import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function FooterCredits() {
  const { t, ready } = useTranslation('common');
  const [nameCount, setNameCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCachedCount = async () => {
      try {
        const response = await fetch('https://us-central1-orbital-temple.cloudfunctions.net/getCachedNameCount');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.total) {
            setNameCount(data.total);
          }
        }
      } catch (err) {
        console.error('Error fetching cached name count:', err);
      }
    };

    fetchCachedCount();
  }, []);

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
      {t('footer.credits', { count: nameCount ? nameCount.toLocaleString() : '...' })}
    </p>
  );
}
