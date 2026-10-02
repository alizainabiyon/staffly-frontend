import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useAppDispatch } from '@/lib/hooks';
import { customerValidationSchema, CustomerFormValues } from '@/lib/validation/customerFormValidation';
import { Customer } from '@/lib/types';
import { toast } from 'sonner';

interface UseCustomerFormProps {
  customer?: Customer | null;
  onSubmit: (customer: Omit<Customer, 'customerId' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export const useCustomerForm = ({ customer, onSubmit, onClose }: UseCustomerFormProps) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<CustomerFormValues>({
    initialValues: {
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      otherContactNo: customer?.otherContactNo || '',
      company: customer?.company || '',
      address: customer?.address || '',
      city: customer?.city || '',
      country: customer?.country || 'Pakistan',
      officeAddress: customer?.officeAddress || '',
      taxNumber: customer?.taxNumber || '',
      status: customer?.status || 'active',
      customerType: customer?.customerType || 'business',
      contactPerson: customer?.contactPerson || '',
      website: customer?.website || '',
      notes: customer?.notes || '',
      contractorId: customer?.contractorId || ''
    },
    validationSchema: customerValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        // Prepare customer data
        const customerData: Omit<Customer, 'customerId' | 'createdAt' | 'updatedAt'> = {
          ...values,
          email: values.email || '',
          phone: values.phone || '',
          otherContactNo: values.otherContactNo || '',
          company: values.company || '',
          address: values.address || '',
          city: values.city || '',
          country: values.country || '',
          officeAddress: values.officeAddress || '',
          taxNumber: values.taxNumber || '',
          status: values.status || '',
          customerType: values.customerType || '',
          contactPerson: values.contactPerson || '',
          website: values.website || '',
          notes: values.notes || '',
          contractorId: values.contractorId || '',
          name: values.name || '',
          tags: customer?.tags ?? [],
        };

        console.log('Form values:', values);
        console.log('Customer data to send:', customerData);

        // Let the parent component handle the API call
        // Just pass the data to onSubmit
        onSubmit(customerData);
        
        // Don't close here - let the parent handle it after successful API call
        // onClose();
        // formik.resetForm();
      } catch (error: any) {
        toast.error(error.message || 'Failed to save customer');
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
