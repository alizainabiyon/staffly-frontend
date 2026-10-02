import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { tillAPI } from '@/lib/services/api';
import { TillResponse } from '@/lib/types';

interface TillState {
  till: any[];
  allTransactions: any[];
  totalBalance: number;
  totalCash: number;
  totalBank: number;
  loading: boolean;
  error: string | null;
}

const initialState: TillState = {
  till: [],
  allTransactions: [],
  totalBalance: 0,
  totalCash: 0,
  totalBank: 0,
  loading: false,
  error: null,
};

// Async thunk for fetching till data
export const fetchTillData = createAsyncThunk(
  'till/fetchTillData',
  async (filters: { ledgerType?: string; directorId?: string } = {}, { rejectWithValue }) => {
    try {
      
      const response = await tillAPI.get(filters);
      
      return response.response.data;
    } catch (error: any) {
      console.error('Till API error:', error);
      return rejectWithValue(error.message || 'Failed to fetch till data');
    }
  }
);


const tillSlice = createSlice({
  name: 'till',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTillData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTillData.fulfilled, (state, action: PayloadAction<TillResponse>) => {
        state.loading = false;
        state.till = action.payload.till;
        state.allTransactions = action.payload.allTransactions;
        state.totalBalance = action.payload.totalBalance;
        state.totalCash = action.payload.totalCash;
        state.totalBank = action.payload.totalBank;
        state.error = null;
      })
      .addCase(fetchTillData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLoading, clearError } = tillSlice.actions;
export default tillSlice.reducer;