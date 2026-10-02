'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { Customer } from '@/lib/types';
import { useCustomerForm } from '@/hooks/useCustomerForm';
import { fetchCustomerById } from '@/lib/store/slices/crmSlice';
import { RootState, AppDispatch } from '@/lib/store/store';
import { useTranslations } from 'next-intl';

interface AddCustomerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (customer: Omit<Customer, 'customerId' | 'createdAt' | 'updatedAt'>) => void;
  customerId?: string | null;
}


export function AddCustomerForm({ open, onOpenChange, onSubmit, customerId }: AddCustomerFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCustomer, loading } = useSelector((state: RootState) => state.crm);
  const [activeTab, setActiveTab] = useState('basic');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [tags, setTags] = useState<string[]>(customer?.tags || []);
  const [newTag, setNewTag] = useState('');
  const t = useTranslations('CRM.form');

  useEffect(() => {
    if (customerId) {
      dispatch(fetchCustomerById(customerId));
    }
  }, [customerId, dispatch]);

  useEffect(() => {
    if (open) {
      if (!customerId) {
        // Add Customer case → reset fields
        formik.resetForm();
        setCustomer(null);
        setTags([]);
      }
    }
  }, [open, customerId]);

  useEffect(() => {
    if (selectedCustomer) {
      setCustomer(selectedCustomer);
      setTags(selectedCustomer.tags || []);
    }
  }, [selectedCustomer]);

  const { formik, isSubmitting } = useCustomerForm({
    customer,
    onSubmit: async (customerData) => {
      try {
        // Add tags to the customer data before passing to parent
        const customerDataWithTags = {
          ...customerData,
          tags,
        };
        
        // Call parent's onSubmit (which handles the API call)
        await onSubmit(customerDataWithTags);
        
        // Only close and reset after successful submission
        onOpenChange(false);
        setTags([]);
        formik.resetForm();
      } catch (error) {
        // If there's an error, don't close the form
        console.error('Error submitting customer:', error);
      }
    },
    onClose: () => onOpenChange(false),
  });

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-slate-200/60 dark:border-slate-700/60">
        <DialogHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
          <DialogTitle className="flex items-center gap-2 text-xl text-slate-800 dark:text-slate-100">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
              <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            {customerId ? t('editTitle') : t('addTitle')}
          </DialogTitle>
          {customerId && loading && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('loadingData')}</p>
          )}
        </DialogHeader>

        <form onSubmit={formik.handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <TabsTrigger 
                value="basic"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
              >
                {t('tabs.basicInfo')}
              </TabsTrigger>
              <TabsTrigger 
                value="business"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
              >
                {t('tabs.businessDetails')}
              </TabsTrigger>
              <TabsTrigger 
                value="financial"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
              >
                {t('tabs.financial')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-5">
              <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
                <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                      <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    {t('sections.customerInformation')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('fields.customerName')} *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={t('placeholders.enterCustomerName')}
                        className={formik.touched.name && formik.errors.name ? 'border-red-500' : ''}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="text-sm text-red-500">{formik.errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerType">{t('fields.customerType')} *</Label>
                      <Select
                        value={formik.values.customerType}
                        onValueChange={(value) => formik.setFieldValue('customerType', value)}
                      >
                        <SelectTrigger className={formik.touched.customerType && formik.errors.customerType ? 'border-red-500' : ''}>
                          <SelectValue placeholder={t('placeholders.selectCustomerType')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">{t('types.individual')}</SelectItem>
                          <SelectItem value="business">{t('types.business')}</SelectItem>
                        </SelectContent>
                      </Select>
                      {formik.touched.customerType && formik.errors.customerType && (
                        <p className="text-sm text-red-500">{formik.errors.customerType}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('fields.emailAddress')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                               <Input
                         id="email"
                         name="email"
                         type="email"
                         value={formik.values.email}
                         onChange={formik.handleChange}
                         onBlur={formik.handleBlur}
                         placeholder={t('placeholders.customerEmail')}
                         className={`pl-10 ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                       />
                      </div>
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-sm text-red-500">{formik.errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('fields.phoneNumber')} *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder={t('placeholders.phoneNumber')}
                          className={`pl-10 ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {formik.touched.phone && formik.errors.phone && (
                        <p className="text-sm text-red-500">{formik.errors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otherContactNo">{t('fields.otherContactNo')}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="otherContactNo"
                          name="otherContactNo"
                          value={formik.values.otherContactNo}
                          onChange={formik.handleChange}
                          placeholder={t('placeholders.alternativeContact')}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">{t('fields.companyName')} *</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="company"
                          name="company"
                          value={formik.values.company}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder={t('placeholders.companyName')}
                          className={`pl-10 ${formik.touched.company && formik.errors.company ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {formik.touched.company && formik.errors.company && (
                        <p className="text-sm text-red-500">{formik.errors.company}</p>
                      )}
                    </div>

                    {formik.values.customerType === 'business' && (
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">{t('fields.contactPerson')} *</Label>
                        <Input
                          id="contactPerson"
                          name="contactPerson"
                          value={formik.values.contactPerson}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder={t('placeholders.contactPersonName')}
                          className={formik.touched.contactPerson && formik.errors.contactPerson ? 'border-red-500' : ''}
                        />
                        {formik.touched.contactPerson && formik.errors.contactPerson && (
                          <p className="text-sm text-red-500">{formik.errors.contactPerson}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">{t('fields.address')} *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Textarea
                        id="address"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={t('placeholders.completeAddress')}
                        className={`pl-10 ${formik.touched.address && formik.errors.address ? 'border-red-500' : ''}`}
                        rows={3}
                      />
                    </div>
                    {formik.touched.address && formik.errors.address && (
                      <p className="text-sm text-red-500">{formik.errors.address}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="business" className="space-y-5">
              <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
                <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                      <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    {t('sections.businessDetails')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">{t('fields.city')}</Label>
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">{t('fields.country')}</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formik.values.country}
                        onChange={formik.handleChange}
                        placeholder={t('placeholders.country')}
                      />
                    </div>
                    

                    <div className="space-y-2">
                      <Label htmlFor="taxNumber">{t('fields.taxNumber')}</Label>
                      <Input
                        id="taxNumber"
                        name="taxNumber"
                        value={formik.values.taxNumber}
                        onChange={formik.handleChange}
                        placeholder={t('placeholders.taxNumber')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">{t('fields.website')}</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="website"
                          name="website"
                          value={formik.values.website}
                          onChange={formik.handleChange}
                          placeholder={t('placeholders.website')}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="officeAddress">{t('fields.officeAddress')}</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Textarea
                        id="officeAddress"
                        name="officeAddress"
                        value={formik.values.officeAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={t('placeholders.officeAddress')}
                        className={`pl-10 ${formik.touched.officeAddress && formik.errors.officeAddress ? 'border-red-500' : ''}`}
                        rows={3}
                      />
                    </div>
                    {formik.touched.officeAddress && formik.errors.officeAddress && (
                      <p className="text-sm text-red-500">{formik.errors.officeAddress}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">{t('fields.notes')}</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formik.values.notes}
                      onChange={formik.handleChange}
                      placeholder={t('placeholders.additionalNotes')}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('fields.tags')}</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder={t('placeholders.addTag')}
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <Button type="button" variant="outline" onClick={addTag}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="space-y-5">
              <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
                <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                    <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md">
                      <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    {t('sections.financialInformation')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contractorId">{t('fields.selectContractor')}</Label>
                      <Select
                        value={formik.values.contractorId}
                        onValueChange={(value) => formik.setFieldValue('contractorId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('placeholders.selectContractor')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem disabled value="123">No Contractor</SelectItem>
                          <SelectItem value="cont_001">ABC Construction Ltd</SelectItem>
                          <SelectItem value="cont_002">XYZ Builders</SelectItem>
                          <SelectItem value="cont_003">Modern Contractors</SelectItem>
                          <SelectItem value="cont_004">Elite Construction</SelectItem>
                          <SelectItem value="cont_005">Premium Builders</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">{t('fields.status')}</Label>
                      <Select
                        value={formik.values.status}
                        onValueChange={(value) => formik.setFieldValue('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">{t('statuses.active')}</SelectItem>
                          <SelectItem value="inactive">{t('statuses.inactive')}</SelectItem>
                          <SelectItem value="blocked">{t('statuses.blocked')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t('actions.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t('actions.saving')}
                </div>
              ) : (
                customerId ? t('actions.update') : t('actions.add')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 