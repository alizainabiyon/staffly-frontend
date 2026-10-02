'use client';

import React, { useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from 'lucide-react';
import { AddEmployeeFormProps } from '@/lib/types/employeeForm';
import { useEmployeeForm } from '@/hooks/useEmployeeForm';
import { BasicInfoSection } from './form-sections/BasicInfoSection';
import { EmploymentSection } from './form-sections/EmploymentSection';
import { EmergencyContactSection } from './form-sections/EmergencyContactSection';
import { ExperienceSection } from './form-sections/ExperienceSection';
import { DocumentsSection } from './form-sections/DocumentsSection';
import { useTranslations } from 'next-intl';

export function AddEmployeeForm({ open, onOpenChange, onSubmit, employee }: AddEmployeeFormProps) {
  const t = useTranslations('Employee.form');
  
  // Memoize the onClose function to prevent infinite re-renders
  const onClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const {
    formik,
    formState,
    isSubmitting,
    handleProfilePicUpload,
    handleFileUpload,
    addDocumentType,
    removeDocument,
    updateDocumentType,
    addEmergencyContact,
    removeEmergencyContact,
    updateEmergencyContact,
    addExperience,
    removeExperience,
    updateExperience,
    generateEmployeeId,
    setActiveTab,
  } = useEmployeeForm({
    employee,
    onSubmit,
    onClose,
  });

  // Reset form when dialog is closed
  React.useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]); // Removed formik from dependencies to prevent infinite loop

  // Handle form submission with validation
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formik.isValid) {
      // Touch all fields to show validation errors
      const touchedFields: any = {};
      Object.keys(formik.values).forEach(key => {
        touchedFields[key] = true;
      });
      formik.setTouched(touchedFields);
      return;
    }
    
    try {
      await formik.handleSubmit(e);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900">
        <DialogHeader className="border-b border-slate-200/60 dark:border-slate-700/60 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl text-slate-800 dark:text-slate-100">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            {employee ? t('editTitle') : t('addTitle')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="mt-4">
          <Tabs value={formState.activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <TabsTrigger 
                value="basic"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
              >
                {t('tabs.basicInfo')}
              </TabsTrigger>
              <TabsTrigger 
                value="employment"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
              >
                {t('tabs.employment')}
              </TabsTrigger>
              <TabsTrigger 
                value="emergency"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
              >
                {t('tabs.emergency')}
              </TabsTrigger>
              <TabsTrigger 
                value="experience"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
              >
                {t('tabs.experience')}
              </TabsTrigger>
              <TabsTrigger 
                value="documents"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
              >
                {t('tabs.documents')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-5 mt-4">
              <BasicInfoSection
                formik={formik}
                profilePicPreview={formState.profilePicPreview}
                onProfilePicUpload={handleProfilePicUpload}
              />
            </TabsContent>

            <TabsContent value="employment" className="space-y-5 mt-4">
              <EmploymentSection
                formik={formik}
                onGenerateEmployeeId={generateEmployeeId}
              />
            </TabsContent>

            <TabsContent value="emergency" className="space-y-5 mt-4">
              <EmergencyContactSection
                emergencyContacts={formState.emergencyContacts}
                onAddContact={addEmergencyContact}
                onRemoveContact={removeEmergencyContact}
                onUpdateContact={updateEmergencyContact}
              />
            </TabsContent>

            <TabsContent value="experience" className="space-y-5 mt-4">
              <ExperienceSection
                experiences={formState.experiences}
                onAddExperience={addExperience}
                onRemoveExperience={removeExperience}
                onUpdateExperience={updateExperience}
              />
            </TabsContent>

            <TabsContent value="documents" className="space-y-5 mt-4">
              <DocumentsSection
                documents={formState.documents}
                onAddDocument={addDocumentType}
                onRemoveDocument={removeDocument}
                onFileUpload={(index, file) => handleFileUpload(file, formState.documents[index]?.type)}
                onDocumentTypeChange={updateDocumentType}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t('actions.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={formik.isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? t('actions.saving') : (employee ? t('actions.update') : t('actions.add'))}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 