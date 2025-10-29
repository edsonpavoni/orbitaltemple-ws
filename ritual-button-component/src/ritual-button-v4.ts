import type { RitualButtonProps } from './types.js';

const DEFAULT_PROPS: Required<Omit<RitualButtonProps, 'onClick' | 'className' | 'ariaLabel'>> = {
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
  easing: 'linear',
  wobble: false,
  wobbleSec: 6,
  shadow: true,
};

export class RitualButtonV4 {
  private container: HTMLDivElement;
  private main: HTMLDivElement;
  private button: HTMLButtonElement;

  private props: Required<Omit<RitualButtonProps, 'onClick' | 'className' | 'ariaLabel'>> & {
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

  constructor(props: RitualButtonProps = {}) {
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
  }

  private createContainer(): HTMLDivElement {
    const div = document.createElement('div');
    div.className = `ritual-wrap-v4 ${this.props.className || ''}`.trim();
    div.style.setProperty('--size', `${this.props.size}px`);
    div.style.setProperty('--rotation-sec', `${this.props.rotationSec}s`);
    div.style.setProperty('--hover-rotation-sec', `${this.props.hoverRotationSec}s`);
    div.style.setProperty('--gold-color', this.props.strokeColor);
    return div;
  }

  private createMainStructure(): HTMLDivElement {
    const main = document.createElement('div');
    main.className = 'ritual-main';

    // Create 4 orbiting dots
    for (let i = 0; i < 4; i++) {
      const dot = document.createElement('i');
      dot.className = 'ritual-dot';
      main.appendChild(dot);
    }

    // Create circle elements (o, h, v)
    const circleO = document.createElement('div');
    circleO.className = 'ritual-circle ritual-circle-o';
    main.appendChild(circleO);

    const circleH = document.createElement('div');
    circleH.className = 'ritual-circle ritual-circle-h';
    main.appendChild(circleH);

    const circleV = document.createElement('div');
    circleV.className = 'ritual-circle ritual-circle-v';
    main.appendChild(circleV);

    // Create center with orbits and label
    const center = document.createElement('div');
    center.className = 'ritual-center';

    const orbit1 = document.createElement('span');
    orbit1.className = 'ritual-orbit';
    center.appendChild(orbit1);

    const orbit2 = document.createElement('span');
    orbit2.className = 'ritual-orbit';
    center.appendChild(orbit2);

    const label = document.createElement('span');
    label.className = 'ritual-label';
    label.textContent = this.props.label;
    center.appendChild(label);

    main.appendChild(center);

    return main;
  }

  private createButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'ritual-btn-v4';
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

  public update(partialProps: Partial<RitualButtonProps>): void {
    this.props = { ...this.props, ...partialProps };

    if (partialProps.size !== undefined) {
      this.container.style.setProperty('--size', `${this.props.size}px`);
    }

    if (partialProps.label !== undefined) {
      const label = this.main.querySelector('.ritual-label');
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
