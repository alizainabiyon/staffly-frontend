'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchCustomerById, deleteCustomer } from '@/lib/store/slices/crmSlice';
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
import { Customer } from '@/lib/types/crm';
import { toast } from 'sonner';
import { 
  createTextColumn, 
  createBadgeColumn, 
  createCurrencyColumn, 
  createDateColumn,
  createDataTableConfig,
  createViewAction
} from '@/lib/utils/dataTableUtils';
import { useTranslations } from 'next-intl';

export default function CustomerDetailPage() {
  const t = useTranslations('CRM.detail');
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedCustomer, loading, error } = useAppSelector((state) => state.crm);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const hasRequested = useRef(false);

  const customerId = params.id as string;

  useEffect(() => {
    if (customerId && !hasRequested.current) {
      hasRequested.current = true;
      dispatch(fetchCustomerById(customerId));
    }
  }, [customerId, dispatch]);

  useEffect(() => {
    if (selectedCustomer) {
      setCustomer(selectedCustomer);
    }
  }, [selectedCustomer]);

  const handleEdit = () => {
    // TODO: Implement edit functionality
    toast.info('Edit functionality coming soon');
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteCustomer = async () => {
    try {
      await dispatch(deleteCustomer(customerId)).unwrap();
      toast.success('Customer deleted successfully');
      router.push('/dashboard/crm/customers');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete customer');
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboard/crm/customers');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'blocked': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCustomerTypeColor = (type: string) => {
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return <Banknote className="h-4 w-4" />;
      case 'bank': return <CreditCard className="h-4 w-4" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  const getPaymentTypeColor = (type: string) => {
    return type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-slate-700 dark:text-slate-300">{t('loading')}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !customer) {
    return (
      <Card className="border-red-200/60 dark:border-red-700/60 bg-red-50/50 dark:bg-red-900/10">
        <CardContent className="p-8 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || t('notFound')}</p>
          <Button onClick={handleBack} variant="outline" className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToCustomers')}
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
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{customer.name}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Company: {customer.company}
            </p>
          </div>
        </div>
        <Badge className={getStatusColor(customer.status)}>
          {customer.status}
        </Badge>
      </div>

      {/* Compact Stats */}
      {selectedCustomer?.ledger && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-emerald-300/40 dark:hover:border-emerald-600/40 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Opening Balance</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(selectedCustomer.ledger.calculation.openingBalance)}
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
                    {formatCurrency(selectedCustomer.ledger.calculation.closingBalance)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Cash</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(selectedCustomer.ledger.calculation.totalCash)}
                  </p>
                </div>
                <div className="bg-accent p-3 rounded-lg">
                  <Banknote className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bank</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(selectedCustomer.ledger.calculation.totalBank)}
                  </p>
                </div>
                <div className="bg-purple-500 p-3 rounded-lg">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-5">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Customer Information
          </TabsTrigger>
          <TabsTrigger value="ledger" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Financial Ledger
          </TabsTrigger>
          <TabsTrigger value="invoices" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Invoices
          </TabsTrigger>
          <TabsTrigger value="quotations" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Quotations
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
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p className="font-medium text-foreground">{customer.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant="outline" className={getStatusColor(customer.status)}>
                      {customer.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customer Type</p>
                    <Badge variant="outline" className={getCustomerTypeColor(customer.customerType)}>
                      {customer.customerType}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Company</p>
                    <p className="font-medium text-foreground">{customer.company}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium text-foreground">{customer.email}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium text-foreground">{customer.phone}</p>
                    </div>
                  </div>

                  {customer.otherContactNo && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Other Contact</p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium text-foreground">{customer.otherContactNo}</p>
                      </div>
                    </div>
                  )}

                  {customer.contactPerson && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                      <p className="font-medium text-foreground">{customer.contactPerson}</p>
                    </div>
                  )}
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
                  <p className="font-medium text-foreground">{customer.address}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">City</p>
                    <p className="font-medium text-foreground">{customer.city}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Country</p>
                    <p className="font-medium text-foreground">{customer.country}</p>
                  </div>

                  {customer.officeAddress && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Office Address</p>
                      <p className="font-medium text-foreground">{customer.officeAddress}</p>
                    </div>
                  )}

                  {customer.website && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Website</p>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium text-foreground">{customer.website}</p>
                      </div>
                    </div>
                  )}

                  {customer.taxNumber && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Tax Number</p>
                      <p className="font-medium text-foreground">{customer.taxNumber}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          {(customer.notes || customer.tags?.length > 0) && (
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                    <Tag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {customer.notes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                    <p className="font-medium text-foreground">{customer.notes}</p>
                  </div>
                )}
                
                {customer.tags && customer.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {customer.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
                      <p className="font-medium text-foreground">{formatDate(customer.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                      <p className="font-medium text-foreground">{formatDate(customer.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created By</p>
                      <p className="font-medium text-foreground">{customer.createdBy || 'System'}</p>
                    </div>
                  </div>

                  {customer.updatedBy && (
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Updated By</p>
                        <p className="font-medium text-foreground">{customer.updatedBy}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger">
          {selectedCustomer?.ledger ? (
            <>
              {/* Ledger Summary */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Ledger Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-700 mb-2">Opening Balance</p>
                      <p className="text-2xl font-bold text-green-800">
                        {formatCurrency(selectedCustomer.ledger.calculation.openingBalance)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-700 mb-2">Closing Balance</p>
                      <p className="text-2xl font-bold text-blue-800">
                        {formatCurrency(selectedCustomer.ledger.calculation.closingBalance)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <p className="text-sm font-medium text-purple-700 mb-2">Net Change</p>
                      <p className={`text-2xl font-bold ${selectedCustomer.ledger.calculation.closingBalance >= selectedCustomer.ledger.calculation.openingBalance ? 'text-green-800' : 'text-red-800'}`}>
                        {formatCurrency(selectedCustomer.ledger.calculation.closingBalance - selectedCustomer.ledger.calculation.openingBalance)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              {/* Transactions */}
              <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
                <CardContent className="p-0">
                  <TransactionsDataTable 
                    transactions={selectedCustomer.ledger.transactions}
                    customerName={selectedCustomer.name}
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardContent className="p-8 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Ledger Data</h3>
                <p className="text-muted-foreground mb-6">This customer doesn&apos;t have any financial ledger data yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="invoices">
          {selectedCustomer?.invoices && selectedCustomer.invoices.length > 0 ? (
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="text-base text-slate-800 dark:text-slate-100">Customer Invoices ({selectedCustomer.invoices.length})</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <InvoicesDataTable 
                  invoices={selectedCustomer.invoices}
                  customerName={selectedCustomer.name}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardContent className="p-8 text-center">
                <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Invoices</h3>
                <p className="text-muted-foreground mb-6">This customer doesn&apos;t have any invoices yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="quotations">
        {(selectedCustomer as any)?.quotations && (selectedCustomer as any).quotations.length > 0 ? (
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="text-base text-slate-800 dark:text-slate-100">Customer Quotations ({(selectedCustomer as any).quotations.length})</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <QuotationsDataTable 
                  quotations={(selectedCustomer as any).quotations}
                  customerName={(selectedCustomer as any).name}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardContent className="p-8 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Quotations</h3>
                <p className="text-muted-foreground mb-6">This customer doesn&apos;t have any quotations yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {customer?.name}? This action cannot be undone and will permanently remove all customer data including financial records and relationships.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCustomer} className="bg-red-600 hover:bg-red-700">
              Delete Customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Add this component before the main CustomerDetailPage component
function TransactionsDataTable({ transactions, customerName }: { transactions: any[], customerName: string }) {
  // Fix: Ensure handleViewTransaction is defined
  function handleViewTransaction(transaction: any) {
    // TODO: Implement view logic, e.g., open modal or navigate
    console.log('Viewing transaction:', transaction);
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
    title: `Transactions for ${customerName}`,
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
      filename: `${customerName.toLowerCase().replace(/\s+/g, '-')}-transactions`
    }
  });

  return (
    <DataTable
      data={transactions}
      {...tableConfig}
      loading={false}
      emptyMessage="No transactions found for this customer."
    />
  );
}

function InvoicesDataTable({ invoices, customerName }: { invoices: any[], customerName: string }) {
  function handleViewInvoice(invoice: any) {
    // TODO: Implement view logic, e.g., open modal or navigate
    console.log('Viewing invoice:', invoice);
  }

  const actions = [
    createViewAction<any>((invoice) => handleViewInvoice(invoice), 'View Invoice'),
  ];

  const columns = [
    createTextColumn<any>('invoiceNumber', 'Invoice Number', (invoice) => invoice.invoiceNumber, { 
      width: 'w-48' 
    }),
    createTextColumn<any>('description', 'Description', (invoice) => invoice.description || 'N/A', { 
      width: 'w-64' 
    }),
    createDateColumn<any>('createdAt', 'Created Date', (invoice) => invoice.createdAt, { 
      width: 'w-32' 
    }),
    createCurrencyColumn<any>('totalAmount', 'Total Amount', (invoice) => invoice.totalAmount, { 
      width: 'w-32' 
    }),
    createTextColumn<any>('itemsCount', 'Items', (invoice) => `${invoice.items?.length || 0} items`, { 
      width: 'w-24' 
    }),
    createBadgeColumn<any>('status', 'Status', (invoice) => invoice.status, { 
      variant: 'outline',
      width: 'w-24' 
    }),
  ];

  const tableConfig = createDataTableConfig(columns, actions, {
    title: `Invoices for ${customerName}`,
    subtitle: 'Customer invoice history and details',
    searchable: true,
    searchPlaceholder: 'Search invoices...',
    pagination: {
      enabled: true,
      pageSize: 10,
      pageSizeOptions: [5, 10, 20, 50]
    },
    sortable: true,
    exportOptions: {
      enablePrint: false,
      enablePDF: false,
      enableCSV: false,
      filename: `${customerName.toLowerCase().replace(/\s+/g, '-')}-invoices`
    }
  });

  return (
    <DataTable
      data={invoices}
      {...tableConfig}
      loading={false}
      emptyMessage="No invoices found for this customer."
    />
  );
}

function QuotationsDataTable({ quotations, customerName }: { quotations: any[], customerName: string }) {
  function handleViewQuotation(quotation: any) {
    // TODO: Implement view logic, e.g., open modal or navigate
    console.log('Viewing quotation:', quotation);
  }

  const actions = [
    createViewAction<any>((quotation) => handleViewQuotation(quotation), 'View Quotation'),
  ];

  const columns = [
    createTextColumn<any>('quotationNumber', 'Quotation Number', (quotation) => quotation.quotationNumber, { 
      width: 'w-48' 
    }),
    createTextColumn<any>('description', 'Description', (quotation) => quotation.description || 'N/A', { 
      width: 'w-64' 
    }),
    createDateColumn<any>('createdAt', 'Created Date', (quotation) => quotation.createdAt, { 
      width: 'w-32' 
    }),
    createCurrencyColumn<any>('totalAmount', 'Total Amount', (quotation) => quotation.totalAmount, { 
      width: 'w-32' 
    }),
    createTextColumn<any>('itemsCount', 'Items', (quotation) => `${quotation.items?.length || 0} items`, { 
      width: 'w-24' 
    }),
    createBadgeColumn<any>('status', 'Status', (quotation) => quotation.status, { 
      variant: 'outline',
      width: 'w-24' 
    }),
  ];

  const tableConfig = createDataTableConfig(columns, actions, {
    title: `Quotations for ${customerName}`,
    subtitle: 'Customer quotation history and details',
    searchable: true,
    searchPlaceholder: 'Search quotations...',
    pagination: {
      enabled: true,
      pageSize: 10,
      pageSizeOptions: [5, 10, 20, 50]
    },
    sortable: true,
    exportOptions: {
      enablePrint: false,
      enablePDF: false,
      enableCSV: false,
      filename: `${customerName.toLowerCase().replace(/\s+/g, '-')}-quotations`
    }
  });

  return (
    <DataTable
      data={quotations}
      {...tableConfig}
      loading={false}
      emptyMessage="No quotations found for this customer."
    />
  );
}
