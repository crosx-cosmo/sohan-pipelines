'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Package,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Check,
  Truck,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SparePartImage } from '@/components/spare-part-image';
import { supabase } from '@/lib/supabase';
import {
  fetchLiveSpareParts,
  getCachedSpareParts,
  type DbSparePart,
} from '@/lib/supabase-data';
import { getSparePartImageUrl } from '@/lib/spare-parts-mapping';
import { useCart } from '@/lib/cart-context';
import { businessInfo } from '@/lib/business-info';
import { cn } from '@/lib/utils';
import { luxuryEasing } from '@/lib/motion';

function getSupplierName(part: DbSparePart): string | null {
  if (!part.suppliers) return null;
  if (Array.isArray(part.suppliers)) {
    return part.suppliers[0]?.name || null;
  }
  return part.suppliers.name || null;
}

export function HomeSparePartsPreview() {
  const [parts, setParts] = React.useState<DbSparePart[]>(
    () => getCachedSpareParts() ?? []
  );
  const [loading, setLoading] = React.useState(() => !getCachedSpareParts());
  const [quantities, setQuantities] = React.useState<Record<string, number>>(
    {}
  );
  const { items: cartItems, addItem, openCart, totalItemsCount } = useCart();

  const cartQtyById = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of cartItems) {
      map[item.id] = item.quantity;
    }
    return map;
  }, [cartItems]);

  const rawPhone = React.useMemo(
    () => businessInfo.phone.replace(/[^0-9]/g, ''),
    []
  );

  React.useEffect(() => {
    let active = true;

    const load = async (force = false) => {
      const { data } = await fetchLiveSpareParts({ forceRefresh: force });
      if (!active) return;
      setParts(data);
      setLoading(false);
    };

    load(false);

    const channel = supabase
      .channel('home-spare-parts-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'spare_parts' },
        () => {
          if (active) {
            load(true);
          }
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Strictly display 2 genuine spare-part products on the homepage
  const featuredParts = React.useMemo(() => parts.slice(0, 2), [parts]);

  const getQty = (id: string) => quantities[id] ?? 1;

  const updateQty = (
    id: string,
    delta: number,
    maxStock?: number | null
  ) => {
    setQuantities((prev) => {
      const current = prev[id] ?? 1;
      const limit =
        maxStock !== null && maxStock !== undefined && maxStock > 0
          ? Number(maxStock)
          : 50;
      const next = Math.max(1, Math.min(limit, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const handleQuickAdd = (part: DbSparePart) => {
    const qtyToAdd = getQty(part.id);
    addItem(
      {
        id: part.id,
        name: part.name,
        sku: part.sku,
        category: part.category,
        selling_price:
          part.selling_price !== undefined && part.selling_price !== null
            ? Number(part.selling_price)
            : null,
        stock:
          part.stock !== undefined && part.stock !== null
            ? Number(part.stock)
            : null,
        image_path: part.image_path ?? null,
        image_url: getSparePartImageUrl(part),
      },
      qtyToAdd
    );
    setQuantities((prev) => ({ ...prev, [part.id]: 1 }));
  };

  return (
    <section className="relative py-16 lg:py-24 bg-white dark:bg-background border-b border-[#DCE5F2] dark:border-border/80 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: luxuryEasing }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-7 border-b border-[#DCE5F2] dark:border-border"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-[#003E9E] dark:text-[#60A5FA] font-bold mb-3">
              <span className="h-2 w-2 rounded-full bg-[#1C64EC]" />
              <span>02 · Authorized Hardware Counter &amp; Live Inventory</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-[2.45rem] font-bold tracking-tight text-[#071936] dark:text-foreground leading-[1.14] text-balance">
              Genuine Plumbing Spare Parts &amp;{' '}
              <span className="text-[#003E9E] dark:text-[#60A5FA]">
                Pipeline Fittings
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#475569] dark:text-muted-foreground leading-relaxed text-pretty">
              Direct counter supply of pressure-rated water tanks, CPVC/UPVC
              fittings, heavy brass valves, and sanitaryware hardware—connected
              live to our Keshrambha &amp; Dantan warehouse stock.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0">
            {totalItemsCount > 0 && (
              <Button
                type="button"
                onClick={openCart}
                variant="outline"
                size="sm"
                className="font-bold text-xs h-11 px-4 rounded-xl border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex-1 sm:flex-initial justify-center whitespace-nowrap"
              >
                <ShoppingBag className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                Cart ({totalItemsCount})
              </Button>
            )}
            <Button
              asChild
              size="sm"
              className="font-semibold text-xs h-11 px-5 rounded-xl bg-[#003E9E] hover:bg-[#071936] text-white shadow-sm flex-1 sm:flex-initial justify-center whitespace-nowrap"
            >
              <Link href="/spare-parts">
                View All Spare Parts
                {parts.length > 0 ? ` (${parts.length})` : ''}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Loading Skeleton — 2 Flagship Product Cards */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#DCE5F2] dark:border-border bg-[#F6F9FC] dark:bg-card overflow-hidden animate-pulse"
              >
                <div className="w-full aspect-[16/10] bg-slate-200/70 dark:bg-slate-800/70" />
                <div className="p-6 space-y-4">
                  <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-20 rounded-xl bg-slate-200/70 dark:bg-slate-800/70" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2-Card Clean E-Commerce Grid */}
        {!loading && featuredParts.length > 0 && (
          <div
            className={
              featuredParts.length === 1
                ? 'grid grid-cols-1 gap-7 max-w-3xl mx-auto'
                : 'grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-8 items-stretch'
            }
          >
            {featuredParts.map((part, index) => {
              const inCartQty = cartQtyById[part.id] || 0;
              const selectedQty = getQty(part.id);
              const isOutOfStock =
                part.stock !== null &&
                part.stock !== undefined &&
                Number(part.stock) <= 0;
              const supplierName = getSupplierName(part);
              const hasSellingPrice =
                part.selling_price !== null &&
                part.selling_price !== undefined &&
                Number(part.selling_price) > 0;

              return (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  whileHover={{ y: -4 }}
                  transition={{
                    duration: 0.38,
                    delay: index * 0.08,
                    ease: luxuryEasing,
                  }}
                  style={{ willChange: 'transform' }}
                  className="h-full flex flex-col"
                >
                  <Card
                    className={cn(
                      'group relative h-full p-0 gap-0 rounded-2xl border bg-[#F6F9FC] dark:bg-card overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-crisp-sm hover:shadow-crisp-lg',
                      inCartQty > 0
                        ? 'border-emerald-500/60 dark:border-emerald-500/50'
                        : 'border-[#DCE5F2] dark:border-border hover:border-[#003E9E]/60'
                    )}
                  >
                    <div>
                      {/* Clean Metadata Strip */}
                      <div className="bg-white dark:bg-muted/30 px-5 py-3 flex items-center justify-between gap-2 border-b border-[#DCE5F2] dark:border-border">
                        <div className="flex items-center gap-2 text-xs font-mono min-w-0">
                          <span className="text-[#003E9E] dark:text-[#60A5FA] font-bold tabular-nums shrink-0">
                            0{index + 1}
                          </span>
                          <span aria-hidden="true" className="text-[#CBD5E1]">
                            ·
                          </span>
                          <span className="uppercase tracking-wider text-[#071936] dark:text-foreground font-semibold truncate">
                            {part.category || 'Plumbing Hardware'}
                          </span>
                          {part.sku && (
                            <>
                              <span
                                aria-hidden="true"
                                className="text-[#CBD5E1] hidden sm:inline"
                              >
                                ·
                              </span>
                              <span className="text-[#475569] dark:text-muted-foreground tabular-nums hidden sm:inline shrink-0">
                                SKU: {part.sku}
                              </span>
                            </>
                          )}
                        </div>

                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tabular-nums shrink-0',
                            isOutOfStock
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-emerald-700 dark:text-emerald-400'
                          )}
                        >
                          {isOutOfStock ? (
                            <>
                              <XCircle className="h-3.5 w-3.5 shrink-0" />
                              <span>Out of Stock</span>
                            </>
                          ) : (
                            <>
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              <span>
                                {part.stock !== null &&
                                part.stock !== undefined
                                  ? `${part.stock} in Stock`
                                  : 'In Stock'}
                              </span>
                            </>
                          )}
                        </span>
                      </div>

                      {/* Studio Showroom Image Stage (16:10 — Strictly from "spare-part-images/parts") */}
                      <div className="relative w-full aspect-[16/10] bg-white dark:bg-slate-900 border-b border-[#DCE5F2] dark:border-border overflow-hidden">
                        <SparePartImage
                          name={part.name}
                          category={part.category}
                          imagePath={part.image_path}
                          imageUrl={part.image_url}
                          isOutOfStock={isOutOfStock}
                          priority={index < 2}
                          className="group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 540px"
                        />
                      </div>

                      {/* Product Info & Hardware Specifications */}
                      <div className="p-5 sm:p-6 pb-4 space-y-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            {part.sku && (
                              <span className="text-[11px] font-mono text-[#475569] dark:text-muted-foreground block mb-0.5 tabular-nums">
                                Catalog SKU: {part.sku}
                              </span>
                            )}
                            <h3 className="font-display font-bold text-lg sm:text-xl text-[#071936] dark:text-foreground leading-snug group-hover:text-[#003E9E] dark:group-hover:text-[#60A5FA] transition-colors">
                              {part.name}
                            </h3>
                          </div>

                          {inCartQty > 0 && (
                            <button
                              type="button"
                              onClick={openCart}
                              className="shrink-0 inline-flex items-center gap-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 cursor-pointer tabular-nums"
                            >
                              <Check className="h-3.5 w-3.5 shrink-0" />
                              <span>{inCartQty} in Cart</span>
                            </button>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-[#475569] dark:text-muted-foreground leading-relaxed line-clamp-2">
                          {part.description
                            ? part.description
                            : supplierName
                            ? `Supplied via ${supplierName} · Genuine quality-inspected fitting ready for counter pickup or technician delivery.`
                            : 'Genuine quality-inspected plumbing component stocked at our Bahardaltitia, Keshrambha, Dantan hardware counter.'}
                        </p>

                        {/* 3-Point Hardware Guarantee Micro-Row */}
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <div className="rounded-xl bg-white dark:bg-muted/30 border border-[#DCE5F2] dark:border-border px-2.5 py-2 text-center">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block">
                              Quality
                            </span>
                            <span className="text-[11px] font-bold text-[#071936] dark:text-foreground">
                              100% Genuine
                            </span>
                          </div>
                          <div className="rounded-xl bg-white dark:bg-muted/30 border border-[#DCE5F2] dark:border-border px-2.5 py-2 text-center">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block">
                              Counter Pickup
                            </span>
                            <span className="text-[11px] font-bold text-[#071936] dark:text-foreground font-mono">
                              PIN {businessInfo.pincode}
                            </span>
                          </div>
                          <div className="rounded-xl bg-white dark:bg-muted/30 border border-[#DCE5F2] dark:border-border px-2.5 py-2 text-center">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block">
                              Site Delivery
                            </span>
                            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                              Available
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Clean Order Footer */}
                    <div className="p-5 sm:p-6 pt-2">
                      <div className="rounded-xl bg-white dark:bg-muted/25 p-4 space-y-3.5 border border-[#DCE5F2] dark:border-border">
                        <div className="flex items-baseline justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#475569] dark:text-muted-foreground block">
                              Counter Selling Price
                            </span>
                            {hasSellingPrice ? (
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-mono font-extrabold text-xl sm:text-2xl text-[#071936] dark:text-foreground tabular-nums">
                                  ₹
                                  {Number(part.selling_price).toLocaleString(
                                    'en-IN'
                                  )}
                                </span>
                                {part.unit && (
                                  <span className="text-xs text-[#475569] dark:text-muted-foreground">
                                    / {part.unit}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm font-bold text-[#003E9E] dark:text-[#60A5FA]">
                                Price on Enquiry
                              </span>
                            )}
                          </div>

                          <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                            <span>Ready for Dispatch</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Quantity Stepper */}
                          {!isOutOfStock && (
                            <div className="flex items-center rounded-xl border border-[#DCE5F2] dark:border-border bg-[#F6F9FC] dark:bg-background p-0.5 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQty(part.id, -1, part.stock)
                                }
                                disabled={selectedQty <= 1}
                                aria-label="Decrease quantity"
                                className="h-9 w-8 rounded-lg flex items-center justify-center text-[#475569] hover:text-[#071936] dark:hover:text-foreground hover:bg-[#DCE5F2]/60 disabled:opacity-35 cursor-pointer transition-colors"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-7 text-center font-mono text-xs font-bold text-[#071936] dark:text-foreground tabular-nums">
                                {selectedQty}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQty(part.id, 1, part.stock)
                                }
                                aria-label="Increase quantity"
                                className="h-9 w-8 rounded-lg flex items-center justify-center text-[#475569] hover:text-[#071936] dark:hover:text-foreground hover:bg-[#DCE5F2]/60 cursor-pointer transition-colors"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}

                          <Button
                            type="button"
                            onClick={() => handleQuickAdd(part)}
                            disabled={isOutOfStock}
                            size="sm"
                            className="flex-1 text-xs font-semibold h-10 rounded-xl bg-[#003E9E] hover:bg-[#071936] text-white gap-1.5 justify-center whitespace-nowrap shadow-xs"
                          >
                            <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
                            {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
                          </Button>

                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-10 px-3.5 rounded-xl border-[#DCE5F2] dark:border-border bg-white dark:bg-background text-[#071936] dark:text-foreground hover:border-[#003E9E] hover:text-[#003E9E] shrink-0 whitespace-nowrap"
                          >
                            <a
                              href={`https://wa.me/${rawPhone}?text=${encodeURIComponent(
                                `Hello Sohan Pipeline's, I would like to enquire about ${part.name}${
                                  part.sku ? ` [SKU: ${part.sku}]` : ''
                                }${
                                  hasSellingPrice
                                    ? ` (Listed at ₹${Number(
                                        part.selling_price
                                      ).toLocaleString('en-IN')})`
                                    : ''
                                } — Quantity: ${selectedQty}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Enquire about ${part.name} on WhatsApp`}
                            >
                              <MessageCircle className="h-4 w-4 sm:mr-1.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span className="hidden sm:inline text-xs font-semibold">
                                WhatsApp
                              </span>
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State on Home Preview (when database returns 0 rows) */}
        {!loading && featuredParts.length === 0 && (
          <div className="rounded-2xl border border-[#DCE5F2] dark:border-border bg-[#F6F9FC] dark:bg-card p-8 sm:p-10 text-center space-y-4 max-w-xl mx-auto shadow-crisp-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#003E9E]/10 text-[#003E9E] mx-auto">
              <Package className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-lg text-[#071936] dark:text-foreground">
                Plumbing Spare Parts &amp; Hardware Counter
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-muted-foreground leading-relaxed">
                Visit our Spare Parts Storefront to search inventory or send a
                direct WhatsApp parts enquiry to our Keshrambha &amp; Dantan
                counter.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <Button
                asChild
                size="sm"
                className="rounded-xl font-semibold text-xs bg-[#003E9E] hover:bg-[#071936] text-white"
              >
                <Link href="/spare-parts">
                  Open Spare Parts Storefront
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Hardware Counter Assurance Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1, ease: luxuryEasing }}
          className="mt-8 rounded-2xl border border-[#DCE5F2] dark:border-border bg-[#F6F9FC] dark:bg-card p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs shadow-crisp-xs"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#475569] dark:text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#003E9E] dark:text-[#60A5FA] shrink-0" />
              <span>
                <strong className="text-[#071936] dark:text-foreground font-bold">
                  Authorized Counter Supply:
                </strong>{' '}
                Astral, Supreme, Finolex, Vectus &amp; Jaquar
              </span>
            </span>
            <span className="inline-flex items-center gap-2">
              <Truck className="h-4 w-4 text-[#003E9E] dark:text-[#60A5FA] shrink-0" />
              <span>
                <strong className="text-[#071936] dark:text-foreground font-bold">
                  Pickup &amp; Site Delivery:
                </strong>{' '}
                Bahardaltitia, Keshrambha, Dantan (PIN {businessInfo.pincode})
              </span>
            </span>
          </div>

          <Link
            href="/spare-parts"
            className="inline-flex items-center gap-1.5 font-bold text-[#003E9E] dark:text-[#60A5FA] hover:underline whitespace-nowrap shrink-0"
          >
            <span>
              Browse All {parts.length > 0 ? `${parts.length} ` : ''}Spare Parts
              in Storefront
            </span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
