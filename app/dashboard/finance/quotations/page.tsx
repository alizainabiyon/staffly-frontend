'use client';

import { useState } from 'react';
import { QuotationManagement } from '@/components/finance/QuotationManagement';
import { QuotationForm } from '@/components/finance/QuotationForm';
import { Quotation } from '@/lib/types';

export default function QuotationsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateQuotation = (quotationData: Omit<Quotation, 'quotationId' | 'createdAt' | 'updatedAt' | '_id'>) => {
    // Handle creation logic here
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <QuotationManagement onCreateNew={() => setIsCreateDialogOpen(true)} />
      
      <QuotationForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateQuotation}
        quotation={null}
      />
    </div>
  );
}
