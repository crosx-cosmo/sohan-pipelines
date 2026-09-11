import { PageHeader } from '@/components/site/page-header';
import { ServicesGrid } from '@/components/site/services-grid';
import { CTASection } from '@/components/site/cta-section';
import { LocalBusinessJsonLd } from '@/components/site/json-ld';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plumbing Services — Emergency, Repair, Installation',
  description:
    'Full range of professional plumbing services: 24/7 emergency repairs, water heater installation, drain cleaning, leak detection, repiping, sewer line services, fixture installation, and commercial plumbing.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <PageHeader
        title="Plumbing Services"
        badge="What We Do"
        description="From a dripping faucet to a full sewer line replacement, our certified plumbers handle every plumbing need with precision, transparency, and a workmanship guarantee."
      />
      <ServicesGrid />
      <CTASection
        title="Not Sure Which Service You Need?"
        description="Call us and we will help you figure it out. No pressure, no obligation — just honest advice from a licensed plumber."
      />
    </>
  );
}
