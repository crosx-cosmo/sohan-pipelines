import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { FindBookingSection } from '@/components/sections/find-booking-section';

export const metadata: Metadata = {
  title: 'Find My Booking',
  description:
    'Look up your plumbing service booking by Booking ID and phone number to see its current status and full timeline.',
};

export default function FindBookingPage() {
  return (
    <PageLayout>
      <PageHeader
        badge="Find My Booking"
        title="Track Your Booking Status"
        description="Enter your Booking ID and the phone number you booked with to see live status updates."
      />
      <FindBookingSection />
    </PageLayout>
  );
}
