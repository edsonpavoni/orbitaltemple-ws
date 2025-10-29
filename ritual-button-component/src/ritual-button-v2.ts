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
  wobble: false,
  wobbleSec: 6,
  shadow: true,
};

export class RitualButtonV2 {
  private container: HTMLDivElement;
  private button: HTMLButtonElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private animationFrame: number | null = null;
  private rotation: number = 0;
  private rotationSpeed: number;
  private targetSpeed: number;

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
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Calculate rotation speed (degrees per millisecond)
    this.rotationSpeed = 360 / (this.props.rotationSec * 1000);
    this.targetSpeed = this.rotationSpeed;

    // Create container
    this.container = this.createContainer();

    // Create canvas for orbit
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'ritual-orbit-canvas';
    this.canvas.width = this.props.size * 2; // High DPI
    this.canvas.height = this.props.size * 2;
    this.canvas.style.width = `${this.props.size}px`;
    this.canvas.style.height = `${this.props.size}px`;
    this.ctx = this.canvas.getContext('2d')!;

    // Create button
    this.button = this.createButton();

    // Append elements
    this.container.appendChild(this.canvas);
    this.container.appendChild(this.button);

    // Start animation
    this.startAnimation();

    // Add event listeners
    this.attachEventListeners();
  }

  private createContainer(): HTMLDivElement {
    const div = document.createElement('div');
    div.className = `ritual-wrap-v2 ${this.props.className || ''}`.trim();
    div.style.setProperty('--size', `${this.props.size}px`);
    div.style.setProperty('--disk-color', this.props.diskColor);
    div.style.setProperty('--text-color', this.props.textColor);
    return div;
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

  private drawOrbit(): void {
    const canvas = this.canvas;
    const ctx = this.ctx;
    const scale = 2; // For high DPI

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Center point
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Orbit parameters (scaled for high DPI)
    const rx = this.props.ringRx * scale;
    const ry = this.props.ringRy * scale;

    // Save context
    ctx.save();

    // Move to center
    ctx.translate(cx, cy);

    // Apply azimuth rotation
    ctx.rotate((this.props.ringAzimuthDeg * Math.PI) / 180);

    // Apply orbit rotation
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Draw back part of orbit (behind button)
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, Math.PI * 0.25, Math.PI * 1.25);
    ctx.strokeStyle = this.props.strokeColor;
    ctx.lineWidth = this.props.strokeWidth * scale;
    ctx.globalAlpha = 0.3; // Dimmer when behind
    ctx.stroke();

    // Draw front part of orbit (in front of button)
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, Math.PI * 1.25, Math.PI * 2.25);
    ctx.strokeStyle = this.props.strokeColor;
    ctx.lineWidth = this.props.strokeWidth * scale;
    ctx.globalAlpha = 1.0;
    ctx.stroke();

    // Restore context
    ctx.restore();
  }

  private animate = (): void => {
    if (!this.prefersReducedMotion) {
      // Smooth speed transition
      const speedDiff = this.targetSpeed - this.rotationSpeed;
      this.rotationSpeed += speedDiff * 0.1;

      // Update rotation
      this.rotation += this.rotationSpeed * 16; // Assume ~60fps
      this.rotation %= 360;
    }

    // Draw orbit
    this.drawOrbit();

    // Continue animation
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  private startAnimation(): void {
    if (this.animationFrame === null) {
      this.animationFrame = requestAnimationFrame(this.animate);
    }
  }

  private stopAnimation(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
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

    if (shouldSpeedUp) {
      this.targetSpeed = 360 / (this.props.hoverRotationSec * 1000);
    } else {
      this.targetSpeed = 360 / (this.props.rotationSec * 1000);
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
      this.canvas.width = this.props.size * 2;
      this.canvas.height = this.props.size * 2;
      this.canvas.style.width = `${this.props.size}px`;
      this.canvas.style.height = `${this.props.size}px`;
    }

    if (partialProps.label !== undefined) {
      const labelSpan = this.button.querySelector('.label');
      if (labelSpan) {
        labelSpan.textContent = this.props.label;
      }
    }

    if (partialProps.rotationSec !== undefined || partialProps.hoverRotationSec !== undefined) {
      this.rotationSpeed = 360 / (this.props.rotationSec * 1000);
      this.updateRotationSpeed();
    }
  }

  public destroy(): void {
    this.stopAnimation();

    this.button.removeEventListener('mouseenter', this.boundHandlers.mouseenter);
    this.button.removeEventListener('mouseleave', this.boundHandlers.mouseleave);
    this.button.removeEventListener('focus', this.boundHandlers.focus);
    this.button.removeEventListener('blur', this.boundHandlers.blur);
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
