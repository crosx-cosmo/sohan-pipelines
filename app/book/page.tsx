import { PageHeader } from '@/components/site/page-header';
import { BookingForm } from '@/components/site/booking-form';
import { LocalBusinessJsonLd } from '@/components/site/json-ld';
import { siteConfig } from '@/lib/data';
import { Phone, Clock, ShieldCheck, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a Plumber — Schedule Your Plumbing Service',
  description:
    'Book a plumber online in under 2 minutes. Same-day service available. Choose your service, tell us when, and we will confirm your appointment within 30 minutes.',
  alternates: { canonical: '/book' },
};

export default function BookPage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <PageHeader
        title="Book a Plumber"
        badge="Schedule Online"
        description="Book your plumbing service in under 2 minutes. Same-day appointments available in most areas. We will call to confirm within 30 minutes."
      />

      <section className="section-py">
        <div className="container-px mx-auto max-w-3xl">
          {/* Quick reassurance bar */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: Clock, label: '30-min confirmation' },
              { icon: ShieldCheck, label: 'Upfront pricing' },
              { icon: BadgeCheck, label: 'Licensed & insured' },
            ].map((item) => (
              <div
                key={item.label}
                className="card-hover flex items-center gap-2 rounded-lg border border-border/50 bg-card px-4 py-3 transition-[border-color,box-shadow] duration-200 hover:border-primary/30 hover:premium-shadow-sm"
              >
                <item.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Booking form */}
          <div className="rounded-2xl border border-border/50 bg-card p-6 premium-shadow-sm sm:p-8">
            <BookingForm />
          </div>

          {/* Emergency callout */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">
                  Plumbing Emergency?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Skip the form and call us directly for immediate dispatch.
                </p>
              </div>
            </div>
            <a href={siteConfig.phoneHref}>
              <Button variant="destructive" className="gap-2">
                <Phone className="h-4 w-4" />
                {siteConfig.phone}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
