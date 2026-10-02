import { useState } from 'react';
import { useFormik } from 'formik';
import { useAppDispatch } from '@/lib/hooks';
import { createDirector, updateDirector } from '@/lib/store/slices/directorSlice';
import { directorFormValidationSchema, DirectorFormValues } from '@/lib/validation/directorFormValidation';
import { Director } from '@/lib/types/director';
import { toast } from 'sonner';

interface UseDirectorFormProps {
  director?: Director | null;
  onSubmit: (director: Omit<Director, 'directorId' | 'createdAt' | 'updatedAt' | '_id' | 'userID' | 'createdBy' | 'updatedBy'>) => void;
  onClose: () => void;
}

export const useDirectorForm = ({ director, onSubmit, onClose }: UseDirectorFormProps) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<DirectorFormValues>({
    initialValues: {
      name: director?.name || '',
      email: director?.email || '',
      phone: director?.phone || '',
      alternatePhone: director?.alternatePhone || '',
      address: director?.address || '',
      city: director?.city || '',
      country: director?.country || 'Pakistan',
      postalCode: director?.postalCode || '',
      status: director?.status || 'active',
    },
    validationSchema: directorFormValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        // Prepare director data
        const directorData: Omit<Director, 'directorId' | 'createdAt' | 'updatedAt' | '_id' | 'userID' | 'createdBy' | 'updatedBy'> = {
          ...values,
          name: values.name || '',
          email: values.email || '',
          phone: values.phone || '',
          alternatePhone: values.alternatePhone || '',
          address: values.address || '',
          city: values.city || '',
          country: values.country || '',
          postalCode: values.postalCode || '',
          status: values.status || 'active',
        };

        console.log('Form values:', values);
        console.log('Director data to send:', directorData);

        if (director) {
          // Update existing director
          console.log('Updating director with ID:', director.directorId);
          const updateData = {
            ...directorData,
            directorId: director.directorId,
          };
          console.log('Update data:', updateData);
          
          const result = await dispatch(updateDirector(updateData)).unwrap();
          console.log('Update result:', result);
          
          toast.success(result.message || 'Director updated successfully');
        } else {
          // Create new director
          console.log('Creating new director');
          const result = await dispatch(createDirector(directorData)).unwrap();
          console.log('Create result:', result);
          toast.success(result.message || 'Director created successfully');
        }

        // Pass the director data to onSubmit since that's what the parent expects
        onSubmit(directorData);
        onClose();
        formik.resetForm();
      } catch (error: any) {
        toast.error(error.message || 'Failed to save director');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const resetForm = () => {
    formik.resetForm();
  };

  const handleCancel = () => {
    formik.resetForm();
    onClose();
  };

  return {
    formik,
    isSubmitting,
    resetForm,
    handleCancel,
  };
};
