import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // December 25, 2025 at 04:15 UTC - Start of ISRO NOTAM launch window
    const launchDate = new Date('2025-12-25T04:15:00Z');

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-timer" style={{
      display: 'flex',
      gap: '2rem',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      margin: '2rem 0'
    }}>
      <TimeUnit value={timeLeft.days} label="days" />
      <TimeUnit value={timeLeft.hours} label="hours" />
      <TimeUnit value={timeLeft.minutes} label="minutes" />
      <TimeUnit value={timeLeft.seconds} label="seconds" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="time-unit" style={{
      textAlign: 'center',
      minWidth: '80px'
    }}>
      <div className="time-value" style={{
        fontSize: '48px',
        fontWeight: 700,
        lineHeight: 1,
        color: '#ffffff',
        marginBottom: '0.5rem'
      }}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="time-label" style={{
        fontSize: '14px',
        fontWeight: 400,
        color: '#ffffff',
        opacity: 0.6,
        textTransform: 'lowercase'
      }}>
        {label}
      </div>
    </div>
  );
}
