import * as Yup from 'yup';

export const directorFormValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .required('Name is required'),
  
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  
  phone: Yup.string()
    .matches(/^(\+92|0)?[0-9]{10}$/, 'Invalid phone number format')
    .required('Phone number is required'),
  
  alternatePhone: Yup.string()
    .matches(/^(\+92|0)?[0-9]{10}$/, 'Invalid alternate phone number format')
    .optional(),
  
  address: Yup.string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must not exceed 200 characters')
    .required('Address is required'),
  
  city: Yup.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must not exceed 50 characters')
    .required('City is required'),
  
  country: Yup.string()
    .min(2, 'Country must be at least 2 characters')
    .max(50, 'Country must not exceed 50 characters')
    .required('Country is required'),
  
  postalCode: Yup.string()
    .min(3, 'Postal code must be at least 3 characters')
    .max(10, 'Postal code must not exceed 10 characters')
    .required('Postal code is required'),
  
  status: Yup.string()
    .oneOf(['active', 'inactive'], 'Status must be either active or inactive')
    .required('Status is required'),
});

export type DirectorFormValues = Yup.InferType<typeof directorFormValidationSchema>;
