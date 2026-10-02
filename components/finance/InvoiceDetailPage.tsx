import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchInvoiceById, deleteInvoice, sendInvoice, markInvoicePaid } from '@/lib/store/slices/invoiceSlice';
import { Invoice } from '@/lib/types';
import { InvoiceForm } from './InvoiceForm';
import { toast } from 'sonner';
import { printInvoice } from './printTemplate';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Send, 
  CreditCard, 
  Download, 
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  User,
  Building,
  Calculator,
  Package,
  File
} from 'lucide-react';

interface InvoiceDetailPageProps {
  invoiceId: string;
  onUpdate?: (invoice: Invoice) => void;
  onDelete?: (invoiceId: string) => void;
  onBack?: () => void;
  onEdit?: () => void;
}

export function InvoiceDetailPage({ 
  invoiceId, 
  onUpdate, 
  onDelete, 
  onBack, 
  onEdit 
}: InvoiceDetailPageProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedInvoice: invoice, loading } = useAppSelector((state) => state.invoice);
  
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (invoiceId) {
      dispatch(fetchInvoiceById(invoiceId));
    }
  }, [dispatch, invoiceId]);

  const handleUpdate = (invoiceData: Omit<Invoice, 'invoiceId' | 'createdAt' | 'updatedAt' | '_id'>) => {
    // Handle invoice update
    toast.success('Invoice updated successfully');
    setShowEditForm(false);
    if (onUpdate && invoice) {
      onUpdate({ ...invoice, ...invoiceData });
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        await dispatch(deleteInvoice(invoiceId)).unwrap();
        toast.success('Invoice deleted successfully');
        if (onDelete) {
          onDelete(invoiceId);
        } else {
          router.push('/dashboard/finance/invoices');
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete invoice');
      }
    }
  };

  const handleSend = async () => {
    try {
      await dispatch(sendInvoice(invoiceId)).unwrap();
      toast.success('Invoice sent successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send invoice');
    }
  };

  const handleMarkPaid = async () => {
    try {
      await dispatch(markInvoicePaid({ 
        invoiceId, 
        paymentData: { 
          amount: 0, 
          paymentMethod: 'manual',
          paymentDate: new Date().toISOString() 
        } 
      })).unwrap();
      toast.success('Invoice marked as paid');
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark invoice as paid');
    }
  };

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
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'paid': return <CreditCard className="h-4 w-4" />;
      case 'overdue': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount);
  };

  if (loading) {
    return (
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-slate-700 dark:text-slate-300">Loading invoice...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!invoice) {
    return (
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardContent className="p-8 text-center">
          <FileText className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Invoice Not Found</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">The invoice you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => router.push('/dashboard/finance/invoices')} className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
            Back to Invoices
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack || (() => router.push('/dashboard/finance/invoices'))} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" />
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{invoice.invoiceNumber}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Invoice for {getCustomerName(invoice)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={getStatusColor(invoice.status)}>
            {getStatusIcon(invoice.status)}
            {invoice.status}
          </Badge>
          <Button onClick={() => {
            try {
              printInvoice(invoice, getCustomerName);
              toast.success('Print window opened successfully');
            } catch (error: any) {
              console.error('Print error:', error);
              toast.error(error.message || 'Failed to open print window. Please try again.');
            }
          }} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleSend} variant="outline" size="sm">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
          {invoice.status === 'accepted' && (
            <Button onClick={handleMarkPaid} size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
              <CreditCard className="h-4 w-4 mr-2" />
              Mark as Paid
            </Button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button onClick={() => setShowEditForm(true)} variant="outline" size="sm" className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button onClick={handleDelete} variant="outline" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="items"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
          >
            Items
          </TabsTrigger>
          <TabsTrigger 
            value="attachments"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
          >
            Attachments
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
          >
            History
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Customer Information */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Customer Name</p>
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{getCustomerName(invoice)}</p>
                </div>
                {getCustomerCompany(invoice) && (
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Company</p>
                    <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{getCustomerCompany(invoice)}</p>
                  </div>
                )}
                {typeof invoice.customerId !== 'string' && (
                  <>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Email</p>
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{invoice.customerId.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Phone</p>
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{invoice.customerId.phone}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Invoice Information */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                    <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Invoice Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Invoice Number</p>
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{invoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Status</p>
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Currency</p>
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{invoice.currency || 'PKR'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Created</p>
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Last Updated</p>
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{new Date(invoice.updatedAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="text-base text-slate-800 dark:text-slate-100">Description</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">{invoice.description}</p>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md">
                  <Calculator className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Subtotal</p>
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{formatCurrency(invoice.subtotal)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Tax Amount</p>
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{formatCurrency(invoice.taxAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Discount Amount</p>
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{formatCurrency(invoice.discountAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Previous Balance</p>
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{formatCurrency(invoice.previousRemainingAmount ?? 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Total Amount</p>
                  <p className="font-bold text-base text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(
                      (invoice.totalAmount ?? 0) -
                      (invoice.advanceAmount ?? 0) +
                      (invoice.previousRemainingAmount ?? 0)
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {invoice.terms && (
              <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
                <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <CardTitle className="text-base text-slate-800 dark:text-slate-100">Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-line">{invoice.terms}</p>
                </CardContent>
              </Card>
            )}

            {invoice.notes && (
              <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
                <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <CardTitle className="text-base text-slate-800 dark:text-slate-100">Notes</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-line">{invoice.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Items Tab */}
        <TabsContent value="items" className="space-y-5">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                  <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                Invoice Items
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {invoice.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-slate-200/60 dark:border-slate-700/60 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{item.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Type:</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {item.type?.replace('_', ' ').toUpperCase() || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Qty:</span> {(item.type === 'length_width' || item.type === 'quantity_only') ? (item.quantity || 0) : <span className="text-slate-400 dark:text-slate-500">—</span>}
                        </div>
                        <div>
                          <span className="font-medium">Unit Price:</span> {item.type !== 'fixed_amount' ? formatCurrency(item.unitPrice || 0) : <span className="text-slate-400 dark:text-slate-500">—</span>}
                        </div>
                        <div>
                          <span className="font-medium">Fixed Amount:</span> {item.type === 'fixed_amount' ? formatCurrency(item.fixedAmount || 0) : <span className="text-slate-400 dark:text-slate-500">—</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-base text-emerald-700 dark:text-emerald-400">{formatCurrency(item.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attachments Tab */}
        <TabsContent value="attachments" className="space-y-5">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-md">
                  <File className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                Attachments
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {invoice.attachments && invoice.attachments.length > 0 ? (
                <div className="space-y-3">
                  {invoice.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-slate-200/60 dark:border-slate-700/60 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <File className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{attachment.name}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{attachment.type}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <File className="h-12 w-12 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">No attachments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-5">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-md">
                  <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                Invoice History
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border border-slate-200/60 dark:border-slate-700/60 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                  <div>
                    <p className="font-medium text-sm text-slate-900 dark:text-slate-100">Created</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">User ID: {invoice.createdBy}</p>
                </div>
                
                <div className="flex justify-between items-center p-3 border border-slate-200/60 dark:border-slate-700/60 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                  <div>
                    <p className="font-medium text-sm text-slate-900 dark:text-slate-100">Last Updated</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {new Date(invoice.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">User ID: {invoice.updatedBy}</p>
                </div>

                {invoice.sentAt && (
                  <div className="flex justify-between items-center p-3 border border-slate-200/60 dark:border-slate-700/60 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">Sent</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {new Date(invoice.sentAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {invoice.acceptedAt && (
                  <div className="flex justify-between items-center p-3 border border-slate-200/60 dark:border-slate-700/60 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">Accepted</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {new Date(invoice.acceptedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {invoice.rejectedAt && (
                  <div className="flex justify-between items-center p-3 border border-slate-200/60 dark:border-slate-700/60 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">Rejected</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {new Date(invoice.rejectedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {invoice.paidAt && (
                  <div className="flex justify-between items-center p-3 border border-slate-200/60 dark:border-slate-700/60 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">Paid</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {new Date(invoice.paidAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Form Dialog */}
      {showEditForm && (
        <InvoiceForm
          open={showEditForm}
          onOpenChange={setShowEditForm}
          onSubmit={handleUpdate}
          invoice={invoice}
        />
      )}
    </div>
  );
}