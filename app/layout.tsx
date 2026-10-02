import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from '@/components/ui/sonner';
import {NextIntlClientProvider} from 'next-intl';
import { resolveI18n } from '@/i18n/request';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Staffly - Complete Business Management Solution for Pakistani Enterprises',
  description: 'Professional business management platform for Pakistani enterprises. Streamline payroll, CRM, finance, invoicing, quotations, customer management, employee tracking, till management, daily entries, and comprehensive reporting. Built for Pakistani businesses with local compliance.',
  keywords: 'Pakistan business management, SaaS platform, payroll software, CRM system, finance management, invoicing software, quotation management, customer relationship management, employee management, till management, daily entries, business reports, Pakistani business software, enterprise management, QuickBooks alternative Pakistan, business automation, financial reporting, attendance tracking, salary management, vendor management, contractor management, director management, business analytics, cloud-based business software, Pakistani tax compliance, business operations management',
  authors: [{ name: 'Staffly Team' }],
  creator: 'Staffly',
  publisher: 'Staffly',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://staffly.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Staffly - Complete Business Management Solution for Pakistani Enterprises',
    description: 'Professional business management platform for Pakistani enterprises. Streamline payroll, CRM, finance, invoicing, quotations, customer management, employee tracking, till management, daily entries, and comprehensive reporting.',
    url: 'https://staffly.com',
    siteName: 'Staffly',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Staffly Business Management Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Staffly - Complete Business Management Solution for Pakistani Enterprises',
    description: 'Professional business management platform for Pakistani enterprises. Streamline payroll, CRM, finance, invoicing, quotations, customer management, employee tracking, till management, daily entries, and comprehensive reporting.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {locale, messages} = await resolveI18n();
  return (
    <html lang={locale} translate="no" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className={inter.className}>
        <Providers>
         <NextIntlClientProvider locale={locale} messages={messages}>{children}</NextIntlClientProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}