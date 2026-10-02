import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { businessInfo } from '@/lib/business-info';
import { SITE_LOGO_URL } from '@/lib/site-logo';

const footerLinks = [
  {
    title: 'Services',
    links: [
      { label: 'All Services', href: '/services' },
      { label: 'Pipe Fitting & Repair', href: '/services' },
      { label: 'Bathroom Fitting', href: '/services' },
      { label: 'Water Tank Installation', href: '/services' },
      { label: 'Leak Detection', href: '/services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'Service Areas', href: '/service-areas' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
      { label: 'Book a Service', href: '/book' },
      { label: 'Find My Booking', href: '/find-booking' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <img
                src={SITE_LOGO_URL}
                alt="Sohan Pipeline's & Plumbing logo"
                className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-md shadow-primary/20"
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
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              {businessInfo.description}
            </p>
            <div className="mt-6 space-y-3">
              <a
                href={`tel:${businessInfo.phone}`}
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Phone className="h-4 w-4" />
                </span>
                {businessInfo.phoneDisplay}
              </a>
              <a
                href={`mailto:${businessInfo.email}`}
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Mail className="h-4 w-4" />
                </span>
                {businessInfo.email}
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <MapPin className="h-4 w-4" />
                </span>
                {businessInfo.address}, {businessInfo.area}
              </div>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-semibold text-sm mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {businessInfo.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {businessInfo.hours}
            </span>
            <span>{businessInfo.hoursDays}</span>
            <span className="text-muted-foreground/70">Sun: Closed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
