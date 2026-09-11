import { PageHeader } from '@/components/site/page-header';
import { StatsBar } from '@/components/site/stats-bar';
import { CTASection } from '@/components/site/cta-section';
import { Card, CardContent } from '@/components/ui/card';
import { team, siteConfig } from '@/lib/data';
import { AnimatedDiv, AnimatedStagger, AnimatedItem } from '@/components/site/animated';
import { Award, HeartPulse, ThumbsUp } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — SOHAN PIPELINES',
  description:
    'SOHAN PIPELINES has served West Bengal and surrounding regions since 2009 with honest, reliable plumbing services. Learn about our story, our team, and our commitment to quality.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About SOHAN PIPELINES"
        badge="Our Story"
        description="What started as a one-man operation in 2009 has grown into West Bengal's most trusted plumbing company — without ever losing the values that got us here."
      />

      {/* Story section */}
      <section className="section-py">
        <div className="container-px mx-auto max-w-4xl">
          <AnimatedDiv className="prose prose-lg max-w-none">
            <h2 className="mb-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Built on Trust, One Job at a Time
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                When Sohan Reddy founded SOHAN PIPELINES in 2009, he had a single
                van, a toolbox, and a simple promise: treat every home like it was
                his own, and charge honestly for the work. That promise still drives
                everything we do today.
              </p>
              <p>
                Over the past {siteConfig.yearsInBusiness} years, we have grown from a
                one-person operation to a team of 24 certified plumbers serving 24
                areas across West Bengal and surrounding regions. We have completed over {' '}
                {siteConfig.jobsCompleted.toLocaleString()} jobs — from emergency
                leak repairs to full commercial repiping projects — and earned more
                than 2,100 five-star reviews along the way.
              </p>
              <p>
                But numbers only tell part of the story. What we are most proud of is
                the trust our community has placed in us. We show up on time, we
                price our work upfront, and we stand behind everything we do with a
                5-year workmanship warranty. When we say we will be there, we are
                there.
              </p>
            </div>
          </AnimatedDiv>
        </div>
      </section>

      <StatsBar />

      {/* Values section */}
      <section className="section-py">
        <div className="container-px mx-auto max-w-7xl">
          <AnimatedDiv className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Core Values
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              These three principles guide every decision we make and every job we take on.
            </p>
          </AnimatedDiv>

          <AnimatedStagger className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              {
                icon: 'HeartPulse',
                title: 'Integrity First',
                description:
                  'We price upfront, we do not upsell, and we tell you the truth about your plumbing — even when it is not what you want to hear.',
              },
              {
                icon: 'Award',
                title: 'Quality Workmanship',
                description:
                  'We use premium materials, proven techniques, and take the time to do it right. Our 5-year warranty is not a marketing gimmick — it is our standard.',
              },
              {
                icon: 'ThumbsUp',
                title: 'Respect for Your Home',
                description:
                  'Shoe covers, drop cloths, and cleanup on every job. We treat your property with the same care we would treat our own.',
              },
            ].map((value) => (
              <AnimatedItem key={value.title}>
                <Card className="card-hover h-full border-border/50 text-center hover:border-primary/30 hover:premium-shadow-lg hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                      {value.icon === 'HeartPulse' && <HeartPulse className="h-7 w-7" />}
                      {value.icon === 'Award' && <Award className="h-7 w-7" />}
                      {value.icon === 'ThumbsUp' && <ThumbsUp className="h-7 w-7" />}
                    </div>
                    <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedItem>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* Team section */}
      <section className="section-py bg-secondary/30">
        <div className="container-px mx-auto max-w-7xl">
          <AnimatedDiv className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Meet the Team
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              The people behind the SOHAN PIPELINES name — licensed professionals who take pride in their craft.
            </p>
          </AnimatedDiv>

          <AnimatedStagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <AnimatedItem key={member.name}>
                <Card className="card-hover h-full border-border/50 hover:border-primary/30 hover:premium-shadow-lg hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-bold text-primary-foreground premium-shadow">
                      {member.initials}
                    </div>
                    <h3 className="mb-1 font-display text-lg font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <p className="mb-3 text-sm font-medium text-primary">
                      {member.role}
                    </p>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      {member.bio}
                    </p>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {member.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedItem>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      <CTASection />
    </>
  );
}
