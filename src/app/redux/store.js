import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from './expenseSlice';
import limitReducer from './limitSlice';
import  deleteExpenseReduucer  from './expenseDeleteSlice';

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    limits: limitReducer,
    deleteExpense: deleteExpenseReduucer,
  },
});