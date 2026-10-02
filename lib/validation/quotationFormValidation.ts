import * as Yup from 'yup';

export const quotationFormValidationSchema = Yup.object({
  contractorId: Yup.string().optional(),
  customerId: Yup.string().required('Customer is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .required('Description is required'),
  items: Yup.array()
    .of(
      Yup.object({
        description: Yup.string().required('Item description is required'),
        type: Yup.string()
          .oneOf(['length_width', 'total_size', 'quantity_only', 'fixed_amount'], 'Invalid item type')
          .required('Item type is required'),
        unitPrice: Yup.number()
          .min(0, 'Unit price must be non-negative')
          .required('Unit price is required'),
        total: Yup.number()
          .min(0, 'Total must be non-negative')
          .required('Total is required'),
        // Conditional validation based on type
        length: Yup.number()
          .min(0, 'Length must be non-negative')
          .when('type', {
            is: 'length_width',
            then: (schema) => schema.required('Length is required for length_width type'),
            otherwise: (schema) => schema.optional(),
          }),
        width: Yup.number()
          .min(0, 'Width must be non-negative')
          .when('type', {
            is: 'length_width',
            then: (schema) => schema.required('Width is required for length_width type'),
            otherwise: (schema) => schema.optional(),
          }),
        totalSize: Yup.number()
          .min(0, 'Size must be non-negative')
          .when('type', {
            is: 'length_width',
            then: (schema) => schema.required('Size (sq.ft) is required for length_width type'),
            otherwise: (schema) => schema.optional(),
          }),
        quantity: Yup.number()
          .min(1, 'Quantity must be at least 1')
          .when('type', {
            is: (type: string) => ['length_width', 'quantity_only'].includes(type),
            then: (schema) => schema.required('Quantity is required for this item type'),
            otherwise: (schema) => schema.optional(),
          }),
        fixedAmount: Yup.number()
          .min(0, 'Fixed amount must be non-negative')
          .when('type', {
            is: 'fixed_amount',
            then: (schema) => schema.required('Fixed amount is required for fixed_amount type'),
            otherwise: (schema) => schema.optional(),
          }),
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
  currency: Yup.string()
    .required('Currency is required'),
  terms: Yup.string()
    .max(1000, 'Terms must not exceed 1000 characters')
    .optional(),
  notes: Yup.string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional(),
  status: Yup.string()
    .oneOf(['draft', 'sent', 'accepted', 'rejected', 'expired', 'converted'], 'Invalid status')
    .required('Status is required'),
  attachments: Yup.array().of(
    Yup.object({
      name: Yup.string().optional(),
      file: Yup.string().optional(),
      type: Yup.string().optional(),
    })
  ).optional(),
});

export type QuotationFormValues = Yup.InferType<typeof quotationFormValidationSchema>;
