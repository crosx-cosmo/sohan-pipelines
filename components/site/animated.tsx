'use client';

import { motion } from 'motion/react';
import { fadeInUp, staggerContainer } from '@/components/site/motion';
import type { Variants } from 'motion/react';

type AnimatedDivProps = {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  as?: 'div' | 'section';
};

export function AnimatedDiv({
  children,
  className,
  variants = fadeInUp,
}: AnimatedDivProps) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedStagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeInUp}>
      {children}
    </motion.div>
  );
}
