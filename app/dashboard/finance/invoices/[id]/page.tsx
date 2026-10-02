'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InvoiceDetailPage } from '@/components/finance/InvoiceDetailPage';
import { InvoiceForm } from '@/components/finance/InvoiceForm';
import { Invoice } from '@/lib/types';

interface InvoiceDetailPageProps {
  params: {
    id: string;
  };
}

export default function InvoiceDetailPageRoute({ params }: InvoiceDetailPageProps) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleUpdate = (invoice: any) => {
    // Handle update logic here
    console.log('Updating invoice:', invoice);
    setIsEditDialogOpen(false);
    router.refresh();
  };

  const handleDelete = (id: string) => {
    router.push('/dashboard/finance/invoices');
  };

  const handleBack = () => {
    router.push('/dashboard/finance/invoices');
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <InvoiceDetailPage
        invoiceId={params.id}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onBack={handleBack}
        onEdit={handleEdit}
      />
      
      <InvoiceForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdate}
        invoice={null} // Will be loaded by the form hook
      />
    </div>
  );
}
