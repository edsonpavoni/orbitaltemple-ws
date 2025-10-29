import type { RitualButtonProps } from './ritual-button-types';

interface RitualButtonV6Props extends RitualButtonProps {
  orbitTiltX?: number; // Initial tilt on X-axis (default 0)
  orbitTiltY?: number; // Initial tilt on Y-axis (default 0)
  orbitRotationAxis?: 'x' | 'y' | 'z'; // Which axis to rotate around (default 'x')
  smoothVelocity?: boolean; // Smooth velocity transition on hover (default false)
  hoverToFlat?: boolean; // On hover, speed up 4x, complete 360° rotation, then stop at flat position (default false)
  hoverReverseToFlat?: boolean; // On hover, immediately reverse to flat position with ease-out (default false)
  hoverReverseFull360ToFlat?: boolean; // On hover, reverse 360° + whatever needed to reach flat, with ease-out (default false)
  hoverSlowToFlat?: boolean; // On hover, slowly move directly to flat position (default false)
}

const DEFAULT_PROPS = {
  label: 'ritual',
  size: 170,
  ringRx: 85,
  ringRy: 55,
  ringAzimuthDeg: 18,
  strokeColor: '#D4AF37', // Gold
  strokeWidth: 2.5,
  diskColor: '#FFF7E6', // gold100
  textColor: '#3C2A00',
  rotationSec: 12.5,
  hoverRotationSec: 5,
  easing: 'linear' as const,
  wobble: false,
  wobbleSec: 6,
  shadow: true,
  orbitTiltX: 0,
  orbitTiltY: 0,
  orbitRotationAxis: 'x' as 'x' | 'y' | 'z',
  smoothVelocity: false,
  hoverToFlat: false,
  hoverReverseToFlat: false,
  hoverReverseFull360ToFlat: false,
  hoverSlowToFlat: false,
};

export class RitualButtonV6 {
  private container: HTMLDivElement;
  private main: HTMLDivElement;
  private button: HTMLButtonElement;
  private orbitElement: HTMLSpanElement | null = null;
  private orbitAnimation: Animation | null = null;
  private velocityTransition: number | null = null;

  private props: typeof DEFAULT_PROPS & {
    onClick?: (ev: MouseEvent) => void;
    className?: string;
    ariaLabel?: string;
  };

  private boundHandlers = {
    mouseenter: () => this.handleHover(true),
    mouseleave: () => this.handleHover(false),
    click: (ev: MouseEvent) => this.handleClick(ev),
    keydown: (ev: KeyboardEvent) => this.handleKeydown(ev),
  };

  constructor(props: RitualButtonV6Props = {}) {
    this.props = { ...DEFAULT_PROPS, ...props } as any;

    // Create container
    this.container = this.createContainer();

    // Create main sphere structure
    this.main = this.createMainStructure();

    // Create button overlay
    this.button = this.createButton();

    // Assemble
    this.container.appendChild(this.main);
    this.container.appendChild(this.button);

    // Add event listeners
    this.attachEventListeners();

    // Initialize smooth velocity or hover animations if needed
    if ((this.props.smoothVelocity || this.props.hoverToFlat || this.props.hoverReverseToFlat || this.props.hoverReverseFull360ToFlat || this.props.hoverSlowToFlat) && this.orbitElement) {
      this.initializeSmoothVelocityAnimation();
    }
  }

  private createContainer(): HTMLDivElement {
    const div = document.createElement('div');
    const classes = ['ritual-wrap-v6'];

    if (this.props.smoothVelocity) {
      classes.push('smooth-velocity');
    }

    if (this.props.hoverToFlat) {
      classes.push('hover-to-flat');
    }

    if (this.props.hoverReverseToFlat) {
      classes.push('hover-reverse-to-flat');
    }

    if (this.props.hoverReverseFull360ToFlat) {
      classes.push('hover-reverse-full-360-to-flat');
    }

    if (this.props.hoverSlowToFlat) {
      classes.push('hover-slow-to-flat');
    }

    if (this.props.className) {
      classes.push(this.props.className);
    }

    div.className = classes.join(' ');
    div.style.setProperty('--size', `${this.props.size}px`);
    div.style.setProperty('--rotation-sec', `${this.props.rotationSec}s`);
    div.style.setProperty('--hover-rotation-sec', `${this.props.hoverRotationSec}s`);
    div.style.setProperty('--gold-color', this.props.strokeColor);
    div.style.setProperty('--orbit-tilt-x', `${this.props.orbitTiltX}deg`);
    div.style.setProperty('--orbit-tilt-y', `${this.props.orbitTiltY}deg`);
    div.style.setProperty('--orbit-axis', this.props.orbitRotationAxis);
    return div;
  }

  private createMainStructure(): HTMLDivElement {
    const main = document.createElement('div');
    main.className = 'ritual-main-v6';

    // Create main circle (only the o circle)
    const circleO = document.createElement('div');
    circleO.className = 'ritual-circle-v6 ritual-circle-o-v6';
    main.appendChild(circleO);

    // Create center with single orbit
    const center = document.createElement('div');
    center.className = 'ritual-center-v6';

    const orbit1 = document.createElement('span');
    orbit1.className = 'ritual-orbit-v6';
    this.orbitElement = orbit1;
    center.appendChild(orbit1);

    const label = document.createElement('span');
    label.className = 'ritual-label-v6';
    label.textContent = this.props.label;
    center.appendChild(label);

    main.appendChild(center);

    return main;
  }

  private createButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'ritual-btn-v6';
    button.type = 'button';
    button.setAttribute('aria-label', this.props.ariaLabel || this.props.label);
    return button;
  }

  private attachEventListeners(): void {
    this.button.addEventListener('mouseenter', this.boundHandlers.mouseenter);
    this.button.addEventListener('mouseleave', this.boundHandlers.mouseleave);
    this.button.addEventListener('click', this.boundHandlers.click);
    this.button.addEventListener('keydown', this.boundHandlers.keydown);
  }

  private initializeSmoothVelocityAnimation(): void {
    if (!this.orbitElement) return;

    // Get the keyframes based on rotation axis
    const keyframes = this.getKeyframesForAxis();

    // Create animation with Web Animations API
    this.orbitAnimation = this.orbitElement.animate(keyframes, {
      duration: this.props.rotationSec * 1000,
      iterations: Infinity,
      easing: 'linear',
    });

    // Set initial playback rate (1.0 = normal speed)
    this.orbitAnimation.playbackRate = 1.0;
  }

  private getKeyframesForAxis(): Keyframe[] {
    const { orbitTiltX, orbitTiltY, orbitRotationAxis, strokeColor } = this.props;
    const goldColor = strokeColor;

    if (orbitRotationAxis === 'x') {
      return [
        {
          transform: `rotateY(${orbitTiltY}deg) rotateX(${orbitTiltX}deg) rotateX(0deg)`,
          boxShadow: `0px 2px 0px 1px ${goldColor}`,
        },
        {
          transform: `rotateY(${orbitTiltY}deg) rotateX(${orbitTiltX + 90}deg)`,
          boxShadow: `0px 2px 0px 1px ${goldColor}`,
        },
        {
          transform: `rotateY(${orbitTiltY}deg) rotateX(${orbitTiltX + 180}deg)`,
          boxShadow: `0px -2px 0px 1px ${goldColor}`,
        },
        {
          transform: `rotateY(${orbitTiltY}deg) rotateX(${orbitTiltX + 270}deg)`,
          boxShadow: `0px -2px 0px 1px ${goldColor}`,
        },
        {
          transform: `rotateY(${orbitTiltY}deg) rotateX(${orbitTiltX + 360}deg)`,
          boxShadow: `0px 2px 0px 1px ${goldColor}`,
        },
      ];
    } else if (orbitRotationAxis === 'y') {
      return [
        {
          transform: `rotateX(${orbitTiltX}deg) rotateY(${orbitTiltY}deg) rotateY(0deg)`,
          boxShadow: `2px 0px 0px 1px ${goldColor}`,
        },
        {
          transform: `rotateX(${orbitTiltX}deg) rotateY(${orbitTiltY + 90}deg)`,
          boxShadow: `2px 0px 0px 1px ${goldColor}`,
        },
        {
          transform: `rotateX(${orbitTiltX}deg) rotateY(${orbitTiltY + 180}deg)`,
          boxShadow: `-2px 0px 0px 1px ${goldColor}`,
        },
        {
          transform: `rotateX(${orbitTiltX}deg) rotateY(${orbitTiltY + 270}deg)`,
          boxShadow: `-2px 0px 0px 1px ${goldColor}`,
        },
        {
          transform: `rotateX(${orbitTiltX}deg) rotateY(${orbitTiltY + 360}deg)`,
          boxShadow: `2px 0px 0px 1px ${goldColor}`,
        },
      ];
    } else {
      // Z-axis
      return [
        {
          transform: `rotateX(${orbitTiltX}deg) rotateY(${orbitTiltY}deg) rotateZ(0deg)`,
        },
        {
          transform: `rotateX(${orbitTiltX}deg) rotateY(${orbitTiltY}deg) rotateZ(360deg)`,
        },
      ];
    }
  }

  private handleHover(isEntering: boolean): void {
    // Apply hover class for visual effects (sphere scale, etc.)
    if (isEntering) {
      this.container.classList.add('is-hovered');
    } else {
      this.container.classList.remove('is-hovered');
    }

    if (this.props.hoverSlowToFlat && this.orbitAnimation) {
      // Slowly move directly to flat position
      this.hoverSlowToFlatAnimation(isEntering);
    } else if (this.props.hoverReverseFull360ToFlat && this.orbitAnimation) {
      // Reverse 360° + whatever needed to reach flat
      this.hoverReverseFull360ToFlatAnimation(isEntering);
    } else if (this.props.hoverReverseToFlat && this.orbitAnimation) {
      // Immediately reverse to flat position
      this.hoverReverseToFlatAnimation(isEntering);
    } else if (this.props.hoverToFlat && this.orbitAnimation) {
      // Speed up 4x, complete 360°, then stop at flat
      this.hoverToFlatAnimation(isEntering);
    } else if (this.props.smoothVelocity && this.orbitAnimation) {
      // Only change the playback rate (velocity)
      this.transitionPlaybackRate(isEntering);
    }
  }

  private hoverSlowToFlatAnimation(isEntering: boolean): void {
    if (!this.orbitAnimation || !this.orbitElement) return;

    if (isEntering) {
      // Get current animation progress
      const currentTime = this.orbitAnimation.currentTime as number;
      const duration = (this.orbitAnimation.effect?.getTiming().duration as number) || 1000;
      const progress = (currentTime % duration) / duration; // Progress in current cycle (0-1)

      this.orbitAnimation.cancel();

      const { orbitTiltX, orbitTiltY, orbitRotationAxis, strokeColor } = this.props;
      const goldColor = strokeColor;

      // Calculate current angle
      const currentAngle = progress * 360; // Current position in degrees

      // Create keyframes that rotate backwards slowly to flat
      let slowKeyframes: Keyframe[];

      if (orbitRotationAxis === 'x') {
        // Rotate backwards on X-axis until flat
        const steps = Math.ceil(currentAngle / 90) + 1; // Number of keyframes needed
        slowKeyframes = [];

        for (let i = 0; i <= steps; i++) {
          const angle = currentAngle - (currentAngle * i / steps);
          const finalAngle = i === steps ? 0 : orbitTiltX + angle;
          slowKeyframes.push({
            transform: i === steps
              ? 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)'
              : `rotateY(${orbitTiltY}deg) rotateX(${finalAngle}deg)`,
            boxShadow: `0px 2px 0px 1px ${goldColor}`,
          });
        }
      } else if (orbitRotationAxis === 'y') {
        // Rotate backwards on Y-axis until flat
        const steps = Math.ceil(currentAngle / 90) + 1; // Number of keyframes needed
        slowKeyframes = [];

        for (let i = 0; i <= steps; i++) {
          const angle = currentAngle - (currentAngle * i / steps);
          const finalAngle = i === steps ? 0 : orbitTiltY + angle;
          slowKeyframes.push({
            transform: i === steps
              ? 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)'
              : `rotateX(${orbitTiltX}deg) rotateY(${finalAngle}deg)`,
            boxShadow: `2px 0px 0px 1px ${goldColor}`,
          });
        }
      } else {
        // Z-axis: rotate backwards until flat
        const steps = Math.ceil(currentAngle / 90) + 1;
        slowKeyframes = [];

        for (let i = 0; i <= steps; i++) {
          const angle = currentAngle - (currentAngle * i / steps);
          slowKeyframes.push({
            transform: i === steps
              ? 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)'
              : `rotateX(${orbitTiltX}deg) rotateY(${orbitTiltY}deg) rotateZ(${angle}deg)`,
          });
        }
      }

      // Create slow reverse animation
      const slowAnimation = this.orbitElement.animate(slowKeyframes, {
        duration: 2000, // 2 seconds slow reverse
        iterations: 1,
        easing: 'ease-out',
        fill: 'forwards', // Keep final state
      });

      // Store reference
      this.orbitAnimation = slowAnimation;
    } else {
      // Mouse leave: restart normal looping animation
      if (this.orbitAnimation) {
        this.orbitAnimation.cancel();
      }

      // Reinitialize with normal looping animation
      this.initializeSmoothVelocityAnimation();
    }
  }

  private hoverReverseFull360ToFlatAnimation(isEntering: boolean): void {
    if (!this.orbitAnimation || !this.orbitElement) return;

    if (isEntering) {
      // Cancel current animation and get current position
      const currentTime = this.orbitAnimation.currentTime as number;
      const duration = (this.orbitAnimation.effect?.getTiming().duration as number) || 1000;
      const progress = (currentTime % duration) / duration; // Progress in current cycle (0-1)

      this.orbitAnimation.cancel();

      const { orbitTiltX, orbitTiltY, orbitRotationAxis, strokeColor } = this.props;
      const goldColor = strokeColor;

      // Calculate current angle
      const currentAngle = progress * 360; // Current position in degrees

      // Create keyframes for just 1 backwards rotation ending at flat
      let reverseKeyframes: Keyframe[];

      if (orbitRotationAxis === 'x') {
        // Go backwards 360° ending at flat (0,0,0)
        reverseKeyframes = [
          {
            transform: `rotateY(${orbitTiltY}deg) rotateX(${orbitTiltX + currentAngle}deg)`,
            boxShadow: `0px 2px 0px 1px ${goldColor}`,
          },
          {
            transform: `rotateY(${orbitTiltY}deg) rotateX(${orbitTiltX + currentAngle - 180}deg)`,
            boxShadow: `0px -2px 0px 1px ${goldColor}`,
          },
          {
            transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)', // 360° back = flat
            boxShadow: `0px 2px 0px 1px ${goldColor}`,
          },
        ];
      } else if (orbitRotationAxis === 'y') {
        // Go backwards 360° ending at flat (0,0,0)
        reverseKeyframes = [
          {
            transform: `rotateX(${orbitTiltX}deg) rotateY(${orbitTiltY + currentAngle}deg)`,
            boxShadow: `2px 0px 0px 1px ${goldColor}`,
          },
          {
            transform: `rotateX(${orbitTiltX}deg) rotateY(${orbitTiltY + currentAngle - 180}deg)`,
            boxShadow: `-2px 0px 0px 1px ${goldColor}`,
          },
          {
            transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)', // 360° back = flat
            boxShadow: `0px 2px 0px 1px ${goldColor}`,
          },
        ];
      } else {
        // Z-axis: go backwards 360° ending at flat
        reverseKeyframes = [
          {
            transform: `rotateX(${orbitTiltX}deg) rotateY(${orbitTiltY}deg) rotateZ(${currentAngle}deg)`,
          },
          {
            transform: `rotateX(${orbitTiltX}deg) rotateY(${orbitTiltY}deg) rotateZ(${currentAngle - 180}deg)`,
          },
          {
            transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)', // 360° back = flat
          },
        ];
      }

      // Create reverse animation with ease-out
      const reverseAnimation = this.orbitElement.animate(reverseKeyframes, {
        duration: 1800, // 1.8 seconds for full reverse + reach flat
        iterations: 1,
        easing: 'ease-out',
        fill: 'forwards', // Keep final state
      });

      // Store reference
      this.orbitAnimation = reverseAnimation;
    } else {
      // Mouse leave: restart normal looping animation
      if (this.orbitAnimation) {
        this.orbitAnimation.cancel();
      }

      // Reinitialize with normal looping animation
      this.initializeSmoothVelocityAnimation();
    }
  }

  private hoverReverseToFlatAnimation(isEntering: boolean): void {
    if (!this.orbitAnimation || !this.orbitElement) return;

    if (isEntering) {
      // Cancel current animation
      this.orbitAnimation.cancel();

      // Get current computed transform to know where we are
      const computedStyle = window.getComputedStyle(this.orbitElement);
      const currentTransform = computedStyle.transform;

      // Animate directly from current position to flat with ease-out
      const { strokeColor } = this.props;
      const goldColor = strokeColor;

      const reverseKeyframes: Keyframe[] = [
        {
          transform: currentTransform,
          boxShadow: `0px 2px 0px 1px ${goldColor}`,
        },
        {
          transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
          boxShadow: `0px 2px 0px 1px ${goldColor}`,
        },
      ];

      // Create reverse animation with ease-out
      const reverseAnimation = this.orbitElement.animate(reverseKeyframes, {
        duration: 800, // 800ms ease-out
        iterations: 1,
        easing: 'ease-out',
        fill: 'forwards', // Keep final state
      });

      // Store reference
      this.orbitAnimation = reverseAnimation;
    } else {
      // Mouse leave: restart normal looping animation
      if (this.orbitAnimation) {
        this.orbitAnimation.cancel();
      }

      // Reinitialize with normal looping animation
      this.initializeSmoothVelocityAnimation();
    }
  }

  private hoverToFlatAnimation(isEntering: boolean): void {
    if (!this.orbitAnimation || !this.orbitElement) return;

    if (isEntering) {
      // Cancel normal animation
      this.orbitAnimation.cancel();

      // Create a sequence: speed up 4x for one rotation, then ease-out to flat
      const { orbitRotationAxis, strokeColor } = this.props;
      const goldColor = strokeColor;

      // Calculate one full rotation duration at 4x speed
      const normalDuration = this.props.rotationSec * 1000;
      const fastDuration = normalDuration / 4; // 4x faster

      // Phase 1: Fast 360° rotation
      const rotationKeyframes = this.getKeyframesForAxis();

      // Phase 2: Ease-out to flat position
      const flatKeyframes: Keyframe[] = [
        rotationKeyframes[rotationKeyframes.length - 1], // End of rotation
        {
          transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
          boxShadow: orbitRotationAxis === 'z'
            ? `0px 2px 0px 1px ${goldColor}`
            : `0px 2px 0px 1px ${goldColor}`,
        },
      ];

      // Create phase 1 animation (fast rotation)
      const fastRotation = this.orbitElement.animate(rotationKeyframes, {
        duration: fastDuration,
        iterations: 1,
        easing: 'linear',
      });

      // When phase 1 completes, start phase 2 (ease to flat and stop)
      fastRotation.onfinish = () => {
        if (!this.orbitElement) return;

        const flatAnimation = this.orbitElement.animate(flatKeyframes, {
          duration: 800, // 800ms ease-out
          iterations: 1,
          easing: 'ease-out',
          fill: 'forwards', // Keep final state
        });

        // Store reference
        this.orbitAnimation = flatAnimation;
      };

      // Store reference to fast rotation
      this.orbitAnimation = fastRotation;
    } else {
      // Mouse leave: restart normal looping animation
      if (this.orbitAnimation) {
        this.orbitAnimation.cancel();
      }

      // Reinitialize with normal looping animation
      this.initializeSmoothVelocityAnimation();
    }
  }

  private transitionPlaybackRate(isEntering: boolean): void {
    if (!this.orbitAnimation) return;

    // Cancel any existing transition
    if (this.velocityTransition !== null) {
      cancelAnimationFrame(this.velocityTransition);
    }

    // Calculate target playback rate based on duration ratio
    // Normal speed = 1.0, faster = higher playback rate
    const normalDuration = this.props.rotationSec;
    const hoverDuration = this.props.hoverRotationSec;
    const targetRate = isEntering ? normalDuration / hoverDuration : 1.0;

    const startRate = this.orbitAnimation.playbackRate;
    const transitionDuration = 600; // 600ms smooth transition
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / transitionDuration, 1);

      // Ease-in-out function
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const currentRate = startRate + (targetRate - startRate) * eased;
      this.orbitAnimation!.playbackRate = currentRate;

      if (progress < 1) {
        this.velocityTransition = requestAnimationFrame(animate);
      } else {
        this.velocityTransition = null;
      }
    };

    this.velocityTransition = requestAnimationFrame(animate);
  }

  private handleClick(ev: MouseEvent): void {
    if (this.props.onClick) {
      this.props.onClick(ev);
    }
  }

  private handleKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.button.click();
    }
  }

  public update(partialProps: Partial<RitualButtonV6Props>): void {
    this.props = { ...this.props, ...partialProps } as any;

    if (partialProps.size !== undefined) {
      this.container.style.setProperty('--size', `${this.props.size}px`);
    }

    if (partialProps.label !== undefined) {
      const label = this.main.querySelector('.ritual-label-v6');
      if (label) {
        label.textContent = this.props.label;
      }
    }

    if (partialProps.rotationSec !== undefined) {
      this.container.style.setProperty('--rotation-sec', `${this.props.rotationSec}s`);
    }

    if (partialProps.hoverRotationSec !== undefined) {
      this.container.style.setProperty('--hover-rotation-sec', `${this.props.hoverRotationSec}s`);
    }

    if (partialProps.strokeColor !== undefined) {
      this.container.style.setProperty('--gold-color', this.props.strokeColor);
    }

    if (partialProps.orbitTiltX !== undefined) {
      this.container.style.setProperty('--orbit-tilt-x', `${this.props.orbitTiltX}deg`);
    }

    if (partialProps.orbitTiltY !== undefined) {
      this.container.style.setProperty('--orbit-tilt-y', `${this.props.orbitTiltY}deg`);
    }

    if (partialProps.orbitRotationAxis !== undefined) {
      this.container.style.setProperty('--orbit-axis', this.props.orbitRotationAxis);
    }
  }

  public destroy(): void {
    this.button.removeEventListener('mouseenter', this.boundHandlers.mouseenter);
    this.button.removeEventListener('mouseleave', this.boundHandlers.mouseleave);
    this.button.removeEventListener('click', this.boundHandlers.click);
    this.button.removeEventListener('keydown', this.boundHandlers.keydown);

    // Cancel velocity transition
    if (this.velocityTransition !== null) {
      cancelAnimationFrame(this.velocityTransition);
    }

    // Cancel orbit animation
    if (this.orbitAnimation) {
      this.orbitAnimation.cancel();
    }
  }

  public mount(target: HTMLElement): void {
    target.appendChild(this.container);
  }

  public getElement(): HTMLDivElement {
    return this.container;
  }
}
