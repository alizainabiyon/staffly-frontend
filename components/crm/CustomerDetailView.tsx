'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  ShoppingCart,
  FileText,
  User,
  Globe,
  Tag
} from 'lucide-react';
import { Customer } from '@/lib/types';
import { formatCurrency } from '@/lib/utils/helpers';

interface CustomerDetailViewProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export function CustomerDetailView({ customer, onEdit, onDelete, onBack }: CustomerDetailViewProps) {
  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <MapPin className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" />
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{customer.name}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{customer.company}</p>
          </div>
        </div>
        <Badge className={customer.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}>
          {customer.status}
        </Badge>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-emerald-300/40 dark:hover:border-emerald-600/40 transition-all duration-200">
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
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-purple-300/40 dark:hover:border-purple-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Last Order</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">N/A</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-5">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Overview
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Orders
          </TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Financial
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200">
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Contact Information */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                    <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{customer.company}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                      {customer.email}
                    </a>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
                      {customer.phone}
                    </a>
                  </div>
                </div>
                
                {customer.otherContactNo && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Other Contact No</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${customer.otherContactNo}`} className="text-primary hover:underline">
                        {customer.otherContactNo}
                      </a>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p>{customer.address}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{customer.city}, {customer.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Customer Type</p>
                  <Badge variant="outline">{customer.customerType}</Badge>
                </div>
                
                {customer.contactPerson && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Contact Person</p>
                    <p className="font-medium">{customer.contactPerson}</p>
                  </div>
                )}
                
                {customer.website && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Website</p>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={customer.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {customer.website}
                      </a>
                    </div>
                  </div>
                )}
                
                {customer.taxNumber && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Tax Number</p>
                    <p className="font-medium">{customer.taxNumber}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Credit Limit</p>
                  {/* <p className="font-medium">{formatCurrency(customer.creditLimit)}</p> */}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Payment Terms</p>
                  {/* <p className="font-medium">{customer.paymentTerms} days</p> */}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags and Notes */}
          {(customer.tags.length > 0 || customer.notes) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {customer.tags.length > 0 && (
                <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
                  <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                    <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                      <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                        <Tag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-2">
                      {customer.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {customer.notes && (
                <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
                  <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                    <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                      <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-md">
                        <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">{customer.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="text-base text-slate-800 dark:text-slate-100">Order History</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Order Management</h3>
                <p className="text-muted-foreground mb-6">Track customer orders, quotations, and invoices</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    New Order
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    View Orders
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <ShoppingCart className="h-6 w-6 mb-2" />
                    Order History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="text-base text-slate-800 dark:text-slate-100">Financial Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Financial Management</h3>
                <p className="text-muted-foreground mb-6">Manage invoices, payments, and credit limits</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Create Invoice
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <DollarSign className="h-6 w-6 mb-2" />
                    Record Payment
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Financial Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="text-base text-slate-800 dark:text-slate-100">Documents & Files</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Document Management</h3>
                <p className="text-muted-foreground mb-6">Upload and manage customer documents</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Upload Document
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    View Documents
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Document History
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
          onClick={() => onEdit(customer)}
          className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Customer
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => onDelete(customer.customerId)}
          className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Customer
        </Button>
      </div>
    </div>
  );
}
