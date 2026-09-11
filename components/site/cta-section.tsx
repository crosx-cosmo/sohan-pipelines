'use client';

import Link from 'next/link';
import { Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { fadeInUp } from '@/components/site/motion';
import { siteConfig } from '@/lib/data';

type CTASectionProps = {
  title?: string;
  description?: string;
  showPhone?: boolean;
};

export function CTASection({
  title = 'Ready to Fix Your Plumbing Problem?',
  description = 'Book online in under 2 minutes or call us now. Same-day service available for most areas.',
  showPhone = true,
}: CTASectionProps) {
  return (
    <section className="section-py">
      <div className="container-px mx-auto max-w-5xl">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-16 text-center premium-shadow-xl sm:px-12 dark:bg-foreground/95"
        >
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-primary/40" />
          {/* Animated decorative orbs */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

          <div className="relative z-10">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-background sm:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-background/80">
              {description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/book">
                <Button size="lg" variant="secondary" className="w-full gap-2 sm:w-auto">
                  Book a Plumber
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              {showPhone && (
                <a href={siteConfig.phoneHref}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full gap-2 border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background sm:w-auto"
                  >
                    <Phone className="h-4 w-4" />
                    Call {siteConfig.phone}
                  </Button>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
