import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from './expenseSlice';

const initialState = {
  status: 'idle',
  error: null,
  lastDeletedId: null,
}


export const deleteExpense = createAsyncThunk(
  'deleteExpense/delete',
  async (expenseId) => {

    try {
      await axios.delete(`${API_BASE_URL}/expenses/${expenseId}`);
      return expenseId;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete expense';
    }
  }
);

const deleteExpenseSlice = createSlice({
  name: 'deleteExpense',
  initialState,
  reducers: {
    resetDeleteStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteExpense.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastDeletedId = action.payload;
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { resetDeleteStatus } = deleteExpenseSlice.actions;
export default deleteExpenseSlice.reducer;