// CRM Utilities for Staffly SaaS Application

import { FilterOptions } from '@/lib/types/crm';

// Common filter handling functions
export const handleSearchFilter = (searchTerm: string, setFilters: (filters: Partial<FilterOptions>) => void) => {
  setFilters({ search: searchTerm, page: 1 });
};

export const handleStatusFilter = (status: string, setFilters: (filters: Partial<FilterOptions>) => void) => {
  const filterValue = status === 'all' ? '' : status;
  setFilters({ status: filterValue, page: 1 });
};

export const handleTypeFilter = (type: string, setFilters: (filters: Partial<FilterOptions>) => void) => {
  const filterValue = type === 'all' ? '' : type;
  setFilters({ type: filterValue, page: 1 });
};

export const handleCustomerTypeFilter = (customerType: string, setFilters: (filters: Partial<FilterOptions>) => void) => {
  setFilters({ customerType, page: 1 });
};

export const handlePageChange = (page: number, setFilters: (filters: Partial<FilterOptions>) => void) => {
  setFilters({ page });
};

// Common form handling functions
export const handleFormClose = (
  setIsFormOpen: (open: boolean) => void,
  setEditingId: (id: string | null) => void
) => {
  setIsFormOpen(false);
  setEditingId(null);
};

// Common error handling
export const handleApiError = (error: any, toast: any, defaultMessage: string) => {
  const message = error?.message || defaultMessage;
  toast.error(message);
};

// Common success handling
export const handleApiSuccess = (result: any, toast: any, defaultMessage: string) => {
  const message = result && typeof result === 'object' && 'message' in result 
    ? result.message 
    : defaultMessage;
  toast.success(message);
};

// Common delete confirmation
export const confirmDelete = (entityName: string): boolean => {
  return window.confirm(`Are you sure you want to delete this ${entityName}?`);
};

// Common loading states
export const getLoadingState = (loading: boolean, error: string | null) => {
  if (error) {
    return { showError: true, showLoading: false, showContent: false };
  }
  if (loading) {
    return { showError: false, showLoading: true, showContent: false };
  }
  return { showError: false, showLoading: false, showContent: true };
};

// Common empty state handling
export const getEmptyStateMessage = (filters: FilterOptions, entityName: string) => {
  if (filters.search || filters.status || filters.type || filters.customerType) {
    return `No ${entityName}s match your current filters.`;
  }
  return `Get started by adding your first ${entityName}.`;
};

// Common pagination helper
export const getPaginationInfo = (pagination: { page: number; totalPages: number }) => {
  if (pagination.totalPages <= 1) return null;
  
  return {
    hasNextPage: pagination.page < pagination.totalPages,
    hasPrevPage: pagination.page > 1,
    currentPage: pagination.page,
    totalPages: pagination.totalPages
  };
};
