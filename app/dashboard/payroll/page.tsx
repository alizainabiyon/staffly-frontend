'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Calculator,
  Clock,
  CreditCard,
  Building,
  ArrowRight,
  UserCheck,
  Receipt,
  DollarSign
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  fetchEmployees,
  selectEmployees,
  selectEmployeeLoading,
  selectEmployeeStats
} from '@/lib/store/slices/employeeSlice';
import { formatCurrency } from '@/lib/utils/helpers';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function PayrollPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const employees = useAppSelector(selectEmployees);
  const loading = useAppSelector(selectEmployeeLoading);
  const stats = useAppSelector(selectEmployeeStats);
  const t = useTranslations('Payroll');

  useEffect(() => {
    dispatch(fetchEmployees({}));
  }, [dispatch]);

  const payrollModules = [
    {
      title: t('modules.employeeManagement.title'),
      description: t('modules.employeeManagement.description'),
      icon: UserCheck,
      color: 'bg-blue-500',
      href: '/dashboard/payroll/employees',
      stats: `${stats.total} ${t('modules.employeeManagement.stats')}`
    },
    {
      title: t('modules.salarySlips.title'),
      description: t('modules.salarySlips.description'),
      icon: Receipt,
      color: 'bg-green-500',
      href: '/dashboard/payroll/salary-slips',
      stats: t('modules.salarySlips.stats')
    },
    {
      title: t('modules.attendanceManagement.title'),
      description: t('modules.attendanceManagement.description'),
      icon: Clock,
      color: 'bg-purple-500',
      href: '/dashboard/payroll/attendance',
      stats: t('modules.attendanceManagement.stats')
    },
    {
      title: t('modules.loansAdvances.title'),
      description: t('modules.loansAdvances.description'),
      icon: CreditCard,
      color: 'bg-orange-500',
      href: '/dashboard/payroll/loans',
      stats: t('modules.loansAdvances.stats')
    },
  ];

  const payrollStats = [
    {
      title: t('stats.totalEmployees'),
      value: stats.total.toString(),
      icon: Users,
      color: 'bg-primary'
    },
    {
      title: t('stats.activeEmployees'),
      value: stats.active.toString(),
      icon: Building,
      color: 'bg-green-500'
    },
    {
      title: t('stats.monthlyPayroll'),
      value: formatCurrency(stats.totalSalaryExpense),
      icon: Calculator,
      color: 'bg-blue-500'
    },
    {
      title: t('stats.averageSalary'),
      value: formatCurrency(stats.averageSalary),
      icon: DollarSign,
      color: 'bg-purple-500'
    },
  ];

  const handleNavigateToModule = (href: string) => {
    router.push(href);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {payrollStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payroll Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {payrollModules.map((module, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={() => handleNavigateToModule(module.href)}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${module.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{module.stats}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground mb-4">{module.description}</p>
              <Button 
                variant="outline" 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigateToModule(module.href);
                }}
              >
                {t('accessModule')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('quickActions.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => router.push('/dashboard/payroll/employees')}
            >
              <UserCheck className="h-6 w-6" />
              <span>{t('quickActions.addEmployee')}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => router.push('/dashboard/payroll/attendance')}
            >
              <Clock className="h-6 w-6" />
              <span>{t('quickActions.markAttendance')}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => router.push('/dashboard/payroll/salary-slips')}
            >
              <Receipt className="h-6 w-6" />
              <span>{t('quickActions.generateSalarySlip')}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => router.push('/dashboard/payroll/loans')}
            >
              <CreditCard className="h-6 w-6" />
              <span>{t('quickActions.processLoan')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recentActivity.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">{t('recentActivity.welcome')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('recentActivity.description')}
                </p>
                <div className="flex justify-center gap-4">
                  <Button onClick={() => router.push('/dashboard/payroll/employees')}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    {t('recentActivity.manageEmployees')}
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/dashboard/payroll/attendance')}>
                    <Clock className="h-4 w-4 mr-2" />
                    {t('recentActivity.trackAttendance')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}