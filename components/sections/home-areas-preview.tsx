import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { businessInfo } from '@/lib/business-info';

export function HomeAreasPreview() {
  return (
    <section className="py-20 lg:py-28 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary mb-4">
              Service Areas
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              Areas We Serve
            </h2>
            <p className="mt-4 text-muted-foreground">
              Based in Keshrambha, Dantan — covering Midnapore and surrounding regions.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="self-start sm:self-auto shrink-0">
            <Link href="/service-areas">
              View All Areas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {businessInfo.serviceAreas.map((area, i) => (
            <div
              key={area}
              className="flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm font-medium transition-all hover:border-primary/30 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'both' }}
            >
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              {area}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
