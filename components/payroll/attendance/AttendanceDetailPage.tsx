'use client';

import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Zap,
  Users,
  User
} from 'lucide-react';
import { Employee } from '@/lib/types';
import { formatDate } from '@/lib/utils/helpers';
import { DataTable } from '@/components/ui/data-table';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  fetchAttendanceById,
  clearError,
  selectDailyAttendanceRecords,
  selectAttendanceLoadingAttendance,
  selectAttendanceError,
} from '@/lib/store/slices/attendanceSlice';
import { 
  createTextColumn, 
  createBadgeColumn, 
  createEditAction,
  createDataTableConfig
} from '@/lib/utils/dataTableUtils';
import { useTranslations } from 'next-intl';

interface AttendanceDetailPageProps{
  attendanceId: string;
  date: string;
  employees: Employee[];
  onBack: () => void;
  onEditAttendance: (attendanceId: string) => void;
}

export function AttendanceDetailPage({ 
  attendanceId, 
  date, 
  employees, 
  onBack, 
  onEditAttendance 
}: AttendanceDetailPageProps) {
  const t = useTranslations('Attendance.detail');
  const dispatch = useAppDispatch();
  const attendanceData = useAppSelector(selectDailyAttendanceRecords);
  const loading = useAppSelector(selectAttendanceLoadingAttendance);
  const error = useAppSelector(selectAttendanceError);

  // Extract attendance records from the API response (data is already transformed)
  const attendanceRecords = attendanceData || [];

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const present = attendanceRecords.filter((r: any) => r.status === 'present').length;
    const absent = attendanceRecords.filter((r: any) => r.status === 'absent').length;
    const late = attendanceRecords.filter((r: any) => r.status === 'late').length;
    const halfDay = attendanceRecords.filter((r: any) => r.status === 'half_day').length;
    const overtime = attendanceRecords.filter((r: any) => r.status === 'overtime').length;
    const totalWorkingHours = attendanceRecords.reduce((sum: number, r: any) => sum + (r.workingHours || 0), 0);
    const totalOvertimeHours = attendanceRecords.reduce((sum: number, r: any) => sum + (r.overtimeHours || 0), 0);
    const attendanceRate = attendanceRecords.length > 0 ? Math.round((present / attendanceRecords.length) * 100) : 0;

    return {
      totalEmployees: attendanceRecords.length,
      present,
      absent,
      late,
      halfDay,
      overtime,
      totalWorkingHours,
      totalOvertimeHours,
      attendanceRate
    };
  }, [attendanceRecords]);

  // Fetch attendance details when component mounts
  useEffect(() => {
    dispatch(fetchAttendanceById({ id: attendanceId, employees }));
  }, [dispatch, attendanceId, employees]);

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
      case 'overtime':
        return <Zap className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };


  // Define table columns for individual employee attendance
  const columns = useMemo(() => [
    createTextColumn<any>('employee', t('columns.employee'), (record) => {
      return record.name || 'Unknown Employee';
    }, { 
      width: 'w-48'
    }),
    createTextColumn<any>('employeeId', t('columns.employeeId'), (record) => {
      return record.employeeId || 'N/A';
    }, { 
      width: 'w-32'
    }),
    createTextColumn<any>('department', t('columns.department'), (record) => {
      return record.department || 'N/A';
    }, { 
      width: 'w-32'
    }),
    createTextColumn<any>('checkIn', t('columns.checkIn'), (record) => {
      return record.checkIn || '-';
    }, { 
      width: 'w-20'
    }),
    createTextColumn<any>('checkOut', t('columns.checkOut'), (record) => {
      return record.checkOut || '-';
    }, { 
      width: 'w-20'
    }),
    {
      key: 'status',
      header: t('columns.status'),
      label: t('columns.status'),
      accessor: (record: any) => {
        const status = record.status || 'unknown';
        const statusLabel = status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
        
        return (
          <Badge className={`${getStatusColor(status)} flex items-center gap-1 w-fit border-0`}>
            {getStatusIcon(status)}
            <span>{statusLabel}</span>
          </Badge>
        );
      },
      width: 'w-32',
      sortable: true,
      sortKey: (record: any) => record.status || 'unknown'
    },
    createTextColumn<any>('workingHours', t('columns.workingHours'), (record) => {
      const hours = record.workingHours || 0;
      return `${hours.toFixed(1)}h`;
    }, { 
      width: 'w-24'
    }),
    createTextColumn<any>('overtimeHours', t('columns.overtime'), (record) => {
      const overtime = record.overtimeHours || 0;
      return overtime > 0 ? `${overtime.toFixed(1)}h` : '-';
    }, { 
      width: 'w-16'
    }),
    createTextColumn<any>('notes', t('columns.notes'), (record) => {
      return record.notes || '-';
    }, { 
      width: 'w-48',
      sortable: false
    }),
  ], [t]);

  // Define table actions
  const actions = useMemo(() => [
    createEditAction<any>(() => {
      onEditAttendance(attendanceId);
    }, t('actions.editAttendance')),
  ], [onEditAttendance, attendanceId, t]);

  // Create table configuration
  const tableConfig = useMemo(() => createDataTableConfig(columns, actions, {
    title: t('employeeAttendanceDetails'),
    subtitle: `${formatDate(date)} • ${new Date(date).toLocaleDateString('en-US', { weekday: 'long' })} • ${attendanceRecords.length} employees`,
    searchable: true,
    searchPlaceholder: t('searchPlaceholder'),
    pagination: {
      enabled: true,
      pageSize: 10,
      pageSizeOptions: [5, 10, 20, 50]
    },
    sortable: true,
    exportOptions: {
      enablePrint: true,
      enablePDF: false,
      enableCSV: false,
      filename: `attendance-${date}`
    }
  }), [columns, actions, date, attendanceRecords.length]);

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <span className="ml-3 text-slate-700 dark:text-slate-300">{t('loading')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <Card className="border-red-200/60 dark:border-red-700/60 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="p-8">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">{t('failedToLoad')}</h3>
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button 
                onClick={() => {
                  dispatch(clearError());
                  dispatch(fetchAttendanceById({ id: attendanceId, employees }));
                }}
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                {t('retry')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToAttendance')}
          </Button>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" />
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('title')}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {formatDate(date)} • {new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}
            </p>
          </div>
        </div>
      </div>

      {/* Attendance Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-emerald-300/40 dark:hover:border-emerald-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.totalEmployees')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{summaryStats.totalEmployees}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-green-300/40 dark:hover:border-green-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.present')}</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{summaryStats.present}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-red-300/40 dark:hover:border-red-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.absent')}</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">{summaryStats.absent}</p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <XCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-blue-300/40 dark:hover:border-blue-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.attendanceRate')}</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{summaryStats.attendanceRate}%</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Attendance Table */}
      <DataTable
        data={attendanceRecords}
        {...tableConfig}
        loading={loading}
        emptyMessage={t('noRecords')}
      />
    </div>
  );
}
