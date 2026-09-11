import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, Home } from 'lucide-react';
import Image from 'next/image';
import { siteConfig } from '@/lib/data';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4 py-20">
      <div className="absolute inset-0 premium-gradient-subtle" />
      <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

      {/* Decorative pipe pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative z-10 text-center animate-fade-up">
        <div className="relative mx-auto mb-8 h-24 w-24 overflow-hidden rounded-3xl ring-1 ring-primary/15 premium-shadow">
          <Image src="https://jlfqodfdqkbunqfgffut.supabase.co/storage/v1/object/public/Plumbing%20Assets/IMG-20260911-WA0003.jpg" alt="SOHAN PIPELINES" fill sizes="96px" className="object-cover" />
        </div>

        <h1 className="mb-3 font-display text-7xl font-bold tracking-tight text-foreground sm:text-8xl">
          404
        </h1>
        <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
          Page Not Found
        </h2>
        <p className="mx-auto mb-8 max-w-md leading-relaxed text-muted-foreground">
          Looks like this pipe sprung a leak. The page you are looking for does not
          exist or has been moved.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Back to Home
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href={siteConfig.phoneHref}>
            <Button variant="outline" className="gap-2">
              <Phone className="h-4 w-4" />
              {siteConfig.phone}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
