import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DailyEntry, CreateDailyEntryPayload, UpdateDailyEntryPayload, DailyEntryResponse, DailyEntryByIdResponse } from '@/lib/types/entries';
import { dailyEntryAPI } from '@/lib/services/api';

interface DailyEntryState {
  entries: DailyEntry[];
  selectedEntry: DailyEntry | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: DailyEntryState = {
  entries: [],
  selectedEntry: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

// Async thunks
export const fetchAllEntries = createAsyncThunk(
  'dailyEntry/fetchAllEntries',
  async (params: { status?: string }, thunkAPI) => {
    try {
      const response = await dailyEntryAPI.getAll(params);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to fetch entries');
      }
      
      return response.response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch entries');
    }
  }
);

export const fetchEntryById = createAsyncThunk(
  'dailyEntry/fetchEntryById',
  async (entryId: string, { rejectWithValue }) => {
    try {
      const response = await dailyEntryAPI.getById(entryId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Entry not found');
      }
      
      return response.response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch entry');
    }
  }
);

export const createEntry = createAsyncThunk(
  'dailyEntry/createEntry',
  async (entryData: CreateDailyEntryPayload, { rejectWithValue }) => {
    try {
      const response = await dailyEntryAPI.create(entryData);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to create entry');
      }
      
      // Return both the data and the success message
      return {
        data: response.response.data,
        message: response.response.message || 'Entry created successfully'
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create entry');
    }
  }
);

export const updateEntry = createAsyncThunk(
  'dailyEntry/updateEntry',
  async (entryData: UpdateDailyEntryPayload, { rejectWithValue }) => {
    try {
      const response = await dailyEntryAPI.update(entryData);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to update entry');
      }
      
      // Return both the data and the success message
      return {
        data: response.response.data,
        message: response.response.message || 'Entry updated successfully'
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update entry');
    }
  }
);

export const deleteEntry = createAsyncThunk(
  'dailyEntry/deleteEntry',
  async (entryId: string, { rejectWithValue }) => {
    try {
      const response = await dailyEntryAPI.delete(entryId);
      
      if (!response.status.success) {
        throw new Error(response.response.message || 'Failed to delete entry');
      }
      
      return entryId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete entry');
    }
  }
);

const dailyEntrySlice = createSlice({
  name: 'dailyEntry',
  initialState,
  reducers: {
    clearSelectedEntry: (state) => {
      state.selectedEntry = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action: PayloadAction<{ page: number; limit: number }>) => {
      state.pagination.page = action.payload.page;
      state.pagination.limit = action.payload.limit;
    },
  },
  extraReducers: (builder) => {
    // Fetch all entries
    builder
      .addCase(fetchAllEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload.entries || [];
        if (action.payload.pagination) {
          state.pagination = {
            page: action.payload.pagination.currentPage || action.payload.pagination.page || 1,
            limit: action.payload.pagination.limit || 10,
            total: action.payload.pagination.totalCount || action.payload.pagination.total || 0,
            pages: action.payload.pagination.totalPages || action.payload.pagination.pages || 0,
          };
        }
        state.error = null;
      })
      .addCase(fetchAllEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch entry by ID
    builder
      .addCase(fetchEntryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEntry = action.payload as DailyEntry;
        state.error = null;
      })
      .addCase(fetchEntryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create entry
    builder
      .addCase(createEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEntry.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the new response structure with data and message
        const payload = action.payload as { data: DailyEntry; message: string };
        if (payload.data) {
          state.entries.unshift(payload.data);
        }
        state.error = null;
      })
      .addCase(createEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update entry
    builder
      .addCase(updateEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEntry.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the new response structure with data and message
        const payload = action.payload as { data: DailyEntry; message: string };
        if (payload.data) {
          const index = state.entries.findIndex(entry => entry.entryId === payload.data.entryId);
          if (index !== -1) {
            state.entries[index] = payload.data;
          }
          if (state.selectedEntry?.entryId === payload.data.entryId) {
            state.selectedEntry = payload.data;
          }
        }
        state.error = null;
      })
      .addCase(updateEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete entry
    builder
      .addCase(deleteEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = state.entries.filter(entry => entry.entryId !== action.payload);
        if (state.selectedEntry?.entryId === action.payload) {
          state.selectedEntry = null;
        }
      })
      .addCase(deleteEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedEntry, clearError, setPagination } = dailyEntrySlice.actions;
export default dailyEntrySlice.reducer;
