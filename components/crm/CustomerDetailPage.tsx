'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Building,
  DollarSign,
  FileText,
  ShoppingCart,
  Calendar,
  TrendingUp,
  ArrowLeft,
  Plus,
  Download,
  Eye
} from 'lucide-react';
import { Customer, Order, Invoice, Payment } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';
import { AddCustomerForm } from './AddCustomerForm';
import { toast } from 'sonner';

interface CustomerDetailPageProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export function CustomerDetailPage({ customer, onUpdate, onDelete, onBack }: CustomerDetailPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Mock data for demonstration
  // const mockOrders: Order[] = [
  //   {
  //     id: '1',
  //     orderNumber: 'ORD-2024-001',
  //     customerId: customer.id,
  //     customerName: customer.name,
  //     orderDate: '2024-01-15',
  //     deliveryDate: '2024-02-15',
  //     status: 'confirmed',
  //     items: [
  //       {
  //         id: '1',
  //         productName: 'Software Development',
  //         description: 'Custom ERP Solution',
  //         quantity: 1,
  //         unitPrice: 500000,
  //         totalPrice: 500000,
  //         taxRate: 15,
  //         discountRate: 0,
  //       },
  //     ],
  //     subtotal: 500000,
  //     taxAmount: 75000,
  //     discountAmount: 0,
  //     shippingAmount: 0,
  //     totalAmount: 575000,
  //     paymentStatus: 'partial',
  //     paymentMethod: 'bank_transfer',
  //     shippingAddress: customer.address,
  //     billingAddress: customer.address,
  //     notes: 'Urgent delivery required',
  //     attachments: [],
  //     createdBy: '1',
  //     createdAt: '2024-01-15T00:00:00Z',
  //     updatedAt: '2024-01-15T00:00:00Z',
  //   },
  // ];

  // const mockInvoices: Invoice[] = [
  //   {
  //     id: '1',
  //     invoiceNumber: 'INV-2024-001',
  //     customerId: customer.id,
  //     customerName: customer.name,
  //     orderId: '1',
  //     invoiceDate: '2024-01-15',
  //     dueDate: '2024-02-15',
  //     items: [
  //       {
  //         id: '1',
  //         description: 'Software Development Services',
  //         quantity: 1,
  //         unitPrice: 500000,
  //         totalPrice: 500000,
  //         taxRate: 15,
  //         taxAmount: 75000,
  //       },
  //     ],
  //     subtotal: 500000,
  //     taxAmount: 75000,
  //     discountAmount: 0,
  //     totalAmount: 575000,
  //     paidAmount: 200000,
  //     remainingAmount: 375000,
  //     status: 'sent',
  //     paymentTerms: 'Net 30 days',
  //     notes: 'Thank you for your business',
  //     termsAndConditions: 'Payment due within 30 days',
  //     attachments: [],
  //     sentAt: '2024-01-15T10:00:00Z',
  //     createdBy: '1',
  //     createdAt: '2024-01-15T00:00:00Z',
  //     updatedAt: '2024-01-15T00:00:00Z',
  //   },
  // ];

  // const mockPayments: Payment[] = [
  //   {
  //     id: '1',
  //     paymentNumber: 'PAY-2024-001',
  //     customerId: customer.id,
  //     customerName: customer.name,
  //     invoiceId: '1',
  //     amount: 200000,
  //     paymentDate: '2024-01-20',
  //     paymentMethod: 'bank_transfer',
  //     reference: 'TXN-123456',
  //     notes: 'Partial payment for INV-2024-001',
  //     status: 'cleared',
  //     bankDetails: {
  //       bankName: 'HBL',
  //       accountNumber: '1234567890',
  //     },
  //     attachments: [],
  //     recordedBy: '1',
  //     createdAt: '2024-01-20T00:00:00Z',
  //   },
  // ];

  // const mockLedger = [
  //   {
  //     id: '1',
  //     date: '2024-01-15',
  //     type: 'invoice',
  //     reference: 'INV-2024-001',
  //     description: 'Software Development Services',
  //     debit: 575000,
  //     credit: 0,
  //     balance: 575000,
  //   },
  //   {
  //     id: '2',
  //     date: '2024-01-20',
  //     type: 'payment',
  //     reference: 'PAY-2024-001',
  //     description: 'Partial payment received',
  //     debit: 0,
  //     credit: 200000,
  //     balance: 375000,
  //   },
  // ];

  const handleEdit = (updatedCustomer: Omit<Customer, 'customerId' | 'createdAt' | 'updatedAt'>) => {
    const updated: Customer = {
      ...customer,
      ...updatedCustomer,
      updatedAt: new Date().toISOString(),
    };
    onUpdate(updated);
    setIsEditDialogOpen(false);
    toast.success('Customer updated successfully');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
        onDelete(customer.customerId);
      toast.success('Customer deleted successfully');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" />
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-sm font-semibold">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{customer.name}</h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">{customer.company} • {customer.city}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(customer.status)}>
            {customer.status}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)} className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete} className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-blue-300/40 dark:hover:border-blue-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Total Orders</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">0</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-green-300/40 dark:hover:border-green-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Total Value</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">$0</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-red-300/40 dark:hover:border-red-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Outstanding</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">$0</p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-purple-300/40 dark:hover:border-purple-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Credit Limit</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">$0</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <TabsList className="grid w-full grid-cols-5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Overview
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Orders
          </TabsTrigger>
          <TabsTrigger value="invoices" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Invoices
          </TabsTrigger>
          <TabsTrigger value="ledger" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Ledger
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Customer Information */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                    <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customer Type</p>
                    <p className="text-foreground capitalize">{customer.customerType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tax Number</p>
                    <p className="text-foreground">{customer.taxNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">{customer.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">{customer.phone}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-foreground">{customer.address}, {customer.city}, {customer.country}</p>
                  </div>
                </div>
                {customer.contactPerson && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                    <p className="text-foreground">{customer.contactPerson}</p>
                  </div>
                )}
                {customer.website && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Website</p>
                    <p className="text-foreground">{customer.website}</p>
                  </div>
                )}
                {customer.notes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <p className="text-foreground">{customer.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Terms */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  Business Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Credit Limit</p>
                    {/* <p className="text-foreground font-semibold">{formatCurrency(customer.creditLimit)}</p> */}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Payment Terms</p>
                    {/* <p className="text-foreground">{customer.paymentTerms} days</p> */}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Outstanding Amount</p>
                    {/* <p className="text-foreground font-semibold text-red-600">{formatCurrency(customer.outstandingAmount)}</p> */}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Available Credit</p>
                    <p className="text-foreground font-semibold text-green-600">
                      {/* {formatCurrency(customer.creditLimit - customer.outstandingAmount)} */}
                    </p>
                  </div>
                </div>
                {customer.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {customer.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                    <ShoppingCart className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {/* <div className="space-y-3">
                  {mockOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.orderDate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
                        <Badge className={getOrderStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div> */}
              </CardContent>
            </Card>

            {/* Recent Payments */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md">
                    <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {/* <div className="space-y-3">
                  {mockPayments.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{payment.paymentNumber}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(payment.paymentDate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{formatCurrency(payment.amount)}</p>
                        <p className="text-sm text-muted-foreground capitalize">{payment.paymentMethod}</p>
                      </div>
                    </div>
                  ))}
                </div> */}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base text-slate-800 dark:text-slate-100">Customer Orders</CardTitle>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Order
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
                {/* <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium">{order.orderNumber}</h4>
                          <p className="text-sm text-muted-foreground">
                            Ordered: {formatDate(order.orderDate)}
                            {order.deliveryDate && ` • Delivery: ${formatDate(order.deliveryDate)}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getOrderStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.productName} x {item.quantity}</span>
                            <span>{formatCurrency(item.totalPrice)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Payment Status: </span>
                          <Badge variant="outline" className={
                            order.paymentStatus === 'paid' ? 'text-green-600' :
                            order.paymentStatus === 'partial' ? 'text-yellow-600' : 'text-red-600'
                          }>
                            {order.paymentStatus}
                          </Badge>
                        </div>
                        <div className="font-medium">
                          Total: {formatCurrency(order.totalAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div> */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base text-slate-800 dark:text-slate-100">Customer Invoices</CardTitle>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {/* <div className="space-y-4">
                {mockInvoices.map((invoice) => (
                  <div key={invoice.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                        <p className="text-sm text-muted-foreground">
                          Date: {formatDate(invoice.invoiceDate)} • Due: {formatDate(invoice.dueDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getInvoiceStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Subtotal</p>
                        <p className="font-medium">{formatCurrency(invoice.subtotal)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tax</p>
                        <p className="font-medium">{formatCurrency(invoice.taxAmount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-medium">{formatCurrency(invoice.totalAmount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Remaining</p>
                        <p className="font-medium text-red-600">{formatCurrency(invoice.remainingAmount)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div> */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="text-base text-slate-800 dark:text-slate-100">Customer Ledger</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Reference</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-right p-2">Debit</th>
                      <th className="text-right p-2">Credit</th>
                      <th className="text-right p-2">Balance</th>
                    </tr>
                  </thead>
                  {/* <tbody>
                    {mockLedger.map((entry) => (
                      <tr key={entry.id} className="border-b">
                        <td className="p-2">{formatDate(entry.date)}</td>
                        <td className="p-2">{entry.reference}</td>
                        <td className="p-2">{entry.description}</td>
                        <td className="p-2 text-right">
                          {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                        </td>
                        <td className="p-2 text-right">
                          {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                        </td>
                        <td className="p-2 text-right font-medium">
                          {formatCurrency(entry.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody> */}
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="text-base text-slate-800 dark:text-slate-100">Customer Reports</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Customer Statement
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Order History
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Payment History
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Outstanding Report
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Credit Analysis
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Sales Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Customer Dialog */}
      <AddCustomerForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEdit}
        customerId={customer.customerId}
      />
    </div>
  );
}