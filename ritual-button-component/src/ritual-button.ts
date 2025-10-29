import { type AnimationControls } from 'motion';
import { spin, spinToSpeed, wobble, rotateTo } from './utils/motion.js';
import type { RitualButtonProps } from './types.js';

const DEFAULT_PROPS: Required<Omit<RitualButtonProps, 'onClick' | 'className' | 'ariaLabel'>> = {
  label: 'ritual',
  size: 170,
  ringRx: 85,
  ringRy: 55,
  ringAzimuthDeg: 18,
  strokeColor: '#6B5727',
  strokeWidth: 2.5,
  diskColor: '#FFF7E6',
  textColor: '#3C2A00',
  rotationSec: 8,
  hoverRotationSec: 3,
  easing: 'linear',
  wobble: true,
  wobbleSec: 6,
  shadow: true,
};

export class RitualButton {
  private container: HTMLDivElement;
  private button: HTMLButtonElement;
  private backOrbitGroup: SVGGElement;
  private frontOrbitGroup: SVGGElement;
  private azimuthWrapper?: SVGGElement;

  private spinControls: { back: AnimationControls | null; front: AnimationControls | null } = {
    back: null,
    front: null,
  };
  private wobbleControl: AnimationControls | null = null;

  private props: Required<Omit<RitualButtonProps, 'onClick' | 'className' | 'ariaLabel'>> & {
    onClick?: (ev: MouseEvent) => void;
    className?: string;
    ariaLabel?: string;
  };

  private prefersReducedMotion: boolean = false;
  private isHovered: boolean = false;
  private isFocused: boolean = false;

  private boundHandlers = {
    mouseenter: () => this.handleHover(true),
    mouseleave: () => this.handleHover(false),
    focus: () => this.handleFocus(true),
    blur: () => this.handleFocus(false),
    click: (ev: MouseEvent) => this.handleClick(ev),
    keydown: (ev: KeyboardEvent) => this.handleKeydown(ev),
  };

  constructor(props: RitualButtonProps = {}) {
    this.props = { ...DEFAULT_PROPS, ...props };

    // Check for reduced motion preference
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create container
    this.container = this.createContainer();

    // Create back SVG orbit
    const backSVG = this.createOrbitSVG('back');
    this.backOrbitGroup = backSVG.querySelector('.orbit-rot') as SVGGElement;

    // Create button
    this.button = this.createButton();

    // Create front SVG orbit
    const frontSVG = this.createOrbitSVG('front');
    this.frontOrbitGroup = frontSVG.querySelector('.orbit-rot') as SVGGElement;

    // Append elements
    this.container.appendChild(backSVG);
    this.container.appendChild(this.button);
    this.container.appendChild(frontSVG);

    // Start animations
    this.startAnimations();

    // Add event listeners
    this.attachEventListeners();
  }

  private createContainer(): HTMLDivElement {
    const div = document.createElement('div');
    div.className = `ritual-wrap ${this.props.className || ''}`.trim();
    div.style.setProperty('--size', `${this.props.size}px`);
    div.style.setProperty('--disk-color', this.props.diskColor);
    div.style.setProperty('--text-color', this.props.textColor);
    div.style.setProperty('--stroke-color', this.props.strokeColor);
    div.style.setProperty('--stroke-width', `${this.props.strokeWidth}`);
    return div;
  }

  private createOrbitSVG(layer: 'back' | 'front'): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('orbit', layer);
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.setAttribute('aria-hidden', 'true');

    // Create azimuth wrapper if wobble is enabled
    let rotationGroup: SVGGElement;

    if (this.props.wobble && !this.azimuthWrapper) {
      const azimuthG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      azimuthG.classList.add('azimuth-wrapper');
      azimuthG.setAttribute(
        'transform',
        `rotate(${this.props.ringAzimuthDeg} 100 100)`
      );
      this.azimuthWrapper = azimuthG;
      svg.appendChild(azimuthG);
      rotationGroup = azimuthG;
    } else if (this.props.wobble && this.azimuthWrapper) {
      svg.appendChild(this.azimuthWrapper);
      rotationGroup = this.azimuthWrapper;
    } else {
      rotationGroup = svg;
    }

    // Create orbit rotation group
    const orbitG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    orbitG.classList.add('orbit-rot', `${layer}-g`);

    if (!this.props.wobble) {
      orbitG.setAttribute(
        'transform',
        `rotate(${this.props.ringAzimuthDeg} 100 100)`
      );
    }

    // Create ellipse
    const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    ellipse.setAttribute('cx', '100');
    ellipse.setAttribute('cy', '100');
    ellipse.setAttribute('rx', String(this.props.ringRx));
    ellipse.setAttribute('ry', String(this.props.ringRy));
    ellipse.setAttribute('fill', 'none');
    ellipse.setAttribute('stroke', this.props.strokeColor);
    ellipse.setAttribute('stroke-width', String(this.props.strokeWidth));
    ellipse.setAttribute('pathLength', '1');
    ellipse.setAttribute('stroke-dasharray', '0.5 0.5');

    // Back layer has offset, front doesn't
    if (layer === 'back') {
      ellipse.setAttribute('stroke-dashoffset', '0.5');
    } else {
      ellipse.setAttribute('stroke-dashoffset', '0');
    }

    ellipse.style.willChange = 'transform';

    orbitG.appendChild(ellipse);
    rotationGroup.appendChild(orbitG);

    return svg;
  }

  private createButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'ritual-btn';
    button.type = 'button';
    button.setAttribute('aria-label', this.props.ariaLabel || this.props.label);

    if (!this.props.shadow) {
      button.classList.add('no-shadow');
    }

    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = this.props.label;

    button.appendChild(label);
    return button;
  }

  private startAnimations(): void {
    if (this.prefersReducedMotion) {
      // No continuous animation in reduced motion mode
      return;
    }

    // Start rotation animations
    this.spinControls.back = spin(this.backOrbitGroup, this.props.rotationSec);
    this.spinControls.front = spin(this.frontOrbitGroup, this.props.rotationSec);

    // Start wobble if enabled
    if (this.props.wobble && this.azimuthWrapper) {
      this.wobbleControl = wobble(this.azimuthWrapper, this.props.wobbleSec);
    }
  }

  private attachEventListeners(): void {
    this.button.addEventListener('mouseenter', this.boundHandlers.mouseenter);
    this.button.addEventListener('mouseleave', this.boundHandlers.mouseleave);
    this.button.addEventListener('focus', this.boundHandlers.focus);
    this.button.addEventListener('blur', this.boundHandlers.blur);
    this.button.addEventListener('click', this.boundHandlers.click);
    this.button.addEventListener('keydown', this.boundHandlers.keydown);
  }

  private handleHover(isEntering: boolean): void {
    this.isHovered = isEntering;
    this.updateRotationSpeed();
  }

  private handleFocus(isFocusing: boolean): void {
    this.isFocused = isFocusing;
    this.updateRotationSpeed();
  }

  private updateRotationSpeed(): void {
    const shouldSpeedUp = this.isHovered || this.isFocused;

    if (this.prefersReducedMotion) {
      // In reduced motion mode, rotate 45° on hover/focus
      if (shouldSpeedUp) {
        rotateTo(this.backOrbitGroup, 45, 0.3);
        rotateTo(this.frontOrbitGroup, 45, 0.3);
      } else {
        rotateTo(this.backOrbitGroup, 0, 0.3);
        rotateTo(this.frontOrbitGroup, 0, 0.3);
      }
    } else {
      // Change rotation speed
      const targetSpeed = shouldSpeedUp ? this.props.hoverRotationSec : this.props.rotationSec;
      this.spinControls.back = spinToSpeed(this.spinControls.back, this.backOrbitGroup, targetSpeed);
      this.spinControls.front = spinToSpeed(this.spinControls.front, this.frontOrbitGroup, targetSpeed);
    }
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

  /**
   * Update component properties dynamically
   */
  public update(partialProps: Partial<RitualButtonProps>): void {
    this.props = { ...this.props, ...partialProps };

    // Update CSS variables
    if (partialProps.size !== undefined) {
      this.container.style.setProperty('--size', `${this.props.size}px`);
    }
    if (partialProps.diskColor !== undefined) {
      this.container.style.setProperty('--disk-color', this.props.diskColor);
    }
    if (partialProps.textColor !== undefined) {
      this.container.style.setProperty('--text-color', this.props.textColor);
    }
    if (partialProps.strokeColor !== undefined) {
      this.container.style.setProperty('--stroke-color', this.props.strokeColor);
    }
    if (partialProps.strokeWidth !== undefined) {
      this.container.style.setProperty('--stroke-width', `${this.props.strokeWidth}`);
    }

    // Update button label
    if (partialProps.label !== undefined) {
      const labelSpan = this.button.querySelector('.label');
      if (labelSpan) {
        labelSpan.textContent = this.props.label;
      }
    }

    // Update rotation speeds if changed
    if (partialProps.rotationSec !== undefined || partialProps.hoverRotationSec !== undefined) {
      this.updateRotationSpeed();
    }
  }

  /**
   * Clean up animations and event listeners
   */
  public destroy(): void {
    // Stop animations
    if (this.spinControls.back) {
      this.spinControls.back.stop();
    }
    if (this.spinControls.front) {
      this.spinControls.front.stop();
    }
    if (this.wobbleControl) {
      this.wobbleControl.stop();
    }

    // Remove event listeners
    this.button.removeEventListener('mouseenter', this.boundHandlers.mouseenter);
    this.button.removeEventListener('mouseleave', this.boundHandlers.mouseleave);
    this.button.removeEventListener('focus', this.boundHandlers.focus);
    this.button.removeEventListener('blur', this.boundHandlers.blur);
    this.button.removeEventListener('click', this.boundHandlers.click);
    this.button.removeEventListener('keydown', this.boundHandlers.keydown);
  }

  /**
   * Get the container element to mount in DOM
   */
  public mount(target: HTMLElement): void {
    target.appendChild(this.container);
  }

  /**
   * Get the container element
   */
  public getElement(): HTMLDivElement {
    return this.container;
  }
}
