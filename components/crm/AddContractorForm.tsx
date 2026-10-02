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
import { Contractor } from '@/lib/types';
import { fetchContractorById } from '@/lib/store/slices/contractorSlice';
import { RootState, AppDispatch } from '@/lib/store/store';
import { useContractorForm } from '@/hooks/useContractorForm';
import { useTranslations } from 'next-intl';

interface AddContractorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (contractor: Omit<Contractor, '_id' | 'contractorId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'userID'>) => void;
  contractorId?: string | null;
}



export function AddContractorForm({ open, onOpenChange, onSubmit, contractorId }: AddContractorFormProps) {
  const { selectedContractor, loading } = useSelector((state: RootState) => state.contractor);
  const [activeTab, setActiveTab] = useState('basic');
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [newSpecialization, setNewSpecialization] = useState('');
  const t = useTranslations('Contractor.form');

  const dispatch = useDispatch<AppDispatch>();

  // Use the custom hook
  const {
    formik,
    isSubmitting,
    specializations,
    addSpecialization,
    removeSpecialization,
  } = useContractorForm({
    contractor,
    onSubmit,
    onClose: () => onOpenChange(false),
  });



  useEffect(() => {
    if (contractorId) {
      dispatch(fetchContractorById(contractorId));
    }
  }, [contractorId, dispatch]);

  useEffect(() => {
    if (open) {
      if (!contractorId) {
        // Reset form for new contractor
        formik.resetForm();
        setContractor(null);
        setNewSpecialization('');
      }
    } else {
      // Reset form when dialog closes
      formik.resetForm();
      setContractor(null);
      setNewSpecialization('');
    }
  }, [open, contractorId]);

  useEffect(() => {
    if (selectedContractor) {
      setContractor(selectedContractor);
    }
  }, [selectedContractor]);





  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newSpecialization.trim()) {
        addSpecialization(newSpecialization.trim());
        setNewSpecialization('');
      }
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
            {contractorId ? t('editTitle') : t('addTitle')}
          </DialogTitle>
          {contractorId && loading && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('loadingData')}</p>
          )}
        </DialogHeader>

        <form onSubmit={formik.handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <TabsTrigger 
                value="basic"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
              >
                {t('tabs.basicInfo')}
              </TabsTrigger>
              <TabsTrigger 
                value='details'
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
              >
                {t('tabs.businessDetails')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-5">
              <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
                <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                      <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    {t('sections.contractorInformation')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('fields.contractorName')} *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={t('placeholders.enterContractorName')}
                        className={formik.touched.name && formik.errors.name ? 'border-red-500' : ''}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="text-sm text-red-500">{formik.errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyName">{t('fields.companyName')} *</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="companyName"
                          name="companyName"
                          value={formik.values.companyName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder={t('placeholders.companyName')}
                          className={`pl-10 ${formik.touched.companyName && formik.errors.companyName ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {formik.touched.companyName && formik.errors.companyName && (
                        <p className="text-sm text-red-500">{formik.errors.companyName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">{t('fields.contractorType')} *</Label>
                      <Select
                        value={formik.values.type}
                        onValueChange={(value) => formik.setFieldValue('type', value)}
                      >
                        <SelectTrigger className={formik.touched.type && formik.errors.type ? 'border-red-500' : ''}>
                          <SelectValue placeholder={t('placeholders.selectContractorType')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">{t('types.individual')}</SelectItem>
                          <SelectItem value="company">{t('types.business')}</SelectItem>
                        </SelectContent>
                      </Select>
                      {formik.touched.type && formik.errors.type && (
                        <p className="text-sm text-red-500">{formik.errors.type}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        name="category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Contractor category"
                        className={formik.touched.category && formik.errors.category ? 'border-red-500' : ''}
                      />
                      {formik.touched.category && formik.errors.category && (
                        <p className="text-sm text-red-500">{formik.errors.category}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('fields.emailAddress')} *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder={t('placeholders.contractorEmail')}
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
                      <Label htmlFor="alternatePhone">{t('fields.otherContactNo')}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="alternatePhone"
                          name="alternatePhone"
                          value={formik.values.alternatePhone}
                          onChange={formik.handleChange}
                          placeholder={t('placeholders.alternativeContact')}
                          className="pl-10"
                        />
                      </div>
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

            <TabsContent value="details" className="space-y-5">
              <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
                <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                      <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    {t('sections.businessDetails')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">{t('fields.city')} *</Label>
                      <Select
                        value={formik.values.city}
                        onValueChange={(value) => formik.setFieldValue('city', value)}
                      >
                        <SelectTrigger className={formik.touched.city && formik.errors.city ? 'border-red-500' : ''}>
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
                      <Label htmlFor="industry">Industry *</Label>
                      <Input
                        id="industry"
                        name="industry"
                        value={formik.values.industry}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Industry"
                        className={formik.touched.industry && formik.errors.industry ? 'border-red-500' : ''}
                      />
                      {formik.touched.industry && formik.errors.industry && (
                        <p className="text-sm text-red-500">{formik.errors.industry}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('fields.specializations')}</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder={t('placeholders.addSpecialization')}
                          value={newSpecialization}
                          onChange={(e) => setNewSpecialization(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            if (newSpecialization.trim()) {
                              addSpecialization(newSpecialization.trim());
                              setNewSpecialization('');
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {specializations.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {specializations.map((spec, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {spec}
                              <button
                                type="button"
                                onClick={() => removeSpecialization(spec)}
                                className="ml-1 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      {formik.touched.specializations && formik.errors.specializations && (
                        <p className="text-sm text-red-500">{formik.errors.specializations as string}</p>
                      )}
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
                contractorId ? t('actions.update') : t('actions.add')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
