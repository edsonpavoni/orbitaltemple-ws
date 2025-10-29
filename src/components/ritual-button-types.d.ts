export type RitualButtonProps = {
  label?: string;                 // default "ritual"
  size?: number;                  // px, default 170
  ringRx?: number;                // default 85
  ringRy?: number;                // default 55
  ringAzimuthDeg?: number;        // ellipse rotation in plane, default 18
  strokeColor?: string;           // default "#6B5727"
  strokeWidth?: number;           // default 2.5
  diskColor?: string;             // default "#FFF7E6"
  textColor?: string;             // default "#3C2A00"
  rotationSec?: number;           // default 8
  hoverRotationSec?: number;      // default 3
  easing?: "linear" | "ease-in-out"; // default "linear"
  wobble?: boolean;               // small ±3deg precession, default true
  wobbleSec?: number;             // default 6
  shadow?: boolean;               // default true
  ariaLabel?: string;             // default = label
  className?: string;
  onClick?: (ev: MouseEvent) => void;
  orbitTiltX?: number;            // Initial tilt on X-axis (default 0)
  orbitTiltY?: number;            // Initial tilt on Y-axis (default 0)
  orbitRotationAxis?: 'x' | 'y' | 'z'; // Which axis to rotate around (default 'x')
  smoothVelocity?: boolean;       // Smooth velocity transition on hover (default false)
  hoverToFlat?: boolean;          // On hover, speed up 4x, complete 360° rotation, then stop at flat position (default false)
  hoverReverseToFlat?: boolean;   // On hover, immediately reverse to flat position with ease-out (default false)
  hoverReverseFull360ToFlat?: boolean; // On hover, reverse 360° + whatever needed to reach flat, with ease-out (default false)
  hoverSlowToFlat?: boolean;      // On hover, slowly move directly to flat position (default false)
};

export type RitualButtonReactProps = Omit<RitualButtonProps, 'onClick'> & {
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
};
