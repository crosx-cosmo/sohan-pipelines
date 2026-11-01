import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { ServiceAreasSection } from '@/components/sections/service-areas-section';
import { businessInfo } from '@/lib/business-info';
import { SITE_LOGO_URL } from '@/lib/site-logo';
import { fetchLiveServiceAreas } from '@/lib/supabase-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title:
    "Service Areas & Regional Plumbing Dispatch | Sohan Pipeline's (PIN 721451)",
  description:
    'Verified plumbing service coverage from our central workshop at Vill: Bahardaltitia, PO: Keshrambha, PS: Dantan (PIN 721451) across Paschim Medinipur (West Medinipur) and Purba Medinipur (East Medinipur).',
  keywords: [
    'plumber Bahardaltitia 721451',
    'plumber Keshrambha Dantan',
    'plumber Dantan West Medinipur',
    'plumber Paschim Medinipur',
    'plumber Purba Medinipur',
    'plumber Kharagpur Midnapore',
    'plumbing service areas West Bengal',
    'Sohan Pipelines service address',
    'emergency plumber near Dantan 721451',
  ],
  alternates: {
    canonical: 'https://sohan-pipelines.netlify.app/service-areas',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title:
      "Service Areas & Official Workshop Address · Sohan Pipeline's (PIN 721451)",
    description:
      'Explore verified plumbing dispatch zones across Bahardaltitia, Keshrambha, Dantan, and surrounding blocks in Paschim & Purba Medinipur.',
    url: 'https://sohan-pipelines.netlify.app/service-areas',
    siteName: businessInfo.name,
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: SITE_LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Sohan Pipeline's Regional Plumbing Coverage in Paschim & Purba Medinipur",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      "Service Areas & Regional Plumbing Dispatch · Sohan Pipeline's (PIN 721451)",
    description:
      'Same-day and scheduled plumbing coverage across Bahardaltitia, Keshrambha, Dantan, and Midnapore districts.',
    images: [SITE_LOGO_URL],
  },
};

export default async function ServiceAreasPage() {
  const { data: liveAreas } = await fetchLiveServiceAreas({
    forceRefresh: true,
  });

  const primaryAreaImage =
    (liveAreas || []).find((a) => a.image_url)?.image_url || SITE_LOGO_URL;

  const serviceAreasGraphSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sohan-pipelines.netlify.app/service-areas#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://sohan-pipelines.netlify.app/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Service Areas',
            item: 'https://sohan-pipelines.netlify.app/service-areas',
          },
        ],
      },
      {
        '@type': 'Plumber',
        '@id': 'https://sohan-pipelines.netlify.app/#organization',
        name: businessInfo.name,
        url: 'https://sohan-pipelines.netlify.app',
        logo: SITE_LOGO_URL,
        image: primaryAreaImage,
        telephone: businessInfo.phone,
        email: businessInfo.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: businessInfo.addressShort,
          addressLocality: 'Bahardaltitia, Keshrambha, Dantan',
          addressRegion: 'West Medinipur, West Bengal',
          postalCode: businessInfo.pincode,
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 21.9462,
          longitude: 87.2708,
        },
        areaServed: (liveAreas || []).map((area) => ({
          '@type': 'Place',
          name: `${area.locality}, ${area.district}`,
          ...(area.image_url ? { image: area.image_url } : {}),
          address: {
            '@type': 'PostalAddress',
            addressLocality: area.locality,
            addressRegion: `${area.district}, West Bengal`,
            ...(area.pincode ? { postalCode: area.pincode } : {}),
            addressCountry: 'IN',
          },
        })),
      },
      {
        '@type': 'ItemList',
        '@id': 'https://sohan-pipelines.netlify.app/service-areas#list',
        name: "Sohan Pipeline's Verified Service Areas Directory",
        description:
          'Active plumbing dispatch localities and postal PIN code zones across Paschim Medinipur and Purba Medinipur.',
        numberOfItems: (liveAreas || []).length,
        itemListElement: (liveAreas || []).map((area, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Place',
            name: area.locality,
            description: `Verified plumbing engineering and spare parts dispatch zone in ${
              area.block || area.subdivision || 'Dantan'
            }, ${area.district}${area.pincode ? ` (PIN ${area.pincode})` : ''}.`,
            ...(area.image_url ? { image: area.image_url } : {}),
            url: `https://sohan-pipelines.netlify.app/book?locality=${encodeURIComponent(
              area.locality
            )}&pincode=${encodeURIComponent(area.pincode || '')}`,
            address: {
              '@type': 'PostalAddress',
              addressLocality: area.locality,
              addressRegion: `${area.district}, West Bengal`,
              ...(area.pincode ? { postalCode: area.pincode } : {}),
              addressCountry: 'IN',
            },
          },
        })),
      },
    ],
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceAreasGraphSchema),
        }}
      />
      <PageHeader
        badge="Service Areas"
        title="Areas We Serve"
        description={`Based at ${businessInfo.address} — explore our verified regional plumbing coverage and PIN code dispatch zones.`}
        breadcrumbPath="/service-areas"
      />
      <ServiceAreasSection />
    </PageLayout>
  );
}
