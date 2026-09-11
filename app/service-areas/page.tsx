import { PageHeader } from '@/components/site/page-header';
import { CTASection } from '@/components/site/cta-section';
import { Card, CardContent } from '@/components/ui/card';
import { groupedServiceAreas, siteConfig } from '@/lib/data';
import { MapPin, CheckCircle2 } from 'lucide-react';
import { AnimatedDiv, AnimatedStagger, AnimatedItem } from '@/components/site/animated';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Service Areas — West Bengal Plumbing Coverage',
  description:
    'SOHAN PIPELINES serves locations across West Bengal including Kolkata, Howrah, Bardhaman, Paschim Medinipur, Purba Medinipur, Jhargram, Bankura, Purulia, Birbhum, Nadia, Murshidabad, Malda, Darjeeling, Jalpaiguri, Alipurduar and Cooch Behar. Check if we serve your area.',
  alternates: { canonical: '/service-areas' },
};

export default function ServiceAreasPage() {
  return (
    <>
      <PageHeader
        title="Service Areas"
        badge="Where We Work"
        description={`We proudly serve ${groupedServiceAreas.length} cities and towns across West Bengal. If your area is listed below, we can be at your door — often within the hour.`}
      />

      <section className="section-py">
        <div className="container-px mx-auto max-w-7xl">
          {/* Map placeholder */}
          <AnimatedDiv className="mb-12 overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 p-8 text-center premium-shadow-sm sm:p-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <MapPin className="h-8 w-8" />
            </div>
            <h2 className="mb-2 font-display text-2xl font-bold tracking-tight text-foreground">
              Serving the Entire West Bengal Region
            </h2>
            <p className="mx-auto max-w-xl leading-relaxed text-muted-foreground">
              Based in {siteConfig.address.city}, {siteConfig.address.state}, our fleet
              of fully stocked service vehicles covers the entire region — from{' '}
              {groupedServiceAreas[0].name} to {groupedServiceAreas[groupedServiceAreas.length - 1].name}.
            </p>
          </AnimatedDiv>

          {/* Areas grid */}
          <AnimatedStagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {groupedServiceAreas.map((area) => (
              <AnimatedItem key={area.name}>
                <Card className="card-hover h-full border-border/50 transition-[border-color,box-shadow,transform] duration-200 hover:border-primary/30 hover:premium-shadow-lg hover:-translate-y-1">
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <h3 className="font-display text-base font-semibold text-foreground">
                        {area.name}
                      </h3>
                    </div>
                    <ul className="flex flex-wrap gap-1.5">
                      {area.zipCodes.map((zip) => (
                        <li
                          key={zip}
                          className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {zip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedItem>
            ))}
          </AnimatedStagger>

          {/* Not sure callout */}
          <AnimatedDiv className="mt-12 flex items-center justify-center gap-3 rounded-xl border border-border/50 bg-secondary/30 p-6 text-center">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Don&apos;t see your city? Give us a call — we are expanding our service
              area and may already cover your neighborhood.
            </p>
          </AnimatedDiv>
        </div>
      </section>

      <CTASection
        title="Ready to Book Your Service?"
        description="Select your service, pick a time, and we will handle the rest. Same-day appointments available in most areas."
      />
    </>
  );
}
