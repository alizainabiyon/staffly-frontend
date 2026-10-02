'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Download,
  FileText,
  DollarSign,
  Receipt,
  TrendingUp,
  Filter,
  Calendar
} from 'lucide-react';
import { AllEntriesTable } from '@/components/daily-entries/AllEntriesTable';

export default function AllEntriesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const entryStats = [
    {
      title: 'Total Entries',
      value: '156',
      icon: FileText,
      color: 'bg-primary'
    },
    {
      title: 'Total Income',
      value: '₨ 12.5L',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Total Expenses',
      value: '₨ 8.8L',
      icon: Receipt,
      color: 'bg-red-500'
    },
    {
      title: 'Net Amount',
      value: '₨ 3.7L',
      icon: DollarSign,
      color: 'bg-blue-500'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Entries</h1>
          <p className="text-muted-foreground">
            View and manage all financial transactions and activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
          />
        </div>
      </div> */}

      {/* Stats */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {entryStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}

      {/* All Entries Table */}
      <AllEntriesTable 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
    </div>
  );
}
