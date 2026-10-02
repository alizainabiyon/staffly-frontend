'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { 
  Wallet, 
  Plus, 
  Download,
  DollarSign,
  CreditCard,
  Banknote,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  ArrowUpCircle,
  ArrowDownCircle,
  Eye,
  Search,
  Filter
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchTillData } from '@/lib/store/slices/tillSlice';
import { convertDocxToPdf, selectDocxToPdfLoading, selectDocxToPdfError } from '@/lib/store/slices/reportsSlice';
import { toast } from 'sonner';
import { 
  createTextColumn, 
  createBadgeColumn, 
  createCurrencyColumn, 
  createDateColumn,
  createCustomAction,
  createDataTableConfig
} from '@/lib/utils/dataTableUtils';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';
import { TillTransaction } from '@/lib/types';
import { directorAPI } from '@/lib/services/api';
import { useTranslations } from 'next-intl';

export default function TillPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TillTransaction | null>(null);
  const t = useTranslations('Till');
  
  // Local state for dropdown values (similar to daily entry form)
  const [directors, setDirectors] = useState<any[]>([]);
  const [selectedLedgerType, setSelectedLedgerType] = useState<string>('all');
  const [selectedDirectorId, setSelectedDirectorId] = useState<string>('');
  const [directorsLoading, setDirectorsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { 
    till, 
    allTransactions, 
    totalBalance, 
    totalCash, 
    totalBank, 
    loading, 
    error
  } = useAppSelector((state) => state.till);
  
  const docxToPdfLoading = useAppSelector(selectDocxToPdfLoading);
  const docxToPdfError = useAppSelector(selectDocxToPdfError);

  // Fetch directors when component mounts (similar to daily entry form)
  useEffect(() => {
    const fetchDirectors = async () => {
      setDirectorsLoading(true);
      try {
        const response = await directorAPI.getAll({});
        setDirectors(response.response.data.directors || []);
      } catch (error) {
        console.error('Failed to fetch directors:', error);
        toast.error('Failed to fetch directors');
      } finally {
        setDirectorsLoading(false);
      }
    };

    // Send default filters when component loads
    const initialFilters = { ledgerType: 'all' };
    console.log('Initial till data fetch with filters:', initialFilters);
    dispatch(fetchTillData(initialFilters));
    fetchDirectors();
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (docxToPdfError) {
      toast.error(docxToPdfError);
    }
  }, [docxToPdfError]);

  const tillStats = [
    {
      title: t('stats.totalAmount'),
      value: `₨ ${totalBalance.toLocaleString()}`,
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: t('stats.cashAmount'),
      value: `₨ ${totalCash.toLocaleString()}`,
      icon: Banknote,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Bank Balance',
      value: `₨ ${totalBank.toLocaleString()}`,
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: t('stats.totalEntries'),
      value: allTransactions.length.toString(),
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
  ];

  const getTransactionIcon = (paymentType: string) => {
    return paymentType === 'credit' ? 
      <ArrowUpCircle className="h-4 w-4 text-green-600" /> : 
      <ArrowDownCircle className="h-4 w-4 text-red-600" />;
  };

  const getTransactionColor = (paymentType: string) => {
    return paymentType === 'credit' ? 
      'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 
      'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'bank': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'card': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
    }
  };

  const handleViewTransaction = (transaction: TillTransaction) => {
    setSelectedTransaction(transaction);
  };

  const handleLedgerTypeChange = (value: string) => {
    setSelectedLedgerType(value);
    // Reset director selection when ledger type changes
    if (value !== 'director') {
      setSelectedDirectorId('');
    }
  };

  const handleDirectorChange = (value: string) => {
    setSelectedDirectorId(value);
  };

  const handleGetRecords = () => {
    const filters: { ledgerType?: string; directorId?: string } = {
      ledgerType: selectedLedgerType
    };
    
    if (selectedLedgerType === 'director' && selectedDirectorId) {
      filters.directorId = selectedDirectorId;
    }
    
    // Debug: Log the filters being sent
    console.log('Till API filters being sent:', filters);
    console.log('Selected ledger type:', selectedLedgerType);
    console.log('Selected director ID:', selectedDirectorId);
    
    dispatch(fetchTillData(filters) as any);
  };

  // Utility function to download file from buffer data
  const downloadFileFromBuffer = (bufferData: number[], filename: string) => {
    try {
      // Convert array of numbers to Uint8Array
      const uint8Array = new Uint8Array(bufferData);
      
      // Create blob from buffer
      const blob = new Blob([uint8Array], { type: 'application/docx' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const handleExport = async () => {
    try {
      const payload = {
        templateType: "checkReport",
        templateData: {
          name: "Rizwan ali"
        }
      };
      
      const result = await dispatch(convertDocxToPdf(payload)).unwrap();
      
      if (result && result.data) {
        downloadFileFromBuffer(result.data, 'till-report.docx');
      } else {
        toast.error('No file data received');
      }
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(error || 'Failed to export report');
    }
  };

  // Define table columns for transactions
  const transactionColumns = [
    createTextColumn<TillTransaction>('transactionId', 'Transaction ID', (transaction) => transaction.transactionId, { width: 'w-48' }),
    createCurrencyColumn<TillTransaction>('amount', 'Amount', (transaction) => transaction.amount, { width: 'w-32' }),
    createTextColumn<TillTransaction>('currency', 'Currency', (transaction) => transaction.currency, { width: 'w-24' }),
    createTextColumn<TillTransaction>('paymentType', 'Type', (transaction) => transaction.paymentType, { 
      width: 'w-24' 
    }),
    createTextColumn<TillTransaction>('paymentMethod', 'Method', (transaction) => transaction.paymentMethod, { 
      width: 'w-24' 
    }),
    createTextColumn<TillTransaction>('purpose', 'Purpose', (transaction) => transaction.purpose, { width: 'w-48' }),
    createTextColumn<TillTransaction>('description', 'Description', (transaction) => transaction.description, { width: 'w-64' }),
    createDateColumn<TillTransaction>('transactionDate', 'Date', (transaction) => transaction.transactionDate, { width: 'w-32' }),
  ];

  // Define table actions
  const transactionActions = [
    createCustomAction<TillTransaction>(
      (transaction) => handleViewTransaction(transaction),
      <Eye className="h-4 w-4" />,
      'View',
      'outline'
    ),
  ];

  // Create table configuration
  const transactionTableConfig = createDataTableConfig(transactionColumns, transactionActions, {
    title: 'Transactions',
    subtitle: 'View all till transactions',
    searchable: true,
    searchPlaceholder: 'Search transactions...',
    pagination: {
      enabled: true,
      pageSize: 10,
      pageSizeOptions: [10, 20, 50, 100]
    },
    sortable: true,
    exportOptions: {
      enablePrint: true,
      enablePDF: false,
      enableCSV: false,
      filename: 'till-transactions-export'
    }
  });

  const TransactionForm = ({ onSubmit, onCancel }: any) => {
    const [formData, setFormData] = useState({
      paymentType: '',
      paymentMethod: '',
      amount: 0,
      purpose: '',
      description: '',
      senderType: '',
      receiverType: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="paymentType" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Transaction Type</Label>
            <Select value={formData.paymentType} onValueChange={(value) => setFormData({ ...formData, paymentType: value })}>
              <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit" className="text-xs">Credit (Income)</SelectItem>
                <SelectItem value="debit" className="text-xs">Debit (Expense)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="paymentMethod" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Payment Method</Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
              <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash" className="text-xs">Cash</SelectItem>
                <SelectItem value="bank" className="text-xs">Bank Transfer</SelectItem>
                <SelectItem value="card" className="text-xs">Card Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="senderType" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Sender Type</Label>
            <Select value={formData.senderType} onValueChange={(value) => setFormData({ ...formData, senderType: value })}>
              <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                <SelectValue placeholder="Select sender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer" className="text-xs">Customer</SelectItem>
                <SelectItem value="director" className="text-xs">Director</SelectItem>
                <SelectItem value="vendor" className="text-xs">Vendor</SelectItem>
                <SelectItem value="expense" className="text-xs">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="receiverType" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Receiver Type</Label>
            <Select value={formData.receiverType} onValueChange={(value) => setFormData({ ...formData, receiverType: value })}>
              <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                <SelectValue placeholder="Select receiver" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer" className="text-xs">Customer</SelectItem>
                <SelectItem value="director" className="text-xs">Director</SelectItem>
                <SelectItem value="vendor" className="text-xs">Vendor</SelectItem>
                <SelectItem value="expense" className="text-xs">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="purpose" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Purpose</Label>
            <Input
              id="purpose"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="e.g., Project Payment, Office Rent, Utilities"
              required
              className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              required
              className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={2}
            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
          />
        </div>
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <Button type="button" variant="outline" onClick={onCancel} className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800">
            Cancel
          </Button>
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">Add Transaction</Button>
        </div>
      </form>
    );
  };

  if (loading) {
    return (
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-slate-700 dark:text-slate-300">{t('loading')}...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('title')}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            disabled={docxToPdfLoading}
            className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download className="h-4 w-4 mr-2" />
            {docxToPdfLoading ? t('exporting') : t('export')}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                <Plus className="h-4 w-4 mr-2" />
                {t('addEntry')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl border-slate-200/60 dark:border-slate-700/60">
              <DialogHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <DialogTitle className="flex items-center gap-2 text-xl text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                    <Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Add New Transaction
                </DialogTitle>
              </DialogHeader>
              <TransactionForm
                onSubmit={(formData: any) => {
                  console.log('Transaction data:', formData);
                  toast.success('Transaction added successfully');
                  setIsAddDialogOpen(false);
                }}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Compact Filter Section */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <Label htmlFor="ledgerType" className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
                Ledger Type
              </Label>
              <Select value={selectedLedgerType} onValueChange={handleLedgerTypeChange}>
                <SelectTrigger className="w-full h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                  <SelectValue placeholder="Select ledger type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All</SelectItem>
                  <SelectItem value="till" className="text-xs">Till</SelectItem>
                  <SelectItem value="director" className="text-xs">Director</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedLedgerType === 'director' && (
              <div className="flex-1">
                <Label htmlFor="director" className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
                  Director
                </Label>
                <Select value={selectedDirectorId} onValueChange={handleDirectorChange} disabled={directorsLoading}>
                  <SelectTrigger className="w-full h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                    <SelectValue placeholder={directorsLoading ? "Loading directors..." : "Select director"} />
                  </SelectTrigger>
                  <SelectContent>
                    {directors && directors.length > 0 ? (
                      directors.map((director: any) => (
                        <SelectItem key={director.directorId} value={director.directorId} className="text-xs">
                          {director.name || `${director.firstName} ${director.lastName}` || director.directorId}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-directors" disabled className="text-xs">
                        {directorsLoading ? "Loading directors..." : "No directors found"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button 
              onClick={handleGetRecords} 
              disabled={loading || (selectedLedgerType === 'director' && !selectedDirectorId)}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 h-9"
            >
              <Search className="h-4 w-4 mr-2" />
              Get Records
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compact Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tillStats.map((stat, index) => {
          const IconComponent = stat.icon;
          const colorMap: Record<string, string> = {
            'text-blue-600': 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
            'text-green-600': 'from-green-500 to-green-600 dark:from-green-600 dark:to-green-700',
            'text-purple-600': 'from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700',
            'text-orange-600': 'from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700',
          };
          const hoverColorMap: Record<string, string> = {
            'text-blue-600': 'hover:border-blue-300/40 dark:hover:border-blue-600/40',
            'text-green-600': 'hover:border-green-300/40 dark:hover:border-green-600/40',
            'text-purple-600': 'hover:border-purple-300/40 dark:hover:border-purple-600/40',
            'text-orange-600': 'hover:border-orange-300/40 dark:hover:border-orange-600/40',
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

      {/* Compact Main Content */}
      <Tabs defaultValue="transactions" className="space-y-5">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger 
            value="transactions"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200 text-xs"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger 
            value="cash"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200 text-xs"
          >
            Cash Management
          </TabsTrigger>
          <TabsTrigger 
            value="bank"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200 text-xs"
          >
            Bank Accounts
          </TabsTrigger>
          <TabsTrigger 
            value="reports"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200 text-xs"
          >
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardContent className="p-0">
              <DataTable
                data={allTransactions}
                {...transactionTableConfig}
                loading={loading}
                emptyMessage="No transactions found. Get started by adding your first transaction."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash" className="space-y-4">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md">
                  <Banknote className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                Cash Management
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="text-center py-8">
                <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 p-4 rounded-xl shadow-sm w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Banknote className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">Cash Flow Management</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">Track cash transactions and maintain cash register</p>
                <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-6">
                  ₨ {totalCash.toLocaleString()}
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)} size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Cash Transaction
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank" className="space-y-4">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                  <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                Bank Account Management
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="text-center py-8">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 p-4 rounded-xl shadow-sm w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">Bank Account Overview</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">Monitor bank transactions and account balances</p>
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-6">
                  ₨ {totalBank.toLocaleString()}
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)} size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Bank Transaction
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                Till Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Button variant="outline" className="h-20 flex-col border-slate-300 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700">
                  <Download className="h-5 w-5 mb-1.5" />
                  <span className="text-xs">Cash Flow Statement</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col border-slate-300 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700">
                  <Download className="h-5 w-5 mb-1.5" />
                  <span className="text-xs">Daily Till Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col border-slate-300 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700">
                  <Download className="h-5 w-5 mb-1.5" />
                  <span className="text-xs">Bank Reconciliation</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col border-slate-300 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700">
                  <Download className="h-5 w-5 mb-1.5" />
                  <span className="text-xs">Transaction Summary</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col border-slate-300 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700">
                  <Download className="h-5 w-5 mb-1.5" />
                  <span className="text-xs">Balance Sheet</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col border-slate-300 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700">
                  <Download className="h-5 w-5 mb-1.5" />
                  <span className="text-xs">Audit Trail</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-2xl border-slate-200/60 dark:border-slate-700/60">
          <DialogHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
            <DialogTitle className="flex items-center gap-2 text-xl text-slate-800 dark:text-slate-100">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              Transaction Details
            </DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Transaction ID</Label>
                  <p className="text-sm text-slate-900 dark:text-slate-100 mt-1">{selectedTransaction.transactionId}</p>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Amount</Label>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-1">₨ {selectedTransaction.amount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Payment Type</Label>
                  <Badge className={`${getTransactionColor(selectedTransaction.paymentType)} mt-1 text-xs`}>
                    {selectedTransaction.paymentType}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Payment Method</Label>
                  <Badge className={`${getPaymentMethodColor(selectedTransaction.paymentMethod)} mt-1 text-xs`}>
                    {selectedTransaction.paymentMethod}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Purpose</Label>
                  <p className="text-sm text-slate-900 dark:text-slate-100 mt-1">{selectedTransaction.purpose}</p>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Date</Label>
                  <p className="text-sm text-slate-900 dark:text-slate-100 mt-1">{formatDate(selectedTransaction.transactionDate)}</p>
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Description</Label>
                <p className="text-sm text-slate-900 dark:text-slate-100 mt-1">{selectedTransaction.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Opening Balance</Label>
                  <p className="text-sm text-slate-900 dark:text-slate-100 mt-1">₨ {selectedTransaction.openingBalance.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Closing Balance</Label>
                  <p className="text-sm text-slate-900 dark:text-slate-100 mt-1">₨ {selectedTransaction.closingBalance.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}