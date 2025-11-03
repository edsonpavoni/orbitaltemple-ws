import { useState, useEffect } from 'react';
import { countdownTranslations } from '../data/countdownTranslations';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function RotatingCountdown() {
  const [currentLangIndex, setCurrentLangIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Rotate languages every 5 seconds
  useEffect(() => {
    const langInterval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentLangIndex((prev) => (prev + 1) % countdownTranslations.length);
        setFadeIn(true);
      }, 300);
    }, 5000);

    return () => clearInterval(langInterval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const launchDate = new Date('2025-11-28T14:00:00Z');

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

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentTranslation = countdownTranslations[currentLangIndex];

  return (
    <>
      {/* Countdown Timer */}
      <div style={{ marginBottom: '3rem' }}>
        <div className="countdown-timer" style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          margin: '2rem 0'
        }}>
          <TimeUnit value={timeLeft.days} label={currentTranslation.days} fadeIn={fadeIn} />
          <TimeUnit value={timeLeft.hours} label={currentTranslation.hours} fadeIn={fadeIn} />
          <TimeUnit value={timeLeft.minutes} label={currentTranslation.minutes} fadeIn={fadeIn} />
          <TimeUnit value={timeLeft.seconds} label={currentTranslation.seconds} fadeIn={fadeIn} />
        </div>
      </div>

      {/* Launch Text */}
      <p style={{
        fontSize: '16px',
        lineHeight: 1.6,
        color: '#ffffff',
        opacity: fadeIn ? 0.9 : 0,
        maxWidth: '600px',
        margin: '0 auto',
        transition: 'opacity 0.3s ease',
        textAlign: 'center'
      }}>
        {currentTranslation.description}
      </p>
    </>
  );
}

// Separate component for notify link that syncs with language rotation
export function RotatingNotifyLink() {
  const [currentLangIndex, setCurrentLangIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const langInterval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentLangIndex((prev) => (prev + 1) % countdownTranslations.length);
        setFadeIn(true);
      }, 300);
    }, 5000);

    return () => clearInterval(langInterval);
  }, []);

  const currentTranslation = countdownTranslations[currentLangIndex];

  return (
    <a
      href="/notify-me"
      style={{
        color: '#ffffff',
        opacity: fadeIn ? 0.6 : 0,
        fontSize: '14px',
        textDecoration: 'none',
        transition: 'opacity 0.3s ease'
      }}
      className="notify-link-rotating"
    >
      {currentTranslation.notify}
    </a>
  );
}

function TimeUnit({ value, label, fadeIn }: { value: number; label: string; fadeIn: boolean }) {
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
        opacity: fadeIn ? 0.6 : 0,
        textTransform: 'lowercase',
        transition: 'opacity 0.3s ease'
      }}>
        {label}
      </div>
    </div>
  );
}
