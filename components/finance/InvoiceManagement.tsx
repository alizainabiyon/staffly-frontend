'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '@/lib/store/slices/profileSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { DataTable } from '@/components/ui/data-table';
import { 
  FileText, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Package,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { Invoice } from '@/lib/types';
import { InvoiceForm } from './InvoiceForm';
import { 
  fetchInvoices, 
  deleteInvoice, 
  setSelectedInvoice,
  approveInvoice,
  markInvoicePaid,
  fetchInvoiceById
} from '@/lib/store/slices/invoiceSlice';
import { RootState, AppDispatch } from '@/lib/store/store';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { 
  createTextColumn, 
  createBadgeColumn, 
  createCurrencyColumn, 
  createDateColumn,
  createEditAction,
  createDeleteAction,
  createCustomAction,
  createSelectFilter,
  createDataTableConfig
} from '@/lib/utils/dataTableUtils';
import { printInvoice } from './printTemplate';

interface InvoiceManagementProps {
  onCreateNew?: () => void;
}

export function InvoiceManagement({ onCreateNew }: InvoiceManagementProps) {
  const dispatch = useDispatch();
  const { invoices, loading, pagination } = useSelector((state: RootState) => state.invoice);
  const { profile } = useSelector((state: RootState) => state.profile);
  const t = useTranslations('Invoice');

  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [showApproveConfirmation, setShowApproveConfirmation] = useState(false);
  const [invoiceToApprove, setInvoiceToApprove] = useState<Invoice | null>(null);
  const [showMarkPaidConfirmation, setShowMarkPaidConfirmation] = useState(false);
  const [invoiceToMarkPaid, setInvoiceToMarkPaid] = useState<Invoice | null>(null);
  const [viewInvoiceLoading, setViewInvoiceLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchInvoices({page: 1, limit: 10}) as any);
    dispatch(fetchProfile() as any);
  }, [dispatch]);

  const invoiceStats = [
    {
      title: t('stats.totalInvoices'),
      value: invoices.length.toString(),
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: t('stats.totalValue'),
      value: `${formatCurrency(invoices.reduce((sum, inv) => sum + inv.totalAmount, 0))}`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: t('stats.paid'),
      value: invoices.filter(inv => inv.status === 'paid').length.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: t('stats.pending'),
      value: invoices.filter(inv => inv.status === 'sent' || inv.status === 'accepted').length.toString(),
      icon: Clock,
      color: 'text-yellow-600',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-3 w-3" />;
      case 'sent': return <Send className="h-3 w-3" />;
      case 'accepted': return <CheckCircle className="h-3 w-3" />;
      case 'rejected': return <XCircle className="h-3 w-3" />;
      case 'paid': return <CreditCard className="h-3 w-3" />;
      case 'overdue': return <Clock className="h-3 w-3" />;
      case 'cancelled': return <XCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const handleViewInvoice = async (invoice: Invoice) => {
    try {
      setViewInvoiceLoading(true);
      await dispatch(fetchInvoiceById(invoice.invoiceId) as any).unwrap();
      setSelectedInvoice(invoice);
    } catch (error: any) {
      toast.error(error.message || t('messages.fetchFailed'));
    } finally {
      setViewInvoiceLoading(false);
    }
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowForm(true);
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    const invoice = invoices.find(i => i.invoiceId === invoiceId);
    if (invoice) {
      setInvoiceToDelete(invoice);
      setShowDeleteConfirmation(true);
    }
  };

  const confirmDeleteInvoice = async () => {
    if (!invoiceToDelete) return;
    
    try {
      await dispatch(deleteInvoice(invoiceToDelete.invoiceId) as any).unwrap();
      toast.success(t('messages.invoiceDeleted'));
    } catch (error: any) {
      toast.error(error.message || t('messages.deleteFailed'));
    } finally {
      setShowDeleteConfirmation(false);
      setInvoiceToDelete(null);
    }
  };

  const handleApproveInvoice = (invoice: Invoice) => {
    setInvoiceToApprove(invoice);
    setShowApproveConfirmation(true);
  };

  const confirmApproveInvoice = async () => {
    if (!invoiceToApprove) return;
    
    try {
      await dispatch(approveInvoice(invoiceToApprove.invoiceId) as any).unwrap();
      toast.success(t('messages.invoiceApproved'));
    } catch (error: any) {
      toast.error(error.message || t('messages.approveFailed'));
    } finally {
      setShowApproveConfirmation(false);
      setInvoiceToApprove(null);
    }
  };



 

  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setShowForm(true);
  };

  const handleSubmitInvoice = (invoiceData: any) => {
    console.log('Invoice submitted:', invoiceData);
    // Refresh invoices list
    dispatch(fetchInvoices({page: 1, limit: 10}) as any);
    setShowForm(false);
    setEditingInvoice(null);
    toast.success(t('messages.invoiceSaved'));
  };

  const getCustomerName = (invoice: Invoice) => {
    if (typeof invoice.customerId === 'string') {
      return invoice.customerId;
    }
    return invoice.customerId?.name || 'Unknown Customer';
  };

  const getCustomerCompany = (invoice: Invoice) => {
    if (typeof invoice.customerId === 'string') {
      return '';
    }
    return invoice.customerId?.company || '';
  };

  const handlePrintInvoice = () => {
    if (!selectedInvoice) {
      toast.error(t('messages.noInvoiceSelected'));
      return;
    }
    
    try {
      printInvoice(selectedInvoice, getCustomerName, profile);
      toast.success(t('messages.printOpened'));
    } catch (error: any) {
      console.error('Print error:', error);
      toast.error(error.message || t('messages.printFailed'));
    }
  };

  const handleDownloadAttachment = async (attachment: any) => {
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = attachment.file || '#';
      link.download = attachment.name;
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(t('messages.downloadSuccess', { name: attachment.name }));
    } catch (error) {
      toast.error(t('messages.downloadFailed'));
    }
  };

  // Define table columns
  const columns = [
    createTextColumn<Invoice>('invoiceNumber', t('table.invoiceNumber'), (invoice) => invoice.invoiceNumber, { width: 'w-32' }),
    createTextColumn<Invoice>('customerName', t('table.customer'), (invoice) => getCustomerName(invoice), { width: 'w-48' }),
    createTextColumn<Invoice>('description', t('table.description'), (invoice) => invoice.description || 'N/A', { width: 'w-64' }),
    createCurrencyColumn<Invoice>('totalAmount', t('table.totalAmount'), (invoice) => invoice.totalAmount, { width: 'w-32' }),
    createBadgeColumn<Invoice>('status', t('table.status'), (invoice) => invoice.status, { width: 'w-32' }),
    createDateColumn<Invoice>('createdAt', t('table.created'), (invoice) => invoice.createdAt, { width: 'w-32' }),
  ];

  // Define table actions
  const actions = [
    createCustomAction<Invoice>(
      (invoice) => handleViewInvoice(invoice),
      <Eye className="h-4 w-4" />,
      t('actions.view'),
      'outline'
    ),
    createEditAction<Invoice>((invoice) => handleEditInvoice(invoice), t('actions.edit')),
    createDeleteAction<Invoice>((invoice) => handleDeleteInvoice(invoice.invoiceId), t('actions.delete')),
    {
      key: 'approve',
      label: t('actions.approve'),
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: (invoice: Invoice) => handleApproveInvoice(invoice),
      variant: 'outline' as const,
      show: (invoice: Invoice) => invoice.status === 'draft',
    },
  ];


  // Create table configuration
  const tableConfig = createDataTableConfig(columns, actions, {
    title: t('title'),
    subtitle: t('subtitle'),
    searchable: true,
    searchPlaceholder: t('table.searchPlaceholder'),
    pagination: {
      enabled: true,
      pageSize: 10,
      pageSizeOptions: [10, 20, 50, 100]
    },
    sortable: true,
    exportOptions: {
      enablePrint: false,
      enablePDF: false,
      enableCSV: false,
      filename: 'invoices-export'
    }
  });

  if (loading) {
    return (
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-slate-700 dark:text-slate-300">{t('loading.invoices')}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Compact Header with Create Button */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('title')}</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{t('subtitle')}</p>
        </div>
        <Button onClick={onCreateNew || handleAddInvoice} size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
          <Plus className="h-4 w-4 mr-2" />
          {t('createInvoice')}
        </Button>
      </div>

      {/* Compact Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {invoiceStats.map((stat, index) => {
          const IconComponent = stat.icon;
          const colorMap: Record<string, string> = {
            'text-blue-600': 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
            'text-green-600': 'from-green-500 to-green-600 dark:from-green-600 dark:to-green-700',
            'text-yellow-600': 'from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700',
          };
          const hoverColorMap: Record<string, string> = {
            'text-blue-600': 'hover:border-blue-300/40 dark:hover:border-blue-600/40',
            'text-green-600': 'hover:border-green-300/40 dark:hover:border-green-600/40',
            'text-yellow-600': 'hover:border-yellow-300/40 dark:hover:border-yellow-600/40',
          };
          return (
            <Card key={index} className={`group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md ${hoverColorMap[stat.color]} transition-all duration-200`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{stat.title}</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${colorMap[stat.color]} p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Invoices DataTable */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardContent className="p-0">
          <DataTable
            data={invoices}
            {...tableConfig}
            loading={loading}
            emptyMessage={t('table.emptyMessage')}
          />
        </CardContent>
      </Card>

      {/* Invoice Form */}
      <InvoiceForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleSubmitInvoice}
        invoice={editingInvoice}
      />

      {/* View Invoice Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto border-slate-200/60 dark:border-slate-700/60">
          <DialogHeader className="border-b border-slate-200/60 dark:border-slate-700/60 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {t('details.title')}
                </DialogTitle>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {selectedInvoice?.invoiceNumber} • {selectedInvoice?.status}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrintInvoice}
                  className="border-slate-300 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {t('actions.print')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInvoice(null)}
                  className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t('actions.close')}
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {viewInvoiceLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">{t('details.loadingDetails')}</p>
              </div>
            </div>
          ) : selectedInvoice ? (
            <div className="space-y-5 py-4">
              {/* Header Information */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg p-4 border border-emerald-200/60 dark:border-emerald-700/60">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{t('details.invoiceNumber')}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedInvoice.invoiceNumber}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{t('details.customer')}</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{getCustomerName(selectedInvoice)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{t('details.phone')}</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {typeof selectedInvoice.customerId === 'string' 
                        ? 'N/A' 
                        : selectedInvoice.customerId?.phone || 'N/A'
                      }
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{t('details.email')}</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {typeof selectedInvoice.customerId === 'string' 
                        ? 'N/A' 
                        : selectedInvoice.customerId?.email || 'N/A'
                      }
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{t('details.status')}</p>
                    <Badge className={`${getStatusColor(selectedInvoice.status)} text-xs font-medium px-2 py-1 flex items-center gap-1 w-fit mx-auto`}>
                      {getStatusIcon(selectedInvoice.status)}
                      {selectedInvoice.status}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{t('details.dueDate')}</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {selectedInvoice.dueDate ? new Date(selectedInvoice.dueDate).toLocaleDateString() : t('details.notSet')}
                    </p>
                  </div>
                  <div className="text-center md:col-span-2">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{t('details.totalAmount')}</p>
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(
                      (selectedInvoice.totalAmount ?? 0) -
                      (selectedInvoice.advanceAmount ?? 0) +
                      (selectedInvoice.previousRemainingAmount ?? 0)
                    )}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedInvoice.description && (
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                      <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md mr-2">
                        <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      {t('details.description')}
                    </h3>
                  </div>
                  <div className="p-5">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{selectedInvoice.description}</p>
                  </div>
                </div>
              )}

              {/* Items Table */}
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md mr-2">
                      <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    {t('details.items')}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 dark:from-emerald-900 dark:via-green-800 dark:to-teal-900">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">{t('form.fields.itemDescription')}</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">{t('form.fields.itemType')}</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">{t('form.fields.length')}</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">{t('form.fields.width')}</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">{t('form.fields.quantity')}</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">{t('form.fields.totalSize')}</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">{t('form.fields.unitPrice')}</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">{t('form.fields.fixedAmount')}</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider">{t('form.fields.total')}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200/60 dark:divide-slate-700/60">
                      {selectedInvoice.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gradient-to-r hover:from-emerald-50/20 hover:to-green-50/20 dark:hover:from-emerald-900/20 dark:hover:to-green-900/20 transition-all duration-200">
                          <td className="px-4 py-3 border-r border-slate-100/40 dark:border-slate-700/40">
                            <div className="text-xs font-medium text-slate-900 dark:text-slate-100">{item.description}</div>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 capitalize border-r border-slate-100/40 dark:border-slate-700/40">
                            {item.type?.replace('_', ' ') || '-'}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">
                            {item.length || '-'}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">
                            {item.width || '-'}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">
                            {item.quantity || '-'}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">
                            {item.totalSize || '-'}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">
                            {item.unitPrice ? formatCurrency(item.unitPrice) : '-'}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">
                            {item.fixedAmount ? formatCurrency(item.fixedAmount) : '-'}
                          </td>
                          <td className="px-4 py-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50 to-green-50/30 dark:from-slate-800 dark:to-green-900/20">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                    <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md mr-2">
                      <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    Financial Summary
                  </h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Subtotal</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(selectedInvoice.subtotal)}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tax Amount</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(selectedInvoice.taxAmount)}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Discount</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(selectedInvoice.discountAmount)}</p>
                    </div>
                    {selectedInvoice.advanceAmount && selectedInvoice.advanceAmount > 0 && (
                      <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Advance</p>
                        <p className="text-sm font-semibold text-red-600 dark:text-red-400">-{formatCurrency(selectedInvoice.advanceAmount)}</p>
                      </div>
                    )}
                    <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Previous Balance</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(selectedInvoice.previousRemainingAmount ?? 0)}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t-2 border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-4 rounded-lg border border-emerald-200/60 dark:border-emerald-700/60">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Total Amount</span>
                      </div>
                      <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(
                        (selectedInvoice.totalAmount ?? 0) -
                        (selectedInvoice.advanceAmount ?? 0) +
                        (selectedInvoice.previousRemainingAmount ?? 0)
                      )}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedInvoice.notes && (
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md mr-2">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      Notes
                    </h3>
                  </div>
                  <div className="p-5">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{selectedInvoice.notes}</p>
                  </div>
                </div>
              )}

              {/* Terms & Conditions */}
              {selectedInvoice.terms && (
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                      <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md mr-2">
                        <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      Terms & Conditions
                    </h3>
                  </div>
                  <div className="p-5">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{selectedInvoice.terms}</p>
                  </div>
                </div>
              )}

              {/* Attachments */}
              {selectedInvoice.attachments && selectedInvoice.attachments.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                      <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-md mr-2">
                        <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      Attachments ({selectedInvoice.attachments.length})
                    </h3>
                  </div>
                  <div className="p-5 space-y-2">
                    {selectedInvoice.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{attachment.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{attachment.type}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownloadAttachment(attachment)}
                          className="border-emerald-300 dark:border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete Invoice Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
        onConfirm={confirmDeleteInvoice}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmText="Delete Invoice"
        variant="destructive"
      />

      {/* Approve Invoice Confirmation Dialog */}
      <ConfirmationDialog
        open={showApproveConfirmation}
        onOpenChange={setShowApproveConfirmation}
        onConfirm={confirmApproveInvoice}
        title="Approve Invoice"
        description="Are you sure you want to approve this invoice? This will change the status from draft to sent."
        confirmText="Approve Invoice"
        variant="default"
      />
    </div>
  );
}
