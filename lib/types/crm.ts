// CRM Types for Staffly SaaS Application

export interface Contractor {
  _id: string;
  contractorId: string;
  name: string;
  companyName: string;
  type: 'individual' | 'company';
  category: string;
  email: string;
  phone: string;
  alternatePhone: string;
  website: string;
  address: string;
  city: string;
  country: string;
  industry: string;
  specializations: string[];
  createdBy: string;
  updatedBy?: string;
  userID: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  _id: string;
  vendorId: string;
  name: string;
  companyName: string;
  type: 'individual' | 'company';
  category: string;
  email: string;
  phone: string;
  alternatePhone: string;
  website: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  status: 'active' | 'inactive';
  createdBy: string;
  updatedBy?: string;
  userID: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  _id?: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  otherContactNo?: string;
  company: string;
  address: string;
  city: string;
  country: string;
  taxNumber?: string;
  status: 'active' | 'inactive' | 'blocked';
  customerType: 'individual' | 'business';
  contactPerson?: string;
  website?: string;
  officeAddress?: string;
  notes?: string;
  tags: string[];
  contractorId?: string;
  createdBy?: string;
  updatedBy?: string;
  userID?: string;
  createdAt: string;
  updatedAt: string;
  ledger?: CustomerLedger;
  invoices?: CustomerInvoice[];
}

// CRM State Interfaces
export interface ContractorState {
  contractors: Contractor[];
  selectedContractor: Contractor | null;
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface VendorState {
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter Options
export interface FilterOptions {
  search?: string;
  status?: string;
  type?: string;
  customerType?: string;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  department?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Form Data Types
export interface ContractorFormData {
  name: string;
  companyName: string;
  type: 'individual' | 'company';
  category: string;
  email: string;
  phone: string;
  alternatePhone: string;
  website: string;
  address: string;
  city: string;
  country: string;
  industry: string;
  specializations: string[];
}

export interface VendorFormData {
  name: string;
  companyName: string;
  type: 'individual' | 'company';
  category: string;
  email: string;
  phone: string;
  alternatePhone: string;
  website: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  status: 'active' | 'inactive';
}

export interface CustomerLedger {
  _id: string;
  ledgerId: string;
  userID: string;
  ledgerType: string;
  customerId: string;
  vendorId?: string;
  directorId?: string;
  calculation: CustomerLedgerCalculation;
  transactions: CustomerLedgerTransaction[];
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerLedgerCalculation {
  openingBalance: number;
  closingBalance: number;
  totalCash: number;
  totalBank: number;
  _id: string;
}

export interface CustomerLedgerTransaction {
  transactionId: string;
  amount: number;
  currency: string;
  openingBalance: number;
  closingBalance: number;
  transactionDate: string;
  paymentType: string;
  paymentMethod: string;
  senderType: string;
  receiverType: string;
  purpose: string;
  description: string;
  _id: string;
}

export interface CustomerInvoice {
  _id: string;
  invoiceId: string;
  userID: string;
  contractorId?: string;
  customerId: {
    _id: string;
    customerId: string;
    name: string;
    company: string;
    email: string;
    phone: string;
  };
  invoiceNumber: string;
  description: string;
  items: CustomerInvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  previousRemainingAmount: number;
  advanceAmount: number;
  currency: string;
  terms: string;
  notes: string;
  status: string;
  attachments: CustomerInvoiceAttachment[];
  sentAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  convertedToInvoice: boolean;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInvoiceItem {
  description: string;
  size: number;
  quantity: number;
  unitPrice: number;
  fittingPrice: number;
  total: number;
  _id: string;
}

export interface CustomerInvoiceAttachment {
  name: string;
  file: string;
  type: string;
  _id: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  otherContactNo?: string;
  company: string;
  address: string;
  city: string;
  country: string;
  taxNumber?: string;
  status: 'active' | 'inactive' | 'blocked';
  customerType: 'individual' | 'business';
  contactPerson?: string;
  website?: string;
  officeAddress?: string;
  notes?: string;
  tags: string[];
  contractorId?: string;
}
