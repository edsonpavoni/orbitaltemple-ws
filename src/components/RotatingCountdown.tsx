import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { countdownTranslations } from '../data/countdownTranslations';
import { SUPPORTED_LANGUAGES } from '../lib/i18n';

// Get current language from URL path
const getCurrentLang = () => {
  if (typeof window === 'undefined') return 'en';
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const urlLang = pathParts[0];
  const isSupported = SUPPORTED_LANGUAGES.some(lang => lang.code === urlLang);
  return isSupported ? urlLang : 'en';
};

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function RotatingCountdown() {
  const { i18n } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Get translation based on current i18n language
  const currentTranslation = countdownTranslations.find(t => t.code === i18n.language)
    || countdownTranslations.find(t => t.code === 'en')
    || countdownTranslations[0];

  // Countdown timer
  useEffect(() => {
    // January 11, 2026 at 04:15 UTC - Launch window opening date confirmed by India
    const launchDate = new Date('2026-01-11T04:15:00Z');

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
          <TimeUnit value={timeLeft.days} label={currentTranslation.days} />
          <TimeUnit value={timeLeft.hours} label={currentTranslation.hours} />
          <TimeUnit value={timeLeft.minutes} label={currentTranslation.minutes} />
          <TimeUnit value={timeLeft.seconds} label={currentTranslation.seconds} />
        </div>
      </div>

      {/* Launch Text */}
      <p style={{
        fontSize: '16px',
        lineHeight: 1.6,
        color: '#ffffff',
        opacity: 0.9,
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {currentTranslation.description}
      </p>
    </>
  );
}

// Separate component for notify link that syncs with language rotation
export function RotatingNotifyLink() {
  const { i18n } = useTranslation();
  const lang = getCurrentLang();

  // Get translation based on current i18n language
  const currentTranslation = countdownTranslations.find(t => t.code === i18n.language)
    || countdownTranslations.find(t => t.code === 'en')
    || countdownTranslations[0];

  return (
    <a
      href={`/${lang}/notify-me`}
      style={{
        color: '#ffffff',
        opacity: 0.6,
        fontSize: '14px',
        textDecoration: 'none'
      }}
      className="notify-link-rotating"
    >
      {currentTranslation.notify}
    </a>
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
