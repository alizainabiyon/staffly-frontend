'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Eye,
  Edit,
  Coffee,
  Home,
  Zap,
  Trash2
} from 'lucide-react';
import { Employee, MonthlyAttendanceRecord } from '@/lib/types';
import { formatDate } from '@/lib/utils/helpers';
import { DataTable, TableColumn, TableAction } from '@/components/ui/data-table';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  fetchMonthlyAttendance,
  refreshAttendanceData,
  deleteAttendance,
  setFilters,
  clearError,
  selectMonthlyRecords,
  selectAttendanceLoading,
  selectAttendanceError,
  selectCurrentMonth,
  selectCurrentYear,
  selectAttendanceStats,
} from '@/lib/store/slices/attendanceSlice';
import { toast } from 'sonner';

interface AttendanceHistoryProps {
  employees: Employee[];
  onEditAttendance: (attendanceId: string) => void;
  onViewDetails: (attendanceId: string, date: string) => void;
}

export function AttendanceHistory({ employees, onEditAttendance, onViewDetails }: AttendanceHistoryProps) {
  const dispatch = useAppDispatch();
  const attendanceData = useAppSelector(selectMonthlyRecords);
  const loading = useAppSelector(selectAttendanceLoading);
  const error = useAppSelector(selectAttendanceError);
  const currentMonth = useAppSelector(selectCurrentMonth);
  const currentYear = useAppSelector(selectCurrentYear);
  const stats = useAppSelector(selectAttendanceStats);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attendanceToDelete, setAttendanceToDelete] = useState<MonthlyAttendanceRecord | null>(null);

  // Fetch attendance data when component mounts or when month/year changes
  useEffect(() => {
    dispatch(fetchMonthlyAttendance({ month: currentMonth, year: currentYear }));
  }, [dispatch, currentMonth, currentYear]);

  const handleMonthChange = (month: number) => {
    dispatch(setFilters({ month, year: currentYear }));
  };

  const handleYearChange = (year: number) => {
    dispatch(setFilters({ month: currentMonth, year }));
  };

  const handleDeleteClick = (record: MonthlyAttendanceRecord) => {
    setAttendanceToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!attendanceToDelete) return;
    
    try {
      await dispatch(deleteAttendance(attendanceToDelete.attendanceId)).unwrap();
      toast.success('Attendance deleted successfully');
    } catch (error: any) {
      toast.error(error || 'Failed to delete attendance');
    } finally {
      setDeleteDialogOpen(false);
      setAttendanceToDelete(null);
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'halfDay':
        return 'bg-orange-100 text-orange-800';
      case 'overtime':
        return 'bg-blue-100 text-blue-800';
      case 'leave':
        return 'bg-purple-100 text-purple-800';
      case 'holiday':
        return 'bg-gray-100 text-gray-800';
      case 'weekend':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'overtime':
        return <Zap className="h-4 w-4 text-blue-600" />;
      case 'leave':
        return <Coffee className="h-4 w-4 text-purple-600" />;
      case 'holiday':
      case 'weekend':
        return <Home className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  // Define table columns
  const columns: TableColumn<MonthlyAttendanceRecord>[] = [
    {
      key: 'date',
      header: 'Date',
      accessor: (record) => (
        <div>
          <p className="font-medium">{formatDate(record.date)}</p>
          <p className="text-sm text-muted-foreground">{record.day}</p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'totalEmployees',
      header: 'Total Employees',
      accessor: (record) => (
        <div className="text-center">
          <span className="font-medium">{record.totalEmployees}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'present',
      header: 'Present',
      accessor: (record) => (
        <Badge className={getStatusColor('present')}>
          <div className="flex items-center gap-1">
            {getStatusIcon('present')}
            {record.totalPresent}
          </div>
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'absent',
      header: 'Absent',
      accessor: (record) => (
        <Badge className={getStatusColor('absent')}>
          <div className="flex items-center gap-1">
            {getStatusIcon('absent')}
            {record.totalAbsent}
          </div>
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'late',
      header: 'Late',
      accessor: (record) => (
        <Badge className={getStatusColor('late')}>
          <div className="flex items-center gap-1">
            {getStatusIcon('late')}
            {record.totalLate}
          </div>
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'halfDay',
      header: 'Half Day',
      accessor: (record) => (
        <Badge className={getStatusColor('halfDay')}>
          <div className="flex items-center gap-1">
            {getStatusIcon('halfDay')}
            {record.totalHalfDay}
          </div>
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'leave',
      header: 'On Leave',
      accessor: (record) => (
        <Badge className={getStatusColor('leave')}>
          <div className="flex items-center gap-1">
            {getStatusIcon('leave')}
            {record.totalOnLeave}
          </div>
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'overtime',
      header: 'Overtime (hrs)',
      accessor: (record) => (
        <span className="font-medium text-blue-600">{record.totalOvertime.toFixed(1)}h</span>
      ),
      sortable: true,
    },
  ];

  // Define table actions
  const actions: TableAction<MonthlyAttendanceRecord>[] = [
    {
      label: 'View Details',
      icon: <Eye className="h-4 w-4" />,
      onClick: (record) => {
        onViewDetails(record.attendanceId, record.date);
      },
      variant: 'ghost',
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (record) => {
        onEditAttendance(record.attendanceId);
      },
      variant: 'ghost',
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (record) => {
        handleDeleteClick(record);
      },
      variant: 'ghost',
    },
  ];

  const exportHistory = () => {
    console.log('Exporting attendance history...');
    // Add your export logic here
  };

  // Generate month and year options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    return {
      value: (i + 1).toString(),
      label: date.toLocaleDateString('en-US', { month: 'long' })
    };
  });

  const yearOptions = Array.from({ length: 7 }, (_, i) => {
    const year = 2024 + i;
    return {
      value: year.toString(),
      label: year.toString()
    };
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        
        <div className="flex items-center gap-2 ml-auto">
          <Select 
            value={currentMonth.toString()} 
            onValueChange={(value) => handleMonthChange(parseInt(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={currentYear.toString()} 
            onValueChange={(value) => handleYearChange(parseInt(value))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading attendance data...</span>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Failed to Load Data</h3>
              <p className="text-red-500 mb-4">{error}</p>
              <Button 
                onClick={() => {
                  dispatch(clearError());
                  dispatch(refreshAttendanceData());
                }}
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          data={attendanceData}
          columns={columns}
          title="Monthly Attendance Summary"
          subtitle={`View attendance summaries for ${monthOptions[currentMonth - 1]?.label} ${currentYear}`}
          searchable={false}
          actions={actions}
          pagination={{ enabled: true, pageSize: 31, pageSizeOptions: [15, 30, 50] }}
          sortable={true}
          onExport={exportHistory}
          emptyMessage="No attendance records found for the selected period"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Attendance"
        description={`Are you sure you want to delete the attendance record for ${attendanceToDelete ? formatDate(attendanceToDelete.date) : ''}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
        loadingText="Deleting..."
      />
    </div>
  );
}