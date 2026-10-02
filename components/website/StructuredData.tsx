'use client';

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Staffly",
    "description": "Complete business management solution for Pakistani enterprises. Streamline payroll, CRM, finance, invoicing, quotations, customer management, employee tracking, till management, daily entries, and comprehensive reporting.",
    "url": "https://staffly.com",
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
      "url": "https://staffly.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Staffly",
      "url": "https://staffly.com",
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
    "screenshot": "https://staffly.com/screenshot.png",
    "softwareVersion": "1.0.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "en-US",
    "isAccessibleForFree": false,
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareRequirements": "Web Browser",
    "memoryRequirements": "512MB RAM",
    "storageRequirements": "100MB",
    "permissions": "Internet connection required",
    "countriesSupported": "PK",
    "availableLanguage": ["en", "ur"],
    "category": [
      "Business Management",
      "Payroll Software",
      "CRM Software",
      "Financial Management",
      "Enterprise Software",
      "SaaS"
    ],
    "keywords": [
      "Pakistan business management",
      "SaaS platform",
      "payroll software",
      "CRM system",
      "finance management",
      "invoicing software",
      "quotation management",
      "customer relationship management",
      "employee management",
      "till management",
      "daily entries",
      "business reports",
      "Pakistani business software",
      "enterprise management",
      "QuickBooks alternative Pakistan",
      "business automation",
      "financial reporting",
      "attendance tracking",
      "salary management",
      "vendor management",
      "contractor management",
      "director management",
      "business analytics",
      "cloud-based business software",
      "Pakistani tax compliance",
      "business operations management"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
