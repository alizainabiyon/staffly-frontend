import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useAppDispatch } from '@/lib/hooks';
import { createInvoice, updateInvoice } from '@/lib/store/slices/invoiceSlice';
import { Invoice, InvoiceItem, InvoiceAttachment } from '@/lib/types';
import { invoiceFormValidationSchema, InvoiceFormValues } from '@/lib/validation/invoiceFormValidation';
import { uploadSingleFile, uploadMultipleFiles, deleteMultipleFiles } from '@/lib/utils/fileHandler';
import { toast } from 'sonner';

interface UseInvoiceFormProps {
  invoice?: Invoice | null;
  onSubmit: (invoice: Omit<Invoice, 'invoiceId' | 'createdAt' | 'updatedAt' | '_id'>) => void;
  onClose: () => void;
}

export const useInvoiceForm = ({ invoice, onSubmit, onClose }: UseInvoiceFormProps) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<InvoiceAttachment[]>(invoice?.attachments || []);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const formik = useFormik<InvoiceFormValues>({
    initialValues: {
      contractorId: invoice?.contractorId || '',
      customerId: typeof invoice?.customerId === 'string' ? invoice.customerId : invoice?.customerId?.customerId || '',
      description: invoice?.description || '',
      items: invoice?.items ? invoice.items.map(item => ({
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
      subtotal: invoice?.subtotal || 0,
      taxAmount: invoice?.taxAmount || 0,
      discountAmount: invoice?.discountAmount || 0,
      totalAmount: invoice?.totalAmount || 0,
      advanceAmount: invoice?.advanceAmount || 0,
      terms: invoice?.terms || '',
      notes: invoice?.notes || '',
      status: invoice?.status || 'draft',
    },
    validationSchema: invoiceFormValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        // Upload pending files first
        let uploadedAttachments: InvoiceAttachment[] = [...attachments];
        
        if (pendingFiles.length > 0) {
          try {
            if (pendingFiles.length === 1) {
              const response = await uploadSingleFile(pendingFiles[0]);
              const newAttachment: InvoiceAttachment = {
                name: pendingFiles[0].name,
                file: response.response.data,
                type: pendingFiles[0].type,
              };
              uploadedAttachments.push(newAttachment);
            } else {
              const response = await uploadMultipleFiles(pendingFiles);
              const newAttachments: InvoiceAttachment[] = pendingFiles.map((file, index) => ({
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
        const calculatedSubtotal = values.items.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
        const calculatedTotal = calculatedSubtotal + values.taxAmount - values.discountAmount - (values.advanceAmount || 0);

        // Prepare invoice data for creation (only essential fields)
        const invoiceDataForCreation = {
          contractorId: values.contractorId || '',
          customerId: values.customerId,
          description: values.description,
          items: values.items.map((item: any) => ({
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
          advanceAmount: values.advanceAmount,
          terms: values.terms,
          notes: values.notes,
          status: values.status,
          attachments: uploadedAttachments,
        };

        if (invoice) {
          // Update existing invoice - include all necessary fields for updates
          const updateData = {
            ...invoiceDataForCreation,
            invoiceNumber: invoice.invoiceNumber,
            invoiceId: invoice.invoiceId,
            // Clean attachments to remove _id field that backend rejects
            attachments: uploadedAttachments.map(attachment => ({
              name: attachment.name,
              file: attachment.file,
              type: attachment.type,
            })),
          };
          
          const result = await dispatch(updateInvoice(updateData)).unwrap();
          toast.success(result.message || 'Invoice updated successfully');
        } else {
          // Create new invoice - only essential fields, backend will handle the rest
          const result = await dispatch(createInvoice(invoiceDataForCreation)).unwrap();
          toast.success(result.message || 'Invoice created successfully');
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
        const callbackData: Omit<Invoice, 'invoiceId' | 'createdAt' | 'updatedAt' | '_id'> = {
          ...invoiceDataForCreation,
          invoiceNumber: invoice?.invoiceNumber || `INV-${Date.now()}`,
          userID: invoice?.userID || '',
          createdBy: invoice?.createdBy || '',
          updatedBy: invoice?.updatedBy || '',
          currency: invoice?.currency || 'PKR',
          sentAt: invoice?.sentAt || null,
          acceptedAt: invoice?.acceptedAt || null,
          rejectedAt: invoice?.rejectedAt || null,
          paidAt: invoice?.paidAt || null,
        };

        onSubmit(callbackData);
        onClose();
        formik.resetForm();
        setAttachments([]);
        setFilesToDelete([]);
        setPendingFiles([]);
      } catch (error: any) {
        toast.error(error.message || 'Failed to save invoice');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const addItem = () => {
    const newItem: InvoiceItem = {
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
    const newItems = formik.values.items.filter((_: any, i: number) => i !== index);
    formik.setFieldValue('items', newItems);
  };

  // Calculate item total based on type
  const calculateItemTotal = (item: InvoiceItem): number => {
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

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...formik.values.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate item total
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
    const subtotal = formik.values.items.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
    const total = subtotal + formik.values.taxAmount - formik.values.discountAmount - (formik.values.advanceAmount || 0);
    
    formik.setFieldValue('subtotal', subtotal);
    formik.setFieldValue('totalAmount', total);
    
    return { subtotal, total };
  };

  useEffect(() => {
    calculateTotals();
  }, [formik.values.items, formik.values.taxAmount, formik.values.discountAmount, formik.values.advanceAmount]);

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
  };
};
