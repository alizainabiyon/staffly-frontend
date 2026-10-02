import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Invoice } from '@/lib/types';

interface FinanceState {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  loading: boolean;
}

const initialState: FinanceState = {
  invoices: [],
  selectedInvoice: null,
  loading: false,
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setInvoices: (state, action: PayloadAction<Invoice[]>) => {
      state.invoices = action.payload;
    },
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.invoices.push(action.payload);
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const index = state.invoices.findIndex(inv => inv.invoiceId === action.payload.invoiceId);
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
    },
    setSelectedInvoice: (state, action: PayloadAction<Invoice | null>) => {
      state.selectedInvoice = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setInvoices, addInvoice, updateInvoice, setSelectedInvoice, setLoading } = financeSlice.actions;
export default financeSlice.reducer;