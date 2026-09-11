import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PageHeader } from '@/components/site/page-header';
import { CTASection } from '@/components/site/cta-section';
import { ServiceJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/site/json-ld';
import { ServiceIcon } from '@/components/site/service-icon';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CheckCircle2, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { services, siteConfig } from '@/lib/data';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.title} | SOHAN PIPELINES`,
      description: service.summary,
    },
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const relatedServices = services.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <>
      <ServiceJsonLd serviceSlug={service.slug} />
      <FAQJsonLd faqs={service.faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: service.shortTitle, url: `/services/${service.slug}` },
        ]}
      />
      <PageHeader
        title={service.title}
        badge={service.priceFrom}
        description={service.summary}
      />

      {/* Main content */}
      <section className="section-py">
        <div className="container-px mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Left: Content */}
            <div className="lg:col-span-2">
              {/* Image */}
              <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border/50 premium-shadow-sm">
                <Image
                  src="https://images.pexels.com/photos/16509869/pexels-photo-16509869.jpeg?auto=compress&cs=tinysrgb&w=940"
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>

              {/* Description */}
              <h2 className="mb-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {service.tagline}
              </h2>
              <p className="mb-8 text-base leading-relaxed text-muted-foreground">
                {service.description}
              </p>

              {/* Features */}
              <h3 className="mb-4 font-display text-xl font-semibold text-foreground">
                What&apos;s Included
              </h3>
              <ul className="mb-10 grid gap-3 sm:grid-cols-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 rounded-lg border border-border/50 bg-secondary/30 p-3 transition-colors duration-200 hover:border-primary/30"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Process */}
              <h3 className="mb-6 font-display text-xl font-semibold text-foreground">
                Our Process
              </h3>
              <div className="mb-10 grid gap-4 sm:grid-cols-2">
                {service.process.map((step, idx) => (
                  <div
                    key={step.title}
                    className="relative rounded-xl border border-border/50 p-5 transition-colors duration-200 hover:border-primary/30"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground premium-shadow-sm">
                        {idx + 1}
                      </span>
                      <h4 className="font-display font-semibold text-foreground">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* FAQs */}
              <h3 className="mb-6 font-display text-xl font-semibold text-foreground">
                Frequently Asked Questions
              </h3>
              <Accordion type="single" collapsible className="mb-2">
                {service.faqs.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question} className="rounded-xl border border-border/50 bg-card px-5 mb-3">
                    <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Right: Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Quick CTA card */}
                <Card className="border-primary/20 premium-shadow-sm">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                      <ServiceIcon name={service.icon} className="h-7 w-7" />
                    </div>
                    <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                      Need {service.shortTitle}?
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      Starting at {service.priceFrom}. Same-day service available.
                    </p>
                    <div className="space-y-2">
                      <Link href="/book">
                        <Button className="w-full gap-2">
                          Book This Service
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <a href={siteConfig.phoneHref}>
                        <Button variant="outline" className="w-full gap-2">
                          <Phone className="h-4 w-4" />
                          Call {siteConfig.phone}
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust badges */}
                <Card className="border-border/50">
                  <CardContent className="space-y-3 p-6">
                    <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                      Our Guarantee
                    </h4>
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        Upfront flat-rate pricing
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        5-year workmanship warranty
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        Licensed &amp; insured
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        Clean &amp; respectful service
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="section-py bg-secondary/30">
        <div className="container-px mx-auto max-w-7xl">
          <h2 className="mb-8 text-center font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Related Services
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedServices.map((related) => (
              <Link
                key={related.slug}
                href={`/services/${related.slug}`}
                className="group"
              >
                <Card className="card-hover h-full border-border/50 transition-[border-color,box-shadow,transform] duration-200 hover:border-primary/30 hover:premium-shadow-lg hover:-translate-y-1">
                  <CardContent className="p-5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-[background-color,color,transform] duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                      <ServiceIcon name={related.icon} className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1 font-display text-base font-semibold text-foreground">
                      {related.shortTitle}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {related.tagline}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
