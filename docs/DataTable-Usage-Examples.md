# DataTable Component Usage Guide

The DataTable component is a powerful, reusable table component that provides sorting, pagination, searching, filtering, and export functionality. It's designed to work seamlessly with your application's theme and can be used across all modules.

## Features

- ✅ **Sorting**: Click column headers to sort data
- ✅ **Pagination**: Built-in pagination with customizable page sizes
- ✅ **Searching**: Global search across all columns
- ✅ **Filtering**: Custom filters for specific columns
- ✅ **Print**: Print table data in a formatted layout
- ✅ **PDF Export**: Export table data to PDF with proper formatting
- ✅ **CSV Export**: Export table data to CSV format
- ✅ **Responsive**: Mobile-friendly design
- ✅ **Theme Consistent**: Matches your application's design system

## Basic Usage

```tsx
import { DataTable } from '@/components/ui/data-table';
import { 
  createTextColumn, 
  createBadgeColumn, 
  createCurrencyColumn,
  createDataTableConfig 
} from '@/lib/utils/dataTableUtils';

// Define your data
const data = [
  { id: 1, name: 'John Doe', status: 'active', salary: 50000 },
  { id: 2, name: 'Jane Smith', status: 'inactive', salary: 60000 },
];

// Define columns
const columns = [
  createTextColumn('name', 'Name', (item) => item.name),
  createBadgeColumn('status', 'Status', (item) => item.status),
  createCurrencyColumn('salary', 'Salary', (item) => item.salary),
];

// Create table configuration
const tableConfig = createDataTableConfig(columns, [], {
  title: 'Employee List',
  subtitle: 'All employees in the system',
  exportOptions: {
    filename: 'employees'
  }
});

// Use in component
function MyComponent() {
  return (
    <DataTable
      data={data}
      {...tableConfig}
      loading={false}
    />
  );
}
```

## Column Types

### Text Column
```tsx
createTextColumn('name', 'Name', (item) => item.name, {
  sortable: true,
  width: 'w-48',
  exportable: true
})
```

### Badge Column
```tsx
createBadgeColumn('status', 'Status', (item) => item.status, {
  variant: 'outline', // 'default' | 'secondary' | 'destructive' | 'outline'
  width: 'w-32'
})
```

### Currency Column
```tsx
createCurrencyColumn('salary', 'Salary', (item) => item.salary, {
  width: 'w-32'
})
```

### Date Column
```tsx
createDateColumn('joinDate', 'Join Date', (item) => item.joinDate, {
  width: 'w-32'
})
```

### Custom Column
```tsx
{
  key: 'avatar',
  header: 'Avatar',
  accessor: (item) => (
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
      <span className="text-sm font-medium text-primary">
        {item.name.charAt(0).toUpperCase()}
      </span>
    </div>
  ),
  sortable: false,
  exportable: false,
  width: 'w-16'
}
```

## Actions

### View Action
```tsx
import { createViewAction } from '@/lib/utils/dataTableUtils';

const actions = [
  createViewAction((item) => handleView(item.id), 'View Details')
];
```

### Edit Action
```tsx
import { createEditAction } from '@/lib/utils/dataTableUtils';

const actions = [
  createEditAction((item) => handleEdit(item), 'Edit')
];
```

### Delete Action
```tsx
import { createDeleteAction } from '@/lib/utils/dataTableUtils';

const actions = [
  createDeleteAction((item) => handleDelete(item.id), 'Delete')
];
```

### Custom Action
```tsx
import { createCustomAction } from '@/lib/utils/dataTableUtils';
import { Download } from 'lucide-react';

const actions = [
  createCustomAction(
    (item) => handleDownload(item),
    <Download className="h-4 w-4" />,
    'Download',
    'outline'
  )
];
```

## Filters

### Select Filter
```tsx
import { createSelectFilter } from '@/lib/utils/dataTableUtils';

const filters = [
  createSelectFilter('department', 'Department', [
    { label: 'All Departments', value: 'all' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Sales', value: 'sales' }
  ])
];
```

### Text Filter
```tsx
import { createTextFilter } from '@/lib/utils/dataTableUtils';

const filters = [
  createTextFilter('search', 'Search', 'Search by name...')
];
```

## Complete Example - Customer Management

```tsx
import { DataTable } from '@/components/ui/data-table';
import { 
  createTextColumn, 
  createBadgeColumn, 
  createCurrencyColumn,
  createDateColumn,
  createViewAction,
  createEditAction,
  createDeleteAction,
  createSelectFilter,
  createDataTableConfig 
} from '@/lib/utils/dataTableUtils';

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Define columns
  const columns = [
    createTextColumn<Customer>('name', 'Customer Name', (customer) => customer.name, { width: 'w-48' }),
    createTextColumn<Customer>('email', 'Email', (customer) => customer.email, { width: 'w-64' }),
    createTextColumn<Customer>('phone', 'Phone', (customer) => customer.phone, { width: 'w-32' }),
    createBadgeColumn<Customer>('status', 'Status', (customer) => customer.status, { 
      variant: customer.status === 'active' ? 'default' : 'secondary',
      width: 'w-24'
    }),
    createCurrencyColumn<Customer>('totalSpent', 'Total Spent', (customer) => customer.totalSpent, { width: 'w-32' }),
    createDateColumn<Customer>('joinDate', 'Join Date', (customer) => customer.joinDate, { width: 'w-32' }),
  ];

  // Define actions
  const actions = [
    createViewAction<Customer>((customer) => handleViewCustomer(customer.id), 'View Details'),
    createEditAction<Customer>((customer) => handleEditCustomer(customer), 'Edit Customer'),
    createDeleteAction<Customer>((customer) => handleDeleteCustomer(customer.id), 'Delete Customer'),
  ];

  // Define filters
  const filters = [
    createSelectFilter('status', 'Status', [
      { label: 'All Status', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ]),
    createSelectFilter('type', 'Customer Type', [
      { label: 'All Types', value: 'all' },
      { label: 'Individual', value: 'individual' },
      { label: 'Business', value: 'business' }
    ])
  ];

  // Create table configuration
  const tableConfig = createDataTableConfig(columns, actions, {
    title: 'Customer Management',
    subtitle: 'Manage customer information and relationships',
    searchable: true,
    searchPlaceholder: 'Search customers...',
    filters: filters,
    pagination: {
      enabled: true,
      pageSize: 25,
      pageSizeOptions: [10, 25, 50, 100]
    },
    sortable: true,
    exportOptions: {
      enablePrint: true,
      enablePDF: true,
      enableCSV: true,
      filename: 'customers-export'
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customer Management</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <DataTable
        data={customers}
        {...tableConfig}
        loading={loading}
        emptyMessage="No customers found. Add your first customer to get started."
      />
    </div>
  );
}
```

## Export Options

The DataTable supports three export formats:

### Print
- Opens a new window with formatted table
- Includes print-specific CSS
- Shows print and close buttons

### PDF Export
- Uses jsPDF with autoTable plugin
- Professional table formatting
- Includes title and subtitle
- Customizable styling

### CSV Export
- Standard CSV format
- Properly escapes commas and quotes
- Downloads as .csv file

## Customization

### Export Options
```tsx
exportOptions: {
  enablePrint: true,    // Enable/disable print
  enablePDF: true,      // Enable/disable PDF export
  enableCSV: true,      // Enable/disable CSV export
  filename: 'my-data'   // Custom filename for exports
}
```

### Pagination Options
```tsx
pagination: {
  enabled: true,                    // Enable/disable pagination
  pageSize: 25,                     // Default page size
  pageSizeOptions: [10, 25, 50, 100] // Available page size options
}
```

### Column Options
```tsx
{
  key: 'name',
  header: 'Name',
  accessor: (item) => item.name,
  sortable: true,        // Enable/disable sorting
  width: 'w-48',         // Tailwind width class
  className: 'font-bold', // Custom CSS classes
  exportable: true       // Include in exports
}
```

## Best Practices

1. **Use utility functions**: Always use the helper functions from `dataTableUtils.ts` for consistency
2. **Type your data**: Provide proper TypeScript types for better type safety
3. **Optimize exports**: Set `exportable: false` for columns that shouldn't be exported (like actions)
4. **Consistent naming**: Use descriptive column keys and headers
5. **Responsive design**: Use appropriate width classes for different screen sizes
6. **Performance**: For large datasets, consider server-side pagination and filtering

## Troubleshooting

### Common Issues

1. **Type errors**: Make sure to provide proper generic types to utility functions
2. **Export issues**: Check that `jspdf-autotable` is properly installed
3. **Styling conflicts**: Ensure your Tailwind classes don't conflict with the component's default styles
4. **Performance**: For very large datasets, consider implementing virtual scrolling

### Debug Tips

- Check the browser console for any JavaScript errors
- Verify that all required dependencies are installed
- Test export functionality in different browsers
- Ensure your data structure matches the column definitions
