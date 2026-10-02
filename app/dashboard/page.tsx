'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { 
  fetchRemainingBalance,
  selectRemainingBalance,
  selectRemainingBalanceLoading,
  selectRemainingBalanceError
} from '@/lib/store/slices/reportsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Line, Bar, Pie } from 'recharts';
import {
  LineChart,
  BarChart,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { useTranslations } from 'next-intl';

const revenueData = [
  { month: 'Jan', revenue: 0, expenses: 0 },
  { month: 'Feb', revenue: 0, expenses: 0 },
  { month: 'Mar', revenue: 0, expenses: 0 },
  { month: 'Apr', revenue: 0, expenses: 0 },
  { month: 'May', revenue: 0, expenses: 0 },
  { month: 'Jun', revenue: 0, expenses: 0 },
];

const departmentData = [
  { name: 'Sales', value: 0, count: 0 },
  { name: 'Marketing', value: 0, count: 0 },
  { name: 'Development', value: 0, count: 0 },
  { name: 'Support', value: 0, count: 0 },
  { name: 'Admin', value: 0, count: 0 },
];

const COLORS = ['#059669', '#0ea5e9', '#f97316', '#8b5cf6', '#ef4444'];

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const remainingBalance = useAppSelector(selectRemainingBalance);
  const remainingBalanceLoading = useAppSelector(selectRemainingBalanceLoading);
  const remainingBalanceError = useAppSelector(selectRemainingBalanceError);
  const t = useTranslations('Dashboard');

  // Fetch remaining balance data on component mount
  useEffect(() => {
    dispatch(fetchRemainingBalance());
  }, [dispatch]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: t('stats.incomingFromCustomers'),
      value: remainingBalance ? formatCurrency(remainingBalance.totalAmountIncommingFromCustomers) : '₨ 0',
      change: t('stats.pending'),
      changeType: 'positive' as const,
      icon: ArrowUpRight,
      color: 'bg-green-500'
    },
    {
      title: t('stats.outgoingToVendors'),
      value: remainingBalance ? formatCurrency(remainingBalance.totalAmountOutgoingToVendors) : '₨ 0',
      change: t('stats.due'),
      changeType: 'negative' as const,
      icon: ArrowDownRight,
      color: 'bg-red-500'
    },
    {
      title: t('stats.totalInTill'),
      value: remainingBalance ? formatCurrency(remainingBalance.totalAmountInTill) : '₨ 0',
      change: t('stats.available'),
      changeType: remainingBalance && remainingBalance.totalAmountInTill >= 0 ? 'positive' as const : 'negative' as const,
      icon: Wallet,
      color: remainingBalance && remainingBalance.totalAmountInTill >= 0 ? 'bg-blue-500' : 'bg-orange-500'
    },
    {
      title: t('stats.cashInTill'),
      value: remainingBalance ? formatCurrency(remainingBalance.totalCashInTill) : '₨ 0',
      change: t('stats.cash'),
      changeType: remainingBalance && remainingBalance.totalCashInTill >= 0 ? 'positive' as const : 'negative' as const,
      icon: DollarSign,
      color: remainingBalance && remainingBalance.totalCashInTill >= 0 ? 'bg-green-600' : 'bg-red-600'
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'invoice',
      message: t('activities.newInvoice', { company: 'Textile Mills Ltd.' }),
      time: t('activities.timeAgo.hours', { count: 2 }),
      status: 'success'
    },
    {
      id: 2,
      type: 'payroll',
      message: t('activities.payrollProcessed', { count: 234 }),
      time: t('activities.timeAgo.hours', { count: 4 }),
      status: 'success'
    },
    {
      id: 3,
      type: 'customer',
      message: t('activities.newCustomer', { company: 'ABC Trading Co.' }),
      time: t('activities.timeAgo.days', { count: 1 }),
      status: 'info'
    },
    {
      id: 4,
      type: 'payment',
      message: t('activities.paymentOverdue', { company: 'Steel Works Pvt Ltd.' }),
      time: t('activities.timeAgo.days', { count: 2 }),
      status: 'warning'
    },
  ];

  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('title')}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/20 text-xs font-medium">
            {user?.role?.toUpperCase()}
          </Badge>
          <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </Badge>
        </div>
      </div>

      {/* Compact Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {remainingBalanceLoading ? (
          // Loading state for all cards
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
                    <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-1.5"></div>
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-2/3"></div>
                  </div>
                  <div className="w-11 h-11 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : remainingBalanceError ? (
          // Error state
          <div className="col-span-full">
            <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
              <CardContent className="p-5 text-center">
                <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-red-600 dark:text-red-400 mb-1.5">{t('error.loadingData')}</h3>
                <p className="text-sm text-red-600/80 dark:text-red-400/80">{remainingBalanceError}</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Normal state with data
          stats.map((stat, index) => (
            <Card key={index} className="group border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm hover:shadow-md hover:border-emerald-300/40 dark:hover:border-emerald-600/40 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{stat.title}</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stat.value}</p>
                    <p className={`text-xs font-medium flex items-center gap-1 ${
                      stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`${stat.color} p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Compact Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              {t('charts.revenueVsExpenses')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 11 }}
                  className="text-slate-600 dark:text-slate-400"
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  className="text-slate-600 dark:text-slate-400"
                />
                <Tooltip 
                  formatter={(value: number) => [`₨ ${(value / 1000)}K`, '']}
                  contentStyle={{ 
                    fontSize: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgb(226 232 240)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#059669" 
                  strokeWidth={2.5}
                  name={t('charts.revenue')}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#f97316" 
                  strokeWidth={2.5}
                  name={t('charts.expenses')}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              {t('charts.employeeDistribution')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    fontSize: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgb(226 232 240)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Compact Recent Activities */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            {t('recentActivities')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2.5">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="group flex items-start gap-3 p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/40 dark:border-slate-700/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 hover:border-emerald-300/40 dark:hover:border-emerald-600/40 transition-all duration-200">
                <div className={`p-1.5 rounded-lg ${
                  activity.status === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  activity.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                }`}>
                  {activity.status === 'success' ? (
                    <CheckCircle className="h-3.5 w-3.5" />
                  ) : activity.status === 'warning' ? (
                    <AlertCircle className="h-3.5 w-3.5" />
                  ) : (
                    <FileText className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-tight">{activity.message}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}