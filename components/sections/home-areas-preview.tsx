'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  ArrowRight,
  Search,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Phone,
  X,
  ShieldCheck,
  Clock,
  Copy,
  Check,
  ExternalLink,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { businessInfo } from '@/lib/business-info';
import { ServiceAreaCardMedia } from '@/components/service-area-card-media';
import {
  fetchLiveServiceAreas,
  getCachedServiceAreas,
  type LiveServiceArea,
} from '@/lib/supabase-data';
import { luxuryEasing } from '@/lib/motion';
import { toast } from 'sonner';

function formatDistrictHeading(district: string): string {
  const normalized = district.trim().toLowerCase();
  if (normalized === 'west medinipur' || normalized === 'paschim medinipur') {
    return 'Paschim Medinipur (West Medinipur)';
  }
  if (normalized === 'east medinipur' || normalized === 'purba medinipur') {
    return 'Purba Medinipur (East Medinipur)';
  }
  return district;
}

export function HomeAreasPreview() {
  const [areas, setAreas] = React.useState<LiveServiceArea[]>(
    () => getCachedServiceAreas() ?? []
  );
  const [loading, setLoading] = React.useState(() => !getCachedServiceAreas());
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [copiedAddress, setCopiedAddress] = React.useState(false);

  const loadAreas = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetchLiveServiceAreas({ forceRefresh: true });
    if (res.error) {
      setError(res.error);
    } else {
      setAreas(res.data || []);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    let active = true;
    fetchLiveServiceAreas().then((res) => {
      if (!active) return;
      if (res.error) {
        setError(res.error);
      } else {
        setAreas(res.data || []);
      }
      setLoading(false);
    });

    const handleVisibilityRefresh = () => {
      if (document.visibilityState === 'visible') {
        fetchLiveServiceAreas({ forceRefresh: true }).then((res) => {
          if (!active || res.error) return;
          setAreas(res.data || []);
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

  const previewAreas = React.useMemo(() => areas.slice(0, 2), [areas]);

  const matchedAreas = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return areas.filter(
      (a) =>
        a.locality?.toLowerCase().includes(q) ||
        a.pincode?.toLowerCase().includes(q) ||
        a.block?.toLowerCase().includes(q) ||
        a.subdivision?.toLowerCase().includes(q) ||
        a.district?.toLowerCase().includes(q) ||
        formatDistrictHeading(a.district || '')
          .toLowerCase()
          .includes(q)
    );
  }, [areas, searchQuery]);

  const handleQuickCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    const qLower = q.toLowerCase();
    const matched = areas.find(
      (a) =>
        a.locality?.toLowerCase().includes(qLower) ||
        a.pincode?.toLowerCase().includes(qLower) ||
        a.block?.toLowerCase().includes(qLower) ||
        a.subdivision?.toLowerCase().includes(qLower) ||
        a.district?.toLowerCase().includes(qLower) ||
        formatDistrictHeading(a.district || '')
          .toLowerCase()
          .includes(qLower)
    );

    if (matched) {
      toast.success(`Verified Coverage: ${matched.locality}`, {
        description: `Block: ${matched.block || matched.subdivision} · District: ${formatDistrictHeading(
          matched.district
        )}${matched.pincode ? ` · PIN: ${matched.pincode}` : ''}`,
      });
    } else {
      toast.info(`Custom Dispatch Check for "${q}"`, {
        description: `Call ${businessInfo.phoneDisplay} to confirm technician availability in surrounding blocks.`,
      });
    }
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(
        `${businessInfo.name} — ${businessInfo.address} (Phone: ${businessInfo.phoneDisplay})`
      );
      setCopiedAddress(true);
      toast.success('Official Workshop Address Copied', {
        description: businessInfo.address,
      });
      setTimeout(() => setCopiedAddress(false), 2500);
    } catch {
      toast.info(businessInfo.address);
    }
  };

  return (
    <section className="relative py-16 lg:py-24 bg-[#F6F9FC] dark:bg-background border-b border-[#DCE5F2] dark:border-border/80 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: luxuryEasing }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-7 border-b border-[#DCE5F2] dark:border-border"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-[#003E9E] dark:text-[#60A5FA] font-bold mb-3">
              <span className="h-2 w-2 rounded-full bg-[#1C64EC]" />
              <span>05 · Official Service Address &amp; Regional Coverage</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-[2.45rem] font-bold tracking-tight text-[#071936] dark:text-foreground leading-[1.14] text-balance">
              Base Workshop Address &amp;{' '}
              <span className="text-[#003E9E] dark:text-[#60A5FA]">
                Regional Dispatch Hubs
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#475569] dark:text-muted-foreground leading-relaxed text-pretty">
              Operating from our registered headquarters at{' '}
              <strong className="text-[#071936] dark:text-foreground font-semibold">
                {businessInfo.addressShort} (PIN {businessInfo.pincode})
              </strong>
              , our mobile plumbing engineers serve verified localities and
              surrounding blocks across Paschim &amp; Purba Medinipur.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="font-semibold text-xs h-11 px-5 rounded-xl bg-white dark:bg-card border-[#DCE5F2] dark:border-border hover:border-[#003E9E] flex-1 sm:flex-initial justify-center whitespace-nowrap shadow-2xs"
            >
              <Link href="/service-areas">
                View All Service Areas
                {areas.length > 0 ? ` (${areas.length})` : ''}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0" />
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="font-semibold text-xs h-11 px-5 rounded-xl bg-[#003E9E] hover:bg-[#071936] text-white shadow-sm flex-1 sm:flex-initial justify-center whitespace-nowrap"
            >
              <Link href="/book">
                Book In Your Area
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Official Service Address & Instant Coverage Verifier Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.42, ease: luxuryEasing }}
          className="rounded-2xl bg-white dark:bg-card border border-[#DCE5F2] dark:border-border shadow-crisp-md overflow-hidden"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-[#071936] via-[#003E9E] to-[#1C64EC]" />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Command Header Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-[#DCE5F2] dark:border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#003E9E]/10 border border-[#003E9E]/20 text-[#003E9E] dark:text-[#60A5FA]">
                  <Building2 className="h-6 w-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-mono">
                    <span className="font-bold text-[#003E9E] dark:text-[#60A5FA] uppercase tracking-wider">
                      Official Registered Service Address &amp; HQ
                    </span>
                    <span aria-hidden="true" className="text-[#CBD5E1]">
                      ·
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold tabular-nums">
                      PIN {businessInfo.pincode}
                    </span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#071936] dark:text-foreground leading-snug">
                    {businessInfo.name} — Central Workshop &amp; Hardware Counter
                  </h3>

                  <p className="text-xs sm:text-sm text-[#475569] dark:text-muted-foreground font-mono">
                    {businessInfo.address}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAddress}
                  className="h-10 px-4 rounded-xl border-[#DCE5F2] dark:border-border bg-[#F6F9FC] dark:bg-muted/30 hover:border-[#003E9E] text-[#071936] dark:text-foreground text-xs font-semibold gap-1.5 whitespace-nowrap"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Address Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[#003E9E] dark:text-[#60A5FA]" />
                      <span>Copy Full Address</span>
                    </>
                  )}
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 rounded-xl border-[#DCE5F2] dark:border-border bg-white dark:bg-card hover:border-[#003E9E] text-[#003E9E] dark:text-[#60A5FA] text-xs font-semibold gap-1.5 whitespace-nowrap"
                >
                  <a
                    href="https://maps.app.goo.gl/A5zohbs3fQ9YFK5z5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Open Google Maps</span>
                  </a>
                </Button>
              </div>
            </div>

            {/* 6-Tile Structured Address Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="rounded-xl bg-[#F6F9FC] dark:bg-muted/25 border border-[#DCE5F2] dark:border-border p-3.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block">
                  Village / Locality
                </span>
                <span className="font-display font-bold text-sm text-[#071936] dark:text-foreground mt-1 block">
                  Bahardaltitia
                </span>
              </div>

              <div className="rounded-xl bg-[#F6F9FC] dark:bg-muted/25 border border-[#DCE5F2] dark:border-border p-3.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block">
                  Post Office (PO)
                </span>
                <span className="font-display font-bold text-sm text-[#071936] dark:text-foreground mt-1 block">
                  Keshrambha
                </span>
              </div>

              <div className="rounded-xl bg-[#F6F9FC] dark:bg-muted/25 border border-[#DCE5F2] dark:border-border p-3.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block">
                  Police Station (PS)
                </span>
                <span className="font-display font-bold text-sm text-[#071936] dark:text-foreground mt-1 block">
                  Dantan
                </span>
              </div>

              <div className="rounded-xl bg-[#F6F9FC] dark:bg-muted/25 border border-[#DCE5F2] dark:border-border p-3.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block">
                  District &amp; State
                </span>
                <span className="font-display font-bold text-sm text-[#071936] dark:text-foreground mt-1 block">
                  West Medinipur, WB
                </span>
              </div>

              <div className="rounded-xl bg-[#003E9E]/5 dark:bg-[#003E9E]/20 border border-[#003E9E]/25 p-3.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#003E9E] dark:text-[#60A5FA] block">
                  Postal PIN Code
                </span>
                <span className="font-mono font-extrabold text-base text-[#003E9E] dark:text-[#60A5FA] mt-0.5 block tabular-nums">
                  {businessInfo.pincode}
                </span>
              </div>

              <div className="rounded-xl bg-[#F6F9FC] dark:bg-muted/25 border border-[#DCE5F2] dark:border-border p-3.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block">
                  Mon–Sat Hours
                </span>
                <span className="font-mono font-bold text-xs sm:text-sm text-[#071936] dark:text-foreground mt-1 block tabular-nums">
                  {businessInfo.hours}
                </span>
              </div>
            </div>

            {/* Instant PIN Code & Locality Coverage Verifier */}
            <div className="rounded-xl bg-[#F6F9FC] dark:bg-muted/20 border border-[#DCE5F2] dark:border-border p-4 sm:p-5 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label
                  htmlFor="home-coverage-search"
                  className="text-xs sm:text-sm font-bold text-[#071936] dark:text-foreground flex items-center gap-2"
                >
                  <Search className="h-4 w-4 text-[#003E9E] dark:text-[#60A5FA] shrink-0" />
                  <span>Instant PIN Code &amp; Locality Dispatch Verifier</span>
                </label>

                {areas.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569] dark:text-muted-foreground">
                    <span>Quick check:</span>
                    {areas.slice(0, 3).map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setSearchQuery(a.locality)}
                        className="font-mono font-bold text-[#003E9E] dark:text-[#60A5FA] hover:underline cursor-pointer"
                      >
                        {a.locality}
                        {a.pincode ? ` (${a.pincode})` : ''}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <form
                onSubmit={handleQuickCheck}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
              >
                <div className="relative flex-1">
                  <Search className="h-4 w-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    id="home-coverage-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter locality, block, or PIN code (e.g. Bahardaltitia, Dantan, 721451)..."
                    className="pl-10 pr-9 h-11 rounded-xl bg-white dark:bg-background border-[#DCE5F2] dark:border-border text-xs sm:text-sm"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search query"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#071936] cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-[#003E9E] hover:bg-[#071936] text-white font-semibold text-xs shrink-0 justify-center whitespace-nowrap shadow-xs"
                >
                  Check Coverage
                </Button>
              </form>

              {/* Smooth Animated Search Result Banner */}
              <AnimatePresence initial={false}>
                {searchQuery.trim().length > 0 && !loading && !error && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: luxuryEasing }}
                    className="overflow-hidden"
                  >
                    {matchedAreas.length > 0 ? (
                      <div className="mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="text-xs sm:text-sm font-bold text-[#071936] dark:text-foreground">
                              Verified Active Service Zone ({matchedAreas.length}{' '}
                              {matchedAreas.length === 1
                                ? 'locality match'
                                : 'locality matches'}
                              )
                            </p>
                            <p className="text-xs text-[#475569] dark:text-muted-foreground font-mono">
                              {matchedAreas
                                .slice(0, 3)
                                .map(
                                  (m) =>
                                    `${m.locality} (${m.block || m.subdivision}${
                                      m.pincode ? ` · PIN ${m.pincode}` : ''
                                    })`
                                )
                                .join(' · ')}
                            </p>
                          </div>
                        </div>
                        <Button
                          asChild
                          size="sm"
                          className="h-9 px-4 rounded-xl bg-[#003E9E] hover:bg-[#071936] text-white text-xs font-semibold shrink-0 whitespace-nowrap"
                        >
                          <Link
                            href={`/book?locality=${encodeURIComponent(
                              matchedAreas[0].locality
                            )}&pincode=${encodeURIComponent(
                              matchedAreas[0].pincode || ''
                            )}`}
                          >
                            Book in {matchedAreas[0].locality}
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card px-4 py-3">
                        <div className="flex items-start gap-2.5">
                          <MapPin className="h-4 w-4 text-[#003E9E] dark:text-[#60A5FA] shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="text-xs sm:text-sm font-bold text-[#071936] dark:text-foreground">
                              &ldquo;{searchQuery.trim()}&rdquo; — On-Request
                              Field Dispatch Available
                            </p>
                            <p className="text-xs text-[#475569] dark:text-muted-foreground">
                              We regularly dispatch mobile technicians to
                              surrounding blocks across Paschim &amp; Purba
                              Medinipur. Call our workshop desk to confirm.
                            </p>
                          </div>
                        </div>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-9 px-4 rounded-xl border-[#DCE5F2] dark:border-border text-xs font-semibold shrink-0 whitespace-nowrap"
                        >
                          <a href={`tel:${businessInfo.phone}`}>
                            <Phone className="mr-1.5 h-3.5 w-3.5 text-[#003E9E] dark:text-[#60A5FA]" />
                            Call {businessInfo.phoneDisplay}
                          </a>
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card p-6 animate-pulse space-y-5"
              >
                <div className="h-44 w-full bg-slate-100 dark:bg-slate-800/70 rounded-xl" />
                <div className="h-6 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[1, 2].map((k) => (
                    <div
                      key={k}
                      className="h-14 bg-slate-100 dark:bg-slate-800/60 rounded-xl"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card p-8 text-center max-w-xl mx-auto space-y-4">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
            <h3 className="font-display text-base font-bold text-[#071936] dark:text-foreground">
              Unable to Load Live Service Areas
            </h3>
            <p className="text-xs text-[#475569]">{error}</p>
            <Button
              onClick={loadAreas}
              size="sm"
              variant="outline"
              className="rounded-xl text-xs font-semibold"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Retry Connection
            </Button>
          </div>
        )}

        {/* Concise 2-Card Regional Coverage Showcase with Strict 1-to-1 Image Mapping */}
        {!loading && !error && areas.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-8 items-stretch">
            {previewAreas.map((area, areaIdx) => (
              <motion.div
                key={area.id || `${area.locality}-${areaIdx}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                whileHover={{ y: -4 }}
                transition={{
                  duration: 0.38,
                  delay: areaIdx * 0.08,
                  ease: luxuryEasing,
                }}
                style={{ willChange: 'transform' }}
                className="h-full flex flex-col"
              >
                <Card
                  itemScope
                  itemType="https://schema.org/Place"
                  className="group h-full p-0 gap-0 rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card shadow-crisp-sm hover:shadow-crisp-lg hover:border-[#003E9E]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* 16:10 Locality Coverage Visual Stage strictly 1-to-1 from spare-part-images/catalog-service-areas */}
                    <ServiceAreaCardMedia
                      title={area.locality}
                      subtitle={
                        area.pincode
                          ? `PIN Code: ${area.pincode}${
                              area.block || area.subdivision
                                ? ` · ${area.block || area.subdivision}`
                                : ''
                            }`
                          : area.block || area.subdivision || null
                      }
                      badgeLeft={`0${areaIdx + 1} · ${area.locality}`}
                      badgeRight="Verified Locality"
                      imageUrl={area.image_url}
                      alt={`${area.locality}${area.pincode ? ` (PIN ${area.pincode})` : ''}, ${formatDistrictHeading(area.district)} — Plumbing & Pipeline Service Area by Sohan Pipeline's`}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, (max-width: 1280px) 48vw, 600px"
                      variant="area"
                      priority={areaIdx === 0}
                      objectPosition="50% 48%"
                    />
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-4">
                      <p className="text-xs sm:text-sm text-[#475569] dark:text-muted-foreground leading-relaxed">
                        Verified regional dispatch zone for pipeline
                        installation, acoustic leak diagnostics, sanitary
                        fittings, and genuine spare parts supply:
                      </p>

                      {/* Locality Metadata & Quick Booking Link */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link
                          href={`/book?locality=${encodeURIComponent(
                            area.locality
                          )}&pincode=${encodeURIComponent(area.pincode || '')}`}
                          className="group/loc rounded-xl border border-[#DCE5F2] dark:border-border bg-[#F6F9FC] dark:bg-muted/30 hover:border-[#003E9E] hover:bg-[#003E9E]/5 p-3.5 transition-all duration-200 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                              <span
                                itemProp="name"
                                className="font-bold text-sm text-[#071936] dark:text-foreground group-hover/loc:text-[#003E9E] dark:group-hover/loc:text-[#60A5FA] truncate transition-colors"
                              >
                                {area.locality}
                              </span>
                            </div>
                            <p className="text-xs font-mono text-[#475569] dark:text-muted-foreground truncate mt-1 tabular-nums">
                              {area.block || area.subdivision}
                              {area.pincode ? ` · PIN ${area.pincode}` : ''}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#475569] group-hover/loc:text-[#003E9E] group-hover/loc:translate-x-0.5 transition-all shrink-0" />
                        </Link>

                        <div className="rounded-xl border border-[#DCE5F2] dark:border-border bg-[#F6F9FC] dark:bg-muted/30 p-3.5 flex flex-col justify-center">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground">
                            District Jurisdiction
                          </span>
                          <span className="font-bold text-xs sm:text-sm text-[#071936] dark:text-foreground mt-0.5 truncate">
                            {formatDistrictHeading(area.district)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-4 border-t border-[#DCE5F2] dark:border-border flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-[#475569] dark:text-muted-foreground font-medium">
                        Same-day &amp; scheduled technician visits
                      </span>
                      <Link
                        href={`/book?locality=${encodeURIComponent(
                          area.locality
                        )}&pincode=${encodeURIComponent(area.pincode || '')}`}
                        className="font-bold text-[#003E9E] dark:text-[#60A5FA] hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                      >
                        <span>Book in {area.locality}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Base Workshop & Regional Dispatch HQ Card — Dedicated Branded Placeholder Only (imageUrl={null}) */}
            {previewAreas.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.38, delay: 0.08, ease: luxuryEasing }}
                style={{ willChange: 'transform' }}
                className="h-full flex flex-col"
              >
                <Card
                  itemScope
                  itemType="https://schema.org/Place"
                  className="group h-full p-0 gap-0 rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card shadow-crisp-sm hover:shadow-crisp-lg hover:border-[#003E9E]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Dedicated Base Workshop HQ Placeholder — Never reuses any locality or service image */}
                  <ServiceAreaCardMedia
                    title="Base Workshop & Regional Dispatch HQ"
                    subtitle={businessInfo.addressShort}
                    badgeLeft={`HQ · PIN ${businessInfo.pincode}`}
                    badgeRight="Mobile Field Units"
                    imageUrl={null}
                    variant="workshop-hq"
                    objectPosition="50% 48%"
                  />

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-4">
                      <p className="text-xs sm:text-sm text-[#475569] dark:text-muted-foreground leading-relaxed">
                        Central engineering depot and genuine spare parts
                        counter serving residential and commercial pipelines
                        across Paschim Medinipur and Purba Medinipur:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-xl border border-[#DCE5F2] dark:border-border bg-[#F6F9FC] dark:bg-muted/30 p-3.5 space-y-1">
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-bold text-[#071936] dark:text-foreground inline-flex items-center gap-1.5">
                              <ShieldCheck className="h-4 w-4 text-[#003E9E] dark:text-[#60A5FA] shrink-0" />
                              <span>Mobile Field Units</span>
                            </span>
                            <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                              On-Call
                            </span>
                          </div>
                          <p className="text-xs text-[#475569] dark:text-muted-foreground">
                            Scheduled &amp; urgent dispatch across surrounding
                            blocks
                          </p>
                        </div>

                        <div className="rounded-xl border border-[#DCE5F2] dark:border-border bg-[#F6F9FC] dark:bg-muted/30 p-3.5 space-y-1">
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-bold text-[#071936] dark:text-foreground inline-flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-[#003E9E] dark:text-[#60A5FA] shrink-0" />
                              <span>Operating Hours</span>
                            </span>
                            <span className="font-mono text-[11px] text-[#475569] font-semibold">
                              Mon–Sat
                            </span>
                          </div>
                          <p className="text-xs text-[#071936] dark:text-foreground font-mono font-bold tabular-nums">
                            {businessInfo.hours}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#DCE5F2] dark:border-border flex flex-wrap items-center justify-between gap-2 text-xs">
                      <a
                        href={`tel:${businessInfo.phone}`}
                        className="font-mono font-bold text-[#071936] dark:text-foreground hover:text-[#003E9E] transition-colors inline-flex items-center gap-1.5 tabular-nums"
                      >
                        <Phone className="h-3.5 w-3.5 text-[#003E9E] dark:text-[#60A5FA] shrink-0" />
                        <span>{businessInfo.phoneDisplay}</span>
                      </a>
                      <Link
                        href="/book"
                        className="font-bold text-[#003E9E] dark:text-[#60A5FA] hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                      >
                        <span>Schedule Technician Visit</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
