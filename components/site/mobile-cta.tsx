'use client';

import Link from 'next/link';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { siteConfig } from '@/lib/data';

export function MobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden">
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="glass border-t border-border premium-shadow-lg"
      >
        <div className="grid grid-cols-3 gap-px">
          <a
            href={siteConfig.phoneHref}
            className="flex flex-col items-center justify-center gap-1 py-3.5 text-xs font-medium text-foreground transition-colors active:bg-secondary"
          >
            <Phone className="h-5 w-5 text-primary" />
            Call
          </a>
          <a
            href={siteConfig.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 py-3.5 text-xs font-medium text-foreground transition-colors active:bg-secondary"
          >
            <MessageCircle className="h-5 w-5 text-success" />
            WhatsApp
          </a>
          <Link
            href="/book"
            className="flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-primary to-accent py-3.5 text-xs font-semibold text-primary-foreground transition-opacity active:opacity-90"
          >
            <Calendar className="h-5 w-5" />
            Book Now
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
