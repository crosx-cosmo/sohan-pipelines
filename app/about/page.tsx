import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { AboutSection } from '@/components/sections/about-section';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    "Learn about Sohan Pipeline's & Plumbing — years of trusted plumbing service in Midnapore, our values, and our professional approach.",
};

export default function AboutPage() {
  return (
    <PageLayout>
      <PageHeader
        badge="About Us"
        title="Years of Trusted Plumbing in Midnapore"
        description="From small household repairs to large commercial installations, we bring the same level of dedication and quality to every project."
      />
      <AboutSection />
    </PageLayout>
  );
}
