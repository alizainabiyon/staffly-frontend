'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X, Calendar, DollarSign, User, Building, FileText, MapPin, CreditCard, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { DailyEntry } from '@/lib/types/entries';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';

interface EntryDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  entry: DailyEntry | null;
  loading: boolean;
}

export function EntryDetailPopup({ isOpen, onClose, entry, loading }: EntryDetailPopupProps) {
  if (!entry) return null;

  // Helper function to safely extract display value from ID fields
  const getDisplayValue = (idField: string | { _id: string; [key: string]: string } | undefined): string => {
    if (!idField) return '';
    if (typeof idField === 'string') return idField;
    if (typeof idField === 'object') {
      return idField.name || idField.customerId || idField.vendorId || idField.employeeId || idField.directorId || idField.contractorId || 'Unknown';
    }
    return 'Unknown';
  };

  const getPaymentTypeColor = (type: string) => {
    return type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getClearStatusColor = (status: string) => {
    switch (status) {
      case 'cleared':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getEntryTypeIcon = (type: string) => {
    switch (type) {
      case 'customer':
        return <User className="h-4 w-4" />;
      case 'vendor':
        return <Building className="h-4 w-4" />;
      case 'expense':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getDestinationTypeIcon = (type: string) => {
    switch (type) {
      case 'till':
        return <DollarSign className="h-4 w-4" />;
      case 'director':
        return <User className="h-4 w-4" />;
      case 'vendor':
        return <Building className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Entry Details
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-green-600 font-medium">Loading entry details...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Information */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {getEntryTypeIcon(entry.entryType)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {entry.entryNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Created on {entry.createdAt ? formatDate(entry.createdAt) : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(entry.amount)}
                    </div>
                    <Badge className={getPaymentTypeColor(entry.paymentType)}>
                      {entry.paymentType === 'credit' ? 'Receive' : 'Send'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Basic Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Entry Type</span>
                      <Badge variant="outline" className="capitalize">
                        {entry.entryType}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Payment Method</span>
                      <Badge variant="outline" className="capitalize">
                        {entry.paymentMethod}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Entry Date</span>
                      <span className="text-sm text-gray-900">
                        {formatDate(entry.entryDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Status</span>
                      <Badge className={getStatusColor(entry.status)}>
                        {entry.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Purpose & Description */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Purpose & Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600 block mb-1">Purpose</span>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                        {entry.purpose || 'No purpose specified'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 block mb-1">Description</span>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                        {entry.description || 'No description provided'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Related Entities */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-600" />
                      Related Entities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {entry.customerId && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Customer</span>
                        <span className="text-sm text-gray-900 bg-blue-50 px-2 py-1 rounded">
                          {getDisplayValue(entry.customerId)}
                        </span>
                      </div>
                    )}
                    {entry.vendorId && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Vendor</span>
                        <span className="text-sm text-gray-900 bg-orange-50 px-2 py-1 rounded">
                          {getDisplayValue(entry.vendorId)}
                        </span>
                      </div>
                    )}
                    {entry.employeeId && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Employee</span>
                        <span className="text-sm text-gray-900 bg-green-50 px-2 py-1 rounded">
                          {getDisplayValue(entry.employeeId)}
                        </span>
                      </div>
                    )}
                    {entry.directorId && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Director</span>
                        <span className="text-sm text-gray-900 bg-purple-50 px-2 py-1 rounded">
                          {getDisplayValue(entry.directorId)}
                        </span>
                      </div>
                    )}
                    {entry.contractorId && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Contractor</span>
                        <span className="text-sm text-gray-900 bg-indigo-50 px-2 py-1 rounded">
                          {getDisplayValue(entry.contractorId)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Expense Details (if applicable) */}
                {entry.entryType === 'expense' && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-red-600" />
                        Expense Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {entry.expenseCategory && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Category</span>
                          <Badge variant="outline" className="capitalize">
                            {entry.expenseCategory}
                          </Badge>
                        </div>
                      )}
                      {entry.expenseType && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Type</span>
                          <Badge variant="outline" className="capitalize">
                            {entry.expenseType}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Destination Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-indigo-600" />
                      Destination
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Type</span>
                      <Badge variant="outline" className="capitalize">
                        {entry.destinationType}
                      </Badge>
                    </div>
                    {entry.destinationDirectorId && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Director ID</span>
                        <span className="text-sm text-gray-900 bg-purple-50 px-2 py-1 rounded">
                          {getDisplayValue(entry.destinationDirectorId)}
                        </span>
                      </div>
                    )}
                    {entry.destinationVendorId && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Vendor ID</span>
                        <span className="text-sm text-gray-900 bg-orange-50 px-2 py-1 rounded">
                          {getDisplayValue(entry.destinationVendorId)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Clear Status */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {entry.entryClearStatus === 'cleared' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    )}
                    <span className="text-sm font-medium text-gray-600">Clear Status</span>
                  </div>
                  <Badge className={getClearStatusColor(entry.entryClearStatus)}>
                    {entry.entryClearStatus}
                  </Badge>
                  {entry.entryClearDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Cleared on {formatDate(entry.entryClearDate)}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Currency */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Currency</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {entry.currency || 'USD'}
                  </span>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Notes</span>
                  </div>
                  <p className="text-sm text-gray-900">
                    {entry.notes || 'No notes available'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                <p>Created by: {entry.createdBy}</p>
                {entry.updatedBy && <p>Updated by: {entry.updatedBy}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
