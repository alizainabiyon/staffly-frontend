'use client';

import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

export function SEOHead({
  title = 'Staffly - Complete Business Management Solution for Pakistani Enterprises',
  description = 'Professional business management platform for Pakistani enterprises. Streamline payroll, CRM, finance, invoicing, quotations, customer management, employee tracking, till management, daily entries, and comprehensive reporting.',
  keywords = 'Pakistan business management, SaaS platform, payroll software, CRM system, finance management, invoicing software, quotation management, customer relationship management, employee management, till management, daily entries, business reports, Pakistani business software, enterprise management, QuickBooks alternative Pakistan, business automation, financial reporting, attendance tracking, salary management, vendor management, contractor management, director management, business analytics, cloud-based business software, Pakistani tax compliance, business operations management',
  canonical = 'https://staffly.com',
  ogImage = 'https://staffly.com/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image'
}: SEOHeadProps) {
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Staffly Team" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Staffly" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:creator" content="@staffly" />
      <meta property="twitter:site" content="@staffly" />
      
      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#059669" />
      <meta name="msapplication-TileColor" content="#059669" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Staffly" />
      
      {/* Geo Tags for Pakistan */}
      <meta name="geo.region" content="PK" />
      <meta name="geo.country" content="Pakistan" />
      <meta name="geo.placename" content="Pakistan" />
      
      {/* Business/Organization Tags */}
      <meta name="business:contact_data:country_name" content="Pakistan" />
      <meta name="business:contact_data:region" content="PK" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Staffly",
            "description": description,
            "url": canonical,
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "5000",
              "priceCurrency": "PKR",
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": "5000",
                "priceCurrency": "PKR",
                "billingIncrement": "P1M"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "150",
              "bestRating": "5",
              "worstRating": "1"
            },
            "author": {
              "@type": "Organization",
              "name": "Staffly",
              "url": canonical
            },
            "publisher": {
              "@type": "Organization",
              "name": "Staffly",
              "url": canonical,
              "logo": {
                "@type": "ImageObject",
                "url": "https://staffly.com/logo.png"
              }
            },
            "featureList": [
              "Payroll Management",
              "CRM System",
              "Finance Management",
              "Director Management",
              "Till Management",
              "Daily Entries",
              "Advanced Reports",
              "System Settings"
            ],
            "countriesSupported": "PK",
            "availableLanguage": ["en", "ur"],
            "category": [
              "Business Management",
              "Payroll Software",
              "CRM Software",
              "Financial Management",
              "Enterprise Software",
              "SaaS"
            ]
          })
        }}
      />
    </Head>
  );
}
