'use client';

import { motion } from 'motion/react';
import { fadeInUp, staggerContainer } from '@/components/site/motion';
import { reviews, siteConfig } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

export function ReviewsSection() {
  const displayed = reviews.slice(0, 6);

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
            Customer Reviews
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Thousands of Homeowners
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-warning text-warning" />
              ))}
            </div>
            <span className="text-lg font-semibold text-foreground">
              {siteConfig.rating}/5
            </span>
            <span className="text-muted-foreground">
              from {siteConfig.reviewCount.toLocaleString()} reviews
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {displayed.map((review) => (
            <motion.div key={review.name} variants={fadeInUp}>
              <Card className="card-hover h-full overflow-hidden border-border/50 hover:border-primary/30 hover:premium-shadow-lg hover:-translate-y-1">
                {/* Quote accent */}
                <div className="relative h-16 bg-gradient-to-br from-primary/5 to-accent/5">
                  <Quote className="absolute bottom-2 left-5 h-10 w-10 text-primary/15" />
                </div>
                <CardContent className="flex h-full flex-col p-6 pt-4">
                  <div className="mb-3 flex">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t border-border/50 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground">
                      {review.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {review.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {review.location} &middot; {review.service}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
