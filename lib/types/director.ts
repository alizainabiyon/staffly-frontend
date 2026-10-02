export interface Director {
  _id?: string;
  directorId: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  status: 'active' | 'inactive';
  userID: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  ledger?: DirectorLedger;
  expense?: DirectorExpense[];
}
export interface DirectorExpense {
  _id: string;
  expenseId: string;
  directorId: string;
  amount: number;
  expenseDate: string;
  paymentType: string;
  catagory: string;
  type: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
export interface DirectorLedger {
  _id: string;
  ledgerId: string;
  userID: string;
  ledgerType: string;
  customerId?: string;
  vendorId?: string;
  directorId: string;
  calculation: LedgerCalculation;
  transactions: LedgerTransaction[];
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LedgerCalculation {
  openingBalance: number;
  closingBalance: number;
  totalCash: number;
  totalBank: number;
  _id: string;
}

export interface LedgerTransaction {
  transactionId: string;
  amount: number;
  currency: string;
  openingBalance: number;
  closingBalance: number;
  transactionDate: string;
  paymentType: 'credit' | 'debit';
  paymentMethod: 'cash' | 'bank';
  senderType: string;
  receiverType: string;
  purpose: string;
  description: string;
  _id: string;
}

export interface DirectorFormData {
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  status: 'active' | 'inactive';
}

export interface DirectorFilters {
  name?: string;
  email?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface DirectorPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface DirectorListResponse {
  directors: Director[];
  pagination: DirectorPagination;
}

