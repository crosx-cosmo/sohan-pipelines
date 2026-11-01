'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Package,
  Wrench,
  Gauge,
  Droplets,
  Flame,
  Bath,
} from 'lucide-react';
import { getSparePartImageUrl } from '@/lib/spare-parts-mapping';
import { cn } from '@/lib/utils';

interface SparePartImageProps {
  name: string;
  category?: string | null;
  imagePath?: string | null;
  imageUrl?: string | null;
  sizes?: string;
  className?: string;
  isOutOfStock?: boolean;
  compact?: boolean;
  priority?: boolean;
}

function renderHardwarePlaceholderIcon(
  name: string,
  category: string | null | undefined,
  iconClassName: string
) {
  const combined = `${name || ''} ${category || ''}`.toLowerCase();
  if (
    combined.includes('valve') ||
    combined.includes('cock') ||
    combined.includes('nrv') ||
    combined.includes('regulator')
  ) {
    return <Gauge className={iconClassName} />;
  }
  if (
    combined.includes('tap') ||
    combined.includes('faucet') ||
    combined.includes('shower') ||
    combined.includes('diverter')
  ) {
    return <Droplets className={iconClassName} />;
  }
  if (
    combined.includes('geyser') ||
    combined.includes('heater') ||
    combined.includes('thermal')
  ) {
    return <Flame className={iconClassName} />;
  }
  if (
    combined.includes('sanitary') ||
    combined.includes('flush') ||
    combined.includes('cistern') ||
    combined.includes('basin')
  ) {
    return <Bath className={iconClassName} />;
  }
  if (
    combined.includes('pipe') ||
    combined.includes('fitting') ||
    combined.includes('elbow') ||
    combined.includes('tee') ||
    combined.includes('cpvc') ||
    combined.includes('upvc')
  ) {
    return <Wrench className={iconClassName} />;
  }
  return <Package className={iconClassName} />;
}

export function SparePartImage({
  name,
  category,
  imagePath,
  imageUrl,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  className,
  isOutOfStock = false,
  compact = false,
  priority = false,
}: SparePartImageProps) {
  const resolvedUrl = React.useMemo(
    () =>
      getSparePartImageUrl({
        image_path: imagePath,
        image_url: imageUrl,
      }),
    [imagePath, imageUrl]
  );

  const [failedUrl, setFailedUrl] = React.useState<string | null>(null);
  const [loadedUrl, setLoadedUrl] = React.useState<string | null>(null);

  const showImage = Boolean(resolvedUrl && failedUrl !== resolvedUrl);
  const isImageLoading = Boolean(
    showImage && resolvedUrl && loadedUrl !== resolvedUrl
  );

  if (showImage && resolvedUrl) {
    return (
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white via-slate-50/40 to-slate-100/50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 overflow-hidden select-none',
          compact ? 'p-1.5' : 'p-3.5 sm:p-5'
        )}
      >
        {/* Subtle Studio Radial Spotlight */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,62,158,0.06)_0%,transparent_70%)] pointer-events-none"
        />

        {/* Smooth loading shimmer while the product image loads */}
        {isImageLoading && (
          <div
            aria-hidden="true"
            className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100/90 dark:bg-slate-900/90 animate-pulse"
          >
            <div
              className={cn(
                'rounded-xl bg-slate-200/80 dark:bg-slate-800/80',
                compact ? 'h-8 w-8' : 'h-20 w-20'
              )}
            />
          </div>
        )}

        <div className="relative h-full w-full flex items-center justify-center">
          <Image
            src={resolvedUrl}
            alt={name}
            fill
            sizes={sizes}
            quality={85}
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setLoadedUrl(resolvedUrl)}
            onError={() => setFailedUrl(resolvedUrl)}
            className={cn(
              'object-contain object-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
              isImageLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100',
              isOutOfStock && 'grayscale-[35%] opacity-80',
              className
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#F0F5FF] via-[#F6F9FC] to-[#E6EFFC] dark:from-[#071936] dark:via-[#091F44] dark:to-[#051024] text-[#071936] dark:text-slate-200 select-none overflow-hidden',
        isOutOfStock && 'opacity-75'
      )}
    >
      {/* Subtle Blueprint Grid Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-35 bg-[radial-gradient(#003E9E_1px,transparent_1px)] [background-size:16px_16px]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-[#003E9E]/15 blur-2xl"
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-3">
        <div
          className={cn(
            'flex items-center justify-center rounded-2xl border border-[#DCE5F2] dark:border-[#1E3A6D] bg-white dark:bg-[#0A2246] text-[#003E9E] dark:text-[#60A5FA] shadow-xs',
            compact ? 'h-9 w-9 rounded-xl' : 'h-14 w-14 mb-2.5'
          )}
        >
          {renderHardwarePlaceholderIcon(
            name,
            category,
            compact ? 'h-4 w-4' : 'h-6 w-6'
          )}
        </div>
        {!compact && (
          <>
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#003E9E] dark:text-[#60A5FA] font-bold">
              {category || 'Genuine Hardware'}
            </span>
            <span className="text-[10px] text-[#475569] dark:text-slate-400 mt-0.5 line-clamp-1 max-w-[180px]">
              Sohan Pipelines Counter
            </span>
          </>
        )}
      </div>
    </div>
  );
}
