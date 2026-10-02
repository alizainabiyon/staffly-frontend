'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, 
  FileText, 
  Users, 
  Building,
  Download,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { fetchEmployees } from '@/lib/store/slices/employeeSlice';
import { fetchDirectors } from '@/lib/store/slices/directorSlice';
import { 
  generateExpenseReport, 
  clearExpenseReport,
  selectExpenseReport,
  selectExpenseReportLoading,
  selectExpenseReportError,
  selectReportGenerated,
  selectExpenseReportItems,
  selectTotalAmount
} from '@/lib/store/slices/reportsSlice';
import { 
  createTextColumn, 
  createCurrencyColumn, 
  createDateColumn,
  createBadgeColumn,
  createDataTableConfig
} from '@/lib/utils/dataTableUtils';

interface ExpenseReportItem {
  _id: string;
  expenseId: string;
  userID: string;
  expenseDate: string;
  catagory: string;
  type: string;
  description: string;
  amount: number;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export function ExpenseReportComponent() {
  const dispatch = useAppDispatch();
  const [category, setCategory] = useState<string>('');
  const [directorId, setDirectorId] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  // Redux selectors
  const employees = useAppSelector((state) => state.employees.employees);
  const directors = useAppSelector((state) => state.director.directors);
  const loading = useAppSelector(selectExpenseReportLoading);
  const error = useAppSelector(selectExpenseReportError);
  const reportGenerated = useAppSelector(selectReportGenerated);
  const expenseData = useAppSelector(selectExpenseReportItems);
  const totalAmount = useAppSelector(selectTotalAmount);

  // Fetch employees and directors data
  useEffect(() => {
    dispatch(fetchEmployees({}));
    dispatch(fetchDirectors({}));
  }, [dispatch]);

  // Handle errors from Redux
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    // Reset dependent fields when category changes
    setDirectorId('');
    setEmployeeId('');
    dispatch(clearExpenseReport());
  };

  const generateReport = async () => {
    if (!category) {
      toast.error('Please select a category');
      return;
    }

    if (!fromDate || !toDate) {
      toast.error('Please select from date and to date');
      return;
    }

    try {
      const result = await dispatch(generateExpenseReport({
        catagory: category,
        fromDate,
        toDate,
        ...(category === 'director' && directorId && { directorId }),
        ...(category === 'employee' && employeeId && { employeeId })
      })).unwrap();

      toast.success('Expense report generated successfully');
    } catch (error) {
      console.error('Error generating expense report:', error);
      toast.error(error as string || 'Failed to generate expense report');
    }
  };

  const resetForm = () => {
    setCategory('');
    setDirectorId('');
    setEmployeeId('');
    setFromDate('');
    setToDate('');
    dispatch(clearExpenseReport());
  };

  // Data table configuration
  const columns = [
      
      createTextColumn<ExpenseReportItem>(
        'description',
        'Description',
        (item) => item.description,
        { width: 'w-64' }
      ),
    createTextColumn<ExpenseReportItem>(
      'type',
      'Type',
      (item) => item.type,
      { width: 'w-32' }
    ),
    createCurrencyColumn<ExpenseReportItem>(
      'amount',
      'Amount',
      (item) => item.amount,
      { width: 'w-32' }
    ),
    createDateColumn<ExpenseReportItem>(
      'expenseDate',
      'Expense Date',
      (item) => item.expenseDate,
      { width: 'w-36' }
    ),
  ];

  const dataTableConfig = createDataTableConfig(columns, [], {
    title: 'Expense Report Results',
    subtitle: `Total Amount: ₨${totalAmount.toLocaleString()}`,
    searchable: true,
    searchPlaceholder: 'Search expenses...',
    pagination: {
      enabled: true,
      pageSize: 20,
      pageSizeOptions: [10, 20, 50, 100]
    },
    exportOptions: {
      enablePrint: true,
      enablePDF: false,
      enableCSV: false,
      filename: 'expense-report'
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Expense Report</h1>
          <p className="text-muted-foreground">
            Generate comprehensive expense reports by category
          </p>
        </div>
      </div>

      {/* Compact Report Configuration */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            {/* Category Selection */}
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="category" className="text-sm font-medium mb-1 block">Category *</Label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Office
                    </div>
                  </SelectItem>
                  <SelectItem value="director">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Director
                    </div>
                  </SelectItem>
                  <SelectItem value="employee">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Employee
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Director Selection - Only show when director category is selected */}
            {category === 'director' && (
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="director" className="text-sm font-medium mb-1 block">Director</Label>
                <Select value={directorId} onValueChange={setDirectorId}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select director" />
                  </SelectTrigger>
                  <SelectContent>
                    {directors.map((director) => (
                      <SelectItem key={director.directorId} value={director.directorId}>
                        {director.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Employee Selection - Only show when employee category is selected */}
            {category === 'employee' && (
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="employee" className="text-sm font-medium mb-1 block">Employee</Label>
                <Select value={employeeId} onValueChange={setEmployeeId}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Date Range Selection */}
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="fromDate" className="text-sm font-medium mb-1 block">From Date *</Label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="toDate" className="text-sm font-medium mb-1 block">To Date *</Label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Generate Button */}
            <div className="flex gap-2">
              <Button onClick={generateReport} disabled={loading} size="sm" className="h-9">
                <FileText className="h-4 w-4 mr-2" />
                {loading ? 'Generating...' : 'Generate'}
              </Button>
              <Button variant="outline" onClick={resetForm} size="sm" className="h-9">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Results */}
      {reportGenerated && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Report Results
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-lg font-semibold">
                  Total: ₨{totalAmount.toLocaleString()}
                </Badge>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenseData.length > 0 ? (
              <DataTable
                data={expenseData}
                columns={dataTableConfig.columns}
                title={dataTableConfig.title}
                subtitle={dataTableConfig.subtitle}
                searchable={dataTableConfig.searchable}
                searchPlaceholder={dataTableConfig.searchPlaceholder}
                pagination={dataTableConfig.pagination}
                exportOptions={dataTableConfig.exportOptions}
              />
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No expenses found</h3>
                <p className="text-muted-foreground">
                  No expense records found for the selected criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
