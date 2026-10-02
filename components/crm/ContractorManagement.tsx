'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchContractors, deleteContractor, setFilters, createContractor, updateContractor } from '@/lib/store/slices/contractorSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  Briefcase,
  Building,
  Eye
} from 'lucide-react';
import { AddContractorForm } from './AddContractorForm';
import { Contractor } from '@/lib/types/crm';
import { toast } from 'sonner';
import { CRMHeader } from './shared/CRMHeader';
import { CRMStats } from './shared/CRMStats';
import { CRMFilters } from './shared/CRMFilters';
import { CRMStates } from './shared/CRMStates';
import { handleSearchFilter, handleTypeFilter, handlePageChange, handleFormClose, handleApiError, handleApiSuccess, confirmDelete, getEmptyStateMessage } from '@/lib/utils/crmUtils';
import { 
  createTextColumn, 
  createBadgeColumn, 
  createEditAction,
  createDeleteAction,
  createSelectFilter,
  createDataTableConfig,
  createViewAction
} from '@/lib/utils/dataTableUtils';
import { useTranslations } from 'next-intl';

export function ContractorManagement() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { contractors, loading, error, filters, pagination } = useAppSelector((state) => state.contractor);
  const t = useTranslations('Contractor');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContractor, setEditingContractor] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [contractorToDelete, setContractorToDelete] = useState<Contractor | null>(null);

  useEffect(() => {
    dispatch(fetchContractors());
  }, [dispatch]);

  const handleAddContractor = async (contractorData: Omit<Contractor, '_id' | 'contractorId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'userID'>) => {
    try {
      const result = await dispatch(createContractor(contractorData)).unwrap();
      // Use the success message from the API response
      const message = result && typeof result === 'object' && 'message' in result ? result.message : t('messages.contractorAdded');
      toast.success(message);
      // Refresh the contractors list
      dispatch(fetchContractors());
    } catch (error: any) {
      toast.error(error.message || t('messages.addFailed'));
      // Re-throw the error so the form knows it failed and doesn't close
      throw error;
    }
  };

  const handleViewContractor = (contractor: Contractor) => {
    router.push(`/dashboard/crm/contractors/${contractor.contractorId}`);
  };

  const handleEditContractor = (contractor: Contractor) => {
    setEditingContractor(contractor.contractorId);
    setIsFormOpen(true);
  };

  const handleUpdateContractor = async (contractorData: Omit<Contractor, '_id' | 'contractorId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'userID'>) => {
    try {
      if (!editingContractor) return;
      const result = await dispatch(updateContractor({
        contractorId: editingContractor,
        ...contractorData,
      })).unwrap();
      
      // Use the success message from the API response
      const message = result && typeof result === 'object' && 'message' in result ? result.message : t('messages.contractorUpdated');
      toast.success(message);
      
      // Refresh the contractors list
      dispatch(fetchContractors());
    } catch (error: any) {
      toast.error(error.message || t('messages.updateFailed'));
      // Re-throw the error so the form knows it failed and doesn't close
      throw error;
    }
  };

  const handleDeleteContractor = (contractor: Contractor) => {
    setContractorToDelete(contractor);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteContractor = async () => {
    if (!contractorToDelete) return;
    
    try {
      await dispatch(deleteContractor(contractorToDelete.contractorId)).unwrap();
      toast.success(t('messages.contractorDeleted'));
      dispatch(fetchContractors());
    } catch (error: any) {
      handleApiError(error, toast, t('messages.deleteFailed'));
    } finally {
      setShowDeleteConfirmation(false);
      setContractorToDelete(null);
    }
  };

  const handleSearch = (searchTerm: string) => {
    dispatch(setFilters({ search: searchTerm, page: 1 }));
  };

  const handleTypeFilter = (type: string) => {
    const filterValue = type === 'all' ? '' : type;
    dispatch(setFilters({ type: filterValue, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ page }));
  };

  // Prepare stats data
  const statsData = [
    {
      title: t('stats.totalContractors'),
      value: pagination.total,
      icon: Users,
      iconColor: 'bg-primary'
    },
    {
      title: t('stats.individualContractors'),
      value: contractors.filter(c => c.type === 'individual').length,
      icon: User,
      iconColor: 'bg-green-500'
    },
    {
      title: t('stats.businessContractors'),
      value: contractors.filter(c => c.type === 'company').length,
      icon: Building,
      iconColor: 'bg-blue-500'
    },
    {
      title: 'Categories',
      value: new Set(contractors.map(c => c.category)).size,
      icon: Briefcase,
      iconColor: 'bg-purple-500'
    }
  ];

  // Prepare filter options
  const filterOptions = [
    {
      type: 'type' as const,
      label: t('table.type'),
      options: [
        { value: 'all', label: t('filters.allStatus') },
        { value: 'individual', label: t('form.types.individual') },
        { value: 'company', label: t('form.types.business') }
      ]
    }
  ];

  // Define table columns
  const columns = [
    createTextColumn<Contractor>('name', t('table.name'), (contractor) => contractor.name, { 
      width: 'w-48' 
    }),
    createTextColumn<Contractor>('type', t('table.type'), (contractor) => contractor.type, { 
      width: 'w-32' 
    }),
    createTextColumn<Contractor>('companyName', t('table.company'), (contractor) => contractor.companyName || 'N/A', { 
      width: 'w-48' 
    }),
    createTextColumn<Contractor>('category', 'Category', (contractor) => contractor.category, { 
      width: 'w-32' 
    }),
    createTextColumn<Contractor>('email', t('table.email'), (contractor) => contractor.email || 'No email', { 
      width: 'w-64' 
    }),
    createTextColumn<Contractor>('phone', t('table.phone'), (contractor) => contractor.phone, { 
      width: 'w-32' 
    }),
    createTextColumn<Contractor>('address', t('table.address'), (contractor) => contractor.address || 'N/A', { 
      width: 'w-48' 
    }),
    createBadgeColumn<Contractor>('industry', 'Industry', (contractor) => contractor.industry, { 
      variant: 'outline',
      width: 'w-32' 
    }),
  ];

  // Define table actions
  const actions = [
    createEditAction<Contractor>((contractor) => handleEditContractor(contractor), t('editContractor')),
    createDeleteAction<Contractor>((contractor) => handleDeleteContractor(contractor), t('deleteContractor')),
    createViewAction<Contractor>((contractor) => handleViewContractor(contractor), t('viewContractor')),
  ];

  // Define table filters
  const tableFilters = [
    createSelectFilter('type', t('table.type'), [
      { label: t('filters.allStatus'), value: 'all' },
      { label: t('form.types.individual'), value: 'individual' },
      { label: t('form.types.business'), value: 'company' }
    ]),
  ];

  // Create table configuration
  const tableConfig = createDataTableConfig(columns, actions, {
    title: t('title'),
    subtitle: t('subtitle'),
    searchable: true,
    searchPlaceholder: t('table.searchPlaceholder'),
    filters: tableFilters,
    pagination: {
      enabled: true,
      pageSize: 20,
      pageSizeOptions: [10, 20, 50, 100]
    },
    sortable: true,
    exportOptions: {
      enablePrint: false,
      enablePDF: false,
      enableCSV: false,
      filename: 'contractors-export'
    }
  });

  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('title')}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            {t('subtitle')}
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingContractor(null);
            setIsFormOpen(true);
          }}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          <Users className="h-4 w-4 mr-2" />
          {t('addContractor')}
        </Button>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-emerald-300/40 dark:hover:border-emerald-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.totalContractors')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{pagination.total}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-green-300/40 dark:hover:border-green-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.individualContractors')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{contractors.filter(c => c.type === 'individual').length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-blue-300/40 dark:hover:border-blue-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.businessContractors')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{contractors.filter(c => c.type === 'company').length}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Building className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-purple-300/40 dark:hover:border-purple-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Categories</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{new Set(contractors.map(c => c.category)).size}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contractors DataTable */}
      <DataTable
        data={contractors}
        {...tableConfig}
        loading={loading}
        emptyMessage={
          t('table.emptyMessage')
        }
      />

      {/* Add/Edit Contractor Form */}
      <AddContractorForm
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false);
            setEditingContractor(null);
          }
        }}
        onSubmit={editingContractor ? handleUpdateContractor : handleAddContractor}
        contractorId={editingContractor}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteConfirmation.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirmation.description', { name: contractorToDelete?.name ?? '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('deleteConfirmation.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteContractor} className="bg-red-600 hover:bg-red-700">
              {t('deleteConfirmation.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}