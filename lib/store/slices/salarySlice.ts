import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SalarySlip, ApiSuccessResponse } from '../../types';
import { payrollAPI } from '../../services/api';

interface SalaryState {
  salaryHistory: SalarySlip[];
  loading: boolean;
  error: string | null;
  selectedMonth: number;
  selectedYear: number;
}

const currentDate = new Date();
const initialState: SalaryState = {
  salaryHistory: [],
  loading: false,
  error: null,
  selectedMonth: currentDate.getMonth() + 1,
  selectedYear: currentDate.getFullYear(),
};

// Async thunk for fetching salary history
export const fetchSalaryHistory = createAsyncThunk(
  'salary/fetchSalaryHistory',
  async ({ month, year }: { month: number; year: number }, thunkAPI) => {
    try {
      const response = await payrollAPI.getSalaryHistory(month, year);
      
      if (response.status.success && response.response.data) {
        return {
          data: response.response.data,
          month,
          year,
        };
      }
      
      // If not successful, throw with the backend message
      throw new Error(
        response.response?.message || 
        'Failed to fetch salary history'
      );
      
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch salary history');
    }
  }
);

// Async thunk for disbursing salary
export const disburseSalary = createAsyncThunk(
  'salary/disburseSalary',
  async (disbursementData: {
    salaryId: string;
    tillFrom: 'till' | 'director';
    directorId?: string;
    paymentMethod: 'cash' | 'bank';
  }, thunkAPI) => {
    try {
      const response = await payrollAPI.updateSalaryStatus(disbursementData);
      
      if (response.status.success) {
        return { 
          salaryId: disbursementData.salaryId, 
          paymentDate: new Date().toISOString(),
          success: true 
        };
      }
      
      throw new Error(response.response?.message || 'Failed to disburse salary');
      
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to disburse salary');
    }
  }
);

const salarySlice = createSlice({
  name: 'salary',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedMonth: (state, action: PayloadAction<number>) => {
      state.selectedMonth = action.payload;
    },
    setSelectedYear: (state, action: PayloadAction<number>) => {
      state.selectedYear = action.payload;
    },
    clearSalaryData: (state) => {
      state.salaryHistory = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Salary History
    builder
      .addCase(fetchSalaryHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalaryHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.salaryHistory = action.payload.data;
        state.selectedMonth = action.payload.month;
        state.selectedYear = action.payload.year;
        state.error = null;
      })
      .addCase(fetchSalaryHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.salaryHistory = [];
      });

    // Disburse Salary
    builder
      .addCase(disburseSalary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(disburseSalary.fulfilled, (state, action) => {
        state.loading = false;
        // Update the salary status to 'paid' and add payment date
        const salaryIndex = state.salaryHistory.findIndex(
          salary => salary._id === action.payload.salaryId
        );
        if (salaryIndex !== -1) {
          state.salaryHistory[salaryIndex].status = 'paid';
          state.salaryHistory[salaryIndex].paymentDate = action.payload.paymentDate;
        }
        state.error = null;
      })
      .addCase(disburseSalary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setSelectedMonth,
  setSelectedYear,
  clearSalaryData,
} = salarySlice.actions;

export default salarySlice.reducer;

// Selectors
export const selectSalaryHistory = (state: { salary: SalaryState }) => state.salary.salaryHistory;
export const selectSalaryLoading = (state: { salary: SalaryState }) => state.salary.loading;
export const selectSalaryError = (state: { salary: SalaryState }) => state.salary.error;
export const selectSelectedMonth = (state: { salary: SalaryState }) => state.salary.selectedMonth;
export const selectSelectedYear = (state: { salary: SalaryState }) => state.salary.selectedYear;
