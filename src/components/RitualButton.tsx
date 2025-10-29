import { useEffect, useRef } from 'react';
import { RitualButtonV6 } from './ritual-button-v6';
import type { RitualButtonReactProps } from './ritual-button-types';

/**
 * React wrapper component for RitualButtonV6 (Simplified single orbit)
 * Can be used in Astro with client directives or in pure React apps
 */
export default function RitualButtonV6React(props: RitualButtonReactProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<RitualButtonV6 | null>(null);

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
    const instance = new RitualButtonV6(nativeProps);
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
