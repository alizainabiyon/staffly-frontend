'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  FileText,
  Calculator,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Download,
  Building2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FinancePage() {
  const router = useRouter();

  const financeStats = [
    {
      title: 'Total Invoices',
      value: '0',
      icon: FileText,
      color: 'bg-primary'
    },
    {
      title: 'Total Revenue',
      value: '₨ 0L',
      icon: DollarSign,
      color: 'bg-secondary'
    },
    {
      title: 'Paid Invoices',
      value: '0',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Overdue',
      value: '0',
      icon: AlertCircle,
      color: 'bg-red-500'
    },
  ];

  // Invoice management is now handled by the dedicated invoices page



  // InvoiceForm component removed - now handled by dedicated invoices page

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Finance Management</h1>
          <p className="text-muted-foreground">
            Manage invoices, quotations, and financial transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/finance/invoices')}>
            <FileText className="h-4 w-4 mr-2" />
            Manage Invoices
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {financeStats.map((stat, index) => (
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
      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="quotations">Quotations</TabsTrigger>
          <TabsTrigger value="vendor-orders">Vendor Orders</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="recurring">Recurring</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

                <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Invoice Management</CardTitle>
                <Button onClick={() => router.push('/dashboard/finance/invoices')}>
                  Go to Invoices
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Invoice Management</h3>
                <p className="text-muted-foreground mb-6">Manage customer invoices and track payments</p>
                <Button onClick={() => router.push('/dashboard/finance/invoices')}>
                  Go to Invoices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotations">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Quotation Management</CardTitle>
                <Button onClick={() => router.push('/dashboard/finance/quotations')}>
                  View All Quotations
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Quotation Management</h3>
                <p className="text-muted-foreground mb-6">Manage customer quotations and proposals</p>
                <Button onClick={() => router.push('/dashboard/finance/quotations')}>
                  Go to Quotations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendor-orders">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Vendor Order Management</CardTitle>
                <Button onClick={() => router.push('/dashboard/finance/vendor-orders')}>
                  View All Vendor Orders
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Vendor Order Management</h3>
                <p className="text-muted-foreground mb-6">Manage vendor orders and track procurement</p>
                <Button onClick={() => router.push('/dashboard/finance/vendor-orders')}>
                  Go to Vendor Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Payment Management</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Payment Tracking</h3>
                <p className="text-muted-foreground mb-6">Track payments and generate receipts</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <Button variant="outline" className="h-20 flex-col">
                    <Plus className="h-6 w-6 mb-2" />
                    Record Payment
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Payment History
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    Payment Reports
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recurring">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recurring Invoices</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Setup Recurring Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Automated Billing</h3>
                <p className="text-muted-foreground mb-6">Set up recurring invoices for regular customers</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <Button variant="outline" className="h-20 flex-col">
                    <Plus className="h-6 w-6 mb-2" />
                    Create Template
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Clock className="h-6 w-6 mb-2" />
                    Schedule Invoices
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Manage Templates
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Revenue Report
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Outstanding Invoices
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Tax Summary
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Profit & Loss
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Payment History
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Customer Statements
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}