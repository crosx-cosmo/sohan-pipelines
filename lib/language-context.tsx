'use client';

import * as React from 'react';

export type SupportedLanguage = 'en' | 'bn';

const LANG_STORAGE_KEY = 'sohan_pipelines_lang_v1';

export const translations = {
  en: {
    // Top bar & Header
    topTagline: 'Plumbing Engineering & Authorized Spare Parts',
    topLocation: 'Bahardaltitia, Keshrambha, Dantan (PIN 721451)',
    brandSubtitle: 'Total Plumbing Solutions',
    navServices: 'Services',
    navServicesDesc: 'Certified Plumbing & Pipeline Engineering',
    navAbout: 'About',
    navAboutDesc: 'Master Plumber Experience & Standards',
    navReviews: 'Reviews',
    navReviewsDesc: 'Verified Client Feedback & Ratings',
    navAreas: 'Service Areas',
    navAreasDesc: 'Paschim & Purba Medinipur Coverage',
    navTrack: 'Track Booking',
    navTrackDesc: 'Live Status & Job Verification',
    navContact: 'Contact',
    navContactDesc: 'Direct Dispatch & Support Desk',
    navFaq: 'Help & FAQ',
    navFaqDesc: 'Warranty, Rates & Cleanout Procedures',
    navSpareParts: 'Spare Parts',
    navSparePartsDesc: 'Genuine Hardware & Wholesale Counter',
    bookService: 'Book Service',
    bookServiceOnline: 'Book Service Online',
    callHotline: 'Call Hotline',
    emergencyActive: 'Emergency Service Active',
    displayMode: 'Display Mode',
    languageLabel: 'Language / ভাষা',

    // Hero Section
    heroDivision: 'South Bengal Engineering Division',
    heroEstablished: 'Established',
    heroVerifiedReviews: 'Work-Verified Reviews',
    heroHeadlinePart1: 'Precision Pipeline Engineering &',
    heroHeadlineHighlight: 'Master Plumbing Solutions.',
    heroDescription:
      'SOHAN PIPELINES delivers end-to-end plumbing engineering across West Medinipur and surrounding regions—combining genuine Astral & Supreme spare parts counter sales with hydrostatic pressure-tested installations, concealed leak detection, and dependable local dispatch.',
    heroCallPrefix: 'Call',
    heroWhatsappDesk: 'WhatsApp Desk',
    heroTabDispatch: 'Instant Area Dispatch',
    heroTabTrack: 'Track / Review Order',
    heroTabQuote: 'Instant PDF Quote',
    heroAreasActive: 'Service Areas Active',
    heroScheduleIn: 'Schedule in',
    heroScheduleService: 'Schedule Service',
    heroTrackStatus: 'Track Status',
    heroEnterBookingId: 'Enter Booking ID (e.g. SP-2026...)',
    heroQuoteSelectPlaceholder: 'Select service for instant PDF estimate...',
    heroQuoteCustomerPlaceholder: 'Your Name / Locality (optional)',
    heroQuoteGenerateBtn: 'Download PDF & WhatsApp',
    trustIsiTitle: 'ISI Certified',
    trustIsiDesc: 'Astral, Supreme & Finolex fittings',
    trustSameDayTitle: 'Same-Day Slots',
    trustSameDayDesc: 'Scheduled & emergency visits',
    trustZeroAdvanceTitle: '₹0 Advance',
    trustZeroAdvanceDesc: 'Pay after pressure inspection',
    trustWarrantyTitle: '12-Mo Warranty',
    trustWarrantyDesc: 'Guaranteed leak-free joints',

    // Home Services Preview
    servicesEyebrow: '01 · Curated Engineering Capabilities',
    servicesHeadingPart1: 'Signature Plumbing Services for',
    servicesHeadingHighlight: 'Homes & Commercial Facilities',
    servicesSubheading:
      'Selected from our active service catalogue—combining precision pipe fitting, non-destructive leak diagnostics, and upfront written estimates before work begins.',
    viewAllServices: 'View All Services',
    bookAService: 'Book a Service',
    bookThisService: 'Book This Service',
    downloadServiceQuote: 'PDF Quote',
    payAfterInspection: 'Pay only after job inspection',
    includedScope: 'Included Workmanship Scope',
    standardsIncluded: '4 Standards Included',
    materialSpecsLabel: 'Material Grade, Testing & Warranty Specs',

    // Home Spare Parts Preview
    partsEyebrow: '02 · Authorized Hardware Counter & Live Inventory',
    partsHeadingPart1: 'Genuine Plumbing Spare Parts &',
    partsHeadingHighlight: 'Pipeline Fittings',
    partsSubheading:
      'Direct counter supply of pressure-rated water tanks, CPVC/UPVC fittings, heavy brass valves, and sanitaryware hardware—connected live to our Keshrambha & Dantan warehouse stock.',
    viewAllSpareParts: 'View All Spare Parts',
    counterSellingPrice: 'Counter Selling Price',
    priceOnEnquiry: 'Price on Enquiry',
    readyForDispatch: 'Ready for Dispatch',
    addToCart: 'Add to Cart',
    unavailable: 'Unavailable',
    downloadPdfQuote: 'Download Official PDF Quotation',
    pdfQuoteShort: 'PDF Quote',
    pdfDownloadedToast: 'Official PDF quotation downloaded',

    // Cart Drawer & PDF Quotation
    yourPartsCart: 'Your Parts Cart',
    itemsSelected: 'selected',
    clearAll: 'Clear All',
    cartEmptyTitle: 'Your Cart is Empty',
    cartEmptyDesc:
      'Browse our spare parts catalog and add genuine fittings, pipes, or valves to generate an official WhatsApp order or PDF quotation.',
    browseSpareParts: 'Browse Spare Parts',
    addCustomerDetailsOptional: 'Add Your Name & Delivery Location (Optional)',
    customerNameLabel: 'Customer Name',
    customerPhoneLabel: 'WhatsApp / Mobile Number',
    deliveryLocalityLabel: 'Delivery Locality / Town',
    specialNotesLabel: 'Special Specification / Pipe Size Notes',
    selectedItemsLabel: 'Selected Items',
    estimatedSubtotalLabel: 'Estimated Subtotal',
    sendCartOnWhatsapp: 'Send Cart on WhatsApp to Confirm',
    downloadOfficialPdfQuote: 'Download Official PDF Quotation',
    copyEnquiryList: 'Copy Enquiry List',
    summaryCopied: 'Summary Copied!',
    downloadBookingPdf: 'Download Official PDF Voucher',
    downloadWorkOrderPdf: 'Download Official PDF Work Order',

    // CTA & Footer
    ctaEyebrow: 'Daily Plumbing Crews Active Across Midnapore',
    ctaBadge: '24/7 Emergency & Scheduled Dispatch',
    ctaHeading: 'Facing An Urgent Leak Or Planning A Pipeline Project?',
    ctaSubheading:
      'Do not let hidden dampness, high-pressure bursts, or drainage backups compromise your home. Secure your appointment with master technicians today.',
    ctaDesc:
      'Do not let hidden dampness, high-pressure bursts, or drainage backups compromise your home. Secure your appointment with master technicians today.',
    ctaPrimaryBtn: 'Schedule Service Online',
    scheduleOnlineBtn: 'Schedule Service Online',
    ctaHotlinePrefix: 'Hotline:',
    hotlineLabel: 'Hotline',
    zeroAdvanceFee: '₹0 Advance Booking Fee',
    payAfterSatisfaction: 'Pay After Work Satisfaction',
    footerVerifiedContractor: 'Verified Local Contractor',
    footerServingSince: 'Serving South Bengal households since 2015',
    footerWrittenQuotes: 'Transparent Written Quotes',
    footerPayAfter: 'Pay only after work completion & inspection',
    footerEmergencyReady: 'Emergency Hotline Ready',
    footerDirectAccess: 'Direct mobile access to on-duty plumbers',
    footerViewAllAreas: 'View All Service Areas',
  },
  bn: {
    // Top bar & Header
    topTagline: 'প্লাম্বিং ইঞ্জিনিয়ারিং এবং অনুমোদিত স্পেয়ার পার্টস',
    topLocation: 'বাহারদালতিতিয়া, কেশরম্ভা, দাঁতন (পিন ৭২১৪৫১)',
    brandSubtitle: 'টোটাল প্লাম্বিং সলিউশনস',
    navServices: 'পরিষেবা',
    navServicesDesc: 'অনুমোদিত প্লাম্বিং ও পাইপলাইন ইঞ্জিনিয়ারিং',
    navAbout: 'আমাদের সম্পর্কে',
    navAboutDesc: 'মাস্টার প্লাম্বার অভিজ্ঞতা ও মানদণ্ড',
    navReviews: 'রিভিউ',
    navReviewsDesc: 'গ্রাহকদের যাচাইকৃত মতামত ও রেটিং',
    navAreas: 'পরিষেবা অঞ্চল',
    navAreasDesc: 'পশ্চিম ও পূর্ব মেদিনীপুর কভারেজ',
    navTrack: 'বুকিং ট্র্যাক',
    navTrackDesc: 'লাইভ স্ট্যাটাস ও কাজের যাচাইকরণ',
    navContact: 'যোগাযোগ',
    navContactDesc: 'সরাসরি ডিসপ্যাচ ও সহায়তা ডেস্ক',
    navFaq: 'সাহায্য ও প্রশ্নোত্তর',
    navFaqDesc: 'ওয়ারেন্টি, রেট ও পরিষেবা নিয়মাবলী',
    navSpareParts: 'স্পেয়ার পার্টস',
    navSparePartsDesc: 'আসল হার্ডওয়্যার ও পাইকারি কাউন্টার',
    bookService: 'বুক করুন',
    bookServiceOnline: 'অনলাইনে সার্ভিস বুক করুন',
    callHotline: 'কল করুন',
    emergencyActive: 'জরুরি পরিষেবা চালু আছে',
    displayMode: 'ডিসপ্লে মোড',
    languageLabel: 'ভাষা / Language',

    // Hero Section
    heroDivision: 'দক্ষিণবঙ্গ ইঞ্জিনিয়ারিং ডিভিশন',
    heroEstablished: 'প্রতিষ্ঠিত',
    heroVerifiedReviews: 'যাচাইকৃত গ্রাহক রিভিউ',
    heroHeadlinePart1: 'নিখুঁত পাইপলাইন ইঞ্জিনিয়ারিং ও',
    heroHeadlineHighlight: 'মাস্টার প্লাম্বিং সলিউশনস।',
    heroDescription:
      'সোহাণ পাইপলাইনস (SOHAN PIPELINES) পশ্চিম ও পূর্ব মেদিনীপুর জুড়ে সম্পূর্ণ প্লাম্বিং ইঞ্জিনিয়ারিং পরিষেবা প্রদান করে—আসল Astral ও Supreme স্পেয়ার পার্টস কাউন্টার বিক্রির পাশাপাশি প্রেশার-টেস্টেড পাইপ ফিটিং, গোপন লিক ডিটেকশন এবং দ্রুত টেকনিশিয়ান ডিসপ্যাচ।',
    heroCallPrefix: 'কল',
    heroWhatsappDesk: 'হোয়াটসঅ্যাপ ডেস্ক',
    heroTabDispatch: 'তাৎক্ষণিক এরিয়া বুকিং',
    heroTabTrack: 'বুকিং ট্র্যাক / রিভিউ',
    heroTabQuote: 'পিডিএফ কোটাশন (PDF)',
    heroAreasActive: 'টি অঞ্চলে পরিষেবা চালু',
    heroScheduleIn: 'বুক করুন:',
    heroScheduleService: 'সার্ভিস বুক করুন',
    heroTrackStatus: 'স্ট্যাটাস দেখুন',
    heroEnterBookingId: 'বুকিং আইডি লিখুন (যেমন SP-2026...)',
    heroQuoteSelectPlaceholder: 'তাৎক্ষণিক পিডিএফ কোটাশনের জন্য পরিষেবা বাছুন...',
    heroQuoteCustomerPlaceholder: 'আপনার নাম / এলাকা (ঐচ্ছিক)',
    heroQuoteGenerateBtn: 'PDF ডাউনলোড ও WhatsApp',
    trustIsiTitle: 'ISI অনুমোদিত',
    trustIsiDesc: 'Astral, Supreme ও Finolex ফিটিংস',
    trustSameDayTitle: 'সেম-ডে সার্ভিস',
    trustSameDayDesc: 'নির্ধারিত ও জরুরি ভিজিট',
    trustZeroAdvanceTitle: '₹০ অগ্রিম চার্জ',
    trustZeroAdvanceDesc: 'কাজ পরিদর্শনের পর পেমেন্ট',
    trustWarrantyTitle: '১২ মাসের ওয়ারেন্টি',
    trustWarrantyDesc: 'লিক-মুক্ত জয়েন্টের গ্যারান্টি',

    // Home Services Preview
    servicesEyebrow: '০১ · নির্বাচিত ইঞ্জিনিয়ারিং পরিষেবা',
    servicesHeadingPart1: 'বাড়ি ও বাণিজ্যিক প্রতিষ্ঠানের জন্য',
    servicesHeadingHighlight: 'সেরা প্লাম্বিং পরিষেবা',
    servicesSubheading:
      'আমাদের সক্রিয় সার্ভিস ক্যাটালগ থেকে নির্বাচিত—নিখুঁত পাইপ ফিটিং, আধুনিক লিক ডায়াগনস্টিকস এবং কাজ শুরুর আগে স্বচ্ছ লিখিত কোটাশন।',
    viewAllServices: 'সব পরিষেবা দেখুন',
    bookAService: 'সার্ভিস বুক করুন',
    bookThisService: 'এই সার্ভিস বুক করুন',
    downloadServiceQuote: 'PDF কোটাশন',
    payAfterInspection: 'কাজ দেখে সন্তুষ্ট হওয়ার পর পেমেন্ট',
    includedScope: 'অন্তর্ভুক্ত কাজের বিবরণ',
    standardsIncluded: '৪টি মানদণ্ড অন্তর্ভুক্ত',
    materialSpecsLabel: 'মেটিরিয়াল গ্রেড, টেস্টিং ও ওয়ারেন্টি বিবরণ',

    // Home Spare Parts Preview
    partsEyebrow: '০২ · অনুমোদিত হার্ডওয়্যার কাউন্টার ও লাইভ স্টক',
    partsHeadingPart1: 'আসল প্লাম্বিং স্পেয়ার পার্টস ও',
    partsHeadingHighlight: 'পাইপলাইন ফিটিংস',
    partsSubheading:
      'উচ্চ-চাপ সহনশীল জলের ট্যাঙ্ক, CPVC/UPVC ফিটিংস, হেভি ব্রাস ভালভ এবং স্যানিটারি হার্ডওয়্যার—আমাদের কেশরম্ভা ও দাঁতন গোডাউন থেকে সরাসরি সরবরাহ।',
    viewAllSpareParts: 'সব স্পেয়ার পার্টস দেখুন',
    counterSellingPrice: 'কাউন্টার বিক্রয় মূল্য',
    priceOnEnquiry: 'মূল্যের জন্য যোগাযোগ করুন',
    readyForDispatch: 'ডিসপ্যাচের জন্য প্রস্তুত',
    addToCart: 'কার্টে যোগ করুন',
    unavailable: 'স্টকে নেই',
    downloadPdfQuote: 'অফিসিয়াল PDF কোটাশন ডাউনলোড করুন',
    pdfQuoteShort: 'PDF কোটাশন',
    pdfDownloadedToast: 'অফিসিয়াল PDF কোটাশন ডাউনলোড হয়েছে',

    // Cart Drawer & PDF Quotation
    yourPartsCart: 'আপনার পার্টস কার্ট',
    itemsSelected: 'টি আইটেম নির্বাচিত',
    clearAll: 'সব মুছুন',
    cartEmptyTitle: 'আপনার কার্ট খালি',
    cartEmptyDesc:
      'আমাদের স্পেয়ার পার্টস ক্যাটালগ থেকে আসল ফিটিংস, পাইপ বা ভালভ কার্টে যোগ করে অফিসিয়াল পিডিএফ কোটাশন ডাউনলোড বা হোয়াটসঅ্যাপে অর্ডার করুন।',
    browseSpareParts: 'স্পেয়ার পার্টস দেখুন',
    addCustomerDetailsOptional: 'আপনার নাম ও ডেলিভারি ঠিকানা যোগ করুন (ঐচ্ছিক)',
    customerNameLabel: 'গ্রাহকের নাম',
    customerPhoneLabel: 'হোয়াটসঅ্যাপ / মোবাইল নম্বর',
    deliveryLocalityLabel: 'ডেলিভারি এলাকা / শহর',
    specialNotesLabel: 'বিশেষ নির্দেশিকা / পাইপ সাইজ নোট',
    selectedItemsLabel: 'নির্বাচিত আইটেম',
    estimatedSubtotalLabel: 'আনুমানিক মোট মূল্য',
    sendCartOnWhatsapp: 'হোয়াটসঅ্যাপে কার্ট পাঠিয়ে অর্ডার নিশ্চিত করুন',
    downloadOfficialPdfQuote: 'অফিসিয়াল PDF কোটাশন ডাউনলোড করুন',
    copyEnquiryList: 'তালিকা কপি করুন',
    summaryCopied: 'কপি হয়েছে!',
    downloadBookingPdf: 'অফিসিয়াল PDF ভাউচার ডাউনলোড করুন',
    downloadWorkOrderPdf: 'অফিসিয়াল PDF ওয়ার্ক অর্ডার ডাউনলোড করুন',

    // CTA & Footer
    ctaEyebrow: 'মেদিনীপুর জুড়ে প্রতিদিন প্লাম্বিং টিম সক্রিয়',
    ctaBadge: '২৪/৭ জরুরি ও নির্ধারিত ডিসপ্যাচ',
    ctaHeading: 'জরুরি পাইপ লিক বা নতুন পাইপলাইন প্রজেক্টের পরিকল্পনা করছেন?',
    ctaSubheading:
      'গোপন ড্যাম্প, হাই-প্রেশার লিক বা ড্রেনেজ ব্লকেজ আপনার বাড়ির ক্ষতি করতে দেবেন না। আজই আমাদের দক্ষ মাস্টার টেকনিশিয়ানদের বুক করুন।',
    ctaDesc:
      'গোপন ড্যাম্প, হাই-প্রেশার লিক বা ড্রেনেজ ব্লকেজ আপনার বাড়ির ক্ষতি করতে দেবেন না। আজই আমাদের দক্ষ মাস্টার টেকনিশিয়ানদের বুক করুন।',
    ctaPrimaryBtn: 'অনলাইনে সার্ভিস বুক করুন',
    scheduleOnlineBtn: 'অনলাইনে সার্ভিস বুক করুন',
    ctaHotlinePrefix: 'হটলাইন:',
    hotlineLabel: 'হটলাইন',
    zeroAdvanceFee: '₹০ অগ্রিম বুকিং চার্জ',
    payAfterSatisfaction: 'কাজে সন্তুষ্ট হওয়ার পর পেমেন্ট',
    footerVerifiedContractor: 'যাচাইকৃত স্থানীয় কন্ট্রাক্টর',
    footerServingSince: '২০১৫ সাল থেকে দক্ষিণবঙ্গে বিশ্বস্ত পরিষেবা',
    footerWrittenQuotes: 'স্বচ্ছ লিখিত কোটাশন',
    footerPayAfter: 'কাজ সম্পূর্ণ ও পরিদর্শনের পর পেমেন্ট',
    footerEmergencyReady: 'জরুরি হটলাইন প্রস্তুত',
    footerDirectAccess: 'অন-ডিউটি প্লাম্বারদের সাথে সরাসরি কথা বলুন',
    footerViewAllAreas: 'সব পরিষেবা অঞ্চল দেখুন',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextValue {
  lang: SupportedLanguage;
  isBn: boolean;
  setLang: (lang: SupportedLanguage) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = React.createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<SupportedLanguage>('en');

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(
          LANG_STORAGE_KEY
        ) as SupportedLanguage | null;
        if (saved === 'en' || saved === 'bn') {
          setLangState(saved);
        }
      } catch {
        // Ignore storage access errors
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    try {
      document.documentElement.lang = lang === 'bn' ? 'bn-IN' : 'en-IN';
    } catch {
      // Ignore DOM access errors
    }
  }, [lang]);

  const setLang = React.useCallback((nextLang: SupportedLanguage) => {
    setLangState(nextLang);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, nextLang);
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const toggleLang = React.useCallback(() => {
    setLang(lang === 'en' ? 'bn' : 'en');
  }, [lang, setLang]);

  const t = React.useCallback(
    (key: TranslationKey): string => {
      return translations[lang][key] || translations.en[key] || key;
    },
    [lang]
  );

  const value = React.useMemo(
    () => ({
      lang,
      isBn: lang === 'bn',
      setLang,
      toggleLang,
      t,
    }),
    [lang, setLang, toggleLang, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) {
    return {
      lang: 'en',
      isBn: false,
      setLang: () => {},
      toggleLang: () => {},
      t: (key: TranslationKey) => translations.en[key] || key,
    };
  }
  return ctx;
}
