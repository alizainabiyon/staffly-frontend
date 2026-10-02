'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Download, 
  FileText, 
  Users, 
  Clock, 
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Building,
  CalendarDays
} from 'lucide-react';
import { DataTable, TableColumn, TableAction } from '@/components/ui/data-table';
import { formatDate, formatTime } from '@/lib/utils/helpers';

// Report types
export type ReportType = 
  | 'attendance'
  | 'salary'
  | 'leave'
  | 'overtime'
  | 'tax'
  | 'employee_summary'
  | 'department_summary'
  | 'monthly_summary';

// Report period types
export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

// Base interface for all reports
interface BaseReport {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  department: string;
}

// Attendance report interface
interface AttendanceReport extends BaseReport {
  checkIn: string;
  checkOut: string;
  workingHours: number;
  overtimeHours: number;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'leave';
  notes?: string;
}

// Salary report interface
interface SalaryReport extends BaseReport {
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  bonus: number;
  overtimePay: number;
  totalPay: number;
  paymentStatus: 'paid' | 'pending' | 'processing';
}

// Leave report interface
interface LeaveReport extends BaseReport {
  leaveType: 'annual' | 'sick' | 'casual' | 'maternity' | 'paternity' | 'unpaid';
  startDate: string;
  endDate: string;
  days: number;
  status: 'approved' | 'pending' | 'rejected';
  reason?: string;
}

// Overtime report interface
interface OvertimeReport extends BaseReport {
  date: string;
  regularHours: number;
  overtimeHours: number;
  overtimeRate: number;
  overtimePay: number;
  reason?: string;
}

// Tax report interface
interface TaxReport extends BaseReport {
  grossSalary: number;
  taxableIncome: number;
  taxAmount: number;
  taxRate: number;
  deductions: number;
  netTax: number;
}

interface ReportsComponentProps {
  employees: any[]; // You can replace with your Employee type
}

export function ReportsComponent({ employees }: ReportsComponentProps) {
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('attendance');
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('monthly');
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  });
  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Report type options
  const reportTypes = [
    { value: 'attendance', label: 'Attendance Report', icon: <Clock className="h-4 w-4" /> },
    { value: 'salary', label: 'Salary Report', icon: <DollarSign className="h-4 w-4" /> },
    { value: 'leave', label: 'Leave Report', icon: <CalendarDays className="h-4 w-4" /> },
    { value: 'overtime', label: 'Overtime Report', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'tax', label: 'Tax Report', icon: <FileText className="h-4 w-4" /> },
    { value: 'employee_summary', label: 'Employee Summary', icon: <User className="h-4 w-4" /> },
    { value: 'department_summary', label: 'Department Summary', icon: <Building className="h-4 w-4" /> },
    { value: 'monthly_summary', label: 'Monthly Summary', icon: <Calendar className="h-4 w-4" /> },
  ];

  // Period options
  const periodOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  // Generate mock data based on report type
  const generateReportData = useMemo(() => {
    const data: any[] = [];
    const daysInRange = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));

    employees.forEach(employee => {
      if (selectedDepartment !== 'all' && employee.department !== selectedDepartment) return;

      for (let i = 0; i < Math.min(daysInRange, 30); i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];

        switch (selectedReportType) {
          case 'attendance':
            const isPresent = Math.random() > 0.1;
            const isLate = isPresent && Math.random() > 0.3;
            data.push({
              id: `${employee.id}-${dateStr}`,
              date: dateStr,
              employeeId: employee.id,
              employeeName: employee.name,
              department: employee.department,
              checkIn: isPresent ? (isLate ? '09:30' : '09:00') : '',
              checkOut: isPresent ? '18:00' : '',
              workingHours: isPresent ? (isLate ? 8.5 : 8) : 0,
              overtimeHours: isPresent ? (Math.random() > 0.7 ? 1 : 0) : 0,
              status: isPresent ? (isLate ? 'late' : 'present') : 'absent',
              notes: isPresent ? '' : 'No attendance recorded',
            } as AttendanceReport);
            break;

          case 'salary':
            const basicSalary = employee.salary || 50000;
            const allowances = basicSalary * 0.1;
            const deductions = basicSalary * 0.05;
            const bonus = Math.random() > 0.8 ? basicSalary * 0.1 : 0;
            const overtimePay = Math.random() * 5000;
            data.push({
              id: `${employee.id}-${dateStr}`,
              date: dateStr,
              employeeId: employee.id,
              employeeName: employee.name,
              department: employee.department,
              basicSalary,
              allowances,
              deductions,
              netSalary: basicSalary + allowances - deductions,
              bonus,
              overtimePay,
              totalPay: basicSalary + allowances - deductions + bonus + overtimePay,
              paymentStatus: Math.random() > 0.2 ? 'paid' : 'pending',
            } as SalaryReport);
            break;

          case 'leave':
            if (Math.random() > 0.9) { // 10% chance of leave
              const leaveTypes = ['annual', 'sick', 'casual', 'maternity', 'paternity', 'unpaid'];
              const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
              const days = Math.floor(Math.random() * 5) + 1;
              data.push({
                id: `${employee.id}-${dateStr}`,
                date: dateStr,
                employeeId: employee.id,
                employeeName: employee.name,
                department: employee.department,
                leaveType,
                startDate: dateStr,
                endDate: new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                days,
                status: Math.random() > 0.3 ? 'approved' : 'pending',
                reason: 'Personal leave',
              } as LeaveReport);
            }
            break;

          case 'overtime':
            if (Math.random() > 0.7) { // 30% chance of overtime
              const overtimeHours = Math.random() * 3 + 0.5;
              data.push({
                id: `${employee.id}-${dateStr}`,
                date: dateStr,
                employeeId: employee.id,
                employeeName: employee.name,
                department: employee.department,
                regularHours: 8,
                overtimeHours,
                overtimeRate: 1.5,
                overtimePay: overtimeHours * (employee.salary || 50000) / 160 * 1.5,
                reason: 'Project deadline',
              } as OvertimeReport);
            }
            break;

          case 'tax':
            const grossSalary = employee.salary || 50000;
            const taxableIncome = grossSalary * 0.8;
            const taxRate = taxableIncome > 100000 ? 0.25 : taxableIncome > 50000 ? 0.15 : 0.05;
            data.push({
              id: `${employee.id}-${dateStr}`,
              date: dateStr,
              employeeId: employee.id,
              employeeName: employee.name,
              department: employee.department,
              grossSalary,
              taxableIncome,
              taxAmount: taxableIncome * taxRate,
              taxRate: taxRate * 100,
              deductions: grossSalary * 0.1,
              netTax: taxableIncome * taxRate - grossSalary * 0.1,
            } as TaxReport);
            break;
        }
      }
    });

    return data;
  }, [employees, selectedReportType, selectedPeriod, startDate, endDate, selectedDepartment]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (generateReportData.length === 0) return null;

    switch (selectedReportType) {
      case 'attendance': {
        const totalAttendanceDays = generateReportData.length;
        const presentDays = generateReportData.filter((d: AttendanceReport) => d.status === 'present').length;
        const lateDays = generateReportData.filter((d: AttendanceReport) => d.status === 'late').length;
        const absentDays = generateReportData.filter((d: AttendanceReport) => d.status === 'absent').length;
        const totalHours = generateReportData.reduce((sum: number, d: AttendanceReport) => sum + d.workingHours, 0);
        const totalOvertime = generateReportData.reduce((sum: number, d: AttendanceReport) => sum + d.overtimeHours, 0);
        const totalDays = totalAttendanceDays;
        return {
          totalDays,
          presentDays,
          lateDays,
          absentDays,
          attendanceRate: ((presentDays + lateDays) / totalDays * 100).toFixed(1),
        };
      }
      
      
      case 'salary':
        const totalSalary = generateReportData.reduce((sum: number, d: SalaryReport) => sum + d.totalPay, 0);
        const totalBasic = generateReportData.reduce((sum: number, d: SalaryReport) => sum + d.basicSalary, 0);
        const totalAllowances = generateReportData.reduce((sum: number, d: SalaryReport) => sum + d.allowances, 0);
        const totalDeductions = generateReportData.reduce((sum: number, d: SalaryReport) => sum + d.deductions, 0);
        const totalBonus = generateReportData.reduce((sum: number, d: SalaryReport) => sum + d.bonus, 0);
        
        return {
          totalSalary: totalSalary.toLocaleString(),
          totalBasic: totalBasic.toLocaleString(),
          totalAllowances: totalAllowances.toLocaleString(),
          totalDeductions: totalDeductions.toLocaleString(),
          totalBonus: totalBonus.toLocaleString(),
          averageSalary: (totalSalary / generateReportData.length).toLocaleString(),
        };

      case 'leave':
        const totalLeaves = generateReportData.length;
        const approvedLeaves = generateReportData.filter((d: LeaveReport) => d.status === 'approved').length;
        const pendingLeaves = generateReportData.filter((d: LeaveReport) => d.status === 'pending').length;
        const totalDays = generateReportData.reduce((sum: number, d: LeaveReport) => sum + d.days, 0);
        
        return {
          totalLeaves,
          approvedLeaves,
          pendingLeaves,
          totalDays,
          approvalRate: totalLeaves > 0 ? ((approvedLeaves / totalLeaves) * 100).toFixed(1) : '0',
        };

      case 'overtime':
        const totalOvertimeHours = generateReportData.reduce((sum: number, d: OvertimeReport) => sum + d.overtimeHours, 0);
        const totalOvertimePay = generateReportData.reduce((sum: number, d: OvertimeReport) => sum + d.overtimePay, 0);
        const averageOvertime = totalOvertimeHours / generateReportData.length;
        
        return {
          totalOvertimeHours: totalOvertimeHours.toFixed(1),
          totalOvertimePay: totalOvertimePay.toLocaleString(),
          averageOvertime: averageOvertime.toFixed(1),
          totalRecords: generateReportData.length,
        };

      case 'tax':
        const totalTax = generateReportData.reduce((sum: number, d: TaxReport) => sum + d.netTax, 0);
        const totalGross = generateReportData.reduce((sum: number, d: TaxReport) => sum + d.grossSalary, 0);
        const averageTaxRate = generateReportData.reduce((sum: number, d: TaxReport) => sum + d.taxRate, 0) / generateReportData.length;
        
        return {
          totalTax: totalTax.toLocaleString(),
          totalGross: totalGross.toLocaleString(),
          averageTaxRate: averageTaxRate.toFixed(1),
          totalRecords: generateReportData.length,
        };

      default:
        return null;
    }
  }, [generateReportData, selectedReportType]);

  // Define columns based on report type
  const getColumns = (): TableColumn<any>[] => {
    const baseColumns: TableColumn<any>[] = [
      {
        key: 'date',
        header: 'Date',
        accessor: (item) => formatDate(item.date),
        sortable: true,
      },
      {
        key: 'employee',
        header: 'Employee',
        accessor: (item) => (
          <div>
            <p className="font-medium">{item.employeeName}</p>
            <p className="text-sm text-muted-foreground">{item.employeeId}</p>
          </div>
        ),
        sortable: true,
      },
      {
        key: 'department',
        header: 'Department',
        accessor: (item) => (
          <Badge variant="outline">{item.department}</Badge>
        ),
        sortable: true,
      },
    ];

    switch (selectedReportType) {
      case 'attendance':
        return [
          ...baseColumns,
          {
            key: 'checkIn',
            header: 'Check In',
            accessor: (item: AttendanceReport) => item.checkIn ? formatTime(item.checkIn) : '-',
          },
          {
            key: 'checkOut',
            header: 'Check Out',
            accessor: (item: AttendanceReport) => item.checkOut ? formatTime(item.checkOut) : '-',
          },
          {
            key: 'workingHours',
            header: 'Working Hours',
            accessor: (item: AttendanceReport) => (
              <span className="font-medium">{item.workingHours.toFixed(1)}h</span>
            ),
            sortable: true,
          },
          {
            key: 'overtimeHours',
            header: 'Overtime',
            accessor: (item: AttendanceReport) => (
              <span className="font-medium text-blue-600">{item.overtimeHours.toFixed(1)}h</span>
            ),
            sortable: true,
          },
          {
            key: 'status',
            header: 'Status',
            accessor: (item: AttendanceReport) => {
              const statusColors = {
                present: 'bg-green-100 text-green-800',
                absent: 'bg-red-100 text-red-800',
                late: 'bg-yellow-100 text-yellow-800',
                half_day: 'bg-orange-100 text-orange-800',
                leave: 'bg-blue-100 text-blue-800',
              };
              return (
                <Badge className={statusColors[item.status]}>
                  {item.status}
                </Badge>
              );
            },
            sortable: true,
          },
        ];

      case 'salary':
        return [
          ...baseColumns,
          {
            key: 'basicSalary',
            header: 'Basic Salary',
            accessor: (item: SalaryReport) => (
              <span className="font-medium">${item.basicSalary.toLocaleString()}</span>
            ),
            sortable: true,
          },
          {
            key: 'allowances',
            header: 'Allowances',
            accessor: (item: SalaryReport) => (
              <span className="text-green-600">+${item.allowances.toLocaleString()}</span>
            ),
            sortable: true,
          },
          {
            key: 'deductions',
            header: 'Deductions',
            accessor: (item: SalaryReport) => (
              <span className="text-red-600">-${item.deductions.toLocaleString()}</span>
            ),
            sortable: true,
          },
          {
            key: 'bonus',
            header: 'Bonus',
            accessor: (item: SalaryReport) => (
              <span className="text-blue-600">+${item.bonus.toLocaleString()}</span>
            ),
            sortable: true,
          },
          {
            key: 'totalPay',
            header: 'Total Pay',
            accessor: (item: SalaryReport) => (
              <span className="font-bold">${item.totalPay.toLocaleString()}</span>
            ),
            sortable: true,
          },
          {
            key: 'paymentStatus',
            header: 'Status',
            accessor: (item: SalaryReport) => {
              const statusColors = {
                paid: 'bg-green-100 text-green-800',
                pending: 'bg-yellow-100 text-yellow-800',
                processing: 'bg-blue-100 text-blue-800',
              };
              return (
                <Badge className={statusColors[item.paymentStatus]}>
                  {item.paymentStatus}
                </Badge>
              );
            },
            sortable: true,
          },
        ];

      case 'leave':
        return [
          ...baseColumns,
          {
            key: 'leaveType',
            header: 'Leave Type',
            accessor: (item: LeaveReport) => (
              <Badge variant="outline">{item.leaveType.replace('_', ' ')}</Badge>
            ),
            sortable: true,
          },
          {
            key: 'period',
            header: 'Period',
            accessor: (item: LeaveReport) => (
              <div className="text-sm">
                <p>{formatDate(item.startDate)} - {formatDate(item.endDate)}</p>
                <p className="text-muted-foreground">{item.days} days</p>
              </div>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            accessor: (item: LeaveReport) => {
              const statusColors = {
                approved: 'bg-green-100 text-green-800',
                pending: 'bg-yellow-100 text-yellow-800',
                rejected: 'bg-red-100 text-red-800',
              };
              return (
                <Badge className={statusColors[item.status]}>
                  {item.status}
                </Badge>
              );
            },
            sortable: true,
          },
          {
            key: 'reason',
            header: 'Reason',
            accessor: (item: LeaveReport) => (
              <span className="text-sm text-muted-foreground">
                {item.reason || '-'}
              </span>
            ),
          },
        ];

      case 'overtime':
        return [
          ...baseColumns,
          {
            key: 'regularHours',
            header: 'Regular Hours',
            accessor: (item: OvertimeReport) => (
              <span>{item.regularHours}h</span>
            ),
          },
          {
            key: 'overtimeHours',
            header: 'Overtime Hours',
            accessor: (item: OvertimeReport) => (
              <span className="font-medium text-blue-600">{item.overtimeHours.toFixed(1)}h</span>
            ),
            sortable: true,
          },
          {
            key: 'overtimeRate',
            header: 'Rate',
            accessor: (item: OvertimeReport) => (
              <span>{item.overtimeRate}x</span>
            ),
          },
          {
            key: 'overtimePay',
            header: 'Overtime Pay',
            accessor: (item: OvertimeReport) => (
              <span className="font-bold text-green-600">${item.overtimePay.toFixed(2)}</span>
            ),
            sortable: true,
          },
          {
            key: 'reason',
            header: 'Reason',
            accessor: (item: OvertimeReport) => (
              <span className="text-sm text-muted-foreground">
                {item.reason || '-'}
              </span>
            ),
          },
        ];

      case 'tax':
        return [
          ...baseColumns,
          {
            key: 'grossSalary',
            header: 'Gross Salary',
            accessor: (item: TaxReport) => (
              <span className="font-medium">${item.grossSalary.toLocaleString()}</span>
            ),
            sortable: true,
          },
          {
            key: 'taxableIncome',
            header: 'Taxable Income',
            accessor: (item: TaxReport) => (
              <span>${item.taxableIncome.toLocaleString()}</span>
            ),
            sortable: true,
          },
          {
            key: 'taxRate',
            header: 'Tax Rate',
            accessor: (item: TaxReport) => (
              <span>{item.taxRate}%</span>
            ),
            sortable: true,
          },
          {
            key: 'taxAmount',
            header: 'Tax Amount',
            accessor: (item: TaxReport) => (
              <span className="text-red-600">${item.taxAmount.toLocaleString()}</span>
            ),
            sortable: true,
          },
          {
            key: 'deductions',
            header: 'Deductions',
            accessor: (item: TaxReport) => (
              <span className="text-green-600">-${item.deductions.toLocaleString()}</span>
            ),
            sortable: true,
          },
          {
            key: 'netTax',
            header: 'Net Tax',
            accessor: (item: TaxReport) => (
              <span className="font-bold">${item.netTax.toLocaleString()}</span>
            ),
            sortable: true,
          },
        ];

      default:
        return baseColumns;
    }
  };

  // Define actions
  const actions: TableAction<any>[] = [
    {
      label: 'View Details',
      icon: <FileText className="h-4 w-4" />,
      onClick: (item) => console.log('View report details:', item),
      variant: 'ghost',
    },
    {
      label: 'Export',
      icon: <Download className="h-4 w-4" />,
      onClick: (item) => console.log('Export item:', item),
      variant: 'ghost',
    },
  ];

  // Define filters
  const filters = [
    {
      key: 'department',
      label: 'Department',
      type: 'select' as const,
      options: [
        { label: 'All Departments', value: 'all' },
        ...Array.from(new Set(employees.map(emp => emp.department))).map(dept => ({
          label: dept,
          value: dept,
        })),
      ],
    },
  ];

  const handleExport = () => {
    console.log(`Exporting ${selectedReportType} report from ${startDate} to ${endDate}`);
    // Implement your export logic here
  };

  const getReportTitle = () => {
    const reportType = reportTypes.find(rt => rt.value === selectedReportType)?.label;
    return `${reportType} - ${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}`;
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Report Type */}
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={selectedReportType} onValueChange={(value: ReportType) => setSelectedReportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        {type.icon}
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Period */}
            <div className="space-y-2">
              <Label>Period</Label>
              <Select value={selectedPeriod} onValueChange={(value: ReportPeriod) => setSelectedPeriod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      {summaryStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(summaryStats).map(([key, value]) => (
            <Card key={key}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-2xl font-bold">{value}</p>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Data Table */}
      <DataTable
        data={generateReportData}
        columns={getColumns()}
        title={getReportTitle()}
        subtitle={`Generated on ${new Date().toLocaleDateString()} from ${formatDate(startDate)} to ${formatDate(endDate)}`}
        searchable={true}
        searchPlaceholder={`Search ${selectedReportType} records...`}
        filters={filters}
        actions={actions}
        pagination={{ enabled: true, pageSize: 20, pageSizeOptions: [10, 20, 50, 100] }}
        sortable={true}
        onExport={handleExport}
        emptyMessage={`No ${selectedReportType} data found for the selected period`}
      />
    </div>
  );
} 