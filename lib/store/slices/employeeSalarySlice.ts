import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SalarySlip } from '../../types';
import { payrollAPI } from '../../services/api';

interface EmployeeSalaryState {
  salaryHistory: SalarySlip[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeSalaryState = {
  salaryHistory: [],
  loading: false,
  error: null,
};

// Async thunk for fetching employee salary history
export const fetchEmployeeSalaryHistory = createAsyncThunk(
  'employeeSalary/fetchEmployeeSalaryHistory',
  async (employeeId: string, thunkAPI) => {
    try {
      const response = await payrollAPI.getEmployeeSalaryHistory(employeeId);
      if (response.status.success && response.response.data) {
        return response.response.data;
      }
      throw new Error(response.response?.message || 'Failed to fetch employee salary history');
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch employee salary history');
    }
  }
);

const employeeSalarySlice = createSlice({
  name: 'employeeSalary',
  initialState,
  reducers: {
    clearEmployeeSalaryError: (state) => {
      state.error = null;
    },
    clearEmployeeSalaryHistory: (state) => {
      state.salaryHistory = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employee Salary History
      .addCase(fetchEmployeeSalaryHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeSalaryHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.salaryHistory = action.payload;
        state.error = null;
      })
      .addCase(fetchEmployeeSalaryHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.salaryHistory = [];
      });
  },
});

export const { clearEmployeeSalaryError, clearEmployeeSalaryHistory } = employeeSalarySlice.actions;
export default employeeSalarySlice.reducer;

// Selectors
export const selectEmployeeSalaryHistory = (state: { employeeSalary: EmployeeSalaryState }) => state.employeeSalary.salaryHistory;
export const selectEmployeeSalaryLoading = (state: { employeeSalary: EmployeeSalaryState }) => state.employeeSalary.loading;
export const selectEmployeeSalaryError = (state: { employeeSalary: EmployeeSalaryState }) => state.employeeSalary.error;
