'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { fadeInUp, staggerContainer } from '@/components/site/motion';
import { services } from '@/lib/data';
import { ServiceIcon } from '@/components/site/service-icon';
import { Card, CardContent } from '@/components/ui/card';

export function ServicesGrid() {
  return (
    <section className="section-py">
      <div className="container-px mx-auto max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service) => (
            <motion.div key={service.slug} variants={fadeInUp}>
              <Link href={`/services/${service.slug}`} className="group block h-full">
                <Card className="card-hover h-full overflow-hidden border-border/50 hover:border-primary/30 hover:premium-shadow-lg hover:-translate-y-1">
                  {/* Top accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-[background-color,color,transform] duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                      <ServiceIcon name={service.icon} className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                      {service.shortTitle}
                    </h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {service.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        {service.priceFrom}
                      </span>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-primary transition-[gap,color] duration-200 group-hover:gap-2.5">
                        Learn more
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function ServicesGridSection() {
  return (
    <section className="section-py bg-secondary/30">
      <div className="container-px mx-auto max-w-7xl">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-3.5 py-1 text-sm font-medium text-primary">
            Our Services
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Complete Plumbing Solutions
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            From emergency repairs to full installations, our certified plumbers handle every aspect of your plumbing system with expertise and care.
          </p>
        </motion.div>
        <ServicesGrid />
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link href="/services">
            <Button size="lg" variant="outline">
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
