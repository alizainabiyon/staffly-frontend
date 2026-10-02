'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchDirectorById, deleteDirector } from '@/lib/store/slices/directorSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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
  Building, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Briefcase, 
  Calendar,
  Users,
  DollarSign,
  FileText,
  HardHat,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Director } from '@/lib/types/director';
import { toast } from 'sonner';
import { 
  createTextColumn, 
  createBadgeColumn, 
  createCurrencyColumn, 
  createDateColumn,
  createDataTableConfig,
  createViewAction
} from '@/lib/utils/dataTableUtils';

export default function DirectorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedDirector, loading, error } = useAppSelector((state) => state.director);
  const [director, setDirector] = useState<Director | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const hasRequested = useRef(false);

  const directorId = params.id as string;

  useEffect(() => {
    if (directorId && !hasRequested.current) {
      hasRequested.current = true;
      dispatch(fetchDirectorById(directorId));
    }
  }, [directorId, dispatch]);

  useEffect(() => {
    if (selectedDirector) {
      setDirector(selectedDirector);
    }
  }, [selectedDirector]);
console.log(director,'selectedDirector')
  const handleEdit = () => {
    // TODO: Implement edit functionality
    toast.info('Edit functionality coming soon');
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteDirector = async () => {
    try {
      await dispatch(deleteDirector(directorId)).unwrap();
      toast.success('Director deleted successfully');
      router.push('/dashboard/directors');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete director');
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboard/directors');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'inactive': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
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

  const handleViewTransaction = (transaction: any) => {
    // TODO: Implement view transaction functionality
    toast.info('View transaction functionality coming soon');
  };

  if (loading) {
    return (
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-slate-700 dark:text-slate-300">Loading director details...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !director) {
    return (
      <Card className="border-red-200/60 dark:border-red-700/60 bg-red-50/50 dark:bg-red-900/10">
        <CardContent className="p-8 text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">{error || 'Director not found'}</p>
          <Button onClick={handleBack} variant="outline" className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Directors
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
          <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{director.name}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Director ID: {director.directorId} • {director.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleEdit} variant="outline" size="sm" className="border-slate-300 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <Edit className="h-4 w-4 mr-2" />
            Edit Director
          </Button>
          <Button onClick={handleDelete} variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Compact Stats */}
      {selectedDirector?.ledger && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-emerald-300/40 dark:hover:border-emerald-600/40 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Opening Balance</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(selectedDirector.ledger.calculation.openingBalance)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-green-300/40 dark:hover:border-green-600/40 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Closing Balance</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(selectedDirector.ledger.calculation.closingBalance)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-blue-300/40 dark:hover:border-blue-600/40 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Total Cash</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(selectedDirector.ledger.calculation.totalCash)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <Banknote className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-purple-300/40 dark:hover:border-purple-600/40 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Total Bank</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(selectedDirector.ledger.calculation.totalBank)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-orange-300/40 dark:hover:border-orange-600/40 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Total Expenses</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedDirector && (selectedDirector as any)?.expenses ? 
                      formatCurrency((selectedDirector as any).expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0)) : 
                      'PKR 0'
                    }
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {selectedDirector && (selectedDirector as any)?.expenses ? 
                      `${(selectedDirector as any).expenses.length} expense(s)` : 
                      '0 expenses'
                    }
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <Receipt className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-5">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
          >
            Director Information
          </TabsTrigger>
          <TabsTrigger 
            value="ledger"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
          >
            Financial Ledger
          </TabsTrigger>
          <TabsTrigger 
            value="expenses"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
          >
            Expenses
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Full Name</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1">{director.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Status</p>
                    <Badge variant="outline" className={`${getStatusColor(director.status)} mt-1`}>
                      {director.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Email</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{director.email}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Phone</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{director.phone}</p>
                    </div>
                  </div>

                  {director.alternatePhone && (
                    <div className="col-span-2">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Alternate Phone</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{director.alternatePhone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                    <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Full Address</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{director.address}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">City</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{director.city}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Country</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{director.country}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Postal Code</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{director.postalCode || 'Not provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Information */}
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Created At</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{formatDate(director.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Last Updated</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{formatDate(director.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Created By</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{director.createdBy || 'System'}</p>
                    </div>
                  </div>

                  {director.updatedBy && (
                    <div className="flex items-center gap-3">
                      <Users className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                      <div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Last Updated By</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{director.updatedBy}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger">
          {selectedDirector?.ledger ? (
            <>
              {/* Transactions */}
              <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
                <CardContent className="p-0">
                  <TransactionsDataTable 
                    transactions={selectedDirector.ledger.transactions}
                    directorName={selectedDirector.name}
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardContent className="p-8 text-center">
                <FileText className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">No Ledger Data</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">This director doesn&apos;t have any financial ledger data yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expenses">
          {selectedDirector && selectedDirector.expense && selectedDirector.expense.length > 0 ? (
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardContent className="p-0">
                <ExpensesDataTable 
                  expenses={selectedDirector.expense}
                  directorName={selectedDirector.name}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardContent className="p-8 text-center">
                <FileText className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">No Expenses Data</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">This director doesn&apos;t have any expense records yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Director</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {director?.name}? This action cannot be undone and will permanently remove all director data including financial records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDirector} className="bg-red-600 hover:bg-red-700">
              Delete Director
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function TransactionsDataTable({ transactions, directorName }: { transactions: any[], directorName: string }) {
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
    createTextColumn<any>('purpose', 'Purpose', (transaction) => transaction.purpose, { 
      width: 'w-48' 
    }),
    createTextColumn<any>('description', 'Description', (transaction) => transaction.description || 'N/A', { 
      width: 'w-64' 
    }),
    
    createTextColumn<any>('paymentMethod', 'Method', (transaction) => transaction.paymentMethod, { 
      width: 'w-16' 
    }),
    createTextColumn<any>('paymentType', 'Type', (transaction) => transaction.paymentType, { 
      width: 'w-16' 
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
    title: `Transactions for ${directorName}`,
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
      filename: `${directorName.toLowerCase().replace(/\s+/g, '-')}-transactions`
    }
  });

  return (
    <DataTable
      data={transactions}
      {...tableConfig}
      loading={false}
      emptyMessage="No transactions found for this director."
    />
  );
}

function ExpensesDataTable({ expenses, directorName }: { expenses: any[], directorName: string }) {
  const actions = [
    createViewAction<any>((expense) => console.log('Viewing expense:', expense), 'View Expense'),
  ];

  // Define table columns
  const columns = [
    createDateColumn<any>('expenseDate', 'Date', (expense) => expense.expenseDate, { 
      width: 'w-32' 
    }),
    createTextColumn<any>('description', 'Description', (expense) => expense.description, { 
      width: 'w-64' 
    }),
    createCurrencyColumn<any>('amount', 'Amount', (expense) => expense.amount, { 
      width: 'w-32' 
    }),
    createTextColumn<any>('type', 'Type', (expense) => expense.type, { 
      width: 'w-24' 
    }),
    createTextColumn<any>('catagory', 'Category', (expense) => expense.catagory, { 
      width: 'w-24' 
    }),
    createDateColumn<any>('createdAt', 'Created', (expense) => expense.createdAt, { 
      width: 'w-32' 
    }),
  ];

  // Create table configuration
  const tableConfig = createDataTableConfig(columns, actions, {
    title: `Expenses for ${directorName}`,
    subtitle: 'Expense history and details',
    searchable: true,
    searchPlaceholder: 'Search expenses...',
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
      filename: `${directorName.toLowerCase().replace(/\s+/g, '-')}-expenses`
    }
  });

  return (
    <DataTable
      data={expenses}
      {...tableConfig}
      loading={false}
      emptyMessage="No expenses found for this director."
    />
  );
}
