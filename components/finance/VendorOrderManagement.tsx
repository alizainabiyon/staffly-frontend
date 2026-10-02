'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Building2,
  Calendar
} from 'lucide-react';
import { VendorOrder } from '@/lib/types';
import { VendorOrderForm } from './VendorOrderForm';
import { 
  fetchVendorOrders, 
  deleteVendorOrder, 
  setSelectedVendorOrder,
  approveVendorOrder,
  createVendorOrder,
  updateVendorOrder,
  // sendVendorOrder,
  // rejectVendorOrder,
  // completeVendorOrder,
  fetchVendorOrderById
} from '@/lib/store/slices/vendorOrderSlice';
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
import { printVendorOrder } from './printTemplate';

interface VendorOrderManagementProps {
  onCreateNew?: () => void;
}

export function VendorOrderManagement({ onCreateNew }: VendorOrderManagementProps) {
  const dispatch = useDispatch();
  const { vendorOrders, loading, pagination } = useSelector((state: RootState) => state.vendorOrder);

  const [showForm, setShowForm] = useState(false);
  const [editingVendorOrder, setEditingVendorOrder] = useState<VendorOrder | null>(null);
  const [selectedVendorOrder, setSelectedVendorOrder] = useState<VendorOrder | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [vendorOrderToDelete, setVendorOrderToDelete] = useState<VendorOrder | null>(null);
  const [showApproveConfirmation, setShowApproveConfirmation] = useState(false);
  const [vendorOrderToApprove, setVendorOrderToApprove] = useState<VendorOrder | null>(null);
  const [viewVendorOrderLoading, setViewVendorOrderLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchVendorOrders({}) as any);
  }, [dispatch]);
  const vendorOrderStats = [
    {
      title: 'Total Orders',
      value: vendorOrders.length.toString(),
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Total Value',
      value: `${formatCurrency(vendorOrders.reduce((sum, order) => sum + order.totalAmount, 0))}`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Approved',
      value: vendorOrders.filter(order => order.status === 'approved').length.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Pending',
      value: vendorOrders.filter(order => order.status === 'pending' || order.status === 'draft').length.toString(),
      icon: Clock,
      color: 'text-yellow-600',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'approved': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'completed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'approved': return <CheckCircle className="h-3 w-3" />;
      case 'rejected': return <XCircle className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'cancelled': return <XCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const handleViewVendorOrder = async (vendorOrder: VendorOrder) => {
    try {
      setViewVendorOrderLoading(true);
      await dispatch(fetchVendorOrderById(vendorOrder.orderId) as any).unwrap();
      setSelectedVendorOrder(vendorOrder);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch vendor order details');
    } finally {
      setViewVendorOrderLoading(false);
    }
  };

  const handleEditVendorOrder = (vendorOrder: VendorOrder) => {
    setEditingVendorOrder(vendorOrder);
    setShowForm(true);
  };

  const handleDeleteVendorOrder = async (orderId: string) => {
    const vendorOrder = vendorOrders.find(o => o.orderId === orderId);
    if (vendorOrder) {
      setVendorOrderToDelete(vendorOrder);
      setShowDeleteConfirmation(true);
    }
  };

  const confirmDeleteVendorOrder = async () => {
    if (!vendorOrderToDelete) return;
    
    try {
      await dispatch(deleteVendorOrder(vendorOrderToDelete.orderId) as any).unwrap();
      toast.success('Vendor order deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete vendor order');
    } finally {
      setShowDeleteConfirmation(false);
      setVendorOrderToDelete(null);
    }
  };

  const handleSendVendorOrder = async (orderId: string) => {
    try {
      // await dispatch(sendVendorOrder(orderId) as any).unwrap();
      toast.success('Vendor order sent successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send vendor order');
    }
  };

  const handleApproveVendorOrder = (vendorOrder: VendorOrder) => {
    setVendorOrderToApprove(vendorOrder);
    setShowApproveConfirmation(true);
  };

  const confirmApproveVendorOrder = async () => {
    if (!vendorOrderToApprove) return;
    
    try {
      await dispatch(approveVendorOrder(vendorOrderToApprove.orderId) as any).unwrap();
      toast.success('Vendor order approved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve vendor order');
    } finally {
      setShowApproveConfirmation(false);
      setVendorOrderToApprove(null);
    }
  };

  const handleAddVendorOrder = () => {
    setEditingVendorOrder(null);
    setShowForm(true);
  };

  const handleSubmitVendorOrder = (vendorOrderData: any) => {
    console.log('Vendor order submitted:', vendorOrderData);
    // Refresh vendor orders list
    dispatch(fetchVendorOrders({}) as any);
    setShowForm(false);
    setEditingVendorOrder(null);
    toast.success('Vendor order saved successfully!');
  };

  const getVendorName = (vendorOrder: VendorOrder) => {
    if (typeof vendorOrder.vendorId === 'string') {
      return vendorOrder.vendorId;
    }
    return vendorOrder.vendorId?.name || 'Unknown Vendor';
  };

  const getVendorCompany = (vendorOrder: VendorOrder) => {
    if (typeof vendorOrder.vendorId === 'string') {
      return '';
    }
    return vendorOrder.vendorId?.companyName || '';
  };

  const handlePrintVendorOrder = () => {
    if (!selectedVendorOrder) {
      toast.error('No vendor order selected for printing');
      return;
    }
    
    try {
      printVendorOrder(selectedVendorOrder, getVendorName);
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
      link.href = attachment.url || attachment.fileUrl || '#';
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
    createTextColumn<VendorOrder>('orderNumber', 'Order #', (order) => order.orderNumber, { width: 'w-32' }),
    createTextColumn<VendorOrder>('vendorName', 'Vendor', (order) => getVendorName(order), { width: 'w-48' }),
    createTextColumn<VendorOrder>('description', 'Description', (order) => order.description || 'N/A', { width: 'w-64' }),
    createCurrencyColumn<VendorOrder>('totalAmount', 'Total Amount', (order) => order.totalAmount, { width: 'w-32' }),
    createBadgeColumn<VendorOrder>('status', 'Status', (order) => order.status, { width: 'w-32' }),
    createDateColumn<VendorOrder>('createdAt', 'Created', (order) => order.createdAt, { width: 'w-32' }),
  ];

  // Define table actions
  const actions = [
    createCustomAction<VendorOrder>(
      (order) => handleViewVendorOrder(order),
      <Eye className="h-4 w-4" />,
      'View',
      'outline'
    ),
    createEditAction<VendorOrder>((order) => handleEditVendorOrder(order), 'Edit Vendor Order'),
    createDeleteAction<VendorOrder>((order) => handleDeleteVendorOrder(order.orderId), 'Delete Vendor Order'),
         {
       key: 'approve',
       label: 'Approve',
       icon: <CheckCircle className="h-4 w-4" />,
       onClick: (order: VendorOrder) => handleApproveVendorOrder(order),
       variant: 'outline' as const,
       show: (order: VendorOrder) => order.status === 'pending',
     },
  ];

  // Create table configuration
  const tableConfig = createDataTableConfig(columns, actions, {
    title: 'Vendor Orders',
    subtitle: 'Manage vendor orders and track approvals',
    searchable: true,
    searchPlaceholder: 'Search vendor orders...',
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
      filename: 'vendor-orders-export'
    }
  });

  if (loading) {
    return (
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-slate-700 dark:text-slate-300">Loading vendor orders...</span>
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
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Vendor Orders</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Manage vendor orders and track approvals</p>
        </div>
        <Button onClick={onCreateNew || handleAddVendorOrder} size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
          <Plus className="h-4 w-4 mr-2" />
          New Vendor Order
        </Button>
      </div>

      {/* Compact Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vendorOrderStats.map((stat, index) => {
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

      {/* Vendor Orders DataTable */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardContent className="p-0">
          <DataTable
            data={vendorOrders}
            {...tableConfig}
            loading={loading}
            emptyMessage="No vendor orders found. Get started by creating your first vendor order."
          />
        </CardContent>
      </Card>

      {/* Vendor Order Form */}
      <VendorOrderForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleSubmitVendorOrder}
        vendorOrder={editingVendorOrder}
      />

      {/* View Vendor Order Dialog */}
      <Dialog open={!!selectedVendorOrder} onOpenChange={() => setSelectedVendorOrder(null)}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto border-slate-200/60 dark:border-slate-700/60">
          <DialogHeader className="border-b border-slate-200/60 dark:border-slate-700/60 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Vendor Order Details
                </DialogTitle>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {selectedVendorOrder?.orderNumber} • {selectedVendorOrder?.status}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrintVendorOrder}
                  className="border-slate-300 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedVendorOrder(null)}
                  className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {viewVendorOrderLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Loading vendor order details...</p>
              </div>
            </div>
          ) : selectedVendorOrder ? (
            <div className="space-y-5 py-4">
              {/* Header Information */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg p-4 border border-emerald-200/60 dark:border-emerald-700/60">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Order Number</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedVendorOrder.orderNumber}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Vendor</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{getVendorName(selectedVendorOrder)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Company</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {typeof selectedVendorOrder.vendorId === 'string' 
                        ? 'N/A' 
                        : selectedVendorOrder.vendorId?.companyName || 'N/A'
                      }
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Phone</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {typeof selectedVendorOrder.vendorId === 'string' 
                        ? 'N/A' 
                        : selectedVendorOrder.vendorId?.phone || 'N/A'
                      }
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Email</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {typeof selectedVendorOrder.vendorId === 'string' 
                        ? 'N/A' 
                        : selectedVendorOrder.vendorId?.email || 'N/A'
                      }
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Address</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {typeof selectedVendorOrder.vendorId === 'string' 
                        ? 'N/A' 
                        : selectedVendorOrder.vendorId?.address || 'N/A'
                      }
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Status</p>
                    <Badge className={`${getStatusColor(selectedVendorOrder.status)} text-xs font-medium px-2 py-1 flex items-center gap-1 w-fit mx-auto`}>
                      {getStatusIcon(selectedVendorOrder.status)}
                      {selectedVendorOrder.status}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Total Amount</p>
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(selectedVendorOrder.totalAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedVendorOrder.description && (
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
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{selectedVendorOrder.description}</p>
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
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">Width</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">Height</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">Size Sq.ft</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">Unit Price</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200/60 dark:divide-slate-700/60">
                      {selectedVendorOrder.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gradient-to-r hover:from-emerald-50/20 hover:to-green-50/20 dark:hover:from-emerald-900/20 dark:hover:to-green-900/20 transition-all duration-200">
                          <td className="px-4 py-3 border-r border-slate-100/40 dark:border-slate-700/40">
                            <div className="text-xs font-medium text-slate-900 dark:text-slate-100">{item.description}</div>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">{item.width}</td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">{item.height}</td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">{item.size}</td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">{item.quantity}</td>
                          <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 border-r border-slate-100/40 dark:border-slate-700/40">{formatCurrency(item.unitPrice)}</td>
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
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(selectedVendorOrder.subtotal)}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tax Amount</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(selectedVendorOrder.taxAmount)}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Discount</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(selectedVendorOrder.discountAmount)}</p>
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
                      <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(selectedVendorOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedVendorOrder.notes && (
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
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{selectedVendorOrder.notes}</p>
                  </div>
                </div>
              )}

              {/* Terms & Conditions */}
              {selectedVendorOrder.terms && (
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
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{selectedVendorOrder.terms}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete Vendor Order Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
        onConfirm={confirmDeleteVendorOrder}
        title="Delete Vendor Order"
        description="Are you sure you want to delete this vendor order? This action cannot be undone."
        confirmText="Delete Vendor Order"
        variant="destructive"
      />

      {/* Approve Vendor Order Confirmation Dialog */}
      <ConfirmationDialog
        open={showApproveConfirmation}
        onOpenChange={setShowApproveConfirmation}
        onConfirm={confirmApproveVendorOrder}
        title="Approve Vendor Order"
        description="Are you sure you want to approve this vendor order? This will change the status from pending to approved."
        confirmText="Approve Vendor Order"
        variant="default"
      />
    </div>
  );
}
