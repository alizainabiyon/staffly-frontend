'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Building,
  Receipt,
  CreditCard,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/helpers';

interface LedgerEntry {
  id: string;
  customerId: string;
  customerName: string;
  type: 'invoice' | 'payment' | 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'overdue';
  reference: string;
  balance: number;
  dueDate?: string;
  paymentMethod?: string;
  notes?: string;
}

interface LedgerDetailViewProps {
  entry: LedgerEntry;
  onEdit: (entry: LedgerEntry) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export function LedgerDetailView({ entry, onEdit, onDelete, onBack }: LedgerDetailViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'invoice': return Receipt;
      case 'payment': return CreditCard;
      case 'credit': return TrendingDown;
      case 'debit': return TrendingUp;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'invoice': return 'text-blue-600';
      case 'payment': return 'text-green-600';
      case 'credit': return 'text-purple-600';
      case 'debit': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'invoice': return 'Invoice';
      case 'payment': return 'Payment';
      case 'credit': return 'Credit Note';
      case 'debit': return 'Debit Note';
      default: return 'Transaction';
    }
  };

  const TypeIcon = getTypeIcon(entry.type);

  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ledger
          </Button>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" />
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(entry.type).replace('text-', 'bg-')}/10`}>
              <TypeIcon className={`h-5 w-5 ${getTypeColor(entry.type)}`} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{entry.reference}</h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">{getTypeLabel(entry.type)}</p>
            </div>
          </div>
        </div>
        <Badge className={`${getStatusColor(entry.status)} text-white border-0`}>
          {entry.status}
        </Badge>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-green-300/40 dark:hover:border-green-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Amount</p>
                <p className={`text-xl font-bold ${entry.amount < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {entry.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(entry.amount))}
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
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Balance</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(entry.balance)}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-purple-300/40 dark:hover:border-purple-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Transaction Date</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {new Date(entry.date).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {entry.dueDate && (
          <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-orange-300/40 dark:hover:border-orange-600/40 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Due Date</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {new Date(entry.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-5">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Overview
          </TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Transaction Details
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Transaction Information */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                    <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Transaction Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="font-medium font-mono">{entry.reference}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge variant="outline">{getTypeLabel(entry.type)}</Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={`${getStatusColor(entry.status)} text-white`}>
                    {entry.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className={`text-2xl font-bold ${entry.amount < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {entry.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(entry.amount))}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="text-xl font-bold">{formatCurrency(entry.balance)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p className="font-medium">{entry.customerName}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Customer ID</p>
                  <p className="font-mono text-sm">{entry.customerId}</p>
                </div>
                
                {entry.paymentMethod && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium">{entry.paymentMethod}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Transaction Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {entry.dueDate && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(entry.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Description and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="text-base text-slate-800 dark:text-slate-100">Description</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">{entry.description}</p>
              </CardContent>
            </Card>
            
            {entry.notes && (
              <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
                <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <CardTitle className="text-base text-slate-800 dark:text-slate-100">Notes</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">{entry.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="text-base text-slate-800 dark:text-slate-100">Detailed Transaction Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Transaction Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Transaction ID:</span>
                        <span className="font-mono text-sm">{entry.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Reference:</span>
                        <span className="font-mono text-sm">{entry.reference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type:</span>
                        <Badge variant="outline">{getTypeLabel(entry.type)}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge className={`${getStatusColor(entry.status)} text-white`}>
                          {entry.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Financial Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <span className={`font-bold ${entry.amount < 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {entry.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(entry.amount))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Balance:</span>
                        <span className="font-bold">{formatCurrency(entry.balance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Transaction Date:</span>
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                      {entry.dueDate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Due Date:</span>
                          <span>{new Date(entry.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {entry.paymentMethod && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Payment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Payment Method:</span>
                          <span className="font-medium">{entry.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="text-base text-slate-800 dark:text-slate-100">Transaction History</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Transaction History</h3>
                <p className="text-muted-foreground mb-6">View related transactions and audit trail</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Related Transactions
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Audit Trail
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Change History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
        <Button 
          onClick={() => onEdit(entry)}
          className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Entry
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => onDelete(entry.id)}
          className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Entry
        </Button>
      </div>
    </div>
  );
}
