import Link from 'next/link';
import { ArrowRight, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { testimonials, businessInfo } from '@/lib/business-info';

export function HomeReviewsPreview() {
  const preview = testimonials.slice(0, 3);

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary mb-4">
              <Star className="h-3 w-3 fill-current" />
              {businessInfo.rating} Rating · {businessInfo.reviewCount} Reviews
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              What Our Customers Say
            </h2>
          </div>
          <Button asChild variant="outline" size="sm" className="self-start sm:self-auto shrink-0">
            <Link href="/reviews">
              Read All Reviews
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {preview.map((testimonial, i) => (
            <Card
              key={testimonial.name}
              className="border-border/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'both' }}
            >
              <CardContent className="pt-6">
                <Quote className="h-7 w-7 text-primary/20 mb-3" />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground mb-5 line-clamp-4">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-xs">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
