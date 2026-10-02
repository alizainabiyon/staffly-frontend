'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Plus, Users, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchEmployees, selectEmployees, selectEmployeeLoading } from '@/lib/store/slices/employeeSlice';
import { selectAttendanceStats, refreshAttendanceData } from '@/lib/store/slices/attendanceSlice';
import { AttendanceContainer } from '@/components/payroll/attendance/AttendanceContainer';
import { AttendanceDialog } from '@/components/payroll/attendance/AttendanceDialog';
import { useTranslations } from 'next-intl';

export default function AttendancePage() {
  const t = useTranslations('Attendance.page');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const employees = useAppSelector(selectEmployees);
  const loading = useAppSelector(selectEmployeeLoading);
  const attendanceStats = useAppSelector(selectAttendanceStats);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [editingAttendanceId, setEditingAttendanceId] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(fetchEmployees({}));
  }, [dispatch]);

  const handleBackToPayroll = () => {
    router.push('/dashboard/payroll');
  };

  const handleEditAttendance = (attendanceId: string) => {
    setEditingAttendanceId(attendanceId);
    setIsAttendanceDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAttendanceDialogOpen(false);
    // Use setTimeout to ensure dialog is fully closed before resetting
    setTimeout(() => {
      setEditingAttendanceId(undefined);
    }, 200);
  };

  const handleOpenDialog = () => {
    // Reset the editing state before opening
    setEditingAttendanceId(undefined);
    setIsAttendanceDialogOpen(true);
  };

  const handleAttendanceSaved = async () => {
    // Refresh attendance data when attendance is saved
    try {
      await dispatch(refreshAttendanceData()).unwrap();
    } catch (error) {
      console.warn('Failed to refresh attendance data:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-end">
        <Button onClick={handleOpenDialog}>
          <Plus className="h-4 w-4 mr-2" />
          {t('markAttendance')}
        </Button>
      </div>

      {/* Attendance Container Component */}
      <AttendanceContainer 
        employees={employees} 
        onEditAttendance={handleEditAttendance}
        onAttendanceSaved={handleAttendanceSaved}
      />

      {/* Attendance Dialog */}
      <AttendanceDialog
        open={isAttendanceDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseDialog();
          } else {
            setIsAttendanceDialogOpen(open);
          }
        }}
        employees={employees}
        attendanceId={editingAttendanceId}
        setAttendanceId={setEditingAttendanceId}
        onAttendanceSaved={handleAttendanceSaved}
      />
    </div>
  );
}