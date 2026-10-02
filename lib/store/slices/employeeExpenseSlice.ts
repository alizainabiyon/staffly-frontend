import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EmployeeExpense, ApiSuccessResponse } from '../../types';
import { employeeAPI } from '../../services/api';

interface EmployeeExpenseState {
  expenses: EmployeeExpense[];
  totalAmount: number;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeExpenseState = {
  expenses: [],
  totalAmount: 0,
  loading: false,
  error: null,
};

// Async thunk for fetching employee expenses
export const fetchEmployeeExpenses = createAsyncThunk(
  'employeeExpense/fetchEmployeeExpenses',
  async ({ employeeId, month, year }: { employeeId: string; month: number; year: number }, thunkAPI) => {
    try {
      const response = await employeeAPI.getExpenses(employeeId, month, year);
      
      if (response.status.success && response.response.data) {
        return {
          expenses: response.response.data.expenses || [],
          totalAmount: response.response.data.totalAmount || 0,
          month,
          year,
        };
      }
      
      // If not successful, throw with the backend message
      throw new Error(
        response.response?.message || 
        'Failed to fetch employee expenses'
      );
      
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch employee expenses');
    }
  }
);

const employeeExpenseSlice = createSlice({
  name: 'employeeExpense',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearExpenses: (state) => {
      state.expenses = [];
      state.totalAmount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Employee Expenses
    builder
      .addCase(fetchEmployeeExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.expenses;
        state.totalAmount = action.payload.totalAmount;
        state.error = null;
      })
      .addCase(fetchEmployeeExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.expenses = [];
        state.totalAmount = 0;
      });
  },
});

export const {
  clearError,
  clearExpenses,
} = employeeExpenseSlice.actions;

export default employeeExpenseSlice.reducer;

// Selectors
export const selectEmployeeExpenses = (state: { employeeExpense: EmployeeExpenseState }) => state.employeeExpense.expenses;
export const selectEmployeeExpenseTotal = (state: { employeeExpense: EmployeeExpenseState }) => state.employeeExpense.totalAmount;
export const selectEmployeeExpenseLoading = (state: { employeeExpense: EmployeeExpenseState }) => state.employeeExpense.loading;
export const selectEmployeeExpenseError = (state: { employeeExpense: EmployeeExpenseState }) => state.employeeExpense.error;
