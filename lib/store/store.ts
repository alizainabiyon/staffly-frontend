import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import employeeSlice from './slices/employeeSlice';
import attendanceSlice from './slices/attendanceSlice';
import employeeExpenseSlice from './slices/employeeExpenseSlice';
import salarySlice from './slices/salarySlice';
import employeeSalarySlice from './slices/employeeSalarySlice';
import crmSlice from './slices/crmSlice';
import contractorSlice from './slices/contractorSlice';
import vendorSlice from './slices/vendorSlice';
import financeSlice from './slices/financeSlice';
import quotationSlice from './slices/quotationSlice';
import invoiceSlice from './slices/invoiceSlice';
import vendorOrderSlice from './slices/vendorOrderSlice';
import directorSlice from './slices/directorSlice';
import tillSlice from './slices/tillSlice';
import dailyEntrySlice from './slices/dailyEntrySlice';
import profileSlice from './slices/profileSlice';
import reportsSlice from './slices/reportsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    employees: employeeSlice,
    attendance: attendanceSlice,
    employeeExpense: employeeExpenseSlice,
    salary: salarySlice,
    employeeSalary: employeeSalarySlice,
    crm: crmSlice,
    contractor: contractorSlice,
    vendor: vendorSlice,
    finance: financeSlice,
    quotation: quotationSlice,
    invoice: invoiceSlice,
    vendorOrder: vendorOrderSlice,
    director: directorSlice,
    till: tillSlice,
    dailyEntry: dailyEntrySlice,
    profile: profileSlice,
    reports: reportsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;