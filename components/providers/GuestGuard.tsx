'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import { selectIsAuthenticated, selectAuthLoading, selectIsInitialized } from '@/lib/store/slices/authSlice';

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const isInitialized = useAppSelector(selectIsInitialized);

  useEffect(() => {
    // Only redirect if authentication check is complete and user is authenticated
    if (isInitialized && !loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, isInitialized, router]);

  // Show loading state while checking authentication or not yet initialized
  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render children if authenticated
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 