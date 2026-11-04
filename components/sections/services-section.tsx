'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  ArrowRight,
  Clock,
  ChevronDown,
  ShieldCheck,
  Wrench,
  Sparkles,
  RefreshCw,
  Search,
  X,
  MessageCircle,
  ClipboardList,
  FileDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  fetchLiveServices,
  getServiceCategory,
  getServiceFeatures,
  type DbService,
} from '@/lib/supabase-data';
import { ServiceCardMedia } from '@/components/service-card-media';
import { businessInfo } from '@/lib/business-info';
import { cn } from '@/lib/utils';
import { luxuryEasing } from '@/lib/motion';
import { HowOurServiceWorks } from '@/components/service-estimator';
import { useLanguage } from '@/lib/language-context';
import { downloadOfficialPdf, generateQuotationRef } from '@/lib/pdf-quotation';
import { toast } from 'sonner';

type CategoryFilter =
  | 'all'
  | 'residential'
  | 'commercial'
  | 'emergency'
  | 'installation'
  | 'maintenance';

const categories: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Services' },
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'installation', label: 'Installation' },
  { id: 'maintenance', label: 'Maintenance' },
];

export function ServicesSection() {
  const { t, isBn } = useLanguage();
  const [servicesList, setServicesList] = React.useState<DbService[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeCategory, setActiveCategory] =
    React.useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedCardIds, setExpandedCardIds] = React.useState<string[]>([]);

  const rawPhone = React.useMemo(
    () => businessInfo.phone.replace(/[^0-9]/g, ''),
    []
  );

  const handleDownloadServicePdf = React.useCallback(
    (service: DbService, categoryLabel: string) => {
      const refId = generateQuotationRef('SRV');
      const { filename } = downloadOfficialPdf({
        referenceId: refId,
        documentType: 'SERVICE_ESTIMATE',
        urgencyLabel: 'Scheduled / Same-Day Dispatch',
        notes: `${service.description || 'Certified plumbing engineering service.'} Includes on-site inspection and hydrostatic leak verification.`,
        items: [
          {
            name: service.name,
            skuOrCode: service.slug ? service.slug.toUpperCase() : 'SRV-STD',
            categoryOrMeta: categoryLabel,
            quantity: 1,
            unitPrice: service.price ? Number(service.price) : null,
          },
        ],
      });

      toast.success(
        isBn
          ? `সার্ভিস কোটাশন ডাউনলোড হয়েছে (${refId})`
          : `Service Estimate PDF Downloaded (${refId})`,
        {
          description: isBn
            ? `${filename} সেভ হয়েছে।`
            : `Saved ${filename} for ${service.name}.`,
        }
      );
    },
    [isBn]
  );

  const loadServices = React.useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    const { data, error: err } = await fetchLiveServices({ forceRefresh: true });
    if (err) {
      setError(err);
      setServicesList([]);
    } else {
      setServicesList(data);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    let active = true;
    fetchLiveServices().then(({ data, error: err }) => {
      if (!active) return;
      if (err) {
        setError(err);
        setServicesList([]);
      } else {
        setServicesList(data);
      }
      setLoading(false);
    });

    const handleVisibilityRefresh = () => {
      if (document.visibilityState === 'visible') {
        fetchLiveServices({ forceRefresh: true }).then(({ data, error: err }) => {
          if (!active || err) return;
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

  const filtered = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return servicesList.filter((s) => {
      const cat = getServiceCategory(s.slug || s.name);
      const matchesCat = activeCategory === 'all' || cat === activeCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        cat.toLowerCase().includes(q)
      );
    });
  }, [servicesList, activeCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedCardIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Control Bar: Category Filter Pills + Live Search */}
        <div className="rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card p-4 sm:p-5 shadow-crisp-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Filter Controls */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      'relative px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer select-none',
                      isSelected
                        ? 'text-white font-bold'
                        : 'text-[#475569] dark:text-muted-foreground hover:text-[#071936] dark:hover:text-foreground bg-[#F6F9FC] dark:bg-muted/40 hover:bg-[#DCE5F2]/50'
                    )}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="servicesPageFilterPill"
                        transition={{
                          type: 'spring',
                          stiffness: 450,
                          damping: 32,
                        }}
                        className="absolute inset-0 rounded-xl bg-[#003E9E] shadow-sm -z-10"
                      />
                    )}
                    {cat.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Search Input + Refresh */}
            <div className="flex items-center gap-2 w-full lg:w-80 shrink-0">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#475569] pointer-events-none" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services (e.g. leak, tank, pipe)..."
                  aria-label="Search plumbing services"
                  className="pl-9 pr-8 h-10 text-xs rounded-xl bg-[#F6F9FC] dark:bg-muted/30 border-[#DCE5F2] dark:border-border"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#071936] dark:hover:text-foreground cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => loadServices(true)}
                aria-label="Refresh services catalogue"
                className="h-10 px-3 rounded-xl shrink-0 border-[#DCE5F2] dark:border-border"
              >
                <RefreshCw
                  className={cn('h-3.5 w-3.5', loading && 'animate-spin')}
                />
              </Button>
            </div>
          </div>

          {!loading && !error && servicesList.length > 0 && (
            <div className="pt-2 border-t border-[#DCE5F2] dark:border-border/60 flex flex-wrap items-center justify-between gap-2 text-xs text-[#475569] dark:text-muted-foreground">
              <span>
                Showing{' '}
                <strong className="font-mono text-[#071936] dark:text-foreground">
                  {filtered.length}
                </strong>{' '}
                of{' '}
                <strong className="font-mono text-[#071936] dark:text-foreground">
                  {servicesList.length}
                </strong>{' '}
                certified plumbing services
              </span>
              {(activeCategory !== 'all' || searchQuery.trim().length > 0) && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="text-[#003E9E] dark:text-[#60A5FA] font-semibold hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card overflow-hidden animate-pulse"
              >
                <div className="h-48 w-full bg-slate-100 dark:bg-slate-800/70" />
                <div className="p-6 space-y-4">
                  <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3.5 w-full rounded bg-slate-100 dark:bg-slate-800/70" />
                  <div className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
                  <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-crisp-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#003E9E]/10 text-[#003E9E] mx-auto">
              <Wrench className="h-7 w-7" />
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#071936] dark:text-foreground">
              Unable to Load Active Services
            </h3>
            <p className="text-sm text-[#475569] dark:text-muted-foreground leading-relaxed max-w-md mx-auto">
              Please check back shortly or call our hotline for direct inquiries
              and emergency plumbing assistance.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="sm"
                className="rounded-xl font-semibold bg-[#003E9E] hover:bg-[#071936] text-white"
              >
                <a href={`tel:${businessInfo.phone}`}>
                  Call {businessInfo.phoneDisplay}
                </a>
              </Button>
              <Button
                onClick={() => loadServices(true)}
                size="sm"
                variant="outline"
                className="rounded-xl"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Empty State when Database table has 0 rows */}
        {!loading && !error && servicesList.length === 0 && (
          <div className="rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-crisp-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#003E9E]/10 text-[#003E9E] mx-auto">
              <Wrench className="h-7 w-7" />
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#071936] dark:text-foreground">
              Service Catalogue Updating
            </h3>
            <p className="text-sm text-[#475569] dark:text-muted-foreground leading-relaxed max-w-md mx-auto">
              Please check back shortly or call our hotline for direct inquiries
              and emergency plumbing assistance.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="sm"
                className="rounded-xl font-semibold bg-[#003E9E] hover:bg-[#071936] text-white"
              >
                <a href={`tel:${businessInfo.phone}`}>
                  Call {businessInfo.phoneDisplay}
                </a>
              </Button>
              <Button
                onClick={() => loadServices(true)}
                size="sm"
                variant="outline"
                className="rounded-xl"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
          </div>
        )}

        {/* Empty Filter State */}
        {!loading &&
          !error &&
          servicesList.length > 0 &&
          filtered.length === 0 && (
            <div className="rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card p-10 text-center max-w-md mx-auto space-y-3">
              <h3 className="font-display font-bold text-lg text-[#071936] dark:text-foreground">
                No Matching Plumbing Services
              </h3>
              <p className="text-xs text-[#475569] dark:text-muted-foreground">
                No services found for the selected category or search term.
              </p>
              <Button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                size="sm"
                variant="outline"
                className="rounded-xl"
              >
                View All Services
              </Button>
            </div>
          )}

        {/* Services Cards Grid with Strict 1-to-1 Image Mapping & 16:10 Visual Stage */}
        {!loading && !error && servicesList.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            <AnimatePresence mode="popLayout">
              {filtered.map((service, index) => {
                const category = getServiceCategory(
                  service.slug || service.name
                );
                const features = getServiceFeatures(
                  service.slug || service.name
                );
                const isExpanded = expandedCardIds.includes(service.id);
                const formattedPrice =
                  service.price !== null &&
                  service.price !== undefined &&
                  Number(service.price) > 0
                    ? `₹${Number(service.price).toLocaleString('en-IN')}`
                    : 'On Inspection';
                const durationText = service.duration
                  ? /^\d+$/.test(String(service.duration).trim())
                    ? `${service.duration} min`
                    : service.duration
                  : '1–3 hours';

                return (
                  <motion.article
                    key={service.id}
                    itemScope
                    itemType="https://schema.org/Service"
                    layout="position"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    whileHover={{ y: -4 }}
                    transition={{
                      duration: 0.28,
                      delay: Math.min(index * 0.04, 0.2),
                      ease: luxuryEasing,
                    }}
                    style={{ willChange: 'transform' }}
                    className="h-full"
                  >
                    <Card
                      className={cn(
                        'group h-full p-0 gap-0 border transition-all duration-300 rounded-2xl flex flex-col justify-between bg-white dark:bg-card overflow-hidden shadow-crisp-sm hover:shadow-crisp-lg',
                        isExpanded
                          ? 'border-[#003E9E] ring-1 ring-[#003E9E]/20'
                          : 'border-[#DCE5F2] dark:border-border hover:border-[#003E9E]/60'
                      )}
                    >
                      <div>
                        {/* 16:10 Service Visual Stage Strictly 1-to-1 from spare-part-images/catalog-services */}
                        <ServiceCardMedia
                          name={service.name}
                          category={category}
                          duration={service.duration}
                          price={service.price}
                          imageUrl={service.image_url}
                          alt={`${service.name} — Certified ${category} Plumbing Service by Sohan Pipeline's`}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 48vw, (max-width: 1280px) 32vw, 400px"
                          index={index}
                          priority={index < 3}
                        />

                        <CardHeader className="p-5 sm:p-6 pb-2.5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-[#475569] dark:text-muted-foreground mb-1">
                                <span
                                  itemProp="serviceType"
                                  className="capitalize font-semibold text-[#003E9E] dark:text-[#60A5FA]"
                                >
                                  {category}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                                  <Clock className="h-3 w-3 text-[#003E9E] dark:text-[#60A5FA] shrink-0" />
                                  {durationText}
                                </span>
                              </div>
                              <CardTitle
                                itemProp="name"
                                className="text-base sm:text-lg font-display font-bold text-[#071936] dark:text-foreground leading-snug group-hover:text-[#003E9E] dark:group-hover:text-[#60A5FA] transition-colors"
                              >
                                {service.name}
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="px-5 sm:px-6 py-2 flex-1 space-y-4">
                          <p
                            itemProp="description"
                            className="text-xs sm:text-sm text-[#475569] dark:text-muted-foreground leading-relaxed line-clamp-2"
                          >
                            {service.description ||
                              'Professional plumbing engineering and maintenance services by certified technicians.'}
                          </p>

                          {/* Primary Scope Checklist */}
                          <div className="rounded-xl border border-[#DCE5F2] dark:border-border/60 bg-[#F6F9FC] dark:bg-muted/20 p-3.5 space-y-2">
                            <span className="text-[11px] font-bold text-[#071936] dark:text-foreground flex items-center gap-1.5">
                              <ClipboardList className="h-3.5 w-3.5 text-[#003E9E] dark:text-[#60A5FA] shrink-0" />
                              <span>Included Engineering Scope</span>
                            </span>
                            <ul className="space-y-1.5">
                              {features.slice(0, 3).map((feature) => (
                                <li
                                  key={feature}
                                  className="flex items-start gap-2 text-xs text-[#475569] dark:text-muted-foreground"
                                >
                                  <Check className="h-3.5 w-3.5 text-[#003E9E] dark:text-[#60A5FA] shrink-0 mt-0.5" />
                                  <span className="line-clamp-1 text-[#071936] dark:text-foreground/90 font-medium">
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Expandable Specifications Toggle Button */}
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleExpand(service.id)}
                            className="w-full flex items-center justify-between py-2 px-3 rounded-xl border border-[#DCE5F2] dark:border-border/60 bg-white dark:bg-background hover:bg-[#F6F9FC] dark:hover:bg-muted/50 text-xs font-semibold text-[#071936] dark:text-foreground transition-colors cursor-pointer select-none"
                            aria-expanded={isExpanded}
                          >
                            <span className="flex items-center gap-1.5">
                              <Wrench className="h-3.5 w-3.5 text-[#003E9E] dark:text-[#60A5FA]" />
                              {isExpanded
                                ? 'Hide Technical Specs'
                                : 'View Full Scope & Specs'}
                            </span>
                            <motion.span
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{
                                duration: 0.22,
                                ease: luxuryEasing,
                              }}
                            >
                              <ChevronDown className="h-3.5 w-3.5 text-[#475569]" />
                            </motion.span>
                          </motion.button>

                          {/* Animated Expandable Specifications Panel */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                key={`expanded-spec-${service.id}`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.26,
                                  ease: luxuryEasing,
                                }}
                                style={{ willChange: 'height, opacity' }}
                                className="overflow-hidden"
                              >
                                <div className="p-3.5 rounded-xl bg-[#F6F9FC] dark:bg-muted/40 border border-[#DCE5F2] dark:border-border/60 text-xs space-y-2.5">
                                  {features.length > 3 && (
                                    <div>
                                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#475569] block mb-1">
                                        Additional Scope Included:
                                      </span>
                                      <ul className="space-y-1">
                                        {features.slice(3).map((f) => (
                                          <li
                                            key={f}
                                            className="flex items-center gap-1.5 text-[#475569] dark:text-muted-foreground"
                                          >
                                            <Sparkles className="h-3 w-3 text-[#003E9E] dark:text-[#60A5FA] shrink-0" />
                                            <span>{f}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  <div className="pt-2 border-t border-[#DCE5F2] dark:border-border/50 space-y-1.5 text-[11px] text-[#475569] dark:text-muted-foreground">
                                    <div className="flex items-center justify-between">
                                      <span>Specification Standard:</span>
                                      <span className="font-mono text-[10px] font-bold text-[#003E9E] dark:text-[#60A5FA]">
                                        ISI Class-S Verified
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span>Material Grade:</span>
                                      <span className="font-semibold text-[#071936] dark:text-foreground">
                                        Heavy-gauge CPVC / UPVC / Brass
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span>Testing Protocol:</span>
                                      <span className="font-semibold text-[#071936] dark:text-foreground">
                                        Hydrostatic Leak Inspection
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span>Billing Policy:</span>
                                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                        Written Quote · Pay After Inspection
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </div>

                      <CardFooter className="p-5 sm:p-6 pt-4 mt-2 border-t border-[#DCE5F2] dark:border-border/60 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase tracking-wider text-[#475569] dark:text-muted-foreground font-medium block truncate">
                            Starting Quote
                          </span>
                          <p className="text-base sm:text-lg font-extrabold font-mono text-[#071936] dark:text-foreground tabular-nums truncate">
                            {formattedPrice}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadServicePdf(service, category)}
                            title={t('downloadPdfQuote')}
                            aria-label={`Download PDF Estimate for ${service.name}`}
                            className="h-9.5 px-2.5 rounded-xl border-[#DCE5F2] dark:border-border text-[#003E9E] dark:text-[#60A5FA] hover:border-[#003E9E]"
                          >
                            <FileDown className="h-3.5 w-3.5 shrink-0" />
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-9.5 px-2.5 rounded-xl border-[#DCE5F2] dark:border-border text-[#071936] dark:text-foreground hover:border-emerald-500/50"
                          >
                            <a
                              href={`https://wa.me/${rawPhone}?text=${encodeURIComponent(
                                `Hello Sohan Pipeline's, I would like to enquire about ${service.name} (${formattedPrice}).`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Ask about ${service.name} on WhatsApp`}
                            >
                              <MessageCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            </a>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            className="text-xs font-semibold h-9.5 px-3.5 rounded-xl bg-[#003E9E] hover:bg-[#071936] text-white group/btn shadow-xs whitespace-nowrap"
                          >
                            <Link href={`/book?service=${service.id}`}>
                              <span>{t('bookService')}</span>
                              <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                            </Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* How Our Plumbing Service Works (4-Step Engineering Protocol) */}
        <HowOurServiceWorks className="mt-14" />

        {/* Custom jobs prompt */}
        <div className="mt-14 text-center rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card p-8 max-w-2xl mx-auto shadow-crisp-xs">
          <ShieldCheck className="h-8 w-8 text-[#003E9E] dark:text-[#60A5FA] mx-auto mb-3" />
          <h3 className="font-display font-bold text-base sm:text-lg text-[#071936] dark:text-foreground">
            Don&apos;t see the exact plumbing configuration you need?
          </h3>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
            We handle custom commercial plant fitments, well-bore pipeline
            integrations, and complete bathroom overhauls across Paschim &amp;
            Purba Medinipur.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="text-xs font-semibold h-10 px-4 rounded-xl border-[#DCE5F2] dark:border-border"
            >
              <a href={`tel:${businessInfo.phone}`}>
                Call {businessInfo.phoneDisplay}
              </a>
            </Button>
            <Button
              asChild
              size="sm"
              className="text-xs font-semibold h-10 px-4 rounded-xl bg-[#003E9E] hover:bg-[#071936] text-white shadow-xs"
            >
              <Link href="/contact">
                Request Custom Quote
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
