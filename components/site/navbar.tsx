'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Phone, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/site/theme-toggle';
import { siteConfig, navItems } from '@/lib/data';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Top utility bar */}
      <div className="hidden bg-foreground text-background lg:block dark:bg-foreground/95">
        <div className="container-px mx-auto flex max-w-7xl items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-6">
            <a href={siteConfig.phoneHref} className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <Phone className="h-3.5 w-3.5" />
              {siteConfig.phone}
            </a>
            <span className="text-background/70">
              {siteConfig.hours.emergency}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-background/70">
            <span>{siteConfig.license}</span>
            <span className="h-3 w-px bg-background/30" />
            <span>{siteConfig.insurance}</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-300 ease-premium',
          scrolled
            ? 'glass border-b border-border/40 premium-shadow-sm'
            : 'bg-background/95 backdrop-blur-sm'
        )}
      >
        <div className="container-px mx-auto flex max-w-7xl items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 transition-opacity hover:opacity-90" aria-label="SOHAN PIPELINES home">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl premium-shadow ring-1 ring-border/20">
              <Image src="https://jlfqodfdqkbunqfgffut.supabase.co/storage/v1/object/public/Plumbing%20Assets/IMG-20260911-WA0003.jpg" alt="SOHAN PIPELINES" fill sizes="40px" className="object-cover" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
                SOHAN
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                PIPELINES
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'relative flex items-center gap-0.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-primary',
                      isActive(item.href) ? 'text-primary' : 'text-foreground/70'
                    )}
                  >
                    {item.label}
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', servicesOpen && 'rotate-180')} />
                    {isActive(item.href) && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                        className="absolute left-0 top-full pt-2"
                      >
                        <div className="w-80 overflow-hidden rounded-xl border border-border/60 bg-popover p-2 premium-shadow-lg">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                'block rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-secondary',
                                isActive(child.href) && 'bg-secondary/50'
                              )}
                            >
                              <div className="text-sm font-medium text-foreground">
                                {child.label}
                              </div>
                              {child.description && (
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {child.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-primary',
                    isActive(item.href) ? 'text-primary' : 'text-foreground/70'
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              )
            )}
          </nav>

          {/* CTA buttons + theme toggle */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href={siteConfig.phoneHref} className="hidden sm:block">
              <Button variant="outline" size="sm" className="gap-2">
                <Phone className="h-4 w-4" />
                <span className="hidden xl:inline">Call {siteConfig.phone}</span>
                <span className="xl:hidden">Call</span>
              </Button>
            </a>
            <Link href="/book" className="hidden sm:block">
              <Button size="sm" className="gap-2">
                Book a Plumber
              </Button>
            </Link>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm overflow-y-auto p-0">
                <div className="flex items-center justify-between border-b px-6 py-4">
                  <Link href="/" className="flex items-center gap-2.5">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg ring-1 ring-border/20">
                      <Image src="https://jlfqodfdqkbunqfgffut.supabase.co/storage/v1/object/public/Plumbing%20Assets/IMG-20260911-WA0003.jpg" alt="SOHAN PIPELINES" fill sizes="36px" className="object-cover" />
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="font-display text-base font-bold">SOHAN</span>
                      <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">PIPELINES</span>
                    </div>
                  </Link>
                </div>
                <nav className="flex flex-col gap-1 px-4 py-4">
                  {navItems.map((item) =>
                    item.children ? (
                      <div key={item.label} className="flex flex-col">
                        <Link
                          href={item.href}
                          className={cn(
                            'rounded-lg px-3 py-2.5 text-base font-medium transition-colors hover:bg-secondary',
                            isActive(item.href) ? 'text-primary' : 'text-foreground'
                          )}
                        >
                          {item.label}
                        </Link>
                        <div className="ml-4 flex flex-col gap-0.5 border-l border-border pl-3">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                'rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary hover:text-foreground',
                                isActive(child.href) ? 'text-primary font-medium' : 'text-muted-foreground'
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                          'rounded-lg px-3 py-2.5 text-base font-medium transition-colors hover:bg-secondary',
                          isActive(item.href) ? 'text-primary' : 'text-foreground'
                        )}
                      >
                        {item.label}
                      </Link>
                    )
                  )}
                </nav>
                <div className="mt-auto space-y-2 border-t px-6 py-4">
                  <a href={siteConfig.phoneHref} className="block">
                    <Button variant="outline" className="w-full gap-2">
                      <Phone className="h-4 w-4" />
                      Call {siteConfig.phone}
                    </Button>
                  </a>
                  <Link href="/book" className="block">
                    <Button className="w-full">Book a Plumber</Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
