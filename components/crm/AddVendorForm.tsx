'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  Briefcase,
  Tag,
  Plus,
  X
} from 'lucide-react';
import { PAKISTANI_CITIES } from '@/lib/utils/constants';
import { Vendor } from '@/lib/types';
import { fetchVendorById } from '@/lib/store/slices/vendorSlice';
import { RootState, AppDispatch } from '@/lib/store/store';
import { useVendorForm } from '@/hooks/useVendorForm';
import { useTranslations } from 'next-intl';

interface AddVendorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (vendor: Omit<Vendor, '_id' | 'vendorId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'userID'>) => void;
  vendorId?: string | null;
}

export function AddVendorForm({ open, onOpenChange, onSubmit, vendorId }: AddVendorFormProps) {
  const { selectedVendor, loading } = useSelector((state: RootState) => state.vendor);
  const [activeTab, setActiveTab] = useState('basic');
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const t = useTranslations('Vendor.form');

  const dispatch = useDispatch<AppDispatch>();

  // Use the custom hook
  const {
    formik,
    isSubmitting,
    resetForm,
  } = useVendorForm({
    vendor,
    onSubmit,
    onClose: () => onOpenChange(false),
  });

  useEffect(() => {
    if (vendorId) {
      dispatch(fetchVendorById(vendorId));
    }
  }, [vendorId, dispatch]);

  useEffect(() => {
    if (open) {
      if (!vendorId) {
        // Reset form for new vendor
        formik.resetForm();
        setVendor(null);
      }
    } else {
      // Reset form when dialog closes
      formik.resetForm();
      setVendor(null);
    }
  }, [open, vendorId]);

  useEffect(() => {
    if (selectedVendor) {
      setVendor(selectedVendor);
    }
  }, [selectedVendor]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-slate-200/60 dark:border-slate-700/60">
        <DialogHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
          <DialogTitle className="flex items-center gap-2 text-xl text-slate-800 dark:text-slate-100">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
              <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            {vendorId ? t('editTitle') : t('addTitle')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <TabsTrigger 
                value="basic"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
              >
                {t('tabs.basicInfo')}
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
                Address & Status
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('fields.vendorName')} *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('placeholders.enterVendorName')}
                    className={formik.touched.name && formik.errors.name ? 'border-red-500' : ''}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-sm text-red-500">{formik.errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">{t('fields.companyName')} *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formik.values.companyName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('placeholders.companyName')}
                    className={formik.touched.companyName && formik.errors.companyName ? 'border-red-500' : ''}
                  />
                  {formik.touched.companyName && formik.errors.companyName && (
                    <p className="text-sm text-red-500">{formik.errors.companyName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">{t('fields.vendorType')} *</Label>
                  <Select
                    value={formik.values.type}
                    onValueChange={(value) => formik.setFieldValue('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('placeholders.selectVendorType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {t('types.individual')}
                        </div>
                      </SelectItem>
                      <SelectItem value="company">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {t('types.business')}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formik.touched.type && formik.errors.type && (
                    <p className="text-sm text-red-500">{formik.errors.type}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formik.values.category}
                    onValueChange={(value) => formik.setFieldValue('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supplier">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Supplier
                        </div>
                      </SelectItem>
                      <SelectItem value="service_provider">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Service Provider
                        </div>
                      </SelectItem>
                      <SelectItem value="manufacturer">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Manufacturer
                        </div>
                      </SelectItem>
                      <SelectItem value="distributor">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Distributor
                        </div>
                      </SelectItem>
                      <SelectItem value="wholesaler">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Wholesaler
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formik.touched.category && formik.errors.category && (
                    <p className="text-sm text-red-500">{formik.errors.category}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Contact Details Tab */}
            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('fields.emailAddress')} *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('placeholders.vendorEmail')}
                    className={formik.touched.email && formik.errors.email ? 'border-red-500' : ''}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-sm text-red-500">{formik.errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('fields.phoneNumber')} *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('placeholders.phoneNumber')}
                    className={formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-sm text-red-500">{formik.errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alternatePhone">{t('fields.otherContactNo')}</Label>
                  <Input
                    id="alternatePhone"
                    name="alternatePhone"
                    value={formik.values.alternatePhone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('placeholders.alternativeContact')}
                    className={formik.touched.alternatePhone && formik.errors.alternatePhone ? 'border-red-500' : ''}
                  />
                  {formik.touched.alternatePhone && formik.errors.alternatePhone && (
                    <p className="text-sm text-red-500">{formik.errors.alternatePhone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">{t('fields.website')}</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formik.values.website}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('placeholders.website')}
                    className={formik.touched.website && formik.errors.website ? 'border-red-500' : ''}
                  />
                  {formik.touched.website && formik.errors.website && (
                    <p className="text-sm text-red-500">{formik.errors.website}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Address & Status Tab */}
            <TabsContent value="address" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">{t('fields.address')} *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('placeholders.completeAddress')}
                    rows={3}
                    className={formik.touched.address && formik.errors.address ? 'border-red-500' : ''}
                  />
                  {formik.touched.address && formik.errors.address && (
                    <p className="text-sm text-red-500">{formik.errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t('fields.city')} *</Label>
                    <Select
                      value={formik.values.city}
                      onValueChange={(value) => formik.setFieldValue('city', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('placeholders.selectCity')} />
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
                      <p className="text-sm text-red-500">{formik.errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">{t('fields.country')} *</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formik.values.country}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={t('placeholders.country')}
                      className={formik.touched.country && formik.errors.country ? 'border-red-500' : ''}
                    />
                    {formik.touched.country && formik.errors.country && (
                      <p className="text-sm text-red-500">{formik.errors.country}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formik.values.postalCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter postal code"
                      className={formik.touched.postalCode && formik.errors.postalCode ? 'border-red-500' : ''}
                    />
                    {formik.touched.postalCode && formik.errors.postalCode && (
                      <p className="text-sm text-red-500">{formik.errors.postalCode}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">{t('fields.status')} *</Label>
                  <Select
                    value={formik.values.status}
                    onValueChange={(value) => formik.setFieldValue('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('placeholders.selectStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {t('statuses.active')}
                        </div>
                      </SelectItem>
                      <SelectItem value="inactive">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          {t('statuses.inactive')}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formik.touched.status && formik.errors.status && (
                    <p className="text-sm text-red-500">{formik.errors.status}</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
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
                vendorId ? t('actions.update') : t('actions.add')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
