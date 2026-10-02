# RTK Integration with Employee Form

## Overview

This document shows how to integrate the refactored `AddEmployeeForm` with Redux Toolkit (RTK) to create employees using the actual API endpoints.

## Key Changes Made

### 1. Updated Employee Slice (`lib/store/slices/employeeSlice.ts`)

**Before (Mock Data):**
```typescript
export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const employee = mockDB.createEmployee(employeeData);
      return employee;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create employee');
    }
  }
);
```

**After (Real API):**
```typescript
export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.create(employeeData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create employee');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create employee');
    }
  }
);
```

### 2. Updated Custom Hook (`hooks/useEmployeeForm.ts`)

**Added RTK Integration:**
```typescript
import { useAppDispatch } from '@/lib/hooks';
import { createEmployee } from '@/lib/store/slices/employeeSlice';

export const useEmployeeForm = ({ employee, onSubmit, onClose }: UseEmployeeFormProps) => {
  const dispatch = useAppDispatch();
  
  // ... other code ...
  
  const formik = useFormik<EmployeeFormValues>({
    // ... other config ...
    onSubmit: async (values) => {
      const employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'> = {
        // ... form data preparation ...
      };

      try {
        const result = await dispatch(createEmployee(employeeData)).unwrap();
        onSubmit(result as Employee);
        onClose();
        resetForm();
        toast.success(employee ? 'Employee updated successfully' : 'Employee added successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to save employee');
      }
    },
  });
};
```

## Usage Example

### 1. In Your Component

```typescript
import { AddEmployeeForm } from '@/components/payroll/AddEmployeeForm';
import { useAppDispatch } from '@/lib/hooks';
import { createEmployee } from '@/lib/store/slices/employeeSlice';

export function PayrollPage() {
  const dispatch = useAppDispatch();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await dispatch(createEmployee(employeeData)).unwrap();
      setIsAddDialogOpen(false);
      toast.success('Employee added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add employee');
    }
  };

  return (
    <div>
      <Button onClick={() => setIsAddDialogOpen(true)}>
        Add Employee
      </Button>
      
      <AddEmployeeForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddEmployee}
      />
    </div>
  );
}
```

### 2. API Endpoint Configuration

Make sure your API endpoints are properly configured in `lib/services/api.ts`:

```typescript
export const employeeAPI = {
  create: (employeeData: any) =>
    apiClient.post(API_ENDPOINTS.EMPLOYEES.CREATE, employeeData),
  
  update: (id: string, employeeData: any) =>
    apiClient.put(API_ENDPOINTS.EMPLOYEES.UPDATE.replace(':id', id), employeeData),
  
  delete: (id: string) =>
    apiClient.delete(API_ENDPOINTS.EMPLOYEES.DELETE.replace(':id', id)),
  
  // ... other methods
};
```

## Benefits of This Integration

### 1. **Real API Calls**
- No more mock data
- Actual HTTP requests to your backend
- Proper error handling

### 2. **State Management**
- Automatic loading states
- Error handling with toast notifications
- Optimistic updates

### 3. **Type Safety**
- Full TypeScript support
- Compile-time error checking
- Better developer experience

### 4. **Error Handling**
- Network errors are properly caught
- User-friendly error messages
- Graceful fallbacks

## Error Handling

The integration includes comprehensive error handling:

```typescript
try {
  const result = await dispatch(createEmployee(employeeData)).unwrap();
  // Success handling
} catch (error: any) {
  // Error handling with user-friendly messages
  toast.error(error.message || 'Failed to save employee');
}
```

## Loading States

RTK automatically provides loading states that you can use:

```typescript
const loading = useAppSelector(selectEmployeeLoading);

// In your component
{loading && <Spinner />}
```

## Testing

You can now test the actual API integration:

```typescript
// Test the async thunk
describe('createEmployee', () => {
  it('should create employee successfully', async () => {
    const employeeData = {
      name: 'Test Employee',
      email: 'test@example.com',
      // ... other required fields
    };
    
    const result = await dispatch(createEmployee(employeeData)).unwrap();
    expect(result).toHaveProperty('id');
  });
});
```

## Migration Checklist

- [ ] Update employee slice to use real API
- [ ] Update custom hook to dispatch RTK actions
- [ ] Configure API endpoints
- [ ] Test error handling
- [ ] Update components to use RTK selectors
- [ ] Add loading states where needed

## Conclusion

This integration provides a robust, type-safe way to create employees using RTK and real API endpoints. The refactored form components work seamlessly with the Redux store, providing excellent user experience with proper loading states and error handling. 