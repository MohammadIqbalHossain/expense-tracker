
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from './expenseSlice';


export const setSpendingLimits = createAsyncThunk(
  'limits/setSpendingLimits',
  async (limitData, { rejectWithValue }) => {
    try {
      // console.log('Current API URL:', API_BASE_URL);
      // console.log('Current Environment:', process.env.NODE_ENV);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        maxRedirects: 0,
      };

      // console.log('Making request with config:', config);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/limits`,
        limitData,
        config
      );

      console.log(response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
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