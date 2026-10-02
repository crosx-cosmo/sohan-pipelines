import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { businessInfo } from '@/lib/business-info';

export function ContactSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <MessageCircle className="h-3.5 w-3.5" />
              Get in Touch
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              Need a Plumber? Contact Us.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Whether it is an emergency or a planned service, we are here to help.
              Reach out through any of the channels below.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href={`tel:${businessInfo.phone}`}
                className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <Phone className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Call us</p>
                  <p className="font-display font-bold text-lg">{businessInfo.phoneDisplay}</p>
                </div>
              </a>

              <a
                href={`mailto:${businessInfo.email}`}
                className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform group-hover:scale-110">
                  <Mail className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Email us</p>
                  <p className="font-display font-bold text-lg">{businessInfo.email}</p>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <MapPin className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Visit us</p>
                  <p className="font-display font-bold text-lg">{businessInfo.address}</p>
                  <p className="text-sm text-muted-foreground">{businessInfo.area}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <Link href="/book">
                  Book a Service
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a href={`https://wa.me/${businessInfo.phone.replace(/\D/g, '')}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-gradient-to-br from-primary to-accent p-8 text-primary-foreground shadow-xl shadow-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6" />
                <h3 className="font-display text-xl font-bold">Working Hours</h3>
              </div>
              <p className="text-primary-foreground/90 text-lg">{businessInfo.hours}</p>
              <p className="text-primary-foreground/70 text-sm mt-1">{businessInfo.hoursDays}</p>
              <p className="text-primary-foreground/70 text-sm mt-1">Sunday: {businessInfo.sundayHours}</p>

              <div className="mt-6 pt-6 border-t border-primary-foreground/20">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5" />
                  <h4 className="font-display font-bold text-sm">Emergency Visits</h4>
                </div>
                <p className="text-primary-foreground/80 text-sm">
                  {businessInfo.emergencyNote}. Call us and we will try to help.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-6">
              <h4 className="font-display font-semibold mb-3">Quick Response Promise</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Call answered within 3 rings
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Same-day visit when available
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Free consultation and price estimate
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Service warranty on all work
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
