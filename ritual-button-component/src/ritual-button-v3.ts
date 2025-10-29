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
  rotationSec: 8,
  hoverRotationSec: 3,
  easing: 'linear',
  wobble: false,
  wobbleSec: 6,
  shadow: true,
};

export class RitualButtonV3 {
  private container: HTMLDivElement;
  private scene: HTMLDivElement;
  private sphere: HTMLDivElement;
  private orbit: HTMLDivElement;
  private button: HTMLButtonElement;

  private props: Required<Omit<RitualButtonProps, 'onClick' | 'className' | 'ariaLabel'>> & {
    onClick?: (ev: MouseEvent) => void;
    className?: string;
    ariaLabel?: string;
  };

  // Note: These are set but used via CSS classes
  // private prefersReducedMotion: boolean = false;
  // private isHovered: boolean = false;

  private boundHandlers = {
    mouseenter: () => this.handleHover(true),
    mouseleave: () => this.handleHover(false),
    click: (ev: MouseEvent) => this.handleClick(ev),
    keydown: (ev: KeyboardEvent) => this.handleKeydown(ev),
  };

  constructor(props: RitualButtonProps = {}) {
    this.props = { ...DEFAULT_PROPS, ...props };
    // Reduced motion handled via CSS media query

    // Create container
    this.container = this.createContainer();

    // Create 3D scene
    this.scene = this.create3DScene();

    // Create sphere (center disk)
    this.sphere = this.createSphere();

    // Create orbit ring
    this.orbit = this.createOrbit();

    // Create button (invisible, for interaction)
    this.button = this.createButton();

    // Assemble
    this.scene.appendChild(this.orbit);
    this.scene.appendChild(this.sphere);
    this.container.appendChild(this.scene);
    this.container.appendChild(this.button);

    // Add event listeners
    this.attachEventListeners();
  }

  private createContainer(): HTMLDivElement {
    const div = document.createElement('div');
    div.className = `ritual-wrap-v3 ${this.props.className || ''}`.trim();
    div.style.setProperty('--size', `${this.props.size}px`);
    div.style.setProperty('--rotation-sec', `${this.props.rotationSec}s`);
    div.style.setProperty('--hover-rotation-sec', `${this.props.hoverRotationSec}s`);
    return div;
  }

  private create3DScene(): HTMLDivElement {
    const scene = document.createElement('div');
    scene.className = 'ritual-3d-scene';
    return scene;
  }

  private createSphere(): HTMLDivElement {
    const sphere = document.createElement('div');
    sphere.className = 'ritual-sphere';

    const label = document.createElement('span');
    label.className = 'ritual-label';
    label.textContent = this.props.label;

    sphere.appendChild(label);
    return sphere;
  }

  private createOrbit(): HTMLDivElement {
    const orbit = document.createElement('div');
    orbit.className = 'ritual-orbit-ring';

    // Create the ring itself
    const ring = document.createElement('div');
    ring.className = 'ritual-ring';

    orbit.appendChild(ring);
    return orbit;
  }

  private createButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'ritual-btn-overlay';
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
      const label = this.sphere.querySelector('.ritual-label');
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
