import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Image from 'next/image';
import { siteConfig, navItems, services } from '@/lib/data';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-secondary/40 dark:bg-foreground/[0.03]">
      {/* Subtle decorative gradient */}
      <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      {/* Main footer */}
      <div className="container-px relative z-10 mx-auto max-w-7xl py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl premium-shadow ring-1 ring-border/20">
                <Image src="https://jlfqodfdqkbunqfgffut.supabase.co/storage/v1/object/public/Plumbing%20Assets/IMG-20260911-WA0003.jpg" alt="SOHAN PIPELINES" fill sizes="40px" className="object-cover" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold tracking-tight">
                  SOHAN
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  PIPELINES
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Premium plumbing solutions serving West Bengal and surrounding regions since 2009.
              Licensed, insured, and available 24/7 for emergencies.
            </p>
            <div className="flex items-center gap-3">
              <a href={siteConfig.social.facebook} aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-[border-color,color,transform] duration-200 hover:border-primary hover:text-primary hover:-translate-y-0.5">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.instagram} aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-[border-color,color,transform] duration-200 hover:border-primary hover:text-primary hover:-translate-y-0.5">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.twitter} aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-[border-color,color,transform] duration-200 hover:border-primary hover:text-primary hover:-translate-y-0.5">
                <Twitter className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.youtube} aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-[border-color,color,transform] duration-200 hover:border-primary hover:text-primary hover:-translate-y-0.5">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="space-y-2.5">
              {navItems.filter((item) => !item.children).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Services
            </h3>
            <ul className="space-y-2.5">
              {services.slice(0, 7).map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary">
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href={siteConfig.phoneHref} className="transition-colors duration-200 hover:text-primary">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href={siteConfig.emailHref} className="transition-colors duration-200 hover:text-primary">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  Mon–Fri: {siteConfig.hours.weekdays}
                  <br />
                  Sat: {siteConfig.hours.saturday}
                  <br />
                  Sun: {siteConfig.hours.sunday}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container-px mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span>{siteConfig.license}</span>
            <span className="h-3 w-px bg-border" />
            <span>{siteConfig.insurance}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
