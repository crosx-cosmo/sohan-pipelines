import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { BookingSection } from '@/components/sections/booking-section';

export const metadata: Metadata = {
  title: 'Book a Service',
  description:
    'Schedule your plumbing service online. Choose a service, enter your details, pick a date and time, and we will confirm by phone.',
};

export default function BookPage() {
  return (
    <PageLayout>
      <PageHeader
        badge="Book a Service"
        title="Schedule Your Plumbing Service"
        description="Choose a service, tell us the details, and pick a time. We will confirm your booking by phone."
      />
      <BookingSection />
    </PageLayout>
  );
}
