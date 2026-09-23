import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { ServiceAreasSection } from '@/components/sections/service-areas-section';

export const metadata: Metadata = {
  title: 'Service Areas',
  description:
    'We serve Midnapore, Dantan, Keshrambha, Contai, Tamluk, Egra, Kharagpur, and more across Paschim Medinipur and Purba Medinipur districts.',
};

export default function ServiceAreasPage() {
  return (
    <PageLayout>
      <PageHeader
        badge="Service Areas"
        title="Areas We Serve"
        description="Based in Keshrambha, Dantan — we cover Midnapore and surrounding regions across Paschim Medinipur and Purba Medinipur districts."
      />
      <ServiceAreasSection />
    </PageLayout>
  );
}
