// Temporarily commented out to fix build issues for Vercel deployment
/*
import { v4 as uuidv4 } from 'uuid';
import {
  User,
  Employee,
  Customer,
  Invoice,
  Transaction,
  Director,
  DailyEntry,
  SalarySlip,
  Order,
  Payment,
  Quotation,
  Leave,
  Attendance,
  Account,
  DashboardStats,
} from '../types';

// Mock Database - In production, this would be replaced with actual database calls
class MockDatabase {
  private users: User[] = [];
  private employees: Employee[] = [];
  private customers: Customer[] = [];
  private invoices: Invoice[] = [];
  private transactions: Transaction[] = [];
  private directors: Director[] = [];
  private dailyEntries: DailyEntry[] = [];
  private salarySlips: SalarySlip[] = [];
  private orders: Order[] = [];
  private payments: Payment[] = [];
  private quotations: Quotation[] = [];
  private leaves: Leave[] = [];
  private attendance: Attendance[] = [];
  private accounts: Account[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with comprehensive mock data
    this.initializeUsers();
    this.initializeEmployees();
    this.initializeCustomers();
    this.initializeDirectors();
    this.initializeAccounts();
    this.initializeInvoices();
    this.initializeTransactions();
    this.initializeDailyEntries();
    this.initializeSalarySlips();
    this.initializeOrders();
    this.initializePayments();
    this.initializeQuotations();
    this.initializeLeaves();
    this.initializeAttendance();
  }

  private initializeUsers() {
    this.users = [
      {
        userID: '1',
        firstName: 'Ahmed',
        lastName: 'Khan',
        token: 'mock-token-1',
        email: 'admin@pakbiz.com',
        role: 'admin',
        companyID: 'PakBiz Solutions',
        avatar: '',
        phone: '+92-300-1234567',
        position: 'System Administrator',
        permissions: ['*'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        userID: '2',
        firstName: 'Fatima',
        lastName: 'Ali',
        token: 'mock-token-2',
        email: 'accountant@pakbiz.com',
        role: 'accountant',
        companyID: 'PakBiz Solutions',
        avatar: '',
        phone: '+92-321-9876543',
        position: 'Senior Accountant',
        permissions: ['payroll:*', 'finance:*', 'crm:view', 'reports:*'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private initializeEmployees() {
    this.employees = [
      {
        id: '1',
        employeeId: 'EMP001',
        name: 'Ahmed Khan',
        email: 'ahmed.khan@pakbiz.com',
        phone: '+92-300-1234567',
        cnic: '42101-1234567-1',
        address: 'House 123, F-7 Markaz, Islamabad',
        address2: 'Islamabad, Pakistan',
        age: 28,
        study: 'Bachelor of Computer Science',
        cast: 'Not specified',
        profilePic: '',
        position: 'Software Engineer',
        department: 'Information Technology',
        salary: 85000,
        status: 'active',
        joinDate: '2023-01-15',
        bankAccount: '1234567890',
        emergencyContacts: [
          {
            name: 'Ayesha Khan',
            phone: '+92-300-7654321',
            relation: 'Wife',
            occupation: 'Housewife',
          },
        ],
        documents: [
          {
            type: 'CNIC',
            url: '/documents/ahmed_cnic.pdf',
            uploadedAt: '2023-01-15T00:00:00Z',
          },
                ],
        experiences: [
          {
            title: 'Software Engineer',
            description: 'Full-stack development using React and Node.js',
            address: 'TechCorp, Islamabad',
            from: '2021-01-01',
            to: '2022-12-31',
          },
        ],
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        employeeId: 'EMP002',
        name: 'Fatima Ali',
        email: 'fatima.ali@pakbiz.com',
        phone: '+92-321-9876543',
        cnic: '42101-2345678-2',
        address: 'Apartment 45, G-9 Markaz, Islamabad',
        address2: 'Islamabad, Pakistan',
        age: 32,
        study: 'Master of Human Resource Management',
        cast: 'Not specified',
        profilePic: '',
        position: 'HR Manager',
        department: 'Human Resources',
        salary: 90000,
        status: 'active',
        joinDate: '2022-11-20',
        bankAccount: '2345678901',
        emergencyContacts: [
          {
            name: 'Mohammad Ali',
            phone: '+92-321-1234567',
            relation: 'Husband',
            occupation: 'Business Owner',
          },
        ],
        documents: [
          {
            type: 'CNIC',
            url: '/documents/fatima_cnic.pdf',
            uploadedAt: '2022-11-20T00:00:00Z',
          },
        ],
        experiences: [
          {
            title: 'HR Assistant',
            description: 'Recruitment and employee relations',
            address: 'HRCorp, Islamabad',
            from: '2020-01-01',
            to: '2022-10-31',
          },
        ],
        createdAt: '2022-11-20T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        employeeId: 'EMP003',
        name: 'Mohammad Hassan',
        email: 'mohammad.hassan@pakbiz.com',
        phone: '+92-333-5555555',
        cnic: '42101-3456789-3',
        address: 'House 67, E-11 Sector, Islamabad',
        address2: 'Islamabad, Pakistan',
        age: 25,
        study: 'Bachelor of Business Administration',
        cast: 'Not specified',
        profilePic: '',
        position: 'Sales Executive',
        department: 'Sales & Marketing',
        salary: 65000,
        status: 'active',
        joinDate: '2023-03-10',
        bankAccount: '3456789012',
        emergencyContacts: [
          {
            name: 'Zainab Hassan',
            phone: '+92-333-1111111',
            relation: 'Sister',
            occupation: 'Student',
          },
        ],
        documents: [
          {
            type: 'CNIC',
            url: '/documents/hassan_cnic.pdf',
            uploadedAt: '2023-03-10T00:00:00Z',
          },
        ],
        experiences: [
          {
            title: 'Sales Representative',
            description: 'B2B sales and customer relationship management',
            address: 'SalesCorp, Islamabad',
            from: '2022-01-01',
            to: '2023-02-28',
          },
        ],
        createdAt: '2023-03-10T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private initializeCustomers() {
    this.customers = [
      {
        id: '1',
        name: 'Textile Mills Ltd.',
        email: 'info@textilemills.com',
        phone: '+92-21-1234567',
        company: 'Textile Mills Ltd.',
        address: 'Industrial Area, Sector 15, Karachi',
        city: 'Karachi',
        country: 'Pakistan',
        taxNumber: 'NTN-1234567-8',
        creditLimit: 5000000,
        paymentTerms: 30,
        status: 'active',
        customerType: 'business',
        contactPerson: 'Mr. Rashid Ahmed',
        website: 'www.textilemills.com',
        notes: 'Long-term client with excellent payment history',
        tags: ['textile', 'manufacturing', 'premium'],
        totalOrders: 15,
        totalValue: 2500000,
        outstandingAmount: 150000,
        lastOrderDate: '2024-01-15',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'ABC Trading Co.',
        email: 'contact@abctrading.com',
        phone: '+92-42-9876543',
        company: 'ABC Trading Co.',
        address: 'Commercial District, Main Boulevard, Lahore',
        city: 'Lahore',
        country: 'Pakistan',
        taxNumber: 'NTN-2345678-9',
        creditLimit: 2000000,
        paymentTerms: 15,
        status: 'active',
        customerType: 'business',
        contactPerson: 'Ms. Sana Khan',
        website: 'www.abctrading.com',
        notes: 'Regular orders, prompt payments',
        tags: ['trading', 'retail'],
        totalOrders: 8,
        totalValue: 1200000,
        outstandingAmount: 75000,
        lastOrderDate: '2024-01-12',
        createdAt: '2023-02-15T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Steel Works Pvt Ltd.',
        email: 'admin@steelworks.com',
        phone: '+92-51-5555555',
        company: 'Steel Works Pvt Ltd.',
        address: 'Industrial Zone, I-9 Sector, Islamabad',
        city: 'Islamabad',
        country: 'Pakistan',
        taxNumber: 'NTN-3456789-0',
        creditLimit: 8000000,
        paymentTerms: 45,
        status: 'active',
        customerType: 'business',
        contactPerson: 'Engr. Ali Raza',
        website: 'www.steelworks.com',
        notes: 'Large volume orders, seasonal business',
        tags: ['steel', 'construction', 'industrial'],
        totalOrders: 22,
        totalValue: 3800000,
        outstandingAmount: 320000,
        lastOrderDate: '2024-01-08',
        createdAt: '2022-12-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private initializeDirectors() {
    this.directors = [
      {
        id: '1',
        name: 'Ahmed Malik',
        email: 'ahmed.malik@pakbiz.com',
        phone: '+92-300-1234567',
        cnic: '42101-1111111-1',
        position: 'Managing Director',
        joinDate: '2020-01-15',
        shareholding: 60,
        address: 'House 456, F-6 Sector, Islamabad',
        bankAccount: '1111111111',
        status: 'active',
        personalExpenses: [],
        loans: [],
        netBalance: -375000,
        monthlyDrawing: 150000,
        createdAt: '2020-01-15T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Fatima Sheikh',
        email: 'fatima.sheikh@pakbiz.com',
        phone: '+92-321-9876543',
        cnic: '42101-2222222-2',
        position: 'Executive Director',
        joinDate: '2020-06-01',
        shareholding: 40,
        address: 'Apartment 789, G-10 Markaz, Islamabad',
        bankAccount: '2222222222',
        status: 'active',
        personalExpenses: [],
        loans: [],
        netBalance: -115000,
        monthlyDrawing: 100000,
        createdAt: '2020-06-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private initializeAccounts() {
    this.accounts = [
      {
        id: '1',
        name: 'Cash in Hand',
        type: 'cash',
        balance: 150000,
        currency: 'PKR',
        isActive: true,
        description: 'Office cash for daily expenses',
        openingBalance: 100000,
        openingDate: '2024-01-01',
        lastReconciled: '2024-01-15',
      },
      {
        id: '2',
        name: 'HBL Current Account',
        type: 'bank',
        accountNumber: '12345678901234',
        bankName: 'Habib Bank Limited',
        balance: 2500000,
        currency: 'PKR',
        isActive: true,
        description: 'Main business account',
        openingBalance: 2000000,
        openingDate: '2023-01-01',
        lastReconciled: '2024-01-14',
      },
      {
        id: '3',
        name: 'UBL Savings Account',
        type: 'bank',
        accountNumber: '98765432109876',
        bankName: 'United Bank Limited',
        balance: 800000,
        currency: 'PKR',
        isActive: true,
        description: 'Reserve fund account',
        openingBalance: 500000,
        openingDate: '2023-06-01',
        lastReconciled: '2024-01-10',
      },
    ];
  }

  private initializeInvoices() {
    this.invoices = [
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        customerId: '1',
        customerName: 'Textile Mills Ltd.',
        orderId: '1',
        invoiceDate: '2024-01-01',
        dueDate: '2024-01-31',
        items: [
          {
            id: '1',
            description: 'Software Development Services',
            quantity: 1,
            unitPrice: 150000,
            totalPrice: 150000,
            taxRate: 15,
            taxAmount: 22500,
          },
        ],
        subtotal: 150000,
        taxAmount: 22500,
        discountAmount: 0,
        totalAmount: 172500,
        paidAmount: 172500,
        remainingAmount: 0,
        status: 'paid',
        paymentTerms: 'Net 30 days',
        notes: 'Thank you for your business',
        termsAndConditions: 'Payment due within 30 days',
        attachments: [],
        sentAt: '2024-01-01T10:00:00Z',
        viewedAt: '2024-01-02T09:00:00Z',
        paidAt: '2024-01-15T14:30:00Z',
        createdBy: '1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z',
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        customerId: '2',
        customerName: 'ABC Trading Co.',
        invoiceDate: '2024-01-05',
        dueDate: '2024-01-20',
        items: [
          {
            id: '2',
            description: 'Consultation Services',
            quantity: 20,
            unitPrice: 5000,
            totalPrice: 100000,
            taxRate: 15,
            taxAmount: 15000,
          },
        ],
        subtotal: 100000,
        taxAmount: 15000,
        discountAmount: 5000,
        totalAmount: 110000,
        paidAmount: 0,
        remainingAmount: 110000,
        status: 'sent',
        paymentTerms: 'Net 15 days',
        notes: '',
        termsAndConditions: 'Payment due within 15 days',
        attachments: [],
        sentAt: '2024-01-05T11:00:00Z',
        viewedAt: '2024-01-06T10:00:00Z',
        createdBy: '1',
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-06T10:00:00Z',
      },
    ];
  }

  private initializeTransactions() {
    this.transactions = [
      {
        id: '1',
        type: 'income',
        category: 'Sales Revenue',
        subcategory: 'Software Services',
        amount: 172500,
        description: 'Payment from Textile Mills Ltd. - INV-2024-001',
        date: '2024-01-15',
        paymentMethod: 'bank',
        accountId: '2',
        reference: 'INV-2024-001',
        invoiceId: '1',
        customerId: '1',
        tags: ['invoice', 'payment'],
        attachments: [],
        status: 'cleared',
        reconciled: true,
        notes: 'Payment received on time',
        createdBy: '1',
        createdAt: '2024-01-15T14:30:00Z',
        updatedAt: '2024-01-15T14:30:00Z',
      },
      {
        id: '2',
        type: 'expense',
        category: 'Office Rent',
        amount: 50000,
        description: 'Monthly office rent payment',
        date: '2024-01-01',
        paymentMethod: 'bank',
        accountId: '2',
        reference: 'RENT-JAN-2024',
        tags: ['rent', 'office'],
        attachments: [],
        status: 'cleared',
        reconciled: true,
        notes: 'Rent for January 2024',
        createdBy: '1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '3',
        type: 'expense',
        category: 'Utilities',
        amount: 15000,
        description: 'Electricity bill payment',
        date: '2024-01-05',
        paymentMethod: 'cash',
        accountId: '1',
        reference: 'ELEC-JAN-2024',
        tags: ['utilities', 'electricity'],
        attachments: [],
        status: 'cleared',
        reconciled: true,
        notes: 'Monthly electricity bill',
        createdBy: '1',
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-05T00:00:00Z',
      },
    ];
  }

  private initializeDailyEntries() {
    this.dailyEntries = [
      {
        id: '1',
        date: '2024-01-15',
        type: 'customer_payment',
        category: 'Sales',
        amount: 172500,
        description: 'Payment received from Textile Mills Ltd.',
        reference: 'INV-2024-001',
        paymentMethod: 'bank',
        accountId: '2',
        relatedEntityId: '1',
        relatedEntityType: 'customer',
        attachments: [],
        status: 'approved',
        approvedBy: '1',
        approvalDate: '2024-01-15T15:00:00Z',
        notes: 'Payment received on time',
        tags: ['payment', 'invoice'],
        createdBy: '1',
        createdAt: '2024-01-15T14:30:00Z',
        updatedAt: '2024-01-15T15:00:00Z',
      },
      {
        id: '2',
        date: '2024-01-05',
        type: 'utility_bill',
        category: 'Utilities',
        amount: 15000,
        description: 'Electricity bill payment',
        reference: 'ELEC-JAN-2024',
        paymentMethod: 'cash',
        accountId: '1',
        attachments: [],
        status: 'approved',
        approvedBy: '1',
        approvalDate: '2024-01-05T10:00:00Z',
        notes: 'Monthly electricity bill',
        tags: ['utilities', 'electricity'],
        createdBy: '1',
        createdAt: '2024-01-05T09:30:00Z',
        updatedAt: '2024-01-05T10:00:00Z',
      },
    ];
  }

  private initializeSalarySlips() {
    this.salarySlips = [
      {
        id: '1',
        employeeId: '1',
        month: 'January',
        year: 2024,
        basicSalary: 85000,
        allowances: [
          { type: 'House Rent', amount: 25500 },
          { type: 'Transport', amount: 8500 },
          { type: 'Medical', amount: 5000 },
        ],
        deductions: [
          { type: 'Income Tax', amount: 8500 },
          { type: 'EOBI', amount: 1000 },
          { type: 'Social Security', amount: 850 },
        ],
        grossSalary: 124000,
        netSalary: 113650,
        taxDeducted: 8500,
        eobi: 1000,
        socialSecurity: 850,
        providentFund: 0,
        workingDays: 22,
        presentDays: 22,
        overtimeHours: 8,
        overtimePay: 4000,
        loanDeduction: 0,
        advanceDeduction: 0,
        status: 'generated',
        generatedAt: '2024-01-31T00:00:00Z',
      },
      {
        id: '2',
        employeeId: '2',
        month: 'January',
        year: 2024,
        basicSalary: 90000,
        allowances: [
          { type: 'House Rent', amount: 27000 },
          { type: 'Transport', amount: 9000 },
          { type: 'Medical', amount: 5000 },
        ],
        deductions: [
          { type: 'Income Tax', amount: 9500 },
          { type: 'EOBI', amount: 1000 },
          { type: 'Social Security', amount: 900 },
        ],
        grossSalary: 131000,
        netSalary: 119600,
        taxDeducted: 9500,
        eobi: 1000,
        socialSecurity: 900,
        providentFund: 0,
        workingDays: 22,
        presentDays: 21,
        overtimeHours: 12,
        overtimePay: 6000,
        loanDeduction: 0,
        advanceDeduction: 0,
        status: 'paid',
        generatedAt: '2024-01-31T00:00:00Z',
        paidAt: '2024-02-01T10:00:00Z',
      },
    ];
  }

  private initializeOrders() {
    this.orders = [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        customerId: '1',
        customerName: 'Textile Mills Ltd.',
        orderDate: '2023-12-15',
        deliveryDate: '2024-01-15',
        status: 'delivered',
        items: [
          {
            id: '1',
            productName: 'Software Development Package',
            description: 'Custom ERP solution development',
            quantity: 1,
            unitPrice: 150000,
            totalPrice: 150000,
            taxRate: 15,
            discountRate: 0,
          },
        ],
        subtotal: 150000,
        taxAmount: 22500,
        discountAmount: 0,
        shippingAmount: 0,
        totalAmount: 172500,
        paymentStatus: 'paid',
        paymentMethod: 'bank_transfer',
        shippingAddress: 'Industrial Area, Sector 15, Karachi',
        billingAddress: 'Industrial Area, Sector 15, Karachi',
        notes: 'Urgent delivery required',
        attachments: [],
        createdBy: '1',
        createdAt: '2023-12-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
      },
    ];
  }

  private initializePayments() {
    this.payments = [
      {
        id: '1',
        paymentNumber: 'PAY-2024-001',
        customerId: '1',
        customerName: 'Textile Mills Ltd.',
        invoiceId: '1',
        amount: 172500,
        paymentDate: '2024-01-15',
        paymentMethod: 'bank_transfer',
        reference: 'TXN-123456789',
        notes: 'Payment for INV-2024-001',
        status: 'cleared',
        bankDetails: {
          bankName: 'Habib Bank Limited',
          accountNumber: '12345678901234',
        },
        attachments: [],
        recordedBy: '1',
        createdAt: '2024-01-15T14:30:00Z',
      },
    ];
  }

  private initializeQuotations() {
    this.quotations = [
      {
        id: '1',
        quotationNumber: 'QUO-2024-001',
        customerId: '3',
        customerName: 'Steel Works Pvt Ltd.',
        quotationDate: '2024-01-10',
        validUntil: '2024-02-10',
        items: [
          {
            id: '1',
            description: 'Industrial Management System',
            quantity: 1,
            unitPrice: 500000,
            totalPrice: 500000,
            taxRate: 15,
          },
        ],
        subtotal: 500000,
        taxAmount: 75000,
        discountAmount: 25000,
        totalAmount: 550000,
        status: 'sent',
        notes: 'Comprehensive industrial management solution',
        termsAndConditions: 'Valid for 30 days from quotation date',
        createdBy: '1',
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z',
      },
    ];
  }

  private initializeLeaves() {
    this.leaves = [
      {
        id: '1',
        employeeId: '1',
        type: 'annual',
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        days: 5,
        reason: 'Family vacation',
        status: 'approved',
        appliedDate: '2024-01-15',
        approvedBy: '2',
        approvalDate: '2024-01-16',
        documents: [],
      },
      {
        id: '2',
        employeeId: '3',
        type: 'sick',
        startDate: '2024-01-20',
        endDate: '2024-01-22',
        days: 3,
        reason: 'Flu symptoms',
        status: 'pending',
        appliedDate: '2024-01-19',
        documents: ['medical_certificate.pdf'],
      },
    ];
  }

  private initializeAttendance() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Generate attendance for current month
    for (let day = 1; day <= today.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateStr = date.toISOString().split('T')[0];
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      this.employees.forEach((employee, index) => {
        const attendanceId = `${employee.id}-${dateStr}`;
        const isPresent = Math.random() > 0.1; // 90% attendance rate
        const isLate = isPresent && Math.random() > 0.8; // 20% late rate
        
        this.attendance.push({
          id: attendanceId,
          employeeId: employee.id,
          date: dateStr,
          checkIn: isPresent ? (isLate ? '09:15:00' : '09:00:00') : undefined,
          checkOut: isPresent ? '18:00:00' : undefined,
          status: !isPresent ? 'absent' : (isLate ? 'late' : 'present'),
          workingHours: isPresent ? 8 : 0,
          overtimeHours: isPresent && Math.random() > 0.7 ? 2 : 0,
          notes: !isPresent ? 'Unexcused absence' : '',
        });
      });
    }
  }

  // CRUD Operations for Users
  getUsers() {
    return this.users;
  }

  getUserById(id: string) {
    return this.users.find(user => user.id === id);
  }

  getUserByEmail(email: string) {
    return this.users.find(user => user.email === email);
  }

  createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    const user: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  }

  updateUser(id: string, userData: Partial<User>) {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = {
        ...this.users[index],
        ...userData,
        updatedAt: new Date().toISOString(),
      };
      return this.users[index];
    }
    return null;
  }

  deleteUser(id: string) {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      return this.users.splice(index, 1)[0];
    }
    return null;
  }

  // CRUD Operations for Employees
  getEmployees(filters?: any) {
    let result = [...this.employees];
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(emp => 
        emp.name.toLowerCase().includes(search) ||
        emp.employeeId.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search)
      );
    }
    
    if (filters?.department) {
      result = result.filter(emp => emp.department === filters.department);
    }
    
    if (filters?.status) {
      result = result.filter(emp => emp.status === filters.status);
    }
    
    return result;
  }

  getEmployeeById(id: string) {
    return this.employees.find(emp => emp.id === id);
  }

  createEmployee(employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) {
    const employee: Employee = {
      ...employeeData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.employees.push(employee);
    return employee;
  }

  updateEmployee(id: string, employeeData: Partial<Employee>) {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.employees[index] = {
        ...this.employees[index],
        ...employeeData,
        updatedAt: new Date().toISOString(),
      };
      return this.employees[index];
    }
    return null;
  }

  deleteEmployee(id: string) {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      return this.employees.splice(index, 1)[0];
    }
    return null;
  }

  // CRUD Operations for Customers
  getCustomers(filters?: any) {
    let result = [...this.customers];
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(customer => 
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.company.toLowerCase().includes(search)
      );
    }
    
    if (filters?.status) {
      result = result.filter(customer => customer.status === filters.status);
    }
    
    return result;
  }

  getCustomerById(id: string) {
    return this.customers.find(customer => customer.id === id);
  }

  createCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) {
    const customer: Customer = {
      ...customerData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.customers.push(customer);
    return customer;
  }

  updateCustomer(id: string, customerData: Partial<Customer>) {
    const index = this.customers.findIndex(customer => customer.id === id);
    if (index !== -1) {
      this.customers[index] = {
        ...this.customers[index],
        ...customerData,
        updatedAt: new Date().toISOString(),
      };
      return this.customers[index];
    }
    return null;
  }

  deleteCustomer(id: string) {
    const index = this.customers.findIndex(customer => customer.id === id);
    if (index !== -1) {
      return this.customers.splice(index, 1)[0];
    }
    return null;
  }

  // CRUD Operations for Invoices
  getInvoices(filters?: any) {
    let result = [...this.invoices];
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(search) ||
        invoice.customerName.toLowerCase().includes(search)
      );
    }
    
    if (filters?.status) {
      result = result.filter(invoice => invoice.status === filters.status);
    }
    
    return result;
  }

  getInvoiceById(id: string) {
    return this.invoices.find(invoice => invoice.id === id);
  }

  createInvoice(invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) {
    const invoice: Invoice = {
      ...invoiceData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.invoices.push(invoice);
    return invoice;
  }

  updateInvoice(id: string, invoiceData: Partial<Invoice>) {
    const index = this.invoices.findIndex(invoice => invoice.id === id);
    if (index !== -1) {
      this.invoices[index] = {
        ...this.invoices[index],
        ...invoiceData,
        updatedAt: new Date().toISOString(),
      };
      return this.invoices[index];
    }
    return null;
  }

  deleteInvoice(id: string) {
    const index = this.invoices.findIndex(invoice => invoice.id === id);
    if (index !== -1) {
      return this.invoices.splice(index, 1)[0];
    }
    return null;
  }

  // CRUD Operations for Transactions
  getTransactions(filters?: any) {
    let result = [...this.transactions];
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(transaction => 
        transaction.description.toLowerCase().includes(search) ||
        transaction.category.toLowerCase().includes(search)
      );
    }
    
    if (filters?.type) {
      result = result.filter(transaction => transaction.type === filters.type);
    }
    
    if (filters?.paymentMethod) {
      result = result.filter(transaction => transaction.paymentMethod === filters.paymentMethod);
    }
    
    return result;
  }

  getTransactionById(id: string) {
    return this.transactions.find(transaction => transaction.id === id);
  }

  createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
    const transaction: Transaction = {
      ...transactionData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.transactions.push(transaction);
    
    // Update account balance
    this.updateAccountBalance(transaction.accountId!, transaction.amount, transaction.type);
    
    return transaction;
  }

  updateTransaction(id: string, transactionData: Partial<Transaction>) {
    const index = this.transactions.findIndex(transaction => transaction.id === id);
    if (index !== -1) {
      const oldTransaction = this.transactions[index];
      
      // Reverse old transaction effect on account balance
      if (oldTransaction.accountId) {
        this.updateAccountBalance(
          oldTransaction.accountId,
          -oldTransaction.amount,
          oldTransaction.type
        );
      }
      
      this.transactions[index] = {
        ...this.transactions[index],
        ...transactionData,
        updatedAt: new Date().toISOString(),
      };
      
      // Apply new transaction effect on account balance
      const newTransaction = this.transactions[index];
      if (newTransaction.accountId) {
        this.updateAccountBalance(
          newTransaction.accountId,
          newTransaction.amount,
          newTransaction.type
        );
      }
      
      return this.transactions[index];
    }
    return null;
  }

  deleteTransaction(id: string) {
    const index = this.transactions.findIndex(transaction => transaction.id === id);
    if (index !== -1) {
      const transaction = this.transactions[index];
      
      // Reverse transaction effect on account balance
      if (transaction.accountId) {
        this.updateAccountBalance(
          transaction.accountId,
          -transaction.amount,
          transaction.type
        );
      }
      
      return this.transactions.splice(index, 1)[0];
    }
    return null;
  }

  // Account balance management
  private updateAccountBalance(accountId: string, amount: number, type: 'income' | 'expense') {
    const account = this.accounts.find(acc => acc.id === accountId);
    if (account) {
      if (type === 'income') {
        account.balance += amount;
      } else {
        account.balance -= amount;
      }
    }
  }

  // Get dashboard statistics
  getDashboardStats(): DashboardStats {
    const totalEmployees = this.employees.length;
    const activeEmployees = this.employees.filter(emp => emp.status === 'active').length;
    const totalCustomers = this.customers.length;
    const activeCustomers = this.customers.filter(cust => cust.status === 'active').length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyIncome = this.transactions
      .filter(t => t.type === 'income' && 
        new Date(t.date).getMonth() === currentMonth &&
        new Date(t.date).getFullYear() === currentYear)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = this.transactions
      .filter(t => t.type === 'expense' && 
        new Date(t.date).getMonth() === currentMonth &&
        new Date(t.date).getFullYear() === currentYear)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const pendingInvoices = this.invoices.filter(inv => 
      inv.status === 'sent' || inv.status === 'viewed').length;
    
    const overdueInvoices = this.invoices.filter(inv => 
      inv.status === 'overdue').length;
    
    const cashBalance = this.accounts
      .filter(acc => acc.type === 'cash')
      .reduce((sum, acc) => sum + acc.balance, 0);
    
    const bankBalance = this.accounts
      .filter(acc => acc.type === 'bank')
      .reduce((sum, acc) => sum + acc.balance, 0);
    
    const totalBalance = cashBalance + bankBalance;
    
    const pendingSalaries = this.salarySlips.filter(slip => 
      slip.status === 'generated').length;
    
    const pendingLeaves = this.leaves.filter(leave => 
      leave.status === 'pending').length;
    
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = this.attendance.filter(att => att.date === today);
    
    return {
      totalEmployees,
      activeEmployees,
      totalCustomers,
      activeCustomers,
      monthlyRevenue: monthlyIncome,
      monthlyExpenses,
      pendingInvoices,
      overdueInvoices,
      cashBalance,
      bankBalance,
      totalBalance,
      pendingSalaries,
      pendingLeaves,
      todayAttendance: {
        present: todayAttendance.filter(att => att.status === 'present').length,
        absent: todayAttendance.filter(att => att.status === 'absent').length,
        late: todayAttendance.filter(att => att.status === 'late').length,
      },
    };
  }

  // Get all data for specific entities
  getDirectors() { return this.directors; }
  getDailyEntries() { return this.dailyEntries; }
  getSalarySlips() { return this.salarySlips; }
  getOrders() { return this.orders; }
  getPayments() { return this.payments; }
  getQuotations() { return this.quotations; }
  getLeaves() { return this.leaves; }
  getAttendance() { return this.attendance; }
  getAccounts() { return this.accounts; }
}

// Export singleton instance
export const mockDB = new MockDatabase();
export default mockDB;
*/