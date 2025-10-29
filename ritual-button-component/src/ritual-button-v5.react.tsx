import { useEffect, useRef } from 'react';
import { RitualButtonV5 } from './ritual-button-v5.js';
import type { RitualButtonReactProps } from './types.js';

interface RitualButtonV5ReactProps extends RitualButtonReactProps {
  animationDuration?: number;
  circleScaleDuration?: number;
  orbitShowDelay?: number;
  labelShowDelay?: number;
  orbitRotationSec?: number;
  orbitHoverRotationSec?: number;
}

/**
 * React wrapper component for RitualButtonV5 (Single gradient orbit with entrance animation)
 * Can be used in Astro with client directives or in pure React apps
 */
export default function RitualButtonV5React(props: RitualButtonV5ReactProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<RitualButtonV5 | null>(null);

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
    const instance = new RitualButtonV5(nativeProps);
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
    props.circleScaleDuration,
    props.orbitShowDelay,
    props.labelShowDelay,
    props.orbitRotationSec,
    props.orbitHoverRotationSec,
    props.ariaLabel,
  ]);

  return <div ref={containerRef} />;
}
