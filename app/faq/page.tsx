import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { FaqSection } from '@/components/sections/faq-section';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about our plumbing services, pricing, working hours, service areas, and warranties.',
};

export default function FaqPage() {
  return (
    <PageLayout>
      <PageHeader
        badge="FAQ"
        title="Frequently Asked Questions"
        description="Got questions? We have answers. Here are some common things our customers ask."
      />
      <FaqSection />
    </PageLayout>
  );
}
