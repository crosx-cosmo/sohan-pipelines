import { HeroSection } from '@/components/site/hero-section';
import { ServicesGridSection } from '@/components/site/services-grid';
import { StatsBar } from '@/components/site/stats-bar';
import { WhyChooseUsSection } from '@/components/site/why-choose-us';
import { ProcessSection } from '@/components/site/process-section';
import { ReviewsSection } from '@/components/site/reviews-section';
import { CTASection } from '@/components/site/cta-section';
import { LocalBusinessJsonLd, FAQJsonLd } from '@/components/site/json-ld';
import { generalFaqs } from '@/lib/data';

export default function HomePage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <FAQJsonLd faqs={generalFaqs} />
      <HeroSection />
      <ServicesGridSection />
      <StatsBar />
      <WhyChooseUsSection />
      <ProcessSection />
      <ReviewsSection />
      <CTASection />
    </>
  );
}
