'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Download,
  Send,
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
import { Quotation } from '@/lib/types';
import { fetchQuotationById, deleteQuotation } from '@/lib/store/slices/quotationSlice';
import { RootState, AppDispatch } from '@/lib/store/store';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';
import { toast } from 'sonner';
import { printQuotation } from './printTemplate';

interface QuotationDetailPageProps {
  quotationId: string;
  onUpdate: (quotation: Quotation) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  onEdit?: () => void;
}

export function QuotationDetailPage({ quotationId, onUpdate, onDelete, onBack, onEdit }: QuotationDetailPageProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { selectedQuotation, loading } = useSelector((state: RootState) => state.quotation);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (quotationId) {
      dispatch(fetchQuotationById(quotationId) as any);
    }
  }, [quotationId, dispatch]);

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      router.push(`/dashboard/finance/quotations/${quotationId}/edit`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      try {
        await dispatch(deleteQuotation(quotationId) as any).unwrap();
        toast.success('Quotation deleted successfully');
        onDelete(quotationId);
        onBack();
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete quotation');
      }
    }
  };

  const handleConvertToInvoice = () => {
    router.push(`/dashboard/finance/invoices/new?quotationId=${quotationId}`);
  };

  const handleSendQuotation = () => {
    // TODO: Implement send quotation functionality
    toast.success('Quotation sent successfully');
  };

  const handlePrintQuotation = () => {
    if (!selectedQuotation) {
      toast.error('No quotation selected for printing');
      return;
    }
    
    try {
      printQuotation(selectedQuotation, getCustomerName);
      toast.success('Print window opened successfully');
    } catch (error: any) {
      console.error('Print error:', error);
      toast.error(error.message || 'Failed to open print window. Please try again.');
    }
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'expired': return <Clock className="h-4 w-4" />;
      case 'converted': return <TrendingUp className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getCustomerName = (quotation: Quotation) => {
    if (typeof quotation.customerId === 'string') {
      return quotation.customerId;
    }
    return quotation.customerId?.name || 'Unknown Customer';
  };

  const getCustomerCompany = (quotation: Quotation) => {
    if (typeof quotation.customerId === 'string') {
      return '';
    }
    return quotation.customerId?.company || '';
  };

  if (loading || !selectedQuotation) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quotation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quotations
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{selectedQuotation.quotationNumber}</h1>
            <p className="text-muted-foreground">
              Quotation for {getCustomerName(selectedQuotation)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(selectedQuotation.status)}>
            {getStatusIcon(selectedQuotation.status)}
            {selectedQuotation.status}
          </Badge>
          <Button onClick={handlePrintQuotation} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleSendQuotation} variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
          {selectedQuotation.status === 'accepted' && (
            <Button onClick={handleConvertToInvoice}>
              <FileText className="h-4 w-4 mr-2" />
              Convert to Invoice
            </Button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button onClick={handleEdit} variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button onClick={handleDelete} variant="outline" className="text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p className="font-medium">{getCustomerName(selectedQuotation)}</p>
                </div>
                {getCustomerCompany(selectedQuotation) && (
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{getCustomerCompany(selectedQuotation)}</p>
                  </div>
                )}
                {typeof selectedQuotation.customerId !== 'string' && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedQuotation.customerId.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedQuotation.customerId.phone}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quotation Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quotation Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Quotation Number</p>
                  <p className="font-medium">{selectedQuotation.quotationNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedQuotation.status)}>
                    {selectedQuotation.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p className="font-medium">{selectedQuotation.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(selectedQuotation.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{formatDate(selectedQuotation.updatedAt)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{selectedQuotation.description}</p>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Subtotal</p>
                  <p className="font-medium">{formatCurrency(selectedQuotation.subtotal)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax Amount</p>
                  <p className="font-medium">{formatCurrency(selectedQuotation.taxAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Discount Amount</p>
                  <p className="font-medium">{formatCurrency(selectedQuotation.discountAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-bold text-lg">{formatCurrency(selectedQuotation.totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedQuotation.terms && (
              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedQuotation.terms}</p>
                </CardContent>
              </Card>
            )}

            {selectedQuotation.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedQuotation.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

                 {/* Items Tab */}
         <TabsContent value="items" className="space-y-6">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Package className="h-5 w-5" />
                 Quotation Items
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 {selectedQuotation.items.map((item, index) => (
                   <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                     <div className="flex-1">
                       <p className="font-medium">{item.description}</p>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-muted-foreground">
                         <div className="flex items-center gap-2">
                           <span className="font-medium">Type:</span>
                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                             {item.type?.replace('_', ' ').toUpperCase() || 'N/A'}
                           </span>
                         </div>
                         <div>
                           <span className="font-medium">Qty:</span> {(item.type === 'length_width' || item.type === 'quantity_only') ? (item.quantity || 0) : <span className="text-gray-400">—</span>}
                         </div>
                         <div>
                           <span className="font-medium">Unit Price:</span> {item.type !== 'fixed_amount' ? formatCurrency(item.unitPrice || 0) : <span className="text-gray-400">—</span>}
                         </div>
                         <div>
                           <span className="font-medium">Fixed Amount:</span> {item.type === 'fixed_amount' ? formatCurrency(item.fixedAmount || 0) : <span className="text-gray-400">—</span>}
                         </div>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="font-bold text-lg">{formatCurrency(item.total)}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
         </TabsContent>

        {/* Attachments Tab */}
        <TabsContent value="attachments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="h-5 w-5" />
                Attachments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedQuotation.attachments.length > 0 ? (
                <div className="space-y-3">
                  {selectedQuotation.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <File className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{attachment.name}</p>
                          <p className="text-sm text-muted-foreground">{attachment.type}</p>
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
                <div className="text-center py-8 text-muted-foreground">
                  <File className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No attachments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quotation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedQuotation.createdAt)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">User ID: {selectedQuotation.createdBy}</p>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedQuotation.updatedAt)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">User ID: {selectedQuotation.updatedBy}</p>
                </div>

                {selectedQuotation.sentAt && (
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Sent</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedQuotation.sentAt)}
                      </p>
                    </div>
                  </div>
                )}

                {selectedQuotation.acceptedAt && (
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Accepted</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedQuotation.acceptedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {selectedQuotation.rejectedAt && (
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Rejected</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedQuotation.rejectedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
