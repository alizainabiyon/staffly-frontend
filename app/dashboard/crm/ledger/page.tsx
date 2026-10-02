'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Search, 
  Download,
  Plus,
  Building,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  Filter,
  Receipt,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAppSelector } from '@/lib/hooks';
import { formatCurrency } from '@/lib/utils/helpers';

// Mock data for ledger entries
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
}

const mockLedgerEntries: LedgerEntry[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'ABC Company Ltd.',
    type: 'invoice',
    amount: 150000,
    description: 'Construction Materials - Phase 1',
    date: '2024-01-15',
    status: 'completed',
    reference: 'INV-2024-001',
    balance: 0,
  },
  {
    id: '2',
    customerId: '1',
    customerName: 'ABC Company Ltd.',
    type: 'payment',
    amount: -150000,
    description: 'Payment Received',
    date: '2024-01-20',
    status: 'completed',
    reference: 'PAY-2024-001',
    balance: 0,
  },
  {
    id: '3',
    customerId: '2',
    customerName: 'XYZ Corporation',
    type: 'invoice',
    amount: 250000,
    description: 'Engineering Services - Project Alpha',
    date: '2024-01-10',
    status: 'pending',
    reference: 'INV-2024-002',
    balance: 250000,
  },
  {
    id: '4',
    customerId: '3',
    customerName: 'Delta Industries',
    type: 'invoice',
    amount: 180000,
    description: 'Consultation Services',
    date: '2024-01-05',
    status: 'overdue',
    reference: 'INV-2024-003',
    balance: 180000,
  },
  {
    id: '5',
    customerId: '3',
    customerName: 'Delta Industries',
    type: 'credit',
    amount: -50000,
    description: 'Credit Note - Service Adjustment',
    date: '2024-01-12',
    status: 'completed',
    reference: 'CR-2024-001',
    balance: 130000,
  },
];

export default function LedgerPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const { customers } = useAppSelector((state) => state.crm);

  const filteredEntries = mockLedgerEntries.filter(entry => {
    const matchesSearch = entry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCustomer = selectedCustomer === 'all' || entry.customerId === selectedCustomer;
    const matchesType = selectedType === 'all' || entry.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || entry.status === selectedStatus;
    
    return matchesSearch && matchesCustomer && matchesType && matchesStatus;
  });

  const ledgerStats = [
    {
      title: 'Total Outstanding',
      value: formatCurrency(mockLedgerEntries
        .filter(e => e.balance > 0)
        .reduce((sum, e) => sum + e.balance, 0)),
      icon: TrendingUp,
      color: 'bg-red-500'
    },
    {
      title: 'Total Receivables',
      value: formatCurrency(mockLedgerEntries
        .filter(e => e.type === 'invoice')
        .reduce((sum, e) => sum + e.amount, 0)),
      icon: Receipt,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Payments',
      value: formatCurrency(Math.abs(mockLedgerEntries
        .filter(e => e.type === 'payment')
        .reduce((sum, e) => sum + e.amount, 0))),
      icon: CreditCard,
      color: 'bg-green-500'
    },
    {
      title: 'Overdue Amount',
      value: formatCurrency(mockLedgerEntries
        .filter(e => e.status === 'overdue')
        .reduce((sum, e) => sum + e.balance, 0)),
      icon: AlertCircle,
      color: 'bg-orange-500'
    },
  ];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Ledger</h1>
          <p className="text-muted-foreground">
            Track customer transactions, outstanding balances, and payment history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Ledger
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ledgerStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="outstanding">Outstanding</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Transaction History</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">All Customers</option>
                    {customers.map(customer => (
                      <option key={customer.customerId} value={customer.customerId}>{customer.name}</option>
                    ))}
                  </select>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="invoice">Invoices</option>
                    <option value="payment">Payments</option>
                    <option value="credit">Credits</option>
                    <option value="debit">Debits</option>
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEntries.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or add new transactions
                    </p>
                  </div>
                ) : (
                  filteredEntries.map((entry) => {
                    const TypeIcon = getTypeIcon(entry.type);
                    return (
                      <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-${getTypeColor(entry.type).replace('text-', 'bg-')}/10 rounded-full flex items-center justify-center`}>
                            <TypeIcon className={`h-6 w-6 ${getTypeColor(entry.type)}`} />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{entry.customerName}</h4>
                            <p className="text-sm text-muted-foreground">{entry.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(entry.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                <span>{entry.reference}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`font-medium text-foreground ${entry.amount < 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {entry.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(entry.amount))}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Balance: {formatCurrency(entry.balance)}
                            </p>
                            <Badge 
                              className={`text-xs mt-1 ${getStatusColor(entry.status)} text-white`}
                            >
                              {entry.status}
                            </Badge>
                          </div>
                                                     <div className="flex items-center gap-1">
                             <Button 
                               variant="ghost" 
                               size="sm"
                               title="View Details"
                               onClick={() => router.push(`/dashboard/crm/ledger/${entry.id}`)}
                             >
                               <Eye className="h-4 w-4" />
                             </Button>
                           </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outstanding">
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLedgerEntries
                  .filter(entry => entry.balance > 0)
                  .map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{entry.customerName}</h4>
                          <p className="text-sm text-muted-foreground">{entry.description}</p>
                          <p className="text-sm text-red-600 font-medium">
                            Due: {new Date(entry.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-red-600">{formatCurrency(entry.balance)}</p>
                        <Badge variant="destructive" className="text-xs mt-1">
                          {entry.status === 'overdue' ? 'Overdue' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Ledger Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Customer Statements
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Outstanding Report
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Payment History
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Aging Report
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Collection Report
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Revenue Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
