'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import {
  ArrowRight,
  Phone,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Search,
  ClipboardCheck,
  Award,
  FileDown,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomSelect } from '@/components/ui/custom-select';
import { businessInfo } from '@/lib/business-info';
import { useLanguage } from '@/lib/language-context';
import {
  downloadOfficialPdf,
  buildQuotationWhatsAppUrl,
  generateQuotationRef,
} from '@/lib/pdf-quotation';
import {
  fetchLiveServiceAreas,
  getCachedServiceAreas,
  fetchLiveServices,
  getCachedServices,
  type DbServiceArea,
  type DbService,
} from '@/lib/supabase-data';
import { HeroPlumbingGallery } from '@/components/hero-plumbing-gallery';
import { BrandPartnersMarquee } from '@/components/brand-partners-marquee';
import { luxuryEasing, fadeUpVariants } from '@/lib/motion';

export function HeroSection() {
  const router = useRouter();
  const { t, isBn } = useLanguage();

  const [areas, setAreas] = React.useState<DbServiceArea[]>(
    () => getCachedServiceAreas() ?? []
  );
  const [services, setServices] = React.useState<DbService[]>(
    () => getCachedServices() ?? []
  );
  const [loadingAreas, setLoadingAreas] = React.useState(
    () => !getCachedServiceAreas()
  );
  const [quickTown, setQuickTown] = React.useState<string>(
    () => getCachedServiceAreas()?.[0]?.locality ?? ''
  );
  const [quickBookingRef, setQuickBookingRef] = React.useState('');
  const [selectedQuoteServiceId, setSelectedQuoteServiceId] =
    React.useState<string>(() => getCachedServices()?.[0]?.id ?? '');
  const [quoteCustomerMeta, setQuoteCustomerMeta] = React.useState('');
  const [lastGeneratedWhatsappUrl, setLastGeneratedWhatsappUrl] =
    React.useState<string | null>(null);
  const [activeQuickTab, setActiveQuickTab] = React.useState<
    'book' | 'track' | 'quote'
  >('book');

  React.useEffect(() => {
    let active = true;
    fetchLiveServiceAreas().then(({ data }) => {
      if (!active) return;
      setAreas(data);
      if (data.length > 0) {
        setQuickTown((prev) =>
          prev && data.some((a) => a.locality === prev)
            ? prev
            : data[0].locality
        );
      } else {
        setQuickTown('');
      }
      setLoadingAreas(false);
    });
    fetchLiveServices().then(({ data }) => {
      if (!active) return;
      setServices(data);
      if (data.length > 0) {
        setSelectedQuoteServiceId((prev) =>
          prev && data.some((s) => s.id === prev) ? prev : data[0].id
        );
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const areaOptions = React.useMemo(
    () =>
      areas.map((area) => ({
        key: area.id || area.locality,
        value: area.locality,
        label: `${area.locality}${
          area.pincode ? ` (PIN ${area.pincode})` : ''
        } — Same-Day Technician Slot`,
        description: `${area.district || 'West Medinipur'}${
          area.block ? ` · ${area.block} Block` : ''
        } · Verified Dispatch Coverage`,
        badge: area.pincode ? `PIN ${area.pincode}` : 'Active',
      })),
    [areas]
  );

  const quoteServiceOptions = React.useMemo(
    () =>
      services.map((srv) => ({
        key: srv.id,
        value: srv.id,
        label: `${srv.name} — Starting ₹${srv.price}`,
        description: `${srv.duration || 'Same-Day Slot'} · Upfront Written Estimate`,
        badge: `₹${srv.price}`,
      })),
    [services]
  );

  const handleQuickAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeQuickTab === 'book') {
      if (quickTown) {
        router.push(`/book?area=${encodeURIComponent(quickTown)}`);
      } else {
        router.push('/book');
      }
    } else if (activeQuickTab === 'track') {
      const clean = quickBookingRef.trim().toUpperCase();
      if (clean) {
        router.push(`/find-booking?id=${encodeURIComponent(clean)}`);
      } else {
        router.push('/find-booking');
      }
    } else if (activeQuickTab === 'quote') {
      const chosenService =
        services.find((s) => s.id === selectedQuoteServiceId) || services[0];
      const refId = generateQuotationRef('EST');
      const payload = {
        referenceId: refId,
        documentType: 'SERVICE_ESTIMATE' as const,
        customerName: quoteCustomerMeta.trim() || 'Valued WhatsApp Customer',
        customerArea: quickTown || 'West Medinipur (PIN 721451)',
        items: [
          {
            name: chosenService
              ? chosenService.name
              : 'Comprehensive Plumbing & Pipeline Service Visit',
            skuOrCode: chosenService?.slug?.toUpperCase() || 'SRV-STD',
            categoryOrMeta: chosenService?.duration || 'On-Site Inspection',
            quantity: 1,
            unitPrice: chosenService?.price ? Number(chosenService.price) : 199,
          },
        ],
      };

      const { filename } = downloadOfficialPdf(payload);
      const waUrl = buildQuotationWhatsAppUrl(payload);
      setLastGeneratedWhatsappUrl(waUrl);

      toast.success(
        isBn
          ? `অফিসিয়াল PDF কোটাশন ডাউনলোড হয়েছে (${refId})`
          : `Official PDF Estimate Downloaded (${refId})`,
        {
          description: isBn
            ? `${filename} সেভ হয়েছে। এবার হোয়াটসঅ্যাপে পাঠিয়ে কনফার্ম করুন।`
            : `Saved ${filename}. Tap "Send Quote on WhatsApp" below to confirm your deal.`,
        }
      );
    }
  };

  return (
    <section className="relative w-full max-w-full overflow-x-hidden pt-20 sm:pt-24 lg:pt-30 pb-12 sm:pb-14 lg:pb-16 border-b border-border/60">
      {/* Precision Blueprint Grid & Subtle Atmospheric Radial Lighting */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid-blueprint opacity-[0.06] dark:opacity-[0.12]" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[580px] w-[1040px] rounded-full bg-gradient-to-tr from-primary/14 via-sky-500/8 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-1/3 right-4 h-72 w-72 rounded-full bg-primary/6 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Architectural Editorial Presentation (col-span-6) */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 min-w-0 w-full max-w-full flex flex-col justify-between space-y-5 sm:space-y-6"
          >
            {/* Clean Editorial Eyebrow with Verified Review Link */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs font-semibold text-primary">
              <span className="uppercase tracking-[0.065em]">
                {t('heroDivision')}
              </span>
              <span className="text-border" aria-hidden="true">
                ·
              </span>
              <span className="text-muted-foreground font-normal">
                {t('heroEstablished')} {businessInfo.established}
              </span>
              <span className="text-border" aria-hidden="true">
                ·
              </span>
              <Link
                href="/reviews"
                className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-primary transition-colors duration-150"
              >
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <span>{t('heroVerifiedReviews')}</span>
              </Link>
            </div>

            {/* Display Headline with High-Contrast Editorial Authority */}
            <h1 className="font-display text-[1.75rem] sm:text-4xl md:text-5xl lg:text-[2.85rem] xl:text-[3.35rem] font-bold tracking-tight sm:tracking-[-0.028em] text-foreground leading-[1.12] sm:leading-[1.08] text-balance break-words">
              {t('heroHeadlinePart1')}{' '}
              <span className="text-primary">
                {t('heroHeadlineHighlight')}
              </span>
            </h1>

            {/* Narrative Prose */}
            <p className="text-sm sm:text-base lg:text-[1.05rem] text-muted-foreground leading-relaxed max-w-2xl text-pretty font-normal tracking-[0.002em]">
              {t('heroDescription')}
            </p>

            {/* Primary Conversion Controls — Balanced 2-Row Mobile / 3-Col Desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 w-full">
              <Button
                asChild
                size="lg"
                className="col-span-2 sm:col-span-1 font-semibold text-xs sm:text-[13px] h-11 sm:h-12 px-4 rounded-xl shadow-md shadow-primary/25 group w-full justify-center"
              >
                <Link href="/book">
                  <span className="truncate">{t('bookServiceOnline')}</span>
                  <ArrowRight className="ml-1.5 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="font-semibold text-xs sm:text-[13px] h-11 sm:h-12 px-3 sm:px-4 rounded-xl border-border/80 hover:bg-muted/60 w-full justify-center"
              >
                <a href={`tel:${businessInfo.phone}`}>
                  <Phone className="mr-1.5 h-4 w-4 text-primary shrink-0" />
                  <span className="truncate">
                    {t('heroCallPrefix')} {businessInfo.phoneDisplay}
                  </span>
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="font-semibold text-xs sm:text-[13px] h-11 sm:h-12 px-3 sm:px-4 rounded-xl border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500/60 w-full justify-center shadow-xs transition-colors"
              >
                <a
                  href={`https://wa.me/919382882517?text=${encodeURIComponent(
                    'Hi, I’d like to connect with the founder of SOHAN PIPELINES regarding a plumbing service inquiry. Could you please assist me? Thank you.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-1.5 h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{t('heroWhatsappDesk')}</span>
                </a>
              </Button>
            </div>

            {/* Interactive Quick Dispatch, Tracking & Official PDF Quotation Console */}
            <div className="relative z-30 w-full max-w-full rounded-2xl border border-border/80 bg-card/90 backdrop-blur-sm p-3.5 sm:p-4 shadow-crisp-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                <div className="grid grid-cols-3 sm:flex items-center gap-1 sm:gap-1.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveQuickTab('book')}
                    className={`px-1.5 sm:px-3 py-1.5 sm:py-1 rounded-lg text-[10.5px] sm:text-xs font-semibold transition-colors cursor-pointer truncate text-center ${
                      activeQuickTab === 'book'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/40 sm:bg-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t('heroTabDispatch')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveQuickTab('track')}
                    className={`px-1.5 sm:px-3 py-1.5 sm:py-1 rounded-lg text-[10.5px] sm:text-xs font-semibold transition-colors cursor-pointer truncate text-center ${
                      activeQuickTab === 'track'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/40 sm:bg-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t('heroTabTrack')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveQuickTab('quote')}
                    className={`px-1.5 sm:px-3 py-1.5 sm:py-1 rounded-lg text-[10.5px] sm:text-xs font-semibold transition-colors cursor-pointer truncate text-center ${
                      activeQuickTab === 'quote'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/40 sm:bg-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t('heroTabQuote')}
                  </button>
                </div>
                {!loadingAreas && areas.length > 0 && (
                  <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {areas.length} {t('heroAreasActive')}
                    </span>
                  </span>
                )}
              </div>

              <form
                onSubmit={handleQuickAction}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full min-w-0"
              >
                {activeQuickTab === 'book' && (
                  <>
                    <div className="w-full min-w-0 sm:flex-1">
                      <CustomSelect
                        id="hero-instant-area-dispatch"
                        value={quickTown}
                        onChange={(val) => setQuickTown(val)}
                        options={areaOptions}
                        disabled={loadingAreas || areaOptions.length === 0}
                        placeholder={
                          loadingAreas
                            ? 'Loading verified service areas...'
                            : 'No active service areas currently listed'
                        }
                        aria-label="Select your service area for instant dispatch"
                        size="md"
                        icon={<MapPin className="h-4 w-4" />}
                        buttonClassName="h-10 bg-background/95"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      className="h-10 px-4 rounded-xl text-xs font-semibold shrink-0 w-full sm:w-auto justify-center"
                    >
                      {quickTown
                        ? `${t('heroScheduleIn')} ${quickTown}`
                        : t('heroScheduleService')}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0" />
                    </Button>
                  </>
                )}

                {activeQuickTab === 'track' && (
                  <>
                    <div className="relative w-full min-w-0 sm:flex-1">
                      <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        value={quickBookingRef}
                        onChange={(e) => setQuickBookingRef(e.target.value)}
                        placeholder={t('heroEnterBookingId')}
                        className="h-10 pl-8.5 rounded-xl font-mono text-xs uppercase w-full"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      className="h-10 px-4 rounded-xl text-xs font-semibold shrink-0 w-full sm:w-auto justify-center"
                    >
                      <ClipboardCheck className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                      {t('heroTrackStatus')}
                    </Button>
                  </>
                )}

                {activeQuickTab === 'quote' && (
                  <div className="w-full space-y-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="w-full min-w-0 sm:flex-1">
                        <CustomSelect
                          id="hero-instant-pdf-quote"
                          value={selectedQuoteServiceId}
                          onChange={(val) => setSelectedQuoteServiceId(val)}
                          options={quoteServiceOptions}
                          disabled={quoteServiceOptions.length === 0}
                          placeholder={t('heroQuoteSelectPlaceholder')}
                          aria-label="Select service for PDF estimate"
                          size="md"
                          icon={<Wrench className="h-4 w-4" />}
                          buttonClassName="h-10 bg-background/95"
                        />
                      </div>
                      <Input
                        value={quoteCustomerMeta}
                        onChange={(e) => setQuoteCustomerMeta(e.target.value)}
                        placeholder={t('heroQuoteCustomerPlaceholder')}
                        className="h-10 rounded-xl text-xs sm:w-48 bg-background/95"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <Button
                        type="submit"
                        size="sm"
                        className="h-10 px-4 rounded-xl text-xs font-semibold flex-1 justify-center"
                      >
                        <FileDown className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{t('heroQuoteGenerateBtn')}</span>
                      </Button>

                      {lastGeneratedWhatsappUrl && (
                        <Button
                          asChild
                          size="sm"
                          className="h-10 px-3.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 justify-center"
                        >
                          <a
                            href={lastGeneratedWhatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {isBn ? 'হোয়াটসঅ্যাপে পাঠান' : 'Send Quote on WhatsApp'}
                            </span>
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Verified Trust Pillars */}
            <div className="pt-1 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs w-full items-stretch">
              <div className="h-full rounded-xl border border-border/60 bg-card/60 p-3 flex flex-col justify-between gap-1 min-w-0">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span className="truncate">{t('trustIsiTitle')}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {t('trustIsiDesc')}
                </p>
              </div>

              <div className="h-full rounded-xl border border-border/60 bg-card/60 p-3 flex flex-col justify-between gap-1 min-w-0">
                <div className="flex items-center gap-1.5 text-primary font-bold">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span className="truncate">{t('trustSameDayTitle')}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {t('trustSameDayDesc')}
                </p>
              </div>

              <div className="h-full rounded-xl border border-border/60 bg-card/60 p-3 flex flex-col justify-between gap-1 min-w-0">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">{t('trustZeroAdvanceTitle')}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {t('trustZeroAdvanceDesc')}
                </p>
              </div>

              <div className="h-full rounded-xl border border-border/60 bg-card/60 p-3 flex flex-col justify-between gap-1 min-w-0">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                  <Award className="h-4 w-4 shrink-0" />
                  <span className="truncate">{t('trustWarrantyTitle')}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {t('trustWarrantyDesc')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Premium Responsive Editorial Plumbing Gallery (col-span-6) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: luxuryEasing }}
            className="lg:col-span-6 min-w-0 w-full max-w-full flex flex-col"
          >
            <HeroPlumbingGallery />
          </motion.div>
        </div>

        {/* Official Brand Sponsored & Hardware Partners Moving Left-to-Right Marquee */}
        <BrandPartnersMarquee />
      </div>
    </section>
  );
}
