'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllEntries, deleteEntry, updateEntry, createEntry, fetchEntryById } from '@/lib/store/slices/dailyEntrySlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
  Edit,
  Trash2,
  Plus,
  Save,
  ArrowLeft
} from 'lucide-react';
import { DailyEntry } from '@/lib/types/entries';
import { AddDailyEntryForm } from './AddDailyEntryForm';
import { EntryDetailPopup } from './EntryDetailPopup';
import { dailyEntryAPI } from '@/lib/services/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { 
  createTextColumn, 
  createBadgeColumn, 
  createCurrencyColumn, 
  createDateColumn,
  createEditAction,
  createDeleteAction,
  createSelectFilter,
  createDataTableConfig,
  createViewAction
} from '@/lib/utils/dataTableUtils';

interface AllEntriesTableProps {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
}

export function AllEntriesTable({ selectedDate, onDateChange }: AllEntriesTableProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { entries, loading, pagination, selectedEntry } = useAppSelector((state) => state.dailyEntry);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DailyEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isViewPopupOpen, setIsViewPopupOpen] = useState(false);
  const [viewEntryLoading, setViewEntryLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllEntries({status: 'completed'}));
  }, [dispatch]);

  const handleViewEntry = async (entryId: string) => {
    try {
      setViewEntryLoading(true);
      setIsViewPopupOpen(true);
      
      await dispatch(fetchEntryById(entryId)).unwrap();
      toast.success('Entry details loaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch entry details');
      setIsViewPopupOpen(false);
    } finally {
      setViewEntryLoading(false);
    }
  };

  const handleCloseViewPopup = () => {
    setIsViewPopupOpen(false);
  };

  // Define table columns
  const columns = [
    createDateColumn<DailyEntry>('entryDate', 'Date', (entry) => entry.entryDate, { width: 'w-32' }),
    createTextColumn<DailyEntry>('entryType', 'Type', (entry) => entry.entryType, { 
      // variant: 'outline',
      width: 'w-32' 
    }),
    createTextColumn<DailyEntry>('paymentType', 'Payment', (entry) => 
      entry.paymentType === 'credit' ? 'Receive' : 'Send', { 
        // variant: 'outline',
        width: 'w-32' 
      }
    ),
    createCurrencyColumn<DailyEntry>('amount', 'Amount', (entry) => entry.amount, { width: 'w-32' }),
    createTextColumn<DailyEntry>('paymentMethod', 'Payment Method', (entry) => entry.paymentMethod, { 
      width: 'w-32' 
    }),
    createTextColumn<DailyEntry>('purpose', 'Purpose', (entry) => entry.purpose || 'N/A', { width: 'w-48' }),
    createTextColumn<DailyEntry>('entryClearStatus', 'Clear Status', (entry) => entry.entryClearStatus, { 
      // variant: 'outline',
      width: 'w-32' 
    }),
  ];

  // Define table actions
  const actions = [
    createViewAction<DailyEntry>((entry) => handleViewEntry(entry.entryId), 'View Entry'),
  ];

  // Define table filters
  const tableFilters = [
    createSelectFilter('entryType', 'Entry Type', [
      { label: 'All Types', value: 'all' },
      { label: 'Customer', value: 'customer' },
      { label: 'Vendor', value: 'vendor' },
      { label: 'Expense', value: 'expense' }
    ]),
    createSelectFilter('status', 'Status', [
      { label: 'All Status', value: 'all' },
      { label: 'Draft', value: 'draft' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ]),
  ];

  // Create table configuration
  const tableConfig = createDataTableConfig(columns, actions, {
    title: 'Daily Entries',
    subtitle: 'Manage daily financial entries and transactions',
    searchable: true,
    searchPlaceholder: 'Search entries...',
    pagination: {
      enabled: true,
      pageSize: 20,
      pageSizeOptions: [10, 20, 50, 100]
    },
    sortable: true,
    exportOptions: {
      enablePrint: true,
      enablePDF: false,
      enableCSV: false,
      filename: 'daily-entries-export'
    }
  });

  return (
    <div className="space-y-6">
      {/* Daily Entries DataTable */}
      <DataTable
        data={entries}
        {...tableConfig}
        loading={loading}
        emptyMessage={
          'No daily entries found. Get started by adding your first entry.'
        }
      />

      {/* Entry Detail Popup */}
      <EntryDetailPopup
        isOpen={isViewPopupOpen}
        onClose={handleCloseViewPopup}
        entry={selectedEntry}
        loading={viewEntryLoading}
      />
    </div>
  );
}