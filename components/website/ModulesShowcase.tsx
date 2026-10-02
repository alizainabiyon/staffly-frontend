'use client';

import { ModuleShowcase } from './ModuleShowcase';
import { 
  Users, 
  Building, 
  DollarSign, 
  UserCheck, 
  Wallet, 
  Calendar, 
  BarChart3, 
  Settings,
  FileText,
  CreditCard,
  Clock,
  Target,
  PieChart,
  Receipt,
  Building2,
  Calculator,
  FileSpreadsheet,
  Bell,
  Lock,
  Smartphone,
  Cloud,
  Headphones,
  CheckCircle
} from 'lucide-react';

interface ModulesShowcaseProps {
  payrollAnimation?: any;
  crmAnimation?: any;
  invoiceAnimation?: any;
  quotationAnimation?: any;
  dailyEntriesAnimation?: any;
  directorAnimation?: any;
  attendanceAnimation?: any;
}

export function ModulesShowcase({
  payrollAnimation,
  crmAnimation,
  invoiceAnimation,
  quotationAnimation,
  dailyEntriesAnimation,
  directorAnimation,
  attendanceAnimation
}: ModulesShowcaseProps) {
  
  const modules = [
    {
      title: "Payroll Management",
      description: "Complete employee management system with automated salary processing, attendance tracking, and comprehensive loan management. Streamline your HR operations with intelligent automation and detailed reporting.",
      features: [
        "Employee Records Management",
        "Automated Salary Processing", 
        "Attendance Tracking",
        "Loan Management System",
        "Tax Calculations",
        "Salary Slip Generation"
      ],
      benefits: [
        "Reduce payroll processing time by 80%",
        "Eliminate manual calculation errors",
        "Comply with local labor laws",
        "Generate detailed reports instantly",
        "Secure employee data management"
      ],
      animationData: payrollAnimation,
      icon: Users,
      reverse: false,
      stats: [
        { label: "Employees", value: "500+", icon: Users },
        { label: "Accuracy", value: "99.9%", icon: Target }
      ],
      demoFeatures: [
        { title: "Employee Dashboard", description: "Complete employee profiles and history", icon: Building2 },
        { title: "Salary Calculator", description: "Automated salary and deduction calculations", icon: Calculator },
        { title: "Attendance Reports", description: "Detailed attendance and overtime tracking", icon: Clock },
        { title: "Loan Management", description: "Employee loan tracking and repayment", icon: CreditCard }
      ]
    },
    {
      title: "CRM System",
      description: "Comprehensive customer relationship management with intelligent automation to build stronger communications, make data-driven decisions, and increase productivity. Manage customers, vendors, and contractors efficiently.",
      features: [
        "Customer Database",
        "Vendor Management", 
        "Contractor Tracking",
        "Lead Management",
        "Communication History",
        "Sales Pipeline"
      ],
      benefits: [
        "Increase sales conversion by 40%",
        "Build stronger customer relationships",
        "Automate follow-up processes",
        "Track customer interactions",
        "Generate sales insights"
      ],
      animationData: crmAnimation,
      icon: Building,
      reverse: true,
      stats: [
        { label: "Customers", value: "1000+", icon: Building },
        { label: "Conversion", value: "+40%", icon: Target }
      ],
      demoFeatures: [
        { title: "Customer Profiles", description: "Detailed customer information and history", icon: Users },
        { title: "Sales Pipeline", description: "Track leads from prospect to close", icon: Target },
        { title: "Communication Log", description: "Complete interaction history", icon: Bell },
        { title: "Vendor Management", description: "Supplier and contractor tracking", icon: Building2 }
      ]
    },
    {
      title: "Finance Management",
      description: "Professional invoicing, quotations, vendor orders, and financial reporting with PDF generation. Complete financial management solution with automated calculations and comprehensive reporting capabilities.",
      features: [
        "Invoice Generation",
        "Quotation Management",
        "Vendor Orders",
        "Financial Reports",
        "PDF Generation",
        "Payment Tracking"
      ],
      benefits: [
        "Reduce billing time by 60%",
        "Improve cash flow management",
        "Automate invoice generation",
        "Track payments efficiently",
        "Generate financial insights"
      ],
      animationData: invoiceAnimation,
      icon: DollarSign,
      reverse: false,
      stats: [
        { label: "Invoices", value: "5000+", icon: FileText },
        { label: "Efficiency", value: "+60%", icon: Target }
      ],
      demoFeatures: [
        { title: "Invoice Builder", description: "Create professional invoices quickly", icon: FileText },
        { title: "Payment Tracking", description: "Monitor outstanding payments", icon: CreditCard },
        { title: "Financial Reports", description: "Comprehensive financial analytics", icon: BarChart3 },
        { title: "Quotation System", description: "Generate and manage quotes", icon: Receipt }
      ]
    },
    {
      title: "Director Management",
      description: "Complete director information management with detailed profiles, relationship tracking, and comprehensive communication history. Manage board members and stakeholders efficiently with advanced tracking capabilities.",
      features: [
        "Director Profiles",
        "Relationship Tracking",
        "Document Management",
        "Communication History",
        "Meeting Schedules",
        "Stakeholder Management"
      ],
      benefits: [
        "Centralize director information",
        "Track board relationships",
        "Manage meeting schedules",
        "Maintain compliance records",
        "Improve governance"
      ],
      animationData: directorAnimation,
      icon: UserCheck,
      reverse: true,
      stats: [
        { label: "Directors", value: "50+", icon: UserCheck },
        { label: "Compliance", value: "100%", icon: Lock }
      ],
      demoFeatures: [
        { title: "Director Profiles", description: "Complete director information and credentials", icon: Users },
        { title: "Meeting Management", description: "Schedule and track board meetings", icon: Calendar },
        { title: "Document Vault", description: "Secure document storage and access", icon: Lock },
        { title: "Relationship Map", description: "Visualize director connections", icon: Target }
      ]
    },
    {
      title: "Till Management",
      description: "Real-time cash flow tracking, transaction management, and account balance monitoring. Complete till management solution with automated reconciliation and comprehensive financial tracking.",
      features: [
        "Cash Flow Tracking",
        "Transaction Management",
        "Balance Monitoring",
        "Payment Processing",
        "Daily Reconciliation",
        "Financial Reports"
      ],
      benefits: [
        "Real-time cash visibility",
        "Automate reconciliation",
        "Reduce cash handling errors",
        "Improve financial control",
        "Generate instant reports"
      ],
      animationData: quotationAnimation,
      icon: Wallet,
      reverse: false,
      stats: [
        { label: "Transactions", value: "10K+", icon: CreditCard },
        { label: "Accuracy", value: "99.8%", icon: Target }
      ],
      demoFeatures: [
        { title: "Cash Dashboard", description: "Real-time cash flow overview", icon: PieChart },
        { title: "Transaction Log", description: "Complete transaction history", icon: FileText },
        { title: "Reconciliation", description: "Automated daily reconciliation", icon: Calculator },
        { title: "Balance Reports", description: "Detailed balance and cash reports", icon: BarChart3 }
      ]
    },
    {
      title: "Daily Entries",
      description: "Comprehensive daily financial entry system with categorization, approval workflows, and detailed tracking. Manage all financial transactions with automated categorization and approval processes.",
      features: [
        "Daily Transactions",
        "Entry Categorization",
        "Approval Workflows",
        "Financial Tracking",
        "Budget Monitoring",
        "Expense Management"
      ],
      benefits: [
        "Streamline daily operations",
        "Automate categorization",
        "Improve approval processes",
        "Enhance financial control",
        "Generate detailed reports"
      ],
      animationData: dailyEntriesAnimation,
      icon: Calendar,
      reverse: true,
      stats: [
        { label: "Entries", value: "50K+", icon: FileText },
        { label: "Efficiency", value: "+70%", icon: Target }
      ],
      demoFeatures: [
        { title: "Entry Forms", description: "Quick and easy transaction entry", icon: FileSpreadsheet },
        { title: "Approval Queue", description: "Streamlined approval workflow", icon: CheckCircle },
        { title: "Category Management", description: "Organize and categorize entries", icon: Target },
        { title: "Daily Reports", description: "Comprehensive daily summaries", icon: BarChart3 }
      ]
    },
    {
      title: "Attendance Management",
      description: "Advanced attendance tracking with biometric integration, shift management, and comprehensive reporting. Monitor employee attendance with automated calculations and detailed analytics.",
      features: [
        "Biometric Integration",
        "Shift Management",
        "Overtime Tracking",
        "Leave Management",
        "Attendance Reports",
        "Compliance Monitoring"
      ],
      benefits: [
        "Eliminate manual tracking",
        "Reduce attendance errors",
        "Automate overtime calculations",
        "Improve compliance",
        "Generate detailed reports"
      ],
      animationData: attendanceAnimation,
      icon: Clock,
      reverse: false,
      stats: [
        { label: "Accuracy", value: "99.9%", icon: Target },
        { label: "Time Saved", value: "15hrs", icon: Clock }
      ],
      demoFeatures: [
        { title: "Time Clock", description: "Biometric and digital time tracking", icon: Clock },
        { title: "Shift Scheduler", description: "Manage employee shifts and rotations", icon: Calendar },
        { title: "Leave Tracker", description: "Track and manage employee leave", icon: Calendar },
        { title: "Attendance Reports", description: "Detailed attendance analytics", icon: BarChart3 }
      ]
    },
    {
      title: "Advanced Reports",
      description: "Comprehensive business analytics, financial reports, and performance insights with export capabilities. Generate detailed reports across all business modules with advanced filtering and visualization.",
      features: [
        "Business Analytics",
        "Financial Reports",
        "Performance Insights",
        "Export Options",
        "Custom Dashboards",
        "Real-time Data"
      ],
      benefits: [
        "Make data-driven decisions",
        "Identify business trends",
        "Improve performance",
        "Comply with regulations",
        "Export to multiple formats"
      ],
      animationData: payrollAnimation, // Using payroll animation as placeholder
      icon: BarChart3,
      reverse: true,
      stats: [
        { label: "Reports", value: "100+", icon: FileText },
        { label: "Insights", value: "Real-time", icon: Target }
      ],
      demoFeatures: [
        { title: "Dashboard", description: "Customizable business dashboard", icon: PieChart },
        { title: "Financial Reports", description: "Comprehensive financial analytics", icon: BarChart3 },
        { title: "Performance Metrics", description: "Key performance indicators", icon: Target },
        { title: "Export Tools", description: "Export to PDF, Excel, and more", icon: FileText }
      ]
    }
  ];

  return (
    <div className="bg-gray-50">
      {modules.map((module, index) => (
        <ModuleShowcase
          key={index}
          {...module}
        />
      ))}
    </div>
  );
}
