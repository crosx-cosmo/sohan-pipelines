'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  RefreshCw,
  Building2,
  Copy,
  Check,
  ExternalLink,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { businessInfo } from '@/lib/business-info';
import { DispatchHubMap } from '@/components/dispatch-hub-map';
import { ServiceAreaCardMedia } from '@/components/service-area-card-media';
import {
  fetchLiveServiceAreas,
  type DbServiceArea,
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

export function ServiceAreasSection() {
  const [areas, setAreas] = React.useState<DbServiceArea[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [copiedAddress, setCopiedAddress] = React.useState(false);

  const loadAreas = React.useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    const { data, error: err } = await fetchLiveServiceAreas({
      forceRefresh: true,
    });
    if (err) {
      setError(err);
      setAreas([]);
    } else {
      setAreas(data);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    let active = true;
    fetchLiveServiceAreas().then(({ data, error: err }) => {
      if (!active) return;
      if (err) {
        setError(err);
        setAreas([]);
      } else {
        setAreas(data);
      }
      setLoading(false);
    });

    const handleVisibilityRefresh = () => {
      if (document.visibilityState === 'visible') {
        fetchLiveServiceAreas({ forceRefresh: true }).then(({ data, error: err }) => {
          if (!active || err) return;
          setAreas(data);
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

  // Filter areas in real time by search query
  const filteredAreas = React.useMemo(() => {
    if (!searchQuery.trim()) return areas;
    const q = searchQuery.toLowerCase().trim();
    return areas.filter(
      (a) =>
        a.locality.toLowerCase().includes(q) ||
        a.district.toLowerCase().includes(q) ||
        formatDistrictHeading(a.district).toLowerCase().includes(q) ||
        (a.pincode && a.pincode.includes(q)) ||
        (a.block && a.block.toLowerCase().includes(q)) ||
        (a.subdivision && a.subdivision.toLowerCase().includes(q))
    );
  }, [areas, searchQuery]);

  // Group filtered areas by district
  const districtGroups = React.useMemo(() => {
    const groups: Record<string, DbServiceArea[]> = {};
    for (const a of filteredAreas) {
      const d = a.district || 'West Medinipur';
      if (!groups[d]) groups[d] = [];
      groups[d].push(a);
    }
    return groups;
  }, [filteredAreas]);

  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Official Registered Service Address & Base Operations HQ Command Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: luxuryEasing }}
          className="rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card shadow-crisp-sm overflow-hidden"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-[#071936] via-[#003E9E] to-[#1C64EC]" />
          <div className="p-6 sm:p-7 lg:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#DCE5F2] dark:border-border/60">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#003E9E]/10 text-[#003E9E] dark:text-[#60A5FA] border border-[#003E9E]/20">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                    <span className="font-mono font-bold text-[#003E9E] dark:text-[#60A5FA] uppercase">
                      Official Base Workshop &amp; Service Address
                    </span>
                    <span aria-hidden="true" className="text-[#CBD5E1]">
                      ·
                    </span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold tabular-nums">
                      PIN {businessInfo.pincode}
                    </span>
                  </div>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-[#071936] dark:text-foreground">
                    {businessInfo.name} — Central Engineering Depot &amp; Parts
                    Counter
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475569] dark:text-muted-foreground">
                    {businessInfo.address}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAddress}
                  className="h-10 px-3 sm:px-3.5 rounded-xl text-xs font-semibold gap-1.5 justify-center whitespace-nowrap border-[#DCE5F2] dark:border-border"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate">Address Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[#003E9E] dark:text-[#60A5FA] shrink-0" />
                      <span className="truncate">Copy Full Address</span>
                    </>
                  )}
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-10 px-3 sm:px-3.5 rounded-xl text-xs font-semibold gap-1.5 justify-center whitespace-nowrap border-[#DCE5F2] dark:border-border"
                >
                  <a
                    href="https://maps.app.goo.gl/A5zohbs3fQ9YFK5z5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-[#003E9E] dark:text-[#60A5FA] shrink-0" />
                    <span className="truncate">Open Google Maps</span>
                  </a>
                </Button>

                <Button
                  asChild
                  size="sm"
                  className="col-span-2 sm:col-span-1 h-10 px-4 rounded-xl text-xs font-semibold gap-1.5 justify-center whitespace-nowrap bg-[#003E9E] hover:bg-[#071936] text-white"
                >
                  <a href={`tel:${businessInfo.phone}`}>
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{businessInfo.phoneDisplay}</span>
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="rounded-xl border border-[#DCE5F2] dark:border-border bg-[#F6F9FC] dark:bg-muted/25 p-3.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block">
                  Village / Locality
                </span>
                <span className="font-display font-bold text-xs sm:text-sm text-[#071936] dark:text-foreground mt-0.5 block">
                  Bahardaltitia
                </span>
              </div>

              <div className="rounded-xl border border-[#DCE5F2] dark:border-border bg-[#F6F9FC] dark:bg-muted/25 p-3.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block">
                  Post Office (PO)
                </span>
                <span className="font-display font-bold text-xs sm:text-sm text-[#071936] dark:text-foreground mt-0.5 block">
                  Keshrambha
                </span>
              </div>

              <div className="rounded-xl border border-[#DCE5F2] dark:border-border bg-[#F6F9FC] dark:bg-muted/25 p-3.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block">
                  Police Station (PS)
                </span>
                <span className="font-display font-bold text-xs sm:text-sm text-[#071936] dark:text-foreground mt-0.5 block">
                  Dantan
                </span>
              </div>

              <div className="rounded-xl border border-[#DCE5F2] dark:border-border bg-[#F6F9FC] dark:bg-muted/25 p-3.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block">
                  District &amp; State
                </span>
                <span className="font-display font-bold text-xs sm:text-sm text-[#071936] dark:text-foreground mt-0.5 block">
                  West Medinipur, WB
                </span>
              </div>

              <div className="rounded-xl border border-[#003E9E]/25 bg-[#003E9E]/5 dark:bg-[#003E9E]/20 p-3.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#003E9E] dark:text-[#60A5FA] block">
                  Postal PIN Code
                </span>
                <span className="font-mono font-extrabold text-xs sm:text-sm text-[#003E9E] dark:text-[#60A5FA] mt-0.5 block tabular-nums">
                  {businessInfo.pincode}
                </span>
              </div>

              <div className="rounded-xl border border-[#DCE5F2] dark:border-border bg-[#F6F9FC] dark:bg-muted/25 p-3.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block">
                  Mon–Sat Hours
                </span>
                <span className="font-mono font-bold text-xs sm:text-sm text-[#071936] dark:text-foreground mt-0.5 block tabular-nums">
                  {businessInfo.hours}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Interactive Dispatch Topology Map */}
        <DispatchHubMap />

        {/* Live Search Filter Control */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-card border border-[#DCE5F2] dark:border-border shadow-crisp-xs">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569] pointer-events-none" />
            <Input
              type="text"
              placeholder="Search service areas by town, locality, block, district, or PIN code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-9 h-11 text-xs sm:text-sm bg-[#F6F9FC] dark:bg-muted/30 border-[#DCE5F2] dark:border-border/60 rounded-xl"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#071936] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-2.5 text-xs text-[#475569] flex items-center justify-between">
              <span>
                Found{' '}
                <strong className="text-[#071936] dark:text-foreground font-mono">
                  {filteredAreas.length}
                </strong>{' '}
                matching coverage area{filteredAreas.length === 1 ? '' : 's'}
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#003E9E] hover:underline font-semibold cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card overflow-hidden animate-pulse"
              >
                <div className="h-44 w-full bg-slate-100 dark:bg-slate-800/70" />
                <div className="p-5 space-y-2.5">
                  <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-800/70" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-crisp-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#003E9E]/10 text-[#003E9E] mx-auto">
              <MapPin className="h-7 w-7" />
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#071936] dark:text-foreground">
              Unable to Load Service Areas
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed max-w-md mx-auto">
              Please check back shortly or call our hotline directly to confirm
              coverage in your area.
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
                onClick={() => loadAreas(true)}
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

        {/* Empty State */}
        {!loading && !error && areas.length === 0 && (
          <div className="rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-crisp-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#003E9E]/10 text-[#003E9E] mx-auto">
              <MapPin className="h-7 w-7" />
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#071936] dark:text-foreground">
              Service Coverage Directory Updating
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed max-w-md mx-auto">
              Please call our dispatch desk directly at{' '}
              {businessInfo.phoneDisplay} to confirm coverage at your address.
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
                onClick={() => loadAreas(true)}
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
          areas.length > 0 &&
          filteredAreas.length === 0 && (
            <div className="rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card p-10 text-center max-w-md mx-auto space-y-3">
              <h3 className="font-display font-bold text-lg text-[#071936] dark:text-foreground">
                No Matching Locality Found
              </h3>
              <p className="text-xs text-[#475569]">
                No service areas matching &quot;{searchQuery}&quot;. We still
                provide on-request dispatch to surrounding blocks—call{' '}
                {businessInfo.phoneDisplay} or clear the filter.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <Button
                  onClick={() => setSearchQuery('')}
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                >
                  Clear Filter
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="rounded-xl bg-[#003E9E] hover:bg-[#071936] text-white"
                >
                  <a href={`tel:${businessInfo.phone}`}>
                    Call {businessInfo.phoneDisplay}
                  </a>
                </Button>
              </div>
            </div>
          )}

        {/* Live District Breakdowns with Strict 1-to-1 Storage Bucket Visuals + Base Workshop Card */}
        {!loading && !error && areas.length > 0 && (
          <div className="space-y-12">
            {Object.entries(districtGroups).map(
              ([district, districtAreas]) => (
                <div key={district} className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DCE5F2] dark:border-border gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003E9E]/10 text-[#003E9E] dark:text-[#60A5FA] border border-[#003E9E]/20">
                        <Navigation className="h-4 w-4" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#071936] dark:text-foreground">
                          {formatDistrictHeading(district)}
                        </h2>
                        <p className="text-xs text-[#475569] dark:text-muted-foreground">
                          {districtAreas.length} verified service coverage zone
                          {districtAreas.length === 1 ? '' : 's'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#475569] dark:text-muted-foreground flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5 text-[#003E9E] dark:text-[#60A5FA]" />
                        <span>Same-Day &amp; Scheduled Technician Dispatch</span>
                      </span>
                    </div>
                  </div>

                  {/* Area Cards Grid with Live Records + Dedicated Base Workshop HQ Placeholder Card */}
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                    {districtAreas.map((area, idx) => (
                      <motion.article
                        key={`${area.id || area.locality}-${idx}`}
                        itemScope
                        itemType="https://schema.org/Place"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.28,
                          delay: Math.min(idx * 0.03, 0.2),
                          ease: luxuryEasing,
                        }}
                        whileHover={{ y: -4 }}
                        style={{ willChange: 'transform' }}
                        className="group rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card overflow-hidden transition-all duration-300 shadow-crisp-sm hover:shadow-crisp-lg hover:border-[#003E9E]/60 flex flex-col justify-between"
                      >
                        <div>
                          {/* 16:10 Image Stage Connected Strictly 1-to-1 to "spare-part-images/catalog-service-areas" */}
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
                            badgeLeft={area.locality}
                            badgeRight="Active Zone"
                            imageUrl={area.image_url}
                            alt={`${area.locality}${area.pincode ? ` (PIN ${area.pincode})` : ''}, ${formatDistrictHeading(area.district)} — Verified Plumbing Service Coverage Area by Sohan Pipeline's`}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 48vw, (max-width: 1280px) 32vw, 400px"
                            variant="area"
                            priority={idx < 3}
                            objectPosition="50% 48%"
                          />

                          <div className="p-5 space-y-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <h3
                                itemProp="name"
                                className="text-base sm:text-lg font-display font-bold text-[#071936] dark:text-foreground truncate group-hover:text-[#003E9E] transition-colors"
                              >
                                {area.locality}
                              </h3>
                              {(area.block || area.subdivision) && (
                                <span className="text-xs font-mono text-[#003E9E] dark:text-[#60A5FA] font-semibold shrink-0">
                                  {area.block || area.subdivision}
                                </span>
                              )}
                            </div>

                            <div
                              itemProp="address"
                              itemScope
                              itemType="https://schema.org/PostalAddress"
                              className="space-y-1 text-xs text-[#475569] dark:text-muted-foreground"
                            >
                              <meta
                                itemProp="addressLocality"
                                content={area.locality}
                              />
                              <meta
                                itemProp="addressRegion"
                                content="West Bengal"
                              />
                              {area.pincode && (
                                <meta
                                  itemProp="postalCode"
                                  content={area.pincode}
                                />
                              )}
                              <p className="text-xs">
                                District:{' '}
                                <strong className="text-[#071936] dark:text-foreground font-medium">
                                  {formatDistrictHeading(area.district)}
                                </strong>
                              </p>
                              <p className="text-xs leading-relaxed pt-0.5">
                                Pipe fitting, acoustic leak diagnosis, tank
                                installation &amp; spare parts delivery.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="px-5 pb-5 pt-3 border-t border-[#DCE5F2] dark:border-border/60 flex items-center justify-between text-xs">
                          <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                            Verified Coverage Zone
                          </span>
                          <Link
                            href={`/book?locality=${encodeURIComponent(
                              area.locality
                            )}&pincode=${encodeURIComponent(
                              area.pincode || ''
                            )}`}
                            className="text-[#003E9E] dark:text-[#60A5FA] font-bold text-xs flex items-center gap-1 group-hover:underline"
                          >
                            <span>Book Service Here</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                      </motion.article>
                    ))}

                    {/* Base Workshop & Regional Dispatch HQ Card (Dedicated Placeholder Only — Ready for Future Admin Image Slot) */}
                    {!searchQuery.trim() && (
                      <motion.article
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.28,
                          delay: 0.08,
                          ease: luxuryEasing,
                        }}
                        whileHover={{ y: -4 }}
                        style={{ willChange: 'transform' }}
                        className="group rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card overflow-hidden transition-all duration-300 shadow-crisp-sm hover:shadow-crisp-lg hover:border-[#003E9E]/60 flex flex-col justify-between"
                      >
                        <div>
                          <ServiceAreaCardMedia
                            title="Base Workshop & Dispatch HQ"
                            subtitle={`${businessInfo.addressShort} · PIN ${businessInfo.pincode}`}
                            badgeLeft={`HQ · PIN ${businessInfo.pincode}`}
                            badgeRight="Central Depot"
                            imageUrl={null}
                            variant="workshop-hq"
                          />

                          <div className="p-5 space-y-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-base sm:text-lg font-display font-bold text-[#071936] dark:text-foreground truncate group-hover:text-[#003E9E] transition-colors">
                                Base Workshop &amp; Hardware Counter
                              </h3>
                              <span className="text-xs font-mono text-[#003E9E] dark:text-[#60A5FA] font-semibold shrink-0">
                                Dantan-I
                              </span>
                            </div>
                            <p className="text-xs text-[#475569] dark:text-muted-foreground leading-relaxed">
                              Registered headquarters at {businessInfo.address}.
                              Direct counter pickup for spare parts and regional
                              dispatch hub.
                            </p>
                          </div>
                        </div>

                        <div className="px-5 pb-5 pt-3 border-t border-[#DCE5F2] dark:border-border/60 flex items-center justify-between text-xs">
                          <span className="text-[11px] font-mono text-[#003E9E] dark:text-[#60A5FA] font-semibold">
                            {businessInfo.hoursDays}: {businessInfo.hours}
                          </span>
                          <Link
                            href="/book"
                            className="text-[#003E9E] dark:text-[#60A5FA] font-bold text-xs flex items-center gap-1 group-hover:underline"
                          >
                            <span>Schedule Visit</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                      </motion.article>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Central Operations Depot Callout */}
        <div className="rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-crisp-xs">
          <div className="space-y-2.5 text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#003E9E] dark:text-[#60A5FA]">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Surrounding Blocks &amp; On-Request Field Dispatch</span>
            </div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-[#071936] dark:text-foreground leading-snug">
              Need a Plumber in a Nearby Medinipur Village or Block?
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-muted-foreground leading-relaxed">
              Our workshop at{' '}
              <strong className="text-[#071936] dark:text-foreground font-semibold">
                {businessInfo.addressShort} (PIN {businessInfo.pincode})
              </strong>{' '}
              dispatches mobile technicians equipped with solvent-weld tools,
              motorized drain cleaners, and genuine spare parts across adjacent
              localities on call.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-3 shrink-0 w-full lg:w-auto">
            <Button
              asChild
              size="lg"
              className="w-full lg:w-auto font-semibold text-xs sm:text-sm h-11 px-6 rounded-xl bg-[#003E9E] hover:bg-[#071936] text-white shadow-xs justify-center"
            >
              <Link href="/book">
                Book Visit in Your Area
                <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full lg:w-auto font-semibold text-xs sm:text-sm h-11 px-6 rounded-xl border-[#DCE5F2] dark:border-border justify-center"
            >
              <a href={`tel:${businessInfo.phone}`}>
                <Phone className="mr-2 h-4 w-4 text-[#003E9E] dark:text-[#60A5FA] shrink-0" />
                Call {businessInfo.phoneDisplay}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
