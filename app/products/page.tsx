import { PageHeader } from '@/components/site/page-header';
import { CTASection } from '@/components/site/cta-section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/data';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AnimatedDiv, AnimatedStagger, AnimatedItem } from '@/components/site/animated';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plumbing Parts & Products — Water Heaters, Fixtures, Smart Home',
  description:
    'Premium plumbing products and parts: hybrid and tankless water heaters, smart faucets, toilets, garbage disposals, water filtration systems, and leak detection devices — professionally installed.',
  alternates: { canonical: '/products' },
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        title="Plumbing Parts & Products"
        badge="Quality You Can Trust"
        description="We install and service premium plumbing products from the industry's most trusted brands. Every product is backed by manufacturer warranties and our own workmanship guarantee."
      />

      <section className="section-py">
        <div className="container-px mx-auto max-w-7xl">
          <AnimatedStagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <AnimatedItem key={product.slug}>
                <Card className="group flex h-full flex-col overflow-hidden border-border/50 transition-[border-color,box-shadow,transform] duration-300 ease-premium hover:border-primary/30 hover:premium-shadow-lg hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    {product.badge && (
                      <div className="absolute left-3 top-3 z-10">
                        <Badge className="bg-primary text-primary-foreground premium-shadow-sm">
                          {product.badge}
                        </Badge>
                      </div>
                    )}
                    <div className="flex h-full items-center justify-center p-8 transition-transform duration-300 ease-premium group-hover:scale-105">
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                          <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {product.brand}
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="flex flex-1 flex-col p-6">
                    <div className="mb-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-primary">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                      {product.name}
                    </h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                    <ul className="mb-4 space-y-1.5">
                      {product.features.slice(0, 3).map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between border-t border-border/50 pt-4">
                      <span className="font-display text-lg font-bold text-foreground">
                        {product.price}
                      </span>
                      <Link href="/book">
                        <Button size="sm" variant="outline" className="gap-1.5">
                          Get Quote
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedItem>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      <CTASection
        title="Need a Product Not Listed Here?"
        description="We source and install products from all major plumbing manufacturers. Tell us what you need and we will make it happen."
      />
    </>
  );
}
