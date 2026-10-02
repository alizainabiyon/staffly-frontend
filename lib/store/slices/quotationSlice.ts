import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { quotationAPI } from '@/lib/services/api';
import { Quotation } from '@/lib/types';

interface QuotationState {
  quotations: Quotation[];
  selectedQuotation: Quotation | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: QuotationState = {
  quotations: [],
  selectedQuotation: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  },
};

// Async thunks
export const fetchQuotations = createAsyncThunk(
  'quotation/fetchQuotations',
  async (filters: any, thunkAPI) => {
    try {
      const response = await quotationAPI.getAll(filters);
      const result = response.response.data;
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch quotations');
    }
  }
);

export const fetchQuotationById = createAsyncThunk(
  'quotation/fetchQuotationById',
  async (quotationId: string, { rejectWithValue }) => {
    try {
      const response = await quotationAPI.getById(quotationId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Quotation not found');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch quotation');
    }
  }
);

export const createQuotation = createAsyncThunk(
  'quotation/createQuotation',
  async (quotationData: any, { rejectWithValue, dispatch }) => {
    try {
      const response = await quotationAPI.create(quotationData);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to create quotation');
      }
      
      // Invalidate quotations list cache
      dispatch(fetchQuotations({}));
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create quotation');
    }
  }
);

export const updateQuotation = createAsyncThunk(
  'quotation/updateQuotation',
  async (quotationData: any, { rejectWithValue, dispatch }) => {
    try {
      let { items, ...rest } = quotationData;
      const sanitizedItems = items.map(({_id, ...item}: any) => item);
      const response = await quotationAPI.update({...rest, items: sanitizedItems});
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to update quotation');
      }
      
      // Invalidate quotations list cache
      dispatch(fetchQuotations({}));
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update quotation');
    }
  }
);

export const deleteQuotation = createAsyncThunk(
  'quotation/deleteQuotation',
  async (quotationId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await quotationAPI.delete(quotationId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to delete quotation');
      }
      
      // Invalidate quotations list cache
      dispatch(fetchQuotations({}));
      
      return quotationId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete quotation');
    }
  }
);

export const convertToInvoice = createAsyncThunk(
  'quotation/convertToInvoice',
  async (quotationId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await quotationAPI.convertToInvoice(quotationId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to convert quotation to invoice');
      }
      
      // Invalidate both quotations and invoices list cache
      dispatch(fetchQuotations({}));
      // Note: We need to import fetchInvoices from invoiceSlice to dispatch it here
      // For now, the invoice list will be refreshed when user navigates to it
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to convert quotation to invoice');
    }
  }
);

const quotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    setSelectedQuotation: (state, action: PayloadAction<Quotation | null>) => {
      state.selectedQuotation = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch quotations
      .addCase(fetchQuotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotations.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations = action.payload.quotations || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 1,
        };
      })
      .addCase(fetchQuotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch quotation by ID
      .addCase(fetchQuotationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedQuotation = action.payload;
      })
      .addCase(fetchQuotationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create quotation
      .addCase(createQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations.unshift(action.payload);
      })
      .addCase(createQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update quotation
      .addCase(updateQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuotation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.quotations.findIndex(q => q.quotationId === action.payload.quotationId);
        if (index !== -1) {
          state.quotations[index] = action.payload;
        }
        if (state.selectedQuotation?.quotationId === action.payload.quotationId) {
          state.selectedQuotation = action.payload;
        }
      })
      .addCase(updateQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete quotation
      .addCase(deleteQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations = state.quotations.filter(q => q.quotationId !== action.payload);
        if (state.selectedQuotation?.quotationId === action.payload) {
          state.selectedQuotation = null;
        }
      })
      .addCase(deleteQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Convert to invoice
      .addCase(convertToInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(convertToInvoice.fulfilled, (state, action) => {
        state.loading = false;
        // Update the quotation status to converted
        const quotationId = action.payload?.quotationId;
        if (quotationId) {
          const index = state.quotations.findIndex(q => q.quotationId === quotationId);
          if (index !== -1) {
            state.quotations[index].status = 'converted';
          }
          if (state.selectedQuotation && state.selectedQuotation.quotationId === quotationId) {
            state.selectedQuotation.status = 'converted';
          }
        }
      })
      .addCase(convertToInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedQuotation, clearError, setLoading } = quotationSlice.actions;
export default quotationSlice.reducer;
