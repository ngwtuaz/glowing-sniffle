import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createSelector } from 'reselect';

export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async (token) => {
  const response = await axios.get('http://localhost:3000/admin/expenses', {
    headers: { 'x-access-token': token }
  });
  return response.data;
});

const expenseManagementSlice = createSlice({
  name: 'adminExpenses',
  initialState: {
    expenses: [],
    error: '',
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state) => {
        state.status = 'failed';
        state.error = 'Unable to load expense list';
      });
  },
});


const selectExpensesState = (state) => state.adminExpenses || { expenses: [], error: '', status: 'idle' };

export const selectExpenses = createSelector(
  [selectExpensesState],
  (state) => state.expenses
);

export const selectError = createSelector(
  [selectExpensesState],
  (state) => state.error
);

export const selectStatus = createSelector(
  [selectExpensesState],
  (state) => state.status
);

export default expenseManagementSlice.reducer;
