'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  ArrowRight,
  Phone,
  Calendar,
  Sparkles,
  Wrench,
  Users,
  Star,
  MapPin,
  Search,
  MessageSquare,
  Package,
  ChevronRight,
  HelpCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { CartTriggerButton } from '@/components/cart-trigger-button';
import { businessInfo } from '@/lib/business-info';
import { useLanguage, type TranslationKey } from '@/lib/language-context';
import { BrandLogo } from '@/components/brand-logo';
import {
  fetchLiveServices,
  fetchLiveSpareParts,
  fetchLiveServiceAreas,
} from '@/lib/supabase-data';
import { cn } from '@/lib/utils';
import {
  drawerSlideVariants,
  drawerBackdropVariants,
} from '@/lib/motion';

const navLinksConfig: Array<{
  href: string;
  labelKey: TranslationKey;
  descKey: TranslationKey;
  icon: typeof Wrench;
}> = [
  { href: '/services', labelKey: 'navServices', descKey: 'navServicesDesc', icon: Wrench },
  { href: '/about', labelKey: 'navAbout', descKey: 'navAboutDesc', icon: Users },
  { href: '/reviews', labelKey: 'navReviews', descKey: 'navReviewsDesc', icon: Star },
  { href: '/service-areas', labelKey: 'navAreas', descKey: 'navAreasDesc', icon: MapPin },
  { href: '/find-booking', labelKey: 'navTrack', descKey: 'navTrackDesc', icon: Search },
  { href: '/contact', labelKey: 'navContact', descKey: 'navContactDesc', icon: MessageSquare },
  { href: '/faq', labelKey: 'navFaq', descKey: 'navFaqDesc', icon: HelpCircle },
  { href: '/spare-parts', labelKey: 'navSpareParts', descKey: 'navSparePartsDesc', icon: Package },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const navLinks = React.useMemo(
    () =>
      navLinksConfig.map((item) => ({
        href: item.href,
        label: t(item.labelKey),
        description: t(item.descKey),
        icon: item.icon,
      })),
    [t]
  );

  // Warm the in-memory data caches once so SPA navigation across pages is instantaneous
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchLiveServices();
      void fetchLiveSpareParts();
      void fetchLiveServiceAreas();
    }, 150);
    return () => window.clearTimeout(timer);
  }, []);

  // Keyboard accessibility: Escape to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Non-janky body scroll lock preventing layout shifts
  React.useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [mobileMenuOpen]);

  // Track window scroll with passive listener
  React.useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 16);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-colors duration-200',
          scrolled || pathname !== '/'
            ? 'bg-background/95 dark:bg-background/90 backdrop-blur-xl border-b border-border/80 shadow-xs'
            : 'bg-background/85 dark:bg-background/75 backdrop-blur-md border-b border-border/50'
        )}
      >
        {/* Top Utility Strip (Large Desktop Only — prevents tablet/mobile desktop-mode clipping) */}
        <div className="hidden lg:block border-b border-border/50 bg-muted/30 py-1.5 px-4 sm:px-6 lg:px-8 text-[11px] text-muted-foreground">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground whitespace-nowrap">
                <ShieldCheck className="h-3.5 w-3.5 text-[#003E9E] dark:text-[#60A5FA] shrink-0" />
                <span>{t('topTagline')}</span>
              </span>
              <span className="text-border" aria-hidden="true">·</span>
              <span className="truncate">{t('topLocation')}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="inline-flex items-center gap-1 font-medium whitespace-nowrap">
                <Clock className="h-3 w-3 text-[#003E9E] dark:text-[#60A5FA]" />
                <span>
                  {businessInfo.hoursDays}: {businessInfo.hours}
                </span>
              </span>
              <span className="text-border" aria-hidden="true">·</span>
              <a
                href={`tel:${businessInfo.phone}`}
                className="font-semibold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1 whitespace-nowrap"
              >
                <Phone className="h-3 w-3 text-[#003E9E] dark:text-[#60A5FA]" />
                <span>{businessInfo.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div
          className={cn(
            'mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3.5 sm:px-6 lg:px-8 transition-[height] duration-200',
            scrolled ? 'h-14 sm:h-15' : 'h-16'
          )}
        >
          {/* Brand Logo & Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1 -m-1"
          >
            <div className="shrink-0 transition-transform duration-200 group-hover:scale-105 active:scale-95">
              <BrandLogo size="md" />
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-display text-sm sm:text-base font-bold tracking-tight text-foreground truncate group-hover:text-primary transition-colors duration-200">
                Sohan Pipeline&apos;s
              </span>
              <span className="text-[9.5px] sm:text-[11px] font-medium text-muted-foreground truncate">
                {t('brandSubtitle')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-0.5 xl:gap-1 p-1 rounded-xl bg-muted/40 border border-border/60"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-2.5 xl:px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0',
                    active
                      ? 'text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="navActivePill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-card shadow-2xs border border-border/80 -z-10"
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Zone: Language Toggle + Cart + Theme Toggle (sm+) + Book CTA + Mobile Hamburger Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <LanguageToggle compact />
            <CartTriggerButton />
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Desktop Primary CTA Button */}
            <Button
              asChild
              size="sm"
              className="hidden md:inline-flex font-semibold text-xs h-9 px-3.5 lg:px-4 rounded-xl bg-[#003E9E] hover:bg-[#071936] text-white shadow-xs group whitespace-nowrap shrink-0"
            >
              <Link href="/book">
                <span>{t('bookService')}</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>

            {/* Mobile Hamburger Trigger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              className={cn(
                'lg:hidden flex h-9.5 w-9.5 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-border/80 bg-card text-foreground hover:bg-muted/60 active:scale-95 transition-all select-none cursor-pointer',
                mobileMenuOpen && 'opacity-0 pointer-events-none'
              )}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Robust, Fully-Engineered Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div
            key="mobile-drawer-portal"
            className="fixed inset-0 z-50 lg:hidden flex justify-end pointer-events-auto overflow-hidden"
          >
            {/* Standalone Backdrop Overlay */}
            <motion.div
              key="mobile-drawer-backdrop"
              variants={drawerBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#071936]/70 backdrop-blur-xs cursor-pointer z-0"
              aria-hidden="true"
            />

            {/* Fixed Edge-Anchored Slide-In Panel */}
            <motion.aside
              key="mobile-drawer-panel"
              variants={drawerSlideVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              id="mobile-navigation-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
              className="relative z-10 w-[86vw] max-w-[380px] min-w-[280px] h-full bg-card border-l border-border/80 shadow-2xl flex flex-col justify-between overflow-hidden shrink-0 select-none"
            >
              {/* Drawer Top Header with Logo and Single Close Button */}
              <div className="p-4 sm:p-5 border-b border-border/70 flex items-center justify-between bg-muted/20 shrink-0">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <BrandLogo size="sm" />
                  <div className="flex flex-col leading-tight">
                    <span className="font-display font-bold text-sm text-foreground">
                      Sohan Pipeline&apos;s
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {t('brandSubtitle')}
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-colors cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Navigation Body */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-3.5 py-3 space-y-1.5">
                {/* Dispatch Status Banner */}
                <div className="p-3 mb-2 rounded-xl bg-[#003E9E]/5 border border-[#003E9E]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <ShieldCheck className="h-4 w-4 text-[#003E9E] dark:text-[#60A5FA] shrink-0" />
                    <div>
                      <span className="font-semibold text-foreground block leading-tight">
                        {t('emergencyActive')}
                      </span>
                      <span className="text-[10px] text-muted-foreground block">
                        {t('topLocation')}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`tel:${businessInfo.phone}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#003E9E] text-white shadow-xs shrink-0"
                    aria-label="Call emergency hotline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                </div>

                {/* Main Navigation Links */}
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center justify-between w-full p-3 rounded-xl transition-colors duration-150 group',
                        active
                          ? 'bg-[#003E9E]/10 text-[#003E9E] dark:text-[#60A5FA] font-semibold border border-[#003E9E]/30 shadow-xs'
                          : 'text-foreground hover:bg-muted/60 border border-transparent'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                            active
                              ? 'bg-[#003E9E] text-white'
                              : 'bg-muted/80 text-muted-foreground group-hover:bg-muted group-hover:text-foreground'
                          )}
                        >
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-semibold block leading-tight text-foreground group-hover:text-[#003E9E] transition-colors">
                            {link.label}
                          </span>
                          <span className="text-[11px] text-muted-foreground block line-clamp-1 mt-0.5 font-normal">
                            {link.description}
                          </span>
                        </div>
                      </div>

                      <ChevronRight
                        className={cn(
                          'h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5',
                          active ? 'text-[#003E9E] dark:text-[#60A5FA]' : 'text-muted-foreground'
                        )}
                      />
                    </Link>
                  );
                })}
              </div>

              {/* Bottom Drawer Action Zone */}
              <div className="p-4 border-t border-border/70 space-y-2.5 bg-muted/30 shrink-0">
                <div className="flex items-center justify-between px-1 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#003E9E] dark:text-[#60A5FA]" />
                    <span>{t('languageLabel')}</span>
                  </span>
                  <LanguageToggle />
                </div>

                <div className="flex items-center justify-between px-1 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#003E9E] dark:text-[#60A5FA]" />
                    <span>{t('displayMode')}</span>
                  </span>
                  <ThemeToggle />
                </div>

                <Button
                  asChild
                  className="w-full font-bold h-11 text-xs rounded-xl bg-[#003E9E] hover:bg-[#071936] text-white shadow-md"
                >
                  <Link href="/book" onClick={() => setMobileMenuOpen(false)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {t('bookServiceOnline')}
                  </Link>
                </Button>

                <a
                  href={`tel:${businessInfo.phone}`}
                  className="flex items-center justify-center gap-2 text-xs font-semibold h-10.5 rounded-xl bg-card text-foreground hover:text-primary transition-colors border border-border/80 shadow-xs active:scale-[0.99]"
                >
                  <Phone className="h-3.5 w-3.5 text-[#003E9E] dark:text-[#60A5FA]" />
                  <span>{t('callHotline')}: {businessInfo.phoneDisplay}</span>
                </a>

                <div className="pt-1 text-center">
                  <span className="text-[10px] text-muted-foreground">
                    HQ: {t('topLocation')}
                  </span>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
