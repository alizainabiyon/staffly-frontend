'use client';

import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search,
  Filter,
  Download,
  Printer,
  FileText,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';

export interface TableColumn<T = any> {
  key: string;
  header: string;
  accessor: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  className?: string;
  exportable?: boolean; // Whether this column should be included in exports
}

export interface TableFilter {
  key: string;
  label: string;
  type: 'select' | 'input' | 'date';
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export interface TableAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: (item: T) => boolean;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  subtitle?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  filters?: TableFilter[];
  actions?: TableAction<T>[];
  pagination?: {
    enabled: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
  };
  sortable?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onExport?: () => void;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
  exportOptions?: {
    enablePrint?: boolean;
    enablePDF?: boolean;
    enableCSV?: boolean;
    filename?: string;
  };
}

export function DataTable<T = any>({
  data,
  columns,
  title,
  subtitle,
  searchable = true,
  searchPlaceholder = "Search...",
  filters = [],
  actions = [],
  pagination = { enabled: true, pageSize: 20, pageSizeOptions: [10, 20, 50, 100] },
  sortable = false,
  onSort,
  onExport,
  emptyMessage = "No data available",
  loading = false,
  className,
  exportOptions = {
    enablePrint: false,
    enablePDF: false,
    enableCSV: false,
    filename: 'data-export'
  }
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pagination.pageSize || 20);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(item => {
        return columns.some(column => {
          const value = column.accessor(item);
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return false;
        });
      });
    }

    // Apply filters
    filters.forEach(filter => {
      const filterValue = filterValues[filter.key];
      if (filterValue && filterValue !== 'all') {
        filtered = filtered.filter(item => {
          const column = columns.find(col => col.key === filter.key);
          if (column) {
            const value = column.accessor(item);
            if (typeof value === 'string') {
              return value.toLowerCase().includes(filterValue.toLowerCase());
            }
          }
          return false;
        });
      }
    });

    return filtered;
  }, [data, searchTerm, filterValues, columns, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortable || !sortKey) return filteredData;

    const column = columns.find(col => col.key === sortKey);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = column.accessor(a);
      const bValue = column.accessor(b);

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredData, sortKey, sortDirection, sortable, columns]);

  // Calculate total pages with proper validation
  const totalPages = useMemo(() => {
    if (!pagination.enabled) return 1;
    const validPageSize = Math.max(1, pageSize || 20);
    return Math.ceil(sortedData.length / validPageSize);
  }, [sortedData.length, pageSize, pagination.enabled]);

  // Ensure current page is within valid range
  const validCurrentPage = useMemo(() => {
    if (!pagination.enabled) return 1;
    return Math.min(Math.max(1, currentPage), totalPages);
  }, [currentPage, totalPages, pagination.enabled]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination.enabled) return sortedData;
    
    // Ensure pageSize is valid
    const validPageSize = Math.max(1, pageSize || 20);
    const startIndex = (validCurrentPage - 1) * validPageSize;
    return sortedData.slice(startIndex, startIndex + validPageSize);
  }, [sortedData, validCurrentPage, pageSize, pagination.enabled]);

  // Handle sorting
  const handleSort = (key: string) => {
    if (!sortable) return;

    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }

    onSort?.(key, sortDirection);
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title || 'Data Export', 14, 22);
    
    // Add subtitle if exists
    if (subtitle) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(subtitle, 14, 32);
    }

    // Prepare table data
    const exportColumns = columns.filter(col => col.exportable !== false);
    const headers = exportColumns.map(col => col.header);
    const tableData = sortedData.map(item => 
      exportColumns.map(col => {
        const value = col.accessor(item);
        // Convert React nodes to string for PDF
        if (typeof value === 'string' || typeof value === 'number') {
          return value.toString();
        }
        return '';
      })
    );

    // Calculate optimal column widths based on content
    const pageWidth = 190; // Available width (210 - 20 for margins)
    const minColumnWidth = 25;
    const maxColumnWidth = 60;
    
    // Calculate column widths based on content length
    const columnWidths = exportColumns.map((col, index) => {
      const headerLength = col.header.length;
      const maxDataLength = Math.max(
        headerLength,
        ...tableData.map(row => row[index]?.toString().length || 0)
      );
      
      // Base width on content, but keep within bounds
      let width = Math.max(minColumnWidth, Math.min(maxColumnWidth, maxDataLength * 2.5));
      
      // Special handling for email columns (make them wider)
      if (col.header.toLowerCase().includes('email') || col.key.toLowerCase().includes('email')) {
        width = Math.max(width, 45);
      }
      
      return width;
    });
    
    // Adjust total width to fit page
    const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);
    if (totalWidth > pageWidth) {
      const scaleFactor = pageWidth / totalWidth;
      columnWidths.forEach((width, index) => {
        columnWidths[index] = Math.max(minColumnWidth, width * scaleFactor);
      });
    }

    // Create table with calculated widths
    let yPosition = subtitle ? 40 : 30;
    const lineHeight = 10;
    const cellPadding = 6;
    
    // Draw headers
    doc.setFillColor(59, 130, 246); // Blue color matching theme
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    let xPosition = 14;
    headers.forEach((header, index) => {
      const cellWidth = columnWidths[index];
      doc.rect(xPosition, yPosition, cellWidth, lineHeight + cellPadding, 'F');
      
      // Center text in header cells
      const textWidth = doc.getTextWidth(header);
      const textX = xPosition + (cellWidth - textWidth) / 2;
      doc.text(header, textX, yPosition + lineHeight);
      
      xPosition += cellWidth;
    });
    
    yPosition += lineHeight + cellPadding;
    
    // Draw data rows
    doc.setFillColor(255, 255, 255);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    tableData.forEach((row, rowIndex) => {
      xPosition = 14;
      row.forEach((cell, cellIndex) => {
        const cellWidth = columnWidths[cellIndex];
        const fillColor = rowIndex % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
        doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
        doc.rect(xPosition, yPosition, cellWidth, lineHeight + cellPadding, 'F');
        
        // Handle text overflow and positioning
        const cellText = cell.toString();
        const textWidth = doc.getTextWidth(cellText);
        
        if (textWidth <= cellWidth - 4) {
          // Text fits, center it
          const textX = xPosition + (cellWidth - textWidth) / 2;
          doc.text(cellText, textX, yPosition + lineHeight);
        } else {
          // Text doesn't fit, truncate and add ellipsis
          let truncatedText = cellText;
          while (doc.getTextWidth(truncatedText + '...') > cellWidth - 4 && truncatedText.length > 0) {
            truncatedText = truncatedText.slice(0, -1);
          }
          if (truncatedText.length < cellText.length) {
            truncatedText += '...';
          }
          doc.text(truncatedText, xPosition + 2, yPosition + lineHeight);
        }
        
        xPosition += cellWidth;
      });
      yPosition += lineHeight + cellPadding;
      
      // Check if we need a new page
      if (yPosition > 270 && rowIndex < tableData.length - 1) {
        doc.addPage();
        yPosition = 20;
      }
    });

    // Save PDF
    doc.save(`${exportOptions.filename || 'data-export'}.pdf`);
  };

  // Export to CSV
  const exportToCSV = () => {
    const exportColumns = columns.filter(col => col.exportable !== false);
    const headers = exportColumns.map(col => col.header);
    
    const csvContent = [
      headers.join(','),
      ...sortedData.map(item => 
        exportColumns.map(col => {
          const value = col.accessor(item);
          if (typeof value === 'string' || typeof value === 'number') {
            // Escape commas and quotes in CSV
            const stringValue = value.toString();
            if (stringValue.includes(',') || stringValue.includes('"')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          }
          return '';
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${exportOptions.filename || 'data-export'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get company information from Redux store at component level
  const profile = useSelector((state: any) => state.profile.profile);
  const companyName = profile?.companyName || 'Company Name';
  const companyEmail = profile?.companyEmail || 'info@company.com';
  const companyLogo = profile?.companyLogoUrl || '';
  const companyPhone = profile?.companyPhone || '';
  const companyWebsite = profile?.companyWebsite || '';
  const companyTaxNumber = profile?.companyTaxNumber || '';

  // Print table
  const printTable = async () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const exportColumns = columns.filter(col => col.exportable !== false);
    const headers = exportColumns.map(col => col.header);
    
    // Get current date and time for report
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title || 'Transaction Report'} - ${companyName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
            
            * { 
              box-sizing: border-box; 
              margin: 0;
              padding: 0;
            }
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              margin: 0; 
              padding: 0; 
              background: #f8fafc;
              color: #1e293b;
              line-height: 1.5;
              font-size: 14px;
            }
            
            .report-container {
              max-width: 1200px;
              margin: 0 auto;
              background: white;
              border-radius: 6px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .report-header {
              background: #f8fafc;
              padding: 20px 24px;
              border-bottom: 1px solid #e5e7eb;
              position: relative;
            }
            
            .header-content {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              position: relative;
              z-index: 2;
            }
            
            .company-info {
              text-align: left;
            }
            
            .company-name {
              font-size: 18px;
              font-weight: 700;
              margin: 0 0 4px 0;
              color: #374151;
              letter-spacing: -0.025em;
            }
            
            .company-tagline {
              font-size: 12px;
              font-weight: 400;
              margin: 0 0 8px 0;
              color: #6b7280;
            }
            
            .company-details {
              font-size: 11px;
              color: #6b7280;
              line-height: 1.4;
            }
            
            .company-details p {
              margin: 0 0 2px 0;
            }
            
            .report-info {
              text-align: right;
            }
            
            .report-title {
              font-size: 16px;
              font-weight: 700;
              margin: 0 0 8px 0;
              color: #374151;
              letter-spacing: -0.025em;
            }
            
            .report-details {
              font-size: 11px;
              color: #6b7280;
              line-height: 1.4;
            }
            
            .report-details p {
              margin: 0 0 2px 0;
            }
            
            .report-meta {
              background: #f8fafc;
              padding: 8px 24px;
              border-bottom: 1px solid #e5e7eb;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 11px;
              color: #6b7280;
            }
            
            .meta-section {
              display: flex;
              gap: 20px;
            }
            
            .meta-item {
              display: flex;
              align-items: center;
              gap: 4px;
            }
            
            .meta-label {
              font-weight: 600;
              color: #374151;
            }
            
            .report-content {
              padding: 16px 24px 20px 24px;
            }
            
            .table-container {
              border-radius: 4px;
              border: 1px solid #e5e7eb;
              overflow: hidden;
            }
            
            table { 
              border-collapse: collapse; 
              width: 100%; 
              font-size: 12px;
              background: white;
              table-layout: fixed;
            }
            
            th, td { 
              border: none; 
              padding: 8px 12px; 
              text-align: left; 
              vertical-align: middle;
              line-height: 1.3;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            
            th { 
              background: #e0f2fe;
              color: #1e40af; 
              font-weight: 700;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              position: sticky;
              top: 0;
              z-index: 10;
            }
            
            tr:nth-child(even) { 
              background-color: #fafafa; 
            }
            
            tr:hover { 
              background-color: #f0f9ff; 
            }
            
            /* Column width distribution for better fit */
            th:nth-child(1), td:nth-child(1) { width: 10%; } /* Date */
            th:nth-child(2), td:nth-child(2) { width: 12%; } /* Purpose */
            th:nth-child(3), td:nth-child(3) { width: 25%; } /* Description */
            th:nth-child(4), td:nth-child(4) { width: 10%; } /* Method */
            th:nth-child(5), td:nth-child(5) { width: 10%; } /* Type */
            th:nth-child(6), td:nth-child(6) { width: 12%; } /* Amount */
            th:nth-child(7), td:nth-child(7) { width: 11%; } /* Opening Balance */
            th:nth-child(8), td:nth-child(8) { width: 10%; } /* Closing Balance */
            
            .amount-cell {
              text-align: right;
              font-weight: 600;
              font-family: 'Inter', monospace;
              color: #0891b2;
            }
            
            .status-cell {
              text-align: center;
              font-weight: 600;
              text-transform: uppercase;
              font-size: 10px;
              letter-spacing: 0.05em;
            }
            
            .status-active {
              color: #059669;
              background: #ecfdf5;
              padding: 1px 4px;
              border-radius: 3px;
            }
            
            .status-pending {
              color: #d97706;
              background: #fffbeb;
              padding: 1px 4px;
              border-radius: 3px;
            }
            
            .status-completed {
              color: #059669;
              background: #ecfdf5;
              padding: 1px 4px;
              border-radius: 3px;
            }
            
            .account-cell {
              color: #0891b2;
              font-weight: 500;
            }
            
            .description-cell {
              color: #0891b2;
              font-weight: 400;
            }
            
            .report-footer {
              background: #f8fafc;
              padding: 12px 24px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 10px;
              color: #6b7280;
              font-weight: 400;
            }
            
            .footer-content {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 6px;
            }
            
            .footer-left {
              text-align: left;
            }
            
            .footer-right {
              text-align: right;
            }
            
            .print-actions {
              position: fixed;
              top: 20px;
              right: 20px;
              display: flex;
              gap: 12px;
              z-index: 1000;
            }
            
            .print-btn {
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
              transition: all 0.2s;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            
            .print-btn:hover {
              background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
              transform: translateY(-2px);
              box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
            }
            
            .close-btn {
              background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
              transition: all 0.2s;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            
            .close-btn:hover {
              background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
              transform: translateY(-2px);
              box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
            }
            
            .watermark {
              position: absolute;
              top: 50%;
              right: 20px;
              transform: translateY(-50%) rotate(-45deg);
              font-size: 120px;
              font-weight: 900;
              color: rgba(8, 145, 178, 0.08);
              pointer-events: none;
              z-index: 1;
              opacity: 0.6;
            }
            
            @media print {
              body { 
                background: white; 
                padding: 0;
                margin: 0;
              }
              
              .report-container {
                box-shadow: none;
                border-radius: 0;
                border: none;
              }
              
              .report-header {
                background: white !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              
              th {
                background: #e0f2fe !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              
              .print-actions { 
                display: none; 
              }
              
              .table-container {
                border: 1px solid #e5e7eb;
                box-shadow: none;
              }
              
              table { 
                font-size: 10px; 
              }
              
              th, td { 
                padding: 6px 8px; 
              }
              
              .table-container {
                overflow: visible;
              }
              
              .watermark {
                display: block;
                opacity: 0.3;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-actions">
            <button class="print-btn" onclick="window.print()">🖨️ Print Report</button>
            <button class="close-btn" onclick="window.close()">✕ Close</button>
          </div>
          
          <div class="report-container">
            <div class="report-header">
              <div class="watermark">${companyName.substring(0, 3).toUpperCase()}</div>
              
              <div class="header-content">
                <div class="company-info">
                  <div class="company-name">${companyName}</div>
                  <div class="company-tagline">Professional Business Management System</div>
                  <div class="company-details">
                    ${companyPhone ? `<p>Phone: ${companyPhone}</p>` : ''}
                    ${companyWebsite ? `<p>Website: ${companyWebsite}</p>` : ''}
                    ${companyTaxNumber ? `<p>Tax ID: ${companyTaxNumber}</p>` : ''}
                  </div>
                </div>
                
                <div class="report-info">
                  <div class="report-title">${title || 'Transaction Report'}</div>
                  <div class="report-details">
                    <p>Generated on ${currentDate} at ${currentTime}</p>
                    <p>Report ID: RPT-${Date.now().toString().slice(-8)}</p>
                    <p>Generated by: ${profile?.firstName} ${profile?.lastName}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="report-meta">
              <div class="meta-section">
                <div class="meta-item">
                  <span class="meta-label">Total Records:</span>
                  <span>${sortedData.length}</span>
                </div>
              </div>
            </div>
            
            <div class="report-content">
              <div class="table-container">
                <table>
                  <thead>
                    <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                  </thead>
                  <tbody>
                    ${sortedData.map(item => 
                      `<tr>${exportColumns.map(col => {
                        const value = col.accessor(item);
                        let cellContent = '';
                        let cellClass = '';
                        
                        if (typeof value === 'string' || typeof value === 'number') {
                          cellContent = value.toString();
                          
                          // Apply special styling for amount columns
                          if (col.header.toLowerCase().includes('amount') || col.header.toLowerCase().includes('price') || col.header.toLowerCase().includes('total')) {
                            cellClass = 'amount-cell';
                            // Format as currency if it's a number
                            if (typeof value === 'number' && !isNaN(value)) {
                              cellContent = new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD'
                              }).format(value);
                            }
                          }
                          
                          // Apply special styling for status columns
                          if (col.header.toLowerCase().includes('status')) {
                            cellClass = 'status-cell';
                            const statusClass = value.toString().toLowerCase().includes('active') ? 'status-active' : 
                                             value.toString().toLowerCase().includes('pending') ? 'status-pending' :
                                             value.toString().toLowerCase().includes('completed') ? 'status-completed' : '';
                            cellContent = `<span class="${statusClass}">${value.toString()}</span>`;
                          }
                          
                          // Apply special styling for account/name columns (first column typically)
                          if (col.header.toLowerCase().includes('account') || col.header.toLowerCase().includes('name')) {
                            cellClass = 'account-cell';
                          }
                          
                          // Apply special styling for description columns
                          if (col.header.toLowerCase().includes('description')) {
                            cellClass = 'description-cell';
                          }
                        }
                        
                        return `<td class="${cellClass}">${cellContent}</td>`;
                      }).join('')}</tr>`
                    ).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Enhanced Compact Header with Dark Mode Support */}
      {(title || searchable || filters.length > 0 || exportOptions.enablePrint || exportOptions.enablePDF || exportOptions.enableCSV) && (
        <Card className="border-0 shadow-sm bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20">
          <CardHeader className="pb-3">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
              <div className="flex-1 min-w-0">
                {title && <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200 truncate">{title}</CardTitle>}
                {subtitle && <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 truncate">{subtitle}</p>}
              </div>
              
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                {/* Search */}
                {searchable && (
                  <div className="relative flex-1 lg:flex-none">
                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    <Input
                      placeholder={searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-8 h-8 text-sm border-slate-200 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-full lg:w-56"
                    />
                  </div>
                )}

                {/* Filters */}
                {filters.map(filter => (
                  <Select
                    key={filter.key}
                    value={filterValues[filter.key] || 'all'}
                    onValueChange={(value) => handleFilterChange(filter.key, value)}
                  >
                    <SelectTrigger className="h-8 w-32 text-xs border-slate-200 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 bg-white dark:bg-slate-800">
                      <Filter className="h-3.5 w-3.5 mr-1.5 text-slate-500 dark:text-slate-400" />
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600">
                      <SelectItem value="all" className="text-xs text-slate-900 dark:text-slate-100">All {filter.label}</SelectItem>
                      {filter.options?.map(option => (
                        <SelectItem key={option.value} value={option.value} className="text-xs text-slate-900 dark:text-slate-100">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}

                {/* Export Options */}
                <div className="flex items-center gap-1">
                  {exportOptions.enablePrint && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={printTable} 
                      title="Print"
                      className="h-8 w-8 p-0 border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400"
                    >
                      <Printer className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {exportOptions.enablePDF && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={exportToPDF} 
                      title="Export to PDF"
                      className="h-8 w-8 p-0 border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400"
                    >
                      <FileText className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {exportOptions.enableCSV && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={exportToCSV} 
                      title="Export to CSV"
                      className="h-8 w-8 p-0 border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {onExport && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={onExport}
                      className="h-8 px-3 text-xs border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Export
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Enhanced Professional Table with Dark Green Header */}
      <Card className="border-0 shadow-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-xl border border-gray-200/60 dark:border-slate-700/60">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 dark:from-emerald-900 dark:via-green-800 dark:to-teal-900 border-b border-emerald-600/30 dark:border-emerald-500/30 hover:bg-gradient-to-r hover:from-emerald-700 hover:via-green-600 hover:to-teal-700 dark:hover:from-emerald-800 dark:hover:via-green-700 dark:hover:to-teal-800 transition-all duration-300">
                  {columns.map(column => (
                    <TableHead 
                      key={column.key}
                      className={cn(
                        "px-3 py-2 text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider border-r border-emerald-600/30 dark:border-emerald-500/30 last:border-r-0 leading-tight",
                        column.className,
                        column.sortable && "cursor-pointer hover:bg-emerald-600/20 dark:hover:bg-emerald-500/20 transition-all duration-200 group",
                        column.width && `w-[${column.width}]`
                      )}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
                        <span className="font-bold text-white dark:text-emerald-100 group-hover:text-emerald-100 dark:group-hover:text-emerald-50 transition-colors duration-200">
                          {column.header}
                        </span>
                        {column.sortable && (
                          <div className="flex flex-col opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                            <ChevronUp 
                              className={cn(
                                "h-3 w-3 transition-all duration-200",
                                sortKey === column.key && sortDirection === 'asc' 
                                  ? "text-emerald-200 dark:text-emerald-300 scale-110" 
                                  : "text-emerald-300/60 dark:text-emerald-400/60 group-hover:text-emerald-200 dark:group-hover:text-emerald-300"
                              )}
                            />
                            <ChevronDown 
                              className={cn(
                                "h-3 w-3 -mt-1 transition-all duration-200",
                                sortKey === column.key && sortDirection === 'desc' 
                                  ? "text-emerald-200 dark:text-emerald-300 scale-110" 
                                  : "text-emerald-300/60 dark:text-emerald-400/60 group-hover:text-emerald-200 dark:group-hover:text-emerald-300"
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </TableHead>
                  ))}
                  {actions.length > 0 && (
                    <TableHead className="w-12 px-2 py-2 text-xs font-bold text-white dark:text-emerald-100 uppercase tracking-wider text-center border-l border-emerald-600/30 dark:border-emerald-500/30 leading-tight">
                      Actions
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-8 border-0">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-200 border-t-blue-600"></div>
                        <div className="text-xs font-medium text-slate-600">Loading data...</div>
                        <div className="text-xs text-slate-400">Please wait while we fetch the latest information</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-8 border-0">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                          <Search className="h-6 w-6 text-slate-400" />
                        </div>
                        <div className="text-xs font-medium text-slate-600">{emptyMessage}</div>
                        <div className="text-xs text-slate-400">Try adjusting your search or filter criteria</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item, index) => (
                    <TableRow 
                      key={index} 
                      className="group hover:bg-gradient-to-r hover:from-emerald-50/20 hover:to-green-50/20 dark:hover:from-emerald-900/20 dark:hover:to-green-900/20 transition-all duration-200 border-b border-gray-100/60 dark:border-slate-700/60 last:border-b-0"
                    >
                      {columns.map(column => (
                        <TableCell 
                          key={column.key} 
                          className={cn(
                            "px-3 py-2 text-xs border-r border-gray-100/40 dark:border-slate-700/40 last:border-r-0 group-hover:bg-white/50 dark:group-hover:bg-slate-800/50 transition-all duration-200 text-slate-700 dark:text-slate-300 leading-tight",
                            column.className
                          )}
                        >
                          {column.accessor(item)}
                        </TableCell>
                      ))}
                      {actions.length > 0 && (
                        <TableCell className="px-2 py-2 text-center border-l border-gray-100/40 dark:border-slate-700/40 group-hover:bg-white/50 dark:group-hover:bg-slate-800/50 transition-all duration-200">
                          <div className="flex items-center justify-center gap-0.5">
                            {actions.map((action, actionIndex) => (
                              <Button
                                key={actionIndex}
                                variant={action.variant || 'ghost'}
                                size="sm"
                                onClick={() => action.onClick(item)}
                                disabled={action.disabled?.(item)}
                                className={cn(
                                  "h-6 w-6 p-0 opacity-60 group-hover:opacity-100 transition-all duration-200 hover:scale-110",
                                  action.variant === 'destructive' && "hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400",
                                  action.variant === 'ghost' && "hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400"
                                )}
                                title={action.label}
                              >
                                {action.icon || <MoreHorizontal className="h-3 w-3" />}
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Compact Pagination with Dark Mode Support */}
      {pagination.enabled && sortedData.length > 0 && (
        <Card className="border-0 shadow-sm bg-slate-50/50 dark:bg-slate-800/50">
          <CardContent className="py-3 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Show</span>
                <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                  <SelectTrigger className="w-16 h-7 text-xs border-slate-200 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 bg-white dark:bg-slate-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600">
                    {pagination.pageSizeOptions?.map(size => (
                      <SelectItem key={size} value={size.toString()} className="text-xs text-slate-900 dark:text-slate-100">
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-slate-600 dark:text-slate-400 font-medium">entries</span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{((validCurrentPage - 1) * Math.max(1, pageSize || 20)) + 1}</span> to <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.min(validCurrentPage * Math.max(1, pageSize || 20), sortedData.length)}</span> of <span className="font-semibold text-slate-800 dark:text-slate-200">{sortedData.length}</span> records
                </p>
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={validCurrentPage === 1}
                      className="h-7 px-2 text-xs border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 disabled:opacity-50 text-slate-700 dark:text-slate-300"
                    >
                      <ChevronLeft className="h-3 w-3 mr-1" />
                      Prev
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 4, validCurrentPage - 2)) + i;
                        if (pageNum > totalPages) return null;
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === validCurrentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={cn(
                              "h-7 w-7 p-0 text-xs",
                              pageNum === validCurrentPage 
                                ? "bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white" 
                                : "border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 text-slate-700 dark:text-slate-300"
                            )}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={validCurrentPage === totalPages}
                      className="h-7 px-2 text-xs border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 disabled:opacity-50 text-slate-700 dark:text-slate-300"
                    >
                      Next
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 