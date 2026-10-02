'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { logoutUser } from '@/lib/store/slices/authSlice';
import { fetchProfile } from '@/lib/store/slices/profileSlice';
import { 
  LayoutDashboard,
  Users,
  Building,
  DollarSign,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Bell,
  Moon,
  Sun,
  Wallet,
  PlusCircle,
  ChevronDown,
  ChevronRight,
  UserCheck,
  Receipt,
  Clock,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [currentLocale, setCurrentLocale] = useState('en');
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: any) => state.auth);
  const { profile } = useAppSelector((state: any) => state.profile);
  const t = useTranslations('Navigation');

  // Get current locale from cookies
  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return 'en';
    };
    setCurrentLocale(getCookie('locale') || 'en');
  }, []);
  
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const { theme, setTheme } = useTheme();

  const handleLanguageChange = (locale: string) => {
    // Set the locale cookie
    document.cookie = `locale=${locale}; path=/; max-age=31536000`;
    // Reload the page to apply the new locale
    window.location.reload();
  };

  const navigation = [
    {
      name: t('dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: t('payroll'),
      href: '/dashboard/payroll',
      icon: Users,
      hasSubMenu: true,
      subItems: [
        {
          name: t('employees'),
          href: '/dashboard/payroll/employees',
          icon: UserCheck,
        },
        {
          name: t('salarySlips'),
          href: '/dashboard/payroll/salary-slips',
          icon: Receipt,
        },
        {
          name: t('attendance'),
          href: '/dashboard/payroll/attendance',
          icon: Clock,
        },
        // {
        //   name: t('loans'),
        //   href: '/dashboard/payroll/loans',
        //   icon: CreditCard,
        // },
      ],
    },
    {
      name: t('crm'),
      href: '/dashboard/crm',
      icon: Building,
      hasSubMenu: true,
      subItems: [
        {
          name: t('customers'),
          href: '/dashboard/crm/customers',
          icon: Users,
        },
        {
          name: t('contractors'),
          href: '/dashboard/crm/contractors',
          icon: Building,
        },
        {
          name: t('vendors'),
          href: '/dashboard/crm/vendors',
          icon: Building,
        },
        // {
        //   name: t('ledger'),
        //   href: '/dashboard/crm/ledger',
        //   icon: FileText,
        // },
      ],
    },
    {
      name: t('finance'),
      href: '/dashboard/finance',
      icon: DollarSign,
      hasSubMenu: true,
      subItems: [
        {
          name: t('quotations'),
          href: '/dashboard/finance/quotations',
          icon: Building,
        },
        {
          name: t('invoices'),
          href: '/dashboard/finance/invoices',
          icon: Users,
        },
        {
          name: t('vendorOrders'),
          href: '/dashboard/finance/vendor-orders',
          icon: FileText,
        },
      ],
    },
    {
      name: t('directors'),
      href: '/dashboard/directors',
      icon: FileText,
    },
    {
      name: t('till'),
      href: '/dashboard/till',
      icon: Wallet,
    },
    {
      name: t('entries'),
      href: '/dashboard/entries',
      icon: PlusCircle,
      hasSubMenu: true,
      subItems: [
        {
          name: t('todayEntries'),
          href: '/dashboard/entries',
          icon: Calendar,
        },
        {
          name: t('allEntries'),
          href: '/dashboard/entries/all',
          icon: FileText,
        },
      ],
    },
    {
      name: t('reports'),
      href: '/dashboard/reports',
      icon: BarChart3,
      hasSubMenu: true,
      subItems: [
        {
          name: t('expenseReport'),
          href: '/dashboard/reports/expense',
          icon: DollarSign,
        },
      ],
    },
    {
      name: t('settings'),
      href: '/dashboard/settings',
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success(t('loggedOutSuccessfully'));
    router.push('/auth/login');
  };

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => {
      // If the clicked menu is already open, close it
      if (prev[menuName]) {
        const newState = { ...prev };
        delete newState[menuName];
        return newState;
      }
      
      // If the clicked menu is closed, close all other menus and open this one
      const newState: Record<string, boolean> = {};
      newState[menuName] = true;
      return newState;
    });
  };

  const isMenuExpanded = (menuName: string) => {
    return expandedMenus[menuName] || false;
  };

  const isPathActive = (href: string, subItems?: Array<{ href: string }>) => {
    if (pathname === href) return true;
    if (subItems) {
      return subItems.some(subItem => pathname === subItem.href);
    }
    return false;
  };

  const Sidebar = ({ className }: { className?: string }) => (
    <div className={cn('flex h-full flex-col bg-white dark:bg-slate-900', className)}>
      {/* Compact Logo */}
      <div className="flex h-14 items-center border-b border-slate-200 dark:border-slate-700 px-5 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20">
        <div className="flex items-center gap-2">
          {profile?.companyLogoUrl ? (
            <img
              src={profile.companyLogoUrl}
              alt="Company Logo"
              className="w-7 h-7 rounded-lg object-cover bg-white shadow-sm"
            />
          ) : (
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-lg flex items-center justify-center shadow-sm">
              <Building className="h-4 w-4 text-white" />
            </div>
          )}
          <span className="font-bold text-base text-slate-800 dark:text-slate-100">{profile?.companyName}</span>
        </div>
      </div>

      {/* Compact Navigation */}
      <ScrollArea className="flex-1 px-2.5 py-3">
        <nav className="flex flex-col space-y-0.5">
          {navigation.map((item) => {
            const isActive = isPathActive(item.href, item.subItems);
            const hasSubMenu = item.hasSubMenu && item.subItems;
            const isExpanded = isMenuExpanded(item.name);

            return (
              <div key={item.name}>
                {/* Compact Main Menu Item */}
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'justify-start gap-2.5 h-9 w-full text-xs font-medium transition-all duration-200',
                    isActive 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-sm' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  )}
                  onClick={() => {
                    if (hasSubMenu) {
                      toggleMenu(item.name);
                    } else {
                      router.push(item.href);
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.name}</span>
                  {hasSubMenu && (
                    isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
                    )
                  )}
                </Button>

                {/* Compact Sub Menu Items */}
                {hasSubMenu && isExpanded && item.subItems && (
                  <div className="ml-3.5 mt-0.5 space-y-0.5 border-l border-slate-200 dark:border-slate-700 pl-2.5">
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Button
                          key={subItem.name}
                          variant={isSubActive ? 'default' : 'ghost'}
                          className={cn(
                            'justify-start gap-2 h-8 w-full text-xs transition-all duration-200',
                            isSubActive 
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-sm' 
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          )}
                          onClick={() => {
                            router.push(subItem.href);
                            setSidebarOpen(false);
                          }}
                        >
                          <subItem.icon className="h-3.5 w-3.5 flex-shrink-0" />
                          {subItem.name}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Compact User Section */}
      <div className="border-t border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2.5 mb-3">
          <Avatar className="h-8 w-8 ring-2 ring-emerald-500/20">
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white text-xs">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex-1 h-8 text-xs border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex-1 h-8 text-xs border-slate-300 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Compact Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col overflow-y-auto border-r border-slate-200 dark:border-slate-700 shadow-sm">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 border-slate-200 dark:border-slate-700">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Compact Top Header */}
        <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-3 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80 px-4 sm:gap-x-4 sm:px-6 lg:px-6 shadow-sm">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden h-8 w-8 p-0"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
          </Sheet>

          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:inline-flex text-[10px] px-2 py-0.5 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                {t('company')}: {profile?.companyName}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Bell className="h-4 w-4 text-slate-700 dark:text-slate-300" />
              </Button>
              
              {/* Compact Language Switcher */}
              <Select value={currentLocale} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[70px] h-7 text-xs border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en" className="text-xs">EN</SelectItem>
                  <SelectItem value="ur" className="text-xs">اردو</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2 ml-1">
                <Avatar className="h-7 w-7 ring-2 ring-emerald-500/20">
                  {profile?.profilePicUrl ? (
                    <img
                      src={profile.profilePicUrl}
                      alt={`${user?.firstName} ${user?.lastName}`}
                      className="object-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white text-[10px]">
                      {profile?.firstName?.[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{profile?.firstName} {profile?.lastName}</p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">{profile?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900">
          <div className="p-4 sm:p-5 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}