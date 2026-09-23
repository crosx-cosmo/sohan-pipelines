import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { services } from '@/lib/services';

export function HomeServicesPreview() {
  const featured = services.filter((s) => s.popular).slice(0, 3);
  const rest = services.filter((s) => !s.popular).slice(0, 3);
  const preview = [...featured, ...rest].slice(0, 6);

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary mb-4">
              Our Services
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              Complete Plumbing Services for Every Need
            </h2>
          </div>
          <Button asChild variant="outline" size="sm" className="self-start sm:self-auto shrink-0">
            <Link href="/services">
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((service, i) => (
            <Card
              key={service.id}
              className="group border-border/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    <service.icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-sm leading-tight">
                      {service.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{service.duration}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Rs {service.startingPrice}</span>
                  <ul className="flex gap-1">
                    {service.features.slice(0, 2).map((f) => (
                      <li key={f} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Check className="h-3 w-3 text-success" />
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/book">
              Book a Service
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
