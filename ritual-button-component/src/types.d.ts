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
};

export type RitualButtonReactProps = Omit<RitualButtonProps, 'onClick'> & {
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
};
