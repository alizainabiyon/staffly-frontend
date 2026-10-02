'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { VendorOrder } from '@/lib/types';
import { fetchVendorOrderById } from '@/lib/store/slices/vendorOrderSlice';
import { RootState, AppDispatch } from '@/lib/store/store';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock,
  Building2,
  Package,
  FileText,
  Calculator,
  Download,
  Eye,
  Printer
} from 'lucide-react';
import { printVendorOrder } from './printTemplate';
import { Label } from '@/components/ui/label';

export function VendorOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedVendorOrder, loading } = useSelector((state: RootState) => state.vendorOrder);
  
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (params.id) {
      dispatch(fetchVendorOrderById(params.id as string) as any);
    }
  }, [dispatch, params.id]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedVendorOrder) return;
    
    try {
      // TODO: Implement status update when API is ready
      toast.success(`Vendor order status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handlePrintVendorOrder = () => {
    if (!selectedVendorOrder) {
      toast.error('No vendor order selected for printing');
      return;
    }
    
    try {
      const getVendorName = (vendorOrder: VendorOrder) => {
        if (typeof vendorOrder.vendorId === 'string') {
          return vendorOrder.vendorId;
        }
        return vendorOrder.vendorId?.name || 'Unknown Vendor';
      };
      
      printVendorOrder(selectedVendorOrder, getVendorName);
      toast.success('Print window opened successfully');
    } catch (error: any) {
      console.error('Print error:', error);
      toast.error(error.message || 'Failed to open print window. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading vendor order details...</p>
        </div>
      </div>
    );
  }

  if (!selectedVendorOrder) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Vendor order not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Vendor Order Details</h1>
            <p className="text-muted-foreground">
              {selectedVendorOrder.orderNumber} • {selectedVendorOrder.status}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handlePrintVendorOrder}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/finance/vendor-orders/${params.id}?edit=true`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Status Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className={`${getStatusColor(selectedVendorOrder.status)} text-sm font-medium px-3 py-1`}>
                {selectedVendorOrder.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Last updated: {formatDate(selectedVendorOrder.updatedAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {selectedVendorOrder.status === 'draft' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate('pending')}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send for Approval
                </Button>
              )}
              {selectedVendorOrder.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('approved')}
                    className="flex items-center gap-2 text-green-600"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('rejected')}
                    className="flex items-center gap-2 text-red-600"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
              {selectedVendorOrder.status === 'approved' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate('completed')}
                  className="flex items-center gap-2 text-blue-600"
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vendor Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Vendor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Vendor Name</Label>
                  <p className="text-lg font-semibold">{getVendorName(selectedVendorOrder)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Company</Label>
                  <p className="text-lg">{getVendorCompany(selectedVendorOrder)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-lg">
                    {typeof selectedVendorOrder.vendorId === 'string' 
                      ? 'N/A' 
                      : selectedVendorOrder.vendorId?.email || 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p className="text-lg">
                    {typeof selectedVendorOrder.vendorId === 'string' 
                      ? 'N/A' 
                      : selectedVendorOrder.vendorId?.phone || 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                  <p className="text-lg">
                    {typeof selectedVendorOrder.vendorId === 'string' 
                      ? 'N/A' 
                      : selectedVendorOrder.vendorId?.address || 'N/A'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Order Number</Label>
                  <p className="text-lg font-semibold">{selectedVendorOrder.orderNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="text-lg">{selectedVendorOrder.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge className={`${getStatusColor(selectedVendorOrder.status)} text-sm font-medium px-3 py-1`}>
                    {selectedVendorOrder.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <p className="text-lg">{formatDate(selectedVendorOrder.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                  <p className="text-lg">{formatDate(selectedVendorOrder.updatedAt)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes & Terms */}
          {(selectedVendorOrder.notes || selectedVendorOrder.terms) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedVendorOrder.notes && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
                    <p className="text-lg">{selectedVendorOrder.notes}</p>
                  </div>
                )}
                {selectedVendorOrder.terms && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Terms & Conditions</Label>
                    <p className="text-lg">{selectedVendorOrder.terms}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Items Tab */}
        <TabsContent value="items" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({selectedVendorOrder.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Description</th>
                      <th className="text-center py-3 px-4 font-semibold">Width</th>
                      <th className="text-center py-3 px-4 font-semibold">Height</th>
                      <th className="text-center py-3 px-4 font-semibold">Size Sq.ft</th>
                      <th className="text-center py-3 px-4 font-semibold">Quantity</th>
                      <th className="text-center py-3 px-4 font-semibold">Unit Price</th>
                      <th className="text-center py-3 px-4 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVendorOrder.items.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{item.description}</td>
                        <td className="py-3 px-4 text-center">{item.width}</td>
                        <td className="py-3 px-4 text-center">{item.height}</td>
                        <td className="py-3 px-4 text-center">{item.size}</td>
                        <td className="py-3 px-4 text-center">{item.quantity}</td>
                        <td className="py-3 px-4 text-center">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-3 px-4 text-center font-semibold">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-lg">Subtotal</span>
                  <span className="text-lg font-semibold">{formatCurrency(selectedVendorOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-lg">Tax Amount</span>
                  <span className="text-lg font-semibold">{formatCurrency(selectedVendorOrder.taxAmount)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-lg">Discount Amount</span>
                  <span className="text-lg font-semibold">{formatCurrency(selectedVendorOrder.discountAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-3">
                  <span className="text-2xl font-bold">Total Amount</span>
                  <span className="text-3xl font-bold text-primary">{formatCurrency(selectedVendorOrder.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attachments Tab */}
        <TabsContent value="attachments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Attachments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No attachments found</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
