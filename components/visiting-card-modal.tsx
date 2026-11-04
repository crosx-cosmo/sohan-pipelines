'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  Contact,
  Download,
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
  Check,
  X,
  ShieldCheck,
  MessageCircle,
  FileDown,
  RotateCw,
  QrCode,
  ImageDown,
  ExternalLink,
  Sparkles,
  Copy,
  CheckCircle2,
  Languages,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/brand-logo';
import { businessInfo } from '@/lib/business-info';
import { trackRegionalPlumbingEvent } from '@/components/google-analytics';
import {
  downloadVisitingCardVcf,
  downloadVisitingCardPdf,
  downloadVisitingCardPng,
} from '@/lib/visiting-card-export';

interface VisitingCardModalProps {
  workshopName?: string;
  workshopAddress?: string;
  workshopPin?: string;
  triggerVariant?: 'footer' | 'contact';
}

type CardSide = 'front' | 'back';
type CardLang = 'en' | 'bn';
type QrTarget = 'whatsapp' | 'website';

const CARD_COPY = {
  en: {
    modalBadge: 'Official Executive Credential',
    flipToBack: 'Flip to Back (QR & Scope)',
    flipToFront: 'Flip to Front (Identity)',
    verifiedBadge: `Est. ${businessInfo.established} · Verified`,
    brandTitle: "Sohan Pipeline's & Plumbing",
    brandSubtitle: 'Total Plumbing Solutions & Genuine Spare Parts',
    hotlineLabel: 'Direct Hotline & WhatsApp Dispatch',
    emailLabel: 'Official Email Desk',
    workshopDefault: 'Base Workshop & Spare Parts Counter',
    hoursLabel: `${businessInfo.hours} (${businessInfo.hoursDays})`,
    callTap: 'Call Now',
    whatsappTap: 'WhatsApp',
    mapsTap: 'Open Map',
    copyTap: 'Copy No.',
    backHeader: 'Core Engineering & Service Matrix',
    backSub: 'Scan QR with phone camera for instant connection',
    qrWhatsapp: 'WhatsApp QR',
    qrWebsite: 'Booking QR',
    pillars: [
      {
        code: '01',
        title: 'Industrial & Domestic Piping',
        desc: 'UPVC, CPVC & GI pipe fitting with pressure testing',
      },
      {
        code: '02',
        title: 'Concealed Leak Diagnostics',
        desc: 'Non-destructive pinpointing for wall & underground lines',
      },
      {
        code: '03',
        title: 'Complete Sanitary & Pump Setup',
        desc: 'Diverters, geysers, commodes, water tanks & booster pumps',
      },
      {
        code: '04',
        title: 'Authorized Spare Parts Counter',
        desc: '100% genuine Astral, Supreme, Ashirvad & Finolex fittings',
      },
    ],
    guaranteeStrip:
      'Zero Advance Fee  •  12-Month Joint Warranty  •  Pay After Inspection',
    saveContactBtn: 'Save to Phone Contacts (.vcf)',
    saveImageBtn: 'Save HD Card Image (.png)',
    savePdfBtn: 'Print-Ready PDF (Front & Back)',
    shareWhatsappBtn: 'Send on WhatsApp',
    shareCopyBtn: 'Share / Copy Card',
    copiedBtn: 'Copied Details!',
  },
  bn: {
    modalBadge: 'অফিসিয়াল ভিজিটিং কার্ড',
    flipToBack: 'পিছনের দিক দেখুন (QR ও পরিষেবা)',
    flipToFront: 'সামনের দিক দেখুন (পরিচয়পত্র)',
    verifiedBadge: `স্থাপিত ${businessInfo.established} · ভেরিফায়েড`,
    brandTitle: 'সোহান পাইপলাইন’স অ্যান্ড প্লাম্বিং',
    brandSubtitle: 'টোটাল প্লাম্বিং সলিউশনস এবং আসল স্পেয়ার পার্টস কাউন্টার',
    hotlineLabel: 'সরাসরি হটলাইন ও হোয়াটসঅ্যাপ ডিসপ্যাচ',
    emailLabel: 'অফিসিয়াল ইমেইল ডেস্ক',
    workshopDefault: 'প্রধান ওয়ার্কশপ ও স্পেয়ার পার্টস কাউন্টার',
    hoursLabel: `${businessInfo.hours} (সোম - শনি)`,
    callTap: 'কল করুন',
    whatsappTap: 'হোয়াটসঅ্যাপ',
    mapsTap: 'গুগল ম্যাপ',
    copyTap: 'নম্বর কপি',
    backHeader: 'প্রধান প্লাম্বিং ও পাইপলাইন পরিষেবাসমূহ',
    backSub: 'সরাসরি যোগাযোগ করতে ফোনের ক্যামেরা দিয়ে QR স্ক্যান করুন',
    qrWhatsapp: 'হোয়াটসঅ্যাপ QR',
    qrWebsite: 'ওয়েবসাইট QR',
    pillars: [
      {
        code: '01',
        title: 'আধুনিক পাইপলাইন ফিটিং (UPVC/CPVC/GI)',
        desc: 'হাইড্রোস্ট্যাটিক প্রেসার টেস্টিং সহ নিখুঁত জয়েন্ট ও পাইপলাইন কাজ',
      },
      {
        code: '02',
        title: 'দেওয়ালের ভিতরের লিকেজ নির্ণয়',
        desc: 'টাইলস না ভেঙে আধুনিক যন্ত্রের সাহায্যে গোপন লিকেজ শনাক্তকরণ',
      },
      {
        code: '03',
        title: 'সম্পূর্ণ বাথরুম ও ওয়াটার পাম্প সেটআপ',
        desc: 'ডাইভার্টার, গিজার, কমোড, ওভারহেড ট্যাঙ্ক এবং বুস্টার পাম্প ইনস্টলেশন',
      },
      {
        code: '04',
        title: 'আসল স্পেয়ার পার্টস কাউন্টার',
        desc: 'Astral, Supreme, Ashirvad ও Finolex-এর ১০০% আসল ফিটিংস',
      },
    ],
    guaranteeStrip:
      'অগ্রিম ফি নেই  •  ১২ মাসের জয়েন্ট ওয়ারেন্টি  •  কাজ দেখে পেমেন্ট',
    saveContactBtn: 'ফোনে নম্বর সেভ করুন (.vcf)',
    saveImageBtn: 'কার্ডের ছবি ডাউনলোড (.png)',
    savePdfBtn: 'প্রিন্ট করার PDF ডাউনলোড',
    shareWhatsappBtn: 'হোয়াটসঅ্যাপে পাঠান',
    shareCopyBtn: 'শেয়ার / কপি করুন',
    copiedBtn: 'কপি হয়েছে!',
  },
} as const;

export function VisitingCardModal({
  workshopName = 'Base Workshop & Spare Parts Counter',
  workshopAddress = businessInfo.address,
  workshopPin = businessInfo.pincode,
  triggerVariant = 'footer',
}: VisitingCardModalProps) {
  const [open, setOpen] = React.useState(false);
  const [side, setSide] = React.useState<CardSide>('front');
  const [lang, setLang] = React.useState<CardLang>('en');
  const [qrTarget, setQrTarget] = React.useState<QrTarget>('whatsapp');
  const [copied, setCopied] = React.useState(false);
  const [phoneCopied, setPhoneCopied] = React.useState(false);
  const [downloadingPng, setDownloadingPng] = React.useState(false);
  const [downloadingPdf, setDownloadingPdf] = React.useState(false);

  // Subtle interactive 3D glare coordinates
  const [glarePos, setGlarePos] = React.useState({ x: 50, y: 30 });

  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const t = CARD_COPY[lang];
  const resolvedWorkshopName =
    workshopName && workshopName.trim()
      ? workshopName
      : t.workshopDefault;

  const whatsappDirectUrl = `https://wa.me/919382882517?text=${encodeURIComponent(
    "Hello Sohan Pipeline's & Plumbing, I scanned your official Visiting Card and would like to inquire about plumbing service / spare parts."
  )}`;
  const websiteBookingUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/book`
      : 'https://sohan-pipelines.netlify.app/book';

  const activeQrData =
    qrTarget === 'whatsapp' ? whatsappDirectUrl : websiteBookingUrl;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&color=071936&bgcolor=ffffff&data=${encodeURIComponent(
    activeQrData
  )}`;

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setGlarePos({ x, y });
  };

  const handleCopyPhone = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(businessInfo.phone);
      setPhoneCopied(true);
      toast.success('Hotline Number Copied', {
        description: businessInfo.phoneDisplay,
      });
      setTimeout(() => setPhoneCopied(false), 2000);
    } catch {
      toast.info(businessInfo.phoneDisplay);
    }
  };

  const handleSaveVcf = () => {
    downloadVisitingCardVcf({
      workshopName: resolvedWorkshopName,
      workshopAddress,
      workshopPin,
    });
    trackRegionalPlumbingEvent('save_vcard_contact', {
      source: triggerVariant,
    });
    toast.success('Official Contact (.vcf) Downloaded', {
      description:
        'Open the file to save Sohan Pipeline’s directly to your phone contacts.',
    });
  };

  const handleSavePng = async () => {
    try {
      setDownloadingPng(true);
      await downloadVisitingCardPng(
        {
          workshopName: resolvedWorkshopName,
          workshopAddress,
          workshopPin,
        },
        qrImageUrl
      );
      trackRegionalPlumbingEvent('download_visiting_card_png', {
        source: triggerVariant,
      });
      toast.success('HD Visiting Card Image (.png) Saved', {
        description:
          'Ready to view in your gallery or forward directly on WhatsApp.',
      });
    } catch {
      toast.error('Could not save image. Please try the PDF or Contact option.');
    } finally {
      setDownloadingPng(false);
    }
  };

  const handleSavePdf = () => {
    try {
      setDownloadingPdf(true);
      downloadVisitingCardPdf({
        workshopName: resolvedWorkshopName,
        workshopAddress,
        workshopPin,
      });
      trackRegionalPlumbingEvent('download_visiting_card_pdf', {
        source: triggerVariant,
      });
      toast.success('Print-Ready Front & Back Visiting Card PDF Downloaded');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const shareText = [
    `🪪 *${businessInfo.name}* — ${businessInfo.tagline}`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `📞 *Direct Hotline / WhatsApp:* ${businessInfo.phoneDisplay}`,
    `✉️ *Email:* ${businessInfo.email}`,
    `📍 *${resolvedWorkshopName}:* ${workshopAddress} (PIN: ${workshopPin})`,
    `🕒 *Hours:* ${businessInfo.hours} (${businessInfo.hoursDays})`,
    `🛠️ *Services:* Pipe Fitting, Leak Detection, Sanitaryware, Water Tank & Genuine Spare Parts`,
    `🌐 *Google Maps:* ${businessInfo.googleMapsUrl}`,
  ].join('\n');

  const handleShareOrCopy = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${businessInfo.name} — Official Visiting Card`,
          text: shareText,
          url: window.location.origin,
        });
        trackRegionalPlumbingEvent('share_visiting_card', {
          method: 'native_share',
        });
        return;
      } catch {
        // Fallback to clipboard copy
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success('Official Visiting Card Copied to Clipboard');
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.info(businessInfo.phoneDisplay);
    }
  };

  return (
    <>
      {triggerVariant === 'footer' ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-2.5 rounded-xl border border-primary/35 bg-gradient-to-r from-primary/12 via-primary/8 to-accent/12 hover:from-primary/20 hover:to-accent/20 px-4 py-2.5 text-xs font-semibold text-foreground shadow-crisp-xs transition-all cursor-pointer active:scale-[0.98]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
            <Contact className="h-3.5 w-3.5" />
          </span>
          <span>Official Visiting Card &amp; Save Contact</span>
          <QrCode className="h-3.5 w-3.5 text-primary transition-transform group-hover:scale-110" />
        </button>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-full justify-between h-12 rounded-2xl border-primary/40 bg-gradient-to-r from-primary/[0.07] via-primary/[0.04] to-accent/[0.07] hover:from-primary/[0.12] hover:to-accent/[0.12] text-foreground font-semibold text-xs sm:text-sm px-4 shadow-crisp-xs"
        >
          <span className="flex items-center gap-3 truncate">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shrink-0">
              <Contact className="h-4 w-4" />
            </span>
            <span className="truncate text-left">
              <span className="block font-bold text-xs sm:text-sm leading-tight">
                Official Digital Visiting Card &amp; QR
              </span>
              <span className="block text-[11px] text-muted-foreground font-medium">
                Save to Phone Contacts (.vcf) · HD Card (.png) · PDF
              </span>
            </span>
          </span>
          <QrCode className="h-4 w-4 text-primary shrink-0 ml-2" />
        </Button>
      )}

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5">
                {/* Dark Frosted Glass Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
                  aria-hidden="true"
                />

                {/* Modal Shell */}
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="visiting-card-title"
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 12 }}
                  transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 w-full max-w-xl rounded-3xl border border-border/80 bg-card p-4 sm:p-6 shadow-2xl space-y-4 max-h-[94vh] overflow-y-auto"
                >
                  {/* Top Control Bar: Badge + Language Switch + Flip Button + Close */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                      <span>{t.modalBadge}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* EN / বাংলা Toggle */}
                      <button
                        type="button"
                        onClick={() =>
                          setLang((prev) => (prev === 'en' ? 'bn' : 'en'))
                        }
                        className="inline-flex items-center gap-1 rounded-xl border border-border/80 bg-muted/50 hover:bg-muted px-2.5 py-1.5 text-[11px] font-semibold text-foreground transition-colors cursor-pointer"
                        title="Switch Card Language (English / বাংলা)"
                      >
                        <Languages className="h-3.5 w-3.5 text-primary" />
                        <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
                      </button>

                      {/* Flip Front / Back Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setSide((prev) =>
                            prev === 'front' ? 'back' : 'front'
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl border border-primary/35 bg-primary/10 hover:bg-primary/15 px-3 py-1.5 text-[11px] font-semibold text-primary transition-colors cursor-pointer"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                        <span>
                          {side === 'front' ? t.flipToBack : t.flipToFront}
                        </span>
                      </button>

                      {/* Close Button */}
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/70 bg-muted/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        aria-label="Close visiting card modal"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* ========================================================== */}
                  {/* INTERACTIVE TWO-SIDED EXECUTIVE VISITING CARD              */}
                  {/* ========================================================== */}
                  <div
                    onPointerMove={handleCardPointerMove}
                    className="relative select-none"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {side === 'front' ? (
                        <motion.div
                          key="card-front"
                          initial={{ opacity: 0, rotateY: -12, scale: 0.98 }}
                          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                          exit={{ opacity: 0, rotateY: 12, scale: 0.98 }}
                          transition={{
                            duration: 0.26,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="relative overflow-hidden rounded-2xl border border-sky-400/35 bg-gradient-to-br from-[#061329] via-[#0B2552] to-[#040E21] p-5 sm:p-6 text-white shadow-2xl"
                        >
                          {/* Top Liquid Cobalt-Cyan Accent Strip */}
                          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-teal-300" />

                          {/* Interactive Specular Foil Sheen */}
                          <div
                            className="pointer-events-none absolute inset-0 opacity-35 transition-opacity duration-300"
                            style={{
                              background: `radial-gradient(360px circle at ${glarePos.x}% ${glarePos.y}%, rgba(56, 189, 248, 0.22), transparent 70%)`,
                            }}
                            aria-hidden="true"
                          />

                          {/* Subtle Blueprint Engineering Grid */}
                          <div
                            className="pointer-events-none absolute inset-0 opacity-[0.07]"
                            style={{
                              backgroundImage:
                                'linear-gradient(to right, #93c5fd 1px, transparent 1px), linear-gradient(to bottom, #93c5fd 1px, transparent 1px)',
                              backgroundSize: '28px 28px',
                            }}
                            aria-hidden="true"
                          />

                          {/* Card Header: Logo + Brand Name + Verified Seal */}
                          <div className="relative flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-white/15">
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="rounded-xl bg-white p-1 shadow-md shrink-0">
                                <BrandLogo size="md" />
                              </div>
                              <div className="min-w-0">
                                <h3
                                  id="visiting-card-title"
                                  className="font-display text-base sm:text-xl font-extrabold tracking-tight text-white leading-tight"
                                >
                                  {t.brandTitle}
                                </h3>
                                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-sky-300 mt-0.5">
                                  {t.brandSubtitle}
                                </p>
                              </div>
                            </div>

                            <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300 shrink-0">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              {t.verifiedBadge}
                            </span>
                          </div>

                          {/* Card Body: Left Contact Column + Right Scannable QR Preview */}
                          <div className="relative py-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            <div className="sm:col-span-8 space-y-3 min-w-0">
                              {/* Hotline & WhatsApp Row */}
                              <div className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.06] border border-white/12 px-3.5 py-2.5">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/25 text-sky-300">
                                    <Phone className="h-4 w-4" />
                                  </span>
                                  <div className="min-w-0">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-200/90 block">
                                      {t.hotlineLabel}
                                    </span>
                                    <span className="font-mono text-sm sm:text-base font-extrabold text-white tabular-nums block">
                                      {businessInfo.phoneDisplay}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={handleCopyPhone}
                                  className="inline-flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 px-2 py-1 text-[10px] font-semibold text-sky-200 transition-colors cursor-pointer shrink-0"
                                >
                                  {phoneCopied ? (
                                    <Check className="h-3 w-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                  <span>{t.copyTap}</span>
                                </button>
                              </div>

                              {/* Email Row */}
                              <div className="flex items-center gap-2.5 px-1">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300">
                                  <Mail className="h-3.5 w-3.5" />
                                </span>
                                <div className="min-w-0">
                                  <span className="text-[10px] uppercase tracking-wider text-slate-300 block">
                                    {t.emailLabel}
                                  </span>
                                  <span className="text-xs font-semibold text-white truncate block">
                                    {businessInfo.email}
                                  </span>
                                </div>
                              </div>

                              {/* Live Workshop Address Box */}
                              <div className="rounded-xl bg-slate-950/45 border border-sky-400/25 p-3 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-300">
                                    <MapPin className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                                    <span className="truncate">
                                      {resolvedWorkshopName}
                                    </span>
                                  </span>
                                  <span className="font-mono text-[10px] font-bold text-emerald-300 shrink-0">
                                    PIN {workshopPin}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-100 leading-snug">
                                  {workshopAddress}
                                </p>
                              </div>
                            </div>

                            {/* Right Mini Scannable QR Box (Click to Flip to Full QR Back) */}
                            <div className="sm:col-span-4 flex flex-col items-center justify-center rounded-2xl bg-white/95 p-3 text-slate-900 shadow-lg">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={qrImageUrl}
                                alt="Sohan Pipelines Instant Scan QR Code"
                                width={116}
                                height={116}
                                className="h-28 w-28 rounded-lg object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => setSide('back')}
                                className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#003E9E] hover:underline cursor-pointer"
                              >
                                <QrCode className="h-3 w-3" />
                                <span>Scan / Flip Card</span>
                              </button>
                            </div>
                          </div>

                          {/* Interactive One-Tap Quick Action Chips inside Card Footer */}
                          <div className="relative pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <a
                                href={`tel:${businessInfo.phone}`}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/35 border border-sky-400/30 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors"
                              >
                                <Phone className="h-3 w-3 text-sky-300" />
                                <span>{t.callTap}</span>
                              </a>
                              <a
                                href={whatsappDirectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/30 px-2.5 py-1 text-[11px] font-semibold text-emerald-200 transition-colors"
                              >
                                <MessageCircle className="h-3 w-3 text-emerald-300" />
                                <span>{t.whatsappTap}</span>
                              </a>
                              <a
                                href={businessInfo.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1 text-[11px] font-semibold text-slate-200 transition-colors"
                              >
                                <ExternalLink className="h-3 w-3 text-sky-300" />
                                <span>{t.mapsTap}</span>
                              </a>
                            </div>

                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-300">
                              <Clock className="h-3 w-3 text-sky-300 shrink-0" />
                              <span>{t.hoursLabel}</span>
                            </span>
                          </div>
                        </motion.div>
                      ) : (
                        /* ====================================================== */
                        /* BACK SIDE: SCANNABLE QR HUB & TECHNICAL SERVICE MATRIX */
                        /* ====================================================== */
                        <motion.div
                          key="card-back"
                          initial={{ opacity: 0, rotateY: 12, scale: 0.98 }}
                          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                          exit={{ opacity: 0, rotateY: -12, scale: 0.98 }}
                          transition={{
                            duration: 0.26,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="relative overflow-hidden rounded-2xl border border-emerald-400/35 bg-gradient-to-br from-[#051226] via-[#092247] to-[#041022] p-5 sm:p-6 text-white shadow-2xl"
                        >
                          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-400 via-sky-400 to-blue-500" />

                          {/* Back Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-white/15">
                            <div>
                              <h4 className="font-display text-sm sm:text-base font-bold text-white">
                                {t.backHeader}
                              </h4>
                              <p className="text-[11px] text-sky-200/90">
                                {t.backSub}
                              </p>
                            </div>

                            {/* Switch QR Target: WhatsApp vs Website Booking */}
                            <div className="inline-flex rounded-xl bg-slate-950/60 border border-white/15 p-0.5">
                              <button
                                type="button"
                                onClick={() => setQrTarget('whatsapp')}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                                  qrTarget === 'whatsapp'
                                    ? 'bg-emerald-500 text-slate-950'
                                    : 'text-slate-300 hover:text-white'
                                }`}
                              >
                                {t.qrWhatsapp}
                              </button>
                              <button
                                type="button"
                                onClick={() => setQrTarget('website')}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                                  qrTarget === 'website'
                                    ? 'bg-sky-400 text-slate-950'
                                    : 'text-slate-300 hover:text-white'
                                }`}
                              >
                                {t.qrWebsite}
                              </button>
                            </div>
                          </div>

                          {/* Back Content: 4 Technical Pillars + Large Scannable QR */}
                          <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            <div className="sm:col-span-7 grid grid-cols-1 gap-2">
                              {t.pillars.map((item) => (
                                <div
                                  key={item.code}
                                  className="rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 flex items-start gap-2.5"
                                >
                                  <span className="font-mono text-[10px] font-bold text-sky-300 bg-sky-500/20 px-1.5 py-0.5 rounded-md shrink-0 mt-0.5">
                                    {item.code}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-white leading-tight">
                                      {item.title}
                                    </p>
                                    <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                                      {item.desc}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="sm:col-span-5 flex flex-col items-center justify-center rounded-2xl bg-white p-3.5 text-slate-900 shadow-xl">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={qrImageUrl}
                                alt="Sohan Pipelines Scannable QR"
                                width={148}
                                height={148}
                                className="h-36 w-36 rounded-lg object-contain"
                              />
                              <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#071936]">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                <span>
                                  {qrTarget === 'whatsapp'
                                    ? 'Scan for WhatsApp Desk'
                                    : 'Scan for Online Booking'}
                                </span>
                              </span>
                            </div>
                          </div>

                          {/* Guarantee Footer Bar */}
                          <div className="pt-3 border-t border-white/15 flex items-center justify-center text-center">
                            <p className="text-[11px] font-bold tracking-wide text-emerald-300">
                              {t.guaranteeStrip}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ========================================================== */}
                  {/* ENTERPRISE EXPORT & SAVE SUITE                             */}
                  {/* ========================================================== */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <Button
                      type="button"
                      onClick={handleSaveVcf}
                      className="h-11 rounded-xl font-semibold text-xs justify-center"
                    >
                      <Download className="mr-1.5 h-4 w-4 shrink-0" />
                      <span className="truncate">{t.saveContactBtn}</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={downloadingPng}
                      onClick={handleSavePng}
                      className="h-11 rounded-xl font-semibold text-xs justify-center border-primary/35 bg-primary/[0.04] hover:bg-primary/10"
                    >
                      <ImageDown className="mr-1.5 h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">
                        {downloadingPng ? 'Saving PNG...' : t.saveImageBtn}
                      </span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={downloadingPdf}
                      onClick={handleSavePdf}
                      className="h-11 rounded-xl font-semibold text-xs justify-center border-border/80"
                    >
                      <FileDown className="mr-1.5 h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">
                        {downloadingPdf ? 'Building PDF...' : t.savePdfBtn}
                      </span>
                    </Button>
                  </div>

                  {/* Secondary Share / WhatsApp Row */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-border/60">
                    <Button
                      asChild
                      variant="outline"
                      className="h-10 rounded-xl font-semibold text-xs border-emerald-500/35 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15"
                    >
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          shareText
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                        <span>{t.shareWhatsappBtn}</span>
                      </a>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleShareOrCopy}
                      className="h-10 rounded-xl font-semibold text-xs border border-border/70"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span>{t.copiedBtn}</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="mr-1.5 h-3.5 w-3.5 text-primary shrink-0" />
                          <span>{t.shareCopyBtn}</span>
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
