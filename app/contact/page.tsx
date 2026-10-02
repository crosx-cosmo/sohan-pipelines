import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { ContactSection } from '@/components/sections/contact-section';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Get in touch with Sohan Pipeline's & Plumbing. Call +91 86701 43003, email contact@sohanpipelines.in, or book a service online.",
};

export default function ContactPage() {
  return (
    <PageLayout>
      <PageHeader
        badge="Get in Touch"
        title="Need a Plumber? Contact Us."
        description="Whether it is an emergency or a planned service, we are here to help. Reach out through any of the channels below."
      />
      <ContactSection />
    </PageLayout>
  );
}
