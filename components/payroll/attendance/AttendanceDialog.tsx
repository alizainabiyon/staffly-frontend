'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AttendanceManagement } from './AttendanceManagement';
import { Employee } from '@/lib/types';

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  attendanceId?: string; // Optional attendanceId for editing existing attendance
  setAttendanceId: (id: string | undefined) => void;
  onAttendanceSaved?: () => void;
}

export function AttendanceDialog({ open, onOpenChange, employees, attendanceId, setAttendanceId, onAttendanceSaved }: AttendanceDialogProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [key, setKey] = useState(0); // Key to force re-render of AttendanceManagement

  // Reset state when dialog opens/closes or when attendanceId changes
  useEffect(() => {
    if (open) {
      // When opening for new attendance (no attendanceId), reset to today's date
      if (!attendanceId) {
        const today = new Date();
        setSelectedDate(today.toISOString().split('T')[0]);
        // Force re-render of AttendanceManagement to reset its internal state
        setKey(prev => prev + 1);
      }
    }
  }, [open, attendanceId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="mt-4">
          <AttendanceManagement
            key={key} // Force re-mount when key changes to reset all internal state
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            attendanceId={attendanceId}
            onSuccess={() => {
              onOpenChange(false);
              setAttendanceId(undefined);
            }}
            onAttendanceSaved={onAttendanceSaved}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 