import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid } from 'date-fns';
import { CURRENCIES, DATE_FORMATS } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export function formatDate(date: string | Date, formatStr: string = 'DD/MM/YYYY'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    switch (formatStr) {
      case 'DD/MM/YYYY':
        return format(dateObj, 'dd/MM/yyyy');
      case 'MM/DD/YYYY':
        return format(dateObj, 'MM/dd/yyyy');
      case 'YYYY-MM-DD':
        return format(dateObj, 'yyyy-MM-dd');
      case 'DD-MM-YYYY':
        return format(dateObj, 'dd-MM-yyyy');
      default:
        return format(dateObj, 'dd/MM/yyyy');
    }
  } catch (error) {
    return '';
  }
}

export function formatDateTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, 'dd/MM/yyyy HH:mm');
  } catch (error) {
    return '';
  }
}

export function formatTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, 'HH:mm');
  } catch (error) {
    return '';
  }
}

// Currency formatting utilities
export function formatCurrency(
  amount: number, 
  currency: string = 'PKR', 
  showSymbol: boolean = true
): string {
  const currencyInfo = CURRENCIES[currency as keyof typeof CURRENCIES];
  const symbol = currencyInfo?.symbol || '₨';
  
  const formattedAmount = new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  
  const sign = amount < 0 ? '-' : '';
  
  if (showSymbol) {
    return `${sign}${symbol} ${formattedAmount}`;
  }
  
  return `${sign}${formattedAmount}`;
}

export function parseCurrency(value: string): number {
  // Remove currency symbols and spaces, then parse
  const cleanValue = value.replace(/[₨$€£,\s]/g, '');
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

// Number formatting utilities
export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${formatNumber(value, decimals)}%`;
}

// String utilities
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function capitalizeWords(str: string): string {
  return str.split(' ').map(capitalize).join(' ');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

export function isValidCNIC(cnic: string): boolean {
  const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
  return cnicRegex.test(cnic);
}

export function isValidNTN(ntn: string): boolean {
  const ntnRegex = /^[0-9]{7}-[0-9]$/;
  return ntnRegex.test(ntn);
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

// Object utilities
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

// File utilities
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const extension = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(extension);
}

// URL utilities
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
}

// Color utilities
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Calculation utilities
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

export function calculateTax(amount: number, taxRate: number): number {
  return (amount * taxRate) / 100;
}

export function calculateDiscount(amount: number, discountRate: number): number {
  return (amount * discountRate) / 100;
}

export function calculateNetAmount(
  amount: number,
  taxRate: number = 0,
  discountRate: number = 0
): {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  netAmount: number;
} {
  const subtotal = amount;
  const discountAmount = calculateDiscount(subtotal, discountRate);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = calculateTax(taxableAmount, taxRate);
  const netAmount = taxableAmount + taxAmount;
  
  return {
    subtotal,
    taxAmount,
    discountAmount,
    netAmount,
  };
}

// Business logic utilities
export function generateInvoiceNumber(prefix: string = 'INV', year?: number): string {
  const currentYear = year || new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${currentYear}-${timestamp}`;
}

export function generateEmployeeId(prefix: string = 'EMP', sequence: number): string {
  return `${prefix}${sequence.toString().padStart(4, '0')}`;
}

export function calculateWorkingDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Local storage utilities with SSR safety
export function setLocalStorage(key: string, value: any): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
}

export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      // Check if item exists and is not "undefined" string
      if (item && item !== 'undefined' && item !== 'null') {
        return JSON.parse(item);
      }
      return defaultValue;
    }
    return defaultValue;
  } catch (error) {
    console.error('Error getting localStorage:', error);
    // If parsing fails, remove the invalid item and return default
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (removeError) {
      console.error('Error removing invalid localStorage item:', removeError);
    }
    return defaultValue;
  }
}

export function removeLocalStorage(key: string): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Error removing localStorage:', error);
  }
}

// Session storage utilities with SSR safety
export function setSessionStorage(key: string, value: any): void {
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error('Error setting sessionStorage:', error);
  }
}

export function getSessionStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== 'undefined') {
      const item = sessionStorage.getItem(key);
      // Check if item exists and is not "undefined" string
      if (item && item !== 'undefined' && item !== 'null') {
        return JSON.parse(item);
      }
      return defaultValue;
    }
    return defaultValue;
  } catch (error) {
    console.error('Error getting sessionStorage:', error);
    // If parsing fails, remove the invalid item and return default
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(key);
      }
    } catch (removeError) {
      console.error('Error removing invalid sessionStorage item:', removeError);
    }
    return defaultValue;
  }
}

export function removeSessionStorage(key: string): void {
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Error removing sessionStorage:', error);
  }
}

// Enhanced storage utilities that use both localStorage and sessionStorage
export function setAuthData(key: string, value: any): void {
  // Don't store undefined, null, or empty values
  if (value === undefined || value === null || value === '') {
    console.warn('Attempted to store invalid auth data:', { key, value });
    return;
  }
  
  setLocalStorage(key, value);
  setSessionStorage(key, value);
}

export function getAuthData<T>(key: string, defaultValue: T): T {
  // Try localStorage first, then sessionStorage as fallback
  const localValue = getLocalStorage(key, null);
  if (localValue !== null && localValue !== undefined) {
    return localValue;
  }
  const sessionValue = getSessionStorage(key, null);
  if (sessionValue !== null && sessionValue !== undefined) {
    return sessionValue;
  }
  return defaultValue;
}

export function removeAuthData(key: string): void {
  removeLocalStorage(key);
  removeSessionStorage(key);
}

// Clean up invalid auth data that might be causing issues
export function cleanupInvalidAuthData(): void {
  try {
    if (typeof window !== 'undefined') {
      // Clean up localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.includes('auth') || key.includes('token') || key.includes('user')) {
          const item = localStorage.getItem(key);
          if (item === 'undefined' || item === 'null' || item === '') {
            localStorage.removeItem(key);
            console.log('Cleaned up invalid localStorage item:', key);
          }
        }
      });
      
      // Clean up sessionStorage
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes('auth') || key.includes('token') || key.includes('user')) {
          const item = sessionStorage.getItem(key);
          if (item === 'undefined' || item === 'null' || item === '') {
            sessionStorage.removeItem(key);
            console.log('Cleaned up invalid sessionStorage item:', key);
          }
        }
      });
    }
  } catch (error) {
    console.error('Error cleaning up invalid auth data:', error);
  }
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof Error && 
    (error.message.includes('fetch') || 
     error.message.includes('network') ||
     error.message.includes('NetworkError'));
}

// Random utilities
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// JWT token utilities
export function isTokenExpired(token: string): boolean {
  try {
    // Check if token has the correct JWT format (3 parts separated by dots)
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      return true;
    }
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Add a small buffer (5 minutes) to prevent edge cases
    const bufferTime = 5 * 60; // 5 minutes in seconds
    
    return payload.exp < (currentTime + bufferTime);
  } catch (error) {
    // If we can't decode the token, assume it's expired
    console.warn('Token validation error:', error);
    return true;
  }
}

export function decodeToken(token: string): any {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    return null;
  }
}

// Export all utilities
export * from './constants';