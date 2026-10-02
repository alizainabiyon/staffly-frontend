import * as yup from 'yup';

export const dailyEntryFormValidationSchema = yup.object({
  entryDate: yup.string().required('Entry date is required'),
  paymentType: yup.string().oneOf(['credit', 'debit'], 'Payment type is required').required('Payment type is required'),
  paymentMethod: yup.string().oneOf(['cash', 'bank'], 'Payment method is required').required('Payment method is required'),
  entryType: yup.string().oneOf(['customer', 'vendor', 'expense'], 'Invalid entry type').required('Entry type is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  purpose: yup.string().required('Purpose is required'),
  description: yup.string().required('Description is required'),
  customerId: yup.string().when('entryType', {
    is: 'customer',
    then: (schema) => schema.required('Customer is required'),
    otherwise: (schema) => schema.optional(),
  }),
  vendorId: yup.string().when('entryType', {
    is: 'vendor',
    then: (schema) => schema.required('Vendor is required'),
    otherwise: (schema) => schema.optional(),
  }),
  employeeId: yup.string().when(['entryType', 'expense'], {
    is: (entryType: string, expense: string) => entryType === 'expense' && expense === 'employee',
    then: (schema) => schema.required('Employee is required'),
    otherwise: (schema) => schema.optional(),
  }),
  directorId: yup.string().when(['entryType', 'expense'], {
    is: (entryType: string, expense: string) => entryType === 'expense' && expense === 'director',
    then: (schema) => schema.required('Director is required'),
    otherwise: (schema) => schema.optional(),
  }),
  expenseCategory: yup.string().when('entryType', {
    is: 'expense',
    then: (schema) => schema.required('Expense category is required'),
    otherwise: (schema) => schema.optional(),
  }),
  expenseType: yup.string().when('entryType', {
    is: 'expense',
    then: (schema) => schema.required('Expense type is required'),
    otherwise: (schema) => schema.optional(),
  }),
  contractorId: yup.string().optional(),
  destinationType: yup.string().oneOf(['till', 'director', 'vendor'], 'Invalid till type').required('Till type is required'),
  destinationDirectorId: yup.string().when('destinationType', {
    is: 'director',
    then: (schema) => schema.required('Destination director is required'),
    otherwise: (schema) => schema.optional(),
  }),
  destinationVendorId: yup.string().when('destinationType', {
    is: 'vendor',
    then: (schema) => schema.required('Destination vendor is required'),
    otherwise: (schema) => schema.optional(),
  }),
  entryClearStatus: yup.string().oneOf(['pending', 'cleared', 'rejected'], 'Invalid clear status').required('Clear status is required'),
  status: yup.string().oneOf(['draft', 'active', 'inactive'], 'Invalid status').required('Status is required'),
  notes: yup.string().optional(),
});

export type DailyEntryFormData = yup.InferType<typeof dailyEntryFormValidationSchema>;
