'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Phone,
  Gauge,
  FileCheck2,
  ChevronDown,
  MessageCircle,
  Calendar,
  FileDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  fetchLiveServices,
  getCachedServices,
  getServiceCategory,
  getServiceFeatures,
  type DbService,
} from '@/lib/supabase-data';
import { ServiceCardMedia } from '@/components/service-card-media';
import { businessInfo } from '@/lib/business-info';
import { useLanguage } from '@/lib/language-context';
import { downloadOfficialPdf, generateQuotationRef } from '@/lib/pdf-quotation';
import { luxuryEasing } from '@/lib/motion';

export function HomeServicesPreview() {
  const { t, isBn } = useLanguage();
  const [servicesList, setServicesList] = React.useState<DbService[]>(
    () => getCachedServices() ?? []
  );
  const [isLoading, setIsLoading] = React.useState(
    () => !getCachedServices()
  );
  const [dbError, setDbError] = React.useState<string | null>(null);
  const [expandedServiceId, setExpandedServiceId] = React.useState<
    string | null
  >(null);

  const loadServices = React.useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsLoading(true);
    }
    setDbError(null);
    const { data, error } = await fetchLiveServices({ forceRefresh });
    if (error) {
      setDbError(error);
    } else {
      setServicesList(data);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    let active = true;
    fetchLiveServices().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setDbError(error);
      } else {
        setServicesList(data);
      }
      setIsLoading(false);
    });

    const handleVisibilityRefresh = () => {
      if (document.visibilityState === 'visible') {
        fetchLiveServices({ forceRefresh: true }).then(({ data, error }) => {
          if (!active || error) return;
          setServicesList(data);
        });
      }
    };

    window.addEventListener('focus', handleVisibilityRefresh);
    document.addEventListener('visibilitychange', handleVisibilityRefresh);

    return () => {
      active = false;
      window.removeEventListener('focus', handleVisibilityRefresh);
      document.removeEventListener('visibilitychange', handleVisibilityRefresh);
    };
  }, []);

  // Curated showcase: strictly 2 actual services from the live database,
  // prioritizing services with an uploaded catalog-services image first
  const curatedServices = React.useMemo(() => {
    const withImage = servicesList.filter((s) => Boolean(s.image_url));
    const withoutImage = servicesList.filter((s) => !s.image_url);
    return [...withImage, ...withoutImage].slice(0, 2);
  }, [servicesList]);

  const rawPhone =
    businessInfo.phone.replace(/\D/g, '') || '919382882517';

  const handleDownloadServicePdf = (service: DbService, category: string) => {
    const refId = generateQuotationRef('EST');
    const { filename } = downloadOfficialPdf({
      referenceId: refId,
      documentType: 'SERVICE_ESTIMATE',
      customerName: 'Valued WhatsApp Customer',
      customerArea: 'Paschim / Purba Medinipur',
      items: [
        {
          name: service.name,
          skuOrCode: service.slug?.toUpperCase() || 'SRV-EST',
          categoryOrMeta: `${category} (${service.duration || 'Same-Day Slot'})`,
          quantity: 1,
          unitPrice: service.price ? Number(service.price) : null,
        },
      ],
    });
    toast.success(
      isBn
        ? `অফিসিয়াল PDF কোটাশন ডাউনলোড হয়েছে (${refId})`
        : `Official Service Estimate PDF Downloaded (${refId})`,
      {
        description: isBn
          ? `ফাইল: ${filename} — হোয়াটসঅ্যাপে (+91 93828 82517) পাঠিয়ে বুকিং নিশ্চিত করুন।`
          : `Saved ${filename}. Share on WhatsApp (+91 93828 82517) to schedule immediately.`,
      }
    );
  };

  return (
    <section
      aria-labelledby="home-services-heading"
      className="relative py-16 lg:py-24 bg-[#F6F9FC] dark:bg-background border-b border-[#DCE5F2] dark:border-border/80 overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Editorial Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, ease: luxuryEasing }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-7 border-b border-[#DCE5F2] dark:border-border"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-[#003E9E] dark:text-[#60A5FA] font-bold mb-3">
              <span className="h-2 w-2 rounded-full bg-[#1C64EC]" />
              <span>{t('servicesEyebrow')}</span>
            </div>

            <h2
              id="home-services-heading"
              className="font-display text-2xl sm:text-4xl lg:text-[2.45rem] font-bold tracking-tight text-[#071936] dark:text-foreground leading-[1.14] text-balance"
            >
              {t('servicesHeadingPart1')}{' '}
              <span className="text-[#003E9E] dark:text-[#60A5FA]">
                {t('servicesHeadingHighlight')}
              </span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-[#475569] dark:text-muted-foreground leading-relaxed text-pretty">
              {t('servicesSubheading')}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="font-semibold text-xs h-11 px-5 rounded-xl bg-white dark:bg-card border-[#DCE5F2] dark:border-border hover:border-[#003E9E] flex-1 sm:flex-initial justify-center whitespace-nowrap shadow-2xs"
            >
              <Link href="/services">
                {t('viewAllServices')}
                {servicesList.length > 0 ? ` (${servicesList.length})` : ''}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0" />
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              className="font-semibold text-xs h-11 px-5 rounded-xl bg-[#003E9E] hover:bg-[#071936] text-white shadow-sm flex-1 sm:flex-initial justify-center whitespace-nowrap"
            >
              <Link href="/book">
                <Calendar className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                {t('bookAService')}
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse"
              >
                <div className="aspect-[16/10] w-full bg-muted/60 border-b border-border/60" />
                <div className="p-6 space-y-4">
                  <div className="h-5 w-2/3 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <div className="h-9 rounded-lg bg-muted/70" />
                    <div className="h-9 rounded-lg bg-muted/70" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && dbError && (
          <div className="p-8 rounded-2xl border border-destructive/30 bg-destructive/5 text-center space-y-4 max-w-xl mx-auto">
            <p className="font-display font-bold text-base text-foreground">
              Unable to Load Services
            </p>
            <p className="text-xs text-muted-foreground">{dbError}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={() => loadServices(true)}
                size="sm"
                variant="outline"
                className="text-xs rounded-xl font-semibold"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Retry Loading
              </Button>
              <Button
                asChild
                size="sm"
                className="text-xs rounded-xl font-semibold"
              >
                <a href={`tel:${businessInfo.phone}`}>
                  <Phone className="mr-1.5 h-3.5 w-3.5" />
                  Call {businessInfo.phoneDisplay}
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !dbError && curatedServices.length === 0 && (
          <div className="p-8 sm:p-10 rounded-2xl border border-border bg-card text-center space-y-3 max-w-xl mx-auto">
            <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
              Direct Service Scheduling Available
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Call our dispatch line at {businessInfo.phoneDisplay} to book an
              immediate technician visit.
            </p>
          </div>
        )}

        {/* Curated 2-Card Showcase */}
        {!isLoading && !dbError && curatedServices.length > 0 && (
          <div
            className={
              curatedServices.length === 1
                ? 'grid gap-6 max-w-2xl mx-auto'
                : 'grid gap-6 lg:gap-8 lg:grid-cols-2 items-stretch'
            }
          >
            {curatedServices.map((service, i) => {
              const category =
                service.pricing_label ||
                getServiceCategory(service.slug || service.name);
              const features = getServiceFeatures(
                service.slug || service.name
              ).slice(0, 4);
              const isExpanded = expandedServiceId === service.id;

              const whatsappServiceText = encodeURIComponent(
                `Hello Sohan Pipeline's, I would like to enquire about booking "${service.name}" (Starting from ₹${service.price}). Please share the earliest available technician slot.`
              );

              return (
                <motion.article
                  key={service.id}
                  itemScope
                  itemType="https://schema.org/Service"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  whileHover={{ y: -3 }}
                  transition={{
                    duration: 0.35,
                    delay: i * 0.06,
                    ease: luxuryEasing,
                  }}
                  className="group h-full flex flex-col justify-between rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card overflow-hidden shadow-crisp-sm hover:shadow-crisp-lg hover:border-[#003E9E]/45 transition-all duration-300"
                >
                  {/* Top Visual Media Stage (16:10 Consistent Aspect Ratio) */}
                  <div>
                    <ServiceCardMedia
                      name={service.name}
                      category={category}
                      duration={service.duration}
                      price={service.price}
                      indexNumber={i + 1}
                      imageUrl={service.image_url}
                      alt={`${service.name} — ${category} Plumbing Service in Medinipur by Sohan Pipeline's`}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, (max-width: 1280px) 48vw, 600px"
                      priority={i < 2}
                    />

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 space-y-5">
                      <div>
                        <h3
                          itemProp="name"
                          className="font-display font-bold text-lg sm:text-xl text-[#071936] dark:text-foreground leading-snug group-hover:text-[#003E9E] dark:group-hover:text-primary transition-colors"
                        >
                          {service.name}
                        </h3>
                        <p
                          itemProp="description"
                          className="mt-2 text-xs sm:text-sm text-[#4A5B73] dark:text-muted-foreground leading-relaxed"
                        >
                          {service.description ||
                            'Executed by experienced plumbing technicians using ISI-certified fittings and hydrostatic verification.'}
                        </p>
                      </div>

                      {/* Included Scope 2x2 Grid */}
                      <div className="pt-4 border-t border-[#DCE5F2]/80 dark:border-border/70 space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          <span>{t('includedScope')}</span>
                          <span className="font-mono text-[#003E9E] dark:text-primary normal-case">
                            {t('standardsIncluded')}
                          </span>
                        </div>

                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-2 rounded-xl bg-[#F6F9FC] dark:bg-muted/45 border border-[#DCE5F2]/80 dark:border-border/60 px-3 py-2 text-xs font-medium text-[#071936] dark:text-foreground"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span className="truncate">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Expandable Technical Protocol Drawer */}
                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedServiceId(isExpanded ? null : service.id)
                          }
                          aria-expanded={isExpanded}
                          className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#F6F9FC] hover:bg-[#003E9E]/[0.05] dark:bg-muted/35 dark:hover:bg-muted/65 border border-[#DCE5F2] dark:border-border/70 text-xs font-semibold text-[#071936] dark:text-foreground transition-colors cursor-pointer"
                        >
                          <span className="inline-flex items-center gap-2">
                            <ShieldCheck className="h-3.5 w-3.5 text-[#003E9E] dark:text-primary shrink-0" />
                            <span>{t('materialSpecsLabel')}</span>
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-[#003E9E] dark:text-primary' : ''
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.24, ease: luxuryEasing }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2.5 p-3.5 rounded-xl bg-[#F6F9FC] dark:bg-muted/25 border border-[#DCE5F2] dark:border-border/70 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                                <div className="p-2.5 rounded-lg bg-white dark:bg-card border border-[#DCE5F2]/80 dark:border-border/60">
                                  <span className="font-semibold text-[#071936] dark:text-foreground block">
                                    Material Standard
                                  </span>
                                  <span className="text-muted-foreground">
                                    ISI Astral, Supreme &amp; Finolex Grade
                                  </span>
                                </div>
                                <div className="p-2.5 rounded-lg bg-white dark:bg-card border border-[#DCE5F2]/80 dark:border-border/60">
                                  <span className="font-semibold text-[#071936] dark:text-foreground block">
                                    Quality Check
                                  </span>
                                  <span className="text-muted-foreground">
                                    Hydrostatic joint &amp; flow test
                                  </span>
                                </div>
                                <div className="p-2.5 rounded-lg bg-white dark:bg-card border border-[#DCE5F2]/80 dark:border-border/60">
                                  <span className="font-semibold text-[#071936] dark:text-foreground block">
                                    Billing Policy
                                  </span>
                                  <span className="text-muted-foreground">
                                    Written quote first · ₹0 advance
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Action Bar */}
                  <div className="px-5 sm:px-6 py-4 bg-[#F6F9FC]/90 dark:bg-muted/25 border-t border-[#DCE5F2] dark:border-border/70 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{t('payAfterInspection')}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full xl:w-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadServicePdf(service, category)}
                        className="h-10 px-3 rounded-xl font-semibold text-xs border-[#DCE5F2] dark:border-border bg-white dark:bg-card hover:border-primary/50 hover:text-primary justify-center whitespace-nowrap"
                      >
                        <FileDown className="mr-1.5 h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{t('downloadServiceQuote')}</span>
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-10 px-3.5 rounded-xl font-semibold text-xs border-[#DCE5F2] dark:border-border bg-white dark:bg-card hover:border-emerald-500/50 hover:text-emerald-700 dark:hover:text-emerald-300 justify-center whitespace-nowrap"
                      >
                        <a
                          href={`https://wa.me/${rawPhone}?text=${whatsappServiceText}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="mr-1.5 h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>WhatsApp</span>
                        </a>
                      </Button>

                      <Button
                        asChild
                        size="sm"
                        className="col-span-2 sm:col-span-1 h-10 px-4 rounded-xl font-semibold text-xs bg-[#003E9E] hover:bg-[#071936] text-white shadow-xs sm:flex-1 xl:flex-initial justify-center whitespace-nowrap group/btn"
                      >
                        <Link
                          href={`/book?service=${encodeURIComponent(
                            service.id
                          )}`}
                        >
                          <span>{t('bookThisService')}</span>
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Clean 3-Step Engineering Assurance Strip */}
        <div className="rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card p-5 sm:p-6 shadow-crisp-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 flex-1">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#003E9E]/10 text-[#003E9E] dark:text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#071936] dark:text-foreground">
                  01. ISI-Certified Pipeline Fittings
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Genuine Astral, Supreme &amp; Finolex components
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#003E9E]/10 text-[#003E9E] dark:text-primary">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#071936] dark:text-foreground">
                  02. Upfront Written Quote First
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Clear on-site estimate before any work starts
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#003E9E]/10 text-[#003E9E] dark:text-primary">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#071936] dark:text-foreground">
                  03. 12-Month Workmanship Warranty
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Hydrostatic pressure tested before handover
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#DCE5F2] dark:border-border/80 lg:pl-6 flex items-center justify-between lg:justify-end gap-4 shrink-0">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-10 px-4 rounded-xl font-semibold text-xs border-[#DCE5F2] dark:border-border hover:border-[#003E9E]/45 whitespace-nowrap"
            >
              <Link href="/services">
                {t('viewAllServices')} {servicesList.length ? `(${servicesList.length})` : ''}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
