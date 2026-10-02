import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Vendor, VendorState, FilterOptions } from '@/lib/types/crm';
import { vendorAPI } from '@/lib/services/api';

const initialState: VendorState = {
  vendors: [],
  selectedVendor: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '',
    type: '',
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
export const fetchVendors = createAsyncThunk(
  'vendor/fetchVendors',
  async (_, thunkAPI) => {
    try {
      const response = await vendorAPI.getAll();
      const result = response.response.data;
      
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch vendors');
    }
  }
);

export const fetchVendorById = createAsyncThunk(
  'vendor/fetchVendorById',
  async (vendorId: string, { rejectWithValue }) => {
    try {
      const response = await vendorAPI.getById(vendorId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Vendor not found');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch vendor');
    }
  }
);

export const createVendor = createAsyncThunk(
  'vendor/createVendor',
  async (vendorData: Omit<Vendor, '_id' | 'vendorId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'userID'>, { rejectWithValue }) => {
    try {
      const response = await vendorAPI.create(vendorData);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to create vendor');
      }
      
      // Return both the data and the success message
      return {
        data: response.response.data,
        message: response.response.message || 'Vendor created successfully'
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create vendor');
    }
  }
);

export const updateVendor = createAsyncThunk(
  'vendor/updateVendor',
  async (data: Partial<Vendor>, { rejectWithValue }) => {
    try {
      const response = await vendorAPI.update(data);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to update vendor');
      }
      
      // Return both the data and the success message
      return {
        data: response.response.data,
        message: response.response.message || 'Vendor updated successfully'
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update vendor');
    }
  }
);

export const deleteVendor = createAsyncThunk(
  'vendor/deleteVendor',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await vendorAPI.delete(id);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to delete vendor');
      }
      
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete vendor');
    }
  }
);

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedVendor: (state, action: PayloadAction<Vendor | null>) => {
      state.selectedVendor = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<FilterOptions>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        status: '',
        type: '',
        sortBy: 'name',
        sortOrder: 'asc',
        page: 1,
        limit: 20,
      };
    },
    updateVendorInList: (state, action: PayloadAction<Vendor>) => {
      const index = state.vendors.findIndex(vendor => vendor.vendorId === action.payload.vendorId);
      if (index !== -1) {
        state.vendors[index] = action.payload;
      }
    },
    removeVendorFromList: (state, action: PayloadAction<string>) => {
      state.vendors = state.vendors.filter(vendor => vendor.vendorId !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch vendors
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload.vendors || [];
        if (action.payload.pagination) {
          state.pagination = {
            page: action.payload.pagination.page,
            limit: action.payload.pagination.limit,
            total: action.payload.pagination.total,
            totalPages: action.payload.pagination.pages,
          };
        }
        state.error = null;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch vendor by ID
    builder
      .addCase(fetchVendorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVendor = action.payload as Vendor;
        state.error = null;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create vendor
    builder
      .addCase(createVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the new response structure with data and message
        const payload = action.payload as { data: Vendor; message: string };
        if (payload.data) {
          state.vendors.unshift(payload.data);
        }
        state.error = null;
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update vendor
    builder
      .addCase(updateVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the new response structure with data and message
        const payload = action.payload as { data: Vendor; message: string };
        if (payload.data) {
          const index = state.vendors.findIndex(vendor => vendor.vendorId === payload.data.vendorId);
          if (index !== -1) {
            state.vendors[index] = payload.data;
          }
          if (state.selectedVendor?.vendorId === payload.data.vendorId) {
            state.selectedVendor = payload.data;
          }
        }
        state.error = null;
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete vendor
    builder
      .addCase(deleteVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload as string;
        state.vendors = state.vendors.filter(vendor => vendor.vendorId !== deletedId);
        if (state.selectedVendor?.vendorId === deletedId) {
          state.selectedVendor = null;
        }
        state.error = null;
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError,
  setSelectedVendor,
  setFilters,
  clearFilters,
  updateVendorInList,
  removeVendorFromList
} = vendorSlice.actions;

export default vendorSlice.reducer;
