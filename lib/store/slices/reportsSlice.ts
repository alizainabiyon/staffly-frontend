import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reportsAPI } from '@/lib/services/api';

interface ExpenseReportItem {
  _id: string;
  expenseId: string;
  userID: string;
  expenseDate: string;
  catagory: string;
  type: string;
  description: string;
  amount: number;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface ExpenseReportData {
  expenseReport: ExpenseReportItem[];
  totalAmount: number;
}

interface RemainingBalanceData {
  totalAmountIncommingFromCustomers: number;
  totalAmountOutgoingToVendors: number;
  totalAmountInTill: number;
  totalCashInTill: number;
  totalBankInTill: number;
}

interface ReportsState {
  expenseReport: ExpenseReportData | null;
  remainingBalance: RemainingBalanceData | null;
  loading: boolean;
  error: string | null;
  reportGenerated: boolean;
  remainingBalanceLoading: boolean;
  remainingBalanceError: string | null;
  docxToPdfLoading: boolean;
  docxToPdfError: string | null;
}

const initialState: ReportsState = {
  expenseReport: null,
  remainingBalance: null,
  loading: false,
  error: null,
  reportGenerated: false,
  remainingBalanceLoading: false,
  remainingBalanceError: null,
  docxToPdfLoading: false,
  docxToPdfError: null,
};

interface ExpenseReportFilters {
  catagory?: string;
  type?: string;
  fromDate?: string;
  toDate?: string;
  directorId?: string;
  employeeId?: string;
}

// Async thunks
export const generateExpenseReport = createAsyncThunk(
  'reports/generateExpenseReport',
  async (filters: ExpenseReportFilters, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.getExpenseReport(filters);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to generate expense report');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to generate expense report');
    }
  }
);

export const fetchRemainingBalance = createAsyncThunk(
  'reports/fetchRemainingBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.getRemainingBalance();
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to fetch remaining balance');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch remaining balance');
    }
  }
);

export const convertDocxToPdf = createAsyncThunk(
  'reports/convertDocxToPdf',
  async (payload: { templateType: string; templateData: any }, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.convertDocxToPdf(payload);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to convert DOCX to PDF');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to convert DOCX to PDF');
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearExpenseReport: (state) => {
      state.expenseReport = null;
      state.reportGenerated = false;
      state.error = null;
    },
    clearRemainingBalance: (state) => {
      state.remainingBalance = null;
      state.remainingBalanceError = null;
    },
    clearError: (state) => {
      state.error = null;
      state.remainingBalanceError = null;
      state.docxToPdfError = null;
    },
    setReportGenerated: (state, action: PayloadAction<boolean>) => {
      state.reportGenerated = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Generate expense report
    builder
      .addCase(generateExpenseReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateExpenseReport.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseReport = action.payload;
        state.reportGenerated = true;
        state.error = null;
      })
      .addCase(generateExpenseReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.reportGenerated = false;
      });

    // Fetch remaining balance
    builder
      .addCase(fetchRemainingBalance.pending, (state) => {
        state.remainingBalanceLoading = true;
        state.remainingBalanceError = null;
      })
      .addCase(fetchRemainingBalance.fulfilled, (state, action) => {
        state.remainingBalanceLoading = false;
        state.remainingBalance = action.payload;
        state.remainingBalanceError = null;
      })
      .addCase(fetchRemainingBalance.rejected, (state, action) => {
        state.remainingBalanceLoading = false;
        state.remainingBalanceError = action.payload as string;
      });

    // Convert DOCX to PDF
    builder
      .addCase(convertDocxToPdf.pending, (state) => {
        state.docxToPdfLoading = true;
        state.docxToPdfError = null;
      })
      .addCase(convertDocxToPdf.fulfilled, (state, action) => {
        state.docxToPdfLoading = false;
        state.docxToPdfError = null;
        // The action.payload contains the buffer data for download
      })
      .addCase(convertDocxToPdf.rejected, (state, action) => {
        state.docxToPdfLoading = false;
        state.docxToPdfError = action.payload as string;
      });
  },
});

export const {
  clearExpenseReport,
  clearRemainingBalance,
  clearError,
  setReportGenerated,
} = reportsSlice.actions;

export default reportsSlice.reducer;

// Selectors
export const selectExpenseReport = (state: { reports: ReportsState }) => state.reports.expenseReport;
export const selectExpenseReportLoading = (state: { reports: ReportsState }) => state.reports.loading;
export const selectExpenseReportError = (state: { reports: ReportsState }) => state.reports.error;
export const selectReportGenerated = (state: { reports: ReportsState }) => state.reports.reportGenerated;

// Remaining Balance Selectors
export const selectRemainingBalance = (state: { reports: ReportsState }) => state.reports.remainingBalance;
export const selectRemainingBalanceLoading = (state: { reports: ReportsState }) => state.reports.remainingBalanceLoading;
export const selectRemainingBalanceError = (state: { reports: ReportsState }) => state.reports.remainingBalanceError;

// DOCX to PDF Selectors
export const selectDocxToPdfLoading = (state: { reports: ReportsState }) => state.reports.docxToPdfLoading;
export const selectDocxToPdfError = (state: { reports: ReportsState }) => state.reports.docxToPdfError;

// Computed selectors
export const selectExpenseReportItems = (state: { reports: ReportsState }) => 
  state.reports.expenseReport?.expenseReport || [];

export const selectTotalAmount = (state: { reports: ReportsState }) => 
  state.reports.expenseReport?.totalAmount || 0;
