import type { Variants } from 'motion/react';

/**
 * Sohan Pipelines — Calibrated Motion System
 */
export const luxuryEasing = [0.16, 1, 0.3, 1] as const;
export const gentleEasing = [0.22, 1, 0.36, 1] as const;

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: luxuryEasing },
  },
};

export const sectionRevealVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.52,
      ease: luxuryEasing,
      staggerChildren: 0.055,
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
};

export const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: luxuryEasing },
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
