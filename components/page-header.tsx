import { cn } from '@/lib/utils';

interface PageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ badge, title, description, className }: PageHeaderProps) {
  return (
    <section className={cn('border-b bg-muted/20', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl">
          {badge && (
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary mb-5">
              {badge}
            </span>
          )}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance leading-[1.15]">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
