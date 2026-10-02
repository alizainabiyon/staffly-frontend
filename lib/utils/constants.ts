// Application Constants

export const APP_CONFIG = {
  name: 'Staffly',
  version: '1.0.0',
  description: 'Complete Business Management Solution for Pakistani Enterprises',
  company: 'Staffly Solutions',
  supportEmail: 'support@staffly.com',
  website: 'https://staffly.com',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  DASHBOARD: '/dashboard',
  PAYROLL: '/dashboard/payroll',
  CRM: '/dashboard/crm',
  FINANCE: '/dashboard/finance',
  DIRECTORS: '/dashboard/directors',
  TILL: '/dashboard/till',
  ENTRIES: '/dashboard/entries',
  REPORTS: '/dashboard/reports',
  SETTINGS: '/dashboard/settings',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  ACCOUNTANT: 'accountant',
  DIRECTOR: 'director',
  EMPLOYEE: 'employee',
} as const;

export const PERMISSIONS = {
  // Payroll Permissions
  PAYROLL_VIEW: 'payroll:view',
  PAYROLL_CREATE: 'payroll:create',
  PAYROLL_EDIT: 'payroll:edit',
  PAYROLL_DELETE: 'payroll:delete',
  PAYROLL_APPROVE: 'payroll:approve',
  
  // Employee Permissions
  EMPLOYEE_VIEW: 'employee:view',
  EMPLOYEE_CREATE: 'employee:create',
  EMPLOYEE_EDIT: 'employee:edit',
  EMPLOYEE_DELETE: 'employee:delete',
  
  // CRM Permissions
  CRM_VIEW: 'crm:view',
  CRM_CREATE: 'crm:create',
  CRM_EDIT: 'crm:edit',
  CRM_DELETE: 'crm:delete',
  
  // Finance Permissions
  FINANCE_VIEW: 'finance:view',
  FINANCE_CREATE: 'finance:create',
  FINANCE_EDIT: 'finance:edit',
  FINANCE_DELETE: 'finance:delete',
  FINANCE_APPROVE: 'finance:approve',
  
  // Director Permissions
  DIRECTOR_VIEW: 'director:view',
  DIRECTOR_CREATE: 'director:create',
  DIRECTOR_EDIT: 'director:edit',
  DIRECTOR_DELETE: 'director:delete',
  
  // Till Permissions
  TILL_VIEW: 'till:view',
  TILL_CREATE: 'till:create',
  TILL_EDIT: 'till:edit',
  TILL_DELETE: 'till:delete',
  
  // Reports Permissions
  REPORTS_VIEW: 'reports:view',
  REPORTS_GENERATE: 'reports:generate',
  REPORTS_EXPORT: 'reports:export',
  
  // Settings Permissions
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  SETTINGS_SYSTEM: 'settings:system',
} as const;

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: Object.values(PERMISSIONS),
  [USER_ROLES.ACCOUNTANT]: [
    PERMISSIONS.PAYROLL_VIEW,
    PERMISSIONS.PAYROLL_CREATE,
    PERMISSIONS.PAYROLL_EDIT,
    PERMISSIONS.EMPLOYEE_VIEW,
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_EDIT,
    PERMISSIONS.CRM_VIEW,
    PERMISSIONS.CRM_CREATE,
    PERMISSIONS.CRM_EDIT,
    PERMISSIONS.FINANCE_VIEW,
    PERMISSIONS.FINANCE_CREATE,
    PERMISSIONS.FINANCE_EDIT,
    PERMISSIONS.TILL_VIEW,
    PERMISSIONS.TILL_CREATE,
    PERMISSIONS.TILL_EDIT,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_GENERATE,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  [USER_ROLES.DIRECTOR]: [
    PERMISSIONS.PAYROLL_VIEW,
    PERMISSIONS.PAYROLL_APPROVE,
    PERMISSIONS.EMPLOYEE_VIEW,
    PERMISSIONS.CRM_VIEW,
    PERMISSIONS.FINANCE_VIEW,
    PERMISSIONS.FINANCE_APPROVE,
    PERMISSIONS.DIRECTOR_VIEW,
    PERMISSIONS.DIRECTOR_CREATE,
    PERMISSIONS.DIRECTOR_EDIT,
    PERMISSIONS.TILL_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_GENERATE,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  [USER_ROLES.EMPLOYEE]: [
    PERMISSIONS.PAYROLL_VIEW,
    PERMISSIONS.CRM_VIEW,
    PERMISSIONS.REPORTS_VIEW,
  ],
};

export const EMPLOYEE_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  TERMINATED: 'terminated',
} as const;

export const LEAVE_TYPES = {
  ANNUAL: 'annual',
  SICK: 'sick',
  CASUAL: 'casual',
  MATERNITY: 'maternity',
  EMERGENCY: 'emergency',
} as const;

export const ATTENDANCE_STATUSES = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half_day',
  OVERTIME: 'overtime',
} as const;

export const PAYMENT_METHODS = {
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
  CHEQUE: 'cheque',
  CARD: 'card',
  ONLINE: 'online',
} as const;

export const INVOICE_STATUSES = {
  DRAFT: 'draft',
  SENT: 'sent',
  VIEWED: 'viewed',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUSES = {
  DRAFT: 'draft',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export const ACCOUNT_TYPES = {
  CASH: 'cash',
  BANK: 'bank',
  CREDIT_CARD: 'credit_card',
  INVESTMENT: 'investment',
} as const;

export const CURRENCIES = {
  PKR: { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
} as const;

export const DATE_FORMATS = {
  'DD/MM/YYYY': 'DD/MM/YYYY',
  'MM/DD/YYYY': 'MM/DD/YYYY',
  'YYYY-MM-DD': 'YYYY-MM-DD',
  'DD-MM-YYYY': 'DD-MM-YYYY',
} as const;

export const TIME_ZONES = {
  'Asia/Karachi': 'Pakistan Standard Time (PKT)',
  'UTC': 'Coordinated Universal Time (UTC)',
  'America/New_York': 'Eastern Standard Time (EST)',
  'Europe/London': 'Greenwich Mean Time (GMT)',
} as const;

export const PAKISTANI_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Larkana',
  'Mardan',
  'Mingora',
  'Rahim Yar Khan',
  'Sahiwal',
  'Okara',
] as const;

export const DEPARTMENTS = [
  'steel welding',
  'aluminium + glass',
  'upvc + glass',
  'chef',
  'drivers',
  'office',
  'helpers',
  'others',
] as const;

export const EXPENSE_CATEGORIES = {
  OFFICE: [
    'Office Rent',
    'Utilities',
    'Office Supplies',
    'Equipment',
    'Maintenance',
    'Internet & Phone',
    'Insurance',
    'Security',
  ],
  EMPLOYEE: [
    'Salaries',
    'Benefits',
    'Training',
    'Travel & Accommodation',
    'Medical',
    'Bonuses',
    'Overtime',
  ],
  BUSINESS: [
    'Marketing',
    'Advertising',
    'Professional Services',
    'Legal Fees',
    'Bank Charges',
    'Taxes',
    'Licenses',
    'Subscriptions',
  ],
  DIRECTOR: [
    'Personal Expenses',
    'Utilities',
    'Groceries',
    'Medical',
    'Travel',
    'Entertainment',
    'Fuel',
    'Maintenance',
  ],
} as const;

export const INCOME_CATEGORIES = [
  'Sales Revenue',
  'Service Revenue',
  'Consultation Fees',
  'Interest Income',
  'Rental Income',
  'Commission',
  'Other Income',
] as const;

export const TAX_RATES = {
  STANDARD: 15,
  REDUCED: 5,
  ZERO: 0,
  EXEMPT: 0,
} as const;

export const PAYROLL_CYCLES = {
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
} as const;

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
} as const;

export const FILE_TYPES = {
  IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  DOCUMENTS: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'],
  ALL: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'],
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_REGEX: /^(\+92|0)?[0-9]{10}$/,
  CNIC_REGEX: /^[0-9]{5}-[0-9]{7}-[0-9]$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NTN_REGEX: /^[0-9]{7}-[0-9]$/,
} as const;

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'staffly_auth_token',
  USER_DATA: 'staffly_user_data',
  THEME: 'staffly_theme',
  LANGUAGE: 'staffly_language',
  SIDEBAR_COLLAPSED: 'staffly_sidebar_collapsed',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/v1/user/signin',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_EMAIL: '/api/auth/verify-email',
  },
  FILE_HANDLER: {
    UPLOAD_SINGLE: '/app/v1/fileHandler/upload-single-file',
    DELETE_SINGLE: '/app/v1/fileHandler/delete-single-file',
    UPLOAD_MULTIPLE: '/app/v1/fileHandler/upload-multiple-files',
    DELETE_MULTIPLE: '/app/v1/fileHandler/delete-multiple-files',
  },
  EMPLOYEES: {
    LIST: '/app/v1/employee/get-all-employees',
    CREATE: '/app/v1/employee/create',
    GET: '/app/v1/employee/get-employee-by-id',
    UPDATE: '/app/v1/employee/update',
    DELETE: '/app/v1/employee/delete/:id',
    BULK_IMPORT: '/app/v1/employee/bulk-import',
    EXPORT: '/app/v1/employee/export',
    GET_EXPENSES: '/app/v1/employee/get-employee-expenses',
  },
  PAYROLL: {
    SALARY_SLIPS: '/api/payroll/salary-slips',
    GENERATE: '/api/payroll/generate',
    APPROVE: '/api/payroll/approve',
    BULK_GENERATE: '/api/payroll/bulk-generate',
    SALARY_HISTORY: '/app/v1/salary/salary-history',
    EMPLOYEE_SALARY_HISTORY: '/app/v1/salary/employee-salary-history',
    UPDATE_SALARY_STATUS: '/app/v1/salary/update-salary-status',
  },
  ATTENDANCE: {
    MONTHLY_ALL: '/app/v1/attendance/get-monthly-attendance-all',
    MONTHLY_EMPLOYEE: '/app/v1/attendance/get-monthly-attendance',
    MARK_ATTENDANCE: '/app/v1/attendance/mark-attendance',
    GET_BY_ID: '/app/v1/attendance/get-attendance-by-id',
    UPDATE: '/app/v1/attendance/update-attendance',
    DELETE: '/app/v1/attendance/delete-attendance-by-id',
  },
  CUSTOMERS: {
    LIST: '/app/v1/customer/get-all-customers',
    CREATE: '/app/v1/customer/create',
    GET: '/app/v1/customer/get-customer-by-id',
    UPDATE: '/app/v1/customer/update',
    DELETE: '/app/v1/customer/delete',
    LEDGER: '/customer/ledger',
  },
  CONTRACTORS: {
    LIST: '/app/v1/contractor/get-all-contractors',
    CREATE: '/app/v1/contractor/create',
    GET: '/app/v1/contractor/get-contractor-by-id',
    UPDATE: '/app/v1/contractor/update',
    DELETE: '/app/v1/contractor/delete',
  },
  VENDORS: {
    LIST: '/app/v1/vendor/get-all-vendors',
    CREATE: '/app/v1/vendor/create',
    GET: '/app/v1/vendor/get-vendor-by-id',
    UPDATE: '/app/v1/vendor/update',
    DELETE: '/app/v1/vendor/delete',
  },
  VENDOR_ORDERS: {
    LIST: '/app/v1/vendor-order/get-all-vendor-orders',
    CREATE: '/app/v1/vendor-order/create',
    GET: '/app/v1/vendor-order/get-vendor-order-by-id',
    UPDATE: '/app/v1/vendor-order/update',
    DELETE: '/app/v1/vendor-order/delete',
    APPROVE: '/app/v1/vendor-order/approve',
  },
  QUOTATIONS: {
    LIST: '/app/v1/quotation/get-all-quotations',
    CREATE: '/app/v1/quotation/create',
    GET: '/app/v1/quotation/get-quotation-by-id',
    UPDATE: '/app/v1/quotation/update',
    DELETE: '/app/v1/quotation/delete',
    CONVERT_TO_INVOICE: '/app/v1/quotation/convert-to-invoice',
  },
  INVOICES: {
    LIST: '/app/v1/invoice/get-all-invoices',
    CREATE: '/app/v1/invoice/create',
    GET: '/app/v1/invoice/get-invoice-by-id',
    UPDATE: '/app/v1/invoice/update',
    DELETE: '/app/v1/invoice/delete',
    APPROVE: '/app/v1/invoice/update-status',
    MARK_PAID: '/app/v1/invoice/mark-paid',
    PDF: '/app/v1/invoice/generate-pdf',
    SEND: '/app/v1/invoice/send',
  },
  DIRECTORS: {
    LIST: '/app/v1/director/get-all-directors',
    CREATE: '/app/v1/director/create',
    GET: '/app/v1/director/get-director-by-id',
    UPDATE: '/app/v1/director/update',
    DELETE: '/app/v1/director/delete',
  },
  TRANSACTIONS: {
    LIST: '/api/transactions',
    CREATE: '/api/transactions',
    GET: '/api/transactions/:id',
    UPDATE: '/api/transactions/:id',
    DELETE: '/api/transactions/:id',
    RECONCILE: '/api/transactions/reconcile',
  },
  REPORTS: {
    GENERATE: '/api/reports/generate',
    LIST: '/api/reports',
    DOWNLOAD: '/api/reports/:id/download',
    EXPENSE_REPORT: '/app/v1/reports/expense-report',
    REMAINING_BALANCE: '/app/v1/reports/remaining-balance',
    DOCX_TO_PDF: '/app/v1/reports/docx-to-pdf',
  },
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    CHARTS: '/api/dashboard/charts',
    RECENT_ACTIVITIES: '/api/dashboard/recent-activities',
  },
  DAILY_ENTRIES: {
    LIST: '/app/v1/daily-entry/get-all-entries',
    CREATE: '/app/v1/daily-entry/create',
    GET: '/app/v1/daily-entry/get-entry-by-id',
    UPDATE: '/app/v1/daily-entry/update',
    DELETE: '/app/v1/daily-entry/delete',
    SAVE_TODAY_ENTRIES: '/app/v1/daily-entry/save-today-entries',
  },
  PROFILE: {
    GET: '/app/v1/profile/',
    UPDATE: '/app/v1/profile/update-profile',
    UPDATE_COMPANY: '/app/v1/profile/update-company',
  },
  TILL: {
    INITIALIZE: '/app/v1/till/initialize',
    GET: '/app/v1/till/get',
  },
} as const;

export const CHART_COLORS = [
  '#059669', // Green
  '#0ea5e9', // Blue
  '#f97316', // Orange
  '#8b5cf6', // Purple
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#6366f1', // Indigo
] as const;

export const BACKUP_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
} as const;

export const REPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
} as const;

export const SYSTEM_MODULES = {
  DASHBOARD: 'dashboard',
  PAYROLL: 'payroll',
  CRM: 'crm',
  FINANCE: 'finance',
  DIRECTORS: 'directors',
  TILL: 'till',
  ENTRIES: 'entries',
  REPORTS: 'reports',
  SETTINGS: 'settings',
} as const;

export const CONTRACTOR_TYPES = {
  INDIVIDUAL: 'individual',
  COMPANY: 'company',
  FREELANCER: 'freelancer',
} as const;

export const SALARY_STATUSES = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  DISBURSED: 'disbursed',
  HOLD: 'hold',
} as const;

export const REPORT_TYPES = {
  PAYROLL: {
    MONTHLY_PAYROLL: 'monthly_payroll',
    EMPLOYEE_SUMMARY: 'employee_summary',
    DEPARTMENT_WISE: 'department_wise_payroll',
    TAX_DEDUCTIONS: 'tax_deductions',
    ATTENDANCE_SUMMARY: 'attendance_summary',
    LEAVE_REPORT: 'leave_report',
    OVERTIME_REPORT: 'overtime_report',
    SALARY_COMPARISON: 'salary_comparison',
  },
  FINANCIAL: {
    PROFIT_LOSS: 'profit_loss',
    CASH_FLOW: 'cash_flow',
    BALANCE_SHEET: 'balance_sheet',
    INVOICE_SUMMARY: 'invoice_summary',
    OUTSTANDING_PAYMENTS: 'outstanding_payments',
    TAX_SUMMARY: 'tax_summary',
    EXPENSE_ANALYSIS: 'expense_analysis',
    REVENUE_ANALYSIS: 'revenue_analysis',
  },
  CRM: {
    CUSTOMER_SUMMARY: 'customer_summary',
    SALES_PERFORMANCE: 'sales_performance',
    CUSTOMER_LEDGER: 'customer_ledger',
    ORDER_STATUS: 'order_status',
    CUSTOMER_GROWTH: 'customer_growth',
    REVENUE_BY_CUSTOMER: 'revenue_by_customer',
    CONTRACTOR_PERFORMANCE: 'contractor_performance',
  },
  DIRECTOR: {
    DIRECTOR_EXPENSES: 'director_expenses',
    LOAN_STATEMENT: 'loan_statement',
    NET_BALANCE: 'net_balance',
    TRANSACTION_HISTORY: 'transaction_history',
    MONTHLY_SUMMARY: 'monthly_director_summary',
    REIMBURSEMENT: 'reimbursement_report',
  },
} as const;