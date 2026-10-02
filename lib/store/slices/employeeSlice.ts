import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Employee, FilterOptions, ApiSuccessResponse } from '../../types';
import { employeeAPI } from '../../services/api';

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
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

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '',
    department: '',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 20,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (filters: FilterOptions | undefined, thunkAPI) => {
    try {
      const response = await employeeAPI.getAll(filters);
      
      // Handle the actual backend response structure
      const backendResponse = response as unknown as {
        status: { code: number; success: boolean };
        response: {
          message: string;
          data: {
            employees: Array<Employee & { _id: string }>;
            pagination: {
              currentPage: number;
              totalPages: number;
              totalCount: number;
              limit: number;
              hasNextPage: boolean;
              hasPrevPage: boolean;
            };
          };
        };
      };
      // if (!backendResponse.response?.status?.success) {
      //   throw new Error(backendResponse.response?.status?.message || 'Failed to fetch employees');
      // }
      
      const rawEmployees = backendResponse.response.data.employees || [];
      const pagination = backendResponse.response.data.pagination;
      
      const result = {
        rawEmployees,
        pagination: {
          page: pagination?.currentPage || filters?.page || 1,
          limit: pagination?.limit || filters?.limit || 20,
          total: pagination?.totalCount || 0,
          totalPages: pagination?.totalPages || 0,
        },
      };
      
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch employees');
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchEmployeeById',
  async (employeeId: string, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.getById(employeeId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Employee not found');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch employee');
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.create(employeeData);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to create employee');
      }
      // Return both the data and the success message
      return {
        data: response.response.data,
        message: response.response.message || 'Employee created successfully'
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create employee');
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async (data: Partial<Employee>, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.update(data);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to update employee');
      }
      
      // Return both the data and the success message
      return {
        data: response.response.data,
        message: response.response.message || 'Employee updated successfully'
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update employee');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.delete(id);
      
      if (!response.response.data.status.success) {
        throw new Error(response.response.data.status.message || 'Failed to delete employee');
      }
      
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete employee');
    }
  }
);

export const bulkImportEmployees = createAsyncThunk(
  'employees/bulkImport',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.bulkImport(file);
      
        if (!response.response.data.status.success) {
        throw new Error(response.response.data.status.message || 'Failed to import employees');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to import employees');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.selectedEmployee = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<FilterOptions>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        status: '',
        department: '',
        sortBy: 'name',
        sortOrder: 'asc',
        page: 1,
        limit: 20,
      };
    },
    updateEmployeeInList: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    removeEmployeeFromList: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(emp => emp.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch employees
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = Array.isArray(action.payload.rawEmployees) ? action.payload.rawEmployees : [];
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch employee by ID
    builder
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        const employeeData = action.payload;
        state.selectedEmployee = employeeData;
        state.error = null;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create employee
    builder
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the new response structure with data and message
        const payload = action.payload as { data: Employee; message: string };
        if (payload.data) {
          state.employees.unshift(payload.data);
        }
        state.error = null;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update employee
    builder
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the new response structure with data and message
        const payload = action.payload as { data: Employee; message: string };
        if (payload.data) {
          const updatedEmployee = payload.data;
          const index = state.employees.findIndex(emp => emp.id === updatedEmployee.id);
          if (index !== -1) {
            state.employees[index] = updatedEmployee;
          }
          if (state.selectedEmployee?.id === updatedEmployee.id) {
            state.selectedEmployee = updatedEmployee;
          }
        }
        state.error = null;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete employee
    builder
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(emp => emp.id !== action.payload);
        if (state.selectedEmployee?.id === action.payload) {
          state.selectedEmployee = null;
        }
        state.error = null;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Bulk import
    builder
      .addCase(bulkImportEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkImportEmployees.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as { employees: Employee[] };
        state.employees = [...payload.employees, ...state.employees];
        state.error = null;
      })
      .addCase(bulkImportEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setSelectedEmployee,
  setFilters,
  clearFilters,
  updateEmployeeInList,
  removeEmployeeFromList,
} = employeeSlice.actions;

export default employeeSlice.reducer;

// Selectors
export const selectEmployees = (state: { employees: EmployeeState }) => state.employees.employees;
export const selectSelectedEmployee = (state: { employees: EmployeeState }) => state.employees.selectedEmployee;
export const selectEmployeeLoading = (state: { employees: EmployeeState }) => state.employees.loading;
export const selectEmployeeError = (state: { employees: EmployeeState }) => state.employees.error;
export const selectEmployeeFilters = (state: { employees: EmployeeState }) => state.employees.filters;
export const selectEmployeePagination = (state: { employees: EmployeeState }) => state.employees.pagination;

// Computed selectors
export const selectActiveEmployees = (state: { employees: EmployeeState }) => 
  state.employees.employees.filter(emp => emp.status === 'active');

export const selectEmployeesByDepartment = (state: { employees: EmployeeState }) => {
  const employees = state.employees.employees;
  return employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = [];
    }
    acc[emp.department].push(emp);
    return acc;
  }, {} as Record<string, Employee[]>);
};

export const selectEmployeeStats = (state: { employees: EmployeeState }) => {
  const employees = state.employees.employees;
  return {
    total: employees.length,
    active: employees.filter(emp => emp.status === 'active').length,
    inactive: employees.filter(emp => emp.status === 'inactive').length,
    terminated: employees.filter(emp => emp.status === 'terminated').length,
    averageSalary: employees.length > 0 
      ? employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length 
      : 0,
    totalSalaryExpense: employees
      .filter(emp => emp.status === 'active')
      .reduce((sum, emp) => sum + emp.salary, 0),
  };
};