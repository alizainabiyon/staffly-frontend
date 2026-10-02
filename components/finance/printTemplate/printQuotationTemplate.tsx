import { Quotation } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';

interface PrintQuotationTemplateProps {
  quotation: Quotation;
  getCustomerName: (quotation: Quotation) => string;
  profile?: {
    companyName?: string;
    companyLogoUrl?: string;
    companyAddress?: string;
    companyPhone?: string;
    companyEmail?: string;
    companyWebsite?: string;
    companyTaxNumber?: string;
  };
}

export function generateQuotationPrintContent({ quotation, getCustomerName, profile }: PrintQuotationTemplateProps): string {
  const safeString = (str: any) => {
    if (str === null || str === undefined) return 'N/A';
    return String(str).replace(/[<>]/g, '');
  };

  const safeCurrency = (amount: any) => {
    if (amount === null || amount === undefined || isNaN(amount)) return 'N/A';
    return formatCurrency(amount);
  };

  const safeDate = (date: any) => {
    if (!date) return 'N/A';
    try {
      return formatDate(date);
    } catch {
      return 'N/A';
    }
  };

  return `<!DOCTYPE html>
<html>
<head>
  <title>Quotation - ${safeString(quotation.quotationNumber)}</title>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      margin: 15px; 
      padding: 20px;
      line-height: 1.3; 
      color: #333;
      font-size: 13px;
    }
    .header { 
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      border-bottom: 3px solid #2563eb; 
      padding-bottom: 12px; 
      margin-bottom: 15px; 
    }
    .header-left {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-container {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
    }
    .logo-container img {
      max-width: 50px;
      max-height: 50px;
      object-fit: contain;
    }
    .company-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .company-name { 
      font-size: 18px; 
      font-weight: bold; 
      color: #2563eb; 
      margin: 0;
    }
    .company-details {
      font-size: 10px;
      color: #666;
      margin: 0;
      line-height: 1.2;
    }
    .header-center {
      flex: 1;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .quotation-title { 
      font-size: 28px; 
      font-weight: bold;
      color: #1f2937; 
      margin: 0;
      letter-spacing: 1px;
    }
    .quotation-subtitle {
      font-size: 12px;
      color: #6b7280;
      margin-top: 2px;
    }
    .header-right {
      flex: 0 0 auto;
      text-align: right;
      font-size: 11px;
      color: #6b7280;
    }
    .quotation-number {
      font-size: 14px;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 4px;
    }
    .info-section { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 20px; 
      margin-bottom: 15px; 
      padding: 12px; 
      background: #f8fafc; 
      border-radius: 6px; 
      border: 1px solid #e5e7eb;
    }
    .info-column {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .info-item { 
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    .info-item:last-child {
      border-bottom: none;
    }
    .info-label { 
      font-weight: bold; 
      color: #374151; 
      font-size: 11px; 
      flex: 0 0 40%;
    }
    .info-value { 
      color: #111827; 
      font-size: 11px; 
      flex: 1;
      text-align: right;
    }
    .section { 
      margin-bottom: 15px; 
    }
    .section-title { 
      font-size: 14px; 
      font-weight: bold; 
      color: #111827; 
      border-bottom: 2px solid #2563eb; 
      padding-bottom: 6px; 
      margin-bottom: 10px; 
    }
    .items-table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-bottom: 12px; 
      font-size: 11px; 
      border: 1px solid #d1d5db;
    }
    .items-table th, .items-table td { 
      border: 1px solid #d1d5db; 
      padding: 6px 4px; 
      text-align: left; 
    }
    .type-badge {
      background-color: #dbeafe;
      color: #1e40af;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 9px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .total-cell {
      font-weight: bold;
      color: #059669;
    }
    .items-table th { 
      background-color: #f3f4f6; 
      font-weight: bold; 
      color: #374151; 
      font-size: 10px;
    }
    .items-table tr:nth-child(even) { 
      background-color: #f9fafb; 
    }
    .totals-section { 
      margin-top: 12px; 
      padding: 12px; 
      background: #f8fafc; 
      border-radius: 6px; 
      border: 1px solid #e5e7eb;
    }
    .total-item { 
      display: flex; 
      justify-content: space-between; 
      padding: 4px 0; 
      border-bottom: 1px solid #e5e7eb; 
    }
    .total-item:last-child {
      border-bottom: none;
    }
    .total-label { 
      font-weight: bold; 
      color: #374151; 
      font-size: 11px;
    }
    .total-value { 
      font-weight: 600; 
      color: #111827; 
      font-size: 11px;
    }
    .grand-total { 
      font-size: 14px; 
      font-weight: bold; 
      color: #059669; 
      border-top: 2px solid #059669; 
      padding-top: 6px; 
      margin-top: 6px; 
    }
    .notes-section, .terms-section { 
      margin-top: 15px; 
      padding: 12px; 
      background: #f8fafc; 
      border-radius: 6px; 
      border: 1px solid #e5e7eb;
    }
    .description-content, .notes-content, .terms-content {
      text-align: left;
      line-height: 1.4;
      color: #374151;
      font-size: 12px;
    }
    .footer { 
      margin-top: 20px; 
      text-align: center; 
      color: #6b7280; 
      font-size: 10px; 
      border-top: 1px solid #e5e7eb; 
      padding-top: 10px; 
    }
    @media print { 
      body { margin: 8px; padding: 15px; font-size: 12px; } 
      .header { margin-bottom: 12px; } 
      .section { margin-bottom: 12px; } 
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <div class="logo-container">
        ${profile?.companyLogoUrl ? `<img src="${profile.companyLogoUrl}" alt="Company Logo" />` : '<div style="font-size: 24px; color: #2563eb;">🏢</div>'}
      </div>
      <div class="company-info">
        <div class="company-name">${safeString(profile?.companyName || 'Staffly Solutions')}</div>
        <div class="company-details">${safeString(profile?.companyAddress || '123 Business Avenue, City, State 12345')}</div>
        <div class="company-details">Phone: ${safeString(profile?.companyPhone || '+1 (555) 123-4567')}</div>
        <div class="company-details">Email: ${safeString(profile?.companyEmail || 'info@staffly.com')}</div>
        ${profile?.companyWebsite ? `<div class="company-details">Website: ${safeString(profile.companyWebsite)}</div>` : ''}
      </div>
    </div>
    <div class="header-center">
      <div class="quotation-title">QUOTATION</div>
      <div class="quotation-subtitle">Professional Quote</div>
    </div>
    <div class="header-right">
      <div class="quotation-number">${safeString(quotation.quotationNumber)}</div>
      <div>Date: ${safeDate(quotation.createdAt)}</div>
    </div>
  </div>
  
  <div class="info-section">
    <div class="info-column">
      <div class="info-item">
        <div class="info-label">Customer Name:</div>
        <div class="info-value">${safeString((quotation?.customerId as any)?.name || 'N/A')}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Customer Phone:</div>
        <div class="info-value">${safeString((quotation?.customerId as any)?.phone || 'N/A')}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Customer Email:</div>
        <div class="info-value">${safeString((quotation?.customerId as any)?.email || 'N/A')}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Customer Address:</div>
        <div class="info-value">${safeString((quotation?.customerId as any)?.address || 'N/A')}</div>
      </div>
    </div>
  </div>
  
  ${quotation.description ? `<div class="section"><div class="section-title">Description</div><div class="description-content">${safeString(quotation.description)}</div></div>` : ''}
  
  <div class="section">
    <div class="section-title">Items</div>
    <table class="items-table">
      <thead><tr><th>Description</th><th>Length</th><th>Width</th><th>Size (sq.ft)</th><th>Quantity</th><th>Total Size</th><th>Unit Price</th><th>Fixed Amount</th><th>Total</th></tr></thead>
      <tbody>
        ${(quotation.items || []).map(item => {
          const getDisplayValue = (value: any, condition: boolean) => {
            return condition ? (value || 0) : '';
          };
          
          return `<tr>
            <td>${safeString(item.description)}</td>
            <td>${getDisplayValue(item.length, item.type === 'length_width')}</td>
            <td>${getDisplayValue(item.width, item.type === 'length_width')}</td>
            <td>${getDisplayValue(item.totalSize, item.type === 'length_width')}</td>
            <td>${getDisplayValue(item.quantity, item.type === 'length_width' || item.type === 'quantity_only')}</td>
            <td>${getDisplayValue(item.totalSize, item.type === 'total_size')}</td>
            <td>${item.type !== 'fixed_amount' ? safeCurrency(item.unitPrice || 0) : ''}</td>
            <td>${item.type === 'fixed_amount' ? safeCurrency(item.fixedAmount || 0) : ''}</td>
            <td class="total-cell">${safeCurrency(item.total)}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="totals-section">
    <div class="total-item"><span class="total-label">Subtotal:</span><span class="total-value">${safeCurrency(quotation.subtotal)}</span></div>
    <div class="total-item"><span class="total-label">Tax Amount:</span><span class="total-value">${safeCurrency(quotation.taxAmount)}</span></div>
    <div class="total-item"><span class="total-label">Discount Amount:</span><span class="total-value">${safeCurrency(quotation.discountAmount)}</span></div>
    <div class="total-item grand-total"><span class="total-label">Total Amount:</span><span class="total-value">${safeCurrency(quotation.totalAmount)}</span></div>
  </div>
  
  ${quotation.notes ? `<div class="section"><div class="section-title">Notes</div><div class="notes-content">${safeString(quotation.notes)}</div></div>` : ''}
  ${quotation.terms ? `<div class="section"><div class="section-title">Terms & Conditions</div><div class="terms-content">${safeString(quotation.terms)}</div></div>` : ''}
  
  <div class="footer">
    <p>Thank you for your business!</p>
    <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
  </div>
</body>
</html>`;
}

// Utility function to handle the print process - Simplified version
export function printQuotation(quotation: Quotation, getCustomerName: (quotation: Quotation) => string, profile?: any): void {
  try {
    // Create a simple print window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Please allow popups to print the quotation');
    }

    // Generate print content
    const printContent = generateQuotationPrintContent({ quotation, getCustomerName, profile });
    
    // Write content and print immediately
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Simple print approach - no complex timeouts
    printWindow.focus();
    printWindow.print();
    
    // Close window after printing
    setTimeout(() => {
      if (printWindow && !printWindow.closed) {
        printWindow.close();
      }
    }, 1000);
    
  } catch (error) {
    console.error('Print error:', error);
    throw error;
  }
}
