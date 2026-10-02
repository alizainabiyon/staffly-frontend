'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuotationDetailPage } from '@/components/finance/QuotationDetailPage';
import { QuotationForm } from '@/components/finance/QuotationForm';
import { Quotation } from '@/lib/types';

interface QuotationDetailPageProps {
  params: {
    id: string;
  };
}

export default function QuotationDetailPageRoute({ params }: QuotationDetailPageProps) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleUpdate = (quotation: any) => {
    // Handle update logic here
    console.log('Updating quotation:', quotation);
    setIsEditDialogOpen(false);
    router.refresh();
  };

  const handleDelete = (id: string) => {
    router.push('/dashboard/finance/quotations');
  };

  const handleBack = () => {
    router.push('/dashboard/finance/quotations');
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <QuotationDetailPage
        quotationId={params.id}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onBack={handleBack}
        onEdit={handleEdit}
      />
      
      <QuotationForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdate}
        quotation={null} // Will be loaded by the form hook
      />
    </div>
  );
}
