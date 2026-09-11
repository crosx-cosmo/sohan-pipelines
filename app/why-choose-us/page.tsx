import { PageHeader } from '@/components/site/page-header';
import { WhyChooseUsSection } from '@/components/site/why-choose-us';
import { ProcessSection } from '@/components/site/process-section';
import { StatsBar } from '@/components/site/stats-bar';
import { CTASection } from '@/components/site/cta-section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why Choose SOHAN PIPELINES',
  description:
    'Licensed, insured, upfront pricing, 5-year warranty, 24/7 emergency service, and 15 years of trusted experience. Discover why homeowners across West Bengal choose SOHAN PIPELINES.',
  alternates: { canonical: '/why-choose-us' },
};

export default function WhyChooseUsPage() {
  return (
    <>
      <PageHeader
        title="Why Choose Us"
        badge="The SOHAN PIPELINES Difference"
        description="Choosing a plumber is about more than price. It is about trust, quality, and knowing the job will be done right. Here is what makes us the right choice."
      />
      <WhyChooseUsSection />
      <StatsBar />
      <ProcessSection />
      <CTASection />
    </>
  );
}
