'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllEntries, deleteEntry, updateEntry, createEntry } from '@/lib/store/slices/dailyEntrySlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Edit,
  Trash2,
  Plus,
  Save,
  ArrowLeft,
  ArrowUpCircle,
  ArrowDownCircle,
  Banknote,
  CreditCard
} from 'lucide-react';
import { DailyEntry } from '@/lib/types/entries';
import { AddDailyEntryForm } from './AddDailyEntryForm';
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
  createDataTableConfig
} from '@/lib/utils/dataTableUtils';
import { TableColumn } from '@/components/ui/data-table';

interface DailyEntriesTableProps {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
}

export function DailyEntriesTable({ selectedDate, onDateChange }: DailyEntriesTableProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { entries, loading, pagination } = useAppSelector((state) => state.dailyEntry);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DailyEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  useEffect(() => {
    dispatch(fetchAllEntries({status: 'draft'}));
  }, [dispatch]);

  const handleCreateEntry = async (entryData: any) => {
    try {
      await dispatch(createEntry(entryData)).unwrap();
      toast.success('Entry created successfully');
      dispatch(fetchAllEntries({status: 'draft'}));
      setIsFormOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create entry');
    }
  };

  const handleUpdateEntry = async (entryData: any) => {
    try {
      await dispatch(updateEntry(entryData)).unwrap();
      toast.success('Entry updated successfully');
      setEditingEntry(null);
      dispatch(fetchAllEntries({status: 'draft'}));
    } catch (error: any) {
      toast.error(error.message || 'Failed to update entry');
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        await dispatch(deleteEntry(entryId)).unwrap();
        toast.success('Entry deleted successfully');
        dispatch(fetchAllEntries({status: 'draft'}));
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete entry');
      }
    }
  };

  const handleSaveEntries = async () => {
    setShowSaveConfirmation(true);
  };

  const confirmSaveEntries = async () => {
    setShowSaveConfirmation(false);
    setIsSaving(true);
    try {
      const response = await dailyEntryAPI.saveTodayEntries();
      if (response.status.success) {
        toast.success('Daily entries saved successfully');
        dispatch(fetchAllEntries({status: 'draft'}));
      } else {
        toast.error('Failed to save entries');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save entries');
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (entry: DailyEntry) => {
    setEditingEntry(entry);
  };

  const handleBackToEntries = () => {
    router.push('/dashboard/entries');
  };

  // Define table columns
  const columns: TableColumn<DailyEntry>[] = [
    createDateColumn<DailyEntry>('entryDate', 'Date', (entry) => entry.entryDate, { width: 'w-32' }),
    createTextColumn<DailyEntry>('purpose', 'Purpose', (entry) => entry.purpose || 'N/A', { width: 'w-64' }),
    createTextColumn<DailyEntry>('entryType', 'Type', (entry) => entry.entryType, {  width: 'w-32' }),
    {
      key: 'paymentType',
      header: 'Payment',
      accessor: (entry: DailyEntry) => {
        const isReceive = entry.paymentType === 'credit';
        return (
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 w-fit ${
              isReceive 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700'
            }`}
          >
            {isReceive ? (
              <ArrowUpCircle className="h-3 w-3" />
            ) : (
              <ArrowDownCircle className="h-3 w-3" />
            )}
            <span className="text-xs">{isReceive ? 'Receive' : 'Send'}</span>
          </Badge>
        );
      },
      sortable: true,
      width: 'w-24',
      exportable: true
    },
    {
      key: 'paymentMethod',
      header: 'Payment Method',
      accessor: (entry: DailyEntry) => {
        const isCash = entry.paymentMethod?.toLowerCase() === 'cash';
        return (
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 w-fit ${
              isCash 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700' 
                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700'
            }`}
          >
            {isCash ? (
              <Banknote className="h-3 w-3" />
            ) : (
              <CreditCard className="h-3 w-3" />
            )}
            <span className="text-xs capitalize">{entry.paymentMethod || 'N/A'}</span>
          </Badge>
        );
      },
      sortable: true,
      width: 'w-24',
      exportable: true
    },
    createCurrencyColumn<DailyEntry>('amount', 'Amount', (entry) => entry.amount, { width: 'w-26' }),

    // createTextColumn<DailyEntry>('entryClearStatus', 'Clear Status', (entry) => entry.entryClearStatus, { 
    //   width: 'w-32' 
    // }),
  ];

  // Define table actions
  const actions = [
    createEditAction<DailyEntry>((entry) => startEditing(entry), 'Edit Entry'),
    createDeleteAction<DailyEntry>((entry) => handleDeleteEntry(entry.entryId), 'Delete Entry'),
  ];

  // Define table filters
  // const tableFilters = [
  //   createSelectFilter('entryType', 'Entry Type', [
  //     { label: 'All Types', value: 'all' },
  //     { label: 'Customer', value: 'customer' },
  //     { label: 'Vendor', value: 'vendor' },
  //     { label: 'Expense', value: 'expense' }
  //   ]),
  //   createSelectFilter('status', 'Status', [
  //     { label: 'All Status', value: 'all' },
  //     { label: 'Draft', value: 'draft' },
  //     { label: 'Active', value: 'active' },
  //     { label: 'Inactive', value: 'inactive' }
  //   ]),
  // ];

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
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex justify-end items-center gap-2">
        <Button
          onClick={handleSaveEntries}
          disabled={isSaving || entries.length === 0}
          size="sm"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
          title={entries.length === 0 ? 'No entries to save' : `Save all ${entries.length} draft entries`}
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : entries.length === 0 ? 'No Entries' : `Save Entries (${entries.length})`}
        </Button>
        <Button onClick={() => setIsFormOpen(true)} size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {/* Daily Entries DataTable */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardContent className="p-0">
          <DataTable
            data={entries}
            {...tableConfig}
            loading={loading}
            emptyMessage="No daily entries found. Get started by adding your first entry."
          />
        </CardContent>
      </Card>

      {/* Add/Edit Entry Form */}
      <AddDailyEntryForm
        open={isFormOpen || !!editingEntry}
        onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false);
            setEditingEntry(null);
          }
        }}
        onSubmit={editingEntry ? handleUpdateEntry : handleCreateEntry}
        entry={editingEntry}
      />

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showSaveConfirmation} onOpenChange={setShowSaveConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Daily Entries</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save all {entries.length} draft entries? This action will move them from draft to completed status and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSaveEntries} className="bg-green-600 hover:bg-green-700">
              Save Entries
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}