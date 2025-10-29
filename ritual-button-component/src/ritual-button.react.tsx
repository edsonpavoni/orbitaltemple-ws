import { useEffect, useRef } from 'react';
import { RitualButton } from './ritual-button.js';
import type { RitualButtonReactProps } from './types.js';

/**
 * React wrapper component for RitualButton
 * Can be used in Astro with client directives or in pure React apps
 */
export default function RitualButtonReact(props: RitualButtonReactProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<RitualButton | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Convert React onClick to native onClick
    const nativeProps = {
      ...props,
      onClick: props.onClick
        ? (ev: MouseEvent) => {
            // Convert native MouseEvent to React synthetic event
            props.onClick?.(ev as any);
          }
        : undefined,
    };

    // Create instance
    const instance = new RitualButton(nativeProps);
    instanceRef.current = instance;

    // Mount to container
    containerRef.current.appendChild(instance.getElement());

    // Cleanup
    return () => {
      instance.destroy();
      instanceRef.current = null;
    };
  }, []); // Only create once

  // Update props when they change
  useEffect(() => {
    if (!instanceRef.current) return;

    const {
      onClick, // Exclude onClick from update
      ...updateableProps
    } = props;

    instanceRef.current.update(updateableProps);
  }, [
    props.label,
    props.size,
    props.ringRx,
    props.ringRy,
    props.ringAzimuthDeg,
    props.strokeColor,
    props.strokeWidth,
    props.diskColor,
    props.textColor,
    props.rotationSec,
    props.hoverRotationSec,
    props.easing,
    props.wobble,
    props.wobbleSec,
    props.shadow,
    props.ariaLabel,
  ]);

  return <div ref={containerRef} />;
}
