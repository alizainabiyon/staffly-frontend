'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { checkAuthStatus, selectToken, selectIsInitialized, selectIsAuthenticated } from '@/lib/store/slices/authSlice';
import { apiClient } from '@/lib/services/api';
import { getAuthData, cleanupInvalidAuthData } from '@/lib/utils/helpers';
import { LOCAL_STORAGE_KEYS } from '@/lib/utils/constants';

export function AuthInitializer() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const isInitialized = useAppSelector(selectIsInitialized);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    // Clean up any invalid auth data first
    cleanupInvalidAuthData();
    
    // Check authentication status from localStorage on app initialization
    // Only do this once when the component mounts
    if (!isInitialized) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    // Set token in API client whenever token changes
    if (token) {
      apiClient.setAuthToken(token);
    } else {
      apiClient.removeAuthToken();
    }
  }, [token]);

  // Also set token on initial load from localStorage as a fallback
  // This ensures the API client has the token even before Redux is fully initialized
  useEffect(() => {
    const storedToken = getAuthData<string | null>(LOCAL_STORAGE_KEYS.AUTH_TOKEN, null);
    if (storedToken && typeof storedToken === 'string' && !token) {
      apiClient.setAuthToken(storedToken);
    }
  }, [token]); // Run when token changes

  return null; // This component doesn't render anything
} 