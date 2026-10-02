import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { invoiceAPI } from '@/lib/services/api';
import { Invoice } from '@/lib/types';

interface InvoiceState {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: InvoiceState = {
  invoices: [],
  selectedInvoice: null,
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
export const fetchInvoices = createAsyncThunk(
  'invoice/fetchInvoices',
  async (filters: any, thunkAPI) => {
    try {
      // Filter out "all" status and empty values
      const apiFilters = { ...filters };
      if (apiFilters.status === 'all') {
        delete apiFilters.status;
      }
      if (!apiFilters.customerId) {
        delete apiFilters.customerId;
      }
      if (!apiFilters.contractorId) {
        delete apiFilters.contractorId;
      }
      if (!apiFilters.search) {
        delete apiFilters.search;
      }
      
      const response = await invoiceAPI.getAll(apiFilters);
      const result = response.response.data;
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch invoices');
    }
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoice/fetchInvoiceById',
  async (invoiceId: string, { rejectWithValue }) => {
    try {
      const response = await invoiceAPI.getById(invoiceId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Invoice not found');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch invoice');
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoice/createInvoice',
  async (invoiceData: any, { rejectWithValue, dispatch }) => {
    try {
      const response = await invoiceAPI.create(invoiceData);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to create invoice');
      }
      
      // Invalidate invoices list cache
      dispatch(fetchInvoices({}));
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create invoice');
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'invoice/updateInvoice',
  async (invoiceData: any, { rejectWithValue, dispatch }) => {
    try {
      let { items, ...rest } = invoiceData;
      const sanitizedItems = items.map(({_id, ...item}: any) => item);
      const response = await invoiceAPI.update({...rest, items: sanitizedItems});
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to update invoice');
      }
      
      // Invalidate invoices list cache
      dispatch(fetchInvoices({}));
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update invoice');
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoice/deleteInvoice',
  async (invoiceId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await invoiceAPI.delete(invoiceId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to delete invoice');
      }
      
      // Invalidate invoices list cache
      dispatch(fetchInvoices({}));
      
      return invoiceId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete invoice');
    }
  }
);

export const approveInvoice = createAsyncThunk(
  'invoice/approveInvoice',
  async (invoiceId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await invoiceAPI.approve(invoiceId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to approve invoice');
      }
      
      // Invalidate invoices list cache
      dispatch(fetchInvoices({}));
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to approve invoice');
    }
  }
);

export const markInvoicePaid = createAsyncThunk(
  'invoice/markInvoicePaid',
  async ({ invoiceId, paymentData }: { invoiceId: string; paymentData: any }, { rejectWithValue, dispatch }) => {
    try {
      const response = await invoiceAPI.markPaid(invoiceId, paymentData);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to mark invoice as paid');
      }
      
      // Invalidate invoices list cache
      dispatch(fetchInvoices({}));
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark invoice as paid');
    }
  }
);

export const sendInvoice = createAsyncThunk(
  'invoice/sendInvoice',
  async (invoiceId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await invoiceAPI.send(invoiceId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to send invoice');
      }
      
      // Invalidate invoices list cache
      dispatch(fetchInvoices({}));
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send invoice');
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setSelectedInvoice: (state, action: PayloadAction<Invoice | null>) => {
      state.selectedInvoice = action.payload;
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
      // Fetch invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.invoices || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 1,
        };
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch invoice by ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create invoice
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.unshift(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update invoice
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.invoices.findIndex(i => i.invoiceId === action.payload.invoiceId);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.selectedInvoice?.invoiceId === action.payload.invoiceId) {
          state.selectedInvoice = action.payload;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.filter(i => i.invoiceId !== action.payload);
        if (state.selectedInvoice?.invoiceId === action.payload) {
          state.selectedInvoice = null;
        }
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Approve invoice
      .addCase(approveInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.invoices.findIndex(i => i.invoiceId === action.payload.invoiceId);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.selectedInvoice?.invoiceId === action.payload.invoiceId) {
          state.selectedInvoice = action.payload;
        }
      })
      .addCase(approveInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Mark invoice as paid
      .addCase(markInvoicePaid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markInvoicePaid.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.invoices.findIndex(i => i.invoiceId === action.payload.invoiceId);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.selectedInvoice?.invoiceId === action.payload.invoiceId) {
          state.selectedInvoice = action.payload;
        }
      })
      .addCase(markInvoicePaid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Send invoice
      .addCase(sendInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.invoices.findIndex(i => i.invoiceId === action.payload.invoiceId);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.selectedInvoice?.invoiceId === action.payload.invoiceId) {
          state.selectedInvoice = action.payload;
        }
      })
      .addCase(sendInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedInvoice, clearError, setLoading } = invoiceSlice.actions;
export default invoiceSlice.reducer;
