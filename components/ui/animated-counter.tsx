'use client';

import * as React from 'react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  durationMs?: number;
  className?: string;
}

/**
 * Smooth ease-out numerical counter that triggers once when scrolled into view.
 * Uses tabular-nums to prevent horizontal layout jitter during counting.
 */
export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  durationMs = 950,
  className,
}: AnimatedCounterProps) {
  const spanRef = React.useRef<HTMLSpanElement | null>(null);
  const [displayValue, setDisplayValue] = React.useState<number>(value);
  const hasAnimatedRef = React.useRef(false);

  React.useEffect(() => {
    const el = spanRef.current;
    if (!el || hasAnimatedRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) {
      hasAnimatedRef.current = true;
      return;
    }

    let rafId = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;
        observer.disconnect();

        const startTime = performance.now();
        const startVal = 0;

        const step = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / durationMs);
          // Ease-out exponential deceleration curve
          const eased = 1 - Math.pow(1 - progress, 3.6);
          const current = startVal + (value - startVal) * eased;
          setDisplayValue(current);

          if (progress < 1) {
            rafId = window.requestAnimationFrame(step);
          } else {
            setDisplayValue(value);
          }
        };

        rafId = window.requestAnimationFrame(step);
      },
      { threshold: 0.25, rootMargin: '0px 0px -24px 0px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [value, durationMs]);

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toString();

  return (
    <span ref={spanRef} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
