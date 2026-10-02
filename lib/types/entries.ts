export interface DailyEntry {
  _id?: string;
  entryId: string;
  entryNumber?: string;
  userID?: string;
  contractorId?: string;
  customerId?: string;
  vendorId?: string;
  employeeId?: string;
  directorId?: string;
  entryDate: string;
  expenseCategory?: string;
  expenseType?: string;
  entryType: 'customer' | 'vendor' | 'expense';
  paymentType: 'credit' | 'debit';
  paymentMethod: 'cash' | 'bank';
  purpose: string;
  description: string;
  amount: number;
  currency?: string;
  destinationType: 'till' | 'director' | 'vendor';
  destinationDirectorId?: string;
  destinationVendorId?: string;
  entryClearStatus: 'pending' | 'cleared' | 'rejected';
  entryClearDate?: string | null;
  notes?: string;
  status: 'draft' | 'active' | 'inactive';
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDailyEntryPayload {
  entryDate: string;
  paymentType: 'credit' | 'debit';
  paymentMethod: 'cash' | 'bank';
  entryType: 'customer' | 'vendor' | 'expense';
  amount: number;
  currency?: string;
  purpose: string;
  customerId?: string;
  destinationType: 'till' | 'director' | 'vendor';
  entryClearStatus: 'pending' | 'cleared' | 'rejected';
  destinationDirectorId?: string;
  status: 'draft' | 'active' | 'inactive';
  contractorId?: string;
  vendorId?: string;
  employeeId?: string;
  directorId?: string;
  expenseCategory?: string;
  expenseType?: string;
  description: string;
  destinationVendorId?: string;
  notes?: string;
}

export interface UpdateDailyEntryPayload extends CreateDailyEntryPayload {
  entryId: string;
}

export interface DailyEntryResponse {
  status: {
    code: number;
    success: boolean;
  };
  response: {
    message: string;
    data: {
      entries: DailyEntry[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };
  };
}

export interface DailyEntryByIdResponse {
  status: {
    code: number;
    success: boolean;
  };
  response: {
    message: string;
    data: DailyEntry;
  };
}

export interface DailyEntryFormData {
  entryDate: string;
  paymentType: 'credit' | 'debit';
  paymentMethod: 'cash' | 'bank';
  entryType: 'customer' | 'vendor' | 'expense';
  amount: number;
  currency?: string;
  purpose: string;
  customerId?: string;
  destinationType: 'till' | 'director' | 'vendor';
  entryClearStatus: 'pending' | 'cleared' | 'rejected';
  destinationDirectorId?: string;
  status: 'draft' | 'active' | 'inactive';
  contractorId?: string;
  vendorId?: string;
  employeeId?: string;
  directorId?: string;
  expenseCategory?: string;
  expenseType?: string;
  description: string;
  destinationVendorId?: string;
  notes?: string;
}
