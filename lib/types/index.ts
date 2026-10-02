// Core Types for Staffly SaaS Application

export interface User {
  userID: string;
  firstName: string;
  lastName: string;
  token: string;
  email: string;
  role: 'admin' | 'accountant' | 'director' | 'employee';
  companyID: string;
  avatar?: string;
  phone?: string;
  position?: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  cnic: string;
  address: string;
  address2?: string;
  age: number;
  study: string;
  cast: string;
  profilePic?: string;
  position: string;
  department: string;
  salary: number;
  status: 'active' | 'inactive' | 'terminated';
  joinDate: string;
  bankAccount?: string;
  emergencyContacts: {
    name: string;
    phone: string;
    relation: string;
    occupation: string;
  }[];
  experiences: {
    title: string;
    description: string;
    address: string;
    from: string;
    to: string;
  }[];
  documents: {
    type: string;
    url: string;
    uploadedAt: string;
  }[];

  createdAt: string;
  updatedAt: string;
}

export interface EmployeeLoan {
  id: string;
  employeeId: string;
  amount: number;
  remainingAmount: number;
  interestRate: number;
  installmentAmount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'defaulted';
  payments: LoanPayment[];
  createdAt: string;
}

export interface LoanPayment {
  id: string;
  loanId: string;
  amount: number;
  paymentDate: string;
  principalAmount: number;
  interestAmount: number;
  remainingBalance: number;
}

export interface EmployeeAdvance {
  id: string;
  employeeId: string;
  amount: number;
  reason: string;
  requestDate: string;
  approvalDate?: string;
  status: 'pending' | 'approved' | 'rejected' | 'recovered';
  recoveryMethod: 'salary_deduction' | 'lump_sum';
  installments?: number;
  recoveredAmount: number;
}

export interface Attendance {
  id: string;
  employeeId: string;
  name: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'overtime' | 'leave' | 'holiday';
  workingHours: number;
  overtimeHours: number;
  notes?: string;
  approvedBy?: string;
  bonus?: number;
}

export interface EmployeeExpense {
  _id: string;
  expenseId: string;
  userID: string;
  expenseDate: string;
  catagory: string;
  type: string;
  employeeId: string;
  description: string;
  amount: number;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyAttendanceRecord {
  attendanceId: string;
  date: string;
  day: string;
  totalPresent: number;
  totalAbsent: number;
  totalOvertime: number;
  totalOnLeave: number;
  totalLate: number;
  totalHalfDay: number;
  totalHoliday: number;
  totalWeekend: number;
  totalEmployees: number;
}

export interface Leave {
  id: string;
  employeeId: string;
  type: 'annual' | 'sick' | 'casual' | 'maternity' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  documents?: string[];
}

export interface SalaryDeduction {
  _id: string;
  date: string;
  reason: string;
  amount: number;
  loanId?: string;
  installmentNumber?: number;
}

export interface EmployeeInfo {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  position: string;
}

export interface SalarySlip {
  _id: string;
  salaryId: string;
  employeeId: EmployeeInfo;
  month: number;
  year: number;
  basicSalary: number;
  overtimeAmount: number;
  deduction: SalaryDeduction[];
  grossSalary: number;
  netSalary: number;
  status: 'pending' | 'paid';
  paymentDate?: string;
  remarks: string;
  userID: string;
  createdAt: string;
  updatedAt: string;
}

// CRM types are now in lib/types/crm.ts
export type { Contractor, Customer, Vendor } from './crm';

// Director types are now in lib/types/director.ts
export type { Director, DirectorFormData, DirectorFilters, DirectorPagination, DirectorListResponse } from './director';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  deliveryDate?: string;
  status: 'draft' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  shippingAmount: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue';
  paymentMethod?: string;
  shippingAddress: string;
  billingAddress: string;
  notes?: string;
  attachments: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
  discountRate: number;
}

// Invoice types are now exported from finance.ts

export interface Payment {
  id: string;
  paymentNumber: string;
  customerId: string;
  customerName: string;
  invoiceId?: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'cheque' | 'card' | 'online';
  reference?: string;
  notes?: string;
  status: 'pending' | 'cleared' | 'bounced';
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    chequeNumber?: string;
  };
  attachments: string[];
  recordedBy: string;
  createdAt: string;
}

export * from './finance';

// Profile types
export * from './profile';

// Old Director interfaces removed - now using new director types from lib/types/director.ts

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  subcategory?: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: 'cash' | 'bank' | 'card' | 'cheque' | 'online';
  accountId?: string;
  reference?: string;
  invoiceId?: string;
  customerId?: string;
  employeeId?: string;
  directorId?: string;
  tags: string[];
  attachments: string[];
  status: 'pending' | 'cleared' | 'cancelled';
  reconciled: boolean;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'credit_card' | 'investment';
  accountNumber?: string;
  bankName?: string;
  balance: number;
  currency: string;
  isActive: boolean;
  description?: string;
  openingBalance: number;
  openingDate: string;
  lastReconciled?: string;
}

export interface DailyEntry {
  id: string;
  date: string;
  type: 'director_expense' | 'customer_payment' | 'office_expense' | 'salary_payment' | 'utility_bill' | 'purchase' | 'sale' | 'loan_payment' | 'other';
  category: string;
  amount: number;
  description?: string;
  reference?: string;
  paymentMethod: 'cash' | 'bank' | 'card' | 'cheque';
  accountId: string;
  relatedEntityId?: string; // customer, employee, director ID
  relatedEntityType?: 'customer' | 'employee' | 'director';
  attachments: string[];
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: string;
  notes?: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  name: string;
  type: 'payroll' | 'financial' | 'crm' | 'director' | 'custom';
  parameters: {
    dateFrom: string;
    dateTo: string;
    filters: Record<string, any>;
  };
  data: any;
  generatedAt: string;
  generatedBy: string;
  format: 'pdf' | 'excel' | 'csv';
  status: 'generating' | 'completed' | 'failed';
  downloadUrl?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
  readAt?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface CompanySettings {
  id: string;
  companyName: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  taxNumber: string;
  logo?: string;
  currency: string;
  dateFormat: string;
  timeZone: string;
  fiscalYearStart: string;
  payrollCycle: 'weekly' | 'biweekly' | 'monthly';
  defaultTaxRate: number;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    iban?: string;
    swiftCode?: string;
  }[];
  emailSettings: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  notificationSettings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    payrollReminders: boolean;
    invoiceReminders: boolean;
    systemUpdates: boolean;
  };
  backupSettings: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    retentionPeriod: number;
    cloudStorage?: string;
  };
  securitySettings: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
    sessionTimeout: number;
    twoFactorAuth: boolean;
    ipWhitelist: string[];
  };
}

// API Response Types
export interface ApiSuccessResponse {
  status: {
    code: number;
    success: boolean;
  };
  response: {
    message?: string;
    data?: any;
    error?: any;
  };
}

// Backend API Response Structure
export interface BackendApiResponse<T = any> {
  status: {
    code: number;
    success: boolean;
  };
  response: {
    message?: string;
    data?: T;
    error?: {
      date: string;
      [key: string]: any;
    };
  };
}

// Auth Response Types
export interface AuthResponse {
  userID: string;
  firstName: string;
  lastName: string;
  token: string;
  email: string;
  role: 'admin' | 'accountant' | 'director' | 'employee';
  companyID: string;
  avatar?: string;
  phone?: string;
  position?: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Filter and Search Types
export type { FilterOptions } from './crm';

// Dashboard Types
export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  totalCustomers: number;
  activeCustomers: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  pendingInvoices: number;
  overdueInvoices: number;
  cashBalance: number;
  bankBalance: number;
  totalBalance: number;
  pendingSalaries: number;
  pendingLeaves: number;
  todayAttendance: {
    present: number;
    absent: number;
    late: number;
  };
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: any;
}

// Permission Types
export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  actions: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
}

// Ledger Types
export interface LedgerEntry {
  id: string;
  date: string;
  type: 'invoice' | 'payment' | 'credit_note' | 'debit_note';
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  invoiceId?: string;
  paymentId?: string;
}

// PDF Viewer Types
export interface PDFViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export interface TillCalculation {
  openingBalance: number;
  closingBalance: number;
  totalCash: number;
  totalBank: number;
  _id: string;
}

export interface TillTransaction {
  transactionId: string;
  amount: number;
  currency: string;
  openingBalance: number;
  closingBalance: number;
  transactionDate: string;
  paymentType: 'credit' | 'debit';
  paymentMethod: 'cash' | 'bank' | 'card';
  senderType: 'customer' | 'director' | 'vendor' | 'expense';
  receiverType: 'customer' | 'director' | 'vendor' | 'expense';
  purpose: string;
  description: string;
  _id: string;
}

export interface Till {
  _id: string;
  ledgerId: string;
  userID: string;
  ledgerType: 'director' | 'till';
  customerId: string | null;
  vendorId: string | null;
  directorId: string | null;
  calculation: TillCalculation;
  transactions: TillTransaction[];
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TillResponse {
  till: Till[];
  allTransactions: TillTransaction[];
  totalBalance: number;
  totalCash: number;
  totalBank: number;
}