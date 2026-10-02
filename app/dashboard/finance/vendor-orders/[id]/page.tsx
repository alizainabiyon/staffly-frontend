'use client';

import { VendorOrderDetailPage } from '@/components/finance/VendorOrderDetailPage';

interface VendorOrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function VendorOrderDetailPageRoute({ params }: VendorOrderDetailPageProps) {
  return (
    <div className="container mx-auto py-6">
      <VendorOrderDetailPage />
    </div>
  );
}
