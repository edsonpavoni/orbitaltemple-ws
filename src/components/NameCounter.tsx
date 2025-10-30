import { useState, useEffect } from 'react';

interface NameStats {
  total: number;
  pending: number;
  sent: number;
  confirmed: number;
}

export default function NameCounter() {
  const [stats, setStats] = useState<NameStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('https://us-central1-orbital-temple.cloudfunctions.net/getNameCount');
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        if (data.success && data.stats) {
          setStats(data.stats);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching name count:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  if (loading) {
    return (
      <div style={{
        fontSize: 'var(--text-display-lg)',
        fontWeight: 700,
        color: 'var(--color-ot-gold100)',
        textAlign: 'center',
        padding: '2rem 0'
      }}>
        Loading...
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div style={{
        fontSize: 'var(--text-display-md)',
        fontWeight: 700,
        color: 'var(--color-ot-gold100)',
        textAlign: 'center',
        padding: '2rem 0'
      }}>
        Names sent to orbit
      </div>
    );
  }

  return (
    <div style={{
      textAlign: 'center',
      padding: '2rem 0'
    }}>
      <div style={{
        fontSize: 'var(--text-display-xl)',
        fontWeight: 700,
        color: 'var(--color-ot-gold100)',
        marginBottom: '0.5rem',
        lineHeight: 1
      }}>
        {stats.total.toLocaleString()}
      </div>
      <div style={{
        fontSize: 'var(--text-display-sm)',
        fontWeight: 400,
        color: 'var(--color-ot-gold200)',
        opacity: 0.8
      }}>
        names sent to the Orbital Temple
      </div>
      {stats.confirmed > 0 && (
        <div style={{
          fontSize: 'var(--text-body-std)',
          fontWeight: 400,
          color: 'var(--color-ot-gold300)',
          marginTop: '1rem',
          opacity: 0.7
        }}>
          {stats.confirmed.toLocaleString()} confirmed in orbit
        </div>
      )}
    </div>
  );
}
