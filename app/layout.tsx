import './globals.css';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { MobileCTA } from '@/components/site/mobile-cta';
import { ThemeProvider } from '@/components/site/theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
});

const siteUrl = 'https://www.sohanpipelines.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SOHAN PIPELINES | Premium Plumbing Solutions — 24/7 Emergency Service',
    template: '%s | SOHAN PIPELINES',
  },
  description:
    'SOHAN PIPELINES delivers expert residential and commercial plumbing services — emergency repairs, water heaters, drain cleaning, repiping, and more. Licensed, insured, and trusted by thousands of homeowners.',
  keywords: [
    'plumber',
    'plumbing services',
    'emergency plumber',
    'water heater repair',
    'drain cleaning',
    'leak detection',
    'repiping',
    'commercial plumbing',
    'local plumber',
    'West Bengal plumber',
  ],
  authors: [{ name: 'SOHAN PIPELINES' }],
  creator: 'SOHAN PIPELINES',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'SOHAN PIPELINES',
    title: 'SOHAN PIPELINES | Premium Plumbing Solutions — 24/7 Emergency Service',
    description:
      'Expert residential and commercial plumbing services. Licensed, insured, and available 24/7 for emergencies. Book a trusted local plumber today.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SOHAN PIPELINES — Premium Plumbing Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOHAN PIPELINES | Premium Plumbing Solutions',
    description:
      'Expert residential and commercial plumbing services. Licensed, insured, and available 24/7 for emergencies.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'Home Services',
};

const noFlashScript = `
(function() {
  try {
    var stored = localStorage.getItem('sohan-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <MobileCTA />
        </ThemeProvider>
      </body>
    </html>
  );
}
