import * as Yup from 'yup';

export const employeeFormValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^(\+92|0)?[0-9]{10}$/, 'Invalid phone number').required('Phone is required'),
  cnic: Yup.string().matches(/^[0-9]{5}-[0-9]{7}-[0-9]$/, 'Invalid CNIC format (12345-1234567-1)').required('CNIC is required'),
  address: Yup.string().required('Address is required'),
  address2: Yup.string(),
  age: Yup.number().min(18, 'Age must be at least 18').max(100, 'Age must be less than 100').required('Age is required'),
  study: Yup.string().required('Study/Education is required'),
  cast: Yup.string().required('Cast is required'),
  position: Yup.string().required('Position is required'),
  department: Yup.string().required('Department is required'),
  salary: Yup.number().min(1, 'Salary must be greater than 0').required('Salary is required'),
  joinDate: Yup.string().required('Join date is required'),
  bankAccount: Yup.string(),
  employeeId: Yup.string().required('Employee ID is required'),
  status: Yup.string().required('Status is required'),
}); 