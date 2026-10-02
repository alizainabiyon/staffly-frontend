import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Contractor, ContractorState, FilterOptions } from '@/lib/types/crm';
import { contractorAPI } from '@/lib/services/api';

const initialState: ContractorState = {
  contractors: [],
  selectedContractor: null,
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
export const fetchContractors = createAsyncThunk(
  'contractor/fetchContractors',
  async (_, thunkAPI) => {
    try {
      const response = await contractorAPI.getAll();
      const result = response.response.data;
      
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch contractors');
    }
  }
);

export const fetchContractorById = createAsyncThunk(
  'contractor/fetchContractorById',
  async (contractorId: string, { rejectWithValue }) => {
    try {
      const response = await contractorAPI.getById(contractorId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Contractor not found');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch contractor');
    }
  }
);

export const createContractor = createAsyncThunk(
  'contractor/createContractor',
  async (contractorData: Omit<Contractor, '_id' | 'contractorId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'userID'>, { rejectWithValue }) => {
    try {
      const response = await contractorAPI.create(contractorData);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to create contractor');
      }
      
      // Return both the data and the success message
      return {
        data: response.response.data,
        message: response.response.message || 'Contractor created successfully'
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create contractor');
    }
  }
);

export const updateContractor = createAsyncThunk(
  'contractor/updateContractor',
  async (data: Partial<Contractor>, { rejectWithValue }) => {
    try {
      const response = await contractorAPI.update(data);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to update contractor');
      }
      
      // Return both the data and the success message
      return {
        data: response.response.data,
        message: response.response.message || 'Contractor updated successfully'
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update contractor');
    }
  }
);

export const deleteContractor = createAsyncThunk(
  'contractor/deleteContractor',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await contractorAPI.delete(id);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to delete contractor');
      }
      
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete contractor');
    }
  }
);

const contractorSlice = createSlice({
  name: 'contractor',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedContractor: (state, action: PayloadAction<Contractor | null>) => {
      state.selectedContractor = action.payload;
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
    updateContractorInList: (state, action: PayloadAction<Contractor>) => {
      const index = state.contractors.findIndex(contractor => contractor.contractorId === action.payload.contractorId);
      if (index !== -1) {
        state.contractors[index] = action.payload;
      }
    },
    removeContractorFromList: (state, action: PayloadAction<string>) => {
      state.contractors = state.contractors.filter(contractor => contractor.contractorId !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch contractors
    builder
      .addCase(fetchContractors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractors.fulfilled, (state, action) => {
        state.loading = false;
        state.contractors = action.payload.contractors || [];
        if (action.payload.pagination) {
          state.pagination = {
            page: action.payload.pagination.currentPage,
            limit: action.payload.pagination.limit,
            total: action.payload.pagination.totalCount,
            totalPages: action.payload.pagination.totalPages,
          };
        }
        state.error = null;
      })
      .addCase(fetchContractors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch contractor by ID
    builder
      .addCase(fetchContractorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedContractor = action.payload as Contractor;
        state.error = null;
      })
      .addCase(fetchContractorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create contractor
    builder
      .addCase(createContractor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContractor.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the new response structure with data and message
        const payload = action.payload as { data: Contractor; message: string };
        if (payload.data) {
          state.contractors.unshift(payload.data);
        }
        state.error = null;
      })
      .addCase(createContractor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update contractor
    builder
      .addCase(updateContractor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContractor.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the new response structure with data and message
        const payload = action.payload as { data: Contractor; message: string };
        if (payload.data) {
          const index = state.contractors.findIndex(contractor => contractor.contractorId === payload.data.contractorId);
          if (index !== -1) {
            state.contractors[index] = payload.data;
          }
          if (state.selectedContractor?.contractorId === payload.data.contractorId) {
            state.selectedContractor = payload.data;
          }
        }
        state.error = null;
      })
      .addCase(updateContractor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete contractor
    builder
      .addCase(deleteContractor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContractor.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload as string;
        state.contractors = state.contractors.filter(contractor => contractor.contractorId !== deletedId);
        if (state.selectedContractor?.contractorId === deletedId) {
          state.selectedContractor = null;
        }
        state.error = null;
      })
      .addCase(deleteContractor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError,
  setSelectedContractor,
  setFilters,
  clearFilters,
  updateContractorInList,
  removeContractorFromList
} = contractorSlice.actions;

export default contractorSlice.reducer;
