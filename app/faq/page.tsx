import { PageHeader } from '@/components/site/page-header';
import { CTASection } from '@/components/site/cta-section';
import { FAQJsonLd } from '@/components/site/json-ld';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { generalFaqs } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — Frequently Asked Plumbing Questions',
  description:
    'Answers to common questions about SOHAN PIPELINES: licensing, pricing, warranties, service areas, financing, insurance claims, and more. Get the info you need before you book.',
  alternates: { canonical: '/faq' },
};

export default function FAQPage() {
  return (
    <>
      <FAQJsonLd faqs={generalFaqs} />
      <PageHeader
        title="Frequently Asked Questions"
        badge="Got Questions?"
        description="We believe in transparency. Here are answers to the questions we hear most often. If you do not find what you are looking for, just give us a call."
      />

      <section className="section-py">
        <div className="container-px mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {generalFaqs.map((faq) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="rounded-xl border border-border/50 bg-card px-5 transition-colors duration-200 hover:border-primary/30"
              >
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
      </section>

      <CTASection
        title="Still Have Questions?"
        description="Our team is happy to help. Call us and we will answer any question — no pressure, no obligation."
      />
    </>
  );
}
