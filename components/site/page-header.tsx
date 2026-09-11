'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { fadeInUp } from '@/components/site/motion';
import { navItems, services } from '@/lib/data';

type Crumb = { label: string; href: string };

function buildCrumbs(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [{ label: 'Home', href: '/' }];

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return crumbs;

  const topSegment = segments[0];
  const navItem = navItems.find((item) => item.href === `/${topSegment}`);
  if (navItem) {
    crumbs.push({ label: navItem.label, href: navItem.href });
  }

  if (segments.length > 1 && segments[0] === 'services') {
    const service = services.find((s) => s.slug === segments[1]);
    if (service) {
      crumbs.push({ label: service.shortTitle, href: `/services/${service.slug}` });
    }
  }

  return crumbs;
}

export function PageHeader({
  title,
  description,
  badge,
}: {
  title: string;
  description?: string;
  badge?: string;
}) {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);

  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary/30">
      {/* Subtle decorative gradient */}
      <div className="absolute inset-0 premium-gradient-subtle" />
      <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="container-px relative z-10 mx-auto max-w-7xl py-12 sm:py-16">
        {/* Breadcrumbs */}
        <motion.nav
          aria-label="Breadcrumb"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-6"
        >
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            {crumbs.map((crumb, idx) => (
              <li key={crumb.href} className="flex items-center gap-1.5">
                {idx < crumbs.length - 1 ? (
                  <>
                    <Link href={crumb.href} className="transition-colors hover:text-primary">
                      {crumb.label}
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <span className="font-medium text-foreground">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </motion.nav>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.05 }}
        >
          {badge && (
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-3.5 py-1 text-sm font-medium text-primary ring-1 ring-primary/15">
              {badge}
            </span>
          )}
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
