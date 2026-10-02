'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { 
  User, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign,
  Building,
  FileText,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowLeft,
  Printer,
  GraduationCap,
  Users,
  Briefcase,
  X,
  Eye,
  Receipt
} from 'lucide-react';
import { Employee } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';
import { AddEmployeeForm } from './AddEmployeeForm';
import { toast } from 'sonner';
import { updateEmployee, deleteEmployee } from '@/lib/store/slices/employeeSlice';
import { 
  fetchEmployeeMonthlyAttendance,
  selectDailyAttendanceRecords,
  selectAttendanceLoading,
  selectAttendanceError,
  clearDailyAttendance
} from '@/lib/store/slices/attendanceSlice';
import { 
  fetchEmployeeExpenses,
  selectEmployeeExpenses,
  selectEmployeeExpenseLoading,
  selectEmployeeExpenseError,
  clearExpenses
} from '@/lib/store/slices/employeeExpenseSlice';
import { 
  fetchEmployeeSalaryHistory,
  selectEmployeeSalaryHistory,
  selectEmployeeSalaryLoading,
  selectEmployeeSalaryError,
  clearEmployeeSalaryHistory
} from '@/lib/store/slices/employeeSalarySlice';
import { 
  createTextColumn, 
  createCurrencyColumn, 
  createDateColumn,
  createBadgeColumn,
  createDataTableConfig,
  createViewAction
} from '@/lib/utils/dataTableUtils';
import { DataTable } from '@/components/ui/data-table';

interface EmployeeDetailViewProps {
  employee: Employee;
  onUpdate: (employee: any) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export function EmployeeDetailView({ employee, onUpdate, onDelete, onBack }: EmployeeDetailViewProps) {
  const t = useTranslations('Employee.detail');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleEdit = async (updatedEmployee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const payload = {
        id: employee.id,
        ...updatedEmployee,
      };

      const result = await dispatch(updateEmployee(payload)).unwrap();
      
      onUpdate(updatedEmployee);
      setIsEditDialogOpen(false);
      
      toast.success(result.message || t('updateSuccess'));
    } catch (error: any) {
      console.error('Failed to update employee:', error);
      toast.error(error.message || t('updateFailed'));
    }
  };

  const handleDelete = async () => {
    if (confirm(t('deleteConfirm'))) {
      try {
        await dispatch(deleteEmployee(employee.id)).unwrap();
        toast.success(t('deleteSuccess'));
        onDelete(employee.id);
        router.push('/dashboard/payroll/employees');
      } catch (error: any) {
        toast.error(error.message || t('deleteFailed'));
      }
    }
  };

  const handlePrint = () => {
    setIsPrintDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const yearsOfService = Math.floor(
    (new Date().getTime() - new Date(employee.joinDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  // Get attendance data from employee object (if available from API)
  const attendanceData = (employee as any)?.attendance || [];
  const expenseData = (employee as any)?.expense || [];

  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToEmployees')}
          </Button>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" />
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {employee.profilePic ? (
                <AvatarImage src={employee.profilePic} />
              ) : (
                <AvatarFallback className="bg-emerald-600 dark:bg-emerald-500 text-white text-sm font-semibold">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{employee.name}</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">{employee.position} • {employee.department}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(employee.status)}>
            {employee.status}
          </Badge>
          <Button variant="outline" size="sm" onClick={handlePrint} className="border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <Printer className="h-4 w-4 mr-2" />
            {t('print')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)} className="border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <Edit className="h-4 w-4 mr-2" />
            {t('edit')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete} className="border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400">
            <Trash2 className="h-4 w-4 mr-2" />
            {t('delete')}
          </Button>
        </div>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-emerald-300/40 dark:hover:border-emerald-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.monthlySalary')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(employee.salary)}</p>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-blue-300/40 dark:hover:border-blue-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.yearsOfService')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{yearsOfService}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-orange-300/40 dark:hover:border-orange-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.totalExpenses')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(expenseData.reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0))}
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <Receipt className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-purple-300/40 dark:hover:border-purple-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.attendanceRate')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {attendanceData.length > 0 
                    ? Math.round((attendanceData.filter((att: any) => att.status === 'present').length / attendanceData.length) * 100)
                    : 0
                  }%
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
          >
            {t('tabs.overview')}
          </TabsTrigger>
          <TabsTrigger 
            value="attendance"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
          >
            {t('tabs.attendance')}
          </TabsTrigger>
          <TabsTrigger 
            value="expenses"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
          >
            {t('tabs.expenses')}
          </TabsTrigger>
          <TabsTrigger 
            value="salary"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
          >
            {t('tabs.salary')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Personal Information */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                    <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  {t('overview.personalInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.employeeId')}</p>
                    <p className="text-foreground">{employee.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.cnic')}</p>
                    <p className="text-foreground">{employee.cnic}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.age')}</p>
                    <p className="text-foreground">{employee.age || 'N/A'} {t('overview.fields.years')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.cast')}</p>
                    <p className="text-foreground">{employee.cast || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.study')}</p>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">{employee.study || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.email')}</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">{employee.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.phone')}</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">{employee.phone}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.address')}</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-foreground">{employee.address}</p>
                      {employee.address2 && (
                        <p className="text-foreground text-sm">{employee.address2}</p>
                      )}
                    </div>
                  </div>
                </div>
                {(employee.emergencyContacts || []).length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-muted-foreground mb-2">{t('overview.emergencyContacts')}</p>
                    <div className="space-y-2">
                      {employee.emergencyContacts.map((contact, index) => (
                        <div key={index} className="text-sm">
                          <p className="text-foreground">{contact.name} ({contact.relation})</p>
                          <p className="text-muted-foreground">{contact.phone} • {contact.occupation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Employment Information */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  {t('overview.employmentInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.department')}</p>
                    <p className="text-foreground">{employee.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.position')}</p>
                    <p className="text-foreground">{employee.position}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.joinDate')}</p>
                    <p className="text-foreground">{formatDate(employee.joinDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.status')}</p>
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.monthlySalary')}</p>
                    <p className="text-foreground font-semibold">{formatCurrency(employee.salary)}</p>
                  </div>
                  {employee.bankAccount && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.bankAccount')}</p>
                      <p className="text-foreground">{employee.bankAccount}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Work Experience */}
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                  <Briefcase className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                {t('overview.workExperience')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {(employee.experiences || []).map((exp, index) => (
                  <div key={index} className="border border-slate-200/60 dark:border-slate-700/60 rounded-lg p-3 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded">
                        <Briefcase className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t('overview.workExperience')} {index + 1}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.jobTitle')}</p>
                        <p className="text-foreground font-medium">{exp.title}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.companyAddress')}</p>
                        <p className="text-foreground">{exp.address}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.fromDate')}</p>
                        <p className="text-foreground">{formatDate(exp.from)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.toDate')}</p>
                        <p className="text-foreground">{formatDate(exp.to)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t('overview.fields.jobDescription')}</p>
                      <p className="text-foreground">{exp.description}</p>
                    </div>
                  </div>
                ))}
                {(employee.experiences || []).length === 0 && (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">{t('overview.noExperience')}</h3>
                    <p className="text-muted-foreground">{t('overview.noExperienceDescription')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceTab employeeId={employee.employeeId} employeeName={employee.name} />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpensesTab employeeId={employee.employeeId} employeeName={employee.name} />
        </TabsContent>

        <TabsContent value="salary">
          <SalaryTab employeeId={employee.employeeId} employeeName={employee.name} />
        </TabsContent>
      </Tabs>

      {/* Edit Employee Dialog */}
      <AddEmployeeForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEdit}
        employee={employee}
      />

      {/* Print Dialog */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Printer className="h-5 w-5" />
                {t('print.title')}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" />
                  {t('print')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsPrintDialogOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {/* Print Content */}
          <div className="print-content bg-white p-6 space-y-6">
            {/* Header */}
            <div className="text-center border-b pb-4">
              <h1 className="text-2xl font-bold text-gray-900">{t('print.companyName')}</h1>
              <p className="text-gray-600">{t('print.companyDescription')}</p>
              <h2 className="text-xl font-semibold mt-4">{t('print.profileTitle')}</h2>
            </div>

            {/* Employee Photo and Basic Info */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                  {employee.profilePic ? (
                    <img src={employee.profilePic} alt={employee.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-4xl font-bold text-gray-500">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{employee.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">{t('overview.fields.employeeId')}:</span>
                    <span className="ml-2 text-gray-900">{employee.employeeId}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">{t('overview.fields.position')}:</span>
                    <span className="ml-2 text-gray-900">{employee.position}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">{t('overview.fields.department')}:</span>
                    <span className="ml-2 text-gray-900">{employee.department}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">{t('overview.fields.status')}:</span>
                    <span className="ml-2 text-gray-900 capitalize">{employee.status}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">{t('overview.fields.joinDate')}:</span>
                    <span className="ml-2 text-gray-900">{formatDate(employee.joinDate)}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">{t('overview.fields.monthlySalary')}:</span>
                    <span className="ml-2 text-gray-900">{formatCurrency(employee.salary)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-4 text-center text-sm text-gray-600">
              <p>{t('print.generatedOn')} {new Date().toLocaleDateString()} {t('print.at')} {new Date().toLocaleTimeString()}</p>
              <p>{t('print.generatedBy')}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Attendance Tab Component
function AttendanceTab({ employeeId, employeeName }: { employeeId: string; employeeName: string }) {
  const t = useTranslations('Employee.detail.attendance');
  const dispatch = useAppDispatch();
  const monthlyAttendance = useAppSelector(selectDailyAttendanceRecords);
  const loading = useAppSelector(selectAttendanceLoading);
  const error = useAppSelector(selectAttendanceError);

  // Local state for month/year selection (specific to this employee)
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

  // Fetch attendance data when component mounts or filters change
  useEffect(() => {
    if (employeeId) {
      console.log('Fetching attendance for:', { employeeId, month: selectedMonth, year: selectedYear });
      dispatch(fetchEmployeeMonthlyAttendance({ employeeId, month: selectedMonth, year: selectedYear }));
    }
  }, [dispatch, employeeId, selectedMonth, selectedYear]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Cleanup: clear attendance data when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearDailyAttendance());
    };
  }, [dispatch]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(parseInt(month));
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(parseInt(year));
  };

  // Generate month options using translations
  const monthOptions = [
    { value: '1', label: t('months.january') },
    { value: '2', label: t('months.february') },
    { value: '3', label: t('months.march') },
    { value: '4', label: t('months.april') },
    { value: '5', label: t('months.may') },
    { value: '6', label: t('months.june') },
    { value: '7', label: t('months.july') },
    { value: '8', label: t('months.august') },
    { value: '9', label: t('months.september') },
    { value: '10', label: t('months.october') },
    { value: '11', label: t('months.november') },
    { value: '12', label: t('months.december') },
  ];

  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = currentYear - 5 + i;
    return { value: year.toString(), label: year.toString() };
  });

  // Define table columns
  const columns = [
    createDateColumn<any>('date', t('columns.date'), (attendance) => attendance.date, { width: 'w-32' }),
    createTextColumn<any>('day', t('columns.day'), (attendance) => attendance.day, { width: 'w-24' }),
    createTextColumn<any>('checkInTime', t('columns.checkIn'), (attendance) => {
      if (!attendance.checkInTime) return 'N/A';
      return new Date(attendance.checkInTime).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }, { width: 'w-32' }),
    createTextColumn<any>('checkOutTime', t('columns.checkOut'), (attendance) => {
      if (!attendance.checkOutTime) return 'N/A';
      return new Date(attendance.checkOutTime).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }, { width: 'w-32' }),
    createBadgeColumn<any>('attendanceStatus', t('columns.status'), (attendance) => attendance.attendanceStatus, { 
      variant: 'outline',
      width: 'w-24'
    }),
    createTextColumn<any>('workingHours', t('columns.workingHours'), (attendance) => `${attendance.workingHours || 0}h`, { width: 'w-32' }),
    createTextColumn<any>('overTime', t('columns.overtime'), (attendance) => `${attendance.overTime || 0}h`, { width: 'w-32' }),
    createTextColumn<any>('note', t('columns.note'), (attendance) => attendance.note || 'N/A', { width: 'w-48' }),
  ];

  const tableConfig = createDataTableConfig(columns, [], {
    title: `${t('title')} ${employeeName}`,
    subtitle: `${t('subtitle')} ${monthOptions.find(m => m.value === selectedMonth.toString())?.label} ${selectedYear}`,
    searchable: true,
    searchPlaceholder: t('searchPlaceholder'),
    pagination: {
      enabled: true,
      pageSize: 31, // Show all days of the month
      pageSizeOptions: [15, 31, 50]
    },
    sortable: true,
    exportOptions: {
      enablePrint: true,
      enablePDF: false,
      enableCSV: false,
      filename: `${employeeName.toLowerCase().replace(/\s+/g, '-')}-attendance-${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`
    }
  });

  return (
    <div className="space-y-5">
      {/* Compact Month/Year Selection */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="month" className="text-xs font-medium mb-1.5 block text-slate-700 dark:text-slate-300">{t('month')}</Label>
              <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={t('selectMonth')} />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="year" className="text-xs font-medium mb-1.5 block text-slate-700 dark:text-slate-300">{t('year')}</Label>
              <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={t('selectYear')} />
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
        </CardContent>
      </Card>

      {/* Attendance Data Table */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardContent className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-medium mb-2">{t('loading')}</h3>
                <p className="text-muted-foreground">{t('loadingDescription')}</p>
              </div>
            </div>
          ) : monthlyAttendance && monthlyAttendance.length > 0 ? (
            <DataTable
              data={monthlyAttendance}
              {...tableConfig}
              loading={loading}
              emptyMessage={t('noRecordsDescription')}
            />
          ) : (
            <div className="text-center py-8">
              <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">{t('noRecords')}</h3>
              <p className="text-muted-foreground">
                {t('noRecordsDescription')} {monthOptions.find(m => m.value === selectedMonth.toString())?.label} {selectedYear}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Expenses Tab Component
function ExpensesTab({ employeeId, employeeName }: { employeeId: string; employeeName: string }) {
  const t = useTranslations('Employee.detail.expenses');
  const dispatch = useAppDispatch();
  const expenses = useAppSelector(selectEmployeeExpenses);
  const loading = useAppSelector(selectEmployeeExpenseLoading);
  const error = useAppSelector(selectEmployeeExpenseError);

  // Local state for month/year selection (specific to this employee)
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

  // Fetch expense data when component mounts or filters change
  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeExpenses({ employeeId, month: selectedMonth, year: selectedYear }));
    }
  }, [dispatch, employeeId, selectedMonth, selectedYear]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Cleanup: clear expense data when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearExpenses());
    };
  }, [dispatch]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(parseInt(month));
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(parseInt(year));
  };

  // Generate month options using translations
  const monthOptions = [
    { value: '1', label: t('months.january') },
    { value: '2', label: t('months.february') },
    { value: '3', label: t('months.march') },
    { value: '4', label: t('months.april') },
    { value: '5', label: t('months.may') },
    { value: '6', label: t('months.june') },
    { value: '7', label: t('months.july') },
    { value: '8', label: t('months.august') },
    { value: '9', label: t('months.september') },
    { value: '10', label: t('months.october') },
    { value: '11', label: t('months.november') },
    { value: '12', label: t('months.december') },
  ];

  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = currentYear - 5 + i;
    return { value: year.toString(), label: year.toString() };
  });

  // Define table columns
  const columns = [
    createDateColumn<any>('expenseDate', t('columns.date'), (expense) => expense.expenseDate, { width: 'w-32' }),
    createTextColumn<any>('description', t('columns.description'), (expense) => expense.description, { width: 'w-64' }),
    createTextColumn<any>('amount', t('columns.amount'), (expense) => expense.amount, { width: 'w-32' }),
    createTextColumn<any>('type', t('columns.type'), (expense) => expense.type, { width: 'w-24' }),
    createTextColumn<any>('catagory', t('columns.category'), (expense) => expense.catagory, { width: 'w-24' }),
    createDateColumn<any>('createdAt', t('columns.created'), (expense) => expense.createdAt, { width: 'w-32' }),
  ];

  const tableConfig = createDataTableConfig(columns, [], {
    title: `${t('title')} ${employeeName}`,
    subtitle: `${t('subtitle')} ${monthOptions.find(m => m.value === selectedMonth.toString())?.label} ${selectedYear}`,
    searchable: true,
    searchPlaceholder: t('searchPlaceholder'),
    pagination: {
      enabled: true,
      pageSize: 20,
      pageSizeOptions: [10, 20, 50, 100]
    },
    sortable: true,
    exportOptions: {
      enablePrint: true,
      enablePDF: false,
      enableCSV: false,
      filename: `${employeeName.toLowerCase().replace(/\s+/g, '-')}-expenses-${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`
    }
  });

  return (
    <div className="space-y-5">
      {/* Compact Month/Year Selection */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="month" className="text-xs font-medium mb-1.5 block text-slate-700 dark:text-slate-300">{t('month')}</Label>
              <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={t('selectMonth')} />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="year" className="text-xs font-medium mb-1.5 block text-slate-700 dark:text-slate-300">{t('year')}</Label>
              <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={t('selectYear')} />
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
        </CardContent>
      </Card>

      {/* Expense Data Table */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardContent className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-medium mb-2">{t('loading')}</h3>
                <p className="text-muted-foreground">{t('loadingDescription')}</p>
              </div>
            </div>
          ) : expenses && expenses.length > 0 ? (
            <DataTable
              data={expenses}
              {...tableConfig}
              loading={loading}
              emptyMessage={t('noRecordsDescription')}
            />
          ) : (
            <div className="text-center py-8">
              <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">{t('noRecords')}</h3>
              <p className="text-muted-foreground">
                {t('noRecordsDescription')} {monthOptions.find(m => m.value === selectedMonth.toString())?.label} {selectedYear}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Salary Tab Component
function SalaryTab({ employeeId, employeeName }: { employeeId: string; employeeName: string }) {
  const t = useTranslations('Employee.detail.salary');
  const tMonths = useTranslations('Employee.detail.attendance.months');
  const dispatch = useAppDispatch();
  const salaryHistory = useAppSelector(selectEmployeeSalaryHistory);
  const loading = useAppSelector(selectEmployeeSalaryLoading);
  const error = useAppSelector(selectEmployeeSalaryError);

  // State for salary detail dialog
  const [selectedSalary, setSelectedSalary] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeSalaryHistory(employeeId));
    }
  }, [dispatch, employeeId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    return () => {
      dispatch(clearEmployeeSalaryHistory());
    };
  }, [dispatch]);

  const handleViewSalaryDetails = (salary: any) => {
    setSelectedSalary(salary);
    setIsDetailDialogOpen(true);
  };

  // Generate month options using translations for formatMonthYear
  const monthOptions = [
    { value: '1', label: tMonths('january') },
    { value: '2', label: tMonths('february') },
    { value: '3', label: tMonths('march') },
    { value: '4', label: tMonths('april') },
    { value: '5', label: tMonths('may') },
    { value: '6', label: tMonths('june') },
    { value: '7', label: tMonths('july') },
    { value: '8', label: tMonths('august') },
    { value: '9', label: tMonths('september') },
    { value: '10', label: tMonths('october') },
    { value: '11', label: tMonths('november') },
    { value: '12', label: tMonths('december') },
  ];

  const formatMonthYear = (month: number, year: number) => {
    const monthLabel = monthOptions.find(m => m.value === month.toString())?.label || '';
    return `${monthLabel} ${year}`;
  };

  const columns = [
    createTextColumn<any>('monthYear', t('columns.monthYear'), (salary) => formatMonthYear(salary.month, salary.year), { width: 'w-32' }),
    createCurrencyColumn<any>('basicSalary', t('columns.basicSalary'), (salary) => salary.basicSalary, { width: 'w-32' }),
    createCurrencyColumn<any>('overtimeAmount', t('columns.overtime'), (salary) => salary.overtimeAmount, { width: 'w-32' }),
    createCurrencyColumn<any>('grossSalary', t('columns.grossSalary'), (salary) => salary.grossSalary, { width: 'w-32' }),
    createCurrencyColumn<any>('netSalary', t('columns.netSalary'), (salary) => salary.netSalary, { width: 'w-32' }),
    createBadgeColumn<any>('status', t('columns.status'), (salary) => salary.status, { 
      variant: 'outline',
      width: 'w-24'
    }),
    createDateColumn<any>('createdAt', t('columns.generated'), (salary) => salary.createdAt, { width: 'w-32' }),
    {
      key: 'actions',
      header: t('columns.actions'),
      accessor: (salary: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewSalaryDetails(salary)}
          >
            <Eye className="h-4 w-4 mr-1" />
            {t('viewDetails')}
          </Button>
        </div>
      ),
      width: 'w-24'
    },
  ];

  const tableConfig = createDataTableConfig(columns, [], {
    title: `${t('title')} ${employeeName}`,
    subtitle: t('subtitle'),
    searchable: true,
    searchPlaceholder: t('searchPlaceholder'),
    pagination: {
      enabled: true,
      pageSize: 20,
      pageSizeOptions: [10, 20, 50, 100]
    },
    sortable: true,
    exportOptions: {
      enablePrint: true,
      enablePDF: false,
      enableCSV: false,
      filename: `${employeeName.toLowerCase().replace(/\s+/g, '-')}-salary`
    }
  });

  return (
    <div className="space-y-5">
      {/* Salary Data Table */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardContent className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-medium mb-2">{t('loading')}</h3>
                <p className="text-muted-foreground">{t('loadingDescription')}</p>
              </div>
            </div>
          ) : salaryHistory && salaryHistory.length > 0 ? (
            <DataTable
              data={salaryHistory}
              {...tableConfig}
              loading={loading}
              emptyMessage={t('noRecordsDescription')}
            />
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">{t('noRecords')}</h3>
              <p className="text-muted-foreground">
                {t('noRecordsDescription')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Salary Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              {t('detail.title')} - {selectedSalary && formatMonthYear(selectedSalary.month, selectedSalary.year)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedSalary && (
            <div className="space-y-5">
              {/* Salary Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">{t('detail.basicSalary')}</p>
                        <p className="text-xl font-bold">{formatCurrency(selectedSalary.basicSalary)}</p>
                      </div>
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">{t('detail.overtime')}</p>
                        <p className="text-xl font-bold">{formatCurrency(selectedSalary.overtimeAmount)}</p>
                      </div>
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">{t('detail.grossSalary')}</p>
                        <p className="text-xl font-bold">{formatCurrency(selectedSalary.grossSalary)}</p>
                      </div>
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">{t('detail.netSalary')}</p>
                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(selectedSalary.netSalary)}</p>
                      </div>
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Deductions */}
              {selectedSalary.deduction && selectedSalary.deduction.length > 0 && (
                <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
                  <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                    <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                      <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-md">
                        <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      {t('detail.deductions')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      {selectedSalary.deduction.map((deduction: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2.5 border border-slate-200/60 dark:border-slate-700/60 rounded-lg bg-red-50/30 dark:bg-red-900/10">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{deduction.reason}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatDate(deduction.date)}
                              {deduction.loanId && ` • ${t('detail.loanId')} ${deduction.loanId}`}
                              {deduction.installmentNumber && ` • ${t('detail.installment')} ${deduction.installmentNumber}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-red-600 dark:text-red-400">-{formatCurrency(deduction.amount)}</p>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{t('detail.totalDeductions')}</p>
                          <p className="font-bold text-red-600">
                            -{formatCurrency(selectedSalary.deduction.reduce((sum: number, d: any) => sum + d.amount, 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Status and Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('detail.paymentStatus')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={selectedSalary.status === 'paid' ? 'default' : 'secondary'}>
                        {selectedSalary.status}
                      </Badge>
                    </div>
                    {selectedSalary.paymentDate && (
                      <p className="text-sm text-muted-foreground">
                        {t('detail.paidOn')} {formatDate(selectedSalary.paymentDate)}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('detail.salaryPeriod')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {formatMonthYear(selectedSalary.month, selectedSalary.year)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('detail.generated')} {formatDate(selectedSalary.createdAt)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Remarks */}
              {selectedSalary.remarks && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('detail.remarks')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedSalary.remarks}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
