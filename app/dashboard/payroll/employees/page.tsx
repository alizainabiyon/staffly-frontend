'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserPlus,
  ArrowLeft
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  fetchEmployees,
  fetchEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  setFilters,
  selectEmployees,
  selectEmployeeLoading,
  selectEmployeeError,
  selectEmployeeFilters,
  selectEmployeeStats
} from '@/lib/store/slices/employeeSlice';
import { Employee } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';
import { DEPARTMENTS } from '@/lib/utils/constants';
import { AddEmployeeForm } from '@/components/payroll/AddEmployeeForm';
import { DataTable } from '@/components/ui/data-table';
import { 
  createTextColumn, 
  createBadgeColumn, 
  createCurrencyColumn, 
  createDateColumn,
  createViewAction,
  createEditAction,
  createDeleteAction,
  createSelectFilter,
  createDataTableConfig
} from '@/lib/utils/dataTableUtils';
import { TableColumn } from '@/components/ui/data-table';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function EmployeesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const employees = useAppSelector(selectEmployees);
  const loading = useAppSelector(selectEmployeeLoading);
  const error = useAppSelector(selectEmployeeError);
  const filters = useAppSelector(selectEmployeeFilters);
  const stats = useAppSelector(selectEmployeeStats);
  const t = useTranslations('Payroll.employees');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    dispatch(fetchEmployees(filters));
  }, [dispatch, filters]);

  const handleSearch = (search: string) => {
    dispatch(setFilters({ ...filters, search, page: 1 }));
  };

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilters({ ...filters, [key]: value, page: 1 }));
  };

  const handleAddEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await dispatch(createEmployee(employeeData)).unwrap();
      // Use the success message from the API response
      const message = result && typeof result === 'object' && 'message' in result ? result.message : t('messages.addSuccess');
      toast.success(message);
      // Refresh the employees list
      dispatch(fetchEmployees(filters));
    } catch (error: any) {
      toast.error(error.message || t('messages.addFailed'));
      // Re-throw the error so the form knows it failed and doesn't close
      throw error;
    }
  };

  const handleUpdateEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (!selectedEmployee) return;
      const result = await dispatch(updateEmployee({
        id: selectedEmployee.id,
        ...employeeData,
      })).unwrap();
      
      // Use the success message from the API response
      const message = result && typeof result === 'object' && 'message' in result ? result.message : t('messages.updateSuccess');
      toast.success(message);
      
      // Refresh the employees list
      dispatch(fetchEmployees(filters));
    } catch (error: any) {
      toast.error(error.message || t('messages.updateFailed'));
      // Re-throw the error so the form knows it failed and doesn't close
      throw error;
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (confirm(t('messages.deleteConfirm'))) {
      try {
        await dispatch(deleteEmployee(id)).unwrap();
        toast.success(t('messages.deleteSuccess'));
      } catch (error: any) {
        toast.error(error || t('messages.deleteFailed'));
      }
    }
  };

  const handleViewEmployee = async (employeeId: string) => {
    // Navigate to the employee detail page with the employee ID
    router.push(`/dashboard/payroll/employees/${employeeId}`);
  };


  const handleBackToPayroll = () => {
    router.push('/dashboard/payroll');
  };

  const employeeStats = [
    {
      title: t('stats.totalEmployees'),
      value: stats.total.toString(),
      icon: Users,
      color: 'bg-primary'
    },
    {
      title: t('stats.activeEmployees'),
      value: stats.active.toString(),
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: t('stats.monthlyPayroll'),
      value: formatCurrency(stats.totalSalaryExpense),
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: t('stats.averageSalary'),
      value: formatCurrency(stats.averageSalary),
      icon: Users,
      color: 'bg-purple-500'
    },
  ];


  // Helper function to get department badge color
  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      'HR': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      'IT': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700',
      'Finance': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700',
      'Sales': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700',
      'Marketing': 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 border-pink-300 dark:border-pink-700',
      'Operations': 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700',
      'Engineering': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
      'Support': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700',
    };
    return colors[department] || 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600';
  };

  // Define table columns
  const columns: TableColumn<Employee>[] = [
    createTextColumn<Employee>('name', t('table.columns.name'), (employee) => employee.name, { width: 'w-48' }),
    {
      key: 'department',
      header: t('table.columns.department'),
      accessor: (employee: Employee) => (
        <Badge 
          variant="outline" 
          className={`${getDepartmentColor(employee.department)} text-xs`}
        >
          {employee.department}
        </Badge>
      ),
      sortable: true,
      width: 'w-32',
      exportable: true
    },
    createTextColumn<Employee>('email', t('table.columns.email'), (employee) => employee.email, { width: 'w-48' }),
    createTextColumn<Employee>('phone', t('table.columns.phone'), (employee) => employee.phone, { width: 'w-32' }),
    createDateColumn<Employee>('joinDate', t('table.columns.joinDate'), (employee) => employee.joinDate, { width: 'w-32' }),
    createCurrencyColumn<Employee>('salary', t('table.columns.salary'), (employee) => employee.salary, { width: 'w-32' }),
  ];

  // Define table actions
  const actions = [
    createViewAction<Employee>((employee) => handleViewEmployee(employee.employeeId), t('table.actions.viewDetails')),
    createEditAction<Employee>((employee) => {
      setSelectedEmployee(employee);
      setIsAddDialogOpen(true);
    }, t('table.actions.editEmployee')),
    createDeleteAction<Employee>((employee) => handleDeleteEmployee(employee.id), t('table.actions.deleteEmployee')),
  ];

  // Create table configuration
  const tableConfig = createDataTableConfig(columns, actions, {
    title: t('title'),
    subtitle: t('subtitle'),
    searchable: true,
    searchPlaceholder: 'Search employees...',
    // filters: tableFilters,
    pagination: {
      enabled: true,
      pageSize: 20,
      pageSizeOptions: [10, 20, 50, 100]
    },
    sortable: true,
    exportOptions: {
      enablePrint: false,
      enablePDF: false,
      enableCSV: false,
      filename: 'employees-export'
    }
  });

  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBackToPayroll} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToPayroll')}
          </Button>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('title')}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              {t('subtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
            <UserPlus className="h-4 w-4 mr-2" />
            {t('addEmployee')}
          </Button>
        </div>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {employeeStats.map((stat, index) => (
          <Card key={index} className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-emerald-300/40 dark:hover:border-emerald-600/40 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{stat.title}</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Employee DataTable */}
      <DataTable
        data={employees}
        {...tableConfig}
        loading={loading}
        emptyMessage={
          filters.search || filters.department || filters.status
            ? t('table.emptyWithFilters')
            : t('table.emptyDefault')
        }
      />

      {/* Add/Edit Employee Dialog */}
      <AddEmployeeForm
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setSelectedEmployee(null);
          }
        }}
        onSubmit={selectedEmployee ? handleUpdateEmployee : handleAddEmployee}
        employee={selectedEmployee}
      />
    </div>
  );
}