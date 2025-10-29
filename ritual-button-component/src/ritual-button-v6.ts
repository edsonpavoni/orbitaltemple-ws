import type { RitualButtonProps } from './types.js';

interface RitualButtonV6Props extends RitualButtonProps {
  orbitTiltX?: number; // Initial tilt on X-axis (default 0)
  orbitTiltY?: number; // Initial tilt on Y-axis (default 0)
  orbitRotationAxis?: 'x' | 'y' | 'z'; // Which axis to rotate around (default 'x')
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
};

export class RitualButtonV6 {
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
  }

  private createContainer(): HTMLDivElement {
    const div = document.createElement('div');
    div.className = `ritual-wrap-v6 ${this.props.className || ''}`.trim();
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
  }

  public mount(target: HTMLElement): void {
    target.appendChild(this.container);
  }

  public getElement(): HTMLDivElement {
    return this.container;
  }
}
