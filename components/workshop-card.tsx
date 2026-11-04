'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { businessInfo } from '@/lib/business-info';
import { supabase } from '@/lib/supabase';
import {
  clearWorkshopsCache,
  fetchLiveWorkshops,
  type DbWorkshopAddress,
} from '@/lib/supabase-data';
import {
  WORKSHOP_BUCKET_NAME,
  WORKSHOP_FOLDER_NAME,
  formatWorkshopFullAddress,
  formatWorkshopShortAddress,
  getWorkshopImageUrl,
  normalizeWorkshopStoragePath,
  safelyRemoveUnusedWorkshopImage,
  uploadWorkshopImageToBucket,
  validateWorkshopImageFile,
} from '@/lib/workshop-mapping';
import { cn } from '@/lib/utils';
import { luxuryEasing } from '@/lib/motion';

interface WorkshopCardProps {
  workshop: DbWorkshopAddress;
  index?: number;
  priority?: boolean;
  canManage?: boolean;
  onEdit?: (workshop: DbWorkshopAddress) => void;
  className?: string;
}

/**
 * Dynamic Workshop / Regional Dispatch HQ Card connected to `public.workshop_addresses`
 * and `"Plumbing Assets/workshop"`.
 * - Displays full-width 16:9 (`aspect-video`) image with `object-fit: cover` and centered positioning.
 * - Mobile height ~205–225px, balanced width & controlled height on desktop.
 * - When a Workshop has no uploaded image, displays a compact premium fallback header
 *   instead of a massive empty image box.
 */
export function WorkshopCard({
  workshop,
  index = 0,
  priority = false,
  canManage = false,
  onEdit,
  className,
}: WorkshopCardProps) {
  const [failedUrl, setFailedUrl] = React.useState<string | null>(null);
  const [loadedUrl, setLoadedUrl] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const effectiveImageUrl = React.useMemo(() => {
    if (workshop.image_url?.trim()) return workshop.image_url.trim();
    if (workshop.image_path?.trim()) {
      return getWorkshopImageUrl(workshop.image_path, workshop.updated_at);
    }
    return null;
  }, [workshop.image_url, workshop.image_path, workshop.updated_at]);

  const showImage = Boolean(
    effectiveImageUrl && failedUrl !== effectiveImageUrl
  );
  const isImageLoading = Boolean(
    showImage && effectiveImageUrl && loadedUrl !== effectiveImageUrl
  );

  const fullAddress = React.useMemo(
    () => formatWorkshopFullAddress(workshop) || businessInfo.address,
    [workshop]
  );

  const shortAddress = React.useMemo(
    () => formatWorkshopShortAddress(workshop) || businessInfo.addressShort,
    [workshop]
  );

  const handleCopyWorkshopAddress = async () => {
    const copyString = `${workshop.name} — ${fullAddress} (Phone: ${businessInfo.phoneDisplay})`;
    try {
      await navigator.clipboard.writeText(copyString);
      setCopied(true);
      toast.success('Workshop Address Copied', {
        description: fullAddress,
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.info(fullAddress);
    }
  };

  return (
    <motion.article
      itemScope
      itemType="https://schema.org/LocalBusiness"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={{ y: -4 }}
      transition={{
        duration: 0.36,
        delay: Math.min(index * 0.08, 0.24),
        ease: luxuryEasing,
      }}
      style={{ willChange: 'transform' }}
      className={cn('h-full flex flex-col', className)}
    >
      <Card className="group h-full p-0 gap-0 rounded-2xl border border-[#DCE5F2] dark:border-border bg-white dark:bg-card shadow-crisp-sm hover:shadow-crisp-lg hover:border-[#003E9E]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden">
        <div>
          {/* Top Visual Stage: 16:9 Full-Width Workshop Image OR Compact Premium Fallback */}
          {showImage && effectiveImageUrl ? (
            <div className="relative w-full h-[205px] sm:h-[225px] md:h-auto md:aspect-video lg:max-h-[260px] overflow-hidden border-b border-[#DCE5F2] dark:border-[#1E365D] bg-[#071936] select-none shrink-0">
              <meta itemProp="image" content={effectiveImageUrl} />
              {isImageLoading && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-10 bg-slate-200/80 dark:bg-slate-900/80 animate-pulse"
                />
              )}
              <Image
                src={effectiveImageUrl}
                alt={`${workshop.name} — ${workshop.city}, ${workshop.district} (PIN ${workshop.postal_code})`}
                fill
                priority={priority}
                loading={priority ? undefined : 'lazy'}
                decoding="async"
                quality={88}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                referrerPolicy="no-referrer"
                onLoad={() => setLoadedUrl(effectiveImageUrl)}
                onError={() => setFailedUrl(effectiveImageUrl)}
                className={cn(
                  'object-cover object-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105',
                  isImageLoading
                    ? 'opacity-0 scale-98'
                    : 'opacity-100 scale-100'
                )}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071936]/90 via-[#071936]/20 to-[#071936]/45"
              />

              {/* Top Badges */}
              <div className="absolute top-3.5 left-4 right-4 z-10 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#071936]/85 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-bold text-white border border-white/15 shadow-xs">
                  <MapPin className="h-3 w-3 text-[#60A5FA] shrink-0" />
                  <span className="truncate">
                    HQ · PIN {workshop.postal_code || businessInfo.pincode}
                  </span>
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#071936]/85 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-300 border border-white/15 shadow-xs shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Active Workshop</span>
                </span>
              </div>

              {/* Bottom Title & Location Overlay */}
              <div className="absolute bottom-3.5 left-4 right-4 z-10 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <h3
                    itemProp="name"
                    className="font-display font-bold text-lg sm:text-xl text-white leading-snug truncate drop-shadow-xs"
                  >
                    {workshop.name}
                  </h3>
                  <p className="text-xs font-mono text-white/90 mt-0.5 truncate drop-shadow-2xs">
                    {shortAddress}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Compact Premium Fallback Header when Workshop has no uploaded image */
            <div className="relative w-full overflow-hidden border-b border-[#DCE5F2] dark:border-[#1E365D] bg-gradient-to-br from-[#071936] via-[#0B2552] to-[#003E9E] px-5 py-4 sm:px-6 sm:py-5 select-none shrink-0">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-grid-blueprint opacity-15"
              />
              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-bold text-white border border-white/15">
                    <MapPin className="h-3 w-3 text-[#60A5FA] shrink-0" />
                    <span className="truncate">
                      HQ · PIN {workshop.postal_code || businessInfo.pincode}
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-300 border border-emerald-400/25 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Active Workshop</span>
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white shadow-xs">
                    <Building2 className="h-5 w-5 text-[#60A5FA]" />
                  </div>
                  <div className="min-w-0">
                    <h3
                      itemProp="name"
                      className="font-display font-bold text-base sm:text-lg text-white leading-snug truncate"
                    >
                      {workshop.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-200/90 mt-0.5 truncate">
                      {shortAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Workshop Details Body */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Complete Address & Landmark Box */}
            <div
              itemProp="address"
              itemScope
              itemType="https://schema.org/PostalAddress"
              className="rounded-xl border border-[#DCE5F2] dark:border-border bg-[#F6F9FC] dark:bg-muted/25 p-3.5 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#003E9E] dark:text-[#60A5FA] font-bold">
                  Complete Registered Workshop Address
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopyWorkshopAddress}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#003E9E] dark:text-[#60A5FA] hover:underline cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <span aria-hidden="true" className="text-[#CBD5E1]">
                    ·
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${workshop.name}, ${fullAddress}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#003E9E] dark:text-[#60A5FA] hover:underline"
                  >
                    <span>Maps</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <p
                itemProp="streetAddress"
                className="text-xs sm:text-sm font-semibold text-[#071936] dark:text-foreground leading-relaxed"
              >
                {workshop.address_line_1}
                {workshop.address_line_2 ? `, ${workshop.address_line_2}` : ''}
              </p>

              {workshop.landmark && (
                <p className="text-xs text-[#475569] dark:text-muted-foreground font-mono">
                  Landmark:{' '}
                  <strong className="text-[#071936] dark:text-foreground font-semibold">
                    {workshop.landmark}
                  </strong>
                </p>
              )}

              <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-[#475569] dark:text-muted-foreground">
                <span itemProp="addressLocality">
                  City:{' '}
                  <strong className="text-[#071936] dark:text-foreground">
                    {workshop.city}
                  </strong>
                </span>
                <span>·</span>
                <span>
                  Dist:{' '}
                  <strong className="text-[#071936] dark:text-foreground">
                    {workshop.district}
                  </strong>
                </span>
                <span>·</span>
                <span itemProp="addressRegion">
                  State:{' '}
                  <strong className="text-[#071936] dark:text-foreground">
                    {workshop.state}
                  </strong>
                </span>
                <span>·</span>
                <span
                  itemProp="postalCode"
                  className="text-[#003E9E] dark:text-[#60A5FA] font-bold tabular-nums"
                >
                  PIN: {workshop.postal_code}
                </span>
              </div>
            </div>

            {/* Operating Details Grid */}
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
                  Scheduled &amp; urgent dispatch from {workshop.city}
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
        </div>

        {/* Card Footer: Contact & Technician Scheduling Actions */}
        <div className="px-5 sm:px-6 pb-5 pt-3.5 border-t border-[#DCE5F2] dark:border-border flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <a
              href={`tel:${businessInfo.phone}`}
              className="font-mono font-bold text-[#071936] dark:text-foreground hover:text-[#003E9E] transition-colors inline-flex items-center gap-1.5 tabular-nums"
            >
              <Phone className="h-3.5 w-3.5 text-[#003E9E] dark:text-[#60A5FA] shrink-0" />
              <span>{businessInfo.phoneDisplay}</span>
            </a>

            {canManage && onEdit && (
              <button
                type="button"
                onClick={() => onEdit(workshop)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#003E9E] dark:text-[#60A5FA] hover:underline cursor-pointer"
              >
                <Pencil className="h-3 w-3" />
                <span>Edit Workshop</span>
              </button>
            )}
          </div>

          <Link
            href={`/book?locality=${encodeURIComponent(
              workshop.city || 'Bahardaltitia'
            )}&pincode=${encodeURIComponent(
              workshop.postal_code || businessInfo.pincode
            )}`}
            className="font-bold text-[#003E9E] dark:text-[#60A5FA] hover:underline inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>Schedule Technician Visit</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Card>
    </motion.article>
  );
}

interface WorkshopRlsSyncCardProps {
  onSynced: () => void;
}

/**
 * Shown when `public.workshop_addresses` returns `42501 permission denied` for `anon`
 * before the SQL grant is executed in Supabase SQL Editor.
 * Lets the admin either copy the SQL script in 1 click OR sign in with Admin credentials
 * to immediately pull and sync the live Admin Panel Workshop address.
 */
export function WorkshopRlsSyncCard({ onSynced }: WorkshopRlsSyncCardProps) {
  const [copiedSql, setCopiedSql] = React.useState(false);
  const [showSignIn, setShowSignIn] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [signingIn, setSigningIn] = React.useState(false);

  const handleCopySql = async () => {
    const { WORKSHOP_RLS_SETUP_SQL } = await import('@/lib/workshop-mapping');
    try {
      await navigator.clipboard.writeText(WORKSHOP_RLS_SETUP_SQL);
      setCopiedSql(true);
      toast.success('Supabase Workshop SQL Copied!', {
        description:
          'Paste and run it in your Supabase SQL Editor to enable public read access for workshop_addresses.',
      });
      setTimeout(() => setCopiedSql(false), 3000);
    } catch {
      toast.error('Unable to copy SQL automatically.');
    }
  };

  const handleAdminSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setSigningIn(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        toast.error(`Admin Sign-In Failed: ${error.message}`);
        return;
      }
      clearWorkshopsCache();
      const res = await fetchLiveWorkshops({ forceRefresh: true });
      toast.success(
        `Synced ${res.data.length} Workshop address record(s) from Admin Panel!`
      );
      setShowSignIn(false);
      onSynced();
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <Card className="p-5 sm:p-6 rounded-2xl border border-[#003E9E]/30 bg-white dark:bg-card shadow-crisp-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#003E9E]/10 text-[#003E9E] dark:text-[#60A5FA]">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-[#071936] dark:text-foreground">
              Connect Live Admin Workshop Address (`public.workshop_addresses`)
            </h3>
            <p className="text-xs text-[#475569] dark:text-muted-foreground mt-0.5">
              Supabase `anon` SELECT permission is required on `public.workshop_addresses` so your exact Admin Panel Workshop address displays publicly. Run the SQL in Supabase SQL Editor or sign in as Admin below to sync immediately.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            type="button"
            size="sm"
            onClick={handleCopySql}
            className="h-9 px-3.5 rounded-xl bg-[#003E9E] hover:bg-[#071936] text-white text-xs font-semibold gap-1.5"
          >
            {copiedSql ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>SQL Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Supabase SQL</span>
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowSignIn((v) => !v)}
            className="h-9 px-3.5 rounded-xl text-xs font-semibold"
          >
            {showSignIn ? 'Hide Admin Sync' : 'Admin Sign-In & Sync'}
          </Button>
        </div>
      </div>

      {showSignIn && (
        <form
          onSubmit={handleAdminSync}
          className="pt-3 border-t border-border/70 grid grid-cols-1 sm:grid-cols-3 gap-2.5"
        >
          <Input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-9 text-xs"
            required
          />
          <Input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-9 text-xs"
            required
          />
          <Button
            type="submit"
            disabled={signingIn}
            size="sm"
            className="h-9 rounded-xl text-xs font-semibold bg-[#003E9E] hover:bg-[#071936] text-white"
          >
            {signingIn ? 'Syncing Workshop...' : 'Sign In & Sync Address'}
          </Button>
        </form>
      )}
    </Card>
  );
}

interface WorkshopAdminModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialEditingWorkshop?: DbWorkshopAddress | null;
}

/**
 * Admin Workshop Addresses Manager Modal connected directly to:
 * - Database table: `public.workshop_addresses`
 * - Supabase Storage: Bucket `"Plumbing Assets"`, Folder `"workshop"`,
 *   Path format `"workshop/{unique-workshop-id}.{file-extension}"`
 */
export function WorkshopAdminModal({
  open,
  onClose,
  onSaved,
  initialEditingWorkshop = null,
}: WorkshopAdminModalProps) {
  const [allWorkshops, setAllWorkshops] = React.useState<DbWorkshopAddress[]>(
    []
  );
  const [loadingList, setLoadingList] = React.useState(false);
  const [editingWorkshop, setEditingWorkshop] =
    React.useState<DbWorkshopAddress | null>(initialEditingWorkshop);
  const [isFormMode, setIsFormMode] = React.useState(
    Boolean(initialEditingWorkshop)
  );

  // Form fields matching exact `public.workshop_addresses` columns
  const [name, setName] = React.useState('');
  const [addressLine1, setAddressLine1] = React.useState('');
  const [addressLine2, setAddressLine2] = React.useState('');
  const [landmark, setLandmark] = React.useState('');
  const [city, setCity] = React.useState('');
  const [district, setDistrict] = React.useState('West Medinipur');
  const [state, setState] = React.useState('West Bengal');
  const [postalCode, setPostalCode] = React.useState('721451');
  const [isActive, setIsActive] = React.useState(true);
  const [imagePath, setImagePath] = React.useState<string | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const loadAllWorkshops = React.useCallback(async () => {
    setLoadingList(true);
    clearWorkshopsCache();
    const res = await fetchLiveWorkshops({
      forceRefresh: true,
      includeInactive: true,
    });
    setAllWorkshops(res.data || []);
    setLoadingList(false);
  }, []);

  const populateForm = React.useCallback(
    (w: DbWorkshopAddress | null) => {
      setEditingWorkshop(w);
      setName(w?.name || '');
      setAddressLine1(w?.address_line_1 || '');
      setAddressLine2(w?.address_line_2 || '');
      setLandmark(w?.landmark || '');
      setCity(w?.city || '');
      setDistrict(w?.district || 'West Medinipur');
      setState(w?.state || 'West Bengal');
      setPostalCode(w?.postal_code || '721451');
      setIsActive(w ? Boolean(w.is_active) : true);
      setImagePath(w?.image_path || null);
      setSelectedFile(null);
      setRemoveCurrentImage(false);
      setPreviewUrl(
        w
          ? w.image_url || getWorkshopImageUrl(w.image_path, w.updated_at)
          : null
      );
    },
    []
  );

  React.useEffect(() => {
    if (!open) return;
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      loadAllWorkshops();
      if (initialEditingWorkshop) {
        populateForm(initialEditingWorkshop);
        setIsFormMode(true);
      } else {
        setIsFormMode(false);
      }
    });
    return () => {
      active = false;
    };
  }, [open, initialEditingWorkshop, loadAllWorkshops, populateForm]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const validationErr = validateWorkshopImageFile(file);
    if (validationErr) {
      toast.error(validationErr);
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    setRemoveCurrentImage(false);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };

  const handleSaveWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !addressLine1.trim() || !city.trim() || !postalCode.trim()) {
      toast.error(
        'Workshop Name, Address Line 1, City, and PIN Code are required.'
      );
      return;
    }

    setSaving(true);
    try {
      const targetId =
        editingWorkshop?.id ||
        (typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `ws-${Date.now()}`);

      const previousImagePath = editingWorkshop?.image_path || null;
      let nextImagePath: string | null = removeCurrentImage
        ? null
        : imagePath
          ? normalizeWorkshopStoragePath(imagePath) || imagePath
          : null;

      // 1. If a new photo was selected, upload it FIRST to "Plumbing Assets/workshop/{id}.{ext}"
      if (selectedFile) {
        const uploadRes = await uploadWorkshopImageToBucket(
          selectedFile,
          targetId
        );
        if (uploadRes.error || !uploadRes.imagePath) {
          toast.error(
            uploadRes.error ||
              `Failed to upload image to "${WORKSHOP_BUCKET_NAME}/${WORKSHOP_FOLDER_NAME}".`
          );
          setSaving(false);
          return;
        }
        nextImagePath = uploadRes.imagePath;
      }

      const nowIso = new Date().toISOString();
      const dbPayload = {
        name: name.trim(),
        address_line_1: addressLine1.trim(),
        address_line_2: addressLine2.trim() || null,
        landmark: landmark.trim() || null,
        city: city.trim(),
        district: district.trim() || 'West Medinipur',
        state: state.trim() || 'West Bengal',
        postal_code: postalCode.trim(),
        is_active: Boolean(isActive),
        image_path: nextImagePath,
        updated_at: nowIso,
      };

      // 2. Update or Insert the record in `public.workshop_addresses`
      if (editingWorkshop) {
        const { error: updateErr } = await supabase
          .from('workshop_addresses')
          .update(dbPayload)
          .eq('id', editingWorkshop.id);

        if (updateErr) {
          toast.error(`Failed to update Workshop: ${updateErr.message}`);
          setSaving(false);
          return;
        }
      } else {
        const { error: insertErr } = await supabase
          .from('workshop_addresses')
          .insert({
            id: targetId,
            ...dbPayload,
          });

        if (insertErr) {
          toast.error(`Failed to create Workshop: ${insertErr.message}`);
          setSaving(false);
          return;
        }
      }

      // 3. Safely delete old unused image if replaced with a different path or removed
      const normalizedOld = normalizeWorkshopStoragePath(previousImagePath);
      const normalizedNew = normalizeWorkshopStoragePath(nextImagePath);
      if (
        normalizedOld &&
        (!normalizedNew ||
          normalizedOld.toLowerCase() !== normalizedNew.toLowerCase())
      ) {
        await safelyRemoveUnusedWorkshopImage(
          normalizedOld,
          allWorkshops,
          targetId
        );
      }

      toast.success(
        editingWorkshop
          ? `Updated Workshop "${dbPayload.name}"`
          : `Added Workshop "${dbPayload.name}"`
      );

      clearWorkshopsCache();
      await loadAllWorkshops();
      onSaved();
      setIsFormMode(false);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (w: DbWorkshopAddress) => {
    const nextActive = !w.is_active;
    const { error } = await supabase
      .from('workshop_addresses')
      .update({
        is_active: nextActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', w.id);

    if (error) {
      toast.error(`Unable to update status: ${error.message}`);
      return;
    }

    toast.success(
      `"${w.name}" marked as ${nextActive ? 'Active' : 'Inactive'}`
    );
    clearWorkshopsCache();
    await loadAllWorkshops();
    onSaved();
  };

  const handleDeleteWorkshop = async (w: DbWorkshopAddress) => {
    const { error } = await supabase
      .from('workshop_addresses')
      .delete()
      .eq('id', w.id);

    if (error) {
      toast.error(`Unable to delete Workshop: ${error.message}`);
      return;
    }

    if (w.image_path) {
      await safelyRemoveUnusedWorkshopImage(w.image_path, allWorkshops, w.id);
    }

    toast.success(`Deleted Workshop "${w.name}"`);
    clearWorkshopsCache();
    await loadAllWorkshops();
    onSaved();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            role="dialog"
            aria-modal="true"
            aria-label="Workshop Addresses Manager"
            className="relative z-10 w-full max-w-2xl rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-border/70 pb-3.5">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
                  {isFormMode
                    ? editingWorkshop
                      ? 'Edit Workshop Address'
                      : 'Add Workshop Address'
                    : 'Workshop Addresses'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Connected to `public.workshop_addresses` &amp; `Plumbing Assets/workshop`
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!isFormMode && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      populateForm(null);
                      setIsFormMode(true);
                    }}
                    className="h-8 px-3 rounded-xl text-xs font-semibold gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Workshop</span>
                  </Button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!isFormMode ? (
              <div className="space-y-3">
                {loadingList ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    Loading Workshop addresses...
                  </div>
                ) : allWorkshops.length === 0 ? (
                  <div className="py-8 text-center space-y-3">
                    <p className="text-xs text-muted-foreground">
                      No Workshop records found in `public.workshop_addresses`.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        populateForm(null);
                        setIsFormMode(true);
                      }}
                      className="rounded-xl text-xs font-semibold"
                    >
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      Add First Workshop Address
                    </Button>
                  </div>
                ) : (
                  allWorkshops.map((w) => (
                    <div
                      key={w.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border/80 bg-muted/20 p-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-sm text-foreground truncate">
                            {w.name}
                          </span>
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-md text-[10px] font-mono font-bold',
                              w.is_active
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {w.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatWorkshopFullAddress(w)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(w)}
                          className="h-8 px-2.5 text-xs rounded-xl"
                        >
                          {w.is_active ? 'Set Inactive' : 'Set Active'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            populateForm(w);
                            setIsFormMode(true);
                          }}
                          className="h-8 px-2.5 text-xs rounded-xl gap-1"
                        >
                          <Pencil className="h-3 w-3" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteWorkshop(w)}
                          className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10 rounded-xl"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}

                <div className="pt-2 flex justify-between items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={loadAllWorkshops}
                    className="h-8 text-xs rounded-xl gap-1.5"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Refresh</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    className="h-8 text-xs rounded-xl"
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveWorkshop} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    Workshop Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Sohan Pipeline's Central Workshop & Dispatch HQ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9.5 text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">
                      Address Line 1 *
                    </label>
                    <Input
                      type="text"
                      placeholder="Vill : - Bahardaltitia, PO : - Keshrambha"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="h-9.5 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">
                      Address Line 2
                    </label>
                    <Input
                      type="text"
                      placeholder="PS : - Dantan"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      className="h-9.5 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">
                      Landmark
                    </label>
                    <Input
                      type="text"
                      placeholder="Near Keshrambha Market"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="h-9.5 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">
                      City / Locality *
                    </label>
                    <Input
                      type="text"
                      placeholder="Bahardaltitia"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-9.5 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">
                      District *
                    </label>
                    <Input
                      type="text"
                      placeholder="West Medinipur"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="h-9.5 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">
                      State *
                    </label>
                    <Input
                      type="text"
                      placeholder="West Bengal"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="h-9.5 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">
                      PIN Code *
                    </label>
                    <Input
                      type="text"
                      placeholder="721451"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="h-9.5 text-xs font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Active Workshop Toggle */}
                <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-muted/20 px-4 py-3">
                  <div>
                    <span className="text-xs font-semibold text-foreground block">
                      Active Workshop
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Only active workshops are displayed on the public website
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#003E9E] cursor-pointer"
                  />
                </div>

                {/* Workshop Photo Upload & Preview */}
                <div className="space-y-3 rounded-2xl border border-border/80 bg-muted/25 p-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5 text-primary" />
                      <span>
                        Workshop Photo (`{WORKSHOP_BUCKET_NAME}/{WORKSHOP_FOLDER_NAME}/`)
                      </span>
                    </label>
                    {previewUrl && !removeCurrentImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setRemoveCurrentImage(true);
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                        className="text-[11px] font-semibold text-destructive hover:underline cursor-pointer"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>

                  {previewUrl && !removeCurrentImage && (
                    <div className="relative w-full aspect-video max-h-[190px] rounded-xl overflow-hidden border border-border bg-slate-950">
                      <Image
                        src={previewUrl}
                        alt="Workshop preview"
                        fill
                        sizes="480px"
                        referrerPolicy="no-referrer"
                        className="object-cover object-center"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFormMode(false)}
                    className="rounded-xl text-xs h-9"
                  >
                    Back to List
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    size="sm"
                    className="rounded-xl text-xs font-semibold h-9 px-4"
                  >
                    {saving
                      ? 'Saving Workshop...'
                      : editingWorkshop
                        ? 'Save Workshop Changes'
                        : 'Create Workshop'}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
