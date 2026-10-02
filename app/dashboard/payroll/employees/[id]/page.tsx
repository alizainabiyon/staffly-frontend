'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchEmployeeById, setSelectedEmployee } from '@/lib/store/slices/employeeSlice';
import { EmployeeDetailView } from '@/components/payroll/EmployeeDetailView';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function EmployeeDetailPage() {
  const t = useTranslations('Employee.detail');
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const employeeId = params.id as string;
  const { selectedEmployee, loading, error } = useAppSelector((state) => state.employees);

  // Memoize the employee data to prevent unnecessary re-renders
  const employeeData = useMemo(() => {
    return selectedEmployee && selectedEmployee.employeeId === employeeId 
      ? selectedEmployee 
      : null;
  }, [selectedEmployee, employeeId]);

  // Fetch employee data when component mounts or employeeId changes
  useEffect(() => {
    if (employeeId && (!selectedEmployee || selectedEmployee.employeeId !== employeeId)) {
      console.log('Fetching employee data for ID:', employeeId);
      dispatch(fetchEmployeeById(employeeId));
    }
  }, [dispatch, employeeId]); // Removed selectedEmployee from dependencies to prevent infinite loop

  // Cleanup: clear selectedEmployee when component unmounts
  useEffect(() => {
    return () => {
      dispatch(setSelectedEmployee(null));
    };
  }, [dispatch]);

  const handleBackToList = () => {
    router.push('/dashboard/payroll/employees');
  };

  const handleUpdateEmployee = async (employeeData: any) => {
    // This will be handled by the EmployeeDetailView component
    // The component will dispatch the update action
  };

  const handleDeleteEmployee = async (id: string) => {
    // This will be handled by the EmployeeDetailView component
    // The component will dispatch the delete action and navigate back
    router.push('/dashboard/payroll/employees');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-lg">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-100">{t('loading')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
              {t('loadingDescription')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBackToList} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToEmployees')}
          </Button>
        </div>
        
        <Card className="border-red-200/60 dark:border-red-700/60 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <h3 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">{t('errorLoading')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-4">
              {error}
            </p>
            <Button onClick={() => dispatch(fetchEmployeeById(employeeId))} className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
              {t('tryAgain')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBackToList} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToEmployees')}
          </Button>
        </div>
        
        <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-100">{t('notFound')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
              {t('notFoundDescription')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <EmployeeDetailView
      employee={employeeData}
      onUpdate={handleUpdateEmployee}
      onDelete={handleDeleteEmployee}
      onBack={handleBackToList}
    />
  );
}
