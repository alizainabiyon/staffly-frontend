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
import { Quotation } from '@/lib/types';
import { quotationFormValidationSchema } from '@/lib/validation/quotationFormValidation';
import { useQuotationForm } from '@/hooks/useQuotationForm';
import { fetchCustomers } from '@/lib/store/slices/crmSlice';
import { RootState } from '@/lib/store/store';
import { fetchProfile } from '@/lib/store/slices/profileSlice';
import { useAppSelector } from '@/lib/hooks';

interface QuotationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (quotation: Omit<Quotation, 'quotationId' | 'createdAt' | 'updatedAt' | '_id'>) => void;
  quotation?: Quotation | null;
}

export function QuotationForm({ open, onOpenChange, onSubmit, quotation }: QuotationFormProps) {
  const dispatch = useDispatch();
  const { profile } = useAppSelector((state: any) => state.profile);
  const { customers } = useSelector((state: RootState) => ({
    customers: state.crm.customers,
  }));
``
  useEffect(() => {
    dispatch(fetchProfile() as any);
  }, [dispatch]);

  useEffect(() => {
    if (open) dispatch(fetchCustomers() as any);
  }, [open, dispatch]);

  const { formik, isSubmitting, attachments, pendingFiles, addItem, removeItem, updateItem, handleFileUpload, removeAttachment, removePendingFile, calculateItemTotal } =
    useQuotationForm({ quotation, onSubmit, onClose: () => onOpenChange(false) });

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
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto border-slate-200/60 dark:border-slate-700/60">
        <DialogHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
          <DialogTitle className="flex items-center gap-2 text-xl text-slate-800 dark:text-slate-100">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
              <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            {quotation ? 'Edit Quotation' : 'Create Quotation'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Header Section */}
          <Card className="border border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                {/* Company Info */}
                <div className="flex items-start gap-4">
                  {profile?.companyLogoUrl ? (
                    <img
                      src={profile.companyLogoUrl}
                      alt="Company Logo"
                      className="w-16 h-16 rounded-lg object-cover bg-white"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                      <Building className="h-8 w-8 text-primary-foreground" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold">{profile?.companyName}</h2>
                    <p className="text-sm text-muted-foreground">{profile?.companyAddress}</p>
                    <p className="text-sm text-muted-foreground">{profile?.companyEmail}</p>
                    <p className="text-sm text-muted-foreground">{profile?.companyPhone}</p>
                  </div>
                </div>

                {/* Quotation Details */}
                <div className="text-right space-y-1.5">
                  <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">QUOTATION</h1>
                  <p className="text-xs text-slate-700 dark:text-slate-300"><span className="font-semibold">Date:</span> {new Date().toLocaleDateString()}</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300"><span className="font-semibold">Quote #:</span> {quotation ? quotation.quotationNumber : 'Auto-generated'}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mt-5 grid grid-cols-2 gap-5 border-t border-slate-200/60 dark:border-slate-700/60 pt-4">
                <div>
                  <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Bill To:</h3>
                  <Select
                    value={formik.values.customerId}
                    onValueChange={(value) => formik.setFieldValue('customerId', value)}
                  >
                    <SelectTrigger className={`h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 ${formik.touched.customerId && formik.errors.customerId ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select customer" />
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
                    <p className="text-xs text-red-500 mt-1">{formik.errors.customerId}</p>
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Valid Until:</h3>
                  <Input type="date" className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500" />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="description" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Description</Label>
                <Textarea
                  id="description"
                  {...formik.getFieldProps('description')}
                  placeholder="Enter quotation description..."
                  rows={2}
                  className={`mt-1.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs ${formik.touched.description && formik.errors.description ? 'border-red-500' : ''}`}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-xs text-red-500 mt-1">{formik.errors.description}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quotation Items */}
          <Card className="border border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
            <CardContent className="p-0">
              <div className="flex justify-between items-center px-5 py-3 border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20">
                <h2 className="text-base font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                    <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  Quotation Items
                </h2>
                <Button type="button" onClick={addItem} variant="outline" size="sm" className="bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                    {formik.values.items.map((item, index) => (
                  <div key={index} className="border border-slate-200/60 dark:border-slate-700/60 rounded-lg p-3 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                          {index + 1}
                        </div>
                        <h3 className="text-xs font-medium text-slate-800 dark:text-slate-200">Item {index + 1}</h3>
                      </div>
                      {formik.values.items.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(index)}
                          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 h-6 px-2"
                        >
                          <X className="h-3 w-3 mr-1" /> Remove
                        </Button>
                      )}
                    </div>

                    {/* First Row: Description and Type */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      {/* Description */}
                      <div className="md:col-span-2">
                        <Label htmlFor={`description-${index}`} className="text-sm font-medium text-slate-600">
                          Description *
                        </Label>
                        <Input
                          id={`description-${index}`}
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Enter item description"
                          className={`mt-1 ${formik.touched.items?.[index]?.description && (formik.errors.items as any)?.[index]?.description ? 'border-red-500' : ''}`}
                        />
                        {formik.touched.items?.[index]?.description && (formik.errors.items as any)?.[index]?.description && (
                          <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.description}</p>
                        )}
                      </div>

                      {/* Type */}
                      <div>
                        <Label htmlFor={`type-${index}`} className="text-sm font-medium text-slate-600">
                          Type *
                        </Label>
                        <Select
                          value={item.type}
                          onValueChange={(value) => updateItem(index, 'type', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="length_width">Length × Width</SelectItem>
                            <SelectItem value="total_size">Total Size</SelectItem>
                            <SelectItem value="quantity_only">Quantity Only</SelectItem>
                            <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
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
                                Length *
                              </Label>
                              <Input 
                                id={`length-${index}`}
                                type="number" 
                                value={item.length || ''} 
                                onChange={(e) => updateItem(index, 'length', parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className={`mt-1 ${formik.touched.items?.[index]?.length && (formik.errors.items as any)?.[index]?.length ? 'border-red-500' : ''}`}
                              />
                              {formik.touched.items?.[index]?.length && (formik.errors.items as any)?.[index]?.length && (
                                <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.length}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`width-${index}`} className="text-sm font-medium text-slate-600">
                                Width *
                              </Label>
                              <Input 
                                id={`width-${index}`}
                                type="number" 
                                value={item.width || ''} 
                                onChange={(e) => updateItem(index, 'width', parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className={`mt-1 ${formik.touched.items?.[index]?.width && (formik.errors.items as any)?.[index]?.width ? 'border-red-500' : ''}`}
                              />
                              {formik.touched.items?.[index]?.width && (formik.errors.items as any)?.[index]?.width && (
                                <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.width}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`totalSize-${index}`} className="text-sm font-medium text-slate-600">
                                Size (sq.ft) *
                              </Label>
                              <Input 
                                id={`totalSize-${index}`}
                                type="number" 
                                value={item.totalSize || ''} 
                                onChange={(e) => updateItem(index, 'totalSize', parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                step="0.01"
                                className={`mt-1 ${formik.touched.items?.[index]?.totalSize && (formik.errors.items as any)?.[index]?.totalSize ? 'border-red-500' : ''}`}
                              />
                              {formik.touched.items?.[index]?.totalSize && (formik.errors.items as any)?.[index]?.totalSize && (
                                <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.totalSize}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`quantity-${index}`} className="text-sm font-medium text-slate-600">
                                Quantity *
                              </Label>
                              <Input 
                                id={`quantity-${index}`}
                                type="number" 
                                value={item.quantity || ''} 
                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                placeholder="1"
                                min="1"
                                className={`mt-1 ${formik.touched.items?.[index]?.quantity && (formik.errors.items as any)?.[index]?.quantity ? 'border-red-500' : ''}`}
                              />
                              {formik.touched.items?.[index]?.quantity && (formik.errors.items as any)?.[index]?.quantity && (
                                <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.quantity}</p>
                              )}
                            </div>
                          </>
                        )}

                        {item.type === 'total_size' && (
                          <div>
                            <Label htmlFor={`totalSize-${index}`} className="text-sm font-medium text-slate-600">
                              Total Size *
                            </Label>
                            <Input 
                              id={`totalSize-${index}`}
                              type="number" 
                              value={item.totalSize || ''} 
                              onChange={(e) => updateItem(index, 'totalSize', parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className={`mt-1 ${formik.touched.items?.[index]?.totalSize && (formik.errors.items as any)?.[index]?.totalSize ? 'border-red-500' : ''}`}
                            />
                            {formik.touched.items?.[index]?.totalSize && (formik.errors.items as any)?.[index]?.totalSize && (
                              <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.totalSize}</p>
                            )}
                          </div>
                        )}

                        {item.type === 'quantity_only' && (
                          <div>
                            <Label htmlFor={`quantity-${index}`} className="text-sm font-medium text-slate-600">
                              Quantity *
                            </Label>
                            <Input 
                              id={`quantity-${index}`}
                              type="number" 
                              value={item.quantity || ''} 
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                              placeholder="1"
                              min="1"
                              className={`mt-1 ${formik.touched.items?.[index]?.quantity && (formik.errors.items as any)?.[index]?.quantity ? 'border-red-500' : ''}`}
                            />
                            {formik.touched.items?.[index]?.quantity && (formik.errors.items as any)?.[index]?.quantity && (
                              <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.quantity}</p>
                            )}
                          </div>
                        )}

                        {item.type === 'fixed_amount' && (
                          <div>
                            <Label htmlFor={`fixedAmount-${index}`} className="text-sm font-medium text-slate-600">
                              Fixed Amount *
                            </Label>
                            <Input 
                              id={`fixedAmount-${index}`}
                              type="number" 
                              value={item.fixedAmount || ''} 
                              onChange={(e) => updateItem(index, 'fixedAmount', parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                              step="0.01"
                              className={`mt-1 ${formik.touched.items?.[index]?.fixedAmount && (formik.errors.items as any)?.[index]?.fixedAmount ? 'border-red-500' : ''}`}
                            />
                            {formik.touched.items?.[index]?.fixedAmount && (formik.errors.items as any)?.[index]?.fixedAmount && (
                              <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.fixedAmount}</p>
                            )}
                          </div>
                        )}

                        {/* Unit Price - for all types except fixed_amount */}
                        {item.type !== 'fixed_amount' && (
                          <div>
                            <Label htmlFor={`unitPrice-${index}`} className="text-sm font-medium text-slate-600">
                              Unit Price *
                            </Label>
                          <Input 
                              id={`unitPrice-${index}`}
                            type="number" 
                              value={item.unitPrice || ''} 
                              onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                              step="0.01"
                              className={`mt-1 ${formik.touched.items?.[index]?.unitPrice && (formik.errors.items as any)?.[index]?.unitPrice ? 'border-red-500' : ''}`}
                            />
                            {formik.touched.items?.[index]?.unitPrice && (formik.errors.items as any)?.[index]?.unitPrice && (
                              <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.unitPrice}</p>
                            )}
                          </div>
                        )}

                      {/* Total - calculated and read-only */}
                      <div>
                        <Label className="text-sm font-medium text-slate-600">
                          Total
                        </Label>
                        <div className="mt-1 px-3 py-2 bg-primary/10 border border-primary/20 rounded-md text-sm font-semibold text-primary">
                          {formik.values.currency} {item.total.toFixed(2)}
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
          <Card className="border border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <div className="p-1 bg-orange-100 dark:bg-orange-900/30 rounded-md">
                  <File className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                Attachments
              </h2>
              <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors">
                <Upload className="h-4 w-4 text-secondary" /> Upload Files
              </label>
              
              {/* Pending Files */}
              {pendingFiles.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Pending Upload ({pendingFiles.length})</h3>
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
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Existing Attachments ({attachments.length})</h3>
                  <div className="space-y-2">
                    {attachments.map((attachment, i) => (
                      <div key={i} className="flex justify-between items-center border p-2 rounded-md">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4" />
                          <span className="text-sm">{attachment.name}</span>
                          <Badge variant="outline" className="text-xs">{attachment.type}</Badge>
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
                    No files attached. Click &quot;Upload Files&quot; to add attachments.
                  </div>
                )}
            </CardContent>
          </Card>

            <Card className="border border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
              <CardContent className="p-5">
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-md">
                    <Calculator className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  Financial Summary
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Sub Total:</span>
                    <span className="text-slate-900 dark:text-slate-100 font-medium">{formik.values.currency} {formik.values.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Tax:</span>
                    <Input type="number" value={formik.values.taxAmount} onChange={(e) => formik.setFieldValue('taxAmount', parseFloat(e.target.value) || 0)} className="w-28 text-right h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Discount:</span>
                    <Input type="number" value={formik.values.discountAmount} onChange={(e) => formik.setFieldValue('discountAmount', parseFloat(e.target.value) || 0)} className="w-28 text-right h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold border-t border-slate-200 dark:border-slate-700 pt-2 text-emerald-700 dark:text-emerald-400">
                    <span>Total:</span>
                    <span>{formik.values.currency} {formik.values.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Terms & Notes */}
          <Card className="border border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
              <CardContent className="p-5 space-y-4">
                <div>
                  <h2 className="text-sm font-semibold mb-2 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                      <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    Terms & Notes
                  </h2>
                </div>
                <div>
                  <Label className="text-xs text-slate-600 dark:text-slate-400">Terms & Conditions</Label>
                  <Textarea rows={2} {...formik.getFieldProps('terms')} className="mt-1.5 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500" />
                </div>
                <div>
                  <Label className="text-xs text-slate-600 dark:text-slate-400">Special Notes</Label>
                  <Textarea rows={2} {...formik.getFieldProps('notes')} className="mt-1.5 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500" />
                </div>
              </CardContent>
            </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:opacity-50">
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {quotation ? 'Update Quotation' : 'Create Quotation'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
