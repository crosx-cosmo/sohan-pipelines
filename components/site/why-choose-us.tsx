'use client';

import { motion } from 'motion/react';
import { fadeInUp, staggerContainer } from '@/components/site/motion';
import { whyChooseUs } from '@/lib/data';
import { ServiceIcon } from '@/components/site/service-icon';
import { Card, CardContent } from '@/components/ui/card';

export function WhyChooseUsSection() {
  return (
    <section className="section-py">
      <div className="container-px mx-auto max-w-7xl">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-3.5 py-1 text-sm font-medium text-primary">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The SOHAN PIPELINES Difference
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            We have built our reputation on honesty, quality, and respect for your home. Here is what sets us apart.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {whyChooseUs.map((item) => (
            <motion.div key={item.title} variants={fadeInUp}>
              <Card className="card-hover h-full border-border/50 hover:border-primary/30 hover:premium-shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-[background-color,color] duration-300 hover:bg-primary hover:text-primary-foreground">
                    <ServiceIcon name={item.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
