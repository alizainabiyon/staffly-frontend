import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MonthlyAttendanceRecord, FilterOptions, ApiSuccessResponse, Attendance } from '../../types';
import { attendanceAPI } from '../../services/api';

interface AttendanceState {
  monthlyRecords: MonthlyAttendanceRecord[];
  selectedRecord: MonthlyAttendanceRecord | null;
  dailyAttendanceRecords: Attendance[];
  loading: boolean;
  loadingAttendance: boolean;
  error: string | null;
  currentMonth: number;
  currentYear: number;
  filters: {
    month: number;
    year: number;
  };
}

const currentDate = new Date();
const initialState: AttendanceState = {
  monthlyRecords: [],
  selectedRecord: null,
  dailyAttendanceRecords: [],
  loading: false,
  loadingAttendance: false,
  error: null,
  currentMonth: currentDate.getMonth() + 1, // 1-12
  currentYear: currentDate.getFullYear(),
  filters: {
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  },
};

// Async thunks
export const fetchMonthlyAttendance = createAsyncThunk(
  'attendance/fetchMonthlyAttendance',
  async ({ month, year }: { month: number; year: number }, thunkAPI) => {
    try {
      const response = await attendanceAPI.getMonthlyAll(month, year);
      
      // Handle the actual backend response structure
      const backendResponse = response as unknown as {
        status: { code: number; success: boolean };
        response: {
          message: string;
          data: MonthlyAttendanceRecord[];
        };
      };
      
      if (backendResponse.status && backendResponse.status.success && backendResponse.response && backendResponse.response.data) {
        return {
          data: backendResponse.response.data,
          month,
          year,
        };
      }
      
      // If not successful, throw with the backend message
      throw new Error(
        backendResponse.response?.message || 
        'Failed to fetch monthly attendance data'
      );
      
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch monthly attendance data');
    }
  }
);
export const fetchEmployeeMonthlyAttendance = createAsyncThunk(
  'attendance/fetchEmployeeMonthlyAttendance',
  async ({ month, year, employeeId }: { month: number; year: number; employeeId: string }, thunkAPI) => {
    try {
      const response = await attendanceAPI.getMonthlyEmployee(employeeId, month, year);
      if (response.status.success && response.response.data) {
        const dailyAttendance = response.response.data.dailyAttendance || [];
        return {
          data: dailyAttendance,
          month,
          year,
        };
      }
      
      // If not successful, throw with the backend message
      throw new Error(
        response.response?.message || 
        'Failed to fetch employee monthly attendance data'
      );
      
    } catch (error: any) {
      console.error('API Error:', error);
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch employee monthly attendance data');
    }
  }
);

export const fetchAttendanceById = createAsyncThunk(
  'attendance/fetchAttendanceById',
  async ({ id, employees }: { id: string; employees: any[] }, thunkAPI) => {
    try {
      const response = await attendanceAPI.getById(id);
      
      if (response.status.success && response.response.data) {
        const attendanceData = response.response.data;
        
        // Transform the attendance records to match the expected structure
        const transformedRecords = (attendanceData.attendance || []).map((record: any) => ({
          id: record.attendanceId,
          employeeId: record.employeeId,
          name: record.employee?.name || 'Unknown',
          department: record.employee?.department || 'N/A',
          position: record.employee?.position || 'N/A',
          date: new Date(attendanceData.date).toISOString().split('T')[0], // Format date as YYYY-MM-DD
          checkIn: record.checkInTime ? new Date(record.checkInTime).toTimeString().slice(0, 5) : '',
          checkOut: record.checkOutTime ? new Date(record.checkOutTime).toTimeString().slice(0, 5) : '',
          status: record.attendanceStatus,
          workingHours: record.workingHours || 0,
          overtimeHours: record.overTime || 0,
          notes: record.note || '',
          bonus: 0, // Default value since not in API response
        }));
        
        return {
          records: transformedRecords,
          date: attendanceData.date,
          attendanceId: attendanceData.attendanceId,
        };
      } else {
        throw new Error('Failed to fetch attendance data');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch attendance data');
    }
  }
);

export const refreshAttendanceData = createAsyncThunk(
  'attendance/refreshAttendanceData',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as { attendance: AttendanceState };
    const { month, year } = state.attendance.filters;
    
    try {
      const response = await attendanceAPI.getMonthlyAll(month, year);
      
      const backendResponse = response as unknown as {
        status: { code: number; success: boolean };
        response: {
          message: string;
          data: MonthlyAttendanceRecord[];
        };
      };
      
      if (backendResponse.status && backendResponse.status.success && backendResponse.response && backendResponse.response.data) {
        return {
          data: backendResponse.response.data,
          month,
          year,
        };
      }
      
      throw new Error(
        backendResponse.response?.message || 
        'Failed to refresh attendance data'
      );
      
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to refresh attendance data');
    }
  }
);

export const deleteAttendance = createAsyncThunk(
  'attendance/deleteAttendance',
  async (attendanceId: string, thunkAPI) => {
    try {
      const response = await attendanceAPI.delete(attendanceId);
      
      if (response.status.success) {
        return { attendanceId, message: response.response.message };
      }
      
      throw new Error(response.response?.message || 'Failed to delete attendance');
      
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to delete attendance');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedRecord: (state, action: PayloadAction<MonthlyAttendanceRecord | null>) => {
      state.selectedRecord = action.payload;
    },
    setCurrentMonth: (state, action: PayloadAction<number>) => {
      state.currentMonth = action.payload;
      state.filters.month = action.payload;
    },
    setCurrentYear: (state, action: PayloadAction<number>) => {
      state.currentYear = action.payload;
      state.filters.year = action.payload;
    },
    setFilters: (state, action: PayloadAction<{ month: number; year: number }>) => {
      state.filters = action.payload;
      state.currentMonth = action.payload.month;
      state.currentYear = action.payload.year;
    },
    resetAttendanceData: (state) => {
      state.monthlyRecords = [];
      state.selectedRecord = null;
      state.dailyAttendanceRecords = [];
      state.error = null;
    },
    clearDailyAttendance: (state) => {
      state.dailyAttendanceRecords = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Monthly Attendance
    builder
      .addCase(fetchMonthlyAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyRecords = action.payload.data;
        state.currentMonth = action.payload.month;
        state.currentYear = action.payload.year;
        state.filters.month = action.payload.month;
        state.filters.year = action.payload.year;
        state.error = null;
      })
      .addCase(fetchMonthlyAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.monthlyRecords = [];
      });

    // Fetch Employee Monthly Attendance
    builder
      .addCase(fetchEmployeeMonthlyAttendance.pending, (state) => {
        state.loadingAttendance = true;
        state.error = null;
      })
      .addCase(fetchEmployeeMonthlyAttendance.fulfilled, (state, action) => {
        state.loadingAttendance = false;
        state.dailyAttendanceRecords = action.payload.data;
        state.error = null;
      })
      .addCase(fetchEmployeeMonthlyAttendance.rejected, (state, action) => {
        state.loadingAttendance = false;
        state.error = action.payload as string;
        state.dailyAttendanceRecords = [];
      });

    // Fetch Attendance By ID
    builder
      .addCase(fetchAttendanceById.pending, (state) => {
        state.loadingAttendance = true;
        state.error = null;
      })
      .addCase(fetchAttendanceById.fulfilled, (state, action) => {
        state.loadingAttendance = false;
        state.dailyAttendanceRecords = action.payload.records;
        state.error = null;
      })
      .addCase(fetchAttendanceById.rejected, (state, action) => {
        state.loadingAttendance = false;
        state.error = action.payload as string;
        state.dailyAttendanceRecords = [];
      });

    // Refresh Attendance Data
    builder
      .addCase(refreshAttendanceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshAttendanceData.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyRecords = action.payload.data;
        state.error = null;
      })
      .addCase(refreshAttendanceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Attendance
    builder
      .addCase(deleteAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted record from the monthly records
        state.monthlyRecords = state.monthlyRecords.filter(
          record => record.attendanceId !== action.payload.attendanceId
        );
        state.error = null;
      })
      .addCase(deleteAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setSelectedRecord,
  setCurrentMonth,
  setCurrentYear,
  setFilters,
  resetAttendanceData,
  clearDailyAttendance,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;

// Selectors
export const selectAttendanceState = (state: { attendance: AttendanceState }) => state.attendance;
export const selectMonthlyRecords = (state: { attendance: AttendanceState }) => state.attendance.monthlyRecords;
export const selectSelectedRecord = (state: { attendance: AttendanceState }) => state.attendance.selectedRecord;
export const selectAttendanceLoading = (state: { attendance: AttendanceState }) => state.attendance.loading;
export const selectAttendanceError = (state: { attendance: AttendanceState }) => state.attendance.error;
export const selectCurrentMonth = (state: { attendance: AttendanceState }) => state.attendance.currentMonth;
export const selectCurrentYear = (state: { attendance: AttendanceState }) => state.attendance.currentYear;
export const selectAttendanceFilters = (state: { attendance: AttendanceState }) => state.attendance.filters;
export const selectDailyAttendanceRecords = (state: { attendance: AttendanceState }) => state.attendance.dailyAttendanceRecords;
export const selectAttendanceLoadingAttendance = (state: { attendance: AttendanceState }) => state.attendance.loadingAttendance;

// Computed selectors
export const selectAttendanceStats = (state: { attendance: AttendanceState }) => {
  const records = state.attendance.monthlyRecords;
  
  if (!records.length) {
    return {
      totalWorkingDays: 0,
      totalPresent: 0,
      totalAbsent: 0,
      totalLate: 0,
      totalOvertime: 0,
      totalOnLeave: 0,
      totalHalfDay: 0,
      totalHoliday: 0,
      totalWeekend: 0,
      averageAttendanceRate: 0,
      totalEmployees: 0,
    };
  }

  const totals = records.reduce((acc, record) => ({
    totalPresent: acc.totalPresent + record.totalPresent,
    totalAbsent: acc.totalAbsent + record.totalAbsent,
    totalLate: acc.totalLate + record.totalLate,
    totalOvertime: acc.totalOvertime + record.totalOvertime,
    totalOnLeave: acc.totalOnLeave + record.totalOnLeave,
    totalHalfDay: acc.totalHalfDay + record.totalHalfDay,
    totalHoliday: acc.totalHoliday + record.totalHoliday,
    totalWeekend: acc.totalWeekend + record.totalWeekend,
  }), {
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    totalOvertime: 0,
    totalOnLeave: 0,
    totalHalfDay: 0,
    totalHoliday: 0,
    totalWeekend: 0,
  });

  const totalWorkingDays = records.length;
  const totalEmployees = records.length > 0 ? records[0].totalEmployees : 0;
  const totalPossibleAttendance = totalWorkingDays * totalEmployees;
  const actualAttendance = totals.totalPresent + totals.totalLate + totals.totalHalfDay;
  const averageAttendanceRate = totalPossibleAttendance > 0 ? (actualAttendance / totalPossibleAttendance * 100) : 0;

  return {
    totalWorkingDays,
    ...totals,
    averageAttendanceRate: Math.round(averageAttendanceRate * 10) / 10,
    totalEmployees,
  };
};

export const selectAttendanceByDateRange = (state: { attendance: AttendanceState }, startDate: string, endDate: string) => {
  const records = state.attendance.monthlyRecords;
  return records.filter(record => {
    const recordDate = new Date(record.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return recordDate >= start && recordDate <= end;
  });
};

export const selectHighAttendanceDays = (state: { attendance: AttendanceState }, threshold: number = 90) => {
  const records = state.attendance.monthlyRecords;
  return records.filter(record => {
    const attendanceRate = record.totalEmployees > 0 
      ? ((record.totalPresent + record.totalLate + record.totalHalfDay) / record.totalEmployees * 100)
      : 0;
    return attendanceRate >= threshold;
  });
};

export const selectLowAttendanceDays = (state: { attendance: AttendanceState }, threshold: number = 70) => {
  const records = state.attendance.monthlyRecords;
  return records.filter(record => {
    const attendanceRate = record.totalEmployees > 0 
      ? ((record.totalPresent + record.totalLate + record.totalHalfDay) / record.totalEmployees * 100)
      : 0;
    return attendanceRate < threshold;
  });
};

export const selectWeekendAndHolidayStats = (state: { attendance: AttendanceState }) => {
  const records = state.attendance.monthlyRecords;
  return records.reduce((acc, record) => ({
    totalWeekends: acc.totalWeekends + record.totalWeekend,
    totalHolidays: acc.totalHolidays + record.totalHoliday,
  }), {
    totalWeekends: 0,
    totalHolidays: 0,
  });
};