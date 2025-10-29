import { animate, type AnimationControls } from 'motion';

/**
 * Spins an element continuously around its center
 * @param node - DOM element to animate
 * @param seconds - Duration of one full rotation
 * @returns AnimationControls to manage the animation
 */
export function spin(node: Element, seconds: number): AnimationControls {
  return animate(
    node,
    { rotate: [0, 360] },
    {
      duration: seconds,
      easing: 'linear',
      repeat: Infinity,
    }
  );
}

/**
 * Changes the spin speed of an element without stuttering
 * @param controls - Existing animation controls
 * @param node - DOM element being animated
 * @param seconds - New duration for one full rotation
 * @returns New AnimationControls
 */
export function spinToSpeed(
  controls: AnimationControls | null,
  node: Element,
  seconds: number
): AnimationControls {
  if (controls) {
    controls.stop();
  }
  return spin(node, seconds);
}

/**
 * Creates a wobble/precession effect on the azimuth
 * @param node - DOM element to animate
 * @param seconds - Duration of one wobble cycle
 * @returns AnimationControls to manage the animation
 */
export function wobble(node: Element, seconds: number): AnimationControls {
  return animate(
    node,
    { rotate: [-3, 0, 3, 0] },
    {
      duration: seconds,
      easing: 'ease-in-out',
      repeat: Infinity,
    }
  );
}

/**
 * Rotates element to a specific angle with easing
 * @param node - DOM element to animate
 * @param angle - Target angle in degrees
 * @param seconds - Duration of animation
 * @returns AnimationControls
 */
export function rotateTo(
  node: Element,
  angle: number,
  seconds: number = 0.3
): AnimationControls {
  return animate(
    node,
    { rotate: angle },
    {
      duration: seconds,
      easing: 'ease-out',
    }
  );
}
