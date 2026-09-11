'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { services } from '@/lib/data';
import { CheckCircle2, Phone, Mail, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { siteConfig } from '@/lib/data';
import { motion } from 'motion/react';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Please tell us how we can help'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const selectedService = watch('service');

  const onSubmit = async (data: ContactFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Contact form submission:', data);
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-success/30 bg-success/5 p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <CheckCircle2 className="mb-4 h-16 w-16 text-success" />
        </motion.div>
        <h3 className="mb-2 font-display text-2xl font-bold text-foreground">
          Message Sent!
        </h3>
        <p className="mb-6 max-w-md leading-relaxed text-muted-foreground">
          Thank you for reaching out. One of our team members will get back to you
          within 1 business hour. For emergencies, please call us directly.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline">
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

      <div className="space-y-2">
        <Label htmlFor="service">Service Needed</Label>
        <Select
          value={selectedService}
          onValueChange={(value) => setValue('service', value)}
        >
          <SelectTrigger id="service">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.slug} value={service.slug}>
                {service.shortTitle}
              </SelectItem>
            ))}
            <SelectItem value="other">Other / Not Sure</SelectItem>
          </SelectContent>
        </Select>
        {errors.service && (
          <p className="text-sm text-destructive">{errors.service.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">How Can We Help?</Label>
        <Textarea
          id="message"
          placeholder="Describe your plumbing issue or question..."
          rows={4}
          {...register('message')}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full gap-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}

export function ContactInfoCards() {
  const items = [
    {
      icon: Phone,
      label: 'Call Us',
      value: siteConfig.phone,
      href: siteConfig.phoneHref,
    },
    {
      icon: Mail,
      label: 'Email Us',
      value: siteConfig.email,
      href: siteConfig.emailHref,
    },
    {
      icon: MapPin,
      label: 'Visit Us',
      value: `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.state} ${siteConfig.address.zip}`,
    },
    {
      icon: Clock,
      label: 'Hours',
      value: `Mon–Fri: ${siteConfig.hours.weekdays}\nSat: ${siteConfig.hours.saturday}\nSun: ${siteConfig.hours.sunday}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => {
        const content = (
          <div className="card-hover flex items-start gap-3 rounded-xl border border-border/50 bg-card p-4 transition-[border-color,box-shadow,transform] duration-200 hover:border-primary/30 hover:premium-shadow-sm hover:-translate-y-0.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {item.label}
              </div>
              <div className="mt-0.5 text-sm font-medium text-foreground whitespace-pre-line">
                {item.value}
              </div>
            </div>
          </div>
        );
        return item.href ? (
          <a key={item.label} href={item.href} className="block">
            {content}
          </a>
        ) : (
          <div key={item.label}>{content}</div>
        );
      })}
    </div>
  );
}
