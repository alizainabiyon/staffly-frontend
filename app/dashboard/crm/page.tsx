'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function CRMPage() {
  const t = useTranslations('Common');
  
  // Redirect to customers page by default
  useEffect(() => {
    window.location.href = '/dashboard/crm/customers';
  }, []);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{t('loading')}...</p>
      </div>
    </div>
  );
}