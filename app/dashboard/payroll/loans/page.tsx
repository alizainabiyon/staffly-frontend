'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Plus, DollarSign, Users, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchEmployees, selectEmployees } from '@/lib/store/slices/employeeSlice';

export default function LoansPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const employees = useAppSelector(selectEmployees);

  useEffect(() => {
    dispatch(fetchEmployees({}));
  }, [dispatch]);

  const handleBackToPayroll = () => {
    router.push('/dashboard/payroll');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBackToPayroll}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Payroll
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Loans & Advances</h1>
            <p className="text-muted-foreground">
              Manage employee loans, advances, and payment schedules
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <DollarSign className="h-4 w-4 mr-2" />
            Process Advance
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Loan
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Loans</p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Outstanding</p>
                <p className="text-2xl font-bold text-foreground">$0</p>
              </div>
              <div className="bg-red-500 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Due This Month</p>
                <p className="text-2xl font-bold text-foreground">$0</p>
              </div>
              <div className="bg-orange-500 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Employees with Loans</p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loans Management */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Active Loans</h3>
            <p className="text-muted-foreground mb-6">
              Start by creating a new loan or advance for an employee
            </p>
            <div className="flex justify-center gap-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Loan
              </Button>
              <Button variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Process Advance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Loan Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No recent transactions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}