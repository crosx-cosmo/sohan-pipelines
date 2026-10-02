import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { ServicesSection } from '@/components/sections/services-section';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Complete plumbing services — pipe fitting, drainage cleaning, bathroom fitting, water tank installation, leak detection, commercial plumbing, and more.',
};

export default function ServicesPage() {
  return (
    <PageLayout>
      <PageHeader
        badge="Our Services"
        title="Complete Plumbing Services for Every Need"
        description="Whether it is a leaky tap or a full bathroom installation, our experienced team delivers quality workmanship on every job. Browse our services and book online."
      />
      <ServicesSection />
    </PageLayout>
  );
}
