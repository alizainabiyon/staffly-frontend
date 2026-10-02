import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useAppDispatch } from '@/lib/hooks';
import { vendorValidationSchema, VendorFormValues } from '@/lib/validation/vendorFormValidation';
import { Vendor } from '@/lib/types';
import { toast } from 'sonner';

interface UseVendorFormProps {
  vendor?: Vendor | null;
  onSubmit: (vendor: Omit<Vendor, '_id' | 'vendorId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'userID'>) => void;
  onClose: () => void;
}

export const useVendorForm = ({ vendor, onSubmit, onClose }: UseVendorFormProps) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<VendorFormValues>({
    initialValues: {
      name: vendor?.name || '',
      companyName: vendor?.companyName || '',
      type: vendor?.type || 'individual',
      category: vendor?.category || '',
      email: vendor?.email || '',
      phone: vendor?.phone || '',
      alternatePhone: vendor?.alternatePhone || '',
      website: vendor?.website || '',
      address: vendor?.address || '',
      city: vendor?.city || '',
      country: vendor?.country || 'Pakistan',
      postalCode: vendor?.postalCode || '',
      status: vendor?.status || 'active',
    },
    validationSchema: vendorValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        // Prepare vendor data
        const vendorData: Omit<Vendor, '_id' | 'vendorId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'userID'> = {
          ...values,
          alternatePhone: values.alternatePhone || '',
          website: values.website || '',
        };

        // Let the parent component handle the API call
        // Just pass the data to onSubmit
        await onSubmit(vendorData);
        
        // Only close and reset after successful submission
        onClose();
        formik.resetForm();
      } catch (error: any) {
        // If there's an error, don't close the form
        toast.error(error.message || 'Failed to save vendor');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const resetForm = () => {
    formik.resetForm();
  };

  return {
    formik,
    isSubmitting,
    resetForm,
  };
};