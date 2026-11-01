'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Star,
  ShieldCheck,
  CheckCircle2,
  Search,
  ClipboardCheck,
  MessageSquarePlus,
  Wrench,
  Clock,
  Sparkles,
  UserCheck,
  Hammer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  fetchVerifiedReviews,
  computeReviewAnalytics,
  type VerifiedWorkReview,
} from '@/lib/reviews-service';
import { luxuryEasing } from '@/lib/motion';

const EVALUATION_PILLARS = [
  {
    key: 'workmanship' as const,
    label: 'Pipe Workmanship',
    detail: 'Leak-proof jointing & pressure stability',
    icon: Wrench,
  },
  {
    key: 'punctuality' as const,
    label: 'Dispatch Punctuality',
    detail: 'Arrival within scheduled service window',
    icon: Clock,
  },
  {
    key: 'pricingTransparency' as const,
    label: 'Pricing Transparency',
    detail: 'Upfront written quote & honest billing',
    icon: ShieldCheck,
  },
  {
    key: 'siteCleanliness' as const,
    label: 'Worksite Cleanliness',
    detail: 'Tile care & post-installation cleanup',
    icon: Sparkles,
  },
  {
    key: 'technicianCourtesy' as const,
    label: 'Technician Conduct',
    detail: 'Clear communication & safety discipline',
    icon: UserCheck,
  },
  {
    key: 'materialQuality' as const,
    label: 'Genuine Materials',
    detail: 'ISI-certified pipes & brass hardware',
    icon: Hammer,
  },
];

export function HomeReviewsPreview() {
  const router = useRouter();
  const [reviews, setReviews] = React.useState<VerifiedWorkReview[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [quickBookingId, setQuickBookingId] = React.useState('');

  React.useEffect(() => {
    let active = true;
    fetchVerifiedReviews().then(({ reviews: live }) => {
      if (!active) return;
      setReviews(live);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const analytics = React.useMemo(
    () => computeReviewAnalytics(reviews),
    [reviews]
  );

  const hasVerifiedReviews = analytics.totalReviews > 0;
  const curatedReviews = React.useMemo(() => reviews.slice(0, 2), [reviews]);

  const handleQuickReviewJump = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = quickBookingId.trim().toUpperCase();
    if (clean) {
      router.push(`/reviews?bookingId=${encodeURIComponent(clean)}#write-review`);
    } else {
      router.push('/reviews#write-review');
    }
  };

  return (
    <section className="py-14 lg:py-20 bg-card/35 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, ease: luxuryEasing }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-primary mb-2.5">
              <span>04. Work-Verified Feedback</span>
              <span aria-hidden="true" className="text-border">
                ·
              </span>
              <span className="text-muted-foreground font-medium">
                Booking-Linked Client Evaluations
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground text-balance">
              Verified Client Reviews &amp; Craftsmanship Audit
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty">
              Every published review is authenticated against an official Sohan
              Pipelines service booking—evaluating workmanship, punctuality,
              transparent pricing, and site care.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0">
            {hasVerifiedReviews && (
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-card border border-border/80 shadow-2xs">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-mono font-bold text-foreground tabular-nums">
                    {analytics.averageRating.toFixed(1)} / 5.0
                  </span>
                  <span aria-hidden="true" className="mx-1.5 text-border">
                    ·
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {analytics.totalReviews} Verified{' '}
                    {analytics.totalReviews === 1 ? 'Review' : 'Reviews'}
                  </span>
                </div>
              </div>
            )}

            <Button
              asChild
              variant="outline"
              size="sm"
              className="font-semibold text-xs h-10.5 px-4 rounded-xl border-border/80 flex-1 sm:flex-initial justify-center whitespace-nowrap"
            >
              <Link href="/reviews">
                View All Reviews
                {hasVerifiedReviews ? ` (${analytics.totalReviews})` : ''}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0" />
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              className="font-semibold text-xs h-10.5 px-4 rounded-xl shadow-xs flex-1 sm:flex-initial justify-center whitespace-nowrap"
            >
              <Link href="/reviews#write-review">Submit Verified Review</Link>
            </Button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-56 rounded-2xl border border-border/60 bg-card p-6 animate-pulse space-y-4"
              >
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-12 w-full rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        )}

        {/* CASE A: Genuine Verified Reviews Exist */}
        {!loading && hasVerifiedReviews && (
          <div className="space-y-6">
            {/* Real Calculated 6-Pillar Averages Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-stretch">
              {EVALUATION_PILLARS.map((pillar) => {
                const score = analytics.pillarAverages[pillar.key];
                return (
                  <div
                    key={pillar.key}
                    className="h-full rounded-2xl border border-border/80 bg-card p-3.5 flex flex-col justify-between gap-1.5 shadow-2xs min-w-0"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-sm font-extrabold text-foreground tabular-nums">
                        {score.toFixed(1)}
                      </span>
                      <div className="flex gap-0.5 shrink-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={
                              s <= Math.round(score)
                                ? 'h-3 w-3 fill-amber-400 text-amber-400'
                                : 'h-3 w-3 text-muted-foreground/25'
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-foreground truncate">
                      {pillar.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {pillar.detail}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Curated Verified Review Cards (Max 2 on Homepage) */}
            <div
              className={
                curatedReviews.length === 1
                  ? 'grid gap-6 max-w-3xl mx-auto'
                  : 'grid gap-6 lg:grid-cols-2 items-stretch'
              }
            >
              {curatedReviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.05,
                    ease: luxuryEasing,
                  }}
                  className="h-full flex flex-col"
                >
                  <Card className="h-full p-0 gap-0 border border-border/80 bg-card rounded-2xl shadow-crisp-xs hover:shadow-crisp-md hover:border-primary/50 flex flex-col justify-between group">
                    <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-5">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/60">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={
                                    s <= Math.round(review.rating)
                                      ? 'h-4 w-4 fill-amber-400 text-amber-400'
                                      : 'h-4 w-4 text-muted-foreground/25'
                                  }
                                />
                              ))}
                            </div>
                            <span className="font-mono font-bold text-xs text-foreground tabular-nums">
                              {review.rating.toFixed(1)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium font-mono">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                            <span>Verified Order · {review.bookingId}</span>
                          </div>
                        </div>

                        <h3 className="font-display font-bold text-base text-foreground">
                          {review.headline}
                        </h3>

                        <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                          &ldquo;{review.comment}&rdquo;
                        </p>
                      </div>

                      <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div>
                          <p className="font-display font-bold text-sm text-foreground">
                            {review.customerName}
                          </p>
                          <p className="text-muted-foreground">
                            {review.customerRole} · {review.locality}
                          </p>
                        </div>

                        <span className="text-muted-foreground inline-flex items-center gap-1.5 font-medium">
                          <Wrench className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>{review.serviceName}</span>
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Compact Booking-Verified Review Launcher Bar */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-crisp-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-1">
                <h3 className="font-display text-base font-bold text-foreground">
                  Completed a Plumbing Service With Us Recently?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Enter your official Booking Reference ID to verify your work
                  order and publish your evaluation.
                </p>
              </div>

              <form
                onSubmit={handleQuickReviewJump}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto lg:min-w-[420px]"
              >
                <Input
                  value={quickBookingId}
                  onChange={(e) => setQuickBookingId(e.target.value)}
                  placeholder="Enter Booking ID (e.g. SP-...)"
                  className="h-10.5 rounded-xl font-mono text-xs uppercase flex-1"
                />
                <Button
                  type="submit"
                  className="h-10.5 px-5 rounded-xl font-semibold text-xs shrink-0 justify-center whitespace-nowrap"
                >
                  Verify &amp; Rate
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0" />
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* CASE B: Authentic Empty State (When No Verified Reviews Are Stored Yet) */}
        {!loading && !hasVerifiedReviews && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: luxuryEasing }}
            className="grid gap-6 lg:grid-cols-12 items-stretch"
          >
            {/* Left Column: Authentic Verification Policy & 6-Pillar Evaluation Framework */}
            <div className="lg:col-span-7 rounded-2xl border border-border/80 bg-card p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-crisp-xs">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Strict Work-Order Verification Policy</span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                  100% Authentic Reviews—Never Unverified Testimonials
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  We do not display anonymous or unverified ratings. Reviews
                  appear here only when a customer verifies an official{' '}
                  <span className="font-mono font-semibold text-foreground">
                    SP-
                  </span>{' '}
                  booking reference and evaluates their completed job across six
                  engineering standards:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EVALUATION_PILLARS.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.key}
                      className="rounded-xl border border-border/60 bg-muted/25 p-3 flex items-start gap-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-mono text-[11px] text-primary font-semibold tabular-nums">
                            0{idx + 1}
                          </span>
                          <span aria-hidden="true" className="text-border">
                            ·
                          </span>
                          <span className="font-semibold text-foreground truncate">
                            {pillar.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          {pillar.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  Published ratings are calculated strictly from verified customer submissions.
                </span>
                <Link
                  href="/reviews"
                  className="font-semibold text-primary hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <span>Open Review Verification Ledger</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Interactive Booking Verification & Feedback Submission Card */}
            <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-card p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-crisp-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-primary">
                    Submit Client Feedback
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    3-Step Verification
                  </span>
                </div>

                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                  Had Plumbing Work Completed Recently? Share Your Experience
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Enter your Booking ID below to locate your work order, confirm
                  the service performed, and publish your verified rating.
                </p>

                <div className="space-y-2 pt-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2.5">
                    <Search className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>1. Enter your Booking Reference ID or phone number</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ClipboardCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>2. Select your verified plumbing work order</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MessageSquarePlus className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>3. Rate workmanship &amp; publish your feedback</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleQuickReviewJump} className="space-y-3 pt-4 border-t border-border/60">
                <div className="space-y-1.5">
                  <label
                    htmlFor="home-quick-review-booking-id"
                    className="text-xs font-semibold text-foreground block"
                  >
                    Booking Reference ID
                  </label>
                  <Input
                    id="home-quick-review-booking-id"
                    value={quickBookingId}
                    onChange={(e) => setQuickBookingId(e.target.value)}
                    placeholder="Enter Booking ID (e.g. SP-...)"
                    className="h-11 rounded-xl font-mono text-xs uppercase"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <Button
                    type="submit"
                    className="h-10.5 px-5 rounded-xl font-semibold text-xs flex-1 justify-center whitespace-nowrap"
                  >
                    Verify Booking &amp; Rate
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0" />
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-10.5 px-4 rounded-xl font-semibold text-xs justify-center whitespace-nowrap"
                  >
                    <Link href="/find-booking">Find Booking ID</Link>
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
