'use client';

import { useState } from 'react';
import { InvoiceManagement } from '@/components/finance/InvoiceManagement';
import { InvoiceForm } from '@/components/finance/InvoiceForm';
import { Invoice } from '@/lib/types';

export default function InvoicesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateInvoice = (invoiceData: Omit<Invoice, 'invoiceId' | 'createdAt' | 'updatedAt' | '_id'>) => {
    // Handle creation logic here
    console.log('Creating invoice:', invoiceData);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <InvoiceManagement onCreateNew={() => setIsCreateDialogOpen(true)} />
      
      <InvoiceForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateInvoice}
        invoice={null}
      />
    </div>
  );
}
