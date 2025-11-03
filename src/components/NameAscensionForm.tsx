import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Starfield from './Starfield';

type Step = 'breathing' | 'name-input' | 'email-input' | 'loading' | 'complete';

// Email validation regex - created once, not per render
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Step order for transition calculations
const STEP_ORDER: Step[] = ['breathing', 'name-input', 'email-input', 'loading', 'complete'];

export default function SendNameForm() {
  const { t, ready } = useTranslation('send-a-name');

  // Helper function to convert \n to <br/> tags
  const renderTextWithBreaks = (text: string) => {
    return text.split('\n').map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

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
  const [showBreathingText, setShowBreathingText] = useState(false);
  const [showBreathingButton, setShowBreathingButton] = useState(false);
  const [showCompleteText, setShowCompleteText] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Email validation function - memoized
  const validateEmail = useCallback((email: string): boolean => {
    return EMAIL_REGEX.test(email);
  }, []);

  // Track viewport height changes and desktop state
  useEffect(() => {
    const updateViewportHeight = () => {
      const newHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      setViewportHeight(newHeight);
      setIsDesktop(window.innerWidth >= 768);
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

  // Staggered entry animation for breathing page - DISABLED
  useEffect(() => {
    if (currentStep === 'breathing') {
      // Show immediately without delay
      setShowBreathingText(true);
      setShowBreathingButton(true);
    } else {
      // Reset when leaving breathing step
      setShowBreathingText(false);
      setShowBreathingButton(false);
    }
  }, [currentStep]);

  // Delayed text appearance for complete page
  useEffect(() => {
    if (currentStep === 'complete') {
      // Show text after dome animation completes (1s dome + 0.4s wait)
      const timer = setTimeout(() => {
        setShowCompleteText(true);
      }, 1400);

      return () => clearTimeout(timer);
    } else {
      // Reset when leaving complete step
      setShowCompleteText(false);
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
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      if (e.target instanceof HTMLElement && isKeyboardInput(e.target)) {
        setIsKeyboardOpen(false);
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  // Dynamic font sizing for name input - improved to prevent text cutting
  useEffect(() => {
    if (nameInputRef.current) {
      const containerWidth = nameInputRef.current.offsetWidth - 32; // Account for padding
      const textWidth = nameInputRef.current.scrollWidth;

      if (textWidth > containerWidth && name.length > 0) {
        // Calculate new font size to fit text with extra margin
        const ratio = (containerWidth * 0.95) / textWidth; // Use 95% to ensure no cutting
        const newSize = Math.max(14, Math.min(30, 30 * ratio));
        setNameFontSize(newSize);
      } else {
        setNameFontSize(30);
      }
    }
  }, [name]);

  // Dynamic font sizing for email input - improved to prevent text cutting
  useEffect(() => {
    if (emailInputRef.current) {
      const containerWidth = emailInputRef.current.offsetWidth - 32; // Account for padding
      const textWidth = emailInputRef.current.scrollWidth;

      if (textWidth > containerWidth && email.length > 0) {
        // Calculate new font size to fit text with extra margin
        const ratio = (containerWidth * 0.95) / textWidth; // Use 95% to ensure no cutting
        const newSize = Math.max(14, Math.min(30, 30 * ratio));
        setEmailFontSize(newSize);
      } else {
        setEmailFontSize(30);
      }
    }
  }, [email]);

  // Validate email whenever it changes
  useEffect(() => {
    setIsEmailValid(validateEmail(email));
  }, [email, validateEmail]);

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

  // Submit name to Firebase when loading screen appears
  useEffect(() => {
    if (currentStep === 'loading') {
      submitNameToServer();
    }
  }, [currentStep]);

  const submitNameToServer = async () => {
    try {
      const FUNCTIONS_URL = 'https://us-central1-orbital-temple.cloudfunctions.net';

      const response = await fetch(`${FUNCTIONS_URL}/submitName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit name');
      }

      const data = await response.json();
      console.log('Name submitted successfully:', data);

      // Wait a bit before showing completion
      setTimeout(() => {
        setCurrentStep('complete');
      }, 1000);
    } catch (error) {
      console.error('Error submitting name:', error);

      // Still show complete screen but log error
      setTimeout(() => {
        setCurrentStep('complete');
      }, 1000);
    }
  };

  // Calculate step visibility with fade transitions
  const getStepStyle = useCallback((step: Step): React.CSSProperties => {
    const isActive = currentStep === step;

    return {
      position: 'absolute',
      width: '100%',
      maxWidth: '600px',
      left: '50%',
      transform: 'translateX(-50%)',
      opacity: isActive ? 1 : 0,
      transition: 'opacity 0.4s ease-in-out',
      pointerEvents: isActive ? 'auto' : 'none',
      display: isActive ? 'flex' : 'none',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      visibility: isActive ? 'visible' : 'hidden',
    };
  }, [currentStep]);

  // Position content just below dome (72px) and menu (46px + 30px icon)
  // Move up when keyboard is open to keep everything visible (MOBILE ONLY)
  // On desktop, center vertically
  const basePadding = 150; // 72px dome + some spacing for content
  const topPadding = (isKeyboardOpen && !isDesktop) ? 100 : (isDesktop ? 0 : basePadding); // Move closer to top when keyboard opens on MOBILE only, center on desktop

  // Don't render until translations are loaded to prevent flash of untranslated content
  if (!ready) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
      }}>
        <Starfield />
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: `${viewportHeight}px`,
        display: 'flex',
        alignItems: isDesktop ? 'center' : 'flex-start',
        justifyContent: 'center',
        paddingTop: isDesktop ? '0' : `${topPadding}px`,
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        paddingBottom: '1.5rem',
        boxSizing: 'border-box',
        overflow: 'hidden',
        cursor: (currentStep === 'complete' && !isDesktop) ? 'pointer' : 'auto',
      }}
      onClick={() => {
        // On mobile, clicking anywhere on complete screen opens the menu
        if (currentStep === 'complete' && !isDesktop) {
          const menuButton = document.getElementById('btn-menu');
          menuButton?.click();
        }
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '600px',
        minHeight: isDesktop ? '400px' : 'auto',
      }}>

        {/* Step 1: Breathing */}
        <div style={getStepStyle('breathing')}>
          <h1 className="page-title">

          </h1>
          <p className="page-subtitle" style={{
            opacity: showBreathingText ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
            transitionDelay: '0.1s',
          }}>
            {renderTextWithBreaks(t('breathing.text'))}
          </p>

          <p className="page-subtitle" style={{
            margin: 'clamp(16px, 5vh, 72px) 0 2rem 0',
          }}>

          </p>

          <button
            onClick={() => {
              setCurrentStep('name-input');
              setSpeedBoost(prev => prev + 1);
            }}
            className="btn-action"
            style={{
              opacity: showBreathingButton ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out',
              transitionDelay: '0.3s',
              alignSelf: 'flex-end',
              marginLeft: 'auto',
              marginRight: 0,
            }}
          >
            {t('breathing.button')}
            <img src="/UI/arrow.svg" alt="arrow" />
          </button>
        </div>

        {/* Step 2: Name Input */}
        <div style={getStepStyle('name-input')}>
          <h1 className="page-title" style={{
            opacity: currentStep === 'name-input' ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
            transitionDelay: '0.1s',
            marginBottom: !isDesktop ? '16px' : undefined,
          }}>
            {t('nameInput.title')}
          </h1>
          <p className="page-subtitle" style={{
            opacity: currentStep === 'name-input' ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
            transitionDelay: '0.2s',
            marginBottom: !isDesktop ? '24px' : undefined,
          }}>
            {t('nameInput.subtitle')}
          </p>

          <input
            ref={nameInputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && name.length >= 1) {
                e.preventDefault();
                if (nameInputRef.current) {
                  nameInputRef.current.blur();
                }
                setTimeout(() => handleProceed(), 100);
              }
            }}
            onFocus={() => {
              window.scrollTo(0, 0);
              document.body.scrollTop = 0;
            }}
            placeholder="test123"
            className={`input-field ${name.length > 0 ? 'input-field--no-border' : ''}`}
            style={{
              fontSize: `${nameFontSize}px`,
              opacity: currentStep === 'name-input' ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out',
              transitionDelay: '0.3s',
              marginBottom: !isDesktop ? '24px' : undefined,
            }}
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
                handleProceed();
                setTimeout(() => {
                  if (nameInputRef.current) {
                    nameInputRef.current.blur();
                  }
                }, 0);
              }}
              onClick={(e) => {
                e.preventDefault();
                console.log('Button click');
                handleProceed();
                setTimeout(() => {
                  if (nameInputRef.current) {
                    nameInputRef.current.blur();
                  }
                }, 0);
              }}
              className="btn-action"
              style={{
                alignSelf: 'flex-end',
                marginLeft: 'auto',
                marginRight: 0,
                opacity: currentStep === 'name-input' ? 1 : 0,
                transition: 'opacity 0.6s ease-in-out',
                transitionDelay: '0.4s',
              }}
            >
              {t('nameInput.button')}
              <img src="/UI/arrow.svg" alt="arrow" />
            </button>
          )}
        </div>

        {/* Step 3: Email Input */}
        <div style={getStepStyle('email-input')}>
          <h1 className="page-title" style={{
            opacity: currentStep === 'email-input' ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
            transitionDelay: '0.1s',
            marginBottom: !isDesktop ? '16px' : undefined,
          }}>
            {t('emailInput.title')}
          </h1>
          <p className="page-subtitle" style={{
            opacity: currentStep === 'email-input' ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
            transitionDelay: '0.2s',
            marginBottom: !isDesktop ? '24px' : undefined,
          }}>
            {t('emailInput.subtitle')}
          </p>

          <input
            ref={emailInputRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isEmailValid) {
                e.preventDefault();
                if (emailInputRef.current) {
                  emailInputRef.current.blur();
                }
                setTimeout(() => handleProceed(), 100);
              }
            }}
            onFocus={() => {
              window.scrollTo(0, 0);
              document.body.scrollTop = 0;
            }}
            placeholder={t('emailInput.placeholder')}
            className={`input-field ${email.length > 0 ? 'input-field--no-border' : ''}`}
            style={{
              fontSize: `${emailFontSize}px`,
              opacity: currentStep === 'email-input' ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out',
              transitionDelay: '0.3s',
              marginBottom: !isDesktop ? '24px' : undefined,
            }}
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
                handleProceed();
                setTimeout(() => {
                  if (emailInputRef.current) {
                    emailInputRef.current.blur();
                  }
                }, 0);
              }}
              onClick={(e) => {
                e.preventDefault();
                console.log('Email button click');
                handleProceed();
                setTimeout(() => {
                  if (emailInputRef.current) {
                    emailInputRef.current.blur();
                  }
                }, 0);
              }}
              className="btn-action"
              style={{
                alignSelf: 'flex-end',
                marginLeft: 'auto',
                marginRight: 0,
                opacity: currentStep === 'email-input' ? 1 : 0,
                transition: 'opacity 0.6s ease-in-out',
                transitionDelay: '0.4s',
              }}
            >
              {t('emailInput.button')}
              <img src="/UI/arrow.svg" alt="arrow" />
            </button>
          )}
        </div>

        {/* Step 4: Loading */}
        <div style={getStepStyle('loading')}>
          <img
            src="/UI/loader.svg"
            alt={t('loading.alt')}
            style={{
              width: '60px',
              height: '60px',
              marginTop: '3rem',
              animation: 'spin 1s linear infinite',
              opacity: currentStep === 'loading' ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out',
              transitionDelay: '0.1s',
            }}
          />
        </div>

        {/* Step 5: Complete */}
        <div
          style={{
            ...getStepStyle('complete'),
            top: isDesktop ? '50%' : 'auto',
            transform: isDesktop ? 'translate(-50%, -50%)' : 'translateX(-50%)',
            cursor: !isDesktop ? 'pointer' : 'auto',
          }}
          onClick={() => {
            // On mobile, clicking anywhere opens the menu
            if (!isDesktop) {
              const menuButton = document.getElementById('btn-menu');
              menuButton?.click();
            }
          }}
        >

          <p className="page-subtitle" style={{
            marginTop: isDesktop ? '0' : '4rem',
            opacity: showCompleteText ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
          }}>
            {renderTextWithBreaks(t('success.text', { name }))}
          </p>
        </div>

      </div>

      {/* Starfield background */}
      <Starfield baseSpeed={10} starCount={67} speedBoost={speedBoost} />
    </div>
  );
}
