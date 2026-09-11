import { PageHeader } from '@/components/site/page-header';
import { ContactForm, ContactInfoCards } from '@/components/site/contact-form';
import { LocalBusinessJsonLd } from '@/components/site/json-ld';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Call, Email, or Message SOHAN PIPELINES',
  description:
    'Get in touch with SOHAN PIPELINES. Call us 24/7 for emergencies, email us for quotes, or send a message through our contact form. We respond within 1 business hour.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <PageHeader
        title="Contact Us"
        badge="Get in Touch"
        description="Need a plumber? We are here to help. Call us any time for emergencies, or send us a message and we will respond within 1 business hour."
      />

      <section className="section-py">
        <div className="container-px mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Contact info */}
            <div>
              <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-foreground">
                Reach Out Anytime
              </h2>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                Whether you have a plumbing emergency or just a question, we are
                always just a call or click away. Our live dispatchers are available
                24/7 — you will never get an answering machine.
              </p>
              <ContactInfoCards />

              {/* Emergency callout */}
              <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                    <span className="text-lg font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">
                      Plumbing Emergency?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Do not wait — call us now for immediate dispatch.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact form */}
            <div>
              <div className="rounded-2xl border border-border/50 bg-card p-6 premium-shadow-sm sm:p-8">
                <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-foreground">
                  Send Us a Message
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
