import { ApiSuccessResponse, BackendApiResponse, FilterOptions } from '../types';
import { buildQueryString, getErrorMessage } from '../utils/helpers';
import { API_ENDPOINTS } from '../utils/constants';

// Default API base URL (Railway production backend).
// Override with NEXT_PUBLIC_API_URL in .env.local for local development
// e.g. NEXT_PUBLIC_API_URL=http://localhost:4242/api
const DEFAULT_API_URL = 'https://staffly-backend-production.up.railway.app/api';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// API Client class
class ApiClient {
  private baseURL: string;
  public defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = { ...DEFAULT_HEADERS };
  }

  // Set authorization token
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove authorization token
  removeAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  // Generic request method
  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiSuccessResponse> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      // Check if this is an auth endpoint (should not include token)
      const isAuthEndpoint = endpoint.startsWith('/auth/') || 
                            endpoint.includes('/login') || 
                            endpoint.includes('/register') ||
                            endpoint.includes('/forgot-password') ||
                            endpoint.includes('/reset-password') ||
                            endpoint.includes('/verify-email') ||
                            endpoint.includes('/refresh');
      
      const headers = { ...this.defaultHeaders };
      
      // Remove auth token for auth endpoints
      if (isAuthEndpoint) {
        delete headers['Authorization'];
      }
      
      const config: RequestInit = {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && !isAuthEndpoint && this.defaultHeaders['Authorization']) {
        try {
          // Attempt to refresh the token
          const refreshResponse = await this.request('/auth/v1/user/refresh-token', {
            method: 'POST',
          });
          
          if (refreshResponse.status.success && refreshResponse.response.data?.token) {
            // Update the token and retry the original request
            const newToken = refreshResponse.response.data.token;
            this.setAuthToken(newToken);
            
            // Retry the original request with the new token
            const retryConfig: RequestInit = {
              ...config,
              headers: {
                ...headers,
                'Authorization': `Bearer ${newToken}`,
                ...options.headers,
              },
            };
            
            const retryResponse = await fetch(url, retryConfig);
            const retryData = await retryResponse.json();
            
            if (!retryResponse.ok) {
              throw new Error(retryData.message || `HTTP error! status: ${retryResponse.status}`);
            }
            
            return retryData;
          }
        } catch (refreshError) {
          // If refresh fails, continue with the original error
          console.error('Token refresh failed:', refreshError);
        }
      }
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  // GET request
  async get(endpoint: string, params?: Record<string, any>): Promise<ApiSuccessResponse> {
    const queryString = params ? `?${buildQueryString(params)}` : '';
    const fullUrl = `${endpoint}${queryString}`;
    return this.request(fullUrl, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint: string, data?: any): Promise<ApiSuccessResponse> {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put(endpoint: string, data?: any): Promise<ApiSuccessResponse> {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch(endpoint: string, data?: any): Promise<ApiSuccessResponse> {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete(endpoint: string): Promise<ApiSuccessResponse> {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // File upload
  async upload(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiSuccessResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary
        ...Object.fromEntries(
          Object.entries(this.defaultHeaders).filter(([key]) => key !== 'Content-Type')
        ),
      },
    });
  }
}

// Create API client instance
export const apiClient = new ApiClient();

// Authentication API - these endpoints should NOT include auth token
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  
  register: (userData: any) =>
    apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  
  logout: () =>
    apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),
  
  refreshToken: () =>
    apiClient.post(API_ENDPOINTS.AUTH.REFRESH),
  
  forgotPassword: (email: string) =>
    apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
  
  resetPassword: (token: string, password: string) =>
    apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password }),
  
  verifyEmail: (token: string) =>
    apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token }),
};

// Employee API
export const employeeAPI = {
  getAll: (filters?: FilterOptions) =>
    apiClient.get(API_ENDPOINTS.EMPLOYEES.LIST, filters),
  
  getById: (id?: string) =>
    apiClient.get(API_ENDPOINTS.EMPLOYEES.GET, { employeeId: id }),
  
  create: (employeeData: any) =>
    apiClient.post(API_ENDPOINTS.EMPLOYEES.CREATE, employeeData),
  
  update: (employeeData: any) =>
    apiClient.put(API_ENDPOINTS.EMPLOYEES.UPDATE, employeeData),
  
  delete: (id: string) =>
    apiClient.delete(API_ENDPOINTS.EMPLOYEES.DELETE.replace(':id', id)),
  
  bulkImport: (file: File) =>
    apiClient.upload(API_ENDPOINTS.EMPLOYEES.BULK_IMPORT, file),
  
  export: (filters?: FilterOptions) =>
    apiClient.get(API_ENDPOINTS.EMPLOYEES.EXPORT, filters),

  getExpenses: (employeeId: string, month: number, year: number) =>
    apiClient.get(API_ENDPOINTS.EMPLOYEES.GET_EXPENSES, { employeeId, month, year }),
};

// Payroll API
export const payrollAPI = {
  getSalarySlips: (filters?: FilterOptions) =>
    apiClient.get(API_ENDPOINTS.PAYROLL.SALARY_SLIPS, filters),
  
  generateSalarySlip: (employeeId: string, month: string, year: number) =>
    apiClient.post(API_ENDPOINTS.PAYROLL.GENERATE, { employeeId, month, year }),
  
  approveSalarySlip: (salarySlipId: string) =>
    apiClient.post(API_ENDPOINTS.PAYROLL.APPROVE, { salarySlipId }),
  
  bulkGenerate: (month: string, year: number, employeeIds?: string[]) =>
    apiClient.post(API_ENDPOINTS.PAYROLL.BULK_GENERATE, { month, year, employeeIds }),

  getSalaryHistory: (month: number, year: number) =>
    apiClient.get(API_ENDPOINTS.PAYROLL.SALARY_HISTORY, { month, year }),

  getEmployeeSalaryHistory: (employeeId: string) =>
    apiClient.get(API_ENDPOINTS.PAYROLL.EMPLOYEE_SALARY_HISTORY, { employeeId }),

  updateSalaryStatus: (disbursementData: {
    salaryId: string;
    tillFrom: 'till' | 'director';
    directorId?: string;
    paymentMethod: 'cash' | 'bank';
  }) =>
    apiClient.put(API_ENDPOINTS.PAYROLL.UPDATE_SALARY_STATUS, disbursementData),
};

// Customer API
export const customerAPI = {
  getAll: (filters?: FilterOptions) =>
    apiClient.get(API_ENDPOINTS.CUSTOMERS.LIST, filters),
  
  getById: (id: string) =>
    apiClient.get(API_ENDPOINTS.CUSTOMERS.GET, { customerId: id }),
  
  create: (customerData: any) =>
    apiClient.post(API_ENDPOINTS.CUSTOMERS.CREATE, customerData),
  
  update: (customerData: any) =>
    apiClient.put(API_ENDPOINTS.CUSTOMERS.UPDATE, customerData),
  
  delete: (id: string) =>
    apiClient.delete(`${API_ENDPOINTS.CUSTOMERS.DELETE}?customerId=${id}`),
  
  getLedger: (id: string, filters?: FilterOptions) =>
    apiClient.get(API_ENDPOINTS.CUSTOMERS.LEDGER, { customerId: id, ...filters }),
};

// Contractor API
export const contractorAPI = {
  getAll: (filters?: FilterOptions) =>
    apiClient.get(API_ENDPOINTS.CONTRACTORS.LIST, filters),
  
  getById: (id: string) =>
    apiClient.get(API_ENDPOINTS.CONTRACTORS.GET, { contractorId: id }),
  
  create: (contractorData: any) =>
    apiClient.post(API_ENDPOINTS.CONTRACTORS.CREATE, contractorData),
  
  update: (contractorData: any) =>
    apiClient.put(API_ENDPOINTS.CONTRACTORS.UPDATE, contractorData),
  
  delete: (id: string) =>
    apiClient.delete(`${API_ENDPOINTS.CONTRACTORS.DELETE}?contractorId=${id}`),
};

// Vendor API
export const vendorAPI = {
  getAll: (filters?: FilterOptions) =>
    apiClient.get(API_ENDPOINTS.VENDORS.LIST, filters),
  
  getById: (id: string) =>
    apiClient.get(API_ENDPOINTS.VENDORS.GET, { vendorId: id }),
  
  create: (vendorData: any) =>
    apiClient.post(API_ENDPOINTS.VENDORS.CREATE, vendorData),
  
  update: (vendorData: any) =>
    apiClient.put(API_ENDPOINTS.VENDORS.UPDATE, vendorData),
  
  delete: (id: string) =>
    apiClient.delete(`${API_ENDPOINTS.VENDORS.DELETE}?vendorId=${id}`),
};

// Vendor Order API
export const vendorOrderAPI = {
  getAll: (filters?: FilterOptions) =>
    apiClient.get(API_ENDPOINTS.VENDOR_ORDERS.LIST, filters),
  
  getById: (id: string) =>
    apiClient.get(API_ENDPOINTS.VENDOR_ORDERS.GET, { orderId: id }),
  
  create: (vendorOrderData: any) =>
    apiClient.post(API_ENDPOINTS.VENDOR_ORDERS.CREATE, vendorOrderData),
  
  update: (vendorOrderData: any) =>
    apiClient.put(API_ENDPOINTS.VENDOR_ORDERS.UPDATE, vendorOrderData),
  
  delete: (id: string) =>
    apiClient.delete(`${API_ENDPOINTS.VENDOR_ORDERS.DELETE}?orderId=${id}`),
  
  approve: (orderId: string) =>
    apiClient.put(API_ENDPOINTS.VENDOR_ORDERS.APPROVE, { orderId }),
};

// Quotation API
export const quotationAPI = {
  getAll: (filters?: FilterOptions) =>
    apiClient.get(API_ENDPOINTS.QUOTATIONS.LIST, filters),
  
  getById: (id: string) =>
    apiClient.get(API_ENDPOINTS.QUOTATIONS.GET, { quotationId: id }),
  
  create: (quotationData: any) =>
    apiClient.post(API_ENDPOINTS.QUOTATIONS.CREATE, quotationData),
  
  update: (quotationData: any) =>
    apiClient.put(API_ENDPOINTS.QUOTATIONS.UPDATE, quotationData),
  
  delete: (id: string) =>
    apiClient.delete(`${API_ENDPOINTS.QUOTATIONS.DELETE}?quotationId=${id}`),
  
  convertToInvoice: (quotationId: string) =>
    apiClient.post(API_ENDPOINTS.QUOTATIONS.CONVERT_TO_INVOICE, { quotationId }),
};

// Invoice API
export const invoiceAPI = {
  getAll: (filters?: FilterOptions) =>
    apiClient.get(API_ENDPOINTS.INVOICES.LIST, filters),
  
  getById: (id: string) =>
    apiClient.get(`${API_ENDPOINTS.INVOICES.GET}?invoiceId=${id}`),
  
  create: (invoiceData: any) =>
    apiClient.post(API_ENDPOINTS.INVOICES.CREATE, invoiceData),
  
  update: (invoiceData: any) =>
    apiClient.put(API_ENDPOINTS.INVOICES.UPDATE, invoiceData),
  
  delete: (id: string) =>
    apiClient.delete(`${API_ENDPOINTS.INVOICES.DELETE}?invoiceId=${id}`),
  
  approve: (id: string) =>
    apiClient.put(API_ENDPOINTS.INVOICES.APPROVE, { invoiceId: `${id}` }),
  
  markPaid: (id: string, paymentData: any) =>
    apiClient.post(`${API_ENDPOINTS.INVOICES.MARK_PAID}?invoiceId=${id}`, paymentData),
  
  generatePDF: (id: string) =>
    apiClient.get(`${API_ENDPOINTS.INVOICES.PDF}?invoiceId=${id}`),
  
  send: (id: string) =>
    apiClient.post(`${API_ENDPOINTS.INVOICES.SEND}?invoiceId=${id}`),
};

// Transaction API
export const transactionAPI = {
  getAll: (filters?: FilterOptions) =>
    apiClient.get(API_ENDPOINTS.TRANSACTIONS.LIST, filters),
  
  getById: (id: string) =>
    apiClient.get(API_ENDPOINTS.TRANSACTIONS.GET.replace(':id', id)),
  
  create: (transactionData: any) =>
    apiClient.post(API_ENDPOINTS.TRANSACTIONS.CREATE, transactionData),
  
  update: (id: string, transactionData: any) =>
    apiClient.put(API_ENDPOINTS.TRANSACTIONS.UPDATE.replace(':id', id), transactionData),
  
  delete: (id: string) =>
    apiClient.delete(API_ENDPOINTS.TRANSACTIONS.DELETE.replace(':id', id)),
  
  reconcile: (transactionIds: string[]) =>
    apiClient.post(API_ENDPOINTS.TRANSACTIONS.RECONCILE, { transactionIds }),
};

// Attendance API
export const attendanceAPI = {
  getMonthlyAll: (month: number, year: number) =>
    apiClient.get(API_ENDPOINTS.ATTENDANCE.MONTHLY_ALL, { month, year }),
  
  getMonthlyEmployee: (employeeId: string, month: number, year: number) =>
    apiClient.get(API_ENDPOINTS.ATTENDANCE.MONTHLY_EMPLOYEE, { employeeId, month, year }),
  
  markAttendance: (attendanceData: any) =>
    apiClient.post(API_ENDPOINTS.ATTENDANCE.MARK_ATTENDANCE, attendanceData),
  
  getById: (attendanceId: string) =>
    apiClient.get(API_ENDPOINTS.ATTENDANCE.GET_BY_ID, { attendanceId }),
  
  update: (attendanceData: any) =>
    apiClient.put(API_ENDPOINTS.ATTENDANCE.UPDATE, attendanceData),
  
  delete: (attendanceId: string) =>
    apiClient.delete(`${API_ENDPOINTS.ATTENDANCE.DELETE}?attendanceId=${attendanceId}`),
};

// Director API
export const directorAPI = {
  getAll: (filters?: FilterOptions) =>
    apiClient.get(API_ENDPOINTS.DIRECTORS.LIST, filters),
  
  getById: (directorId: string) =>
    apiClient.get(`${API_ENDPOINTS.DIRECTORS.GET}?directorId=${directorId}`),
  
  create: (directorData: any) =>
    apiClient.post(API_ENDPOINTS.DIRECTORS.CREATE, directorData),
  
  update: (directorData: any) =>
    apiClient.put(API_ENDPOINTS.DIRECTORS.UPDATE, directorData),
  
  delete: (directorId: string) =>
    apiClient.delete(`${API_ENDPOINTS.DIRECTORS.DELETE}?directorId=${directorId}`),
};

// Reports API
export const reportsAPI = {
  generate: (reportType: string, parameters: any) =>
    apiClient.post(API_ENDPOINTS.REPORTS.GENERATE, { reportType, parameters }),
  
  getAll: (filters?: FilterOptions) =>
    apiClient.get(API_ENDPOINTS.REPORTS.LIST, filters),
  
  download: (id: string) =>
    apiClient.get(API_ENDPOINTS.REPORTS.DOWNLOAD.replace(':id', id)),
  
  getExpenseReport: (filters?: FilterOptions) =>
    apiClient.get(API_ENDPOINTS.REPORTS.EXPENSE_REPORT, filters),
  
  getRemainingBalance: () =>
    apiClient.get(API_ENDPOINTS.REPORTS.REMAINING_BALANCE),
  
  convertDocxToPdf: (payload: { templateType: string; templateData: any }) =>
    apiClient.post((API_ENDPOINTS.REPORTS as any).DOCX_TO_PDF, payload),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () =>
    apiClient.get(API_ENDPOINTS.DASHBOARD.STATS),
  
  getCharts: (period?: string) =>
    apiClient.get(API_ENDPOINTS.DASHBOARD.CHARTS, { period }),
  
  getRecentActivities: (limit?: number) =>
    apiClient.get(API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES, { limit }),
};

// File Handler API
export const fileHandlerAPI = {
  uploadSingle: (file: File) =>
    apiClient.upload(API_ENDPOINTS.FILE_HANDLER.UPLOAD_SINGLE, file),
  
  deleteSingle: (fileUrl: string) =>
    apiClient.post(API_ENDPOINTS.FILE_HANDLER.DELETE_SINGLE, { fileUrl }),
  
  uploadMultiple: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const baseURL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
    const url = `${baseURL}${API_ENDPOINTS.FILE_HANDLER.UPLOAD_MULTIPLE}`;
    
    return fetch(url, {
      method: 'POST',
      body: formData,
    });
  },
  
  deleteMultiple: (fileUrls: string[]) =>
    apiClient.post(API_ENDPOINTS.FILE_HANDLER.DELETE_MULTIPLE, { fileUrls }),
};

// Daily Entry API
export const dailyEntryAPI = {
  getAll: (filters?: FilterOptions) =>
    apiClient.get(API_ENDPOINTS.DAILY_ENTRIES.LIST, filters),
  
  getById: (id: string) =>
    apiClient.get(`${API_ENDPOINTS.DAILY_ENTRIES.GET}?entryId=${id}`),
  
  create: (entryData: any) =>
    apiClient.post(API_ENDPOINTS.DAILY_ENTRIES.CREATE, entryData),
  
  update: (entryData: any) =>
    apiClient.put(API_ENDPOINTS.DAILY_ENTRIES.UPDATE, entryData),
  
  delete: (id: string) =>
    apiClient.delete(`${API_ENDPOINTS.DAILY_ENTRIES.DELETE}?entryId=${id}`),
    
  saveTodayEntries: () =>
    apiClient.post(API_ENDPOINTS.DAILY_ENTRIES.SAVE_TODAY_ENTRIES),
};

// Profile API
export const profileAPI = {
  get: () =>
    apiClient.get(API_ENDPOINTS.PROFILE.GET),
  update: (profileData: any) =>
    apiClient.put(API_ENDPOINTS.PROFILE.UPDATE, profileData),
  updateCompany: (companyData: any) =>
    apiClient.put(API_ENDPOINTS.PROFILE.UPDATE_COMPANY, companyData),
};

// Till API
export const tillAPI = {
  initialize: (tillData: any) =>
    apiClient.post(API_ENDPOINTS.TILL.INITIALIZE, tillData),
  get: (filters?: { ledgerType?: string; directorId?: string }) =>
    apiClient.get(API_ENDPOINTS.TILL.GET, filters),
};

// Export all APIs
export {
  authAPI as auth,
  employeeAPI as employees,
  payrollAPI as payroll,
  customerAPI as customers,
  contractorAPI as contractors,
  vendorAPI as vendors,
  vendorOrderAPI as vendorOrders,
  invoiceAPI as invoices,
  directorAPI as directors,
  transactionAPI as transactions,
  reportsAPI as reports,
  dashboardAPI as dashboard,
  fileHandlerAPI as fileHandler,
  profileAPI as profile,
  tillAPI as till,
};

// Default export
export default apiClient;