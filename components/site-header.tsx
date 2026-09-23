'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { businessInfo } from '@/lib/business-info';
import { SITE_LOGO_URL } from '@/lib/site-logo';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/service-areas', label: 'Service Areas' },
  { href: '/faq', label: 'FAQ' },
  { href: '/find-booking', label: 'Find Booking' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-colors duration-200',
        scrolled || pathname !== '/'
          ? 'bg-background/80 backdrop-blur-md border-b border-border'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <img
            src={SITE_LOGO_URL}
            alt="Sohan Pipeline's & Plumbing logo"
            className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-md shadow-primary/20 transition-transform group-hover:scale-105"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight">
              Sohan Pipeline's
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              & Plumbing
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                isActive(link.href)
                  ? 'text-foreground bg-muted/60'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <a
            href={`tel:${businessInfo.phone}`}
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden xl:inline">{businessInfo.phoneDisplay}</span>
          </a>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden xl:inline-flex font-semibold"
          >
            <Link href="/find-booking">Find My Booking</Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex font-semibold">
            <Link href="/book">Book Now</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex h-full flex-col">
                <nav className="flex flex-col gap-1 p-4 pt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                        isActive(link.href)
                          ? 'text-foreground bg-muted/60'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto p-6 space-y-3 border-t">
                  <Button asChild className="w-full">
                    <Link href="/book">Book a Service</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/find-booking">Find My Booking</Link>
                  </Button>
                  <a
                    href={`tel:${businessInfo.phone}`}
                    className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground"
                  >
                    <Phone className="h-4 w-4" />
                    {businessInfo.phoneDisplay}
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
