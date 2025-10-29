import type { RitualButtonProps } from './types.js';

interface RitualButtonV5Props extends RitualButtonProps {
  animationDuration?: number; // Duration for entrance animation (ms)
  circleScaleDuration?: number; // Duration for circle scale (ms)
  orbitShowDelay?: number; // Delay before showing orbit (ms)
  labelShowDelay?: number; // Delay before showing label (ms)
  orbitRotationSec?: number; // Orbit rotation duration (seconds)
  orbitHoverRotationSec?: number; // Orbit hover rotation duration (seconds)
}

const DEFAULT_PROPS = {
  label: 'ritual',
  size: 170,
  diskColor: '#FFF7E6', // gold100
  textColor: '#3C2A00',
  rotationSec: 20, // Very slow orbit
  hoverRotationSec: 8,
  shadow: true,
  // V5 specific defaults
  animationDuration: 2000,
  circleScaleDuration: 800,
  orbitShowDelay: 900,
  labelShowDelay: 1200,
  orbitRotationSec: 20,
  orbitHoverRotationSec: 8,
};

export class RitualButtonV5 {
  private container: HTMLDivElement;
  private main: HTMLDivElement;
  private button: HTMLButtonElement;

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

  constructor(props: RitualButtonV5Props = {}) {
    this.props = { ...DEFAULT_PROPS, ...props };

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

    // Trigger entrance animation
    requestAnimationFrame(() => {
      this.container.classList.add('animate-in');
    });
  }

  private createContainer(): HTMLDivElement {
    const div = document.createElement('div');
    div.className = `ritual-wrap-v5 ${this.props.className || ''}`.trim();

    // Set CSS variables
    div.style.setProperty('--size', `${this.props.size}px`);
    div.style.setProperty('--circle-scale-duration', `${this.props.circleScaleDuration}ms`);
    div.style.setProperty('--orbit-show-delay', `${this.props.orbitShowDelay}ms`);
    div.style.setProperty('--label-show-delay', `${this.props.labelShowDelay}ms`);
    div.style.setProperty('--orbit-rotation-sec', `${this.props.orbitRotationSec}s`);
    div.style.setProperty('--orbit-hover-rotation-sec', `${this.props.orbitHoverRotationSec}s`);

    return div;
  }

  private createMainStructure(): HTMLDivElement {
    const main = document.createElement('div');
    main.className = 'ritual-main-v5';

    // Create main circle (only the o circle, no h or v)
    const circleO = document.createElement('div');
    circleO.className = 'ritual-circle-v5';
    main.appendChild(circleO);

    // Create center with single orbit
    const center = document.createElement('div');
    center.className = 'ritual-center-v5';

    // Single orbit with gradient
    const orbit = document.createElement('span');
    orbit.className = 'ritual-orbit-v5';
    center.appendChild(orbit);

    // Label
    const label = document.createElement('span');
    label.className = 'ritual-label-v5';
    label.textContent = this.props.label;
    center.appendChild(label);

    main.appendChild(center);

    return main;
  }

  private createButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'ritual-btn-v5';
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

  private handleHover(isEntering: boolean): void {
    if (isEntering) {
      this.container.classList.add('is-hovered');
    } else {
      this.container.classList.remove('is-hovered');
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

  public update(partialProps: Partial<RitualButtonV5Props>): void {
    this.props = { ...this.props, ...partialProps };

    if (partialProps.size !== undefined) {
      this.container.style.setProperty('--size', `${this.props.size}px`);
    }

    if (partialProps.label !== undefined) {
      const label = this.main.querySelector('.ritual-label-v5');
      if (label) {
        label.textContent = this.props.label;
      }
    }

    if (partialProps.circleScaleDuration !== undefined) {
      this.container.style.setProperty('--circle-scale-duration', `${this.props.circleScaleDuration}ms`);
    }

    if (partialProps.orbitShowDelay !== undefined) {
      this.container.style.setProperty('--orbit-show-delay', `${this.props.orbitShowDelay}ms`);
    }

    if (partialProps.labelShowDelay !== undefined) {
      this.container.style.setProperty('--label-show-delay', `${this.props.labelShowDelay}ms`);
    }

    if (partialProps.orbitRotationSec !== undefined) {
      this.container.style.setProperty('--orbit-rotation-sec', `${this.props.orbitRotationSec}s`);
    }

    if (partialProps.orbitHoverRotationSec !== undefined) {
      this.container.style.setProperty('--orbit-hover-rotation-sec', `${this.props.orbitHoverRotationSec}s`);
    }
  }

  public destroy(): void {
    this.button.removeEventListener('mouseenter', this.boundHandlers.mouseenter);
    this.button.removeEventListener('mouseleave', this.boundHandlers.mouseleave);
    this.button.removeEventListener('click', this.boundHandlers.click);
    this.button.removeEventListener('keydown', this.boundHandlers.keydown);
  }

  public mount(target: HTMLElement): void {
    target.appendChild(this.container);
  }

  public getElement(): HTMLDivElement {
    return this.container;
  }
}
