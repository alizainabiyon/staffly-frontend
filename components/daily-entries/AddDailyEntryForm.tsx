'use client';

import { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  DollarSign, 
  User, 
  Building, 
  Briefcase, 
  MapPin,
  FileText,
  Tag
} from 'lucide-react';
import { DailyEntry } from '@/lib/types/entries';
import { useDailyEntryForm } from '@/hooks/useDailyEntryForm';
import { customerAPI, vendorAPI, employeeAPI, directorAPI } from '@/lib/services/api';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface AddDailyEntryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (entry: any) => void;
  entry?: DailyEntry | null;
}

export function AddDailyEntryForm({ open, onOpenChange, onSubmit, entry }: AddDailyEntryFormProps) {
  const t = useTranslations('DailyEntry.form');
  const {
    formik,
    isSubmitting,
    resetForm,
  } = useDailyEntryForm({
    entry,
    onSubmit,
    onClose: () => onOpenChange(false),
  });

  // State for storing API data
  const [customers, setCustomers] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [directors, setDirectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data when form opens
  useEffect(() => {
    if (open) {
      if (!entry) {
        // Add Entry case → reset fields
        resetForm();
      }
      // Fetch all data when form opens
      fetchAllData();
    }
  }, [open, entry]);

  // Function to fetch all required data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [customersRes, vendorsRes, employeesRes, directorsRes] = await Promise.all([
        customerAPI.getAll(),
        vendorAPI.getAll(),
        employeeAPI.getAll(),
        directorAPI.getAll()
      ]);

      // Extract data from responses
      if (customersRes.status.success) {
        const customerData = customersRes.response.data || [];
        setCustomers(customerData);
      }
      if (vendorsRes.status.success) {
        const vendorData = vendorsRes.response.data.vendors || [];
        setVendors(vendorData);
      }
      if (employeesRes.status.success) {
        const employeeData = employeesRes.response.data.employees || [];
        setEmployees(employeeData);
      }
      if (directorsRes.status.success) {
        const directorData = directorsRes.response.data.directors || [];
        setDirectors(directorData);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load some data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    resetForm();
    onOpenChange(false);
  }, [resetForm, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-slate-200/60 dark:border-slate-700/60">
        <DialogHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
          <DialogTitle className="flex items-center gap-2 text-xl text-slate-800 dark:text-slate-100">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            {entry ? t('editTitle') : t('addTitle')}
          </DialogTitle>
          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-1">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-emerald-600"></div>
              {t('loading')}...
            </div>
          )}
        </DialogHeader>

        <form 
          key={entry?.entryId || 'new'} 
          onSubmit={formik.handleSubmit} 
          className="space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Entry Date */}
            <div className="space-y-1.5">
              <Label htmlFor="entryDate" className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('fields.date')} *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-3 w-3 text-slate-500 dark:text-slate-400" />
                <Input
                  id="entryDate"
                  name="entryDate"
                  type="date"
                  value={formik.values.entryDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`pl-9 h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs ${formik.touched.entryDate && formik.errors.entryDate ? 'border-red-500' : ''}`}
                />
              </div>
              {formik.touched.entryDate && formik.errors.entryDate && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.entryDate}</p>
              )}
            </div>

            {/* Payment Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('fields.entryType')} *</Label>
              <RadioGroup
                value={formik.values.paymentType}
                onValueChange={(value) => formik.setFieldValue('paymentType', value)}
                className="flex space-x-4 pt-1.5"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit" id="credit" />
                  <Label htmlFor="credit" className="text-xs text-green-600 dark:text-green-400 font-medium">{t('types.income')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="debit" id="debit" />
                  <Label htmlFor="debit" className="text-xs text-red-600 dark:text-red-400 font-medium">{t('types.expense')}</Label>
                </div>
              </RadioGroup>
              {formik.touched.paymentType && formik.errors.paymentType && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.paymentType}</p>
              )}
            </div>
            {/* Payment Method */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Payment Method *</Label>
              <RadioGroup
                value={formik.values.paymentMethod}
                onValueChange={(value) => formik.setFieldValue('paymentMethod', value)}
                className="flex space-x-4 pt-1.5"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="text-xs text-green-600 dark:text-green-400 font-medium">Cash</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="text-xs text-blue-600 dark:text-blue-400 font-medium">Bank</Label>
                </div>
              </RadioGroup>
              {formik.touched.paymentMethod && formik.errors.paymentMethod && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.paymentMethod}</p>
              )}
            </div>
            {/* Amount */}
            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('fields.amount')} *</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('placeholders.enterAmount')}
                className={`h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs ${formik.touched.amount && formik.errors.amount ? 'border-red-500' : ''}`}
              />
              {formik.touched.amount && formik.errors.amount && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.amount}</p>
              )}
            </div>

            {/* Entry Type */}
            <div className="space-y-1.5">
              <Label htmlFor="entryType" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Entry Type *</Label>
              <Select
                value={formik.values.entryType}
                onValueChange={(value) => formik.setFieldValue('entryType', value)}
              >
                <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                  <SelectValue placeholder={t('placeholders.selectEntryType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t('fields.customer')}
                    </div>
                  </SelectItem>
                  <SelectItem value="vendor">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {t('fields.vendor')}
                    </div>
                  </SelectItem>
                  <SelectItem value="expense">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Expense
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.entryType && formik.errors.entryType && (
                <p className="text-sm text-red-500">{formik.errors.entryType}</p>
              )}
            </div>

            {/* Conditional Fields based on Entry Type */}
            {formik.values.entryType === 'customer' && (
              <div className="space-y-1.5">
                <Label htmlFor="customerId" className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('fields.customer')} *</Label>
                <Select
                  value={formik.values.customerId}
                  onValueChange={(value) => formik.setFieldValue('customerId', value)}
                  disabled={loading}
                >
                  <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                    <SelectValue placeholder={loading ? t('loading') : t('placeholders.selectCustomer')} />
                  </SelectTrigger>
                  <SelectContent>
                    {customers && customers.length > 0 ? (
                      customers.map((customer) => (
                        <SelectItem key={customer.customerId} value={customer.customerId}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {customer.name || customer.companyName || customer.customerId}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-customers" disabled>
                        {loading ? t('loading') : "No customers found"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formik.touched.customerId && formik.errors.customerId && (
                  <p className="text-xs text-red-500 mt-1">{formik.errors.customerId}</p>
                )}
              </div>
            )}

            {formik.values.entryType === 'vendor' && (
              <div className="space-y-1.5">
                <Label htmlFor="vendorId" className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('fields.vendor')} *</Label>
                <Select
                  value={formik.values.vendorId}
                  onValueChange={(value) => formik.setFieldValue('vendorId', value)}
                  disabled={loading}
                >
                  <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                    <SelectValue placeholder={loading ? t('loading') : t('placeholders.selectVendor')} />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors && vendors.length > 0 ? (
                      vendors.map((vendor) => (
                        <SelectItem key={vendor.vendorId} value={vendor.vendorId}>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {vendor.name || vendor.companyName || vendor.vendorId}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-vendors" disabled>
                        {loading ? t('loading') : "No vendors found"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formik.touched.vendorId && formik.errors.vendorId && (
                  <p className="text-sm text-red-500">{formik.errors.vendorId}</p>
                )}
              </div>
            )}

            {formik.values.entryType === 'expense' && (
              <div className="space-y-1.5">
                <Label htmlFor="expense" className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('fields.category')} *</Label>
                <Select
                  value={formik.values.expenseCategory}
                  onValueChange={(value) => formik.setFieldValue('expenseCategory', value)}
                >
                  <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                    <SelectValue placeholder={t('placeholders.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="director">Director</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.expenseCategory && formik.errors.expenseCategory && (
                  <p className="text-xs text-red-500 mt-1">{formik.errors.expenseCategory}</p>
                )}
              </div>
            )}

            {/* Employee Select - only show when expense category is employee */}
            {formik.values.entryType === 'expense' && formik.values.expenseCategory === 'employee' && (
              <div className="space-y-1.5">
                <Label htmlFor="employeeId" className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('fields.employee')} *</Label>
                <Select
                  value={formik.values.employeeId}
                  onValueChange={(value) => formik.setFieldValue('employeeId', value)}
                  disabled={loading}
                >
                  <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                    <SelectValue placeholder={loading ? "Loading employees..." : "Select employee"} />
                  </SelectTrigger>
                  <SelectContent>
                    {employees && employees.length > 0 ? (
                      employees.map((employee) => (
                        <SelectItem key={employee.employeeId} value={employee.employeeId}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {employee.name || `${employee.firstName} ${employee.lastName}` || employee.employeeId}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-employees" disabled>
                        {loading ? "Loading employees..." : "No employees found"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formik.touched.employeeId && formik.errors.employeeId && (
                  <p className="text-xs text-red-500 mt-1">{formik.errors.employeeId}</p>
                )}
              </div>
            )}

            {/* Director Select - only show when expense category is director */}
            {formik.values.entryType === 'expense' && formik.values.expenseCategory === 'director' && (
              <div className="space-y-1.5">
                <Label htmlFor="directorId" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Director *</Label>
                <Select
                  value={formik.values.directorId}
                  onValueChange={(value) => formik.setFieldValue('directorId', value)}
                  disabled={loading}
                >
                  <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                    <SelectValue placeholder={loading ? "Loading directors..." : "Select director"} />
                  </SelectTrigger>
                  <SelectContent>
                    {directors && directors.length > 0 ? (
                      directors.map((director) => (
                        <SelectItem key={director.directorId} value={director.directorId}>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            {director.name || `${director.firstName} ${director.lastName}` || director.directorId}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-directors" disabled>
                        {loading ? "Loading directors..." : "No directors found"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formik.touched.directorId && formik.errors.directorId && (
                  <p className="text-xs text-red-500 mt-1">{formik.errors.directorId}</p>
                )}
              </div>
            )}

            {/* Expense Type - only show when expense category is selected */}
            {formik.values.entryType === 'expense' && formik.values.expenseCategory && (
              <div className="space-y-1.5">
                <Label htmlFor="expenseType" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Expense Type *</Label>
                <Select
                  value={formik.values.expenseType}
                  onValueChange={(value) => formik.setFieldValue('expenseType', value)}
                >
                  <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                    <SelectValue placeholder="Select expense type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="site">Site</SelectItem>
                    <SelectItem value="grocery">Grocery</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="bills">Bills</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.expenseType && formik.errors.expenseType && (
                  <p className="text-xs text-red-500 mt-1">{formik.errors.expenseType}</p>
                )}
              </div>
            )}

            {/* Purpose and Description */}
            <div className="space-y-1.5">
              <Label htmlFor="purpose" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Purpose *</Label>
              <Input
                id="purpose"
                name="purpose"
                value={formik.values.purpose}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter purpose"
                className={`h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs ${formik.touched.purpose && formik.errors.purpose ? 'border-red-500' : ''}`}
              />
              {formik.touched.purpose && formik.errors.purpose && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.purpose}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('fields.description')} *</Label>
              <Input
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('placeholders.enterDescription')}
                className={`h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs ${formik.touched.description && formik.errors.description ? 'border-red-500' : ''}`}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.description}</p>
              )}
            </div>

            {/* Till Type and Related Fields */}
            <div className="space-y-1.5">
              <Label htmlFor="destinationType" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Till Type *</Label>
              <Select
                value={formik.values.destinationType}
                onValueChange={(value) => formik.setFieldValue('destinationType', value)}
              >
                <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                  <SelectValue placeholder="Select till type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="till">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Till
                    </div>
                  </SelectItem>
                  <SelectItem value="director">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      {t('fields.director')}
                    </div>
                  </SelectItem>
                  <SelectItem value="vendor">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Vendor
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.destinationType && formik.errors.destinationType && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.destinationType}</p>
              )}
            </div>

            {formik.values.destinationType === 'director' && (
              <div className="space-y-1.5">
                <Label htmlFor="destinationDirectorId" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Destination Director *</Label>
                <Select
                  value={formik.values.destinationDirectorId}
                  onValueChange={(value) => formik.setFieldValue('destinationDirectorId', value)}
                  disabled={loading}
                >
                  <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                    <SelectValue placeholder={loading ? "Loading directors..." : "Select destination director"} />
                  </SelectTrigger>
                  <SelectContent>
                    {directors && directors.length > 0 ? (
                      directors.map((director) => (
                        <SelectItem key={director.directorId} value={director.directorId}>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            {director.name || `${director.firstName} ${director.lastName}` || director.directorId}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-destination-directors" disabled>
                        {loading ? "Loading directors..." : "No directors found"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formik.touched.destinationDirectorId && formik.errors.destinationDirectorId && (
                  <p className="text-xs text-red-500 mt-1">{formik.errors.destinationDirectorId}</p>
                )}
              </div>
            )}

            {formik.values.destinationType === 'vendor' && (
              <div className="space-y-1.5">
                <Label htmlFor="destinationVendorId" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Destination Vendor *</Label>
                <Select
                  value={formik.values.destinationVendorId}
                  onValueChange={(value) => formik.setFieldValue('destinationVendorId', value)}
                >
                  <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                    <SelectValue placeholder="Select destination vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors && vendors.length > 0 ? (
                      vendors.map((vendor) => (
                        <SelectItem key={vendor.vendorId} value={vendor.vendorId}>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {vendor.name || vendor.companyName || vendor.vendorId}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-destination-vendors" disabled>
                        No vendors found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formik.touched.destinationVendorId && formik.errors.destinationVendorId && (
                  <p className="text-xs text-red-500 mt-1">{formik.errors.destinationVendorId}</p>
                )}
              </div>
            )}

            {/* Entry Clear Status and Status */}
            <div className="space-y-1.5">
              <Label htmlFor="entryClearStatus" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Entry Clear Status *</Label>
              <Select
                value={formik.values.entryClearStatus}
                onValueChange={(value) => formik.setFieldValue('entryClearStatus', value)}
              >
                <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                  <SelectValue placeholder="Select clear status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      Pending
                    </div>
                  </SelectItem>
                  <SelectItem value="cleared">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Cleared
                    </div>
                  </SelectItem>
                  <SelectItem value="rejected">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Rejected
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.entryClearStatus && formik.errors.entryClearStatus && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.entryClearStatus}</p>
              )}
            </div>


          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('fields.notes')}</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t('placeholders.enterNotes')}
              rows={2}
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t('actions.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px] bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t('actions.saving')}
                </div>
              ) : (
                entry ? t('actions.update') : t('actions.add')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
