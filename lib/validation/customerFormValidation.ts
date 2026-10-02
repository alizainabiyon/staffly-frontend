import * as Yup from 'yup';

export const customerValidationSchema = Yup.object({
  name: Yup.string()
    .required('Customer name is required')
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name must not exceed 100 characters'),
  
  email: Yup.string()
    .email('Invalid email format')
    .optional(),
  
  phone: Yup.string()
    .matches(/^(\+92|0)?[0-9]{10}$/, 'Invalid phone number format')
    .required('Phone number is required'),
  
  otherContactNo: Yup.string()
    .matches(/^(\+92|0)?[0-9]{10}$/, 'Invalid phone number format')
    .optional(),
  
  company: Yup.string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters'),
  
  address: Yup.string()
    .required('Address is required')
    .max(500, 'Address must not exceed 500 characters'),
  
  city: Yup.string()
    .optional(),
  
  country: Yup.string()
    .optional(),
  
  officeAddress: Yup.string()
    .optional()
    .max(500, 'Office address must not exceed 500 characters'),
  
  taxNumber: Yup.string()
    .optional()
    .matches(/^[A-Z0-9-]+$/, 'Tax number can only contain uppercase letters, numbers, and hyphens'),
  
  status: Yup.string()
    .oneOf(['active', 'inactive', 'blocked'], 'Invalid status')
    .required('Status is required'),
  
  customerType: Yup.string()
    .oneOf(['individual', 'business'], 'Invalid customer type')
    .required('Customer type is required'),
  
  contactPerson: Yup.string()
    .when('customerType', {
      is: 'business',
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.optional(),
    })
    .max(100, 'Contact person name must not exceed 100 characters'),
  
  website: Yup.string().optional(),
  
  notes: Yup.string()
    .optional()
    .max(1000, 'Notes must not exceed 1000 characters'),
  
  contractorId: Yup.string()
    .optional(),
  
  contractorName: Yup.string()
    .optional(),
});

export type CustomerFormValues = Yup.InferType<typeof customerValidationSchema>;
