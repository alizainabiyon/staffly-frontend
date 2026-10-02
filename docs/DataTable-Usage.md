# DataTable Component Usage Guide

The `DataTable` component is a reusable, feature-rich table component that can be used throughout your application for displaying tabular data with advanced functionality.

## Features

- ✅ **Searchable**: Built-in search functionality
- ✅ **Sortable**: Column-based sorting
- ✅ **Filterable**: Configurable filters
- ✅ **Pagination**: Built-in pagination with customizable page sizes
- ✅ **Actions**: Row-level action buttons
- ✅ **Export**: Export functionality
- ✅ **Responsive**: Mobile-friendly design
- ✅ **Customizable**: Flexible column definitions
- ✅ **TypeScript**: Full TypeScript support

## Basic Usage

```tsx
import { DataTable, TableColumn } from '@/components/ui/data-table';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const columns: TableColumn<User>[] = [
  {
    key: 'name',
    header: 'Name',
    accessor: (user) => user.name,
    sortable: true,
  },
  {
    key: 'email',
    header: 'Email',
    accessor: (user) => user.email,
    sortable: true,
  },
  {
    key: 'role',
    header: 'Role',
    accessor: (user) => user.role,
  },
];

const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
];

function UserTable() {
  return (
    <DataTable
      data={users}
      columns={columns}
      title="Users"
      searchable={true}
      pagination={{ enabled: true, pageSize: 10 }}
    />
  );
}
```

## Column Configuration

### Basic Column
```tsx
{
  key: 'name',
  header: 'Name',
  accessor: (item) => item.name,
}
```

### Sortable Column
```tsx
{
  key: 'name',
  header: 'Name',
  accessor: (item) => item.name,
  sortable: true,
}
```

### Custom Cell Rendering
```tsx
{
  key: 'status',
  header: 'Status',
  accessor: (item) => (
    <Badge className={item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
      {item.status}
    </Badge>
  ),
  sortable: true,
}
```

### Column with Custom Width
```tsx
{
  key: 'description',
  header: 'Description',
  accessor: (item) => item.description,
  width: '300px',
  className: 'max-w-xs',
}
```

## Actions Configuration

Define row-level actions that appear as buttons in each row:

```tsx
import { TableAction } from '@/components/ui/data-table';
import { Edit, Trash2, Eye } from 'lucide-react';

const actions: TableAction<User>[] = [
  {
    label: 'View',
    icon: <Eye className="h-4 w-4" />,
    onClick: (user) => console.log('View user:', user),
    variant: 'ghost',
  },
  {
    label: 'Edit',
    icon: <Edit className="h-4 w-4" />,
    onClick: (user) => console.log('Edit user:', user),
    variant: 'ghost',
  },
  {
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (user) => console.log('Delete user:', user),
    variant: 'ghost',
    disabled: (user) => user.role === 'Admin', // Conditional disabling
  },
];
```

## Filters Configuration

Add filters to help users narrow down the data:

```tsx
const filters = [
  {
    key: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { label: 'All Roles', value: 'all' },
      { label: 'Admin', value: 'Admin' },
      { label: 'User', value: 'User' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'All Status', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
];
```

## Complete Example

```tsx
'use client';

import { DataTable, TableColumn, TableAction } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Download } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  salary: number;
  status: 'active' | 'inactive';
  joinDate: string;
}

const employees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@company.com',
    department: 'Engineering',
    salary: 75000,
    status: 'active',
    joinDate: '2023-01-15',
  },
  // ... more employees
];

const columns: TableColumn<Employee>[] = [
  {
    key: 'name',
    header: 'Name',
    accessor: (employee) => (
      <div>
        <p className="font-medium">{employee.name}</p>
        <p className="text-sm text-muted-foreground">{employee.email}</p>
      </div>
    ),
    sortable: true,
  },
  {
    key: 'department',
    header: 'Department',
    accessor: (employee) => (
      <Badge variant="outline">{employee.department}</Badge>
    ),
    sortable: true,
  },
  {
    key: 'salary',
    header: 'Salary',
    accessor: (employee) => (
      <span className="font-medium">${employee.salary.toLocaleString()}</span>
    ),
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    accessor: (employee) => (
      <Badge className={employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {employee.status}
      </Badge>
    ),
    sortable: true,
  },
  {
    key: 'joinDate',
    header: 'Join Date',
    accessor: (employee) => new Date(employee.joinDate).toLocaleDateString(),
    sortable: true,
  },
];

const actions: TableAction<Employee>[] = [
  {
    label: 'View',
    icon: <Eye className="h-4 w-4" />,
    onClick: (employee) => console.log('View employee:', employee),
    variant: 'ghost',
  },
  {
    label: 'Edit',
    icon: <Edit className="h-4 w-4" />,
    onClick: (employee) => console.log('Edit employee:', employee),
    variant: 'ghost',
  },
  {
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (employee) => console.log('Delete employee:', employee),
    variant: 'ghost',
  },
];

const filters = [
  {
    key: 'department',
    label: 'Department',
    type: 'select',
    options: [
      { label: 'All Departments', value: 'all' },
      { label: 'Engineering', value: 'Engineering' },
      { label: 'Marketing', value: 'Marketing' },
      { label: 'Sales', value: 'Sales' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'All Status', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
];

export function EmployeeTable() {
  const handleExport = () => {
    console.log('Exporting employee data...');
    // Implement your export logic here
  };

  return (
    <DataTable
      data={employees}
      columns={columns}
      title="Employee Management"
      subtitle="Manage company employees and their information"
      searchable={true}
      searchPlaceholder="Search employees by name or email..."
      filters={filters}
      actions={actions}
      pagination={{ 
        enabled: true, 
        pageSize: 20, 
        pageSizeOptions: [10, 20, 50, 100] 
      }}
      sortable={true}
      onExport={handleExport}
      emptyMessage="No employees found"
    />
  );
}
```

## Props Reference

### DataTableProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | - | Array of data items to display |
| `columns` | `TableColumn<T>[]` | - | Column definitions |
| `title` | `string` | - | Table title |
| `subtitle` | `string` | - | Table subtitle |
| `searchable` | `boolean` | `true` | Enable search functionality |
| `searchPlaceholder` | `string` | `"Search..."` | Search input placeholder |
| `filters` | `TableFilter[]` | `[]` | Filter definitions |
| `actions` | `TableAction<T>[]` | `[]` | Row action definitions |
| `pagination` | `PaginationConfig` | `{ enabled: true, pageSize: 20 }` | Pagination configuration |
| `sortable` | `boolean` | `false` | Enable column sorting |
| `onSort` | `(key: string, direction: 'asc' \| 'desc') => void` | - | Sort callback |
| `onExport` | `() => void` | - | Export callback |
| `emptyMessage` | `string` | `"No data available"` | Message when no data |
| `loading` | `boolean` | `false` | Show loading state |
| `className` | `string` | - | Additional CSS classes |

### TableColumn

| Prop | Type | Description |
|------|------|-------------|
| `key` | `string` | Unique identifier for the column |
| `header` | `string` | Column header text |
| `accessor` | `(item: T) => React.ReactNode` | Function to render cell content |
| `sortable` | `boolean` | Enable sorting for this column |
| `width` | `string` | Column width (e.g., "200px") |
| `className` | `string` | Additional CSS classes for the column |

### TableAction

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Action label (for accessibility) |
| `icon` | `React.ReactNode` | Action icon |
| `onClick` | `(item: T) => void` | Click handler |
| `variant` | `ButtonVariant` | Button variant |
| `disabled` | `(item: T) => boolean` | Function to determine if action is disabled |

### TableFilter

| Prop | Type | Description |
|------|------|-------------|
| `key` | `string` | Unique identifier for the filter |
| `label` | `string` | Filter label |
| `type` | `'select' \| 'input' \| 'date'` | Filter type |
| `options` | `{ label: string; value: string }[]` | Options for select filters |
| `placeholder` | `string` | Placeholder text |

## Best Practices

1. **Use TypeScript**: Always define proper types for your data and columns
2. **Keep accessors simple**: Complex logic should be extracted to helper functions
3. **Use meaningful keys**: Column keys should be descriptive and unique
4. **Handle empty states**: Provide meaningful empty messages
5. **Optimize performance**: Use `useMemo` for expensive computations
6. **Accessibility**: Ensure proper ARIA labels and keyboard navigation
7. **Responsive design**: Test on different screen sizes
8. **Error handling**: Handle loading and error states appropriately

## Customization

The DataTable component is built on top of shadcn/ui components, so you can customize its appearance by:

1. Modifying the underlying UI components
2. Using CSS classes through the `className` prop
3. Creating custom cell renderers
4. Extending the component with additional features

## Migration from Hardcoded Tables

To migrate from hardcoded tables to the DataTable component:

1. Extract your table structure into column definitions
2. Define your data type interface
3. Create action handlers for row operations
4. Configure filters and pagination as needed
5. Replace the hardcoded table with the DataTable component

This approach provides better maintainability, reusability, and consistency across your application. 