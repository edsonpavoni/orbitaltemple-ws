import { useState, useEffect } from 'react';

export default function CountdownPill() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // December 25, 2025 at 04:15 UTC - Start of ISRO NOTAM launch window
    const launchDate = new Date('2025-12-25T04:15:00Z');

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.75rem',
      background: 'rgba(255,255,255,0.05)',
      padding: '0.75rem 1.5rem',
      borderRadius: '100px',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <span style={{
        fontSize: '12px',
        opacity: 0.6,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: '#ffffff',
      }}>
        Ascends to space in
      </span>
      <span style={{
        fontSize: '18px',
        fontWeight: 600,
        color: '#ffffff',
      }}>
        {timeLeft.days}<span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.7, marginLeft: '3px', marginRight: '8px' }}>days</span>{pad(timeLeft.hours)}<span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.7, marginLeft: '3px', marginRight: '8px' }}>hours</span>{pad(timeLeft.minutes)}<span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.7, marginLeft: '3px', marginRight: '8px' }}>mins</span>{pad(timeLeft.seconds)}<span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.7, marginLeft: '3px' }}>secs</span>
      </span>
    </div>
  );
}
