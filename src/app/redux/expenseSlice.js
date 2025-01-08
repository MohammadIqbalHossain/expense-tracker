import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserId } from "../utils/storeUser"

export const API_BASE_URL = 'http://localhost:3001/api';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User ID not found!");
      }
      const response = await axios.get(`${API_BASE_URL}/expenses/?userId=${userId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch expenses');
    }
  }
);

export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User ID not found!");
      }

      const expenseDataWithId = {
        ...expenseData,
        userId: userId, 
        date: new Date().toISOString()
      };

      console.log('Sending expense data:', expenseDataWithId);

      const response = await axios.post(
        `${API_BASE_URL}/expenses`, 
        expenseDataWithId,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      console.log('Server response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding expense:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to add expense');
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addExpense.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase('deleteExpense/delete/fulfilled', (state, action) => {
        state.items = state.items.filter(expense => expense._id !== action.payload);
      });
  },
});

export default expenseSlice.reducer;