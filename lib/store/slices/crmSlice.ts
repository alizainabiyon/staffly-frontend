import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Customer, CustomerState, FilterOptions } from '@/lib/types/crm';
import { customerAPI } from '@/lib/services/api';

interface CRMState extends CustomerState {}

const initialState: CRMState = {
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '',
    customerType: '',
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
export const fetchCustomers = createAsyncThunk(
  'crm/fetchCustomers',
  async (_, thunkAPI) => {
    try {
      const response = await customerAPI.getAll();
      const result = response.response.data;
      
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch customers');
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'crm/fetchCustomerById',
  async (customerId: string, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getById(customerId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Customer not found');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch customer');
    }
  }
);

export const createCustomer = createAsyncThunk(
  'crm/createCustomer',
  async (customerData: Omit<Customer, 'customerId' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await customerAPI.create(customerData);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to create customer');
      }
      
      // Return both the data and the success message
      return {
        data: response.response.data,
        message: response.response.message || 'Customer created successfully'
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create customer');
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'crm/updateCustomer',
  async (data: Partial<Customer>, { rejectWithValue }) => {
    try {
      const response = await customerAPI.update(data);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to update customer');
      }
      
      // Return both the data and the success message
      return {
        data: response.response.data,
        message: response.response.message || 'Customer updated successfully'
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update customer');
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'crm/deleteCustomer',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await customerAPI.delete(id);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to delete customer');
      }
      
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete customer');
    }
  }
);

const crmSlice = createSlice({
  name: 'crm',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomer = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<FilterOptions>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        status: '',
        customerType: '',
        sortBy: 'name',
        sortOrder: 'asc',
        page: 1,
        limit: 20,
      };
    },
    updateCustomerInList: (state, action: PayloadAction<Customer>) => {
      const index = state.customers.findIndex(cust => cust.customerId === action.payload.customerId);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    removeCustomerFromList: (state, action: PayloadAction<string>) => {
      state.customers = state.customers.filter(cust => cust.customerId !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch customers
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload as Customer[];
        state.error = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch customer by ID
    builder
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        // The response now includes customer, ledger, and invoices data
        // We need to merge the customer data with the ledger and invoices data
        const customerData = action.payload.customer;
        const ledgerData = action.payload.ledger;
        const invoicesData = action.payload.invoices;
        const quotationsData = action.payload.quotations;
        
        if (customerData) {
          state.selectedCustomer = {
            ...customerData,
            ledger: ledgerData,
            invoices: invoicesData,
            quotations: quotationsData,
          };
        } else {
          state.selectedCustomer = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create customer
    builder
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the new response structure with data and message
        const payload = action.payload as { data: Customer; message: string };
        if (payload.data) {
          state.customers.unshift(payload.data);
        }
        state.error = null;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update customer
    builder
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the new response structure with data and message
        const payload = action.payload as { data: Customer; message: string };
        if (payload.data) {
          const index = state.customers.findIndex(cust => cust.customerId === payload.data.customerId);
          if (index !== -1) {
            state.customers[index] = payload.data;
          }
          if (state.selectedCustomer?.customerId === payload.data.customerId) {
            state.selectedCustomer = payload.data;
          }
        }
        state.error = null;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete customer
    builder
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload as string;
        state.customers = state.customers.filter(cust => cust.customerId !== deletedId);
        if (state.selectedCustomer?.customerId === deletedId) {
          state.selectedCustomer = null;
        }
        state.error = null;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError,
  setSelectedCustomer,
  setFilters,
  clearFilters,
  updateCustomerInList,
  removeCustomerFromList
} = crmSlice.actions;

export default crmSlice.reducer;