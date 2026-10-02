'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DailyEntry } from '@/lib/types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/utils/constants';
import { toast } from 'sonner';

interface DailyEntryPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (entry: Omit<DailyEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  selectedDate: string;
}

export function DailyEntryPopup({ open, onOpenChange, onSubmit, selectedDate }: DailyEntryPopupProps) {
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    amount: 0,
    description: '',
    reference: '',
    paymentMethod: 'cash' as const,
    accountId: '1',
  });

  const mockAccounts = [
    { id: '1', name: 'Cash in Hand', type: 'cash' },
    { id: '2', name: 'HBL Current Account', type: 'bank' },
    { id: '3', name: 'UBL Savings Account', type: 'bank' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.category || formData.amount <= 0) {
      toast.error('Please fill all required fields');
      return;
    }

    const entry: Omit<DailyEntry, 'id' | 'createdAt' | 'updatedAt'> = {
      date: selectedDate,
      type: formData.type as any,
      category: formData.category,
      amount: formData.amount,
      description: formData.description,
      reference: formData.reference,
      paymentMethod: formData.paymentMethod,
      accountId: formData.accountId,
      attachments: [],
      status: formData.description ? 'approved' : 'pending',
      tags: [],
      createdBy: '1',
    };

    onSubmit(entry);
    
    // Reset form
    setFormData({
      type: '',
      category: '',
      amount: 0,
      description: '',
      reference: '',
      paymentMethod: 'cash',
      accountId: '1',
    });
    
    onOpenChange(false);
    toast.success('Entry added successfully');
  };

  const getCategoryOptions = () => {
    if (formData.type === 'customer_payment' || formData.type === 'sale') {
      return INCOME_CATEGORIES;
    } else {
      return [
        ...EXPENSE_CATEGORIES.OFFICE,
        ...EXPENSE_CATEGORIES.EMPLOYEE,
        ...EXPENSE_CATEGORIES.BUSINESS,
        ...EXPENSE_CATEGORIES.DIRECTOR,
      ];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Daily Entry</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Entry Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value, category: '' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select entry type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer_payment">Customer Payment</SelectItem>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="office_expense">Office Expense</SelectItem>
                <SelectItem value="salary_payment">Salary Payment</SelectItem>
                <SelectItem value="utility_bill">Utility Bill</SelectItem>
                <SelectItem value="director_expense">Director Expense</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="loan_payment">Loan Payment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              disabled={!formData.type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {getCategoryOptions().map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="card">Card Payment</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountId">Account *</Label>
            <Select
              value={formData.accountId}
              onValueChange={(value) => setFormData({ ...formData, accountId: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Reference</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              placeholder="Invoice number, receipt number, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about this entry"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              If description is empty, entry will be marked as pending for later completion
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Entry
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}