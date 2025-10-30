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
  const [showBreathingText, setShowBreathingText] = useState(false);
  const [showBreathingButton, setShowBreathingButton] = useState(false);
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

  // Breathing animation - DISABLED
  // useEffect(() => {
  //   if (currentStep === 'breathing') {
  //     const breathingCycle = 2000;
  //     const startTime = Date.now();

  //     const animate = () => {
  //       const elapsed = Date.now() - startTime;
  //       const progress = (elapsed % breathingCycle) / breathingCycle;
  //       const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.15;
  //       setBreathingScale(scale);
  //       requestAnimationFrame(animate);
  //     };

  //     const animationId = requestAnimationFrame(animate);

  //     return () => {
  //       cancelAnimationFrame(animationId);
  //     };
  //   }
  // }, [currentStep]);

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
  }, [email]);

  // Animate dome down through journey stages - DISABLED
  useEffect(() => {
    const domeImage = document.getElementById('dome-image');
    if (!domeImage) return;

    // No animation, instant positioning
    domeImage.style.transition = 'none';

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

  // Calculate step visibility - memoized to avoid recreating style objects
  // NO ANIMATIONS
  const getStepStyle = useCallback((step: Step): React.CSSProperties => {
    const isActive = currentStep === step;
    const isPast = STEP_ORDER.indexOf(currentStep) > STEP_ORDER.indexOf(step);

    return {
      position: 'absolute',
      width: '100%',
      maxWidth: '600px',
      left: '50%',
      transform: 'translateX(-50%)',
      opacity: isActive ? 1 : 0,
      transition: 'none',
      pointerEvents: isActive ? 'auto' : 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    };
  }, [currentStep]);

  // Position content just below dome (72px) and menu (46px + 30px icon)
  // Move up when keyboard is open to keep everything visible
  // On desktop, center vertically
  const basePadding = 150; // 72px dome + some spacing for content
  const topPadding = isKeyboardOpen ? 100 : (isDesktop ? 0 : basePadding); // Move closer to top when keyboard opens, center on desktop

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: `${viewportHeight}px`,
      display: 'flex',
      alignItems: isDesktop && !isKeyboardOpen ? 'center' : 'flex-start',
      justifyContent: 'center',
      paddingTop: isDesktop && !isKeyboardOpen ? '0' : `${topPadding}px`,
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
      paddingBottom: '1.5rem',
      boxSizing: 'border-box',
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

          </h1>
          <p className="page-subtitle" style={{
            opacity: showBreathingText ? 1 : 0,
          }}>
            as you enter<br />
            a ritual <br /><br />
            to send a name<br />
            into the<br />
            orbital temple<br />
            in space <br /><br />
            take <br />
            a breath
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
              alignSelf: 'flex-end',
              marginLeft: 'auto',
              marginRight: 0,
            }}
          >
            I'm ready
            <img src="/arrow.svg" alt="arrow" />
          </button>
        </div>

        {/* Step 2: Name Input */}
        <div style={getStepStyle('name-input')}>
          <h1 className="page-title">
            type a name
          </h1>
          <p className="page-subtitle">
            it will rise to the Orbital Temple in space.
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
            placeholder="name"
            className={`input-field ${name.length > 0 ? 'input-field--no-border' : ''}`}
            style={{ fontSize: `${nameFontSize}px` }}
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
              style={{ alignSelf: 'flex-end', marginLeft: 'auto', marginRight: 0 }}
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
            placeholder="email"
            className={`input-field ${email.length > 0 ? 'input-field--no-border' : ''}`}
            style={{ fontSize: `${emailFontSize}px` }}
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
              style={{ alignSelf: 'flex-end', marginLeft: 'auto', marginRight: 0 }}
            >
              it is done
              <img src="/arrow.svg" alt="arrow" />
            </button>
          )}
        </div>

        {/* Step 4: Loading */}
        <div style={getStepStyle('loading')}>
          <img
            src="/loader.svg"
            alt="Loading"
            style={{
              width: '60px',
              height: '60px',
              marginTop: '3rem',
            }}
          />
        </div>

        {/* Step 5: Complete */}
        <div style={getStepStyle('complete')}>

          <p className="page-subtitle" style={{
            marginTop: isDesktop ? '1rem' : '4rem',
          }}>
            The name<br />
            {name}<br />
            is now queued<br />
            for ascension.<br />
            <br />
            When the<br />
            temple in space<br />
            aligns, with<br />
            our antenna<br />
            on Earth<br />
            <br />
            we will send<br />
            the name<br />
            and you'll receive<br />
            a message.
          </p>
        </div>

      </div>

      {/* Starfield background */}
      <Starfield baseSpeed={10} starCount={67} speedBoost={speedBoost} />
    </div>
  );
}
