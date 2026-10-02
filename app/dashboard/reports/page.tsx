'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  Clock,
  Download,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { ReportsComponent } from '@/components/reports/ReportsComponent';

// Mock employees data for demonstration
const mockEmployees = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@company.com',
    phone: '+92-300-1234567',
    department: 'Engineering',
    position: 'Senior Developer',
    salary: 75000,
    status: 'active',
    joinDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@company.com',
    phone: '+92-300-1234568',
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 65000,
    status: 'active',
    joinDate: '2023-02-01',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@company.com',
    phone: '+92-300-1234569',
    department: 'Sales',
    position: 'Sales Representative',
    salary: 55000,
    status: 'active',
    joinDate: '2023-03-10',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@company.com',
    phone: '+92-300-1234570',
    department: 'HR',
    position: 'HR Specialist',
    salary: 60000,
    status: 'inactive',
    joinDate: '2023-01-20',
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    email: 'charlie@company.com',
    phone: '+92-300-1234571',
    department: 'Engineering',
    position: 'Junior Developer',
    salary: 45000,
    status: 'active',
    joinDate: '2023-04-05',
  },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('payroll');

  const reportCategories = [
    {
      id: 'payroll',
      title: 'Payroll Reports',
      description: 'Salary, tax, and compensation reports',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'attendance',
      title: 'Attendance Reports',
      description: 'Employee attendance and time tracking',
      icon: Clock,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'hr',
      title: 'HR Reports',
      description: 'Employee management and HR analytics',
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Advanced data analysis and insights',
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const quickReports = [
    {
      title: 'Monthly Payroll Summary',
      description: 'Complete payroll overview for current month',
      icon: DollarSign,
      type: 'salary',
      period: 'monthly',
    },
    {
      title: 'Attendance Overview',
      description: 'Employee attendance patterns and trends',
      icon: Clock,
      type: 'attendance',
      period: 'monthly',
    },
    {
      title: 'Leave Management',
      description: 'Employee leave requests and approvals',
      icon: Calendar,
      type: 'leave',
      period: 'monthly',
    },
    {
      title: 'Overtime Analysis',
      description: 'Overtime hours and compensation analysis',
      icon: Activity,
      type: 'overtime',
      period: 'monthly',
    },
    {
      title: 'Tax Deductions',
      description: 'Tax calculations and deductions report',
      icon: FileText,
      type: 'tax',
      period: 'monthly',
    },
    {
      title: 'Department Summary',
      description: 'Performance summary by department',
      icon: BarChart3,
      type: 'department_summary',
      period: 'monthly',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate comprehensive reports and analyze business data
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export All Reports
        </Button>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportCategories.map((category) => (
          <Card 
            key={category.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setActiveTab(category.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${category.color}`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quick Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickReports.map((report, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-24 flex-col justify-start p-4"
                onClick={() => {
                  setActiveTab('payroll');
                  // You can add logic here to pre-select the report type
                }}
              >
                <report.icon className="h-6 w-6 mb-2" />
                <span className="font-medium text-sm">{report.title}</span>
                <span className="text-xs text-muted-foreground text-center">
                  {report.description}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payroll">Payroll Reports</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Reports</TabsTrigger>
          <TabsTrigger value="hr">HR Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="payroll" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Payroll Reports</h2>
              <p className="text-muted-foreground">
                Generate comprehensive payroll and compensation reports
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Last Updated: {new Date().toLocaleDateString()}</Badge>
            </div>
          </div>
          
          <ReportsComponent employees={mockEmployees} />
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Attendance Reports</h2>
              <p className="text-muted-foreground">
                Track employee attendance, time, and productivity
              </p>
            </div>
          </div>
          
          <ReportsComponent employees={mockEmployees} />
        </TabsContent>

        <TabsContent value="hr" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">HR Reports</h2>
              <p className="text-muted-foreground">
                Employee management and human resources analytics
              </p>
            </div>
          </div>
          
          <ReportsComponent employees={mockEmployees} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
              <p className="text-muted-foreground">
                Advanced data analysis and business insights
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Analytics Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                    <p className="text-muted-foreground mb-4">
                      Advanced analytics and data visualization features
                    </p>
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                      <Button variant="outline" className="h-16 flex-col">
                        <BarChart3 className="h-5 w-5 mb-1" />
                        Charts
                      </Button>
                      <Button variant="outline" className="h-16 flex-col">
                        <PieChart className="h-5 w-5 mb-1" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}