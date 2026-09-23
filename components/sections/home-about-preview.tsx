import Link from 'next/link';
import { ArrowRight, Users, Wrench, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { businessInfo } from '@/lib/business-info';

const stats = [
  { icon: Users, value: '500+', label: 'Happy Customers' },
  { icon: Wrench, value: '12+', label: 'Service Types' },
  { icon: Star, value: `${businessInfo.rating}`, label: 'Customer Rating' },
  { icon: Award, value: `${new Date().getFullYear() - businessInfo.established}+`, label: 'Years Experience' },
];

export function HomeAboutPreview() {
  return (
    <section className="py-20 lg:py-28 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary mb-4">
              About Us
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              {new Date().getFullYear() - businessInfo.established} Years of Trusted Plumbing in Midnapore
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              {businessInfo.name} has been serving the people of Midnapore, Dantan, and
              surrounding areas with reliable plumbing services. From small household
              repairs to large commercial installations, we bring the same level of
              dedication and quality to every project.
            </p>
            <div className="mt-8">
              <Button asChild variant="outline">
                <Link href="/about">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'both' }}
              >
                <span className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <stat.icon className="h-6 w-6" />
                </span>
                <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
