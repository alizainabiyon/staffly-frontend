'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, Building, Plus, X, Upload, Trash2, Calculator,
  Package, File, Save, ArrowRight, Calendar, Hash, UserCheck, Clock
} from 'lucide-react';
import { Invoice } from '@/lib/types';
import { useInvoiceForm } from '@/hooks/useInvoiceForm';
import { fetchCustomers } from '@/lib/store/slices/crmSlice';
import { RootState } from '@/lib/store/store';
import { fetchProfile } from '@/lib/store/slices/profileSlice';
import { useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';

interface InvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (invoice: Omit<Invoice, 'invoiceId' | 'createdAt' | 'updatedAt' | '_id'>) => void;
  invoice?: Invoice | null;
}

export function InvoiceForm({ open, onOpenChange, onSubmit, invoice }: InvoiceFormProps) {
  const dispatch = useDispatch();
  const { profile } = useAppSelector((state: any) => state.profile);
  const { customers } = useSelector((state: RootState) => ({
    customers: state.crm.customers,
  }));
  const t = useTranslations('Invoice.form');

  useEffect(() => {
    dispatch(fetchProfile() as any);
  }, [dispatch]);

  useEffect(() => {
    if (open) dispatch(fetchCustomers() as any);
  }, [open, dispatch]);

  const { formik, isSubmitting, attachments, pendingFiles, addItem, removeItem, updateItem, handleFileUpload, removeAttachment, removePendingFile } =
    useInvoiceForm({ invoice, onSubmit, onClose: () => onOpenChange(false) });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) handleFileUpload(Array.from(files));
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.customerId === customerId);
    return customer ? customer.name : customerId;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-700/60">
        <DialogHeader className="border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
              <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            {invoice ? t('editTitle') : t('createTitle')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Header Section */}
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                {/* Company Info */}
                <div className="flex items-start gap-3">
                  {profile?.companyLogoUrl ? (
                    <img
                      src={profile.companyLogoUrl}
                      alt="Company Logo"
                      className="w-14 h-14 rounded-lg object-cover bg-white border-2 border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-lg flex items-center justify-center border-2 border-emerald-200 dark:border-emerald-700">
                      <Building className="h-7 w-7 text-white" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{profile?.companyName || 'Staffly Solutions'}</h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{profile?.companyAddress || '123 Business Avenue, City, State 12345'}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Phone: {profile?.companyPhone || '+1 (555) 123-4567'}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Email: {profile?.companyEmail || 'info@staffly.com'}</p>
                    {profile?.companyWebsite && (
                      <p className="text-xs text-slate-600 dark:text-slate-400">Website: {profile.companyWebsite}</p>
                    )}
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="text-center flex-1">
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">INVOICE</h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Professional Invoice</p>
                </div>

                {/* Invoice Info */}
                <div className="text-right space-y-1">
                  <div className="text-base font-bold text-emerald-700 dark:text-emerald-400">{invoice ? invoice.invoiceNumber : 'Auto-generated'}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Date: {new Date().toLocaleDateString()}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Status: {invoice?.status || 'draft'}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mt-5 grid grid-cols-2 gap-6 border-t border-slate-200/60 dark:border-slate-700/60 pt-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">{t('sections.customerInfo')}:</h3>
                    <Select
                      value={formik.values.customerId}
                      onValueChange={(value) => formik.setFieldValue('customerId', value)}
                    >
                      <SelectTrigger className={`h-9 w-full ${formik.touched.customerId && formik.errors.customerId ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder={t('placeholders.selectCustomer')} />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.customerId} value={customer.customerId}>
                            {customer.name} ({customer.company})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formik.touched.customerId && formik.errors.customerId && (
                      <p className="text-xs text-red-500 mt-1">{formik.errors.customerId as string}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <Label htmlFor="description" className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('fields.description')}</Label>
                <Textarea
                  id="description"
                  {...formik.getFieldProps('description')}
                  placeholder={t('placeholders.enterDescription')}
                  rows={3}
                  className={`mt-2 ${formik.touched.description && formik.errors.description ? 'border-red-500' : ''}`}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-xs text-red-500 mt-1">{formik.errors.description as string}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardContent className="p-0">
              <div className="flex justify-between items-center px-5 py-3 border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20">
                <h2 className="text-base font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                    <Package className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  {t('sections.invoiceItems')}
                </h2>
                <Button type="button" onClick={addItem} variant="outline" size="sm" className="bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                  <Plus className='h-4 w-4 mr-2' /> {t('actions.addItem')}
                </Button>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                    {formik.values.items.map((item: any, index: number) => (
                  <div key={index} className="border border-slate-200/60 dark:border-slate-700/60 rounded-lg p-3 bg-slate-50/50 dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                          {index + 1}
                        </div>
                        <h3 className="text-xs font-medium text-slate-700 dark:text-slate-300">Item {index + 1}</h3>
                      </div>
                      {formik.values.items.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 h-6 px-2"
                        >
                          <X className='h-3 w-3 mr-1' /> {t('actions.removeItem')}
                        </Button>
                      )}
                    </div>

                    {/* First Row: Description and Type */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                      {/* Description */}
                      <div className="md:col-span-2">
                        <Label htmlFor={`description-${index}`} className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {t('fields.itemDescription')} *
                        </Label>
                        <Input
                          id={`description-${index}`}
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder={t('placeholders.enterItemDescription')}
                          className={`mt-1 h-9 ${(formik.touched.items as any)?.[index]?.description && (formik.errors.items as any)?.[index]?.description ? 'border-red-500' : ''}`}
                        />
                        {(formik.touched.items as any)?.[index]?.description && (formik.errors.items as any)?.[index]?.description && (
                          <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.description as string}</p>
                        )}
                      </div>

                      {/* Type */}
                      <div>
                        <Label htmlFor={`type-${index}`} className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {t('fields.itemType')} *
                        </Label>
                        <Select
                          value={item.type}
                          onValueChange={(value) => updateItem(index, 'type', value)}
                        >
                          <SelectTrigger className="mt-1 h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="length_width">{t('itemTypes.lengthWidth')}</SelectItem>
                            <SelectItem value="total_size">{t('itemTypes.totalSize')}</SelectItem>
                            <SelectItem value="quantity_only">{t('itemTypes.quantityOnly')}</SelectItem>
                            <SelectItem value="fixed_amount">{t('itemTypes.fixedAmount')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Second Row: Conditional fields based on type */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">

                        {/* Conditional Fields based on Type */}
                        {item.type === 'length_width' && (
                          <>
                            <div>
                              <Label htmlFor={`length-${index}`} className="text-sm font-medium text-slate-600">
                                {t('fields.length')} *
                              </Label>
                              <Input 
                                id={`length-${index}`}
                                type="number" 
                                value={item.length || ''} 
                                onChange={(e) => updateItem(index, 'length', parseFloat(e.target.value) || 0)}
                                placeholder={t('placeholders.enterLength')}
                                className={`mt-1 ${(formik.touched.items as any)?.[index]?.length && (formik.errors.items as any)?.[index]?.length ? 'border-red-500' : ''}`}
                              />
                              {(formik.touched.items as any)?.[index]?.length && (formik.errors.items as any)?.[index]?.length && (
                                <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.length as string}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`width-${index}`} className="text-sm font-medium text-slate-600">
                                {t('fields.width')} *
                              </Label>
                              <Input 
                                id={`width-${index}`}
                                type="number" 
                                value={item.width || ''} 
                                onChange={(e) => updateItem(index, 'width', parseFloat(e.target.value) || 0)}
                                placeholder={t('placeholders.enterWidth')}
                                className={`mt-1 ${(formik.touched.items as any)?.[index]?.width && (formik.errors.items as any)?.[index]?.width ? 'border-red-500' : ''}`}
                              />
                              {(formik.touched.items as any)?.[index]?.width && (formik.errors.items as any)?.[index]?.width && (
                                <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.width as string}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`totalSize-${index}`} className="text-sm font-medium text-slate-600">
                                {t('fields.totalSize')} (sq.ft) *
                              </Label>
                              <Input 
                                id={`totalSize-${index}`}
                                type="number" 
                                value={item.totalSize || ''} 
                                onChange={(e) => updateItem(index, 'totalSize', parseFloat(e.target.value) || 0)}
                                placeholder={t('placeholders.enterTotalSize')}
                                step="0.01"
                                className={`mt-1 ${(formik.touched.items as any)?.[index]?.totalSize && (formik.errors.items as any)?.[index]?.totalSize ? 'border-red-500' : ''}`}
                              />
                              {(formik.touched.items as any)?.[index]?.totalSize && (formik.errors.items as any)?.[index]?.totalSize && (
                                <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.totalSize as string}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`quantity-${index}`} className="text-sm font-medium text-slate-600">
                                {t('fields.quantity')} *
                              </Label>
                              <Input 
                                id={`quantity-${index}`}
                                type="number" 
                                value={item.quantity || ''} 
                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                placeholder={t('placeholders.enterQuantity')}
                                min="1"
                                className={`mt-1 ${(formik.touched.items as any)?.[index]?.quantity && (formik.errors.items as any)?.[index]?.quantity ? 'border-red-500' : ''}`}
                              />
                              {(formik.touched.items as any)?.[index]?.quantity && (formik.errors.items as any)?.[index]?.quantity && (
                                <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.quantity as string}</p>
                              )}
                            </div>
                          </>
                        )}

                        {item.type === 'total_size' && (
                          <div>
                            <Label htmlFor={`totalSize-${index}`} className="text-sm font-medium text-slate-600">
                              {t('fields.totalSize')} *
                            </Label>
                            <Input 
                              id={`totalSize-${index}`}
                              type="number" 
                              value={item.totalSize || ''} 
                              onChange={(e) => updateItem(index, 'totalSize', parseFloat(e.target.value) || 0)}
                              placeholder={t('placeholders.enterTotalSize')}
                              className={`mt-1 ${(formik.touched.items as any)?.[index]?.totalSize && (formik.errors.items as any)?.[index]?.totalSize ? 'border-red-500' : ''}`}
                            />
                            {(formik.touched.items as any)?.[index]?.totalSize && (formik.errors.items as any)?.[index]?.totalSize && (
                              <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.totalSize as string}</p>
                            )}
                          </div>
                        )}

                        {item.type === 'quantity_only' && (
                          <div>
                            <Label htmlFor={`quantity-${index}`} className="text-sm font-medium text-slate-600">
                              {t('fields.quantity')} *
                            </Label>
                            <Input 
                              id={`quantity-${index}`}
                              type="number" 
                              value={item.quantity || ''} 
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                              placeholder={t('placeholders.enterQuantity')}
                              min="1"
                              className={`mt-1 ${(formik.touched.items as any)?.[index]?.quantity && (formik.errors.items as any)?.[index]?.quantity ? 'border-red-500' : ''}`}
                            />
                            {(formik.touched.items as any)?.[index]?.quantity && (formik.errors.items as any)?.[index]?.quantity && (
                              <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.quantity as string}</p>
                            )}
                          </div>
                        )}

                        {item.type === 'fixed_amount' && (
                          <div>
                            <Label htmlFor={`fixedAmount-${index}`} className="text-sm font-medium text-slate-600">
                              {t('fields.fixedAmount')} *
                            </Label>
                            <Input 
                              id={`fixedAmount-${index}`}
                              type="number" 
                              value={item.fixedAmount || ''} 
                              onChange={(e) => updateItem(index, 'fixedAmount', parseFloat(e.target.value) || 0)}
                              placeholder={t('placeholders.enterFixedAmount')}
                              step="0.01"
                              className={`mt-1 ${(formik.touched.items as any)?.[index]?.fixedAmount && (formik.errors.items as any)?.[index]?.fixedAmount ? 'border-red-500' : ''}`}
                            />
                            {(formik.touched.items as any)?.[index]?.fixedAmount && (formik.errors.items as any)?.[index]?.fixedAmount && (
                              <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.fixedAmount as string}</p>
                            )}
                          </div>
                        )}

                        {/* Unit Price - for all types except fixed_amount */}
                        {item.type !== 'fixed_amount' && (
                          <div>
                            <Label htmlFor={`unitPrice-${index}`} className="text-sm font-medium text-slate-600">
                              {t('fields.unitPrice')} *
                            </Label>
                          <Input 
                              id={`unitPrice-${index}`}
                            type="number" 
                              value={item.unitPrice || ''} 
                              onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                              placeholder={t('placeholders.enterUnitPrice')}
                              step="0.01"
                              className={`mt-1 ${(formik.touched.items as any)?.[index]?.unitPrice && (formik.errors.items as any)?.[index]?.unitPrice ? 'border-red-500' : ''}`}
                            />
                            {(formik.touched.items as any)?.[index]?.unitPrice && (formik.errors.items as any)?.[index]?.unitPrice && (
                              <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.unitPrice as string}</p>
                            )}
                          </div>
                        )}

                      {/* Total - calculated and read-only */}
                      <div>
                        <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {t('fields.total')}
                        </Label>
                        <div className="mt-1 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-md text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          PKR {item.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardContent className="p-5">
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <File className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  {t('sections.attachments')}
                </h2>
                <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors">
                  <Upload className="h-4 w-4 text-secondary" /> {t('actions.uploadFiles')}
                </label>

                {/* Pending Files */}
                {pendingFiles.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('messages.pendingUpload')} ({pendingFiles.length})</h3>
                    <div className="space-y-2">
                      {pendingFiles.map((file, i) => (
                        <div key={i} className="flex justify-between items-center border p-2 rounded-md bg-blue-50">
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{file.name}</span>
                            <Badge variant="secondary" className="text-xs">Pending</Badge>
                          </div>
                          <Button type="button" size="icon" variant="ghost" onClick={() => removePendingFile(i)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Existing Attachments */}
                {attachments.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('messages.existingAttachments')} ({attachments.length})</h3>
                    <div className="space-y-2">
                      {attachments.map((file, i) => (
                        <div key={i} className="flex justify-between items-center border p-2 rounded-md">
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4" />
                            <span className="text-sm">{file.name}</span>
                            <Badge variant="outline" className="text-xs">{file.type}</Badge>
                          </div>
                          <Button type="button" size="icon" variant="ghost" onClick={() => removeAttachment(i)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No files message */}
                {attachments.length === 0 && pendingFiles.length === 0 && (
                  <div className="mt-4 text-center text-sm text-muted-foreground py-4">
                    {t('messages.noFilesAttached')}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardContent className="p-5">
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-md">
                    <Calculator className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  {t('sections.financialSummary')}
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-600 dark:text-slate-400">{t('fields.subtotal')}:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">PKR {formik.values.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-600 dark:text-slate-400">{t('fields.taxAmount')}:</span>
                    <Input 
                      type="number" 
                      value={formik.values.taxAmount} 
                      onChange={(e) => formik.setFieldValue('taxAmount', parseFloat(e.target.value) || 0)} 
                      className="w-24 h-8 text-right text-xs" 
                      step="0.01"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-600 dark:text-slate-400">{t('fields.discountAmount')}:</span>
                    <Input 
                      type="number" 
                      value={formik.values.discountAmount} 
                      onChange={(e) => formik.setFieldValue('discountAmount', parseFloat(e.target.value) || 0)} 
                      className="w-24 h-8 text-right text-xs" 
                      step="0.01"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-600 dark:text-slate-400">{t('fields.advanceAmount')}:</span>
                    <Input 
                      type="number" 
                      value={formik.values.advanceAmount || 0} 
                      onChange={(e) => formik.setFieldValue('advanceAmount', parseFloat(e.target.value) || 0)} 
                      className="w-24 h-8 text-right text-xs" 
                      step="0.01"
                    />
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
                    <div className="flex justify-between items-center text-base font-bold text-emerald-700 dark:text-emerald-400">
                      <span>{t('fields.totalAmount')}:</span>
                      <span>PKR {formik.values.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Terms & Notes */}
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardContent className="p-5">
              <h2 className="text-base font-semibold mb-3 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                  <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                {t('sections.termsNotes')}
              </h2>
              <Label className="text-xs text-slate-600 dark:text-slate-400">{t('fields.terms')}</Label>
              <Textarea rows={3} {...formik.getFieldProps('terms')} className="mt-1" />
              <Label className="mt-3 text-xs text-slate-600 dark:text-slate-400">{t('fields.notes')}</Label>
              <Textarea rows={3} {...formik.getFieldProps('notes')} className="mt-1" />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-200/60 dark:border-slate-700/60 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800">
              {t('actions.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:opacity-50">
              {isSubmitting ? t('actions.saving') : (<><Save className="h-4 w-4 mr-2" /> {invoice ? t('actions.update') : t('actions.create')} <ArrowRight className="h-4 w-4 ml-2" /></>)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
