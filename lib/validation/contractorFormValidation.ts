import * as Yup from 'yup';

export const contractorValidationSchema = Yup.object({
  name: Yup.string()
    .required('Contractor name is required')
    .min(2, 'Contractor name must be at least 2 characters')
    .max(100, 'Contractor name must not exceed 100 characters'),
  
  companyName: Yup.string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters'),
  
  type: Yup.string()
    .oneOf(['individual', 'company'], 'Invalid contractor type')
    .required('Contractor type is required'),
  
  category: Yup.string()
    .required('Category is required')
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must not exceed 50 characters'),
  
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  
  phone: Yup.string()
    .matches(/^(\+92|0)?[0-9]{10}$/, 'Invalid phone number format')
    .required('Phone number is required'),
  
  alternatePhone: Yup.string()
    .optional()
    .test('phone-format', 'Invalid phone number format', function(value) {
      if (!value) return true; // Allow empty values
      return /^(\+92|0)?[0-9]{10}$/.test(value);
    }),
  
  website: Yup.string()
    .optional(),
  
  address: Yup.string()
    .required('Address is required')
    .max(500, 'Address must not exceed 500 characters'),
  
  city: Yup.string()
    .required('City is required'),
  
  country: Yup.string()
    .required('Country is required'),
  
  industry: Yup.string()
    .required('Industry is required')
    .min(2, 'Industry must be at least 2 characters')
    .max(100, 'Industry must not exceed 100 characters'),
  
  specializations: Yup.array()
    .of(Yup.string())
    .optional()
    .max(10, 'Maximum 10 specializations allowed'),
});

export type ContractorFormValues = Yup.InferType<typeof contractorValidationSchema>;
