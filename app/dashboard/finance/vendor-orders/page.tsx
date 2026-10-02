'use client';

import { useState } from 'react';
import { VendorOrderManagement } from '@/components/finance/VendorOrderManagement';
import { VendorOrderForm } from '@/components/finance/VendorOrderForm';
import { VendorOrder } from '@/lib/types';

export default function VendorOrdersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateVendorOrder = (vendorOrderData: Omit<VendorOrder, 'orderId' | 'createdAt' | 'updatedAt' | '_id'>) => {
    // Handle creation logic here
    console.log('Creating vendor order:', vendorOrderData);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <VendorOrderManagement onCreateNew={() => setIsCreateDialogOpen(true)} />
      
      <VendorOrderForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateVendorOrder}
        vendorOrder={null}
      />
    </div>
  );
}
