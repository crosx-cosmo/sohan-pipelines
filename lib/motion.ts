import type { Variants } from 'motion/react';

/**
 * Sohan Pipelines — Calibrated Motion System
 */
export const luxuryEasing = [0.16, 1, 0.3, 1] as const;
export const gentleEasing = [0.22, 1, 0.36, 1] as const;

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: luxuryEasing },
  },
};

export const drawerSlideVariants: Variants = {
  hidden: {
    x: '100%',
    transition: {
      duration: 0.28,
      ease: [0.32, 0, 0.67, 0],
    },
  },
  visible: {
    x: 0,
    transition: {
      duration: 0.34,
      ease: luxuryEasing,
    },
  },
};

export const drawerBackdropVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.24, ease: 'easeOut' },
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.28, ease: 'easeIn' },
  },
};

