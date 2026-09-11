'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SearchableCitySelect } from '@/components/site/searchable-city-select';
import { AddressAutocomplete } from '@/components/site/address-autocomplete';
import { Card, CardContent } from '@/components/ui/card';
import { services, siteConfig } from '@/lib/data';
import { ServiceIcon } from '@/components/site/service-icon';
import { CheckCircle2, ArrowRight, ArrowLeft, Phone, Calendar, User, MapPin, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const bookingSchema = z.object({
  service: z.string().min(1, 'Please select a service'),
  urgency: z.string().min(1, 'Please select urgency'),
  name: z.string().min(2, 'Please enter your name'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email'),
  address: z.string().min(5, 'Please enter your address'),
  city: z.string().min(1, 'Please select your city'),
  date: z.string().optional(),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const steps = [
  { number: 1, label: 'Service', icon: Calendar },
  { number: 2, label: 'Your Info', icon: User },
  { number: 3, label: 'Location', icon: MapPin },
  { number: 4, label: 'Confirm', icon: CheckCircle2 },
];

export function BookingForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: 'onChange',
  });

  const formData = watch();

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data: BookingFormValues) => {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    console.log('Booking submission:', data);
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-success/30 bg-success/5 p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <CheckCircle2 className="mb-4 h-20 w-20 text-success" />
        </motion.div>
        <h3 className="mb-2 font-display text-2xl font-bold text-foreground">
          Booking Request Sent!
        </h3>
        <p className="mb-6 max-w-md leading-relaxed text-muted-foreground">
          Thank you, {formData.name}! We have received your booking request for{' '}
          {services.find((s) => s.slug === formData.service)?.shortTitle}. Our
          dispatch team will call you within 30 minutes to confirm your appointment.
        </p>
        <div className="rounded-xl border border-border bg-card p-4 premium-shadow-sm">
          <p className="text-sm text-muted-foreground">
            Need to talk to us now? Call{' '}
            <a
              href={siteConfig.phoneHref}
              className="font-semibold text-primary hover:underline"
            >
              {siteConfig.phone}
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Premium step indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {steps.map((stepItem, idx) => (
            <div key={stepItem.number} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-full transition-[background-color,color,box-shadow,transform] duration-300 ease-premium ring-1',
                    step >= stepItem.number
                      ? 'bg-primary text-primary-foreground ring-primary premium-shadow-glow'
                      : 'bg-secondary text-muted-foreground ring-border',
                    step === stepItem.number && 'scale-110'
                  )}
                >
                  <stepItem.icon className="h-4 w-4" />
                </div>
                <span className={cn(
                  'text-xs font-medium transition-colors duration-200',
                  step >= stepItem.number ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {stepItem.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="relative mx-3 h-0.5 flex-1 overflow-hidden rounded-full bg-border">
                  <motion.div
                    initial={false}
                    animate={{ width: step > stepItem.number ? '100%' : '0%' }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute inset-y-0 left-0 bg-primary"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-5"
            >
              <div>
                <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
                  What service do you need?
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {services.map((service) => (
                    <button
                      key={service.slug}
                      type="button"
                      onClick={() => setValue('service', service.slug, { shouldValidate: true })}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border p-4 text-left transition-[background-color,border-color,box-shadow] duration-200 ease-premium',
                        formData.service === service.slug
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20 premium-shadow-glow'
                          : 'border-border hover:border-primary/30 hover:bg-secondary/50'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-lg transition-[background-color,color] duration-200',
                          formData.service === service.slug
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-primary/10 text-primary'
                        )}
                      >
                        <ServiceIcon name={service.icon} className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {service.shortTitle}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {service.priceFrom}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.service && (
                  <p className="mt-2 text-sm text-destructive">{errors.service.message}</p>
                )}
              </div>

              <div>
                <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
                  How urgent is it?
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { value: 'emergency', label: 'Emergency', desc: 'Within 1 hour', icon: Clock },
                    { value: 'urgent', label: 'Today', desc: 'Same-day service', icon: Calendar },
                    { value: 'flexible', label: 'Flexible', desc: 'Schedule ahead', icon: Calendar },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setValue('urgency', option.value, { shouldValidate: true })}
                      className={cn(
                        'rounded-xl border p-4 text-center transition-[background-color,border-color,box-shadow] duration-200 ease-premium',
                        formData.urgency === option.value
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20 premium-shadow-glow'
                          : 'border-border hover:border-primary/30 hover:bg-secondary/50'
                      )}
                    >
                      <option.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                      <div className="text-sm font-medium text-foreground">
                        {option.label}
                      </div>
                      <div className="text-xs text-muted-foreground">{option.desc}</div>
                    </button>
                  ))}
                </div>
                {errors.urgency && (
                  <p className="mt-2 text-sm text-destructive">{errors.urgency.message}</p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button type="button" onClick={nextStep} className="gap-2">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Personal Info */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-5"
            >
              <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
                Your Contact Information
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Rahul Sharma"
                    {...register('name')}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+91 98765 43210"
                    type="tel"
                    {...register('phone')}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="rahul.sharma@gmail.com"
                  type="email"
                  {...register('email')}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button type="button" onClick={nextStep} className="gap-2">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-5"
            >
              <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
                Service Location
              </h3>
              <div className="space-y-2">
                <Label htmlFor="city">City / Town</Label>
                <SearchableCitySelect
                  id="city"
                  value={formData.city || ''}
                  onChange={(val) => setValue('city', val, { shouldValidate: true })}
                  aria-invalid={!!errors.city}
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <AddressAutocomplete
                  id="address"
                  value={formData.address || ''}
                  onChange={(val) => setValue('address', val, { shouldValidate: true })}
                  city={formData.city}
                  placeholder="123, Salt Lake, Kolkata, West Bengal"
                  aria-invalid={!!errors.address}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date (optional)</Label>
                <Input id="date" type="date" {...register('date')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Describe your plumbing issue or access details..."
                  rows={3}
                  {...register('notes')}
                />
              </div>
              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button type="button" onClick={nextStep} className="gap-2">
                  Review &amp; Confirm
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-5"
            >
              <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
                Review Your Booking
              </h3>
              <Card className="border-border/50">
                <CardContent className="space-y-4 p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Service
                      </span>
                      <p className="text-sm font-medium text-foreground">
                        {services.find((s) => s.slug === formData.service)?.shortTitle || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Urgency
                      </span>
                      <p className="text-sm font-medium text-foreground capitalize">
                        {formData.urgency || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Name
                      </span>
                      <p className="text-sm font-medium text-foreground">
                        {formData.name || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Phone
                      </span>
                      <p className="text-sm font-medium text-foreground">
                        {formData.phone || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Email
                      </span>
                      <p className="text-sm font-medium text-foreground">
                        {formData.email || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        City
                      </span>
                      <p className="text-sm font-medium text-foreground">
                        {formData.city || '—'}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Address
                      </span>
                      <p className="text-sm font-medium text-foreground">
                        {formData.address || '—'}
                      </p>
                    </div>
                    {formData.notes && (
                      <div className="sm:col-span-2">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Notes
                        </span>
                        <p className="text-sm font-medium text-foreground">
                          {formData.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-xl bg-secondary/50 p-4 text-sm leading-relaxed text-muted-foreground">
                By submitting, you agree to be contacted by SOHAN PIPELINES to
                confirm your appointment. This is a request — not a confirmed
                booking. We will call you within 30 minutes to confirm.
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={prevStep} className="gap-2" disabled={submitting}>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button type="submit" size="lg" className="gap-2" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <CheckCircle2 className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
