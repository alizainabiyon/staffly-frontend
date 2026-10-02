import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Profile, ProfileState, ProfileUpdateData, CompanyUpdateData, BackendApiResponse } from '../../types';
import { profileAPI } from '../../services/api';

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  companyUpdateLoading: false,
  companyUpdateError: null,
};

// Async thunks
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileAPI.get();
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to fetch profile');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: ProfileUpdateData, { rejectWithValue }) => {
    try {
      const response = await profileAPI.update(profileData);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to update profile');
      }
      
      return {
        data: response.response.data,
        message: response.response.message || 'Profile updated successfully'
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const updateCompany = createAsyncThunk(
  'profile/updateCompany',
  async (companyData: CompanyUpdateData, { rejectWithValue }) => {
    try {
      const response = await profileAPI.updateCompany(companyData);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to update company information');
      }
      
      return {
        data: response.response.data,
        message: response.response.message || 'Company information updated successfully'
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update company information');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
      state.companyUpdateError = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearCompanyUpdateError: (state) => {
      state.companyUpdateError = null;
    },
    setProfile: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload as Profile;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        const payload = action.payload as { data: Profile; message: string };
        if (payload.data) {
          state.profile = payload.data;
        }
        state.updateError = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      });

    // Update company
    builder
      .addCase(updateCompany.pending, (state) => {
        state.companyUpdateLoading = true;
        state.companyUpdateError = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.companyUpdateLoading = false;
        const payload = action.payload as { data: Profile; message: string };
        if (payload.data) {
          state.profile = payload.data;
        }
        state.companyUpdateError = null;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.companyUpdateLoading = false;
        state.companyUpdateError = action.payload as string;
      });
  },
});

export const { 
  clearError,
  clearUpdateError,
  clearCompanyUpdateError,
  setProfile
} = profileSlice.actions;

export default profileSlice.reducer;

// Selectors
export const selectProfile = (state: { profile: ProfileState }) => state.profile;
export const selectProfileData = (state: { profile: ProfileState }) => state.profile.profile;
export const selectProfileLoading = (state: { profile: ProfileState }) => state.profile.loading;
export const selectProfileError = (state: { profile: ProfileState }) => state.profile.error;export const selectProfileUpdateLoading = (state: { profile: ProfileState }) => state.profile.updateLoading;
export const selectProfileUpdateError = (state: { profile: ProfileState }) => state.profile.updateError;
export const selectCompanyUpdateLoading = (state: { profile: ProfileState }) => state.profile.companyUpdateLoading;
export const selectCompanyUpdateError = (state: { profile: ProfileState }) => state.profile.companyUpdateError;

