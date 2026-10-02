import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { vendorOrderAPI } from '@/lib/services/api';
import { VendorOrder } from '@/lib/types';

interface VendorOrderState {
  vendorOrders: VendorOrder[];
  selectedVendorOrder: VendorOrder | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: VendorOrderState = {
  vendorOrders: [],
  selectedVendorOrder: null,
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
export const fetchVendorOrders = createAsyncThunk(
  'vendorOrder/fetchVendorOrders',
  async (filters: any, thunkAPI) => {
    try {
      const response = await vendorOrderAPI.getAll(filters);
      const result = response.response.data;
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch vendor orders');
    }
  }
);

export const fetchVendorOrderById = createAsyncThunk(
  'vendorOrder/fetchVendorOrderById',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await vendorOrderAPI.getById(orderId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Vendor order not found');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch vendor order');
    }
  }
);

export const createVendorOrder = createAsyncThunk(
  'vendorOrder/createVendorOrder',
  async (vendorOrderData: any, { rejectWithValue }) => {
    try {
      const response = await vendorOrderAPI.create(vendorOrderData);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to create vendor order');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create vendor order');
    }
  }
);

export const updateVendorOrder = createAsyncThunk(
  'vendorOrder/updateVendorOrder',
  async (vendorOrderData: any, { rejectWithValue }) => {
    try {
      let { items, ...rest } = vendorOrderData;
      const sanitizedItems = items.map(({_id, ...item}: any) => item);
      const response = await vendorOrderAPI.update({...rest, items: sanitizedItems});
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to update vendor order');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update vendor order');
    }
  }
);

export const deleteVendorOrder = createAsyncThunk(
  'vendorOrder/deleteVendorOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await vendorOrderAPI.delete(orderId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to delete vendor order');
      }
      
      return orderId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete vendor order');
    }
  }
);

export const approveVendorOrder = createAsyncThunk(
  'vendorOrder/approveVendorOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await vendorOrderAPI.approve(orderId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to approve vendor order');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to approve vendor order');
    }
  }
);

const vendorOrderSlice = createSlice({
  name: 'vendorOrder',
  initialState,
  reducers: {
    setSelectedVendorOrder: (state, action: PayloadAction<VendorOrder | null>) => {
      state.selectedVendorOrder = action.payload;
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
      // Fetch vendor orders
      .addCase(fetchVendorOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorOrders = action.payload || [];
        state.pagination = {
          page: 1,
          limit: 10,
          total: action.payload?.length || 0,
          pages: 1,
        };
      })
      .addCase(fetchVendorOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch vendor order by ID
      .addCase(fetchVendorOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVendorOrder = action.payload;
      })
      .addCase(fetchVendorOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create vendor order
      .addCase(createVendorOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVendorOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorOrders.unshift(action.payload);
      })
      .addCase(createVendorOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update vendor order
      .addCase(updateVendorOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendorOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.vendorOrders.findIndex(o => o.orderId === action.payload.orderId);
        if (index !== -1) {
          state.vendorOrders[index] = action.payload;
        }
        if (state.selectedVendorOrder?.orderId === action.payload.orderId) {
          state.selectedVendorOrder = action.payload;
        }
      })
      .addCase(updateVendorOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
             // Delete vendor order
       .addCase(deleteVendorOrder.pending, (state) => {
         state.loading = true;
         state.error = null;
       })
       .addCase(deleteVendorOrder.fulfilled, (state, action) => {
         state.loading = false;
         state.vendorOrders = state.vendorOrders.filter(o => o.orderId !== action.payload);
         if (state.selectedVendorOrder?.orderId === action.payload) {
           state.selectedVendorOrder = null;
         }
       })
       .addCase(deleteVendorOrder.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload as string;
       })
       
       // Approve vendor order
       .addCase(approveVendorOrder.pending, (state) => {
         state.loading = true;
         state.error = null;
       })
       .addCase(approveVendorOrder.fulfilled, (state, action) => {
         state.loading = false;
         const index = state.vendorOrders.findIndex(o => o.orderId === action.payload.orderId);
         if (index !== -1) {
           state.vendorOrders[index] = action.payload;
         }
         if (state.selectedVendorOrder?.orderId === action.payload.orderId) {
           state.selectedVendorOrder = action.payload;
         }
       })
       .addCase(approveVendorOrder.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload as string;
       });
  },
});

export const { setSelectedVendorOrder, clearError, setLoading } = vendorOrderSlice.actions;
export default vendorOrderSlice.reducer;
