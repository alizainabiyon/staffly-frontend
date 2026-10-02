# Invoices Module Integration

This document describes the invoices module that follows the same structure as the quotations module, with proper types, validation, Redux store management, and React components.

## Structure Overview

The invoices module consists of the following components:

### 1. Types (`lib/types/finance.ts`)

```typescript
export interface InvoiceItem {
  _id?: string;
  description: string;
  size: number;
  quantity: number;
  unitPrice: number;
  fittingPrice: number;
  total: number;
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
  customerId: string | CustomerObject;
  invoiceNumber: string;
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
```

### 2. Validation Schema (`lib/validation/invoiceFormValidation.ts`)

Uses Yup for form validation with comprehensive rules for all invoice fields including:
- Required fields validation
- Numeric constraints
- Array validation for items
- File attachment validation

### 3. Redux Store (`lib/store/slices/invoiceSlice.ts`)

Manages invoice state with async thunks for:
- `fetchInvoices` - Get all invoices with filters
- `fetchInvoiceById` - Get single invoice
- `createInvoice` - Create new invoice
- `updateInvoice` - Update existing invoice
- `deleteInvoice` - Delete invoice
- `sendInvoice` - Send invoice to customer
- `markInvoicePaid` - Mark invoice as paid

### 4. Custom Hook (`hooks/useInvoiceForm.ts`)

Provides form management functionality:
- Formik integration
- File upload handling
- Item management (add/remove/update)
- Automatic total calculations
- Form submission handling

### 5. React Components

#### InvoiceForm
- Modal dialog for creating/editing invoices
- Comprehensive form with all invoice fields
- Item management interface
- File attachment handling
- Real-time calculations

#### InvoiceManagement
- Main invoice listing page
- Filtering and sorting capabilities
- CRUD operations
- Status management

#### InvoiceDetailPage
- Detailed invoice view
- Status timeline
- Financial summary
- Action buttons for various operations

## API Endpoints

The module uses the following API endpoints:

```typescript
INVOICES: {
  LIST: '/app/v1/invoice/get-all-invoices',
  CREATE: '/app/v1/invoice/create',
  GET: '/app/v1/invoice/get-invoice-by-id',
  UPDATE: '/app/v1/invoice/update',
  DELETE: '/app/v1/invoice/delete',
  SEND: '/app/v1/invoice/send',
  MARK_PAID: '/app/v1/invoice/mark-paid',
  PDF: '/app/v1/invoice/generate-pdf',
}
```

## Usage Examples

### Creating a New Invoice

```typescript
import { InvoiceForm } from '@/components/finance/InvoiceForm';

function CreateInvoicePage() {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (invoiceData) => {
    // Handle invoice creation
    console.log('New invoice:', invoiceData);
  };

  return (
    <InvoiceForm
      open={showForm}
      onOpenChange={setShowForm}
      onSubmit={handleSubmit}
    />
  );
}
```

### Managing Invoices

```typescript
import { InvoiceManagement } from '@/components/finance/InvoiceManagement';

function InvoicesPage() {
  return <InvoiceManagement />;
}
```

### Viewing Invoice Details

```typescript
import { InvoiceDetailPage } from '@/components/finance/InvoiceDetailPage';

function InvoiceDetailRoute({ params }) {
  return <InvoiceDetailPage invoiceId={params.id} />;
}
```

## Key Features

1. **Comprehensive Form Validation**: All fields are properly validated with user-friendly error messages
2. **Real-time Calculations**: Automatic calculation of item totals and invoice totals
3. **File Management**: Support for multiple file attachments with upload/delete functionality
4. **Status Management**: Full invoice lifecycle management from draft to paid
5. **Responsive Design**: Mobile-friendly interface with proper responsive layouts
6. **Type Safety**: Full TypeScript support with proper type definitions
7. **State Management**: Centralized state management with Redux Toolkit
8. **Error Handling**: Comprehensive error handling with user notifications

## Integration Points

The invoices module integrates with:

- **CRM Module**: Customer and contractor data
- **Finance Module**: Financial calculations and reporting
- **File Handler**: Document upload and management
- **Authentication**: User management and permissions
- **Notifications**: Toast notifications for user feedback

## Future Enhancements

1. **PDF Generation**: Integration with PDF generation service
2. **Email Integration**: Automated invoice sending via email
3. **Payment Gateway**: Integration with payment processing services
4. **Recurring Invoices**: Support for recurring invoice generation
5. **Advanced Reporting**: Enhanced financial reporting and analytics
6. **Multi-currency**: Support for multiple currencies
7. **Tax Calculations**: Automated tax calculations based on location

## Dependencies

- React 18+
- TypeScript
- Redux Toolkit
- Formik + Yup
- Tailwind CSS
- Lucide React Icons
- Sonner (toast notifications)

## File Structure

```
lib/
├── types/
│   └── finance.ts (invoice types)
├── validation/
│   └── invoiceFormValidation.ts
├── store/
│   └── slices/
│       └── invoiceSlice.ts
└── services/
    └── api.ts (invoice API endpoints)

hooks/
└── useInvoiceForm.ts

components/
└── finance/
    ├── InvoiceForm.tsx
    ├── InvoiceManagement.tsx
    └── InvoiceDetailPage.tsx
```

This module provides a complete, production-ready solution for invoice management that follows the established patterns in the codebase and integrates seamlessly with the existing architecture.
