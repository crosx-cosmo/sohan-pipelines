'use client';

import * as React from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

const DEFAULT_GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-SOHANPIPE01';
const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

/**
 * Helper to dispatch custom Google Analytics / Tag Manager events
 * enriched with Midnapore & South Bengal regional plumbing context.
 */
export function trackRegionalPlumbingEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined') return;

  const payload = {
    service_region: 'Midnapore & South Bengal',
    hub_district: 'Paschim & Purba Medinipur',
    base_workshop: 'Dantan (PIN 721451)',
    ...params,
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...payload,
    });
  }
}

function GoogleAnalyticsRouteTracker({
  measurementId,
}: {
  measurementId: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track App Router page views with regional context
  React.useEffect(() => {
    if (!pathname || typeof window === 'undefined') return;
    const query = searchParams?.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    if (typeof window.gtag === 'function') {
      window.gtag('config', measurementId, {
        page_path: pagePath,
        service_region: 'Midnapore & South Bengal',
        hub_district: 'Paschim & Purba Medinipur',
        base_workshop: 'Dantan, West Medinipur',
      });
    }
  }, [pathname, searchParams, measurementId]);

  // Delegated engagement tracking for hotline calls, WhatsApp dispatch & booking CTAs
  React.useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href') || '';
      if (href.startsWith('tel:')) {
        trackRegionalPlumbingEvent('plumbing_hotline_call', {
          contact_channel: 'phone_hotline',
          destination: href.replace('tel:', ''),
          page_location: window.location.pathname,
        });
      } else if (href.includes('wa.me') || href.includes('whatsapp.com')) {
        trackRegionalPlumbingEvent('whatsapp_dispatch_click', {
          contact_channel: 'whatsapp',
          page_location: window.location.pathname,
        });
      } else if (href === '/book' || href.startsWith('/book?')) {
        trackRegionalPlumbingEvent('schedule_plumber_cta_click', {
          destination: href,
          page_location: window.location.pathname,
        });
      }
    };

    document.addEventListener('click', handleDocumentClick, { passive: true });
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  return null;
}

export function GoogleAnalytics() {
  const measurementId = DEFAULT_GA_MEASUREMENT_ID.trim();
  const gtmId = GTM_CONTAINER_ID.trim();

  if (!measurementId && !gtmId) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 (gtag.js) */}
      {measurementId && (
        <>
          <Script
            id="ga-gtag-lib"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
            strategy="afterInteractive"
          />
          <Script id="ga-gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${measurementId}', {
                page_path: window.location.pathname,
                anonymize_ip: true,
                custom_map: {
                  dimension1: 'service_region',
                  dimension2: 'hub_district',
                  dimension3: 'base_workshop'
                },
                service_region: 'Midnapore & South Bengal',
                hub_district: 'Paschim & Purba Medinipur',
                base_workshop: 'Dantan, West Medinipur'
              });
            `}
          </Script>
        </>
      )}

      {/* Optional Google Tag Manager Container */}
      {gtmId && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      )}

      {measurementId && (
        <React.Suspense fallback={null}>
          <GoogleAnalyticsRouteTracker measurementId={measurementId} />
        </React.Suspense>
      )}
    </>
  );
}
