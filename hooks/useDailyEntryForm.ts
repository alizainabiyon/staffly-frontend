import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { dailyEntryFormValidationSchema, DailyEntryFormData } from '@/lib/validation/dailyEntryFormValidation';
import { DailyEntry, CreateDailyEntryPayload, UpdateDailyEntryPayload } from '@/lib/types/entries';
import { useAppDispatch } from '@/lib/hooks';
import { createEntry, updateEntry } from '@/lib/store/slices/dailyEntrySlice';
import { toast } from 'sonner';

interface UseDailyEntryFormProps {
  entry?: DailyEntry | null;
  onSubmit?: (entry: CreateDailyEntryPayload | UpdateDailyEntryPayload) => void;
  onClose?: () => void;
}

const initialValues: DailyEntryFormData = {
  entryDate: new Date().toISOString().split('T')[0],
  paymentType: 'credit',
  paymentMethod: 'cash',
  entryType: 'customer',
  amount: 0,
  purpose: '',
  description: '',
  customerId: '',
  destinationType: 'till',
  entryClearStatus: 'pending',
  destinationDirectorId: '',
  status: 'draft',
  contractorId: '',
  vendorId: '',
  employeeId: '',
  directorId: '',
  expenseCategory: '',
  expenseType: '',
  destinationVendorId: '',
  notes: '',
};

export const useDailyEntryForm = ({ entry, onSubmit, onClose }: UseDailyEntryFormProps) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Re-initialize form when entry changes
  useEffect(() => {
    if (entry) {
      formik.setValues({
        entryDate: entry.entryDate.split('T')[0],
        paymentType: entry.paymentType,
        paymentMethod: entry.paymentMethod || 'cash',
        amount: entry.amount,
        purpose: entry.purpose,
        description: entry.description,
        entryType: entry.entryType,
        customerId: entry.customerId || '',
        destinationType: entry.destinationType,
        entryClearStatus: entry.entryClearStatus,
        destinationDirectorId: entry.destinationDirectorId || '',
        status: entry.status,
        contractorId: entry.contractorId || '',
        vendorId: entry.vendorId || '',
        employeeId: entry.employeeId || '',
        directorId: entry.directorId || '',
        expenseCategory: entry.expenseCategory || '',
        expenseType: entry.expenseType || '',
        destinationVendorId: entry.destinationVendorId || '',
        notes: entry.notes || '',
      });
    }
  }, [entry]);

  const formik = useFormik({
    initialValues: entry ? {
      entryDate: entry.entryDate.split('T')[0],
      paymentType: entry.paymentType,
      paymentMethod: entry.paymentMethod || 'cash',
      amount: entry.amount,
      purpose: entry.purpose,
      description: entry.description,
      entryType: entry.entryType,
      customerId: entry.customerId || '',
      destinationType: entry.destinationType,
      entryClearStatus: entry.entryClearStatus,
      destinationDirectorId: entry.destinationDirectorId || '',
      status: entry.status,
      contractorId: entry.contractorId || '',
      vendorId: entry.vendorId || '',
      employeeId: entry.employeeId || '',
      directorId: entry.directorId || '',
      expenseCategory: entry.expenseCategory || '',
      expenseType: entry.expenseType || '',
      destinationVendorId: entry.destinationVendorId || '',
      notes: entry.notes || '',
    } : initialValues,
    validationSchema: dailyEntryFormValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        
        if (entry) {
          // Update existing entry
          const updatePayload: UpdateDailyEntryPayload = {
            entryId: entry.entryId,
            ...values,
          };
          
          if (onSubmit) {
            onSubmit(updatePayload);
          } else {
            await dispatch(updateEntry(updatePayload)).unwrap();
            toast.success('Entry updated successfully');
          }
        } else {
          // Create new entry
          const createPayload: CreateDailyEntryPayload = {
            ...values,
          };
          
          if (onSubmit) {
            onSubmit(createPayload);
          } else {
            await dispatch(createEntry(createPayload)).unwrap();
            toast.success('Entry created successfully');
          }
        }
        
        if (onClose) {
          onClose();
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to save entry');
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
