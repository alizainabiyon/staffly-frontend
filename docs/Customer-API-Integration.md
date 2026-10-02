# Customer API Integration

## Overview

This document describes the complete implementation of customer management functionality with proper API integration, following the same pattern used for employee management.

## API Endpoints

The following endpoints are used for customer management:

- **Create Customer**: `POST /customer/create`
- **Get All Customers**: `GET /customer/get-all-customers`
- **Update Customer**: `PUT /customer/update`
- **Delete Customer**: `DELETE /customer/delete`
- **Get Customer by ID**: `GET /customer/get-customer-by-id`
- **Get Customer Ledger**: `GET /customer/ledger`

## File Structure

```
lib/
├── services/
│   └── api.ts (updated with customerAPI)
├── store/
│   └── slices/
│       └── crmSlice.ts (completely rewritten with async thunks)
├── types/
│   └── index.ts (Customer interface)
├── validation/
│   └── customerFormValidation.ts (new validation schema)
└── utils/
    └── constants.ts (updated API endpoints)

components/
└── crm/
    ├── AddCustomerForm.tsx (updated to use custom hook)
    ├── CustomerManagement.tsx (new management component)
    └── CustomerDetailView.tsx (existing)

hooks/
└── useCustomerForm.ts (new custom hook)

app/
└── dashboard/
    └── crm/
        └── customers/
            └── page.tsx (updated to use CustomerManagement)
```

## Key Components

### 1. Customer API Service (`lib/services/api.ts`)

```typescript
export const customerAPI = {
  getAll: (filters?: FilterOptions) =>
    apiClient.get(API_ENDPOINTS.CUSTOMERS.LIST, filters),
  
  getById: (id: string) =>
    apiClient.get(API_ENDPOINTS.CUSTOMERS.GET, { customerId: id }),
  
  create: (customerData: any) =>
    apiClient.post(API_ENDPOINTS.CUSTOMERS.CREATE, customerData),
  
  update: (customerData: any) =>
    apiClient.put(API_ENDPOINTS.CUSTOMERS.UPDATE, customerData),
  
  delete: (id: string) =>
    apiClient.delete(`${API_ENDPOINTS.CUSTOMERS.DELETE}?customerId=${id}`),
  
  getLedger: (id: string, filters?: FilterOptions) =>
    apiClient.get(API_ENDPOINTS.CUSTOMERS.LEDGER, { customerId: id, ...filters }),
};
```

### 2. Customer Slice (`lib/store/slices/crmSlice.ts`)

The slice includes:
- **State management** for customers, loading, error, filters, and pagination
- **Async thunks** for all CRUD operations
- **Reducers** for local state updates
- **Extra reducers** to handle async thunk states

Key async thunks:
- `fetchCustomers` - Get all customers with pagination and filters
- `fetchCustomerById` - Get single customer by ID
- `createCustomer` - Create new customer
- `updateCustomer` - Update existing customer
- `deleteCustomer` - Delete customer

### 3. Validation Schema (`lib/validation/customerFormValidation.ts`)

Comprehensive validation using Yup:
- Required fields: name, phone, company, address, status, customerType
- Email validation for optional email field
- Phone number format validation (Pakistani format)
- Length constraints for text fields
- Conditional validation for business customers

### 4. Custom Hook (`hooks/useCustomerForm.ts`)

Manages form state and API calls:
- Integrates with Redux store
- Handles both create and update operations
- Manages loading states
- Provides error handling and success notifications

### 5. Customer Management Component (`components/crm/CustomerManagement.tsx`)

Complete customer management interface:
- **Search and filtering** by status, customer type, and text search
- **Customer list** with pagination
- **Add/Edit forms** using the AddCustomerForm component
- **Delete functionality** with confirmation
- **Real-time updates** from Redux store

### 6. Updated AddCustomerForm (`components/crm/AddCustomerForm.tsx`)

- Uses the custom hook for form management
- Integrates with Redux store for API calls
- Maintains the existing UI structure
- Handles both create and edit modes

## Usage Examples

### Creating a Customer

```typescript
import { useCustomerForm } from '@/hooks/useCustomerForm';

const { formik, isSubmitting } = useCustomerForm({
  customer: null, // null for new customer
  onSubmit: (customerData) => {
    // Handle successful creation
    console.log('Customer created:', customerData);
  },
  onClose: () => {
    // Close form or navigate away
  },
});
```

### Fetching Customers

```typescript
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchCustomers, setFilters } from '@/lib/store/slices/crmSlice';

const dispatch = useAppDispatch();
const { customers, loading, pagination } = useAppSelector((state) => state.crm);

// Fetch customers with filters
useEffect(() => {
  dispatch(fetchCustomers({ 
    search: 'company name',
    status: 'active',
    page: 1,
    limit: 20 
  }));
}, [dispatch]);

// Update filters
const handleSearch = (searchTerm: string) => {
  dispatch(setFilters({ search: searchTerm, page: 1 }));
};
```

### Deleting a Customer

```typescript
import { deleteCustomer } from '@/lib/store/slices/crmSlice';

const handleDelete = async (customerId: string) => {
  try {
    await dispatch(deleteCustomer(customerId)).unwrap();
    toast.success('Customer deleted successfully');
  } catch (error: any) {
    toast.error(error.message || 'Failed to delete customer');
  }
};
```

## State Management

The customer state is managed in the Redux store with the following structure:

```typescript
interface CRMState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## Error Handling

- **API errors** are caught and displayed as toast notifications
- **Validation errors** are shown inline in the form
- **Network errors** trigger retry mechanisms
- **Loading states** prevent multiple submissions

## Security

- **JWT tokens** are automatically included in all API requests
- **Token refresh** is handled automatically on 401 responses
- **Input validation** prevents malicious data submission

## Testing

The implementation follows the same testing patterns as the employee management:
- **Unit tests** for validation schemas
- **Integration tests** for API calls
- **Component tests** for UI interactions
- **Redux tests** for state management

## Future Enhancements

1. **Bulk operations** (import/export, bulk delete)
2. **Advanced filtering** (date ranges, custom fields)
3. **Customer analytics** (order history, payment patterns)
4. **Integration** with other modules (orders, invoices)
5. **Real-time updates** using WebSocket connections

## Troubleshooting

### Common Issues

1. **API 401 errors**: Check JWT token validity and refresh mechanism
2. **Form validation errors**: Verify validation schema matches form fields
3. **State not updating**: Check Redux store configuration and async thunk handling
4. **Type errors**: Ensure Customer interface matches API response structure

### Debug Steps

1. Check browser console for API request/response logs
2. Verify Redux DevTools for state changes
3. Confirm API endpoints are accessible
4. Validate JWT token in request headers
