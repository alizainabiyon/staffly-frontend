import { VendorOrder } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';

interface PrintVendorOrderTemplateProps {
  vendorOrder: VendorOrder;
  getVendorName: (vendorOrder: VendorOrder) => string;
}

export function generateVendorOrderPrintContent({ vendorOrder, getVendorName }: PrintVendorOrderTemplateProps): string {
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
  <title>Vendor Order - ${safeString(vendorOrder.orderNumber)}</title>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 20px; 
      line-height: 1.4; 
      color: #333;
    }
    .header { 
      text-align: center; 
      border-bottom: 2px solid #2563eb; 
      padding-bottom: 15px; 
      margin-bottom: 20px; 
    }
    .company-name { 
      font-size: 24px; 
      font-weight: bold; 
      color: #2563eb; 
      margin-bottom: 3px; 
    }
    .order-title { 
      font-size: 16px; 
      color: #666; 
      margin-top: 5px; 
    }
    .info-section { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
      gap: 15px; 
      margin-bottom: 20px; 
      padding: 15px; 
      background: #f8fafc; 
      border-radius: 6px; 
    }
    .info-item { }
    .info-label { 
      font-weight: bold; 
      color: #374151; 
      font-size: 12px; 
      margin-bottom: 3px; 
    }
    .info-value { 
      color: #111827; 
      font-size: 14px; 
    }
    .section { 
      margin-bottom: 20px; 
    }
    .section-title { 
      font-size: 16px; 
      font-weight: bold; 
      color: #111827; 
      border-bottom: 1px solid #e5e7eb; 
      padding-bottom: 8px; 
      margin-bottom: 15px; 
    }
    .items-table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-bottom: 15px; 
      font-size: 12px; 
    }
    .items-table th, .items-table td { 
      border: 1px solid #d1d5db; 
      padding: 8px; 
      text-align: left; 
    }
    .items-table th { 
      background-color: #f3f4f6; 
      font-weight: bold; 
      color: #374151; 
    }
    .items-table tr:nth-child(even) { 
      background-color: #f9fafb; 
    }
    .totals-section { 
      margin-top: 15px; 
      padding: 15px; 
      background: #f8fafc; 
      border-radius: 6px; 
    }
    .total-item { 
      display: flex; 
      justify-content: space-between; 
      padding: 6px 0; 
      border-bottom: 1px solid #e5e7eb; 
    }
    .total-label { 
      font-weight: 600; 
      color: #374151; 
    }
    .total-value { 
      font-weight: 600; 
      color: #111827; 
    }
    .grand-total { 
      font-size: 16px; 
      font-weight: bold; 
      color: #059669; 
      border-top: 2px solid #059669; 
      padding-top: 8px; 
      margin-top: 8px; 
    }
    .notes-section, .terms-section { 
      margin-top: 20px; 
      padding: 15px; 
      background: #f8fafc; 
      border-radius: 6px; 
    }
    .footer { 
      margin-top: 25px; 
      text-align: center; 
      color: #6b7280; 
      font-size: 12px; 
      border-top: 1px solid #e5e7eb; 
      padding-top: 15px; 
    }
    @media print { 
      body { margin: 10px; } 
      .header { margin-bottom: 15px; } 
      .section { margin-bottom: 15px; } 
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">Staffly Solutions</div>
    <div class="order-title">VENDOR ORDER</div>
  </div>
  
  <div class="info-section">
    <div class="info-item">
      <div class="info-label">Order Number:</div>
      <div class="info-value">${safeString(vendorOrder.orderNumber)}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Vendor Name:</div>
      <div class="info-value">${safeString((vendorOrder?.vendorId as any)?.name || 'N/A')}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Vendor Company:</div>
      <div class="info-value">${safeString((vendorOrder?.vendorId as any)?.companyName || 'N/A')}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Vendor Phone:</div>
      <div class="info-value">${safeString((vendorOrder?.vendorId as any)?.phone || 'N/A')}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Vendor Email:</div>
      <div class="info-value">${safeString((vendorOrder?.vendorId as any)?.email || 'N/A')}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Vendor Address:</div>
      <div class="info-value">${safeString((vendorOrder?.vendorId as any)?.address || 'N/A')}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Status:</div>
      <div class="info-value">${safeString(vendorOrder.status)}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Order Date:</div>
      <div class="info-value">${safeDate(vendorOrder.createdAt)}</div>
    </div>
  </div>
  
  ${vendorOrder.description ? `<div class="section"><div class="section-title">Description</div><div class="info-value">${safeString(vendorOrder.description)}</div></div>` : ''}
  
  <div class="section">
    <div class="section-title">Items</div>
    <table class="items-table">
      <thead><tr><th>Description</th><th>Width</th><th>Height</th><th>Size Sq.ft</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr></thead>
      <tbody>
        ${(vendorOrder.items || []).map(item => `<tr><td>${safeString(item.description)}</td><td>${safeString(item.width)}</td><td>${safeString(item.height)}</td><td>${safeString(item.size)}</td><td>${safeString(item.quantity)}</td><td>${safeCurrency(item.unitPrice)}</td><td>${safeCurrency(item.total)}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="totals-section">
    <div class="total-item"><span class="total-label">Subtotal:</span><span class="total-value">${safeCurrency(vendorOrder.subtotal)}</span></div>
    <div class="total-item"><span class="total-label">Tax Amount:</span><span class="total-value">${safeCurrency(vendorOrder.taxAmount)}</span></div>
    <div class="total-item"><span class="total-label">Discount Amount:</span><span class="total-value">${safeCurrency(vendorOrder.discountAmount)}</span></div>
    <div class="total-item grand-total"><span class="total-label">Total Amount:</span><span class="total-value">${safeCurrency(vendorOrder.totalAmount)}</span></div>
  </div>
  
  ${vendorOrder.notes ? `<div class="section"><div class="section-title">Notes</div><div class="info-value">${safeString(vendorOrder.notes)}</div></div>` : ''}
  ${vendorOrder.terms ? `<div class="section"><div class="section-title">Terms & Conditions</div><div class="info-value">${safeString(vendorOrder.terms)}</div></div>` : ''}
  
  <div class="footer">
    <p>Thank you for your business!</p>
    <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
  </div>
</body>
</html>`;
}

// Utility function to handle the print process - Simplified version
export function printVendorOrder(vendorOrder: VendorOrder, getVendorName: (vendorOrder: VendorOrder) => string): void {
  try {
    // Create a simple print window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Please allow popups to print the vendor order');
    }

    // Generate print content
    const printContent = generateVendorOrderPrintContent({ vendorOrder, getVendorName });
    
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
