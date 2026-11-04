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
  Copy,
  Check,
  ExternalLink,
  Building2,
  Settings2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { businessInfo } from '@/lib/business-info';
import { supabase } from '@/lib/supabase';
import { ServiceAreaCardMedia } from '@/components/service-area-card-media';
import {
  WorkshopCard,
  WorkshopAdminModal,
  WorkshopRlsSyncCard,
} from '@/components/workshop-card';
import {
  fetchLiveServiceAreas,
  fetchLiveWorkshops,
  getCachedServiceAreas,
  getCachedWorkshops,
  type LiveServiceArea,
  type DbWorkshopAddress,
} from '@/lib/supabase-data';
import {
  formatWorkshopFullAddress,
  formatWorkshopShortAddress,
} from '@/lib/workshop-mapping';
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
  const [workshops, setWorkshops] = React.useState<DbWorkshopAddress[]>(
    () => getCachedWorkshops() ?? []
  );
  const [workshopRlsBlocked, setWorkshopRlsBlocked] = React.useState(false);
  const [loading, setLoading] = React.useState(
    () => !getCachedServiceAreas() && !getCachedWorkshops()
  );
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [copiedAddress, setCopiedAddress] = React.useState(false);

  // Admin session for managing Workshop records
  const [activeUserEmail, setActiveUserEmail] = React.useState<string | null>(
    null
  );
  const [showWorkshopModal, setShowWorkshopModal] = React.useState(false);
  const [editingWorkshop, setEditingWorkshop] =
    React.useState<DbWorkshopAddress | null>(null);

  const loadData = React.useCallback(async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    setError(null);
    const [areasRes, workshopsRes] = await Promise.all([
      fetchLiveServiceAreas({ forceRefresh: true }),
      fetchLiveWorkshops({ forceRefresh: true }),
    ]);
    setWorkshopRlsBlocked(Boolean(workshopsRes.rlsBlocked));
    if (areasRes.error && workshopsRes.error) {
      setError(areasRes.error);
    } else {
      setAreas(areasRes.data || []);
      setWorkshops(workshopsRes.data || []);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setActiveUserEmail(data.session?.user?.email ?? null);
    });

    Promise.all([fetchLiveServiceAreas(), fetchLiveWorkshops()]).then(
      ([areasRes, workshopsRes]) => {
        if (!active) return;
        setWorkshopRlsBlocked(Boolean(workshopsRes.rlsBlocked));
        if (!areasRes.error) {
          setAreas(areasRes.data || []);
        }
        if (!workshopsRes.error) {
          setWorkshops(workshopsRes.data || []);
        }
        setLoading(false);
      }
    );

    const workshopChannel = supabase
      .channel('public-workshop-addresses-home')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'workshop_addresses' },
        () => {
          if (active) {
            loadData(false);
          }
        }
      )
      .subscribe();

    const handleVisibilityRefresh = () => {
      if (document.visibilityState === 'visible' && active) {
        loadData(false);
      }
    };

    window.addEventListener('focus', handleVisibilityRefresh);
    document.addEventListener('visibilitychange', handleVisibilityRefresh);

    return () => {
      active = false;
      window.removeEventListener('focus', handleVisibilityRefresh);
      document.removeEventListener('visibilitychange', handleVisibilityRefresh);
      supabase.removeChannel(workshopChannel);
    };
  }, [loadData]);

  const primaryWorkshop = workshops[0] ?? null;

  const displayWorkshopName =
    primaryWorkshop?.name ||
    `${businessInfo.name} — Central Workshop & Hardware Counter`;
  const displayFullAddress = primaryWorkshop
    ? formatWorkshopFullAddress(primaryWorkshop)
    : businessInfo.address;
  const displayShortAddress = primaryWorkshop
    ? formatWorkshopShortAddress(primaryWorkshop)
    : businessInfo.addressShort;
  const displayPincode = primaryWorkshop?.postal_code || businessInfo.pincode;
  const displayCity = primaryWorkshop?.city || 'Bahardaltitia';
  const displayAddressLine1 =
    primaryWorkshop?.address_line_1 || 'Vill : - Bahardaltitia, PO : - Keshrambha';
  const displayAddressLine2 = primaryWorkshop
    ? primaryWorkshop.address_line_2 || '—'
    : 'PS : - Dantan';
  const displayLandmark = primaryWorkshop
    ? primaryWorkshop.landmark || '—'
    : 'Keshrambha';
  const displayDistrictState = primaryWorkshop
    ? `${primaryWorkshop.district}, ${primaryWorkshop.state}`
    : `${businessInfo.district}, ${businessInfo.state}`;

  const previewAreas = React.useMemo(
    () => areas.slice(0, workshops.length > 0 ? 1 : 2),
    [areas, workshops.length]
  );

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
        `${displayWorkshopName} — ${displayFullAddress} (Phone: ${businessInfo.phoneDisplay})`
      );
      setCopiedAddress(true);
      toast.success('Official Workshop Address Copied', {
        description: displayFullAddress,
      });
      setTimeout(() => setCopiedAddress(false), 2500);
    } catch {
      toast.info(displayFullAddress);
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
                {displayShortAddress} (PIN {displayPincode})
              </strong>
              , our mobile plumbing engineers serve verified localities and
              surrounding blocks across Paschim &amp; Purba Medinipur.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0">
            {activeUserEmail && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingWorkshop(null);
                  setShowWorkshopModal(true);
                }}
                className="font-semibold text-xs h-11 px-4 rounded-xl bg-white dark:bg-card border-[#003E9E]/30 text-[#003E9E] dark:text-[#60A5FA] hover:border-[#003E9E] gap-1.5"
              >
                <Settings2 className="h-3.5 w-3.5 shrink-0" />
                <span>Manage Workshops ({workshops.length})</span>
              </Button>
            )}
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

          <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
            {/* Command Header Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5 pb-5 sm:pb-6 border-b border-[#DCE5F2] dark:border-border">
              <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
                <div className="flex h-11 w-11 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-2xl bg-[#003E9E]/10 border border-[#003E9E]/20 text-[#003E9E] dark:text-[#60A5FA]">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs font-mono">
                    <span className="font-bold text-[#003E9E] dark:text-[#60A5FA] uppercase tracking-wider">
                      Official Registered Service Address &amp; HQ
                    </span>
                    <span aria-hidden="true" className="text-[#CBD5E1]">
                      ·
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold tabular-nums">
                      PIN {displayPincode}
                    </span>
                  </div>

                  <h3 className="font-display text-base sm:text-xl font-bold text-[#071936] dark:text-foreground leading-snug break-words">
                    {displayWorkshopName}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#475569] dark:text-muted-foreground font-mono leading-relaxed break-words">
                    {displayFullAddress}
                  </p>
                </div>
              </div>

              {/* Action Buttons — Balanced 2-Col on Mobile, Inline on Desktop */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAddress}
                  className="h-10 px-3 sm:px-4 rounded-xl border-[#DCE5F2] dark:border-border bg-[#F6F9FC] dark:bg-muted/30 hover:border-[#003E9E] text-[#071936] dark:text-foreground text-xs font-semibold gap-1.5 justify-center whitespace-nowrap"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
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
                  className="h-10 px-3 sm:px-4 rounded-xl border-[#DCE5F2] dark:border-border bg-white dark:bg-card hover:border-[#003E9E] text-[#003E9E] dark:text-[#60A5FA] text-xs font-semibold gap-1.5 justify-center whitespace-nowrap"
                >
                  <a
                    href={businessInfo.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Open Google Maps</span>
                  </a>
                </Button>
              </div>
            </div>

            {/* 6-Tile Structured Address Breakdown Grid (1-to-1 with Admin Panel) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
              <div className="rounded-xl bg-[#F6F9FC] dark:bg-muted/25 border border-[#DCE5F2] dark:border-border p-3 sm:p-3.5 min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block truncate">
                  Address Line 1
                </span>
                <span className="font-display font-bold text-xs sm:text-sm text-[#071936] dark:text-foreground mt-1 block truncate">
                  {displayAddressLine1}
                </span>
              </div>

              <div className="rounded-xl bg-[#F6F9FC] dark:bg-muted/25 border border-[#DCE5F2] dark:border-border p-3 sm:p-3.5 min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block truncate">
                  Address Line 2
                </span>
                <span className="font-display font-bold text-xs sm:text-sm text-[#071936] dark:text-foreground mt-1 block truncate">
                  {displayAddressLine2}
                </span>
              </div>

              <div className="rounded-xl bg-[#F6F9FC] dark:bg-muted/25 border border-[#DCE5F2] dark:border-border p-3 sm:p-3.5 min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block truncate">
                  Landmark
                </span>
                <span className="font-display font-bold text-xs sm:text-sm text-[#071936] dark:text-foreground mt-1 block truncate">
                  {displayLandmark}
                </span>
              </div>

              <div className="rounded-xl bg-[#F6F9FC] dark:bg-muted/25 border border-[#DCE5F2] dark:border-border p-3 sm:p-3.5 min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block truncate">
                  City / Locality
                </span>
                <span className="font-display font-bold text-xs sm:text-sm text-[#071936] dark:text-foreground mt-1 block truncate">
                  {displayCity}
                </span>
              </div>

              <div className="rounded-xl bg-[#F6F9FC] dark:bg-muted/25 border border-[#DCE5F2] dark:border-border p-3 sm:p-3.5 min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block truncate">
                  District &amp; State
                </span>
                <span className="font-display font-bold text-xs sm:text-sm text-[#071936] dark:text-foreground mt-1 block truncate">
                  {displayDistrictState}
                </span>
              </div>

              <div className="rounded-xl bg-[#003E9E]/5 dark:bg-[#003E9E]/20 border border-[#003E9E]/25 p-3 sm:p-3.5 min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#003E9E] dark:text-[#60A5FA] block truncate">
                  Postal PIN Code
                </span>
                <span className="font-mono font-extrabold text-sm sm:text-base text-[#003E9E] dark:text-[#60A5FA] mt-0.5 block tabular-nums">
                  {displayPincode}
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
                <div className="h-48 w-full bg-slate-100 dark:bg-slate-800/70 rounded-xl" />
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
              Unable to Load Live Workshop &amp; Service Areas
            </h3>
            <p className="text-xs text-[#475569]">{error}</p>
            <Button
              onClick={() => loadData(true)}
              size="sm"
              variant="outline"
              className="rounded-xl text-xs font-semibold"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Retry Connection
            </Button>
          </div>
        )}

        {/* RLS Setup & Admin Sync Card when `anon` SELECT on `public.workshop_addresses` is pending */}
        {!loading && workshopRlsBlocked && workshops.length === 0 && (
          <WorkshopRlsSyncCard onSynced={() => loadData(false)} />
        )}

        {/* Live Workshop Cards + Verified Regional Coverage Cards */}
        {!loading && !error && (workshops.length > 0 || areas.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-8 items-stretch">
            {/* Active Workshop Cards from `public.workshop_addresses` & `Plumbing Assets/workshop` */}
            {workshops.map((workshop, wIdx) => (
              <WorkshopCard
                key={workshop.id || `ws-${wIdx}`}
                workshop={workshop}
                index={wIdx}
                priority={wIdx === 0}
                canManage={Boolean(activeUserEmail)}
                onEdit={(w) => {
                  setEditingWorkshop(w);
                  setShowWorkshopModal(true);
                }}
              />
            ))}

            {/* Verified Regional Locality Coverage Cards */}
            {previewAreas.map((area, areaIdx) => (
              <motion.div
                key={area.id || `${area.locality}-${areaIdx}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                whileHover={{ y: -4 }}
                transition={{
                  duration: 0.38,
                  delay: (workshops.length + areaIdx) * 0.08,
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
                      priority={areaIdx === 0 && workshops.length === 0}
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
          </div>
        )}
      </div>

      {/* Admin Workshop Manager Modal */}
      <WorkshopAdminModal
        open={showWorkshopModal}
        onClose={() => {
          setShowWorkshopModal(false);
          setEditingWorkshop(null);
        }}
        onSaved={() => loadData(false)}
        initialEditingWorkshop={editingWorkshop}
      />
    </section>
  );
}
