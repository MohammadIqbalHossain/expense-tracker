
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from './expenseSlice';

export const setSpendingLimits = createAsyncThunk(
  'limits/setSpendingLimits',
  async (limitData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, 
        withCredentials: true
      };

      const response = await axios.post(
        `${API_BASE_URL}/limits`, 
        limitData,
        config
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const limitSlice = createSlice({
  name: 'limits',
  initialState: {
    monthlyTotal: 0,
    categories: {
      Groceries: 0,
      Transportation: 0,
      Healthcare: 0,
      Utility: 0,
      Charity: 0,
      Miscellaneous: 0,
    },
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setSpendingLimits.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(setSpendingLimits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.monthlyTotal = action.payload.monthlyTotal;
        state.categories = action.payload.categories;
        state.error = null;
      })
      .addCase(setSpendingLimits.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred';
      });
  },
});

export default limitSlice.reducer;