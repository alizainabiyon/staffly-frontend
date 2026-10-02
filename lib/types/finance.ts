export type QuotationItemType = 'length_width' | 'total_size' | 'quantity_only' | 'fixed_amount';

export interface QuotationItem {
  _id?: string;
  description: string;
  type: QuotationItemType;
  // Common fields
  unitPrice: number;
  total: number;
  // Conditional fields based on type
  length?: number;        // For length_width type
  width?: number;         // For length_width type
  quantity?: number;      // For length_width and quantity_only types
  totalSize?: number;     // For total_size type
  fixedAmount?: number;   // For fixed_amount type
}

export interface QuotationAttachment {
  _id?: string;
  name: string;
  file: string;
  type: string;
}

export interface Quotation {
  _id?: string;
  quotationId: string;
  userID: string;
  contractorId: string;
  customerId: string | {
    _id: string;
    customerId: string;
    name: string;
    company: string;
    email: string;
    phone: string;
  };
  quotationNumber: string;
  description: string;
  items: QuotationItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  terms?: string;
  notes?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
  attachments: QuotationAttachment[];
  sentAt?: string | null;
  acceptedAt?: string | null;
  rejectedAt?: string | null;
  convertedToInvoice: boolean;
  invoiceId?: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationFormData {
  contractorId: string;
  customerId: string;
  description: string;
  items: QuotationItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  terms?: string;
  notes?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
  attachments: QuotationAttachment[];
}

export interface QuotationFilters {
  status?: string;
  customerId?: string;
  contractorId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface QuotationPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface QuotationListResponse {
  quotations: Quotation[];
  pagination: QuotationPagination;
}

export interface InvoiceItem {
  _id?: string;
  description: string;
  type: QuotationItemType;
  // Common fields
  unitPrice: number;
  total: number;
  // Conditional fields based on type
  length?: number;        // For length_width type
  width?: number;         // For length_width type
  totalSize?: number;      // For length_width type - manually entered size in sq.ft
  quantity?: number;      // For length_width and quantity_only types
  fixedAmount?: number;   // For fixed_amount type
}

export interface InvoiceAttachment {
  _id?: string;
  name: string;
  file: string;
  type: string;
}

export interface Invoice {
  _id?: string;
  invoiceId: string;
  userID: string;
  contractorId: string;
  customerId: string | {
    _id: string;
    customerId: string;
    name: string;
    company: string;
    email: string;
    phone: string;
  };
  invoiceNumber: string;
  description: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  advanceAmount?: number;
  previousRemainingAmount?: number;
  currency?: string;
  terms?: string;
  notes?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'paid' | 'overdue' | 'cancelled';
  attachments: InvoiceAttachment[];
  sentAt?: string | null;
  acceptedAt?: string | null;
  rejectedAt?: string | null;
  paidAt?: string | null;
  dueDate?: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceFormData {
  contractorId: string;
  customerId: string;
  description: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  advanceAmount?: number;
  currency: string;
  terms?: string;
  notes?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'paid' | 'overdue' | 'cancelled';
  attachments: InvoiceAttachment[];
  dueDate?: string;
}

export interface InvoiceFilters {
  status?: string;
  customerId?: string;
  contractorId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface InvoicePagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  pagination: InvoicePagination;
}

// Vendor Order Types
export interface VendorOrderItem {
  _id?: string;
  description: string;
  width: number;
  height: number;
  size: number;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface VendorOrder {
  _id?: string;
  orderId: string;
  orderNumber: string;
  userID: string;
  vendorId: string | {
    _id: string;
    vendorId: string;
    name: string;
    companyName: string;
    email: string;
    phone: string;
    address: string;
  };
  invoiceId?: string | {
    _id: string;
    invoiceId: string;
    userID: string;
    contractorId: string;
    customerId: string;
    invoiceNumber: string;
    description: string;
    items: InvoiceItem[];
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
    attachments: InvoiceAttachment[];
    sentAt: string | null;
    acceptedAt: string | null;
    rejectedAt: string | null;
    paidAt: string | null;
    dueDate: string | null;
    convertedToInvoice: boolean;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  description: string;
  items: VendorOrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  previousRemainingAmount: number;
  terms?: string;
  notes?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  approvedAt?: string | null;
  rejectedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  createdBy: string;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VendorOrderFormData {
  vendorId: string;
  description: string;
  items: VendorOrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  terms?: string;
  notes?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
}

export interface VendorOrderFilters {
  status?: string;
  vendorId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface VendorOrderPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface VendorOrderListResponse {
  vendorOrders: VendorOrder[];
  pagination: VendorOrderPagination;
}
