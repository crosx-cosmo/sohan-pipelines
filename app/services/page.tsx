import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { ServicesSection } from '@/components/sections/services-section';
import { businessInfo } from '@/lib/business-info';
import { SITE_LOGO_URL } from '@/lib/site-logo';
import { fetchLiveServices } from '@/lib/supabase-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title:
    "Plumbing Services & Pipeline Engineering Solutions | Sohan Pipeline's",
  description:
    'Certified residential and commercial plumbing services in Bahardaltitia, Keshrambha, Dantan, and Midnapore (PIN 721451) — drain cleaning & unclogging, CPVC/UPVC pipe fitting, acoustic leak detection, faucet & toilet installation, and water heater connections.',
  keywords: [
    'plumbing services Midnapore',
    'drain cleaning and unclogging Dantan',
    'pipe installation and repair West Medinipur',
    'faucet and tap installation Keshrambha',
    'leak detection and repair Paschim Medinipur',
    'toilet installation and repair Dantan',
    'water heater geyser installation Midnapore',
    'Sohan Pipelines plumbing services',
    'ISI certified plumber 721451',
    'commercial plumbing South Bengal',
  ],
  alternates: {
    canonical: 'https://sohan-pipelines.netlify.app/services',
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
      "Plumbing Services & Pipeline Engineering Solutions · Sohan Pipeline's",
    description:
      'Explore certified residential and commercial plumbing services — upfront written quotes, ISI-grade fittings, and hydrostatic leak testing across Paschim & Purba Medinipur.',
    url: 'https://sohan-pipelines.netlify.app/services',
    siteName: businessInfo.name,
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: SITE_LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Sohan Pipeline's & Plumbing — Certified Engineering Services Catalogue",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      "Plumbing Services & Pipeline Engineering Solutions · Sohan Pipeline's",
    description:
      'Drain cleaning, pipe fitting, leak detection, sanitary installation & geyser connections across Dantan and Midnapore.',
    images: [SITE_LOGO_URL],
  },
};

export default async function ServicesPage() {
  const { data: liveServices } = await fetchLiveServices({
    forceRefresh: true,
  });

  const servicesGraphSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sohan-pipelines.netlify.app/services#breadcrumb',
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
            name: 'Plumbing Services',
            item: 'https://sohan-pipelines.netlify.app/services',
          },
        ],
      },
      {
        '@type': 'Plumber',
        '@id': 'https://sohan-pipelines.netlify.app/#organization',
        name: businessInfo.name,
        url: 'https://sohan-pipelines.netlify.app',
        logo: SITE_LOGO_URL,
        image:
          (liveServices || []).find((s) => s.image_url)?.image_url ||
          SITE_LOGO_URL,
        telephone: businessInfo.phone,
        email: businessInfo.email,
        priceRange: '₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: businessInfo.addressShort,
          addressLocality: 'Dantan',
          addressRegion: 'West Bengal',
          postalCode: businessInfo.pincode,
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 21.9462,
          longitude: 87.2708,
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: "Sohan Pipeline's Plumbing & Sanitary Engineering Catalogue",
          itemListElement: (liveServices || []).map((s, index) => ({
            '@type': 'Offer',
            position: index + 1,
            price: String(s.price ?? 0),
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: `https://sohan-pipelines.netlify.app/book?service=${encodeURIComponent(
              s.id
            )}`,
            itemOffered: {
              '@type': 'Service',
              '@id': `https://sohan-pipelines.netlify.app/services#${
                s.slug || s.id
              }`,
              name: s.name,
              description:
                s.description ||
                'Certified residential and commercial plumbing engineering service.',
              ...(s.image_url ? { image: s.image_url } : {}),
              provider: {
                '@id': 'https://sohan-pipelines.netlify.app/#organization',
              },
              areaServed: {
                '@type': 'AdministrativeArea',
                name: 'Paschim Medinipur & Purba Medinipur, West Bengal',
              },
            },
          })),
        },
      },
      {
        '@type': 'ItemList',
        '@id': 'https://sohan-pipelines.netlify.app/services#catalog',
        name: 'Plumbing Services Catalogue',
        description:
          'Professional residential and commercial plumbing services in Dantan, Keshrambha, and Midnapore.',
        numberOfItems: (liveServices || []).length,
        itemListElement: (liveServices || []).map((s, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Service',
            name: s.name,
            description:
              s.description || 'Certified plumbing engineering service.',
            ...(s.image_url ? { image: s.image_url } : {}),
            url: `https://sohan-pipelines.netlify.app/book?service=${encodeURIComponent(
              s.id
            )}`,
            provider: {
              '@type': 'Plumber',
              name: businessInfo.name,
              telephone: businessInfo.phone,
            },
            offers: {
              '@type': 'Offer',
              price: String(s.price ?? 0),
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
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
          __html: JSON.stringify(servicesGraphSchema),
        }}
      />
      <PageHeader
        badge="Our Services"
        title="Complete Plumbing Services for Every Need"
        description="Whether it is a blocked drain, concealed leak detection, or a full pipeline installation, our certified technicians deliver pressure-tested workmanship with upfront written quotes."
        breadcrumbPath="/services"
      />
      <ServicesSection />
    </PageLayout>
  );
}
