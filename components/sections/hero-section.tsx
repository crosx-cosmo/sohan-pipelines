'use client';

import Link from 'next/link';
import { ArrowRight, Phone, Star, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { businessInfo } from '@/lib/business-info';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-accent/5 to-transparent" />
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />
        <div className="absolute top-40 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{businessInfo.rating} rating</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{businessInfo.reviewCount} reviews</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-[1.1]">
              Total Plumbing{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Solutions
              </span>{' '}
              You Can Trust
            </h1>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
              From pipe fitting to bathroom installation, drainage cleaning to
              emergency repairs — we handle all your plumbing needs across
              Midnapore and nearby areas with honesty and expertise.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="font-semibold shadow-lg shadow-primary/20 group">
                <Link href="/book">
                  Book a Service
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={`tel:${businessInfo.phone}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </a>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4 text-success" />
                Licensed & Experienced
              </span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Fair Pricing
              </span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Service Warranty
              </span>
            </div>
          </div>

          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/15 via-accent/10 to-secondary">
                <div className="flex h-full items-center justify-center p-8">
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    {[
                      { icon: '🔧', label: 'Pipe Repair', color: 'from-blue-500/20 to-blue-600/10' },
                      { icon: '🚿', label: 'Bathroom Fitting', color: 'from-cyan-500/20 to-cyan-600/10' },
                      { icon: '🛁', label: 'Drainage', color: 'from-teal-500/20 to-teal-600/10' },
                      { icon: '⚠️', label: 'Emergency', color: 'from-orange-500/20 to-red-600/10' },
                    ].map((item, i) => (
                      <div
                        key={item.label}
                        className={`flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br ${item.color} p-6 border border-border/30 animate-float`}
                        style={{ animationDelay: `${i * 0.5}s` }}
                      >
                        <span className="text-3xl">{item.icon}</span>
                        <span className="text-xs font-semibold text-center">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/95 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Trusted by 500+ customers
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 rounded-2xl glass-card p-4 shadow-xl animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/15 text-success">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Same Day</p>
                  <p className="text-xs text-muted-foreground">Service Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
