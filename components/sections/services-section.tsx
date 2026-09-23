'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { services, categoryLabels, type Category } from '@/lib/services';
import { cn } from '@/lib/utils';

const categories: Category[] = ['all', 'residential', 'commercial', 'emergency', 'installation', 'maintenance'];

export function ServicesSection() {
  const [activeCategory, setActiveCategory] = React.useState<Category>('all');

  const filtered = React.useMemo(() => {
    if (activeCategory === 'all') return services;
    return services.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as Category)} className="mb-10">
          <div className="flex justify-center overflow-x-auto pb-2">
            <TabsList className="flex flex-wrap h-auto p-1.5 gap-1">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="px-4 py-2 text-sm whitespace-nowrap"
                >
                  {categoryLabels[cat]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service, i) => (
            <Card
              key={service.id}
              className={cn(
                'group relative overflow-hidden border-border/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 animate-fade-in-up',
                service.popular && 'ring-2 ring-primary/30'
              )}
              style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
            >
              {service.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  Popular
                </div>
              )}
              <CardHeader>
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary transition-transform group-hover:scale-110 group-hover:rotate-3">
                    <service.icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-display leading-tight">
                      {service.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{service.duration}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-0">
                <div>
                  <span className="text-xs text-muted-foreground">Starting from</span>
                  <p className="text-lg font-bold font-display">
                    Rs {service.startingPrice}
                  </p>
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="group/btn"
                >
                  <Link href="/book">
                    Book
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Don't see what you need? We handle all types of plumbing work.
          </p>
          <Button asChild variant="outline">
            <Link href="/contact">Contact Us for Custom Jobs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
