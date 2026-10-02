import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useAppDispatch } from '@/lib/hooks';
import { createVendorOrder, updateVendorOrder } from '@/lib/store/slices/vendorOrderSlice';
import { VendorOrder, VendorOrderItem } from '@/lib/types';
import { vendorOrderFormValidationSchema, VendorOrderFormValues } from '@/lib/validation/vendorOrderFormValidation';
import { toast } from 'sonner';

interface UseVendorOrderFormProps {
  vendorOrder?: VendorOrder | null;
  onSubmit: (vendorOrder: Omit<VendorOrder, 'orderId' | 'createdAt' | 'updatedAt' | '_id'>) => void;
  onClose: () => void;
}

export const useVendorOrderForm = ({ vendorOrder, onSubmit, onClose }: UseVendorOrderFormProps) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<VendorOrderFormValues>({
    initialValues: {
      vendorId: typeof vendorOrder?.vendorId === 'string' ? vendorOrder.vendorId : vendorOrder?.vendorId?.vendorId || '',
      description: vendorOrder?.description || '',
      items: vendorOrder?.items || [
        {
          description: '',
          width: 0,
          height: 0,
          size: 0,
          quantity: 1,
          unitPrice: 0,
          total: 0,
        }
      ],
      subtotal: vendorOrder?.subtotal || 0,
      taxAmount: vendorOrder?.taxAmount || 0,
      discountAmount: vendorOrder?.discountAmount || 0,
      totalAmount: vendorOrder?.totalAmount || 0,
      terms: vendorOrder?.terms || '',
      notes: vendorOrder?.notes || '',
      status: vendorOrder?.status || 'pending',
    },
    validationSchema: vendorOrderFormValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      
      setIsSubmitting(true);

      try {
        // Calculate totals
        const calculatedSubtotal = values.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const calculatedTotal = calculatedSubtotal + values.taxAmount - values.discountAmount;

        // Prepare vendor order data for creation
        const vendorOrderDataForCreation = {
          vendorId: values.vendorId,
          description: values.description,
          items: values.items.map(item => ({
            description: item.description,
            width: item.width,
            height: item.height,
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })),
          subtotal: calculatedSubtotal,
          taxAmount: values.taxAmount,
          discountAmount: values.discountAmount,
          totalAmount: calculatedTotal,
          terms: values.terms,
          notes: values.notes,
          status: 'pending',
        };

        if (vendorOrder) {
          const updateData = {
            ...vendorOrderDataForCreation,
            orderNumber: vendorOrder.orderNumber,
            orderId: vendorOrder.orderId,
          };
          
          const result = await dispatch(updateVendorOrder(updateData)).unwrap();
          toast.success(result.message || 'Vendor order updated successfully');
        } else {
          const result = await dispatch(createVendorOrder(vendorOrderDataForCreation)).unwrap();
          toast.success(result.message || 'Vendor order created successfully');
        }

        const callbackData: Omit<VendorOrder, 'orderId' | 'createdAt' | 'updatedAt' | '_id'> = {
          ...vendorOrderDataForCreation,
          orderNumber: vendorOrder?.orderNumber || `VO-${Date.now()}`,
          userID: vendorOrder?.userID || '',
          createdBy: vendorOrder?.createdBy || '',
          updatedBy: vendorOrder?.updatedBy || null,
          previousRemainingAmount: vendorOrder?.previousRemainingAmount || 0,
          invoiceId: vendorOrder?.invoiceId || null,
          approvedAt: vendorOrder?.approvedAt || null,
          rejectedAt: vendorOrder?.rejectedAt || null,
          completedAt: vendorOrder?.completedAt || null,
          cancelledAt: vendorOrder?.cancelledAt || null,
          status: 'pending',
        };

        onSubmit(callbackData);
        onClose();
        formik.resetForm();
      } catch (error: any) {
        toast.error(error.message || 'Failed to save vendor order');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const addItem = () => {
    const newItem: VendorOrderItem = {
      description: '',
      width: 0,
      height: 0,
      size: 0,
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

  const updateItem = (index: number, field: keyof VendorOrderItem, value: any) => {
    const newItems = [...formik.values.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    
    formik.setFieldValue('items', newItems);
  };

  const calculateTotals = () => {
    const subtotal = formik.values.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
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
    addItem,
    removeItem,
    updateItem,
    calculateTotals,
  };
};
