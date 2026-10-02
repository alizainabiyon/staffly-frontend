'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  DollarSign, 
  Tag,
  Plus,
  X
} from 'lucide-react';
import { PAKISTANI_CITIES } from '@/lib/utils/constants';
import { Director } from '@/lib/types/director';
import { useDirectorForm } from '@/hooks/useDirectorForm';
import { fetchDirectorById } from '@/lib/store/slices/directorSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

interface DirectorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (director: Omit<Director, 'directorId' | 'createdAt' | 'updatedAt' | '_id' | 'userID' | 'createdBy' | 'updatedBy'>) => void;
  directorId?: string | null;
}

export function DirectorForm({ open, onOpenChange, onSubmit, directorId }: DirectorFormProps) {
  const dispatch = useAppDispatch();
  const { selectedDirector, loading } = useAppSelector((state) => state.director);
  const [activeTab, setActiveTab] = useState('basic');
  const [director, setDirector] = useState<Director | null>(null);

  useEffect(() => {
    if (directorId) {
      dispatch(fetchDirectorById(directorId));
    }
  }, [directorId, dispatch]);

  useEffect(() => {
    if (open) {
      if (!directorId) {
        // Add Director case → reset fields
        setDirector(null);
      }
    }
  }, [open, directorId]);

  useEffect(() => {
    if (selectedDirector) {
      setDirector(selectedDirector);
    }
  }, [selectedDirector]);

  const { formik, isSubmitting, handleCancel } = useDirectorForm({
    director,
    onSubmit: (directorData) => {
      onSubmit(directorData);
      onOpenChange(false);
    },
    onClose: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-slate-200/60 dark:border-slate-700/60">
        <DialogHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
          <DialogTitle className="flex items-center gap-2 text-xl text-slate-800 dark:text-slate-100">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
              <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            {directorId ? 'Edit Director' : 'Add New Director'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <TabsTrigger 
                value="basic"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
              >
                Basic Information
              </TabsTrigger>
              <TabsTrigger 
                value="contact"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
              >
                Contact Details
              </TabsTrigger>
              <TabsTrigger 
                value="address"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
              >
                Address
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
                <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                      <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name *</Label>
                      <Input
                        id="name"
                        {...formik.getFieldProps('name')}
                        placeholder="Enter full name"
                        className="mt-1.5 h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="text-xs text-red-500 mt-1">{formik.errors.name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="status" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Status *</Label>
                      <Select
                        value={formik.values.status}
                        onValueChange={(value) => formik.setFieldValue('status', value)}
                      >
                        <SelectTrigger className="mt-1.5 h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      {formik.touched.status && formik.errors.status && (
                        <p className="text-xs text-red-500 mt-1">{formik.errors.status}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Details Tab */}
            <TabsContent value="contact" className="space-y-4">
              <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
                <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...formik.getFieldProps('email')}
                        placeholder="Enter email address"
                        className="mt-1.5 h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-xs text-red-500 mt-1">{formik.errors.email}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Phone Number *</Label>
                      <Input
                        id="phone"
                        {...formik.getFieldProps('phone')}
                        placeholder="Enter phone number"
                        className="mt-1.5 h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
                      />
                      {formik.touched.phone && formik.errors.phone && (
                        <p className="text-xs text-red-500 mt-1">{formik.errors.phone}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="alternatePhone" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Alternate Phone</Label>
                    <Input
                      id="alternatePhone"
                      {...formik.getFieldProps('alternatePhone')}
                      placeholder="Enter alternate phone number (optional)"
                      className="mt-1.5 h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
                    />
                    {formik.touched.alternatePhone && formik.errors.alternatePhone && (
                      <p className="text-xs text-red-500 mt-1">{formik.errors.alternatePhone}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address" className="space-y-4">
              <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
                <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                      <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="address" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Street Address *</Label>
                    <Textarea
                      id="address"
                      {...formik.getFieldProps('address')}
                      placeholder="Enter street address"
                      rows={2}
                      className="mt-1.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
                    />
                    {formik.touched.address && formik.errors.address && (
                      <p className="text-xs text-red-500 mt-1">{formik.errors.address}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-xs font-semibold text-slate-600 dark:text-slate-400">City *</Label>
                      <Select
                        value={formik.values.city}
                        onValueChange={(value) => formik.setFieldValue('city', value)}
                      >
                        <SelectTrigger className="mt-1.5 h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAKISTANI_CITIES.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formik.touched.city && formik.errors.city && (
                        <p className="text-xs text-red-500 mt-1">{formik.errors.city}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Country *</Label>
                      <Input
                        id="country"
                        {...formik.getFieldProps('country')}
                        placeholder="Enter country"
                        className="mt-1.5 h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
                      />
                      {formik.touched.country && formik.errors.country && (
                        <p className="text-xs text-red-500 mt-1">{formik.errors.country}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postalCode" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        {...formik.getFieldProps('postalCode')}
                        placeholder="Enter postal code"
                        className="mt-1.5 h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
                      />
                      {formik.touched.postalCode && formik.errors.postalCode && (
                        <p className="text-xs text-red-500 mt-1">{formik.errors.postalCode}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:opacity-50">
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </div>
              ) : (
                directorId ? 'Update Director' : 'Create Director'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
