'use client';

import * as React from 'react';
import Image from 'next/image';
import { Clock, ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardMediaProps {
  name: string;
  category: string;
  duration?: string | null;
  price?: number | null;
  indexNumber?: number;
  index?: number;
  imageUrl?: string | null;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  objectPosition?: string;
  className?: string;
}

/**
 * Consistent 16:10 visual stage for every Service Card across Homepage and /services.
 * - Loads a service's own matched image strictly by `service.id` from "spare-part-images/catalog-services/"
 *   using Next.js `<Image>` optimization, responsive `sizes`, and descriptive `alt` text based on `name`.
 * - Never sets any fallback or default image. When a service has no image uploaded for its ID,
 *   renders a clean Empty Image State.
 */
export function ServiceCardMedia({
  name,
  category,
  duration,
  price,
  indexNumber,
  index,
  imageUrl,
  alt,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 48vw, (max-width: 1280px) 32vw, 400px',
  priority = false,
  objectPosition = '50% 46%',
  className,
}: ServiceCardMediaProps) {
  const [failedUrl, setFailedUrl] = React.useState<string | null>(null);
  const [loadedUrl, setLoadedUrl] = React.useState<string | null>(null);

  const showImage = Boolean(imageUrl && failedUrl !== imageUrl);
  const isImageLoading = Boolean(
    showImage && imageUrl && loadedUrl !== imageUrl
  );

  const resolvedIndex =
    indexNumber !== undefined
      ? indexNumber
      : index !== undefined
      ? index + 1
      : 1;
  const formattedIndex = String(resolvedIndex).padStart(2, '0');
  const durationText = duration
    ? /^\d+$/.test(String(duration).trim())
      ? `${duration} min`
      : duration
    : null;

  const formattedCategory = category
    ? `${category.charAt(0).toUpperCase()}${category.slice(1)}`
    : 'Plumbing';
  const descriptiveAlt =
    alt?.trim() ||
    `${name} — ${formattedCategory} Plumbing & Pipeline Engineering Service by Sohan Pipeline's`;

  return (
    <div
      className={cn(
        'relative w-full aspect-[16/10] overflow-hidden bg-[#F8FAFC] dark:bg-[#051024] border-b border-[#DCE5F2] dark:border-[#1E365D] select-none shrink-0',
        className
      )}
    >
      {showImage && imageUrl ? (
        <>
          <meta itemProp="image" content={imageUrl} />
          {isImageLoading && (
            <div
              aria-hidden="true"
              className="absolute inset-0 z-10 bg-slate-100/85 dark:bg-slate-900/85 animate-pulse"
            />
          )}
          <Image
            src={imageUrl}
            alt={descriptiveAlt}
            fill
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            decoding="async"
            quality={85}
            sizes={sizes}
            referrerPolicy="no-referrer"
            style={{ objectPosition }}
            onLoad={() => setLoadedUrl(imageUrl)}
            onError={() => setFailedUrl(imageUrl)}
            className={cn(
              'object-cover transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105',
              isImageLoading ? 'opacity-0 scale-98' : 'opacity-100 scale-100'
            )}
          />
          {/* Edge-only contrast scrim keeping the center subject 100% clear */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071936]/85 via-[#071936]/10 to-[#071936]/45"
          />
        </>
      ) : (
        /* Clean Empty State when this Service ID has no uploaded image in catalog-services */
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-[#F8FAFC] dark:bg-[#051024]">
          <div className="flex flex-col items-center justify-center text-center px-5 py-4 rounded-2xl border border-dashed border-[#CBD5E1] dark:border-[#1E3A6D] bg-white/70 dark:bg-[#0A2246]/40 max-w-[240px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5F9] dark:bg-[#0A2246] text-[#64748B] dark:text-slate-400 border border-[#E2E8F0] dark:border-[#1E3A6D] mb-2">
              <ImageOff className="h-4.5 w-4.5" />
            </div>
            <p className="text-xs font-semibold text-[#334155] dark:text-slate-200">
              No Service Image Uploaded
            </p>
            <p className="text-[10px] font-mono text-[#64748B] dark:text-slate-400 mt-0.5">
              Empty Image State
            </p>
          </div>
        </div>
      )}

      {/* Top Metadata Strip (Index · Category · Duration) */}
      <div className="absolute top-3.5 left-4 right-4 z-10 flex items-center justify-between gap-2">
        <div
          className={cn(
            'inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg backdrop-blur-md',
            showImage
              ? 'bg-[#071936]/85 text-white border border-white/15'
              : 'bg-white/95 dark:bg-[#0A2246]/90 text-[#071936] dark:text-slate-100 border border-[#DCE5F2] dark:border-[#1E3A6D]'
          )}
        >
          <span
            className={cn(
              'font-mono font-bold tabular-nums',
              showImage
                ? 'text-[#60A5FA]'
                : 'text-[#003E9E] dark:text-[#60A5FA]'
            )}
          >
            {formattedIndex}
          </span>
          <span aria-hidden="true" className="opacity-40">
            ·
          </span>
          <span className="capitalize">{category}</span>
        </div>

        {durationText && (
          <div
            className={cn(
              'inline-flex items-center gap-1 text-[11px] font-mono tabular-nums px-2.5 py-1 rounded-lg backdrop-blur-md',
              showImage
                ? 'bg-[#071936]/85 text-slate-100 border border-white/15'
                : 'bg-white/95 dark:bg-[#0A2246]/90 text-[#475569] dark:text-slate-300 border border-[#DCE5F2] dark:border-[#1E3A6D]'
            )}
          >
            <Clock
              className={cn(
                'h-3 w-3 shrink-0',
                showImage
                  ? 'text-[#60A5FA]'
                  : 'text-[#003E9E] dark:text-[#60A5FA]'
              )}
            />
            <span>{durationText}</span>
          </div>
        )}
      </div>

      {/* Bottom Price Anchor Strip */}
      <div className="absolute bottom-3.5 left-4 right-4 z-10 flex items-end justify-between gap-2">
        <span
          className={cn(
            'text-[11px] font-medium',
            showImage
              ? 'text-white/95 drop-shadow-2xs'
              : 'text-[#475569] dark:text-slate-300'
          )}
        >
          Written estimate before work starts
        </span>

        {price !== undefined && price !== null && Number(price) > 0 && (
          <div
            className={cn(
              'px-3 py-1.5 rounded-xl backdrop-blur-md text-right shrink-0',
              showImage
                ? 'bg-[#071936]/90 text-white border border-white/15 shadow-sm'
                : 'bg-white dark:bg-[#0A2246] text-[#071936] dark:text-white border border-[#DCE5F2] dark:border-[#1E3A6D] shadow-2xs'
            )}
          >
            <span
              className={cn(
                'block text-[9px] font-semibold uppercase tracking-wider leading-none',
                showImage
                  ? 'text-[#60A5FA]'
                  : 'text-[#003E9E] dark:text-[#60A5FA]'
              )}
            >
              Starting From
            </span>
            <span className="font-display text-base sm:text-lg font-extrabold font-mono tabular-nums leading-tight">
              ₹{Number(price).toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
