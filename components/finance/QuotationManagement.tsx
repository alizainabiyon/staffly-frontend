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
  TrendingUp
} from 'lucide-react';
import { Quotation } from '@/lib/types';
import { QuotationForm } from './QuotationForm';
import { 
  fetchQuotations, 
  deleteQuotation, 
  setSelectedQuotation,
  convertToInvoice,
  fetchQuotationById
} from '@/lib/store/slices/quotationSlice';
import { RootState, AppDispatch } from '@/lib/store/store';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';
import { toast } from 'sonner';
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
import { printQuotation } from './printTemplate';

interface QuotationManagementProps {
  onConvertToInvoice?: (quotation: Quotation) => void;
  onCreateNew?: () => void;
}

export function QuotationManagement({ onConvertToInvoice, onCreateNew }: QuotationManagementProps) {
  const dispatch = useDispatch();
  const { quotations, loading, pagination } = useSelector((state: RootState) => state.quotation);
  const { profile } = useSelector((state: RootState) => state.profile);

  const [showForm, setShowForm] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [showConvertConfirmation, setShowConvertConfirmation] = useState(false);
  const [quotationToConvert, setQuotationToConvert] = useState<Quotation | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState<Quotation | null>(null);
  const [viewQuotationLoading, setViewQuotationLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchQuotations({page: 1, limit: 10}) as any);
    dispatch(fetchProfile() as any);
  }, [dispatch]);

  const quotationStats = [
    {
      title: 'Total Quotations',
      value: quotations.length.toString(),
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Total Value',
      value: `${formatCurrency(quotations.reduce((sum, quo) => sum + quo.totalAmount, 0))}`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Accepted',
      value: quotations.filter(quo => quo.status === 'accepted').length.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Pending',
      value: quotations.filter(quo => quo.status === 'sent').length.toString(),
      icon: Clock,
      color: 'text-yellow-600',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
      case 'sent': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'accepted': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'expired': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'converted': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-3 w-3" />;
      case 'sent': return <Send className="h-3 w-3" />;
      case 'accepted': return <CheckCircle className="h-3 w-3" />;
      case 'rejected': return <XCircle className="h-3 w-3" />;
      case 'expired': return <Clock className="h-3 w-3" />;
      case 'converted': return <TrendingUp className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const handleViewQuotation = async (quotation: Quotation) => {
    try {
      setViewQuotationLoading(true);
      await dispatch(fetchQuotationById(quotation.quotationId) as any).unwrap();
      setSelectedQuotation(quotation);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch quotation details');
    } finally {
      setViewQuotationLoading(false);
    }
  };

  const handleEditQuotation = (quotation: Quotation) => {
    setEditingQuotation(quotation);
    setShowForm(true);
  };

  const handleDeleteQuotation = async (quotationId: string) => {
    const quotation = quotations.find(q => q.quotationId === quotationId);
    if (quotation) {
      setQuotationToDelete(quotation);
      setShowDeleteConfirmation(true);
    }
  };

  const confirmDeleteQuotation = async () => {
    if (!quotationToDelete) return;
    
    try {
      await dispatch(deleteQuotation(quotationToDelete.quotationId) as any).unwrap();
      toast.success('Quotation deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete quotation');
    } finally {
      setShowDeleteConfirmation(false);
      setQuotationToDelete(null);
    }
  };

  const handleConvertToInvoice = (quotation: Quotation) => {
    setQuotationToConvert(quotation);
    setShowConvertConfirmation(true);
  };

  const confirmConvertToInvoice = async () => {
    if (!quotationToConvert) return;
    
    try {
      await dispatch(convertToInvoice(quotationToConvert.quotationId) as any).unwrap();
      toast.success('Quotation converted to invoice successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to convert quotation to invoice');
    } finally {
      setShowConvertConfirmation(false);
      setQuotationToConvert(null);
    }
  };

  const handleAddQuotation = () => {
    setEditingQuotation(null);
    setShowForm(true);
  };

  const handleSubmitQuotation = (quotationData: any) => {
    console.log('Quotation submitted:', quotationData);
    // Refresh quotations list
    dispatch(fetchQuotations({page: 1, limit: 10}) as any);
    setShowForm(false);
    setEditingQuotation(null);
    toast.success('Quotation saved successfully!');
  };

  const getCustomerName = (quotation: Quotation) => {
    if (typeof quotation.customerId === 'string') {
      return quotation.customerId;
    }
    return (quotation.customerId as any)?.name || 'Unknown Customer';
  };

  const getCustomerCompany = (quotation: Quotation) => {
    if (typeof quotation.customerId === 'string') {
      return '';
    }
    return (quotation.customerId as any)?.company || '';
  };

  const handlePrintQuotation = () => {
    if (!selectedQuotation) {
      toast.error('No quotation selected for printing');
      return;
    }
    
    try {
      printQuotation(selectedQuotation, getCustomerName, profile);
      toast.success('Print window opened successfully');
    } catch (error: any) {
      console.error('Print error:', error);
      toast.error(error.message || 'Failed to open print window. Please try again.');
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
      
      toast.success(`Downloading ${attachment.name}`);
    } catch (error) {
      toast.error('Failed to download attachment');
    }
  };

  // Define table columns
  const columns = [
    createTextColumn<Quotation>('quotationNumber', 'Quotation #', (quotation) => quotation.quotationNumber, { width: 'w-32' }),
    createTextColumn<Quotation>('customerName', 'Customer', (quotation) => getCustomerName(quotation), { width: 'w-48' }),
    createTextColumn<Quotation>('description', 'Description', (quotation) => quotation.description || 'N/A', { width: 'w-64' }),
    createCurrencyColumn<Quotation>('totalAmount', 'Total Amount', (quotation) => quotation.totalAmount, { width: 'w-32' }),
    createBadgeColumn<Quotation>('status', 'Status', (quotation) => quotation.status, { width: 'w-32' }),
    createDateColumn<Quotation>('createdAt', 'Created', (quotation) => quotation.createdAt, { width: 'w-32' }),
  ];

  // Define table actions
  const actions = [
    createCustomAction<Quotation>(
      (quotation) => handleViewQuotation(quotation),
      <Eye className="h-4 w-4" />,
      'View',
      'outline'
    ),
    createEditAction<Quotation>((quotation) => handleEditQuotation(quotation), 'Edit Quotation'),
    createDeleteAction<Quotation>((quotation) => handleDeleteQuotation(quotation.quotationId), 'Delete Quotation'),
    {
      key: 'convert',
      label: 'Convert to Invoice',
      icon: <Send className="h-4 w-4" />,
      onClick: (quotation: Quotation) => handleConvertToInvoice(quotation),
      variant: 'outline' as const,
      show: (quotation: Quotation) => quotation.convertedToInvoice === false,
    },
  ];

  // Define table filters
  // const tableFilters = [
  //   createSelectFilter('status', 'Status', [
  //     { label: 'All Statuses', value: 'all' },
  //     { label: 'Draft', value: 'draft' },
  //     { label: 'Sent', value: 'sent' },
  //     { label: 'Accepted', value: 'accepted' },
  //     { label: 'Rejected', value: 'rejected' },
  //     { label: 'Expired', value: 'expired' },
  //     { label: 'Converted', value: 'converted' }
  //   ]),
  // ];

  // Create table configuration
  const tableConfig = createDataTableConfig(columns, actions, {
    title: 'Quotations',
    subtitle: 'Manage customer quotations and proposals',
    searchable: true,
    searchPlaceholder: 'Search quotations...',
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
      filename: 'quotations-export'
    }
  });

  if (loading) {
    return (
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-slate-700 dark:text-slate-300">Loading quotations...</span>
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
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Quotations</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Manage customer quotations and proposals</p>
        </div>
        <Button onClick={onCreateNew || handleAddQuotation} size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
          <Plus className="h-4 w-4 mr-2" />
          New Quotation
        </Button>
      </div>

      {/* Compact Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quotationStats.map((stat, index) => {
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

      {/* Quotations DataTable */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardContent className="p-0">
          <DataTable
            data={quotations}
            {...tableConfig}
            loading={loading}
            emptyMessage="No quotations found. Get started by creating your first quotation."
          />
        </CardContent>
      </Card>

      {/* Quotation Form */}
      <QuotationForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleSubmitQuotation}
        quotation={editingQuotation}
      />

      {/* View Quotation Dialog */}
      <Dialog open={!!selectedQuotation} onOpenChange={() => setSelectedQuotation(null)}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto border-slate-200/60 dark:border-slate-700/60">
          <DialogHeader className="border-b border-slate-200/60 dark:border-slate-700/60 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Quotation Details
                </DialogTitle>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {selectedQuotation?.quotationNumber} • {selectedQuotation?.status}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrintQuotation}
                  className="border-slate-300 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedQuotation(null)}
                  className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {viewQuotationLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Loading quotation details...</p>
              </div>
            </div>
          ) : selectedQuotation ? (
            <div className="space-y-5 py-4">
              {/* Header Information */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg p-4 border border-emerald-200/60 dark:border-emerald-700/60">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Quotation Number</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedQuotation.quotationNumber}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Customer</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{getCustomerName(selectedQuotation)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Phone</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{(selectedQuotation.customerId as any)?.phone || 'N/A'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Email</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{(selectedQuotation.customerId as any)?.email || 'N/A'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Address</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{(selectedQuotation.customerId as any)?.address || 'N/A'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Status</p>
                    <Badge className={`${getStatusColor(selectedQuotation.status)} text-xs font-medium px-2 py-1 flex items-center gap-1 w-fit mx-auto`}>
                      {getStatusIcon(selectedQuotation.status)}
                      {selectedQuotation.status}
                    </Badge>
                  </div>
                  <div className="text-center md:col-span-2">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Total Amount</p>
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(selectedQuotation.totalAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedQuotation.description && (
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                      <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md mr-2">
                        <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      Description
                    </h3>
                  </div>
                  <div className="p-5">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{selectedQuotation.description}</p>
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
                    Items
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 dark:from-emerald-900 dark:via-green-800 dark:to-teal-900">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">Description</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">Length</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">Width</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">Total Size</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">Unit Price</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">Fixed Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200/60 dark:divide-slate-700/60">
                      {selectedQuotation.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gradient-to-r hover:from-emerald-50/20 hover:to-green-50/20 dark:hover:from-emerald-900/20 dark:hover:to-green-900/20 transition-all duration-200">
                          <td className="px-4 py-3 border-r border-slate-100/40 dark:border-slate-700/40">
                            <div className="text-xs font-medium text-slate-900 dark:text-slate-100">{item.description}</div>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                              {item.type?.replace('_', ' ').toUpperCase() || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">
                            {item.type === 'length_width' ? (item.length || 0) : <span className="text-slate-400 dark:text-slate-500">—</span>}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">
                            {item.type === 'length_width' ? (item.width || 0) : <span className="text-slate-400 dark:text-slate-500">—</span>}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">
                            {(item.type === 'length_width' || item.type === 'quantity_only') ? (item.quantity || 0) : <span className="text-slate-400 dark:text-slate-500">—</span>}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">
                            {item.type === 'total_size' ? (item.totalSize || 0) : <span className="text-slate-400 dark:text-slate-500">—</span>}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">
                            {item.type !== 'fixed_amount' ? formatCurrency(item.unitPrice || 0) : <span className="text-slate-400 dark:text-slate-500">—</span>}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">
                            {item.type === 'fixed_amount' ? formatCurrency(item.fixedAmount || 0) : <span className="text-slate-400 dark:text-slate-500">—</span>}
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Subtotal</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(selectedQuotation.subtotal)}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tax Amount</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(selectedQuotation.taxAmount)}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Discount</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(selectedQuotation.discountAmount)}</p>
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
                      <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(selectedQuotation.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedQuotation.notes && (
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
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{selectedQuotation.notes}</p>
                  </div>
                </div>
              )}

              {/* Terms & Conditions */}
              {selectedQuotation.terms && (
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
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{selectedQuotation.terms}</p>
                  </div>
                </div>
              )}

              {/* Attachments */}
              {selectedQuotation.attachments && selectedQuotation.attachments.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                      <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-md mr-2">
                        <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      Attachments ({selectedQuotation.attachments.length})
                    </h3>
                  </div>
                  <div className="p-5 space-y-3">
                    {selectedQuotation.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
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

      {/* Convert to Invoice Confirmation Dialog */}
      <ConfirmationDialog
        open={showConvertConfirmation}
        onOpenChange={setShowConvertConfirmation}
        onConfirm={confirmConvertToInvoice}
        title="Convert Quotation to Invoice"
        description="Are you sure you want to convert this quotation to an invoice? This action will create a new invoice based on the quotation details and cannot be undone."
        confirmText="Convert to Invoice"
        variant="success"
      />

      {/* Delete Quotation Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
        onConfirm={confirmDeleteQuotation}
        title="Delete Quotation"
        description="Are you sure you want to delete this quotation? This action cannot be undone."
        confirmText="Delete Quotation"
        variant="destructive"
      />
    </div>
  );
}