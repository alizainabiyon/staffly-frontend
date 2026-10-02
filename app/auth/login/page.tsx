'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppDispatch } from '@/lib/hooks';
import { loginUser } from '@/lib/store/slices/authSlice';
import { toast } from 'sonner';
import { Eye, EyeOff, Building, Moon, Sun } from 'lucide-react';
import { GuestGuard } from '@/components/providers/GuestGuard';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations('Auth.login');
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const loginSchema = Yup.object().shape({
    email: Yup.string().email(t('validation.emailInvalid')).required(t('validation.emailRequired')),
    password: Yup.string().min(6, t('validation.passwordMinLength')).required(t('validation.passwordRequired')),
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const result = await dispatch(loginUser({
        email: values.email,
        password: values.password
      })).unwrap();

      // If we reach here, login was successful
      toast.success(t('loginSuccess'));
      router.push('/dashboard');
    } catch (error: any) {
      // Show the specific error message from the backend
      toast.error(error.message || t('loginFailed'));
    }
  };

  return (
    <GuestGuard>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-900">
          {/* Animated Circles */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300/30 dark:bg-emerald-500/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-300/30 dark:bg-teal-500/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-200/30 dark:bg-emerald-600/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-slate-100/50 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]"></div>
        </div>

        {/* Theme Toggle Button */}
        <div className="absolute top-4 right-4 z-50">
          {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 shadow-lg"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </Button>
          )}
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Logo and Title */}
            <div className="text-center mb-8 space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 text-white rounded-3xl shadow-2xl shadow-emerald-500/30 dark:shadow-emerald-600/20 mb-4 ring-4 ring-emerald-100 dark:ring-emerald-900/30 transform hover:scale-105 transition-transform duration-200">
                <Building className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Staffly
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm font-medium">
                  {t('description')}
                </p>
              </div>
            </div>

            {/* Login Card */}
            <Card className="shadow-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
              <CardHeader className="text-center pb-4 space-y-2">
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {t('title')}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {t('subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
              <Formik
                initialValues={{ email: 'admin@staffly.com', password: 'password123' }}
                validationSchema={loginSchema}
                onSubmit={handleLogin}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-5">
                    <div className="space-y-2">
                      <Label 
                        htmlFor="email" 
                        className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                      >
                        {t('emailLabel')}
                      </Label>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        className={`h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500/20 ${errors.email && touched.email ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500' : ''}`}
                      />
                      {errors.email && touched.email && (
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label 
                        htmlFor="password" 
                        className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                      >
                        {t('passwordLabel')}
                      </Label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder={t('passwordPlaceholder')}
                          className={`h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500/20 pr-11 ${errors.password && touched.password ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500' : ''}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.password && touched.password && (
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">{errors.password}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-600 dark:hover:to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/30 dark:shadow-emerald-600/20 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/40 dark:hover:shadow-emerald-600/30 disabled:opacity-50 disabled:cursor-not-allowed" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {t('signingIn')}
                        </span>
                      ) : (
                        t('signIn')
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
              
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              © 2025 Staffly. All rights reserved.
            </p>
          </div>
        </div>
        </div>
      </div>
    </GuestGuard>
  );
}