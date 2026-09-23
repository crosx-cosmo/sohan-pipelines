'use client';

import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { businessInfo } from '@/lib/business-info';

export function CtaSection() {
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-8 sm:p-12 lg:p-16 text-center text-primary-foreground shadow-2xl shadow-primary/20">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 h-40 w-40 rounded-full bg-white blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-white blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
          </div>
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
              Got a Plumbing Problem? We Fix It Today.
            </h2>
            <p className="mt-4 text-primary-foreground/90 text-lg max-w-2xl mx-auto">
              Do not let leaks, blockages, or broken pipes ruin your day. Book a service
              now or call us for assistance.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" variant="secondary" className="font-semibold group">
                <Link href="/book">
                  Book a Service
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" className="font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <a href={`tel:${businessInfo.phone}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  {businessInfo.phoneDisplay}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
