'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import { selectIsAuthenticated, selectAuthLoading, selectIsInitialized } from '@/lib/store/slices/authSlice';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const isInitialized = useAppSelector(selectIsInitialized);

  useEffect(() => {
    // Only redirect if authentication check is complete and user is not authenticated
    // Wait for both initialization and loading to be complete
    if (isInitialized && !loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, isInitialized, router]);

  // Show loading state while checking authentication or not yet initialized
  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 