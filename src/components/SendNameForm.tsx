import { useState, useEffect, useRef } from 'react';

type Step = 'breathing' | 'ready' | 'name-input' | 'email-input' | 'complete';

export default function SendNameForm() {
  const [step, setStep] = useState<Step>('breathing');
  const [prevStep, setPrevStep] = useState<Step | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [breathingScale, setBreathingScale] = useState(1);
  const [showNameButton, setShowNameButton] = useState(false);
  const [showEmailButton, setShowEmailButton] = useState(false);
  const [nameInputMovedUp, setNameInputMovedUp] = useState(false);
  const [emailInputMovedUp, setEmailInputMovedUp] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Track viewport height changes (for mobile keyboard)
  useEffect(() => {
    const updateViewportHeight = () => {
      // Use visualViewport if available (better for mobile keyboards)
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      } else {
        setViewportHeight(window.innerHeight);
      }
    };

    updateViewportHeight();

    // Listen to both resize and visualViewport events
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

  // Breathing animation with 10-second timer
  useEffect(() => {
    if (step === 'breathing') {
      const breathingCycle = 4000; // 4 seconds per breath
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed % breathingCycle) / breathingCycle;
        // Ease in and out - creates breathing effect
        const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.15;
        setBreathingScale(scale);
        requestAnimationFrame(animate);
      };

      const animationId = requestAnimationFrame(animate);

      // Auto-advance to ready state after 10 seconds
      const timer = setTimeout(() => {
        setStep('ready');
      }, 10000);

      return () => {
        cancelAnimationFrame(animationId);
        clearTimeout(timer);
      };
    }
  }, [step]);

  // Watch name input for 3+ characters
  useEffect(() => {
    if (step === 'name-input' && name.length >= 3 && !nameInputMovedUp) {
      setNameInputMovedUp(true);
      setTimeout(() => setShowNameButton(true), 300);
    }
  }, [name, step, nameInputMovedUp]);

  // Watch email input for typing start
  useEffect(() => {
    if (step === 'email-input' && email.length >= 3 && !emailInputMovedUp) {
      setEmailInputMovedUp(true);
      setTimeout(() => setShowEmailButton(true), 300);
    }
  }, [email, step, emailInputMovedUp]);

  // Auto-focus email input when entering email step
  useEffect(() => {
    if (step === 'email-input' && emailInputRef.current) {
      // Delay focus slightly to ensure smooth transition
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  // Auto-focus name input when entering name step
  useEffect(() => {
    if (step === 'name-input' && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  // Helper function to transition between steps
  const transitionToStep = (newStep: Step) => {
    setIsTransitioning(true);
    setPrevStep(step);

    setTimeout(() => {
      setStep(newStep);
      setIsTransitioning(false);
    }, 300); // Match CSS transition duration
  };

  const handleProceedFromReady = () => {
    transitionToStep('name-input');
  };

  const handleNameSubmit = () => {
    if (name.trim() && name.length >= 3) {
      transitionToStep('email-input');
    }
  };

  const handleEmailSubmit = () => {
    if (email.trim() && email.length >= 3) {
      transitionToStep('complete');
      // Here you would send the data to your backend
    }
  };

  // Common styles
  const containerStyle: React.CSSProperties = {
    textAlign: 'center',
    maxWidth: '600px',
    width: '100%',
  };

  const transitionWrapperStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: `${viewportHeight}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    boxSizing: 'border-box',
  };

  const stepContainerStyle: React.CSSProperties = {
    opacity: isTransitioning ? 0 : 1,
    transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
    transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
    width: '100%',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: 'var(--text-display-lg)',
    lineHeight: 'var(--text-display-lg-lh)',
    fontWeight: 900,
    margin: '0 0 1rem 0',
    color: 'var(--color-ot-light)',
  };

  const subheadingStyle: React.CSSProperties = {
    fontSize: 'var(--text-body-std)',
    lineHeight: 'var(--text-body-std-lh)',
    fontWeight: 400,
    opacity: 0.8,
    margin: '0 0 3rem 0',
  };

  const inputStyle: React.CSSProperties = {
    fontSize: 'var(--text-display-lg)',
    lineHeight: 'var(--text-display-lg-lh)',
    fontWeight: 400,
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'var(--color-ot-light)',
    textAlign: 'center',
    outline: 'none',
    padding: '1rem',
    width: '100%',
    maxWidth: '400px',
    fontFamily: 'var(--font-sans)',
  };

  const buttonStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '2px solid var(--color-ot-gold300)',
    background: 'var(--color-ot-gold100)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    position: 'relative',
    boxShadow: '0 0 30px rgba(199, 158, 44, 0.5)',
  };

  const breathingCircleStyle: React.CSSProperties = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '2px solid var(--color-ot-light)',
    background: 'transparent',
    transform: `scale(${breathingScale})`,
    transition: 'transform 0.1s ease-out',
    boxShadow: '0 0 40px rgba(255, 255, 255, 0.3)',
  };

  // Step 1: Breathing meditation
  if (step === 'breathing') {
    return (
      <div style={transitionWrapperStyle}>
        <div style={{ ...containerStyle, ...stepContainerStyle }}>
          <h1 style={headingStyle}>think of a name</h1>
          <p style={subheadingStyle}>a being you want to honor, cherish, celebrate.</p>

          <div style={{ margin: '4rem 0' }}>
            <div style={breathingCircleStyle}></div>
          </div>

          <p style={{ ...subheadingStyle, margin: '4rem 0 0 0' }}>breath, I invite you,</p>

          {/* Audio icon */}
          <button style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            opacity: 0.7,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-ot-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Ready to proceed
  if (step === 'ready') {
    return (
      <div style={transitionWrapperStyle}>
        <div style={{ ...containerStyle, ...stepContainerStyle }}>
        <h1 style={headingStyle}>think of a name</h1>
        <p style={subheadingStyle}>a being you want to honor, cherish, celebrate.</p>

        <div style={{ margin: '4rem 0', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.3)',
            zIndex: 0
          }}></div>
          <button
            onClick={handleProceedFromReady}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(199, 158, 44, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(199, 158, 44, 0.5)';
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-ot-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

          <p style={{ ...subheadingStyle, margin: '4rem 0 0 0' }}>you are invited to dance.</p>

          {/* Audio icon */}
          <button style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            opacity: 0.7,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-ot-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Name input with move-up animation
  if (step === 'name-input') {
    return (
      <div style={transitionWrapperStyle}>
        <div style={{
          ...containerStyle,
          ...stepContainerStyle,
          transition: 'transform 0.5s ease-out, opacity 0.3s ease-out',
          transform: nameInputMovedUp ? 'translateY(-20%)' : 'translateY(0)',
        }}>
          {!nameInputMovedUp && (
            <>
              <h1 style={{
                ...headingStyle,
                opacity: nameInputMovedUp ? 0 : 1,
                transition: 'opacity 0.3s ease-out',
              }}>
                now, type that name
              </h1>
              <p style={{
                ...subheadingStyle,
                opacity: nameInputMovedUp ? 0 : 1,
                transition: 'opacity 0.3s ease-out',
              }}>
                it will rise to the Orbital Temple in space.
              </p>
            </>
          )}

          <div style={{
            margin: nameInputMovedUp ? '0 0 2rem 0' : '4rem 0',
            transition: 'margin 0.5s ease-out',
          }}>
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              style={inputStyle}
            />

          {nameInputMovedUp && (
            <p style={{
              fontSize: 'var(--text-body-sm)',
              lineHeight: 'var(--text-body-sm-lh)',
              fontWeight: 400,
              opacity: 0.7,
              margin: '1rem 0 0 0',
              animation: 'fadeIn 0.3s ease-in',
            }}>
              will rise to the Orbital Temple in space.
            </p>
          )}
        </div>

        {showNameButton && (
          <div style={{
            margin: '3rem 0',
            position: 'relative',
            animation: 'fadeIn 0.3s ease-in',
          }}>
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '2px',
              background: 'rgba(255, 255, 255, 0.3)',
              zIndex: 0
            }}></div>
            <button
              onClick={handleNameSubmit}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(199, 158, 44, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(199, 158, 44, 0.5)';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-ot-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}
        </div>
      </div>
    );
  }

  // Step 4: Email input with move-up animation
  if (step === 'email-input') {
    return (
      <div style={transitionWrapperStyle}>
        <div style={{
          ...containerStyle,
          ...stepContainerStyle,
          transition: 'transform 0.5s ease-out, opacity 0.3s ease-out',
          transform: emailInputMovedUp ? 'translateY(-20%)' : 'translateY(0)',
        }}>
        {!emailInputMovedUp && (
          <>
            <h1 style={{
              ...headingStyle,
              opacity: emailInputMovedUp ? 0 : 1,
              transition: 'opacity 0.3s ease-out',
            }}>
              type your email
            </h1>
            <p style={{
              ...subheadingStyle,
              opacity: emailInputMovedUp ? 0 : 1,
              transition: 'opacity 0.3s ease-out',
            }}>
              so you get a message when the name ascends.
            </p>
          </>
        )}

          <div style={{
            margin: emailInputMovedUp ? '0 0 2rem 0' : '4rem 0',
            transition: 'margin 0.5s ease-out',
          }}>
            <input
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              style={inputStyle}
            />

          {emailInputMovedUp && (
            <p style={{
              fontSize: 'var(--text-body-sm)',
              lineHeight: 'var(--text-body-sm-lh)',
              fontWeight: 400,
              opacity: 0.7,
              margin: '1rem 0 0 0',
              animation: 'fadeIn 0.3s ease-in',
            }}>
              will get a message when the name ascends.
            </p>
          )}
        </div>

        {showEmailButton && (
          <div style={{
            margin: '3rem 0',
            position: 'relative',
            animation: 'fadeIn 0.3s ease-in',
          }}>
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '2px',
              background: 'rgba(255, 255, 255, 0.3)',
              zIndex: 0
            }}></div>
            <button
              onClick={handleEmailSubmit}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(199, 158, 44, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(199, 158, 44, 0.5)';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-ot-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}
        </div>
      </div>
    );
  }

  // Step 5: Complete with dome animation
  if (step === 'complete') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        boxSizing: 'border-box',
      }}>
        {/* Dome background with animation */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '60vh',
          overflow: 'hidden',
          zIndex: 0,
          animation: 'domeSlideDown 1s ease-out',
        }}>
          <img
            src="/dome.png"
            alt="Dome"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>

        <div style={{
          ...containerStyle,
          ...stepContainerStyle,
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>

        {/* Orbital circle visualization */}
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

        <h1 style={{
          fontSize: 'var(--text-body-lg)',
          lineHeight: '1.2',
          fontWeight: 700,
          margin: '0 0 2rem 0',
          color: 'var(--color-ot-light)',
          textAlign: 'center',
        }}>
          The name {name}<br />
          is now queued for ascension.<br />
          When the temple aligns, you'll<br />
          receive a message.
        </h1>

        <div style={{ margin: '2rem 0 0 0' }}>
          <p style={{
            fontSize: 'var(--text-body-sm)',
            lineHeight: 'var(--text-body-sm-lh)',
            opacity: 0.7,
            textAlign: 'center',
          }}>
            serving the same impulse as our ancestors,
          </p>
        </div>

        {/* Audio icon */}
        <button style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          opacity: 0.7,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-ot-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </button>
        </div>
      </div>
    );
  }

  return null;
}
