import { useEffect, useRef } from 'react';
import { RitualButtonV2 } from './ritual-button-v2.js';
import type { RitualButtonReactProps } from './types.js';

/**
 * React wrapper component for RitualButtonV2 (Canvas-based)
 * Can be used in Astro with client directives or in pure React apps
 */
export default function RitualButtonV2React(props: RitualButtonReactProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<RitualButtonV2 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Convert React onClick to native onClick
    const nativeProps = {
      ...props,
      onClick: props.onClick
        ? (ev: MouseEvent) => {
            props.onClick?.(ev as any);
          }
        : undefined,
    };

    // Create instance
    const instance = new RitualButtonV2(nativeProps);
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
