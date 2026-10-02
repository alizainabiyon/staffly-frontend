'use client';

import { useState } from 'react';
import { AttendanceHistory } from './AttendanceHistory';
import { AttendanceDetailPage } from './AttendanceDetailPage';
import { Employee } from '@/lib/types';

interface AttendanceContainerProps {
  employees: Employee[];
  onEditAttendance: (attendanceId: string) => void;
  onAttendanceSaved?: () => void;
}

export function AttendanceContainer({ employees, onEditAttendance, onAttendanceSaved }: AttendanceContainerProps) {
  const [currentView, setCurrentView] = useState<'history' | 'detail'>('history');
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleViewDetails = (attendanceId: string, date: string) => {
    setSelectedAttendanceId(attendanceId);
    setSelectedDate(date);
    setCurrentView('detail');
  };

  const handleBackToHistory = () => {
    setCurrentView('history');
    setSelectedAttendanceId('');
    setSelectedDate('');
  };

  const handleEditAttendance = (attendanceId: string) => {
    onEditAttendance(attendanceId);
  };

  if (currentView === 'detail') {
    return (
      <AttendanceDetailPage
        attendanceId={selectedAttendanceId}
        date={selectedDate}
        employees={employees}
        onBack={handleBackToHistory}
        onEditAttendance={handleEditAttendance}
      />
    );
  }

  return (
    <AttendanceHistory
      employees={employees}
      onEditAttendance={handleEditAttendance}
      onViewDetails={handleViewDetails}
    />
  );
}
