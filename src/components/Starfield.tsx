import { useEffect, useRef, useState } from 'react';

interface StarfieldProps {
  /** Base speed in pixels per second (default: 20) */
  baseSpeed?: number;
  /** Number of stars to render (default: 100) */
  starCount?: number;
  /** Trigger speed boost (accelerate then return to base) */
  speedBoost?: number;
}

export default function Starfield({
  baseSpeed = 20,
  starCount = 100,
  speedBoost = 0
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSpeed, setCurrentSpeed] = useState(baseSpeed);
  const starsRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    opacity: number;
    targetOpacity: number;
    speedMultiplier: number;
    flickerSpeed: number;
  }>>([]);
  const animationFrameRef = useRef<number>();

  // Initialize stars with depth-based speed and flicker
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stars = [];
    for (let i = 0; i < starCount; i++) {
      const size = Math.random() * 2 + 0.5;
      // Smaller stars = farther away = slower (0.3x to 1.0x of base speed)
      const speedMultiplier = 0.3 + (size / 2.5) * 0.7;

      // Each star has its own flicker rhythm (very slow, 2-6 seconds per cycle)
      const flickerSpeed = 0.0003 + Math.random() * 0.0007; // Random speed for natural effect
      const baseOpacity = 0.5 + Math.random() * 0.3; // 0.5-0.8 base opacity

      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: size,
        opacity: baseOpacity,
        targetOpacity: baseOpacity,
        speedMultiplier: speedMultiplier,
        flickerSpeed: flickerSpeed
      });
    }
    starsRef.current = stars;
  }, [starCount]);

  // Handle speed boost with immediate ease-out
  useEffect(() => {
    if (speedBoost > 0) {
      const boostSpeed = baseSpeed * 9;
      const easeDuration = 1200; // Ease back to base over 1.2s

      // Immediately boost speed
      setCurrentSpeed(boostSpeed);

      // Start easing out immediately
      const startTime = performance.now();
      const startSpeed = boostSpeed;
      const speedDelta = boostSpeed - baseSpeed;

      const easeOut = (t: number) => {
        // Cubic ease-out: 1 - (1-t)^3
        return 1 - Math.pow(1 - t, 3);
      };

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / easeDuration, 1);

        // Apply ease-out to the speed transition
        const easedProgress = easeOut(progress);
        const newSpeed = startSpeed - (speedDelta * easedProgress);

        setCurrentSpeed(newSpeed);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Ensure we end exactly at base speed
          setCurrentSpeed(baseSpeed);
        }
      };

      const animationId = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(animationId);
    } else {
      setCurrentSpeed(baseSpeed);
    }
  }, [speedBoost, baseSpeed]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Disable image smoothing for crisp rendering
    ctx.imageSmoothingEnabled = false;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      starsRef.current.forEach((star) => {
        // Move star upward based on current speed and its depth multiplier
        star.y -= currentSpeed * star.speedMultiplier * deltaTime;

        // Wrap around when star goes off top
        if (star.y < -10) {
          star.y = canvas.height + 10;
          star.x = Math.random() * canvas.width;
        }

        // Update flicker: slowly change target opacity to create subtle twinkle
        // Each star updates at its own pace
        star.targetOpacity = 0.5 + Math.sin(performance.now() * star.flickerSpeed) * 0.25;

        // Smoothly interpolate current opacity towards target (no abrupt changes)
        star.opacity += (star.targetOpacity - star.opacity) * 0.05;

        // Draw star with crisp edges (no blur/shadow)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentSpeed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
