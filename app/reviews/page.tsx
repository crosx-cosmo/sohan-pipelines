import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { TestimonialsSection } from '@/components/sections/testimonials-section';

export const metadata: Metadata = {
  title: 'Reviews',
  description:
    'Read what our customers say about Sohan Pipeline\'s & Plumbing — real reviews from real customers across Midnapore and nearby areas.',
};

export default function ReviewsPage() {
  return (
    <PageLayout>
      <PageHeader
        badge="Customer Reviews"
        title="What Our Customers Say"
        description="Real reviews from real customers across Midnapore and nearby areas. We are proud of our 5.0 rating from 21+ satisfied customers."
      />
      <TestimonialsSection />
    </PageLayout>
  );
}
