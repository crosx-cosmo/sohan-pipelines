'use client';

import { motion } from 'motion/react';
import { fadeInUp, staggerContainer } from '@/components/site/motion';
import { processSteps } from '@/lib/data';
import { ServiceIcon } from '@/components/site/service-icon';

export function ProcessSection() {
  return (
    <section className="section-py bg-secondary/30">
      <div className="container-px mx-auto max-w-7xl">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-3.5 py-1 text-sm font-medium text-primary">
            How It Works
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, Stress-Free Process
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            From the first call to the final cleanup, we make plumbing service straightforward and transparent.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Animated connecting line for desktop */}
          <div className="absolute top-8 left-[12.5%] right-[12.5%] hidden h-px lg:block">
            <div className="h-full w-full bg-border" />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
              className="absolute inset-0 h-px origin-left bg-gradient-to-r from-primary via-accent to-primary"
            />
          </div>

          {processSteps.map((step) => (
            <motion.div key={step.number} variants={fadeInUp} className="relative">
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground premium-shadow-lg ring-1 ring-primary/20 transition-transform duration-300 hover:scale-105">
                  <ServiceIcon name={step.icon} className="h-7 w-7" />
                </div>
                <span className="absolute -top-2 right-1/2 translate-x-10 font-display text-5xl font-bold text-primary/10">
                  {step.number}
                </span>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
