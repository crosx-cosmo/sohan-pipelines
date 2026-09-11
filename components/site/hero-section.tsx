'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { fadeInUp, staggerContainer, scaleIn } from '@/components/site/motion';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/data';
import { Phone, ArrowRight, Star, ShieldCheck, Clock, BadgeCheck } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden hero-gradient">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-accent blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-white blur-3xl" />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Animated glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-accent/20 blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute left-1/4 bottom-1/4 h-80 w-80 rounded-full bg-primary/20 blur-[120px]"
      />

      <div className="container-px relative z-10 mx-auto max-w-7xl py-16 sm:py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Rating badge */}
            <motion.div
              variants={fadeInUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm ring-1 ring-white/20"
            >
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
              <span className="text-sm font-medium text-white">
                {siteConfig.rating} &middot; {siteConfig.reviewCount.toLocaleString()} reviews
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Premium Plumbing You Can Trust
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-5 max-w-xl text-lg leading-relaxed text-white/80 lg:text-xl"
            >
              {siteConfig.tagline}. We deliver fast, reliable, and upfront-priced plumbing services for homes and businesses across West Bengal and surrounding regions.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Link href="/book">
                <Button size="lg" variant="secondary" className="w-full gap-2 sm:w-auto">
                  Book a Plumber
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href={siteConfig.phoneHref}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  <Phone className="h-4 w-4" />
                  Call {siteConfig.phone}
                </Button>
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white/70 lg:justify-start"
            >
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {siteConfig.responseTime}
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                {siteConfig.insurance}
              </span>
              <span className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4" />
                {siteConfig.yearsInBusiness} years experience
              </span>
            </motion.div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl premium-shadow-xl ring-1 ring-white/20">
              <Image
                src="https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&w=940"
                alt="Professional plumber installing pipes"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
            </div>

            {/* Floating card — Jobs completed */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute -bottom-6 -left-6 rounded-xl border border-border bg-card p-4 premium-shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 text-success">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-foreground">
                    {siteConfig.jobsCompleted.toLocaleString()}+
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Jobs Completed
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating card — Response time */}
            <motion.div
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute -top-6 -right-6 rounded-xl border border-border bg-card p-4 premium-shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-foreground">
                    45<span className="text-base font-semibold">min</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avg Response
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="relative">
        <svg
          className="block w-full"
          viewBox="0 0 1440 80"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 80L1440 80L1440 40C1440 40 1080 0 720 0C360 0 0 40 0 40L0 80Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}
