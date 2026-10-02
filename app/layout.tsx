import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://sohan-pipelines.netlify.app'),
  title: {
    default: "Sohan Pipeline's & Plumbing — Total Plumbing Solutions",
    template: "%s · Sohan Pipeline's & Plumbing",
  },
  description:
    'Professional plumbing services in Midnapore and surrounding areas. Pipe fitting, drainage cleaning, bathroom fitting, water tank installation, and more. Book a service today.',
  keywords: [
    'plumber Midnapore',
    'plumbing services Dantan',
    'pipe fitting',
    'drainage cleaning',
    'bathroom fitting',
    'water tank installation',
    'Sohan Pipeline',
  ],
  openGraph: {
    title: "Sohan Pipeline's & Plumbing — Total Plumbing Solutions",
    description:
      'Professional plumbing services in Midnapore. Book a service online or call +91 86701 43003.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
