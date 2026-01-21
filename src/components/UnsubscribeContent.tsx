import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad: () => void;
  }
}

const RECAPTCHA_SITE_KEY = '6Ldt_VAsAAAAMyl-5xqHMDPi2bf2jvER3QVAY3C';
const FUNCTIONS_URL = 'https://us-central1-orbital-temple.cloudfunctions.net';

export default function UnsubscribeContent() {
  const [email, setEmail] = useState<string | null>(null);
  const [status, setStatus] = useState<'ready' | 'processing' | 'success' | 'error'>('ready');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRendered = useRef(false);

  // Get email from URL params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const encodedEmail = params.get('e');
      if (encodedEmail) {
        try {
          const decoded = atob(encodedEmail);
          setEmail(decoded);
        } catch (e) {
          setEmail(null);
        }
      }
    }
  }, []);

  // Load reCAPTCHA script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.grecaptcha) {
      window.onRecaptchaLoad = () => {
        setRecaptchaReady(true);
      };

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else if (window.grecaptcha) {
      setRecaptchaReady(true);
    }
  }, []);

  // Render reCAPTCHA when ready and email is available
  useEffect(() => {
    if (recaptchaReady && email && !recaptchaRendered.current && window.grecaptcha) {
      setTimeout(() => {
        const container = document.getElementById('recaptcha-container');
        if (container && container.childNodes.length === 0) {
          window.grecaptcha.render('recaptcha-container', {
            sitekey: RECAPTCHA_SITE_KEY,
            callback: (token: string) => setCaptchaToken(token),
            'expired-callback': () => setCaptchaToken(null),
          });
          recaptchaRendered.current = true;
        }
      }, 100);
    }
  }, [recaptchaReady, email]);

  const handleUnsubscribe = async () => {
    if (!email || !captchaToken) return;

    setStatus('processing');

    try {
      const response = await fetch(`${FUNCTIONS_URL}/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          captchaToken: captchaToken,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
      } else {
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
      setStatus('error');
    }
  };

  // No email in URL
  if (!email) {
    return (
      <div>
        <h1 className="artwork-title">Unsubscribe email updates</h1>
        <p className="body-text" style={{ marginTop: '2rem' }}>
          No email address found. Please use the unsubscribe link from your email.
        </p>
        <p className="body-text" style={{ marginTop: '2rem' }}>
          <a href="/en/" style={{ color: 'var(--color-ot-gold200)' }}>
            ← Back to home
          </a>
        </p>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <div>
        <h1 className="artwork-title">Unsubscribe email updates</h1>
        <p className="body-text" style={{ marginTop: '2rem', color: 'var(--color-ot-gold200)' }}>
          You have been successfully unsubscribed.
        </p>
        <p className="body-text" style={{ marginTop: '1rem' }}>
          <strong>{email}</strong>
        </p>
        <p className="body-text" style={{ marginTop: '2rem', fontStyle: 'italic', opacity: 0.8 }}>
          Thank you for being part of this journey.
        </p>
        <p className="body-text" style={{ marginTop: '3rem' }}>
          <a href="/en/" style={{ color: 'var(--color-ot-gold200)' }}>
            ← Back to home
          </a>
        </p>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div>
        <h1 className="artwork-title">Unsubscribe email updates</h1>
        <p className="body-text" style={{ marginTop: '2rem', color: '#ff6b6b' }}>
          {errorMessage}
        </p>
        <p className="body-text" style={{ marginTop: '2rem' }}>
          <button
            onClick={() => {
              setStatus('ready');
              setCaptchaToken(null);
              recaptchaRendered.current = false;
            }}
            style={{
              background: 'var(--color-ot-gold200)',
              color: '#000',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Try Again
          </button>
        </p>
      </div>
    );
  }

  // Main state - show form with captcha
  return (
    <div>
      <h1 className="artwork-title">Unsubscribe email updates</h1>

      <p className="body-text" style={{ marginTop: '2rem' }}>
        To stop receiving updates from the Orbital Temple, please confirm your unsubscription below.
      </p>

      <p className="body-text" style={{
        marginTop: '2rem',
        fontSize: '1.1rem',
        fontWeight: 600,
        color: 'var(--color-ot-gold200)',
      }}>
        {email}
      </p>

      <div id="recaptcha-container" style={{ marginTop: '2rem' }}></div>

      <p className="body-text" style={{ marginTop: '2rem' }}>
        <button
          onClick={handleUnsubscribe}
          disabled={!captchaToken || status === 'processing'}
          style={{
            background: captchaToken ? 'var(--color-ot-gold200)' : '#555',
            color: captchaToken ? '#000' : '#888',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: captchaToken ? 'pointer' : 'not-allowed',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          {status === 'processing' ? 'Processing...' : 'Unsubscribe'}
        </button>
      </p>

      <p className="body-text" style={{ marginTop: '3rem' }}>
        <a href="/en/" style={{ color: 'var(--color-ot-gold200)' }}>
          ← Back to home
        </a>
      </p>
    </div>
  );
}
