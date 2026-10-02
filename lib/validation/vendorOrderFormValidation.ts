import * as Yup from 'yup';

export const vendorOrderFormValidationSchema = Yup.object({
  vendorId: Yup.string().required('Vendor is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .required('Description is required'),
  items: Yup.array()
    .of(
      Yup.object({
        description: Yup.string().required('Item description is required'),
        width: Yup.number()
          .min(0, 'Width must be non-negative')
          .required('Width is required'),
        height: Yup.number()
          .min(0, 'Height must be non-negative')
          .required('Height is required'),
        size: Yup.number()
          .min(0, 'Size must be non-negative')
          .required('Size is required'),
        quantity: Yup.number()
          .min(1, 'Quantity must be at least 1')
          .required('Quantity is required'),
        unitPrice: Yup.number()
          .min(0, 'Unit price must be non-negative')
          .required('Unit price is required'),
        total: Yup.number()
          .min(0, 'Total must be non-negative')
          .required('Total is required'),
      })
    )
    .min(1, 'At least one item is required')
    .required('Items are required'),
  subtotal: Yup.number()
    .min(0, 'Subtotal must be non-negative')
    .required('Subtotal is required'),
  taxAmount: Yup.number()
    .min(0, 'Tax amount must be non-negative')
    .required('Tax amount is required'),
  discountAmount: Yup.number()
    .min(0, 'Discount amount must be non-negative')
    .required('Discount amount is required'),
  totalAmount: Yup.number()
    .min(0, 'Total amount must be non-negative')
    .required('Total amount is required'),
  terms: Yup.string()
    .max(1000, 'Terms must not exceed 1000 characters')
    .optional(),
  notes: Yup.string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional(),
  status: Yup.string()
    .oneOf(['draft', 'pending', 'approved', 'rejected', 'completed', 'cancelled'], 'Invalid status')
    .required('Status is required'),
});

export type VendorOrderFormValues = Yup.InferType<typeof vendorOrderFormValidationSchema>;
