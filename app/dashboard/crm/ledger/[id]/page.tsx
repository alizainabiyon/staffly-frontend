'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LedgerDetailView } from '@/components/crm/LedgerDetailView';
import { toast } from 'sonner';

// Mock data for ledger entries
interface LedgerEntry {
  id: string;
  customerId: string;
  customerName: string;
  type: 'invoice' | 'payment' | 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'overdue';
  reference: string;
  balance: number;
  dueDate?: string;
  paymentMethod?: string;
  notes?: string;
}

const mockLedgerEntries: LedgerEntry[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'ABC Company Ltd.',
    type: 'invoice',
    amount: 150000,
    description: 'Construction Materials - Phase 1',
    date: '2024-01-15',
    status: 'completed',
    reference: 'INV-2024-001',
    balance: 0,
    dueDate: '2024-02-15',
    notes: 'Materials delivered and installed successfully'
  },
  {
    id: '2',
    customerId: '1',
    customerName: 'ABC Company Ltd.',
    type: 'payment',
    amount: -150000,
    description: 'Payment Received',
    date: '2024-01-20',
    status: 'completed',
    reference: 'PAY-2024-001',
    balance: 0,
    paymentMethod: 'Bank Transfer'
  },
  {
    id: '3',
    customerId: '2',
    customerName: 'XYZ Corporation',
    type: 'invoice',
    amount: 250000,
    description: 'Engineering Services - Project Alpha',
    date: '2024-01-10',
    status: 'pending',
    reference: 'INV-2024-002',
    balance: 250000,
    dueDate: '2024-02-10',
    notes: 'Engineering services completed, awaiting payment'
  },
  {
    id: '4',
    customerId: '3',
    customerName: 'Delta Industries',
    type: 'invoice',
    amount: 180000,
    description: 'Consultation Services',
    date: '2024-01-05',
    status: 'overdue',
    reference: 'INV-2024-003',
    balance: 180000,
    dueDate: '2024-02-05',
    notes: 'Payment overdue, follow-up required'
  },
  {
    id: '5',
    customerId: '3',
    customerName: 'Delta Industries',
    type: 'credit',
    amount: -50000,
    description: 'Credit Note - Service Adjustment',
    date: '2024-01-12',
    status: 'completed',
    reference: 'CR-2024-001',
    balance: 130000,
    notes: 'Credit applied for service adjustment'
  },
];



export default function LedgerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<LedgerEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const foundEntry = mockLedgerEntries.find(e => e.id === params.id);
      if (foundEntry) {
        setEntry(foundEntry);
      } else {
        toast.error('Ledger entry not found');
        router.push('/dashboard/crm/ledger');
      }
      setLoading(false);
    }
  }, [params.id, router]);

  const handleBackToList = () => {
    router.push('/dashboard/crm/ledger');
  };

  const handleEditEntry = (entry: LedgerEntry) => {
    // Navigate to edit page or open edit modal
    router.push(`/dashboard/crm/ledger/${entry.id}/edit`);
  };

  const handleDeleteEntry = (id: string) => {
    // Handle delete logic
    toast.success('Ledger entry deleted successfully');
    router.push('/dashboard/crm/ledger');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ledger entry...</p>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Ledger entry not found</p>
          <button 
            onClick={handleBackToList}
            className="text-primary hover:underline mt-2"
          >
            Back to ledger
          </button>
        </div>
      </div>
    );
  }

  return (
    <LedgerDetailView
      entry={entry}
      onEdit={handleEditEntry}
      onDelete={handleDeleteEntry}
      onBack={handleBackToList}
    />
  );
}
