'use client';

import { motion } from 'motion/react';
import { fadeInUp, staggerContainer } from '@/components/site/motion';
import { stats } from '@/lib/data';
import { ServiceIcon } from '@/components/site/service-icon';

export function StatsBar() {
  return (
    <section className="relative border-y border-border bg-foreground py-16 dark:bg-foreground/95">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
      {/* Decorative orbs */}
      <div className="absolute left-1/4 top-0 h-48 w-48 rounded-full bg-primary/10 blur-[80px]" />
      <div className="absolute right-1/4 bottom-0 h-48 w-48 rounded-full bg-accent/10 blur-[80px]" />

      <div className="container-px relative z-10 mx-auto max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 gap-6 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="group flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent ring-1 ring-accent/20 transition-[background-color,transform] duration-300 group-hover:scale-110 group-hover:bg-accent/20">
                <ServiceIcon name={stat.icon} className="h-7 w-7" />
              </div>
              <div className="font-display text-4xl font-bold tracking-tight text-background sm:text-5xl">
                {stat.value}
              </div>
              <div className="mt-1.5 text-sm font-medium text-background/70">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
