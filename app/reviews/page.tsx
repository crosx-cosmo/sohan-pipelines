import { PageHeader } from '@/components/site/page-header';
import { CTASection } from '@/components/site/cta-section';
import { reviews, siteConfig } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { AnimatedDiv, AnimatedStagger, AnimatedItem } from '@/components/site/animated';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Reviews — See What Our Clients Say',
  description:
    'Read real reviews from SOHAN PIPELINES customers. Over 2,100 five-star reviews and a 4.9-star rating. See why homeowners across West Bengal trust us with their plumbing.',
  alternates: { canonical: '/reviews' },
};

export default function ReviewsPage() {
  return (
    <>
      <PageHeader
        title="Customer Reviews"
        badge="Testimonials"
        description="We do not just say we are good — our customers do. Read what real homeowners and businesses across West Bengal have to say about their experience with SOHAN PIPELINES."
      />

      {/* Rating summary */}
      <section className="relative border-b border-border bg-secondary/30 py-12">
        <div className="absolute inset-0 premium-gradient-subtle" />
        <div className="container-px relative z-10 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
            <div className="text-center">
              <div className="font-display text-6xl font-bold tracking-tight text-primary">
                {siteConfig.rating}
              </div>
              <div className="mt-1 flex justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                ))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {siteConfig.reviewCount.toLocaleString()} total reviews
              </p>
            </div>
            <div className="hidden h-20 w-px bg-border sm:block" />
            <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-3">
              <div>
                <div className="font-display text-3xl font-bold tracking-tight text-foreground">
                  {siteConfig.yearsInBusiness}+
                </div>
                <p className="text-sm text-muted-foreground">Years in Business</p>
              </div>
              <div>
                <div className="font-display text-3xl font-bold tracking-tight text-foreground">
                  {siteConfig.jobsCompleted.toLocaleString()}+
                </div>
                <p className="text-sm text-muted-foreground">Jobs Completed</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="font-display text-3xl font-bold tracking-tight text-foreground">98%</div>
                <p className="text-sm text-muted-foreground">Would Recommend</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All reviews */}
      <section className="section-py">
        <div className="container-px mx-auto max-w-7xl">
          <AnimatedStagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <AnimatedItem key={review.name + review.date}>
                <Card className="card-hover h-full border-border/50 transition-[border-color,box-shadow,transform] duration-200 hover:border-primary/30 hover:premium-shadow-lg hover:-translate-y-1">
                  <CardContent className="flex h-full flex-col p-6">
                    <Quote className="mb-3 h-8 w-8 text-primary/20" />
                    <div className="mb-3 flex">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{review.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 border-t border-border/50 pt-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground">
                        {review.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          {review.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {review.location} &middot; {review.service}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedItem>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      <CTASection
        title="Become Our Next 5-Star Review"
        description="Experience the SOHAN PIPELINES difference for yourself. Book online or call us today — we will not rest until you are satisfied."
      />
    </>
  );
}
