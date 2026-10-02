'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  fetchSalaryHistory,
  selectSalaryHistory,
  selectSalaryLoading,
  selectSalaryError,
  selectSelectedMonth,
  selectSelectedYear,
  setSelectedMonth,
  setSelectedYear,
  disburseSalary
} from '@/lib/store/slices/salarySlice';
import { 
  createTextColumn, 
  createCurrencyColumn, 
  createDateColumn,
  createBadgeColumn,
  createDataTableConfig,
  createActionsColumn
} from '@/lib/utils/dataTableUtils';
import { DataTable } from '@/components/ui/data-table';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';
import { toast } from 'sonner';
import { Receipt, DollarSign, CheckCircle, Clock, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { fetchDirectors } from '@/lib/store/slices/directorSlice';
import { useTranslations } from 'next-intl';

interface SalaryManagementProps {
  employees?: any[];
  month?: string;
  year?: number;
}

export function SalaryManagement({ employees, month, year }: SalaryManagementProps) {
  const t = useTranslations('Salary.management');
  const tDisburse = useTranslations('Salary.disburse');
  const tDetail = useTranslations('Salary.detail');
  const dispatch = useAppDispatch();
  const salaryHistory = useAppSelector(selectSalaryHistory);
  const directors = useAppSelector((state) => state.director.directors);
  const loading = useAppSelector(selectSalaryLoading);
  const error = useAppSelector(selectSalaryError);
  const selectedMonth = useAppSelector(selectSelectedMonth);
  const selectedYear = useAppSelector(selectSelectedYear);

  // State for salary detail dialog
  const [selectedSalary, setSelectedSalary] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // State for disbursement form
  const [isDisbursementDialogOpen, setIsDisbursementDialogOpen] = useState(false);
  const [disbursementForm, setDisbursementForm] = useState({
    salaryId: '',
    tillFrom: 'till' as 'till' | 'director',
    directorId: '',
    paymentMethod: 'cash' as 'cash' | 'bank'
  });

  // Fetch salary data when component mounts or filters change
  useEffect(() => {
    dispatch(fetchSalaryHistory({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  // Fetch directors when component mounts
  useEffect(() => {
    dispatch(fetchDirectors({}));
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleMonthChange = (month: string) => {
    dispatch(setSelectedMonth(parseInt(month)));
  };

  const handleYearChange = (year: string) => {
    dispatch(setSelectedYear(parseInt(year)));
  };

  const handleDisburseSalary = (salary: any) => {
    setDisbursementForm({
      salaryId: salary.salaryId,
      tillFrom: 'till',
      directorId: '',
      paymentMethod: 'cash'
    });
    setIsDisbursementDialogOpen(true);
  };

  const handleDisbursementSubmit = async () => {
    try {
      const disbursementData = {
        salaryId: disbursementForm.salaryId,
        tillFrom: disbursementForm.tillFrom,
        directorId: disbursementForm.tillFrom === 'director' ? disbursementForm.directorId : undefined,
        paymentMethod: disbursementForm.paymentMethod
      };

      await dispatch(disburseSalary(disbursementData)).unwrap();
      toast.success(tDisburse('success'));
      setIsDisbursementDialogOpen(false);
      
      // Refetch salary data to update the table
      dispatch(fetchSalaryHistory({ month: selectedMonth, year: selectedYear }));
    } catch (error: any) {
      toast.error(error || tDisburse('failed'));
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setDisbursementForm(prev => ({
      ...prev,
      [field]: value,
      // Reset directorId when tillFrom changes
      ...(field === 'tillFrom' && { directorId: '' })
    }));
  };

  const handleViewSalaryDetails = (salary: any) => {
    setSelectedSalary(salary);
    setIsDetailDialogOpen(true);
  };

  // Generate month options
  const monthOptions = [
    { value: '1', label: t('months.january') },
    { value: '2', label: t('months.february') },
    { value: '3', label: t('months.march') },
    { value: '4', label: t('months.april') },
    { value: '5', label: t('months.may') },
    { value: '6', label: t('months.june') },
    { value: '7', label: t('months.july') },
    { value: '8', label: t('months.august') },
    { value: '9', label: t('months.september') },
    { value: '10', label: t('months.october') },
    { value: '11', label: t('months.november') },
    { value: '12', label: t('months.december') },
  ];

  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = currentYear - 5 + i;
    return { value: year.toString(), label: year.toString() };
  });

  // Define table columns
  const columns = [
    createTextColumn<any>('employeeId.name', t('columns.employeeName'), (salary) => salary.employeeId.name, { width: 'w-48' }),
    createTextColumn<any>('employeeId.employeeId', t('columns.employeeId'), (salary) => salary.employeeId.employeeId, { width: 'w-32' }),
    createTextColumn<any>('employeeId.department', t('columns.department'), (salary) => salary.employeeId.department, { width: 'w-32' }),
    createCurrencyColumn<any>('basicSalary', t('columns.basicSalary'), (salary) => salary.basicSalary, { width: 'w-32' }),
    createCurrencyColumn<any>('overtimeAmount', t('columns.overtime'), (salary) => salary.overtimeAmount, { width: 'w-32' }),
    createCurrencyColumn<any>('grossSalary', t('columns.grossSalary'), (salary) => salary.grossSalary, { width: 'w-32' }),
    createCurrencyColumn<any>('netSalary', t('columns.netSalary'), (salary) => salary.netSalary, { width: 'w-32' }),
    createBadgeColumn<any>('status', t('columns.status'), (salary) => salary.status, { 
      variant: 'outline',
      width: 'w-24'
    }),
    createDateColumn<any>('createdAt', t('columns.generated'), (salary) => salary.createdAt, { width: 'w-32' }),
    {
      key: 'actions',
      header: t('columns.actions'),
      accessor: (salary: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewSalaryDetails(salary)}
          >
            <Eye className="h-4 w-4 mr-1" />
            {t('actions.view')}
          </Button>
          <Button
            variant={salary.status === 'paid' ? 'outline' : 'default'}
            size="sm"
            onClick={() => handleDisburseSalary(salary)}
            disabled={salary.status === 'paid'}
            className={salary.status === 'paid' ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <DollarSign className="h-4 w-4 mr-1" />
            {t('actions.disburse')}
          </Button>
        </div>
      ),
      width: 'w-40'
    },
  ];

  const tableConfig = createDataTableConfig(columns, [], {
    title: t('title'),
    subtitle: `Monthly salary slips for ${monthOptions.find(m => m.value === selectedMonth.toString())?.label || ''} ${selectedYear}`,
    searchable: true,
    searchPlaceholder: t('searchPlaceholder'),
    pagination: {
      enabled: true,
      pageSize: 20,
      pageSizeOptions: [10, 20, 50, 100]
    },
    sortable: true,
    exportOptions: {
      enablePrint: true,
      enablePDF: false,
      enableCSV: false,
      filename: `salary-history-${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`
    }
  });

  // Calculate totals
  const totalBasicSalary = salaryHistory.reduce((sum, salary) => sum + salary.basicSalary, 0);
  const totalOvertime = salaryHistory.reduce((sum, salary) => sum + salary.overtimeAmount, 0);
  const totalGrossSalary = salaryHistory.reduce((sum, salary) => sum + salary.grossSalary, 0);
  const totalNetSalary = salaryHistory.reduce((sum, salary) => sum + salary.netSalary, 0);
  const pendingCount = salaryHistory.filter(salary => salary.status === 'pending').length;
  const paidCount = salaryHistory.filter(salary => salary.status === 'paid').length;

  return (
    <div className="space-y-5">
      {/* Compact Month/Year Selection */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-slate-800 dark:text-slate-100">
            <Receipt className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="month" className="text-xs font-medium mb-1.5 block text-slate-700 dark:text-slate-300">{t('month')}</Label>
              <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
                <SelectTrigger className="h-9 border-slate-300 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400">
                  <SelectValue placeholder={t('selectMonth')} />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="year" className="text-xs font-medium mb-1.5 block text-slate-700 dark:text-slate-300">{t('year')}</Label>
              <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="h-9 border-slate-300 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400">
                  <SelectValue placeholder={t('selectYear')} />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compact Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-blue-300/40 dark:hover:border-blue-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.totalBasicSalary')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalBasicSalary)}</p>
              </div>
              <div className="bg-blue-500 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-green-300/40 dark:hover:border-green-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.totalNetSalary')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalNetSalary)}</p>
              </div>
              <div className="bg-green-500 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-yellow-300/40 dark:hover:border-yellow-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.pendingPayments')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{pendingCount}</p>
              </div>
              <div className="bg-yellow-500 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-purple-300/40 dark:hover:border-purple-600/40 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('stats.paidSalaries')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{paidCount}</p>
              </div>
              <div className="bg-purple-500 p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Receipt className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Data Table */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-medium mb-2">{t('loading')}</h3>
                <p className="text-muted-foreground">{t('loadingDescription')}</p>
              </div>
            </div>
          ) : salaryHistory && salaryHistory.length > 0 ? (
            <DataTable
              data={salaryHistory}
              {...tableConfig}
              loading={loading}
              emptyMessage={t('noRecordsDescription', { 
                month: monthOptions.find(m => m.value === selectedMonth.toString())?.label || '', 
                year: selectedYear 
              })}
            />
          ) : (
            <div className="text-center py-8">
              <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">{t('noRecords')}</h3>
              <p className="text-muted-foreground">
                {t('noRecordsDescription', { 
                  month: monthOptions.find(m => m.value === selectedMonth.toString())?.label || '', 
                  year: selectedYear 
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Salary Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              {tDetail('title')} - {selectedSalary?.employeeId?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedSalary && (
            <div className="space-y-6">
              {/* Employee Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{tDetail('employeeInfo')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{tDetail('employeeName')}</p>
                      <p className="text-foreground font-medium">{selectedSalary.employeeId.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{tDetail('employeeId')}</p>
                      <p className="text-foreground">{selectedSalary.employeeId.employeeId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{tDetail('department')}</p>
                      <p className="text-foreground">{selectedSalary.employeeId.department}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{tDetail('position')}</p>
                      <p className="text-foreground">{selectedSalary.employeeId.position}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{tDetail('email')}</p>
                      <p className="text-foreground">{selectedSalary.employeeId.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{tDetail('salaryPeriod')}</p>
                      <p className="text-foreground">{selectedSalary.month}/{selectedSalary.year}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Salary Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{tDetail('salaryBreakdown')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Salary & Overtime */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">{tDetail('basicSalary')}</span>
                        <span className="font-bold text-blue-600">{formatCurrency(selectedSalary.basicSalary)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">{tDetail('overtimeAmount')}</span>
                        <span className="font-bold text-green-600">{formatCurrency(selectedSalary.overtimeAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium">{tDetail('grossSalary')}</span>
                        <span className="font-bold text-purple-600">{formatCurrency(selectedSalary.grossSalary)}</span>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-red-600">{tDetail('deductions')}</h4>
                      {selectedSalary.deduction && selectedSalary.deduction.length > 0 ? (
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {selectedSalary.deduction.map((deduction: any, index: number) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded border-l-4 border-red-200">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{deduction.reason}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(deduction.date)}
                                </p>
                              </div>
                              <span className="font-medium text-red-600">-{formatCurrency(deduction.amount)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">{tDetail('noDeductions')}</p>
                      )}
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border-t">
                        <span className="font-medium">{tDetail('totalDeductions')}</span>
                        <span className="font-bold text-red-600">
                          -{formatCurrency(selectedSalary.deduction?.reduce((sum: number, d: any) => sum + d.amount, 0) || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Net Salary */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">{tDetail('netSalary')}</span>
                      <span className="text-2xl font-bold text-green-600">{formatCurrency(selectedSalary.netSalary)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status & Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{tDetail('paymentInfo')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{tDetail('status')}</p>
                      <Badge 
                        variant={selectedSalary.status === 'paid' ? 'default' : 'secondary'}
                        className={selectedSalary.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {selectedSalary.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{tDetail('paymentDate')}</p>
                      <p className="text-foreground">
                        {selectedSalary.paymentDate ? formatDate(selectedSalary.paymentDate) : tDetail('notPaidYet')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{tDetail('generatedOn')}</p>
                      <p className="text-foreground">{formatDate(selectedSalary.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{tDetail('lastUpdated')}</p>
                      <p className="text-foreground">{formatDate(selectedSalary.updatedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Remarks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{tDetail('remarks')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedSalary.remarks}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Disbursement Form Dialog */}
      <Dialog open={isDisbursementDialogOpen} onOpenChange={setIsDisbursementDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {tDisburse('title')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Till From Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{tDisburse('paymentSource')}</Label>
              <Select 
                value={disbursementForm.tillFrom} 
                onValueChange={(value: 'till' | 'director') => handleFormChange('tillFrom', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={tDisburse('selectPaymentSource')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="till">{tDisburse('till')}</SelectItem>
                  <SelectItem value="director">{tDisburse('director')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Director Selection (conditional) */}
            {disbursementForm.tillFrom === 'director' && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">{tDisburse('selectDirector')}</Label>
                <Select 
                  value={disbursementForm.directorId} 
                  onValueChange={(value) => handleFormChange('directorId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={tDisburse('selectDirector')} />
                  </SelectTrigger>
                  <SelectContent>
                    {directors.map((director: any) => (
                      <SelectItem key={director.directorId} value={director.directorId}>
                        {director.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{tDisburse('paymentMethod')}</Label>
              <RadioGroup 
                value={disbursementForm.paymentMethod} 
                onValueChange={(value: 'cash' | 'bank') => handleFormChange('paymentMethod', value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">{tDisburse('cash')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank">{tDisburse('bank')}</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsDisbursementDialogOpen(false)}
              >
                {tDisburse('cancel')}
              </Button>
              <Button 
                onClick={handleDisbursementSubmit}
                disabled={loading || (disbursementForm.tillFrom === 'director' && !disbursementForm.directorId)}
              >
                {loading ? tDisburse('processing') : tDisburse('disburse')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}