import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useAppDispatch } from '@/lib/hooks';
import { contractorValidationSchema, ContractorFormValues } from '@/lib/validation/contractorFormValidation';
import { Contractor } from '@/lib/types';
import { toast } from 'sonner';

interface UseContractorFormProps {
  contractor?: Contractor | null;
  onSubmit: (contractor: Omit<Contractor, '_id' | 'contractorId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'userID'>) => void;
  onClose: () => void;
}

export const useContractorForm = ({ contractor, onSubmit, onClose }: UseContractorFormProps) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specializations, setSpecializations] = useState<string[]>(contractor?.specializations || []);

  // Update specializations when contractor changes
  useEffect(() => {
    if (contractor) {
      setSpecializations(contractor.specializations || []);
    }
  }, [contractor]);

  const formik = useFormik<ContractorFormValues>({
    initialValues: {
      name: contractor?.name || '',
      companyName: contractor?.companyName || '',
      type: contractor?.type || 'individual',
      category: contractor?.category || '',
      email: contractor?.email || '',
      phone: contractor?.phone || '',
      alternatePhone: contractor?.alternatePhone || '',
      website: contractor?.website || '',
      address: contractor?.address || '',
      city: contractor?.city || '',
      country: contractor?.country || 'Pakistan',
      industry: contractor?.industry || '',
      specializations: contractor?.specializations || [],
    },
    validationSchema: contractorValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        // Prepare contractor data with specializations and ensure all required fields have values
        const contractorData: Omit<Contractor, '_id' | 'contractorId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'userID'> = {
          ...values,
          specializations,
          alternatePhone: values.alternatePhone || '',
          website: values.website || '',
        };

        console.log('Form values:', values);
        console.log('Contractor data to send:', contractorData);

        // Let the parent component handle the API call
        // Just pass the data to onSubmit
        await onSubmit(contractorData);
        
        // Only close and reset after successful submission
        onClose();
        formik.resetForm();
        setSpecializations([]);
      } catch (error: any) {
        // If there's an error, don't close the form
        console.error('Error submitting contractor:', error);
        toast.error(error.message || 'Failed to save contractor');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const resetForm = () => {
    formik.resetForm();
    setSpecializations([]);
  };

  const addSpecialization = (specialization: string) => {
    if (specialization.trim() && !specializations.includes(specialization.trim())) {
      setSpecializations([...specializations, specialization.trim()]);
    }
  };

  const removeSpecialization = (specializationToRemove: string) => {
    setSpecializations(specializations.filter(spec => spec !== specializationToRemove));
  };

  return {
    formik,
    isSubmitting,
    resetForm,
    specializations,
    addSpecialization,
    removeSpecialization,
  };
};