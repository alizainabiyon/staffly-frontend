import { TableColumn, TableFilter, TableAction } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { formatCurrency, formatDate } from './helpers';
import React from 'react';

// Common action types for reuse
export const createViewAction = <T>(
  onClick: (item: T) => void,
  label: string = 'View'
): TableAction<T> => ({
  label,
  icon: React.createElement(Eye, { className: "h-4 w-4" }),
  onClick,
  variant: 'ghost'
});

export const createEditAction = <T>(
  onClick: (item: T) => void,
  label: string = 'Edit'
): TableAction<T> => ({
  label,
  icon: React.createElement(Edit, { className: "h-4 w-4" }),
  onClick,
  variant: 'ghost'
});

export const createDeleteAction = <T>(
  onClick: (item: T) => void,
  label: string = 'Delete'
): TableAction<T> => ({
  label,
  icon: React.createElement(Trash2, { className: "h-4 w-4" }),
  onClick,
  variant: 'ghost'
});

export const createCustomAction = <T>(
  onClick: (item: T) => void,
  icon: React.ReactNode,
  label: string,
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' = 'ghost'
): TableAction<T> => ({
  label,
  icon,
  onClick,
  variant
});

// Common column types for reuse
export const createTextColumn = <T>(
  key: string,
  header: string,
  accessor: (item: T) => string | number,
  options: {
    sortable?: boolean;
    width?: string;
    className?: string;
    exportable?: boolean;
  } = {}
): TableColumn<T> => ({
  key,
  header,
  accessor: (item: T) => accessor(item),
  sortable: options.sortable ?? true,
  width: options.width,
  className: options.className,
  exportable: options.exportable ?? true
});

export const createBadgeColumn = <T>(
  key: string,
  header: string,
  accessor: (item: T) => string,
  options: {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    sortable?: boolean;
    width?: string;
    className?: string;
    exportable?: boolean;
  } = {}
): TableColumn<T> => ({
  key,
  header,
  accessor: (item: T) => React.createElement(Badge, { 
    variant: options.variant || 'outline' 
  }, accessor(item)),
  sortable: options.sortable ?? true,
  width: options.width,
  className: options.className,
  exportable: options.exportable ?? true
});

export const createCurrencyColumn = <T>(
  key: string,
  header: string,
  accessor: (item: T) => number,
  options: {
    sortable?: boolean;
    width?: string;
    className?: string;
    exportable?: boolean;
  } = {}
): TableColumn<T> => ({
  key,
  header,
  accessor: (item: T) => formatCurrency(accessor(item)),
  sortable: options.sortable ?? true,
  width: options.width,
  className: options.className,
  exportable: options.exportable ?? true
});

export const createDateColumn = <T>(
  key: string,
  header: string,
  accessor: (item: T) => string | Date,
  options: {
    sortable?: boolean;
    width?: string;
    className?: string;
    exportable?: boolean;
  } = {}
): TableColumn<T> => ({
  key,
  header,
  accessor: (item: T) => formatDate(accessor(item)),
  sortable: options.sortable ?? true,
  width: options.width,
  className: options.className,
  exportable: options.exportable ?? true
});

export const createActionsColumn = <T>(
  actions: TableAction<T>[],
  options: {
    width?: string;
    className?: string;
    exportable?: boolean;
  } = {}
): TableColumn<T> => ({
  key: 'actions',
  header: 'Actions',
  accessor: (item: T) => React.createElement('div', { 
    className: "flex items-center gap-1" 
  }, 
    actions.map((action, index) => 
      React.createElement(Button, {
        key: index,
        variant: action.variant || 'ghost',
        size: "sm",
        onClick: () => action.onClick(item),
        disabled: action.disabled?.(item),
        className: "h-8 w-8 p-0",
        title: action.label
      }, action.icon || React.createElement(MoreHorizontal, { className: "h-4 w-4" }))
    )
  ),
  sortable: false,
  width: options.width || 'w-32',
  className: options.className,
  exportable: options.exportable ?? false
});

// Common filter types
export const createSelectFilter = (
  key: string,
  label: string,
  options: { label: string; value: string }[]
): TableFilter => ({
  key,
  label,
  type: 'select',
  options
});

export const createTextFilter = (
  key: string,
  label: string,
  placeholder?: string
): TableFilter => ({
  key,
  label,
  type: 'input',
  placeholder
});

// Helper function to create a complete DataTable configuration
export const createDataTableConfig = <T>(
  columns: TableColumn<T>[],
  actions: TableAction<T>[] = [],
  options: {
    title?: string;
    subtitle?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    filters?: TableFilter[];
    pagination?: {
      enabled: boolean;
      pageSize?: number;
      pageSizeOptions?: number[];
    };
    sortable?: boolean;
    exportOptions?: {
      enablePrint?: boolean;
      enablePDF?: boolean;
      enableCSV?: boolean;
      filename?: string;
    };
  } = {}
) => {
  // Add actions column if actions are provided
  const finalColumns = actions.length > 0 
    ? [...columns, createActionsColumn(actions)]
    : columns;

  return {
    columns: finalColumns,
    title: options.title,
    subtitle: options.subtitle,
    searchable: options.searchable ?? true,
    searchPlaceholder: options.searchPlaceholder ?? 'Search...',
    filters: options.filters ?? [],
    pagination: options.pagination ?? { enabled: true, pageSize: 20, pageSizeOptions: [10, 20, 50, 100] },
    sortable: options.sortable ?? true,
    exportOptions: options.exportOptions ?? {
      enablePrint: true,
      enablePDF: true,
      enableCSV: true,
      filename: 'data-export'
    }
  };
};
