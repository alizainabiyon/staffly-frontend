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
import { VendorOrder } from '@/lib/types';
import { useVendorOrderForm } from '@/hooks/useVendorOrderForm';
import { fetchVendors } from '@/lib/store/slices/vendorSlice';
import { RootState } from '@/lib/store/store';

interface VendorOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (vendorOrder: Omit<VendorOrder, 'orderId' | 'createdAt' | 'updatedAt' | '_id'>) => void;
  vendorOrder?: VendorOrder | null;
}

export function VendorOrderForm({ open, onOpenChange, onSubmit, vendorOrder }: VendorOrderFormProps) {
  const dispatch = useDispatch();
  const { vendors } = useSelector((state: RootState) => ({
    vendors: state.vendor.vendors,
  }));

  useEffect(() => {
    if (open) dispatch(fetchVendors() as any);
  }, [open, dispatch]);

  const {
    formik,
    isSubmitting,
    addItem,
    removeItem,
    updateItem,
    calculateTotals,
  } = useVendorOrderForm({
    vendorOrder,
    onSubmit,
    onClose: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto border-slate-200/60 dark:border-slate-700/60">
        <DialogHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
          <DialogTitle className="flex items-center gap-2 text-xl text-slate-800 dark:text-slate-100">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
              <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            {vendorOrder ? 'Edit Vendor Order' : 'Create Vendor Order'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Header Section */}
          <Card className="border border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                {/* Company Info */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-emerald-600 dark:bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">STAFFLY</h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">123 Business Ave</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">info@staffly.com</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">+1 234 567 890</p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="text-right space-y-1.5">
                  <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">VENDOR ORDER</h1>
                  <p className="text-xs text-slate-700 dark:text-slate-300"><span className="font-semibold">Date:</span> {new Date().toLocaleDateString()}</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300"><span className="font-semibold">Order #:</span> {vendorOrder ? vendorOrder.orderNumber : 'Auto-generated'}</p>
                </div>
              </div>

              {/* Vendor Info */}
              <div className="mt-5 border-t border-slate-200/60 dark:border-slate-700/60 pt-4">
                <div>
                  <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Order To:</h3>
                  <Select
                    value={formik.values.vendorId}
                    onValueChange={(value) => formik.setFieldValue('vendorId', value)}
                  >
                    <SelectTrigger className={`h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 ${formik.touched.vendorId && formik.errors.vendorId ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor: any) => (
                        <SelectItem key={vendor.vendorId} value={vendor.vendorId}>
                          {vendor.companyName} - {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.touched.vendorId && formik.errors.vendorId && (
                    <p className="text-xs text-red-500 mt-1">{formik.errors.vendorId}</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="description" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Description</Label>
                <Textarea
                  id="description"
                  {...formik.getFieldProps('description')}
                  placeholder="Enter vendor order description..."
                  rows={2}
                  className={`mt-1.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs ${formik.touched.description && formik.errors.description ? 'border-red-500' : ''}`}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-xs text-red-500 mt-1">{formik.errors.description}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="border border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
            <CardContent className="p-0">
              <div className="flex justify-between items-center px-5 py-3 border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20">
                <h2 className="text-base font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                    <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  Order Items
                </h2>
                <Button type="button" onClick={addItem} variant="outline" size="sm" className="bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-center">#</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Width</TableHead>
                      <TableHead className="text-center">Height</TableHead>
                      <TableHead className="text-center">Size Sq.ft</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-center">Unit Price</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formik.values.items.map((item, index) => (
                      <TableRow key={index} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                        <TableCell className="text-center font-semibold">{index + 1}</TableCell>
                        <TableCell>
                          <Input 
                            value={item.description} 
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            className={formik.touched.items?.[index]?.description && (formik.errors.items as any)?.[index]?.description ? 'border-red-500' : ''}
                          />
                          {formik.touched.items?.[index]?.description && (formik.errors.items as any)?.[index]?.description && (
                            <p className="text-xs text-red-500 mt-1">{(formik.errors.items as any)[index]?.description}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            value={item.width} 
                            onChange={(e) => updateItem(index, 'width', parseFloat(e.target.value) || 0)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            value={item.height} 
                            onChange={(e) => updateItem(index, 'height', parseFloat(e.target.value) || 0)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            value={item.size} 
                            onChange={(e) => updateItem(index, 'size', parseFloat(e.target.value) || 0)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            value={item.quantity} 
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            value={item.unitPrice} 
                            onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          />
                        </TableCell>
                        <TableCell className="text-center font-semibold">PKR {item.total.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          {formik.values.items.length > 1 && (
                            <Button type="button" size="icon" variant="ghost" onClick={() => removeItem(index)}>
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                <input type="file" multiple className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-md cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <Upload className="h-4 w-4 text-slate-600 dark:text-slate-400" /> Upload Files
                </label>
                
                {/* No files message */}
                <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400 py-4">
                  No files attached. Click &quot;Upload Files&quot; to add attachments.
                </div>
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
                    <span className="text-slate-900 dark:text-slate-100 font-medium">PKR {formik.values.subtotal.toFixed(2)}</span>
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
                    <span>PKR {formik.values.totalAmount.toFixed(2)}</span>
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
                  {vendorOrder ? 'Update Vendor Order' : 'Create Vendor Order'}
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
