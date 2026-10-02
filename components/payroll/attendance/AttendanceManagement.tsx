'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Save,
  Download,
  CheckSquare,
  Square,
  Edit3
} from 'lucide-react';
import { Attendance, Employee } from '@/lib/types';
import { formatDate } from '@/lib/utils/helpers';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchEmployees, selectEmployees, selectEmployeeLoading } from '@/lib/store/slices/employeeSlice';
import { attendanceAPI } from '@/lib/services/api';
import { fetchAttendanceById, selectDailyAttendanceRecords, selectAttendanceLoadingAttendance, refreshAttendanceData } from '@/lib/store/slices/attendanceSlice';
import { useTranslations } from 'next-intl';

interface AttendanceManagementProps {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  attendanceId?: string;
  onSuccess?: () => void; // Callback to close dialog after success
  onAttendanceSaved?: () => void; // Callback when attendance is saved/updated
}

export function AttendanceManagement({ 
  selectedDate: propSelectedDate, 
  onDateChange: propOnDateChange,
  attendanceId,
  onSuccess,
  onAttendanceSaved
}: AttendanceManagementProps) {
  const t = useTranslations('Attendance.management');
  const dispatch = useAppDispatch();
  const employees = useAppSelector(selectEmployees);
  const loading = useAppSelector(selectEmployeeLoading);
  const dailyAttendanceRecords = useAppSelector(selectDailyAttendanceRecords);
  const loadingAttendance = useAppSelector(selectAttendanceLoadingAttendance);
  
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [selectedDate, setSelectedDate] = useState(propSelectedDate || new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkValues, setBulkValues] = useState({
    checkIn: '',
    checkOut: '',
    status: 'present' as 'present' | 'absent' | 'late' | 'half_day' | 'overtime' | 'leave' | 'holiday',
    bonus: 0,
    notes: ''
  });

  // Fetch employees on component mount
  useEffect(() => {
    dispatch(fetchEmployees({ limit: 100 })); // Set high limit to fetch all employees
  }, [dispatch]);

  // Reset success state when needed
  const resetSuccessState = () => {
    setSuccess(false);
  };

  // Handle attendance data loading
  useEffect(() => {
    if (attendanceId) {
      // Load existing attendance for editing
      handleFetchAttendanceById(attendanceId);
    } else {
      // Create new attendance records for all active employees
      createNewAttendanceRecords();
      // Reset all state for new attendance
      setSelectedEmployees(new Set());
      setBulkEditMode(false);
      setBulkValues({
        checkIn: '',
        checkOut: '',
        status: 'present',
        bonus: 0,
        notes: ''
      });
    }
    // Reset success state when mode changes
    resetSuccessState();
  }, [attendanceId]);

  // Sync with Redux state when editing existing attendance
  useEffect(() => {
    if (attendanceId && Array.isArray(dailyAttendanceRecords) && dailyAttendanceRecords.length > 0) {
      setAttendanceRecords(dailyAttendanceRecords);
    }
  }, [dailyAttendanceRecords, attendanceId]);

  // Recreate attendance records when employees are loaded (for new attendance only)
  useEffect(() => {
    if (!attendanceId && employees.length > 0 && attendanceRecords.length === 0) {
      createNewAttendanceRecords();
    }
  }, [employees, attendanceId]);


  const createNewAttendanceRecords = () => {
    if (employees.length === 0) {
      setAttendanceRecords([]);
      return;
    }
    
    // Include active and inactive employees, exclude only terminated
    const filteredEmployees = employees.filter(emp => emp.status !== 'terminated');
    const finalEmployees = filteredEmployees.length > 0 ? filteredEmployees : employees;
    
    const records: Attendance[] = finalEmployees.map(employee => ({
      id: employee.employeeId,
      employeeId: employee.employeeId,
      name: employee.name,
      date: selectedDate,
      checkIn: '',
      checkOut: '',
      status: 'present',
      workingHours: 0,
      overtimeHours: 0,
      notes: '',
      bonus: 0,
    }));
    
    setAttendanceRecords(records);
  };

  const handleFetchAttendanceById = async (id: string) => {
    try {
      const result = await dispatch(fetchAttendanceById({ id, employees })).unwrap();
      
      if (result.date) {
        const dateStr = new Date(result.date).toISOString().split('T')[0];
        setSelectedDate(dateStr);
        if (propOnDateChange) {
          propOnDateChange(dateStr);
        }
      }
      
      setAttendanceRecords(result.records);
    } catch (error: any) {
      console.error('Error fetching attendance:', error);
      toast.error(error.message || 'Failed to fetch attendance data');
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    resetSuccessState(); // Reset success state when date changes
    
    if (propOnDateChange) {
      propOnDateChange(date);
    }
    
    // If not editing existing attendance, create new records for the new date
    if (!attendanceId) {
      createNewAttendanceRecords();
    }
  };

  const updateAttendance = (employeeId: string, field: keyof Attendance, value: any) => {
    setAttendanceRecords(records => 
      records.map(record => {
        if (record.employeeId === employeeId) {
          const updatedRecord = { ...record, [field]: value };
          
          // Auto-calculate working hours if both times exist
          if ((field === 'checkIn' || field === 'checkOut') && updatedRecord.checkIn && updatedRecord.checkOut) {
            const checkIn = new Date(`${selectedDate}T${updatedRecord.checkIn}`);
            const checkOut = new Date(`${selectedDate}T${updatedRecord.checkOut}`);
            const diffHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
            
            updatedRecord.workingHours = Math.max(0, diffHours);
            updatedRecord.overtimeHours = Math.max(0, diffHours - 8);
            
            // Auto-set status based on check-in time
            if (field === 'checkIn') {
              if (updatedRecord.checkIn <= '09:00') updatedRecord.status = 'present';
              else if (updatedRecord.checkIn <= '09:30') updatedRecord.status = 'late';
              else updatedRecord.status = 'present';
            }
          }
          
          return updatedRecord;
        }
        return record;
      })
    );
  };

  // Bulk edit functions
  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  };

  const selectAllEmployees = () => {
    const allEmployeeIds = attendanceRecords.map(record => record.employeeId);
    setSelectedEmployees(new Set(allEmployeeIds));
  };

  const clearSelection = () => {
    setSelectedEmployees(new Set());
  };

  const applyBulkEdit = () => {
    if (selectedEmployees.size === 0) {
      toast.error(t('errors.selectEmployees'));
      return;
    }

    setAttendanceRecords(records => 
      records.map(record => {
        if (selectedEmployees.has(record.employeeId)) {
          const updatedRecord = { ...record };
          
          // Apply bulk values only if they are not empty
          if (bulkValues.checkIn) updatedRecord.checkIn = bulkValues.checkIn;
          if (bulkValues.checkOut) updatedRecord.checkOut = bulkValues.checkOut;
          if (bulkValues.status) updatedRecord.status = bulkValues.status as 'present' | 'absent' | 'late' | 'half_day' | 'overtime' | 'leave' | 'holiday';
          if (bulkValues.bonus !== undefined) updatedRecord.bonus = bulkValues.bonus;
          if (bulkValues.notes) updatedRecord.notes = bulkValues.notes;
          
          // Recalculate working hours if both times exist
          if (updatedRecord.checkIn && updatedRecord.checkOut) {
            const checkIn = new Date(`${selectedDate}T${updatedRecord.checkIn}`);
            const checkOut = new Date(`${selectedDate}T${updatedRecord.checkOut}`);
            const diffHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
            
            updatedRecord.workingHours = Math.max(0, diffHours);
            updatedRecord.overtimeHours = Math.max(0, diffHours - 8);
          }
          
          return updatedRecord;
        }
        return record;
      })
    );

    toast.success(t('applyToSelected', { count: selectedEmployees.size }));
    setBulkEditMode(false);
    clearSelection();
  };

  const cancelBulkEdit = () => {
    setBulkEditMode(false);
    clearSelection();
    setBulkValues({
      checkIn: '',
      checkOut: '',
      status: 'present' as 'present' | 'absent' | 'late' | 'half_day' | 'overtime' | 'leave' | 'holiday',
      bonus: 0,
      notes: ''
    });
  };

  const prepareAttendancePayload = () => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(selectedDate);
    const day = dayNames[date.getDay()];
    
    const attendance = attendanceRecords
      .map(record => {

        let checkInTime = '';
        let checkOutTime = '';
        
        if (record.checkIn) {
          const checkInDate = new Date(`${selectedDate}T${record.checkIn}`);
          checkInTime = checkInDate.toISOString();
        }
        
        if (record.checkOut) {
          const checkOutDate = new Date(`${selectedDate}T${record.checkOut}`);
          checkOutTime = checkOutDate.toISOString();
        }

        return {
          employeeId: record.employeeId || '',
          checkInTime: checkInTime || null,
          checkOutTime: checkOutTime || null,
          workingHours: record.workingHours,
          overTime: record.overtimeHours,
          attendanceStatus: record.status,
          note: record.notes || ''
        };
      })
      .filter(Boolean);

    return {
      date: new Date(selectedDate).toISOString(),
      day,
      attendance
    };
  };

  const saveAttendance = async () => {
    try {
      setSaving(true);
      
      const payload = prepareAttendancePayload();
      
      if (payload.attendance.length === 0) {
        toast.error(t('errors.noRecordsToSave'));
        return;
      }

      let response;
      
      if (attendanceId) {
        // Update existing attendance
        const updatePayload = {
          attendanceId,
          ...payload
        };
        response = await attendanceAPI.update(updatePayload);
      } else {
        // Create new attendance
        response = await attendanceAPI.markAttendance(payload);
      }
      
      if (response.status.success) {
        const action = attendanceId ? t('updated') : t('saved');
        setSuccess(true);
        toast.success(`${t('title')} ${action} ${t('successfully')}`);
        
        // Refresh attendance data to update all tables
        try {
          await dispatch(refreshAttendanceData()).unwrap();
        } catch (refreshError) {
          console.warn('Failed to refresh attendance data:', refreshError);
          // Don't show error to user as the main operation was successful
        }
        
        // Notify parent components that attendance was saved
        if (onAttendanceSaved) {
          onAttendanceSaved();
        }
        
        // Close dialog after a short delay to show success message
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500); // 1.5 second delay for better UX
        }
      } else {
        const errorMsg = attendanceId ? t('errors.updateFailed') : t('errors.saveFailed');
        toast.error(response.response?.message || errorMsg);
      }
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      const errorMsg = attendanceId ? t('errors.updateFailed') : t('errors.saveFailed');
      toast.error(error.message || errorMsg);
      resetSuccessState(); // Reset success state on error
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'half_day':
        return 'bg-orange-100 text-orange-800';
      case 'overtime':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'leave':
        return <Clock className="h-4 w-4 text-gray-600" />;
      case 'holiday':
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  // const attendanceStats = {
  //   present: attendanceRecords.filter(r => r.status === 'present').length,
  //   absent: attendanceRecords.filter(r => r.status === 'absent').length,
  //   late: attendanceRecords.filter(r => r.status === 'late').length,
  //   total: attendanceRecords.length,
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Dark Mode Support */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t('title')}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {attendanceId ? t('editFor') : t('markFor')} {formatDate(selectedDate)}
          </p>
          {success && (
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                {t('title')} {attendanceId ? t('updated') : t('saved')} {t('successfully')}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-40 border-slate-200 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
          {!bulkEditMode ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setBulkEditMode(true)}
                disabled={attendanceRecords.length === 0}
                className="border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-500 text-slate-700 dark:text-slate-300"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {t('bulkEdit')}
              </Button>
              <Button 
                onClick={saveAttendance} 
                disabled={saving || success}
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? t('saving') : success ? t('success') : attendanceId ? t('updateAttendance') : t('saveAttendance')}
              </Button>
              <Button 
                variant="outline"
                className="border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-500 text-slate-700 dark:text-slate-300"
              >
                <Download className="h-4 w-4 mr-2" />
                {t('export')}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={selectAllEmployees}
                disabled={selectedEmployees.size === attendanceRecords.length}
                className="border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-500 text-slate-700 dark:text-slate-300"
              >
                {t('selectAll')}
              </Button>
              <Button 
                variant="outline" 
                onClick={clearSelection}
                disabled={selectedEmployees.size === 0}
                className="border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-500 text-slate-700 dark:text-slate-300"
              >
                {t('clearSelection')}
              </Button>
              <Button 
                onClick={applyBulkEdit}
                disabled={selectedEmployees.size === 0}
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                {t('applyToSelected', { count: selectedEmployees.size })}
              </Button>
              <Button 
                variant="outline" 
                onClick={cancelBulkEdit}
                className="border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-500 text-slate-700 dark:text-slate-300"
              >
                {t('cancel')}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Enhanced Bulk Edit Form with Dark Mode Support */}
      {bulkEditMode && (
        <Card className="border-emerald-200 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Edit3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              {t('bulkEditTitle')} 
              <span className="bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full text-sm font-medium">
                {selectedEmployees.size} {t('selected')}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">{t('checkInTime')}</label>
                <Input
                  type="time"
                  value={bulkValues.checkIn}
                  onChange={(e) => setBulkValues(prev => ({ ...prev, checkIn: e.target.value }))}
                  placeholder={t('leaveEmptyToSkip')}
                  className="text-xs border-slate-200 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">{t('checkOutTime')}</label>
                <Input
                  type="time"
                  value={bulkValues.checkOut}
                  onChange={(e) => setBulkValues(prev => ({ ...prev, checkOut: e.target.value }))}
                  placeholder={t('leaveEmptyToSkip')}
                  className="text-xs border-slate-200 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">{t('table.status')}</label>
                <Select
                  value={bulkValues.status}
                  onValueChange={(value) => setBulkValues(prev => ({ ...prev, status: value as 'present' | 'absent' | 'late' | 'half_day' | 'overtime' }))}
                >
                  <SelectTrigger className="text-xs border-slate-200 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-slate-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600">
                    <SelectItem value="present" className="text-xs text-slate-900 dark:text-slate-100">{t('status.present')}</SelectItem>
                    <SelectItem value="absent" className="text-xs text-slate-900 dark:text-slate-100">{t('status.absent')}</SelectItem>
                    <SelectItem value="late" className="text-xs text-slate-900 dark:text-slate-100">{t('status.late')}</SelectItem>
                    <SelectItem value="half_day" className="text-xs text-slate-900 dark:text-slate-100">{t('status.halfDay')}</SelectItem>
                    <SelectItem value="overtime" className="text-xs text-slate-900 dark:text-slate-100">{t('status.overtime')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">{t('bonus')}</label>
                <Input
                  type="number"
                  value={bulkValues.bonus}
                  onChange={(e) => setBulkValues(prev => ({ ...prev, bonus: Number(e.target.value) }))}
                  placeholder="0"
                  className="text-xs border-slate-200 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">{t('notes')}</label>
                <Input
                  value={bulkValues.notes}
                  onChange={(e) => setBulkValues(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder={t('leaveEmptyToSkip')}
                  className="text-xs border-slate-200 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
              <p>{t('bulkEditNote1')}</p>
              <p>{t('bulkEditNote2')}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Present</p>
                <p className="text-xl font-bold text-green-600">{attendanceStats.present}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Absent</p>
                <p className="text-xl font-bold text-red-600">{attendanceStats.absent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Late</p>
                <p className="text-xl font-bold text-yellow-600">{attendanceStats.late}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-blue-600">{attendanceStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Enhanced Attendance Table with Dark Green Header */}
      <Card className="border-0 shadow-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-xl border border-gray-200/60 dark:border-slate-700/60">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 dark:from-emerald-900 dark:via-green-800 dark:to-teal-900 border-b border-emerald-600/30 dark:border-emerald-500/30">
                  <TableHead className="w-12 px-3 py-2 text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider text-center border-r border-emerald-600/30 dark:border-emerald-500/30">
                    {bulkEditMode && (
                      <button
                        onClick={selectedEmployees.size === attendanceRecords.length ? clearSelection : selectAllEmployees}
                        className="flex items-center justify-center w-5 h-5 rounded border border-emerald-300/50 dark:border-emerald-400/50 hover:bg-emerald-600/20 dark:hover:bg-emerald-500/20"
                      >
                        {selectedEmployees.size === attendanceRecords.length ? (
                          <CheckSquare className="h-3 w-3 text-emerald-200 dark:text-emerald-300" />
                        ) : (
                          <Square className="h-3 w-3 text-emerald-300/60 dark:text-emerald-400/60" />
                        )}
                      </button>
                    )}
                  </TableHead>
                  <TableHead className="px-3 py-2 text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">{t('table.employee')}</TableHead>
                  <TableHead className="px-3 py-2 text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">{t('table.checkIn')}</TableHead>
                  <TableHead className="px-3 py-2 text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">{t('table.checkOut')}</TableHead>
                  <TableHead className="px-3 py-2 text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">{t('table.workingHours')}</TableHead>
                  <TableHead className="px-3 py-2 text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">{t('table.overtime')}</TableHead>
                  <TableHead className="px-3 py-2 text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">{t('table.status')}</TableHead>
                  <TableHead className="px-3 py-2 text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30">{t('bonus')}</TableHead>
                  <TableHead className="px-3 py-2 text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider">{t('notes')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords?.length > 0 && attendanceRecords?.map((record) => {
                  return (
                    <TableRow 
                      key={`${record.employeeId}-${record.date}`} 
                      className={`group hover:bg-gradient-to-r hover:from-emerald-50/20 hover:to-green-50/20 dark:hover:from-emerald-900/20 dark:hover:to-green-900/20 transition-all duration-200 border-b border-gray-100/60 dark:border-slate-700/60 last:border-b-0 ${selectedEmployees.has(record.employeeId) ? 'bg-emerald-50/30 dark:bg-emerald-900/20' : ''}`}
                    >
                      <TableCell className="px-3 py-2 text-center border-r border-gray-100/40 dark:border-slate-700/40 group-hover:bg-white/50 dark:group-hover:bg-slate-800/50 transition-all duration-200">
                        {bulkEditMode && (
                          <button
                            onClick={() => toggleEmployeeSelection(record.employeeId)}
                            className="flex items-center justify-center w-5 h-5 rounded border border-slate-300 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-500"
                          >
                            {selectedEmployees.has(record.employeeId) ? (
                              <CheckSquare className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Square className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                            )}
                          </button>
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-2 border-r border-gray-100/40 dark:border-slate-700/40 group-hover:bg-white/50 dark:group-hover:bg-slate-800/50 transition-all duration-200 text-slate-700 dark:text-slate-300">
                        <div>
                          <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{record.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{record.employeeId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-2 border-r border-gray-100/40 dark:border-slate-700/40 group-hover:bg-white/50 dark:group-hover:bg-slate-800/50 transition-all duration-200">
                        <Input
                          type="time"
                          value={record.checkIn}
                          onChange={(e) => updateAttendance(record.employeeId, 'checkIn', e.target.value)}
                          className="w-28 text-xs border-slate-200 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          disabled={bulkEditMode}
                        />
                      </TableCell>
                      <TableCell className="px-3 py-2 border-r border-gray-100/40 dark:border-slate-700/40 group-hover:bg-white/50 dark:group-hover:bg-slate-800/50 transition-all duration-200">
                        <Input
                          type="time"
                          value={record.checkOut}
                          onChange={(e) => updateAttendance(record.employeeId, 'checkOut', e.target.value)}
                          className="w-28 text-xs border-slate-200 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          disabled={bulkEditMode}
                        />
                      </TableCell>
                      <TableCell className="px-3 py-2 border-r border-gray-100/40 dark:border-slate-700/40 group-hover:bg-white/50 dark:group-hover:bg-slate-800/50 transition-all duration-200 text-slate-700 dark:text-slate-300">
                        <span className="text-xs font-medium">{record.workingHours.toFixed(1)}h</span>
                      </TableCell>
                      <TableCell className="px-3 py-2 border-r border-gray-100/40 dark:border-slate-700/40 group-hover:bg-white/50 dark:group-hover:bg-slate-800/50 transition-all duration-200 text-slate-700 dark:text-slate-300">
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{record.overtimeHours.toFixed(1)}h</span>
                      </TableCell>
                      <TableCell className="px-3 py-2 border-r border-gray-100/40 dark:border-slate-700/40 group-hover:bg-white/50 dark:group-hover:bg-slate-800/50 transition-all duration-200">
                        <div className="flex items-center gap-1">
                          <Select
                            value={record.status}
                            onValueChange={(value) => updateAttendance(record.employeeId, 'status', value)}
                            disabled={bulkEditMode}
                          >
                            <SelectTrigger className="w-28 text-xs border-slate-200 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-slate-800">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600">
                              <SelectItem value="present" className="text-xs text-slate-900 dark:text-slate-100">{t('status.present')}</SelectItem>
                              <SelectItem value="absent" className="text-xs text-slate-900 dark:text-slate-100">{t('status.absent')}</SelectItem>
                              <SelectItem value="late" className="text-xs text-slate-900 dark:text-slate-100">{t('status.late')}</SelectItem>
                              <SelectItem value="half_day" className="text-xs text-slate-900 dark:text-slate-100">{t('status.halfDay')}</SelectItem>
                              <SelectItem value="overtime" className="text-xs text-slate-900 dark:text-slate-100">{t('status.overtime')}</SelectItem>
                              <SelectItem value="leave" className="text-xs text-slate-900 dark:text-slate-100">{t('status.leave')}</SelectItem>
                              <SelectItem value="holiday" className="text-xs text-slate-900 dark:text-slate-100">{t('status.holiday')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                            {getStatusIcon(record.status)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-2 border-r border-gray-100/40 dark:border-slate-700/40 group-hover:bg-white/50 dark:group-hover:bg-slate-800/50 transition-all duration-200">
                        <Input
                          type="number"
                          value={record.bonus}
                          onChange={(e) => updateAttendance(record.employeeId, 'bonus', Number(e.target.value))}
                          className="w-20 text-xs border-slate-200 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          placeholder="0"
                          disabled={bulkEditMode}
                        />
                      </TableCell>
                      <TableCell className="px-3 py-2 group-hover:bg-white/50 dark:group-hover:bg-slate-800/50 transition-all duration-200">
                        <Input
                          value={record.notes}
                          onChange={(e) => updateAttendance(record.employeeId, 'notes', e.target.value)}
                          className="w-32 text-xs border-slate-200 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          placeholder={t('table.optionalNotes')}
                          disabled={bulkEditMode}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}