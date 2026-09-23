import { MapPin, Navigation } from 'lucide-react';
import { businessInfo } from '@/lib/business-info';

export function ServiceAreasSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {Object.entries(businessInfo.serviceDistricts).map(([district, areas], di) => (
          <div key={district} className={di > 0 ? 'mt-12' : ''}>
            <div className="flex items-center gap-2 mb-6">
              <Navigation className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold tracking-tight">{district}</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {areas.map((area, i) => (
                <div
                  key={area}
                  className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card px-4 py-3.5 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 animate-fade-in-up"
                  style={{ animationDelay: `${(di * 5 + i) * 0.05}s`, animationFillMode: 'both' }}
                >
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-medium">{area}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>Base: {businessInfo.address}, {businessInfo.area}</span>
        </div>
      </div>
    </section>
  );
}
