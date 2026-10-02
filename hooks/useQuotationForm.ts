import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useAppDispatch } from '@/lib/hooks';
import { createQuotation, updateQuotation } from '@/lib/store/slices/quotationSlice';
import { Quotation, QuotationItem, QuotationAttachment } from '@/lib/types';
import { quotationFormValidationSchema, QuotationFormValues } from '@/lib/validation/quotationFormValidation';
import { uploadSingleFile, uploadMultipleFiles, deleteMultipleFiles } from '@/lib/utils/fileHandler';
import { toast } from 'sonner';

interface UseQuotationFormProps {
  quotation?: Quotation | null;
  onSubmit: (quotation: Omit<Quotation, 'quotationId' | 'createdAt' | 'updatedAt' | '_id'>) => void;
  onClose: () => void;
}

export const useQuotationForm = ({ quotation, onSubmit, onClose }: UseQuotationFormProps) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<QuotationAttachment[]>(quotation?.attachments || []);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const formik = useFormik<QuotationFormValues>({
    initialValues: {
      contractorId: quotation?.contractorId || '',
      customerId: typeof quotation?.customerId === 'string' ? quotation.customerId : quotation?.customerId?.customerId || '',
      description: quotation?.description || '',
      items: quotation?.items ? quotation.items.map(item => ({
        description: item.description,
        type: item.type || 'length_width',
        length: item.length || 0,
        width: item.width || 0,
        totalSize: item.totalSize || 0,
        quantity: item.quantity || 1,
        fixedAmount: item.fixedAmount || 0,
        unitPrice: item.unitPrice || 0,
        total: item.total || 0,
      })) : [
        {
          description: '',
          type: 'length_width' as const,
          length: 0,
          width: 0,
          totalSize: 0,
          quantity: 1,
          unitPrice: 0,
          total: 0,
        }
      ],
      subtotal: quotation?.subtotal || 0,
      taxAmount: quotation?.taxAmount || 0,
      discountAmount: quotation?.discountAmount || 0,
      totalAmount: quotation?.totalAmount || 0,
      currency: quotation?.currency || 'PKR',
      terms: quotation?.terms || '',
      notes: quotation?.notes || '',
      status: quotation?.status || 'draft',
    },
    validationSchema: quotationFormValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log('Form submission started with values:', values);
      console.log('Pending files:', pendingFiles);
      console.log('Existing attachments:', attachments);
      
      setIsSubmitting(true);

      try {
        // Upload pending files first
        let uploadedAttachments: QuotationAttachment[] = [...attachments];
        
        if (pendingFiles.length > 0) {
          try {
            if (pendingFiles.length === 1) {
              const response = await uploadSingleFile(pendingFiles[0]);
              const newAttachment: QuotationAttachment = {
                name: pendingFiles[0].name,
                file: response.response.data,
                type: pendingFiles[0].type,
              };
              uploadedAttachments.push(newAttachment);
            } else {
              const response = await uploadMultipleFiles(pendingFiles);
              const newAttachments: QuotationAttachment[] = pendingFiles.map((file, index) => ({
                name: file.name,
                file: response.response.data[index],
                type: file.type,
              }));
              uploadedAttachments = [...uploadedAttachments, ...newAttachments];
            }
            toast.success('Files uploaded successfully');
          } catch (error) {
            toast.error('Failed to upload files');
            setIsSubmitting(false);
            return;
          }
        }

        // Calculate totals with new flexible item structure
        const calculatedSubtotal = values.items.reduce((sum, item) => sum + (item.total || 0), 0);
        const calculatedTotal = calculatedSubtotal + values.taxAmount - values.discountAmount;

        // Prepare quotation data for creation (only essential fields)
        const quotationDataForCreation = {
          contractorId: values.contractorId || '',
          customerId: values.customerId,
          description: values.description,
          items: values.items.map(item => ({
            description: item.description,
            type: item.type,
            length: item.length || 0,
            width: item.width || 0,
            quantity: item.quantity || 1,
            totalSize: item.totalSize || 0,
            fixedAmount: item.fixedAmount || 0,
            unitPrice: item.unitPrice || 0,
            total: item.total || 0,
          })),
          subtotal: calculatedSubtotal,
          taxAmount: values.taxAmount,
          discountAmount: values.discountAmount,
          totalAmount: calculatedTotal,
          currency: values.currency,
          terms: values.terms,
          notes: values.notes,
          status: values.status,
          attachments: uploadedAttachments,
        };

        if (quotation) {
          // Update existing quotation - include all necessary fields for updates
          const updateData = {
            ...quotationDataForCreation,
            quotationNumber: quotation.quotationNumber,
            quotationId: quotation.quotationId,
            // Clean attachments to remove _id field that backend rejects
            attachments: uploadedAttachments.map(attachment => ({
              name: attachment.name,
              file: attachment.file,
              type: attachment.type,
            })),
          };
          
          console.log('Update data being sent:', JSON.stringify(updateData, null, 2));
          const result = await dispatch(updateQuotation(updateData)).unwrap();
          toast.success(result.message || 'Quotation updated successfully');
        } else {
          // Create new quotation - only essential fields, backend will handle the rest
          console.log('Create data being sent:', JSON.stringify(quotationDataForCreation, null, 2));
          const result = await dispatch(createQuotation(quotationDataForCreation)).unwrap();
          toast.success(result.message || 'Quotation created successfully');
        }

        // Delete files that were removed
        if (filesToDelete.length > 0) {
          try {
            await deleteMultipleFiles(filesToDelete);
          } catch (error) {
            console.error('Error deleting files:', error);
          }
        }

        // Create data object for onSubmit callback (with all required fields for display purposes)
        const callbackData: Omit<Quotation, 'quotationId' | 'createdAt' | 'updatedAt' | '_id'> = {
          ...quotationDataForCreation,
          quotationNumber: quotation?.quotationNumber || `QT-${Date.now()}`,
          userID: quotation?.userID || '',
          createdBy: quotation?.createdBy || '',
          updatedBy: quotation?.updatedBy || '',
          sentAt: quotation?.sentAt || null,
          acceptedAt: quotation?.acceptedAt || null,
          rejectedAt: quotation?.rejectedAt || null,
          invoiceId: quotation?.invoiceId || null,
          convertedToInvoice: quotation?.convertedToInvoice || false,
        };

        onSubmit(callbackData);
        onClose();
        formik.resetForm();
        setAttachments([]);
        setFilesToDelete([]);
        setPendingFiles([]);
      } catch (error: any) {
        toast.error(error.message || 'Failed to save quotation');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const addItem = () => {
    const newItem: QuotationItem = {
      description: '',
      type: 'length_width',
      length: 0,
      width: 0,
      totalSize: 0,
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    formik.setFieldValue('items', [...formik.values.items, newItem]);
  };

  const removeItem = (index: number) => {
    const newItems = formik.values.items.filter((_, i) => i !== index);
    formik.setFieldValue('items', newItems);
  };

  // Calculate item total based on type
  const calculateItemTotal = (item: QuotationItem): number => {
    switch (item.type) {
      case 'length_width':
        return (item.totalSize || 0) * (item.quantity || 1) * (item.unitPrice || 0);
      case 'total_size':
        return (item.totalSize || 0) * (item.unitPrice || 0);
      case 'quantity_only':
        return (item.quantity || 1) * (item.unitPrice || 0);
      case 'fixed_amount':
        return item.fixedAmount || 0;
      default:
        return 0;
    }
  };

  const updateItem = (index: number, field: keyof QuotationItem, value: any) => {
    const newItems = [...formik.values.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate item total based on type
    newItems[index].total = calculateItemTotal(newItems[index]);
    
    formik.setFieldValue('items', newItems);
  };

  const handleFileUpload = (files: File[]) => {
    // Store files to be uploaded when form is submitted
    setPendingFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) queued for upload`);
  };

  const removeAttachment = (index: number) => {
    const attachment = attachments[index];
    if (attachment.file && !attachment.file.startsWith('data:')) {
      setFilesToDelete([...filesToDelete, attachment.file]);
    }
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const removePendingFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = formik.values.items.reduce((sum, item) => sum + (item.total || 0), 0);
    const total = subtotal + formik.values.taxAmount - formik.values.discountAmount;
    
    formik.setFieldValue('subtotal', subtotal);
    formik.setFieldValue('totalAmount', total);
    
    return { subtotal, total };
  };

  useEffect(() => {
    calculateTotals();
  }, [formik.values.items, formik.values.taxAmount, formik.values.discountAmount]);

  return {
    formik,
    isSubmitting,
    attachments,
    pendingFiles,
    addItem,
    removeItem,
    updateItem,
    handleFileUpload,
    removeAttachment,
    removePendingFile,
    calculateTotals,
    calculateItemTotal,
  };
};
