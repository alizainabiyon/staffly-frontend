'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchVendors, deleteVendor, setFilters, createVendor, updateVendor } from '@/lib/store/slices/vendorSlice';
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
import { AddVendorForm } from '@/components/crm/AddVendorForm';
import { Vendor } from '@/lib/types/crm';
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

export function VendorManagement() {
  const t = useTranslations('Vendor.management');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { vendors, loading, error, filters, pagination } = useAppSelector((state) => state.vendor);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  const handleAddVendor = async (vendorData: Omit<Vendor, '_id' | 'vendorId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'userID'>) => {
    try {
      const result = await dispatch(createVendor(vendorData)).unwrap();
      // Use the success message from the API response
      const message = result && typeof result === 'object' && 'message' in result ? result.message : 'Vendor added successfully';
      toast.success(message);
      // Refresh the vendors list
      dispatch(fetchVendors());
    } catch (error: any) {
      toast.error(error.message || 'Failed to add vendor');
      // Re-throw the error so the form knows it failed and doesn't close
      throw error;
    }
  };

  const handleViewVendor = (vendor: Vendor) => {
    router.push(`/dashboard/crm/vendors/${vendor.vendorId}`);
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor.vendorId);
    setIsFormOpen(true);
  };

  const handleUpdateVendor = async (vendorData: Omit<Vendor, '_id' | 'vendorId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'userID'>) => {
    try {
      if (!editingVendor) return;
      const result = await dispatch(updateVendor({
        vendorId: editingVendor,
        ...vendorData,
      })).unwrap();
      
      // Use the success message from the API response
      const message = result && typeof result === 'object' && 'message' in result ? result.message : 'Vendor updated successfully';
      toast.success(message);
      
      // Refresh the vendors list
      dispatch(fetchVendors());
    } catch (error: any) {
      toast.error(error.message || 'Failed to update vendor');
      // Re-throw the error so the form knows it failed and doesn't close
      throw error;
    }
  };

  const handleDeleteVendor = (vendor: Vendor) => {
    setVendorToDelete(vendor);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteVendor = async () => {
    if (!vendorToDelete) return;
    
    try {
      await dispatch(deleteVendor(vendorToDelete.vendorId)).unwrap();
      toast.success('Vendor deleted successfully');
      dispatch(fetchVendors());
    } catch (error: any) {
      handleApiError(error, toast, 'Failed to delete vendor');
    } finally {
      setShowDeleteConfirmation(false);
      setVendorToDelete(null);
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
      title: t('stats.totalVendors'),
      value: pagination.total,
      icon: Users,
      iconColor: 'bg-primary'
    },
    {
      title: t('stats.individualVendors'),
      value: vendors.filter(v => v.type === 'individual').length,
      icon: User,
      iconColor: 'bg-green-500'
    },
    {
      title: t('stats.companyVendors'),
      value: vendors.filter(v => v.type === 'company').length,
      icon: Building,
      iconColor: 'bg-blue-500'
    },
    {
      title: t('stats.categories'),
      value: new Set(vendors.map(v => v.category)).size,
      icon: Briefcase,
      iconColor: 'bg-purple-500'
    }
  ];

  // Prepare filter options
  const filterOptions = [
    {
      type: 'type' as const,
      label: 'Type',
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'individual', label: 'Individual' },
        { value: 'company', label: 'Company' }
      ]
    }
  ];

  // Define table columns
  const columns = [
    createTextColumn<Vendor>('name', 'Name', (vendor) => vendor.name || 'Unnamed Vendor', { 
      width: 'w-48' 
    }),
    createTextColumn<Vendor>('companyName', 'Company', (vendor) => vendor.companyName || 'N/A', { 
      width: 'w-48' 
    }),
    createTextColumn<Vendor>('category', 'Category', (vendor) => vendor.category, { 
      width: 'w-32' 
    }),
    createTextColumn<Vendor>('email', 'Email', (vendor) => vendor.email || 'No email', { 
      width: 'w-64' 
    }),
    createTextColumn<Vendor>('phone', 'Phone', (vendor) => vendor.phone, { 
      width: 'w-32' 
    }),
    createTextColumn<Vendor>('address', 'Address', (vendor) => vendor.address || 'N/A', { 
      width: 'w-48' 
    }),
    createTextColumn<Vendor>('city', 'City', (vendor) => vendor.city || 'N/A', { 
      width: 'w-32' 
    }),
  ];

  // Define table actions
  const actions = [
    createEditAction<Vendor>((vendor) => handleEditVendor(vendor), 'Edit Vendor'),
    createDeleteAction<Vendor>((vendor) => handleDeleteVendor(vendor), 'Delete Vendor'),
    createViewAction<Vendor>((vendor) => handleViewVendor(vendor), 'View Vendor'),
  ];

  // Define table filters
  // const tableFilters = [
  //   createSelectFilter('type', 'Type', [
  //     { label: 'All Types', value: 'all' },
  //     { label: 'Individual', value: 'individual' },
  //     { label: 'Company', value: 'company' }
  //   ]),
  // ];

  // Create table configuration
  const tableConfig = createDataTableConfig(columns, actions, {
    title: t('title'),
    subtitle: t('subtitle'),
    searchable: true,
    searchPlaceholder: 'Search vendors...',
    // filters: tableFilters,
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
      filename: 'vendors-export'
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
            setEditingVendor(null);
            setIsFormOpen(true);
          }}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          <Users className="h-4 w-4 mr-2" />
          {t('addVendor')}
        </Button>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-emerald-300/40 dark:hover:border-emerald-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.totalVendors')}</p>
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
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.individualVendors')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{vendors.filter(v => v.type === 'individual').length}</p>
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
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.companyVendors')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{vendors.filter(v => v.type === 'company').length}</p>
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
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.categories')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{new Set(vendors.map(v => v.category)).size}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <CRMFilters
        filters={filters}
        onSearchChange={handleSearch}
        onFilterChange={handleTypeFilter}
        filterOptions={filterOptions}
      /> */}

      {/* Vendors DataTable */}
      <DataTable
        data={vendors}
        {...tableConfig}
        loading={loading}
        emptyMessage={t('emptyMessage')}
      />

      {/* Add/Edit Vendor Form */}
      <AddVendorForm
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false);
            setEditingVendor(null);
          }
        }}
        onSubmit={editingVendor ? handleUpdateVendor : handleAddVendor}
        vendorId={editingVendor}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteDialog.description', { name: vendorToDelete?.name || 'this vendor' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('deleteDialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteVendor} className="bg-red-600 hover:bg-red-700">
              {t('deleteDialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
