'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchCustomers, deleteCustomer, setFilters, clearFilters, createCustomer, updateCustomer } from '@/lib/store/slices/crmSlice';
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
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Users
} from 'lucide-react';
import { AddCustomerForm } from './AddCustomerForm';
import { Customer } from '@/lib/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
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

export function CustomerManagement() {
  const dispatch = useAppDispatch();
  const { customers, loading, error, filters, pagination } = useAppSelector((state) => state.crm);
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const t = useTranslations('CRM');

  useEffect(() => {
   const result =  dispatch(fetchCustomers());
  }, [dispatch]);

  const handleAddCustomer = async (customerData: Omit<Customer, 'customerId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await dispatch(createCustomer(customerData)).unwrap();
      // Don't call handleFormClose here - the form will handle it after successful submission
      // handleFormClose();
      
      // Use the success message from the API response
      const message = result && typeof result === 'object' && 'message' in result ? result.message : t('messages.customerAdded');
      toast.success(message);
      
      // Refresh the customers list
      dispatch(fetchCustomers());
    } catch (error: any) {
      toast.error(error.message || t('messages.addFailed'));
      // Re-throw the error so the form knows it failed and doesn't close
      throw error;
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    router.push(`/dashboard/crm/customers/${customer.customerId}`);
  };

  const handleEditCustomer = (customer: Customer) => {
      setEditingCustomer(customer.customerId);
      setIsFormOpen(true);
  };

  const handleUpdateCustomer = async (customerData: Omit<Customer, 'customerId' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (!editingCustomer) return;
      const result = await dispatch(updateCustomer({
        customerId: editingCustomer,
        ...customerData,
      })).unwrap();
      
      // Don't call handleFormClose here - the form will handle it after successful submission
      // handleFormClose();
      
      // Use the success message from the API response
      const message = result && typeof result === 'object' && 'message' in result ? result.message : t('messages.customerUpdated');
      toast.success(message);
      
      // Refresh the customers list
      dispatch(fetchCustomers());
    } catch (error: any) {
      toast.error(error.message || t('messages.updateFailed'));
      // Re-throw the error so the form knows it failed and doesn't close
      throw error;
    }
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setCustomerToDelete(customer);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteCustomer = async () => {
    if (!customerToDelete) return;
    
    try {
      await dispatch(deleteCustomer(customerToDelete.customerId)).unwrap();
      toast.success(t('messages.customerDeleted'));
      dispatch(fetchCustomers());
    } catch (error: any) {
      toast.error(error.message || t('messages.deleteFailed'));
    } finally {
      setShowDeleteConfirmation(false);
      setCustomerToDelete(null);
    }
  };

  const handleSearch = (searchTerm: string) => {
    dispatch(setFilters({ search: searchTerm, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    // Convert "all" to empty string for filtering
    const filterValue = status === 'all' ? '' : status;
    dispatch(setFilters({ status: filterValue, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ page }));
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCustomer(null);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchCustomers())}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Define table columns
  const columns = [
    createTextColumn<Customer>('name', t('table.name'), (customer) => customer.name, { 
      width: 'w-48' 
    }),
    createTextColumn<Customer>('customerType', t('table.type'), (customer) => customer.customerType, { 
      width: 'w-32' 
    }),
    createTextColumn<Customer>('company', t('table.company'), (customer) => customer.company || 'N/A', { 
      width: 'w-48' 
    }),
    createTextColumn<Customer>('email', t('table.email'), (customer) => customer.email || 'No email', { 
      width: 'w-64' 
    }),
    createTextColumn<Customer>('phone', t('table.phone'), (customer) => customer.phone, { 
      width: 'w-32' 
    }),
    createTextColumn<Customer>('address', t('table.address'), (customer) => customer.address || 'N/A', { 
      width: 'w-48' 
    }),
    createTextColumn<Customer>('status', t('table.status'), (customer) => customer.status, { 
      width: 'w-24' 
    }),
  ];

  // Define table actions
  const actions = [
    createEditAction<Customer>((customer) => handleEditCustomer(customer), t('editCustomer')),
    createDeleteAction<Customer>((customer) => handleDeleteCustomer(customer), t('deleteCustomer')),
    createViewAction<Customer>((customer) => handleViewCustomer(customer), t('viewCustomer')),
  ];

  // Define table filters
  const tableFilters = [
    createSelectFilter('status', t('table.status'), [
      { label: t('filters.allStatus'), value: 'all' },
      { label: t('filters.active'), value: 'active' },
      { label: t('filters.inactive'), value: 'inactive' },
      { label: t('filters.blocked'), value: 'blocked' }
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
      filename: 'customers-export'
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
            setEditingCustomer(null);
            setIsFormOpen(true);
          }}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('addCustomer')}
        </Button>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-emerald-300/40 dark:hover:border-emerald-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.totalCustomers')}</p>
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
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.activeCustomers')}</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {customers.filter(c => c.status === 'active').length}
                </p>
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
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.businessCustomers')}</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {customers.filter(c => c.customerType === 'business').length}
                </p>
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
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.individualCustomers')}</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {customers.filter(c => c.customerType === 'individual').length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers DataTable */}
      <DataTable
        data={customers}
        {...tableConfig}
        loading={loading}
        emptyMessage={t('table.emptyMessage')}
      />

      {/* Add/Edit Customer Form */}
      <AddCustomerForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
        customerId={editingCustomer}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteConfirmation.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirmation.description', { name: customerToDelete?.name ?? '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('deleteConfirmation.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCustomer} className="bg-red-600 hover:bg-red-700">
              {t('deleteConfirmation.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
