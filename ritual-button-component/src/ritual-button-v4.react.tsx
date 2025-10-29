import { useEffect, useRef } from 'react';
import { RitualButtonV4 } from './ritual-button-v4.js';
import type { RitualButtonReactProps } from './types.js';

/**
 * React wrapper component for RitualButtonV4 (3D Sphere with orbiting dots)
 * Can be used in Astro with client directives or in pure React apps
 */
export default function RitualButtonV4React(props: RitualButtonReactProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<RitualButtonV4 | null>(null);

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
    const instance = new RitualButtonV4(nativeProps);
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
    props.strokeColor,
    props.rotationSec,
    props.hoverRotationSec,
    props.ariaLabel,
  ]);

  return <div ref={containerRef} />;
}
