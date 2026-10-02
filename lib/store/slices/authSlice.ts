import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, BackendApiResponse, AuthResponse } from '../../types';
import { authAPI, apiClient } from '../../services/api';
import { LOCAL_STORAGE_KEYS } from '../../utils/constants';
import { setLocalStorage, getLocalStorage, removeLocalStorage, isTokenExpired, setAuthData, getAuthData, removeAuthData } from '../../utils/helpers';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  permissions: string[];
  isInitialized: boolean; // Add this new property
}

const initialState: AuthState = {
  user: getAuthData<User | null>(LOCAL_STORAGE_KEYS.USER_DATA, null),
  token: getAuthData<string | null>(LOCAL_STORAGE_KEYS.AUTH_TOKEN, null),
  isAuthenticated: false, // Start as false, will be set after validation
  loading: false,
  error: null,
  permissions: [],
  isInitialized: false, // Initialize as false
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      
      // Handle the actual backend response structure
    
        const backendResponse = response as unknown as BackendApiResponse<AuthResponse>;
        
        if (backendResponse.status && backendResponse.status.success && backendResponse.response && backendResponse.response.data) {
          const user = backendResponse.response.data as unknown as User;
          setAuthData(LOCAL_STORAGE_KEYS.USER_DATA, user);
          setAuthData(LOCAL_STORAGE_KEYS.AUTH_TOKEN, user.token);
          // Set token in API client
          apiClient.setAuthToken(user.token);
          return { user, token: user.token };
        }
        
        // If not successful, throw with the backend message
        throw new Error(
          backendResponse.response?.message || 
          'Login failed'
        );
      
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      if (response.status.success && response.response.data) {
        const user = response.response.data as unknown as User;
        setAuthData(LOCAL_STORAGE_KEYS.USER_DATA, user);
        setAuthData(LOCAL_STORAGE_KEYS.AUTH_TOKEN, user.token);
        return { user, token: user.token };
      }
      throw new Error(response.response.message || 'Registration failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Call logout API if needed
      // await authAPI.logout();
      
      // Clear auth data from both localStorage and sessionStorage
      removeAuthData(LOCAL_STORAGE_KEYS.USER_DATA);
      removeAuthData(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      // Remove token from API client
      apiClient.removeAuthToken();
      
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.refreshToken();
      if (response.status.success && response.response.data) {
        const { token } = response.response.data as { token: string };
        setLocalStorage(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);
        // Set token in API client
        apiClient.setAuthToken(token);
        return token;
      }
      throw new Error(response.response.message || 'Token refresh failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authAPI.forgotPassword(email);
      if (response.status.success) {
        return response.response.message || 'Password reset email sent';
      }
      throw new Error(response.response.message || 'Failed to send reset email');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send reset email');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }: { token: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.resetPassword(token, password);
      if (response.status.success) {
        return response.response.message || 'Password reset successful';
      }
      throw new Error(response.response.message || 'Password reset failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Password reset failed');
    }
  }
);

export const validateStoredToken = createAsyncThunk(
  'auth/validateStoredToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthData(LOCAL_STORAGE_KEYS.AUTH_TOKEN, null);
      const user = getAuthData(LOCAL_STORAGE_KEYS.USER_DATA, null);
      
      if (!token || !user) {
        throw new Error('No stored token or user data');
      }
      
      // Check if token is expired
      if (isTokenExpired(token)) {
        throw new Error('Token has expired');
      }
      
      // For now, just return the stored data without API validation
      // The API validation will happen on the first actual API call
      return { user, token };
    } catch (error: any) {
      // If token validation fails, clear auth data
      removeAuthData(LOCAL_STORAGE_KEYS.USER_DATA);
      removeAuthData(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      apiClient.removeAuthToken();
      return rejectWithValue(error.message || 'Token validation failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        setAuthData(LOCAL_STORAGE_KEYS.USER_DATA, state.user);
      }
    },
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
    },
    checkAuthStatus: (state) => {
      const token = getAuthData<string | null>(LOCAL_STORAGE_KEYS.AUTH_TOKEN, null);
      const user = getAuthData<User | null>(LOCAL_STORAGE_KEYS.USER_DATA, null);
      
      // Check if we have both token and user data
      if (token && user) {
        // Only check token expiration if token is a valid JWT format
        const isExpired = typeof token === 'string' && token.includes('.') ? isTokenExpired(token) : true;
        
        if (!isExpired) {
          state.token = token;
          state.user = user;
          state.isAuthenticated = true;
          state.permissions = user?.permissions || [];
          // Set token in API client
          apiClient.setAuthToken(token);
        } else {
          // Token is expired, clear auth data
          removeAuthData(LOCAL_STORAGE_KEYS.USER_DATA);
          removeAuthData(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
          state.permissions = [];
          // Remove token from API client
          apiClient.removeAuthToken();
        }
      } else {
        // No stored auth data, ensure clean state
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.permissions = [];
        // Remove token from API client
        apiClient.removeAuthToken();
      }
      
      // Mark as initialized after checking auth status
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user as User;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.permissions = action.payload.user?.permissions || [];
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.permissions = [];
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.permissions = action.payload.user?.permissions || [];
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.permissions = [];
        state.error = null;
        // Remove token from API client
        apiClient.removeAuthToken();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Refresh Token
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.permissions = [];
        removeAuthData(LOCAL_STORAGE_KEYS.USER_DATA);
        removeAuthData(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        // Remove token from API client
        apiClient.removeAuthToken();
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Validate Stored Token
    builder
      .addCase(validateStoredToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateStoredToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user as User;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.permissions = (action.payload.user as User)?.permissions || [];
        state.isInitialized = true;
        state.error = null;
        // Set token in API client
        apiClient.setAuthToken(action.payload.token);
      })
      .addCase(validateStoredToken.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.permissions = [];
        state.isInitialized = true;
        state.error = action.payload as string;
        // Remove token from API client
        apiClient.removeAuthToken();
      });
  },
});

export const { 
  clearError, 
  updateUser, 
  setPermissions, 
  checkAuthStatus 
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectPermissions = (state: { auth: AuthState }) => state.auth.permissions;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectIsInitialized = (state: { auth: AuthState }) => state.auth.isInitialized;

// Permission checker
export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  if (userPermissions.includes('*')) return true;
  return userPermissions.includes(requiredPermission);
};

// Role checker
export const hasRole = (user: User | null, requiredRole: string): boolean => {
  if (!user) return false;
  return user.role === requiredRole || user.role === 'admin';
};