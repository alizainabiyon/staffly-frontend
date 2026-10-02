'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  Plus,
  ArrowLeft,
  Printer,
  GraduationCap,
  Users,
  Briefcase,
  X
} from 'lucide-react';
import { Employee, SalarySlip, Leave, Attendance } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';
import { AddEmployeeForm } from './AddEmployeeForm';
import { toast } from 'sonner';
import { useAppDispatch } from '@/lib/hooks';
import { updateEmployee } from '@/lib/store/slices/employeeSlice';
import { 
  createTextColumn, 
  createCurrencyColumn, 
  createDateColumn,
  createDataTableConfig,
  createViewAction
} from '@/lib/utils/dataTableUtils';
import { DataTable } from '@/components/ui/data-table';


interface EmployeeDetailPageProps {
  employee: Employee;
  onUpdate: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export function EmployeeDetailPage({ employee, onUpdate, onDelete, onBack }: EmployeeDetailPageProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const dispatch = useAppDispatch();

  const handleEdit = async (updatedEmployee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Prepare the payload with all employee data (excluding ID)
      const payload = {
        ...updatedEmployee,
      };

      // Call the API to update the employee
      const result = await dispatch(updateEmployee(payload)).unwrap();

      // Handle file deletions if profile picture was changed
      // if (updatedEmployee.profilePic !== employee.profilePic) {
      //   // If there was a previous profile picture, delete it
      //   if (employee.profilePic && employee.profilePic !== updatedEmployee.profilePic) {
      //     try {
      //       await deleteSingleFile(employee.profilePic);
      //       console.log('Previous profile picture deleted successfully');
      //     } catch (error) {
      //       console.error('Failed to delete previous profile picture:', error);
      //       // Don't throw error as the main operation succeeded
      //     }
      //   }
      // }

      // Handle document deletions if documents were changed
      // const oldDocumentUrls = employee.documents?.map(doc => doc.url) || [];
      // const newDocumentUrls = updatedEmployee.documents?.map(doc => doc.url) || [];
      
      // // Find documents that were removed
      // const removedDocuments = oldDocumentUrls.filter(url => !newDocumentUrls.includes(url));
      
      // if (removedDocuments.length > 0) {
      //   try {
      //     await deleteMultipleFiles(removedDocuments);
      //     console.log('Removed documents deleted successfully');
      //   } catch (error) {
      //     console.error('Failed to delete removed documents:', error);
      //     // Don't throw error as the main operation succeeded
      //   }
      // }

      // Update the local state
      const updated: Employee = {
        ...employee,
        ...updatedEmployee,
        updatedAt: new Date().toISOString(),
      };
      
      onUpdate(updated);
      setIsEditDialogOpen(false);
      
      toast.success(result.message || 'Employee updated successfully');
    } catch (error: any) {
      console.error('Failed to update employee:', error);
      toast.error(error.message || 'Failed to update employee');
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      onDelete(employee.id);
      toast.success('Employee deleted successfully');
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

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // const leaveUsagePercentage = {
  //   annual: (employee.leaves.used.annual / employee.leaves.annual) * 100,
  //   sick: (employee.leaves.used.sick / employee.leaves.sick) * 100,
  //   casual: (employee.leaves.used.casual / employee.leaves.casual) * 100,
  // };

  const yearsOfService = Math.floor(
    (new Date().getTime() - new Date(employee.joinDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  // const attendanceRate = ((employee.attendance.present / (employee.attendance.present + employee.attendance.absent)) * 100).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Employees
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
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)} className="border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete} className="border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-emerald-300/40 dark:hover:border-emerald-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Monthly Salary</p>
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
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Years of Service</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{yearsOfService}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-purple-300/40 dark:hover:border-purple-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Attendance Rate</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {/* {attendanceRate} */}
                  50
                  %</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-orange-300/40 dark:hover:border-orange-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Leave Balance</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {/* {employee.leaves.annual - employee.leaves.used.annual} */}
                  50
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="attendance"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
          >
            Attendance
          </TabsTrigger>
          <TabsTrigger 
            value="expenses"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
          >
            Expenses
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
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Employee ID</p>
                    <p className="text-foreground">{employee.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CNIC</p>
                    <p className="text-foreground">{employee.cnic}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Age</p>
                    <p className="text-foreground">{employee.age || 'N/A'} years</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cast</p>
                    <p className="text-foreground">{employee.cast || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Study/Education</p>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">{employee.study || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">{employee.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">{employee.phone}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
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
                    <p className="text-sm font-medium text-muted-foreground mb-2">Emergency Contacts</p>
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
                  Employment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department</p>
                    <p className="text-foreground">{employee.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Position</p>
                    <p className="text-foreground">{employee.position}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                    <p className="text-foreground">{formatDate(employee.joinDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monthly Salary</p>
                    <p className="text-foreground font-semibold">{formatCurrency(employee.salary)}</p>
                  </div>
                  {employee.bankAccount && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bank Account</p>
                      <p className="text-foreground">{employee.bankAccount}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Work Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(employee.experiences || []).map((exp, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">Experience {index + 1}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Job Title</p>
                        <p className="text-foreground font-medium">{exp.title}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Company Address</p>
                        <p className="text-foreground">{exp.address}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">From Date</p>
                        <p className="text-foreground">{formatDate(exp.from)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">To Date</p>
                        <p className="text-foreground">{formatDate(exp.to)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Job Description</p>
                      <p className="text-foreground">{exp.description}</p>
                    </div>
                  </div>
                ))}
                {(employee.experiences || []).length === 0 && (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Work Experience</h3>
                    <p className="text-muted-foreground">No work experience has been added for this employee.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created At</p>
                      <p className="text-foreground">{formatDate(employee.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                      <p className="text-foreground">{formatDate(employee.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created By</p>
                      <p className="text-foreground">{(employee as any).createdBy || 'System'}</p>
                    </div>
                  </div>

                  {(employee as any).updatedBy && (
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Updated By</p>
                        <p className="text-foreground">{(employee as any).updatedBy}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="text-base text-slate-800 dark:text-slate-100">Attendance Record</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-center py-8">
                <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Attendance Records</h3>
                <p className="text-muted-foreground">No attendance records have been found for this employee.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          {(employee as any)?.expenses && (employee as any).expenses.length > 0 ? (
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardContent className="p-4">
                <ExpensesDataTable 
                  expenses={(employee as any).expenses}
                  employeeName={employee.name}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
              <CardContent className="p-8 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Expenses Data</h3>
                <p className="text-muted-foreground mb-6">This employee doesn&apos;t have any expense records yet.</p>
              </CardContent>
            </Card>
          )}
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
                Employee Profile - Print View
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
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
              <h1 className="text-2xl font-bold text-gray-900">STAFFLY</h1>
              <p className="text-gray-600">Complete Business Management Solution</p>
              <h2 className="text-xl font-semibold mt-4">Employee Profile</h2>
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
                    <span className="font-semibold text-gray-700">Employee ID:</span>
                    <span className="ml-2 text-gray-900">{employee.employeeId}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Position:</span>
                    <span className="ml-2 text-gray-900">{employee.position}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Department:</span>
                    <span className="ml-2 text-gray-900">{employee.department}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Status:</span>
                    <span className="ml-2 text-gray-900 capitalize">{employee.status}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Join Date:</span>
                    <span className="ml-2 text-gray-900">{formatDate(employee.joinDate)}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Monthly Salary:</span>
                    <span className="ml-2 text-gray-900">{formatCurrency(employee.salary)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">CNIC:</span>
                  <span className="ml-2 text-gray-900">{employee.cnic}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Age:</span>
                  <span className="ml-2 text-gray-900">{employee.age || 'N/A'} years</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Cast:</span>
                  <span className="ml-2 text-gray-900">{employee.cast || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Study/Education:</span>
                  <span className="ml-2 text-gray-900">{employee.study || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{employee.email}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Phone:</span>
                  <span className="ml-2 text-gray-900">{employee.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-gray-700">Address:</span>
                  <span className="ml-2 text-gray-900">{employee.address}</span>
                  {employee.address2 && (
                    <span className="ml-2 text-gray-900 block">{employee.address2}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            {employee.emergencyContacts && employee.emergencyContacts.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Emergency Contacts</h4>
                <div className="space-y-3">
                  {employee.emergencyContacts.map((contact, index) => (
                    <div key={index} className="border rounded p-3">
                      <h5 className="font-semibold text-gray-900 mb-2">Contact {index + 1}</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Name:</span>
                          <span className="ml-2 text-gray-900">{contact.name}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Phone:</span>
                          <span className="ml-2 text-gray-900">{contact.phone}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Relation:</span>
                          <span className="ml-2 text-gray-900">{contact.relation}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Occupation:</span>
                          <span className="ml-2 text-gray-900">{contact.occupation}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {employee.experiences && employee.experiences.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Work Experience</h4>
                <div className="space-y-3">
                  {employee.experiences.map((exp, index) => (
                    <div key={index} className="border rounded p-3">
                      <h5 className="font-semibold text-gray-900 mb-2">Experience {index + 1}</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                        <div>
                          <span className="font-semibold text-gray-700">Job Title:</span>
                          <span className="ml-2 text-gray-900">{exp.title}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Period:</span>
                          <span className="ml-2 text-gray-900">{formatDate(exp.from)} - {formatDate(exp.to)}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="font-semibold text-gray-700">Company Address:</span>
                          <span className="ml-2 text-gray-900">{exp.address}</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Description:</span>
                        <span className="ml-2 text-gray-900">{exp.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t pt-4 text-center text-sm text-gray-600">
              <p>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
              <p>This document is generated by Staffly HR Management System</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ExpensesDataTable({ expenses, employeeName }: { expenses: any[], employeeName: string }) {
  const actions = [
    createViewAction<any>((expense) => console.log('Viewing expense:', expense), 'View Expense'),
  ];

  // Define table columns
  const columns = [
    createDateColumn<any>('expenseDate', 'Date', (expense) => expense.expenseDate, { 
      width: 'w-32' 
    }),
    createTextColumn<any>('description', 'Description', (expense) => expense.description, { 
      width: 'w-64' 
    }),
    createCurrencyColumn<any>('amount', 'Amount', (expense) => expense.amount, { 
      width: 'w-32' 
    }),
    createTextColumn<any>('type', 'Type', (expense) => expense.type, { 
      width: 'w-24' 
    }),
    createTextColumn<any>('catagory', 'Category', (expense) => expense.catagory, { 
      width: 'w-24' 
    }),
    createDateColumn<any>('createdAt', 'Created', (expense) => expense.createdAt, { 
      width: 'w-32' 
    }),
  ];

  // Create table configuration
  const tableConfig = createDataTableConfig(columns, actions, {
    title: `Expenses for ${employeeName}`,
    subtitle: 'Expense history and details',
    searchable: true,
    searchPlaceholder: 'Search expenses...',
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
      filename: `${employeeName.toLowerCase().replace(/\s+/g, '-')}-expenses`
    }
  });

  return (
    <DataTable
      data={expenses}
      {...tableConfig}
      loading={false}
      emptyMessage="No expenses found for this employee."
    />
  );
}