import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { directorAPI } from '@/lib/services/api';
import { Director, DirectorListResponse } from '@/lib/types/director';

interface DirectorState {
  directors: Director[];
  selectedDirector: Director | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: DirectorState = {
  directors: [],
  selectedDirector: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  },
};

// Async thunks
export const fetchDirectors = createAsyncThunk(
  'director/fetchDirectors',
  async (filters: any, thunkAPI) => {
    try {
      // Filter out empty values
      const apiFilters = { ...filters };
      if (!apiFilters.name) delete apiFilters.name;
      if (!apiFilters.email) delete apiFilters.email;
      if (!apiFilters.status) delete apiFilters.status;
      
      const response = await directorAPI.getAll(apiFilters);
      const result = response.response.data;
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch directors');
    }
  }
);

export const fetchDirectorById = createAsyncThunk(
  'director/fetchDirectorById',
  async (directorId: string, { rejectWithValue }) => {
    try {
      const response = await directorAPI.getById(directorId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Director not found');
      }
      
      // The response now includes both director and ledger data
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch director');
    }
  }
);

export const createDirector = createAsyncThunk(
  'director/createDirector',
  async (directorData: any, { rejectWithValue }) => {
    try {
      const response = await directorAPI.create(directorData);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to create director');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create director');
    }
  }
);

export const updateDirector = createAsyncThunk(
  'director/updateDirector',
  async (directorData: any, { rejectWithValue }) => {
    try {
      const response = await directorAPI.update(directorData);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to update director');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update director');
    }
  }
);

export const deleteDirector = createAsyncThunk(
  'director/deleteDirector',
  async (directorId: string, { rejectWithValue }) => {
    try {
      const response = await directorAPI.delete(directorId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to delete director');
      }
      
      return directorId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete director');
    }
  }
);

const directorSlice = createSlice({
  name: 'director',
  initialState,
  reducers: {
    setSelectedDirector: (state, action: PayloadAction<Director | null>) => {
      state.selectedDirector = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch directors
      .addCase(fetchDirectors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDirectors.fulfilled, (state, action) => {
        state.loading = false;
        state.directors = action.payload.directors || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 1,
        };
      })
      .addCase(fetchDirectors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch director by ID
      .addCase(fetchDirectorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDirectorById.fulfilled, (state, action) => {
        state.loading = false;
        // The response now includes both director and ledger data
        // We need to merge the director data with the ledger data
        const directorData = action.payload.director;
        const ledgerData = action.payload.ledger;
        const expenseData = action.payload.expense;
        
        if (directorData) {
          state.selectedDirector = {
            ...directorData,
            ledger: ledgerData,
            expense: expenseData
          };
        } else {
          state.selectedDirector = action.payload;
        }
      })
      .addCase(fetchDirectorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create director
      .addCase(createDirector.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDirector.fulfilled, (state, action) => {
        state.loading = false;
        state.directors.unshift(action.payload);
      })
      .addCase(createDirector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update director
      .addCase(updateDirector.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDirector.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.directors.findIndex(d => d.directorId === action.payload.directorId);
        if (index !== -1) {
          state.directors[index] = action.payload;
        }
        if (state.selectedDirector?.directorId === action.payload.directorId) {
          state.selectedDirector = action.payload;
        }
      })
      .addCase(updateDirector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete director
      .addCase(deleteDirector.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDirector.fulfilled, (state, action) => {
        state.loading = false;
        state.directors = state.directors.filter(d => d.directorId !== action.payload);
        if (state.selectedDirector?.directorId === action.payload) {
          state.selectedDirector = null;
        }
      })
      .addCase(deleteDirector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedDirector, clearError, setLoading } = directorSlice.actions;
export default directorSlice.reducer;
