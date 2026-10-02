import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Employee } from '@/lib/types';

// interface Employee {
//   id: string;
//   employeeId: string;
//   name: string;
//   email: string;
//   position: string;
//   department: string;
//   salary: number;
//   status: 'active' | 'inactive';
//   joinDate: string;
// }

interface PayrollState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  loading: boolean;
}

const initialState: PayrollState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
};

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
    },
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload);
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    setSelectedEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.selectedEmployee = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setEmployees, addEmployee, updateEmployee, setSelectedEmployee, setLoading } = payrollSlice.actions;
export default payrollSlice.reducer;