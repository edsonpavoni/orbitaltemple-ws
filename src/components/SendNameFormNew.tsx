import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Starfield from './Starfield';

type Step = 'breathing' | 'name-input' | 'email-input' | 'loading' | 'complete';

// Email validation regex - created once, not per render
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Step order for transition calculations
const STEP_ORDER: Step[] = ['breathing', 'name-input', 'email-input', 'loading', 'complete'];

export default function SendNameForm() {
  const [currentStep, setCurrentStep] = useState<Step>('breathing');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [breathingScale, setBreathingScale] = useState(1);
  const [viewportHeight, setViewportHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [nameFontSize, setNameFontSize] = useState(30);
  const [emailFontSize, setEmailFontSize] = useState(30);
  const [speedBoost, setSpeedBoost] = useState(0);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Email validation function - memoized
  const validateEmail = useCallback((email: string): boolean => {
    return EMAIL_REGEX.test(email);
  }, []);

  // Track viewport height changes with smooth transitions
  useEffect(() => {
    const updateViewportHeight = () => {
      const newHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      setViewportHeight(newHeight);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight);
    }

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewportHeight);
      }
    };
  }, []);

  // Breathing animation (3 seconds for testing)
  useEffect(() => {
    if (currentStep === 'breathing') {
      const breathingCycle = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed % breathingCycle) / breathingCycle;
        const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.15;
        setBreathingScale(scale);
        requestAnimationFrame(animate);
      };

      const animationId = requestAnimationFrame(animate);

      // Auto-advance after 3 seconds
      const timer = setTimeout(() => {
        setCurrentStep('name-input');
        // Trigger speed boost when advancing to name input
        setSpeedBoost(prev => prev + 1);
      }, 3000);

      return () => {
        cancelAnimationFrame(animationId);
        clearTimeout(timer);
      };
    }
  }, [currentStep]);

  // Track name input changes for speed boost
  const prevNameLengthRef = useRef(0);
  useEffect(() => {
    if (name.length > prevNameLengthRef.current) {
      // User typed a character
      setSpeedBoost(prev => prev + 1);
    }
    prevNameLengthRef.current = name.length;
  }, [name]);

  // Track email input changes for speed boost
  const prevEmailLengthRef = useRef(0);
  useEffect(() => {
    if (email.length > prevEmailLengthRef.current) {
      // User typed a character
      setSpeedBoost(prev => prev + 1);
    }
    prevEmailLengthRef.current = email.length;
  }, [email]);

  // Detect keyboard open/close using focusin/focusout events
  useEffect(() => {
    const isKeyboardInput = (elem: HTMLElement) =>
      (elem.tagName === 'INPUT' &&
        !['button', 'submit', 'checkbox', 'file', 'image'].includes(
          (elem as HTMLInputElement).type,
        )) ||
      elem.hasAttribute('contenteditable');

    const handleFocusIn = (e: FocusEvent) => {
      if (e.target instanceof HTMLElement && isKeyboardInput(e.target)) {
        setIsKeyboardOpen(true);
        // Prevent iOS from scrolling content up
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
        }, 0);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      if (e.target instanceof HTMLElement && isKeyboardInput(e.target)) {
        setIsKeyboardOpen(false);
        // Reset scroll position when keyboard closes
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
        }, 0);
      }
    };

    // Blur handler to restore position after keyboard closes
    const handleBlur = (e: FocusEvent) => {
      if (e.target instanceof HTMLElement &&
          (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        requestAnimationFrame(() => {
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
        });
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    document.addEventListener('blur', handleBlur, true);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      document.removeEventListener('blur', handleBlur, true);
    };
  }, []);

  // Dynamic font sizing for name input
  useEffect(() => {
    if (nameInputRef.current) {
      const containerWidth = nameInputRef.current.offsetWidth;
      const textWidth = nameInputRef.current.scrollWidth;

      if (textWidth > containerWidth && name.length > 0) {
        // Calculate new font size to fit text
        const ratio = containerWidth / textWidth;
        const newSize = Math.max(16, Math.min(30, 30 * ratio));
        setNameFontSize(newSize);
      } else {
        setNameFontSize(30);
      }
    }
  }, [name]);

  // Dynamic font sizing for email input
  useEffect(() => {
    if (emailInputRef.current) {
      const containerWidth = emailInputRef.current.offsetWidth;
      const textWidth = emailInputRef.current.scrollWidth;

      if (textWidth > containerWidth && email.length > 0) {
        // Calculate new font size to fit text
        const ratio = containerWidth / textWidth;
        const newSize = Math.max(16, Math.min(30, 30 * ratio));
        setEmailFontSize(newSize);
      } else {
        setEmailFontSize(30);
      }
    }
  }, [email]);

  // Validate email whenever it changes
  useEffect(() => {
    setIsEmailValid(validateEmail(email));
  }, [email]);

  // Animate dome down through journey stages
  useEffect(() => {
    const domeImage = document.getElementById('dome-image');
    if (!domeImage) return;

    if (currentStep === 'breathing') {
      // Start: dome fully hidden
      domeImage.style.transform = 'translateY(-100%)';
    } else if (currentStep === 'name-input' || currentStep === 'email-input' || currentStep === 'loading') {
      // During journey: show bottom portion only (about 72px visible)
      domeImage.style.transform = 'translateY(-70%)';
    } else if (currentStep === 'complete') {
      // Final page: animate down but not fully - show about 50% of dome
      domeImage.style.transform = 'translateY(-20%)';
    }
  }, [currentStep]);

  const handleProceed = useCallback(() => {
    console.log('handleProceed called', { currentStep, name, email, isEmailValid });
    if (currentStep === 'name-input' && name.length >= 1) {
      console.log('Moving to email-input');
      setCurrentStep('email-input');
    } else if (currentStep === 'email-input' && isEmailValid) {
      console.log('Moving to loading');
      setCurrentStep('loading');
    } else {
      console.log('Condition not met', { currentStep, nameLength: name.length, isEmailValid });
    }
  }, [currentStep, name, email, isEmailValid]);

  // Simulate server wait on loading screen
  useEffect(() => {
    if (currentStep === 'loading') {
      // TODO: Replace with actual API call
      const timer = setTimeout(() => {
        setCurrentStep('complete');
      }, 2000); // 2 second loading simulation

      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Calculate step visibility - memoized to avoid recreating style objects
  const getStepStyle = useCallback((step: Step): React.CSSProperties => {
    const isActive = currentStep === step;
    const isPast = STEP_ORDER.indexOf(currentStep) > STEP_ORDER.indexOf(step);

    return {
      position: 'absolute',
      width: '100%',
      maxWidth: '600px',
      opacity: isActive ? 1 : 0,
      transform: isActive ? 'translateY(0)' : isPast ? 'translateY(-50px)' : 'translateY(50px)',
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
      pointerEvents: isActive ? 'auto' : 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    };
  }, [currentStep]);

  // Position content just below dome (72px) and menu (46px + 30px icon)
  // Move up when keyboard is open to keep everything visible
  const basePadding = 150; // 72px dome + some spacing for content
  const topPadding = isKeyboardOpen ? 100 : basePadding; // Move closer to top when keyboard opens

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: `${viewportHeight}px`,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: `${topPadding}px`,
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
      paddingBottom: '1.5rem',
      boxSizing: 'border-box',
      transition: 'height 0.3s ease-out, padding-top 0.3s ease-out',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '600px',
      }}>

        {/* Step 1: Breathing */}
        <div style={getStepStyle('breathing')}>
          <h1 className="page-title">
            think of a name
          </h1>
          <p className="page-subtitle">
            a being you want to honor, cherish, celebrate.
          </p>

          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '2px solid var(--color-ot-light)',
            margin: 'clamp(16px, 5vh, 72px) 0',
            transform: `scale(${breathingScale})`,
            transition: 'transform 0.1s ease-out',
            boxShadow: '0 0 40px rgba(255, 255, 255, 0.3)',
          }}></div>

          <p style={{
            fontSize: 'var(--text-body-std)',
            lineHeight: 'var(--text-body-std-lh)',
            opacity: 0.8,
            margin: '2rem 0 0 0',
          }}>
          </p>
        </div>

        {/* Step 2: Name Input */}
        <div style={getStepStyle('name-input')}>
          <h1 className="page-title">
            now, type that name
          </h1>
          <p className="page-subtitle">
            it will rise to the Orbital Temple in space.
          </p>

          <input
            ref={nameInputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => {
              window.scrollTo(0, 0);
              document.body.scrollTop = 0;
            }}
            placeholder=""
            className={`input-field ${name.length > 0 ? 'input-field--no-border' : ''}`}
            style={{ fontSize: `${nameFontSize}px`, transition: 'font-size 0.2s ease' }}
          />

          {name.length >= 1 && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                console.log('Button mousedown');
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                console.log('Button touchstart');
                // Blur input to close keyboard
                if (nameInputRef.current) {
                  nameInputRef.current.blur();
                }
                setTimeout(() => handleProceed(), 100);
              }}
              onClick={(e) => {
                e.preventDefault();
                console.log('Button click');
                // Fallback for desktop
                if (nameInputRef.current) {
                  nameInputRef.current.blur();
                }
                setTimeout(() => handleProceed(), 100);
              }}
              className="btn-action"
            >
              let it ascend
              <img src="/arrow.svg" alt="arrow" />
            </button>
          )}
        </div>

        {/* Step 3: Email Input */}
        <div style={getStepStyle('email-input')}>
          <h1 className="page-title">
            type your email
          </h1>
          <p className="page-subtitle">
            so you get a message when the name ascends.
          </p>

          <input
            ref={emailInputRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => {
              window.scrollTo(0, 0);
              document.body.scrollTop = 0;
            }}
            placeholder=""
            className={`input-field ${email.length > 0 ? 'input-field--no-border' : ''}`}
            style={{ fontSize: `${emailFontSize}px`, transition: 'font-size 0.2s ease' }}
          />

          {isEmailValid && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                console.log('Email button mousedown');
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                console.log('Email button touchstart');
                // Blur input to close keyboard
                if (emailInputRef.current) {
                  emailInputRef.current.blur();
                }
                setTimeout(() => handleProceed(), 100);
              }}
              onClick={(e) => {
                e.preventDefault();
                console.log('Email button click');
                // Fallback for desktop
                if (emailInputRef.current) {
                  emailInputRef.current.blur();
                }
                setTimeout(() => handleProceed(), 100);
              }}
              className="btn-action"
            >
              it is done
              <img src="/arrow.svg" alt="arrow" />
            </button>
          )}
        </div>

        {/* Step 4: Loading */}
        <div style={getStepStyle('loading')}>
          <h1 className="page-title">
            sending to the temple...
          </h1>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: 'var(--color-ot-light)',
            margin: '3rem 0',
            animation: 'spin 1s linear infinite',
          }}></div>
        </div>

        {/* Step 5: Complete */}
        <div style={getStepStyle('complete')}>
          <div style={{
            margin: '2rem 0 3rem 0',
            position: 'relative',
            width: '200px',
            height: '200px',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid var(--color-ot-gold300)',
              background: 'transparent',
              position: 'absolute',
              animation: 'pulse 2s ease-in-out infinite',
            }}></div>
            <div style={{
              width: '60%',
              height: '60%',
              borderRadius: '50%',
              border: '1px solid var(--color-ot-gold400)',
              background: 'var(--color-ot-dark)',
              position: 'absolute',
              top: '20%',
              left: '20%',
            }}></div>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              background: 'var(--color-ot-gold300)',
            }}></div>
          </div>

          <h1 className="success-title">
            The name {name}<br />
            is now queued for ascension.<br />
            When the temple aligns, you'll<br />
            receive a message.
          </h1>
        </div>

      </div>

      {/* Starfield background */}
      <Starfield baseSpeed={10} starCount={67} speedBoost={speedBoost} />
    </div>
  );
}
