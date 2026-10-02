import * as Yup from 'yup';

export const vendorValidationSchema = Yup.object({
  name: Yup.string()
    .required('Vendor name is required')
    .min(2, 'Vendor name must be at least 2 characters')
    .max(100, 'Vendor name must not exceed 100 characters'),
  
  companyName: Yup.string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters'),
  
  type: Yup.string()
    .oneOf(['individual', 'company'], 'Invalid vendor type')
    .required('Vendor type is required'),
  
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
  
  postalCode: Yup.string()
    .required('Postal code is required')
    .max(20, 'Postal code must not exceed 20 characters'),
  
  status: Yup.string()
    .oneOf(['active', 'inactive'], 'Invalid status')
    .required('Status is required'),
});

export type VendorFormValues = Yup.InferType<typeof vendorValidationSchema>;
