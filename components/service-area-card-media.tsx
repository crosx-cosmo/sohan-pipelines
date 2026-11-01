'use client';

import * as React from 'react';
import Image from 'next/image';
import { ImageOff, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceAreaCardMediaProps {
  title: string;
  subtitle?: string | null;
  badgeLeft: string;
  badgeRight: string;
  imageUrl?: string | null;
  alt?: string;
  sizes?: string;
  variant?: 'area' | 'workshop-hq';
  priority?: boolean;
  objectPosition?: string;
  className?: string;
}

/**
 * Consistent 16:10 visual stage for Service Area & Base Workshop HQ Cards.
 * - For `variant="area"`: Loads service-area images strictly by `area.id` from
 *   "spare-part-images/catalog-service-areas/" with Next.js `<Image>` optimization,
 *   responsive `sizes`, and descriptive `alt` text based on the locality name.
 * - When `imageUrl` is null (or for `variant="workshop-hq"`): Renders a clean
 *   Empty Image State with zero default or fallback images.
 */
export function ServiceAreaCardMedia({
  title,
  subtitle,
  badgeLeft,
  badgeRight,
  imageUrl,
  alt,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 48vw, (max-width: 1280px) 32vw, 400px',
  variant = 'area',
  priority = false,
  objectPosition = '50% 48%',
  className,
}: ServiceAreaCardMediaProps) {
  const [failedUrl, setFailedUrl] = React.useState<string | null>(null);
  const [loadedUrl, setLoadedUrl] = React.useState<string | null>(null);

  const effectiveImageUrl =
    variant === 'workshop-hq' ? imageUrl || null : imageUrl;
  const showImage = Boolean(
    effectiveImageUrl && failedUrl !== effectiveImageUrl
  );
  const isImageLoading = Boolean(
    showImage && effectiveImageUrl && loadedUrl !== effectiveImageUrl
  );

  const descriptiveAlt =
    alt?.trim() ||
    `${title}${subtitle ? ` (${subtitle})` : ''} — Sohan Pipeline's Verified Plumbing & Pipeline Service Coverage Area`;

  return (
    <div
      className={cn(
        'relative w-full aspect-[16/10] overflow-hidden border-b border-[#DCE5F2] dark:border-[#1E365D] bg-[#F8FAFC] dark:bg-[#051024] select-none shrink-0',
        className
      )}
    >
      {showImage && effectiveImageUrl ? (
        <>
          <meta itemProp="image" content={effectiveImageUrl} />
          {isImageLoading && (
            <div
              aria-hidden="true"
              className="absolute inset-0 z-10 bg-slate-100/85 dark:bg-slate-900/85 animate-pulse"
            />
          )}
          <Image
            src={effectiveImageUrl}
            alt={descriptiveAlt}
            fill
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            decoding="async"
            quality={85}
            sizes={sizes}
            referrerPolicy="no-referrer"
            style={{ objectPosition }}
            onLoad={() => setLoadedUrl(effectiveImageUrl)}
            onError={() => setFailedUrl(effectiveImageUrl)}
            className={cn(
              'object-cover transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105',
              isImageLoading ? 'opacity-0 scale-98' : 'opacity-100 scale-100'
            )}
          />
          {/* Edge-only gradient scrim preserving the central subject */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071936]/85 via-[#071936]/10 to-[#071936]/45"
          />
        </>
      ) : (
        /* Clean Empty State when this Service Area ID (or Base Workshop) has no uploaded image */
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-[#F8FAFC] dark:bg-[#051024]">
          <div className="flex flex-col items-center justify-center text-center px-5 py-3.5 rounded-2xl border border-dashed border-[#CBD5E1] dark:border-[#1E3A6D] bg-white/75 dark:bg-[#0A2246]/40 max-w-[250px]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1F5F9] dark:bg-[#0A2246] text-[#64748B] dark:text-slate-400 border border-[#E2E8F0] dark:border-[#1E3A6D] mb-1.5">
              <ImageOff className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold text-[#334155] dark:text-slate-200">
              {variant === 'workshop-hq'
                ? 'Base Workshop · No Image Uploaded'
                : 'No Service Area Image Uploaded'}
            </p>
            <p className="text-[10px] font-mono text-[#64748B] dark:text-slate-400 mt-0.5">
              Empty Image State
            </p>
          </div>
        </div>
      )}

      {/* Top Metadata Strip */}
      <div className="absolute top-3.5 left-4 right-4 z-10 flex items-center justify-between gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-bold shadow-xs',
            showImage
              ? 'bg-[#071936]/85 text-white border border-white/15'
              : 'bg-white/95 dark:bg-[#0A2246]/90 text-[#071936] dark:text-white border border-[#DCE5F2] dark:border-white/15'
          )}
        >
          <MapPin className="h-3 w-3 text-[#003E9E] dark:text-[#60A5FA] shrink-0" />
          <span className="truncate">{badgeLeft}</span>
        </span>

        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-lg backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-bold shadow-xs tabular-nums shrink-0',
            showImage
              ? 'bg-[#071936]/85 text-emerald-300 border border-white/15'
              : 'bg-white/95 dark:bg-[#0A2246]/90 text-emerald-700 dark:text-emerald-300 border border-[#DCE5F2] dark:border-white/15'
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>{badgeRight}</span>
        </span>
      </div>

      {/* Bottom Title & Subtitle Anchor */}
      <div className="absolute bottom-3.5 left-4 right-4 z-10 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h3
            className={cn(
              'font-display font-bold text-lg sm:text-xl leading-snug truncate',
              showImage
                ? 'text-white drop-shadow-xs'
                : 'text-[#071936] dark:text-white'
            )}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              className={cn(
                'text-xs font-mono mt-0.5 truncate',
                showImage
                  ? 'text-white/90 drop-shadow-2xs'
                  : 'text-[#475569] dark:text-slate-300'
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

