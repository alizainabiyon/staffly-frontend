'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Receipt } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SalaryManagement } from '@/components/payroll/SalaryManagement';
import { useTranslations } from 'next-intl';

export default function SalarySlipsPage() {
  const t = useTranslations('Salary.page');
  const router = useRouter();

  const handleBackToPayroll = () => {
    router.push('/dashboard/payroll');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBackToPayroll}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToPayroll')}
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
            <p className="text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t('exportAll')}
          </Button>
          <Button size="sm">
            <Receipt className="h-4 w-4 mr-2" />
            {t('generateBatch')}
          </Button>
        </div>
      </div>

      {/* Salary Management Component */}
      <SalaryManagement />
    </div>
  );
}