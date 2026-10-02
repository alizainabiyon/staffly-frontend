'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchVendorById, deleteVendor } from '@/lib/store/slices/vendorSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ArrowLeft, 
  Edit, 
  Trash2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Building,
  Globe,
  Calendar,
  Users,
  DollarSign,
  FileText,
  Receipt,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  Tag
} from 'lucide-react';
import { Vendor } from '@/lib/types/crm';
import { toast } from 'sonner';
import { 
  createTextColumn, 
  createBadgeColumn, 
  createCurrencyColumn, 
  createDateColumn,
  createDataTableConfig,
  createViewAction,
  createEditAction
} from '@/lib/utils/dataTableUtils';

// VendorOrdersDataTable component
function VendorOrdersDataTable({ orders, vendorName }: { orders: any[], vendorName: string }) {
  function handleViewOrder(order: any) {
    // View order functionality can be implemented here
    console.log('View order:', order);
  }

  function handleEditOrder(order: any) {
    // Edit order functionality can be implemented here
    console.log('Edit order:', order);
  }

  const actions = [
    createViewAction<any>((order) => handleViewOrder(order), 'View Order'),
    createEditAction<any>((order) => handleEditOrder(order), 'Edit Order'),
  ];
  
  // Define table columns
  const columns = [
    createTextColumn<any>('orderNumber', 'Order #', (order) => order.orderNumber, { 
      width: 'w-32' 
    }),
    createDateColumn<any>('createdAt', 'Date', (order) => order.createdAt, { 
      width: 'w-32' 
    }),
    createTextColumn<any>('description', 'Description', (order) => order.description || 'N/A', { 
      width: 'w-64' 
    }),
    createBadgeColumn<any>('status', 'Status', (order) => order.status, { 
      width: 'w-32'
    }),
    createCurrencyColumn<any>('subtotal', 'Subtotal', (order) => order.subtotal, { 
      width: 'w-32' 
    }),
    createCurrencyColumn<any>('taxAmount', 'Tax', (order) => order.taxAmount, { 
      width: 'w-24' 
    }),
    createCurrencyColumn<any>('discountAmount', 'Discount', (order) => order.discountAmount, { 
      width: 'w-24' 
    }),
    createCurrencyColumn<any>('totalAmount', 'Total', (order) => order.totalAmount, { 
      width: 'w-32' 
    }),
  ];

  // Create table configuration
  const tableConfig = createDataTableConfig(columns, actions, {
    title: `Orders for ${vendorName}`,
    subtitle: 'Vendor order history and details',
    searchable: true,
    searchPlaceholder: 'Search orders...',
    pagination: {
      enabled: true,
      pageSize: 10,
      pageSizeOptions: [5, 10, 20, 50]
    },
    sortable: true,
    exportOptions: {
      enablePrint: true,
      enablePDF: false,
      enableCSV: false,
      filename: `${vendorName.toLowerCase().replace(/\s+/g, '-')}-orders`
    }
  });

  return (
    <DataTable
      data={orders}
      {...tableConfig}
      loading={false}
      emptyMessage="No orders found for this vendor."
    />
  );
}

export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedVendor, loading, error } = useAppSelector((state) => state.vendor);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [ledger, setLedger] = useState<Vendor | null>(null);
  const [vendorOrders, setVendorOrders] = useState<Vendor[] | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const hasRequested = useRef(false);

  const vendorId = params.id as string;

  useEffect(() => {
    if (vendorId && !hasRequested.current) {
      hasRequested.current = true;
      dispatch(fetchVendorById(vendorId));
    }
  }, [vendorId, dispatch]);

  useEffect(() => {
    if (selectedVendor) {
      // Extract vendor and ledger data from the correct structure
      const vendorData = (selectedVendor as any).vendor;
      const ledgerData = (selectedVendor as any).ledger;
      const vendorOrdersData = (selectedVendor as any).vendorOrders;
      
      if (vendorData) {
        setVendor(vendorData);
        setLedger(ledgerData);
        setVendorOrders(vendorOrdersData);
      }
    }
  }, [selectedVendor]);

  const handleEdit = () => {
    toast.info('Edit functionality coming soon');
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };
  const confirmDeleteVendor = async () => {
    try {
      await dispatch(deleteVendor(vendorId)).unwrap();
      toast.success('Vendor deleted successfully');
      router.push('/dashboard/crm/vendors');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete vendor');
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboard/crm/vendors');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'blocked': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVendorTypeColor = (type: string) => {
    switch (type) {
      case 'individual': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'PKR') => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-slate-700 dark:text-slate-300">Loading vendor details...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !vendor) {
    return (
      <Card className="border-red-200/60 dark:border-red-700/60 bg-red-50/50 dark:bg-red-900/10">
        <CardContent className="p-8 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Vendor not found'}</p>
          <Button onClick={handleBack} variant="outline" className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vendors
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" />
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{vendor.name}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Category: {vendor.category}
            </p>
          </div>
        </div>
        <Badge className={getStatusColor(vendor.status)}>
          {vendor.status}
        </Badge>
      </div>

      {/* Compact Stats */}
      {ledger && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-emerald-300/40 dark:hover:border-emerald-600/40 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Opening Balance</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency((ledger as any).calculation.openingBalance)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-blue-300/40 dark:hover:border-blue-600/40 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Remaining Balance</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency((ledger as any).calculation.closingBalance)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-5">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Vendor Information
          </TabsTrigger>
          <TabsTrigger value="ledger" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Financial Ledger
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Vendor Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Personal Information */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                    <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Vendor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vendor Name</p>
                    <p className="font-medium text-foreground">{vendor.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant="outline" className={getStatusColor(vendor.status)}>
                      {vendor.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vendor Type</p>
                    <Badge variant="outline" className={getVendorTypeColor(vendor.type)}>
                      {vendor.type}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Company</p>
                    <p className="font-medium text-foreground">{vendor.companyName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium text-foreground">{vendor.email}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium text-foreground">{vendor.phone}</p>
                    </div>
                  </div>

                  {vendor.alternatePhone && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Alternate Phone</p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium text-foreground">{vendor.alternatePhone}</p>
                      </div>
                    </div>
                  )}

                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <Badge variant="secondary">{vendor.category}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Full Address</p>
                  <p className="font-medium text-foreground">{vendor.address}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">City</p>
                    <p className="font-medium text-foreground">{vendor.city}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Country</p>
                    <p className="font-medium text-foreground">{vendor.country}</p>
                  </div>

                  {vendor.postalCode && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Postal Code</p>
                      <p className="font-medium text-foreground">{vendor.postalCode}</p>
                    </div>
                  )}

                  {vendor.website && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Website</p>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium text-foreground">{vendor.website}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Information */}
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-md">
                  <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created At</p>
                      <p className="font-medium text-foreground">{formatDate(vendor.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                      <p className="font-medium text-foreground">{formatDate(vendor.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created By</p>
                      <p className="font-medium text-foreground">{vendor.createdBy || 'System'}</p>
                    </div>
                  </div>

                  {vendor.updatedBy && (
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Updated By</p>
                        <p className="font-medium text-foreground">{vendor.updatedBy}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger">
          {ledger ? (
            <>
              {/* Transactions */}
              <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
                <CardContent className="p-0">
                  <TransactionsDataTable 
                    transactions={(ledger as any).transactions}
                    vendorName={vendor.name}
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardContent className="p-8 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Ledger Data</h3>
                <p className="text-muted-foreground mb-6">This vendor doesn&apos;t have any financial ledger data yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orders">
          {vendorOrders && vendorOrders.length > 0 ? (
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardContent className="p-0">
                <VendorOrdersDataTable 
                  orders={vendorOrders}
                  vendorName={vendor.name}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardContent className="p-8 text-center">
                <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Vendor Orders</h3>
                <p className="text-muted-foreground mb-6">This vendor doesn&apos;t have any orders yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {vendor?.name}? This action cannot be undone and will permanently remove all vendor data including financial records and relationships.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteVendor} className="bg-red-600 hover:bg-red-700">
              Delete Vendor
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Add this component before the main VendorDetailPage component
function TransactionsDataTable({ transactions, vendorName }: { transactions: any[], vendorName: string }) {
  function handleViewTransaction(transaction: any) {
    // View transaction functionality can be implemented here
  }

  const actions = [
    createViewAction<any>((transaction) => handleViewTransaction(transaction), 'View Transaction'),
  ];
  
  // Define table columns
  const columns = [
    createDateColumn<any>('transactionDate', 'Date', (transaction) => transaction.transactionDate, { 
      width: 'w-32' 
    }),
    createTextColumn<any>('purpose', 'Purpose', (transaction) => transaction.purpose || 'Transaction', { 
      width: 'w-48' 
    }),
    createTextColumn<any>('description', 'Description', (transaction) => transaction.description || 'N/A', { 
      width: 'w-64' 
    }),
    createTextColumn<any>('paymentMethod', 'Method', (transaction) => transaction.paymentMethod || 'N/A', { 
      width: 'w-32' 
    }),
    createTextColumn<any>('paymentType', 'Type', (transaction) => transaction.paymentType || 'N/A', { 
      width: 'w-32' 
    }),
    createCurrencyColumn<any>('amount', 'Amount', (transaction) => transaction.amount, { 
      width: 'w-32' 
    }),
    createCurrencyColumn<any>('openingBalance', 'Opening Balance', (transaction) => transaction.openingBalance, { 
      width: 'w-32' 
    }),
    createCurrencyColumn<any>('closingBalance', 'Closing Balance', (transaction) => transaction.closingBalance, { 
      width: 'w-32' 
    }),
  ];

  // Create table configuration
  const tableConfig = createDataTableConfig(columns, actions, {
    title: `Transactions for ${vendorName}`,
    subtitle: 'Financial transaction history and details',
    searchable: true,
    searchPlaceholder: 'Search transactions...',
    pagination: {
      enabled: true,
      pageSize: 10,
      pageSizeOptions: [5, 10, 20, 50]
    },
    sortable: true,
    exportOptions: {
      enablePrint: true,
      enablePDF: false,
      enableCSV: false,
      filename: `${vendorName.toLowerCase().replace(/\s+/g, '-')}-transactions`
    }
  });

  return (
    <DataTable
      data={transactions}
      {...tableConfig}
      loading={false}
      emptyMessage="No transactions found for this vendor."
    />
  );
}
